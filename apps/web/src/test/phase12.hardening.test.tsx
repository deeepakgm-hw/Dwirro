import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from '../App';
import { PolicyEngine } from '@aip/policy-engine';

describe('PHASE 12: Hardening & End-to-End Regression Verification', () => {
  it('Policy Engine verifies every action has a level, and L4 cannot run autonomously', () => {
    const engine = new PolicyEngine();
    const actions = engine.getAllActions();

    expect(actions.length).toBeGreaterThan(0);
    actions.forEach((act) => {
      expect(['L0', 'L1', 'L2', 'L3', 'L4']).toContain(act.currentLevel);
      if (act.defaultLevel === 'L4') {
        expect(engine.isExecutionBlocked(act.id)).toBe(true);
      }
    });
  });

  it('Full E2E user flow: Login -> 2FA -> Chat -> Tab Navigation -> Kill Switch pause', async () => {
    const user = userEvent.setup();
    render(<App />);

    // 1. Initial view is Login
    expect(screen.getByTestId('login-email-input')).toBeInTheDocument();

    // 2. Sign In
    await user.type(screen.getByTestId('login-email-input'), 'user@dwirro.ai');
    await user.type(screen.getByTestId('login-password-input'), 'CorrectPassword123!');
    await user.click(screen.getByTestId('login-submit-btn'));
    const codeInput = await screen.findByTestId('2fa-code-input');
    await user.type(codeInput, '123456');
    await user.click(screen.getByTestId('2fa-submit-btn'));

    // 3. User lands on Chat Page
    expect(await screen.findByTestId('chat-input')).toBeInTheDocument();

    // 4. Switch tab to Today & Plan
    const todayTab = screen.getByTestId('nav-tab-today');
    await user.click(todayTab);
    expect(await screen.findByText(/Executive Morning Briefing/i)).toBeInTheDocument();

    // 5. Switch tab to Email Intel
    const emailTab = screen.getByTestId('nav-tab-email');
    await user.click(emailTab);
    expect(await screen.findByText(/Email Intelligence Hub/i)).toBeInTheDocument();

    // 6. Activate Kill Switch from Header
    const killBtn = screen.getByTestId('kill-switch-btn');
    await user.click(killBtn);
    const confirmBtn = await screen.findByTestId('confirm-kill-switch-btn');
    await user.click(confirmBtn);

    // 7. Verify global PAUSED banner is active
    expect(await screen.findByTestId('paused-banner')).toBeInTheDocument();
  });
});
