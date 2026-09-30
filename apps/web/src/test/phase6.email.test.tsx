import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider } from '../context/AuthContext';
import { SystemProvider } from '../context/SystemContext';
import { EmailPage } from '../pages/EmailPage';

const renderEmail = () =>
  render(
    <AuthProvider initialAuthenticated={true}>
      <SystemProvider>
        <EmailPage />
      </SystemProvider>
    </AuthProvider>
  );

describe('PHASE 6: Email Intelligence', () => {
  it('Suspicious mail shows prominent warning alert and displays security rationale', () => {
    renderEmail();
    expect(screen.getByTestId('badge-suspicious')).toBeInTheDocument();
    expect(screen.getByText(/AI Security & Authenticity Report/i)).toBeInTheDocument();
  });

  it('Outbound reply requires explicit user approval and supports undo delay', async () => {
    const user = userEvent.setup();
    renderEmail();

    const approveBtn = screen.getByTestId('approve-email-send-btn');
    expect(approveBtn).toBeInTheDocument();

    await user.click(approveBtn);

    // Undo button appears during delay window
    expect(await screen.findByTestId('undo-email-btn')).toBeInTheDocument();

    // Click undo
    await user.click(screen.getByTestId('undo-email-btn'));

    // Reverts to editable draft
    expect(screen.queryByTestId('undo-email-btn')).not.toBeInTheDocument();
    expect(screen.getByTestId('email-reply-textarea')).toBeInTheDocument();
  });
});
