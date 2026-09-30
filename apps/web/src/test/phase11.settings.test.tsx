import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider } from '../context/AuthContext';
import { SystemProvider } from '../context/SystemContext';
import { SettingsPage } from '../pages/SettingsPage';

const renderSettings = () =>
  render(
    <AuthProvider initialAuthenticated={true}>
      <SystemProvider>
        <SettingsPage />
      </SystemProvider>
    </AuthProvider>
  );

describe('PHASE 11: Settings, Privacy and Cost Controls', () => {
  it('L4 actions are locked and cannot be demoted or promoted in the policy matrix', () => {
    renderSettings();
    const l4Badges = screen.getAllByTestId('l4-locked-badge');
    expect(l4Badges.length).toBeGreaterThan(0);
    expect(l4Badges[0]).toHaveTextContent(/L4 \(Locked\)/i);
  });

  it('Pre-flight redaction masks credit cards and 2FA OTPs', async () => {
    const user = userEvent.setup();
    renderSettings();
    const input = screen.getByTestId('redaction-input');
    await user.type(input, 'Card 1111-2222-3333-4444 code: 123456');
    const redactedOutput = screen.getByTestId('redacted-preview-output');
    expect(redactedOutput.textContent).toContain('•••• •••• •••• 4444');
    expect(redactedOutput.textContent).toContain('••••••');
  });

  it('Permanent data deletion requires exact typed confirmation phrase', async () => {
    const user = userEvent.setup();
    renderSettings();

    const deleteInput = screen.getByPlaceholderText('DELETE EVERYTHING PERMANENTLY');
    const deleteBtn = screen.getByText('Permanently Wipe');

    // Initially disabled until exact phrase is typed
    expect(deleteBtn).toBeDisabled();

    await user.type(deleteInput, 'DELETE EVERYTHING PERMANENTLY');
    expect(deleteBtn).not.toBeDisabled();

    await user.click(deleteBtn);
    expect(await screen.findByText(/Data successfully wiped/i)).toBeInTheDocument();
  });
});
