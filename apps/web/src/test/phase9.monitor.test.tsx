import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider } from '../context/AuthContext';
import { SystemProvider } from '../context/SystemContext';
import { MonitorPage } from '../pages/MonitorPage';

const renderMonitor = () =>
  render(
    <AuthProvider initialAuthenticated={true}>
      <SystemProvider>
        <MonitorPage />
      </SystemProvider>
    </AuthProvider>
  );

describe('PHASE 9: AI-Tool Monitor', () => {
  it('Activity feed renders tool, status and summary in read-only mode', () => {
    renderMonitor();
    expect(screen.getByText(/Strictly Read-Only Monitor/i)).toBeInTheDocument();
    expect(screen.getAllByTestId('monitor-row').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Email Tone Synthesizer').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Codebase Conflict Auditor').length).toBeGreaterThan(0);
  });

  it('Filtering by model provider updates the visible rows', async () => {
    const user = userEvent.setup();
    renderMonitor();

    const providerSelect = screen.getByTestId('filter-provider');
    await user.selectOptions(providerSelect, 'Antigravity');

    const rows = screen.getAllByTestId('monitor-row');
    expect(rows.length).toBe(1);
    expect(screen.getAllByText('Antigravity').length).toBeGreaterThan(0);
  });
});
