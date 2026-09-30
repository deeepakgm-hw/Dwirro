import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider } from '../context/AuthContext';
import { SystemProvider } from '../context/SystemContext';
import { TodayPage } from '../pages/TodayPage';

const renderToday = () =>
  render(
    <AuthProvider initialAuthenticated={true}>
      <SystemProvider>
        <TodayPage />
      </SystemProvider>
    </AuthProvider>
  );

describe('PHASE 5: Today, Evening Plan and Morning Briefing', () => {
  it('Timeline highlights overlapping events visibly with CONFLICT badge', () => {
    renderToday();
    const conflictBadges = screen.getAllByTestId('conflict-badge');
    expect(conflictBadges.length).toBeGreaterThan(0);
    expect(conflictBadges[0]).toHaveTextContent(/CONFLICT/i);
  });

  it('Reminders reject past times with a clear validation error', async () => {
    const user = userEvent.setup();
    renderToday();

    const titleInput = screen.getByTestId('reminder-title-input');
    const timeInput = screen.getByTestId('reminder-time-input');
    const setBtn = screen.getByTestId('set-reminder-btn');

    await user.type(titleInput, 'Past reminder test');
    // Set a past time e.g. 2020-01-01
    await user.type(timeInput, '2020-01-01T12:00');
    await user.click(setBtn);

    expect(await screen.findByTestId('reminder-error')).toHaveTextContent(/Cannot set reminders for past times/i);
  });

  it("Tomorrow's plan modal accepts and locks in schedule on master approval", async () => {
    const user = userEvent.setup();
    renderToday();

    const openPlanBtn = screen.getByTestId('open-evening-plan-btn');
    await user.click(openPlanBtn);

    expect(screen.getByText(/Tomorrow's Proposed Plan/i)).toBeInTheDocument();

    const approvePlanBtn = screen.getByTestId('approve-plan-master-btn');
    await user.click(approvePlanBtn);

    // Modal closes and plan is approved
    expect(screen.queryByText(/Tomorrow's Proposed Plan/i)).not.toBeInTheDocument();
  });
});
