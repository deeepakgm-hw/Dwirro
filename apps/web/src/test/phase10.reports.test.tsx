import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { AuthProvider } from '../context/AuthContext';
import { SystemProvider } from '../context/SystemContext';
import { ReportsPage } from '../pages/ReportsPage';
import { sanitizeCsvField } from '@aip/security';

const renderReports = () =>
  render(
    <AuthProvider initialAuthenticated={true}>
      <SystemProvider>
        <ReportsPage />
      </SystemProvider>
    </AuthProvider>
  );

describe('PHASE 10: Nightly Report and Append-Only Audit Log', () => {
  it('All 8 report sections render with corresponding metrics', () => {
    renderReports();
    expect(screen.getByTestId('report-section-completed')).toBeInTheDocument();
    expect(screen.getByTestId('report-section-pending')).toBeInTheDocument();
    expect(screen.getByTestId('report-section-mails')).toBeInTheDocument();
    expect(screen.getByTestId('report-section-calls')).toBeInTheDocument();
    expect(screen.getByTestId('report-section-reminders')).toBeInTheDocument();
    expect(screen.getByTestId('report-section-blocked')).toBeInTheDocument();
    expect(screen.getByTestId('report-section-suspicious')).toBeInTheDocument();
    expect(screen.getByTestId('report-section-plan')).toBeInTheDocument();
  });

  it('Audit log table is append-only with no edit or delete controls', () => {
    renderReports();
    expect(screen.getAllByTestId('audit-row').length).toBeGreaterThan(0);
    expect(screen.queryByText(/Edit/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Delete/i)).not.toBeInTheDocument();
  });

  it('CSV export function sanitizes potential formula injection symbols', () => {
    const maliciousFormula = '=SUM(A1:A10)';
    const sanitized = sanitizeCsvField(maliciousFormula);
    // Must prefix with single quote
    expect(sanitized).toBe("\"'=SUM(A1:A10)\"");

    const plusFormula = '+cmd|/c calc!A0';
    expect(sanitizeCsvField(plusFormula)).toBe("\"'+cmd|/c calc!A0\"");
  });
});
