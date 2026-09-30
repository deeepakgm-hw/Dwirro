import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider } from '../context/AuthContext';
import { SystemProvider } from '../context/SystemContext';
import { CallsPage } from '../pages/CallsPage';

const renderCalls = () =>
  render(
    <AuthProvider initialAuthenticated={true}>
      <SystemProvider>
        <CallsPage />
      </SystemProvider>
    </AuthProvider>
  );

describe('PHASE 8: Calls and Messaging', () => {
  it('Call log entry shows caller, summary and assistant announced indicator', () => {
    renderCalls();
    expect(screen.getAllByTestId('call-log-card').length).toBeGreaterThan(0);
    expect(screen.getAllByTestId('assistant-announced-indicator').length).toBeGreaterThan(0);
  });

  it('Recording is only accessible when consent is granted; missing consent hides player', () => {
    renderCalls();
    expect(screen.getByTestId('recording-player')).toBeInTheDocument();
    expect(screen.getByText(/Recording hidden \(No recording consent\)/i)).toBeInTheDocument();
  });

  it('Message drafts are draft-only with no automatic send on behalf button', () => {
    renderCalls();
    expect(screen.getAllByText(/Suggested Draft \(You Send Personally\)/i).length).toBeGreaterThan(0);
    expect(screen.queryByText(/Send on my behalf/i)).not.toBeInTheDocument();
  });
});
