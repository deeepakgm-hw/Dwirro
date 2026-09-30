import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { UserSession } from '@aip/shared-types';

interface AuthContextType {
  session: UserSession;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  verifyTwoFactor: (code: string) => Promise<{ success: boolean; error?: string }>;
  loginWithOAuth: (provider: 'google' | 'microsoft') => Promise<void>;
  lockSession: () => void;
  unlockSession: (password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  setIdleTimeoutSeconds: (seconds: number) => void;
  resetLockout: () => void;
}

const INITIAL_SESSION: UserSession = {
  userId: 'user-001',
  email: 'user@dwirro.ai',
  name: 'Alex Mercer',
  isAuthenticated: false,
  requiresTwoFactor: false,
  isLocked: false,
  twoFactorAttempts: 0,
  lockoutUntil: null,
  lastActiveTimestamp: Date.now(),
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode; initialAuthenticated?: boolean }> = ({
  children,
  initialAuthenticated = false,
}) => {
  const [session, setSession] = useState<UserSession>(() => ({
    ...INITIAL_SESSION,
    isAuthenticated: initialAuthenticated,
  }));

  const [idleTimeoutSeconds, setIdleTimeoutSeconds] = useState<number>(900); // 15 mins default

  // Update activity timestamp on user interaction
  const recordActivity = useCallback(() => {
    setSession((prev: UserSession) => {
      if (!prev.isAuthenticated || prev.isLocked) return prev;
      return { ...prev, lastActiveTimestamp: Date.now() };
    });
  }, []);

  useEffect(() => {
    const handleActivity = () => recordActivity();
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('click', handleActivity);

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('click', handleActivity);
    };
  }, [recordActivity]);

  // Idle timeout monitor
  useEffect(() => {
    if (!session.isAuthenticated || session.isLocked) return;

    const interval = setInterval(() => {
      const elapsedSeconds = (Date.now() - session.lastActiveTimestamp) / 1000;
      if (elapsedSeconds >= idleTimeoutSeconds) {
        setSession((prev: UserSession) => ({ ...prev, isLocked: true }));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [session.isAuthenticated, session.isLocked, session.lastActiveTimestamp, idleTimeoutSeconds]);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Check if locked out
    if (session.lockoutUntil && Date.now() < session.lockoutUntil) {
      const secondsLeft = Math.ceil((session.lockoutUntil - Date.now()) / 1000);
      return {
        success: false,
        error: `Temporary lockout active. Try again in ${secondsLeft} seconds.`,
      };
    }

    // Mock validation: does not reveal which field was wrong
    if (email.trim().toLowerCase() === 'user@dwirro.ai' && password === 'CorrectPassword123!') {
      setSession((prev: UserSession) => ({
        ...prev,
        email: email.trim().toLowerCase(),
        requiresTwoFactor: true,
        twoFactorAttempts: 0,
        lastActiveTimestamp: Date.now(),
      }));
      return { success: true };
    }

    return {
      success: false,
      error: 'Invalid email or password. Please try again.',
    };
  };

  const verifyTwoFactor = async (code: string): Promise<{ success: boolean; error?: string }> => {
    if (session.lockoutUntil && Date.now() < session.lockoutUntil) {
      const secondsLeft = Math.ceil((session.lockoutUntil - Date.now()) / 1000);
      return {
        success: false,
        error: `Account locked due to multiple failed attempts. Try again in ${secondsLeft}s.`,
      };
    }

    if (code.trim() === '123456') {
      setSession((prev: UserSession) => ({
        ...prev,
        isAuthenticated: true,
        requiresTwoFactor: false,
        twoFactorAttempts: 0,
        lockoutUntil: null,
        lastActiveTimestamp: Date.now(),
      }));
      return { success: true };
    }

    const newAttempts = session.twoFactorAttempts + 1;
    if (newAttempts >= 3) {
      const lockoutTime = Date.now() + 60000; // 1 min lockout
      setSession((prev: UserSession) => ({
        ...prev,
        twoFactorAttempts: newAttempts,
        lockoutUntil: lockoutTime,
      }));
      return {
        success: false,
        error: 'Too many failed 2FA attempts. Temporary lockout active for 60 seconds.',
      };
    }

    setSession((prev: UserSession) => ({
      ...prev,
      twoFactorAttempts: newAttempts,
    }));
    return {
      success: false,
      error: `Invalid verification code. ${3 - newAttempts} attempt(s) remaining.`,
    };
  };

  const loginWithOAuth = async (provider: 'google' | 'microsoft'): Promise<void> => {
    // Mock OAuth flow
    setSession({
      ...INITIAL_SESSION,
      email: `user@${provider}.dwirro.ai`,
      name: `User (${provider.toUpperCase()})`,
      isAuthenticated: true,
      requiresTwoFactor: false,
      lastActiveTimestamp: Date.now(),
    });
  };

  const lockSession = () => {
    setSession((prev: UserSession) => ({ ...prev, isLocked: true }));
  };

  const unlockSession = async (password: string): Promise<{ success: boolean; error?: string }> => {
    if (password === 'CorrectPassword123!') {
      setSession((prev: UserSession) => ({
        ...prev,
        isLocked: false,
        lastActiveTimestamp: Date.now(),
      }));
      return { success: true };
    }
    return { success: false, error: 'Incorrect password' };
  };

  const logout = () => {
    setSession({ ...INITIAL_SESSION });
  };

  const resetLockout = () => {
    setSession((prev: UserSession) => ({ ...prev, twoFactorAttempts: 0, lockoutUntil: null }));
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        login,
        verifyTwoFactor,
        loginWithOAuth,
        lockSession,
        unlockSession,
        logout,
        setIdleTimeoutSeconds,
        resetLockout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
