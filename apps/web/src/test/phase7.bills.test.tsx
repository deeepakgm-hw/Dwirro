import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider } from '../context/AuthContext';
import { SystemProvider } from '../context/SystemContext';
import { BillsPage } from '../pages/BillsPage';

const renderBills = () =>
  render(
    <AuthProvider initialAuthenticated={true}>
      <SystemProvider>
        <BillsPage />
      </SystemProvider>
    </AuthProvider>
  );

describe('PHASE 7: Bills, Deadlines and Escalations', () => {
  it('Bills list highlights due-today and overdue items, with masked account numbers', () => {
    renderBills();
    expect(screen.getByText(/DUE TODAY/i)).toBeInTheDocument();
    expect(screen.getByText(/OVERDUE/i)).toBeInTheDocument();
    expect(screen.getAllByText(/•••• •••• ••••/i).length).toBeGreaterThan(0);
  });

  it('Duplicate bill entry triggers conflict detection alert', async () => {
    const user = userEvent.setup();
    renderBills();

    const payeeInput = screen.getByTestId('bill-payee-input');
    const amountInput = screen.getByTestId('bill-amount-input');
    const dateInput = screen.getByTestId('bill-due-date-input');
    const submitBtn = screen.getByTestId('submit-bill-btn');

    // Add duplicate of AWS bill (which has dueDate today)
    await user.type(payeeInput, 'AWS Cloud Hosting');
    await user.type(amountInput, '240.00');
    const todayStr = new Date().toISOString().split('T')[0];
    await user.type(dateInput, todayStr);
    await user.click(submitBtn);

    const conflictBadges = await screen.findAllByTestId('bill-conflict-badge');
    expect(conflictBadges.length).toBeGreaterThanOrEqual(1);
    expect(conflictBadges[0]).toHaveTextContent(/CONFLICT: DUPLICATE/i);
  });

  it('Provides manual portal payment link and prohibits automated fund transfers', () => {
    renderBills();
    expect(screen.getByText(/Policy: Payments are strictly manual/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Pay Yourself/i).length).toBeGreaterThan(0);
  });
});
