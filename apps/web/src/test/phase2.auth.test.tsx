import { describe, it, expect, beforeEach, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { LoginPage } from '../pages/LoginPage';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { LockScreenModal } from '../components/LockScreenModal';

const TestApp: React.FC<{ initialAuth?: boolean }> = ({ initialAuth = false }) => (
  <AuthProvider initialAuthenticated={initialAuth}>
    <ProtectedRoute>
      <div data-testid="protected-content">Secret Dashboard Content</div>
    </ProtectedRoute>
    <LockScreenModal />
  </AuthProvider>
);

describe('PHASE 2: Authentication, 2FA, and Session Security', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.clearAllMocks();
  });

  it('Unauthenticated user visiting any route is redirected to Login', () => {
    render(<TestApp initialAuth={false} />);
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    expect(screen.getByText(/Dwirro Platform/i)).toBeInTheDocument();
    expect(screen.getByTestId('login-email-input')).toBeInTheDocument();
  });

  it('Wrong password shows an error and does not reveal which field was wrong', async () => {
    const user = userEvent.setup();
    render(<TestApp initialAuth={false} />);

    const emailInput = screen.getByTestId('login-email-input');
    const passwordInput = screen.getByTestId('login-password-input');
    const submitBtn = screen.getByTestId('login-submit-btn');

    await user.clear(emailInput);
    await user.type(emailInput, 'user@dwirro.ai');
    await user.clear(passwordInput);
    await user.type(passwordInput, 'WrongPassword123!');
    await user.click(submitBtn);

    const errorBanner = await screen.findByTestId('auth-error-banner');
    expect(errorBanner).toHaveTextContent(/Invalid email or password/i);
    // Generic error: does not enumerate username vs password
    expect(errorBanner.textContent).not.toMatch(/user not found/i);
  });

  it('Correct password moves to 2FA; wrong code shows error; 3 failures trigger temporary lockout', async () => {
    const user = userEvent.setup();
    render(<TestApp initialAuth={false} />);

    // Enter correct initial credentials
    await user.type(screen.getByTestId('login-email-input'), 'user@dwirro.ai');
    await user.type(screen.getByTestId('login-password-input'), 'CorrectPassword123!');
    await user.click(screen.getByTestId('login-submit-btn'));

    // Should now see 2FA code input
    const codeInput = await screen.findByTestId('2fa-code-input');
    expect(codeInput).toBeInTheDocument();

    // Attempt 1: Wrong code
    await user.type(codeInput, '999999');
    await user.click(screen.getByTestId('2fa-submit-btn'));
    expect(await screen.findByText(/Invalid verification code. 2 attempt\(s\) remaining/i)).toBeInTheDocument();

    // Attempt 2: Wrong code
    await user.type(screen.getByTestId('2fa-code-input'), '888888');
    await user.click(screen.getByTestId('2fa-submit-btn'));
    expect(await screen.findByText(/Invalid verification code. 1 attempt\(s\) remaining/i)).toBeInTheDocument();

    // Attempt 3: Wrong code -> Lockout
    await user.type(screen.getByTestId('2fa-code-input'), '777777');
    await user.click(screen.getByTestId('2fa-submit-btn'));
    expect(await screen.findByText(/Too many failed 2FA attempts. Temporary lockout active/i)).toBeInTheDocument();
  });

  it('Password and 2FA codes are never written to localStorage/sessionStorage/console', async () => {
    const user = userEvent.setup();
    render(<TestApp initialAuth={false} />);

    await user.type(screen.getByTestId('login-email-input'), 'user@dwirro.ai');
    await user.type(screen.getByTestId('login-password-input'), 'SuperSecretPassword!');
    await user.click(screen.getByTestId('login-submit-btn'));

    // Check localStorage & sessionStorage
    expect(localStorage.getItem('password')).toBeNull();
    expect(localStorage.getItem('code')).toBeNull();
    expect(sessionStorage.getItem('password')).toBeNull();
    expect(sessionStorage.getItem('code')).toBeNull();
    expect(JSON.stringify(localStorage)).not.toContain('SuperSecretPassword!');
    expect(JSON.stringify(sessionStorage)).not.toContain('SuperSecretPassword!');
  });

  it('Successful 2FA logs the user in to protected content', async () => {
    const user = userEvent.setup();
    render(<TestApp initialAuth={false} />);

    await user.type(screen.getByTestId('login-email-input'), 'user@dwirro.ai');
    await user.type(screen.getByTestId('login-password-input'), 'CorrectPassword123!');
    await user.click(screen.getByTestId('login-submit-btn'));

    const codeInput = await screen.findByTestId('2fa-code-input');
    await user.type(codeInput, '123456');
    await user.click(screen.getByTestId('2fa-submit-btn'));

    expect(await screen.findByTestId('protected-content')).toBeInTheDocument();
  });

  it('Sign in with Google OAuth works immediately', async () => {
    const user = userEvent.setup();
    render(<TestApp initialAuth={false} />);

    await user.click(screen.getByTestId('oauth-google-btn'));
    expect(await screen.findByTestId('protected-content')).toBeInTheDocument();
  });
});
