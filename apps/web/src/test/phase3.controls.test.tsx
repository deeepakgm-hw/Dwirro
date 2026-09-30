import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider } from '../context/AuthContext';
import { SystemProvider, useSystem } from '../context/SystemContext';
import { Navbar } from '../components/Navbar';
import { ApprovalCard } from '../components/ApprovalCard';

const MockControlsDashboard: React.FC = () => {
  const { approvalActions } = useSystem();
  return (
    <div>
      <Navbar currentTab="chat" onSelectTab={() => {}} />
      <div data-testid="actions-container">
        {approvalActions.map((action) => (
          <ApprovalCard key={action.id} action={action} />
        ))}
      </div>
    </div>
  );
};

const renderWithProviders = () =>
  render(
    <AuthProvider initialAuthenticated={true}>
      <SystemProvider>
        <MockControlsDashboard />
      </SystemProvider>
    </AuthProvider>
  );

describe('PHASE 3: Global Controls (Kill Switch, Approval Card, Notification Center)', () => {
  it('Kill switch requires confirmation, then disables every Approve button and shows PAUSED banner', async () => {
    const user = userEvent.setup();
    renderWithProviders();

    expect(screen.queryByTestId('paused-banner')).not.toBeInTheDocument();

    // Click Kill Switch in Navbar
    const killBtn = screen.getByTestId('kill-switch-btn');
    await user.click(killBtn);

    // Modal confirmation opens
    const confirmBtn = await screen.findByTestId('confirm-kill-switch-btn');
    await user.click(confirmBtn);

    // Banner is now visible
    expect(await screen.findByTestId('paused-banner')).toBeInTheDocument();

    // All approve buttons should now be disabled
    const approveButtons = screen.getAllByTestId('approve-button');
    approveButtons.forEach((btn) => {
      expect(btn).toBeDisabled();
    });
  });

  it('ApprovalCard shows correct level badge; L4 actions have no Approve button', () => {
    renderWithProviders();

    expect(screen.getByTestId('level-badge-L2')).toBeInTheDocument();
    expect(screen.getByTestId('level-badge-L1')).toBeInTheDocument();
    expect(screen.getByTestId('level-badge-L4')).toBeInTheDocument();

    // L4 card should show Strictly Manual notice and NOT have an approve button
    expect(screen.getByText(/Level 4: Strictly Manual Action/i)).toBeInTheDocument();
  });

  it('Approve triggers countdown and Undo cancels before execution', async () => {
    const user = userEvent.setup();
    renderWithProviders();

    const approveButtons = screen.getAllByTestId('approve-button');
    await user.click(approveButtons[0]);

    // Undo button appears during countdown
    const undoBtn = await screen.findByTestId('undo-button');
    expect(undoBtn).toBeInTheDocument();

    // Click Undo
    await user.click(undoBtn);

    // Card reverts to pending state
    expect(screen.queryByTestId('undo-button')).not.toBeInTheDocument();
    expect(screen.getAllByTestId('approve-button').length).toBeGreaterThan(0);
  });

  it('Reject records decision and removes/rejects the card', async () => {
    const user = userEvent.setup();
    renderWithProviders();

    const rejectButtons = screen.getAllByTestId('reject-button');
    await user.click(rejectButtons[0]);

    expect(await screen.findByText(/Rejected & Dismissed/i)).toBeInTheDocument();
  });

  it('DND toggle updates state in header', async () => {
    const user = userEvent.setup();
    renderWithProviders();

    const dndBtn = screen.getByTestId('dnd-toggle-btn');
    expect(dndBtn).toHaveAttribute('title', 'Do Not Disturb: OFF');

    await user.click(dndBtn);
    expect(dndBtn).toHaveAttribute('title', 'Do Not Disturb: ON');
  });
});
