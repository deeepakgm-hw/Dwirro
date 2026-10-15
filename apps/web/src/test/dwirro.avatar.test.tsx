import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DwirroScene } from '../components/avatar/DwirroScene';
import { STATE_EXPRESSIONS, DwirroState } from '../components/avatar/characterState';
import { DWIRRO_COLORS, createDwirroMaterials } from '../components/avatar/DwirroMaterials';

describe('Dwirro 3D Mascot Character & Protocol', () => {
  it('defines all required visual identity colors and materials', () => {
    expect(DWIRRO_COLORS.primaryNavy).toBe('#10254B');
    expect(DWIRRO_COLORS.secondaryRoyal).toBe('#1C3F78');
    expect(DWIRRO_COLORS.accentCyan).toBe('#19BFFF');
    expect(DWIRRO_COLORS.eyeWhite).toBe('#FFFFFF');

    const materials = createDwirroMaterials();
    expect(materials.bodyMaterial).toBeDefined();
    expect(materials.visorMaterial).toBeDefined();
    expect(materials.cyanGlowMaterial).toBeDefined();
    expect(materials.eyeMaterial).toBeDefined();
  });

  it('provides distinct expressions for all 7 required character states', () => {
    const states: DwirroState[] = [
      'idle',
      'listening',
      'thinking',
      'speaking',
      'happy',
      'surprised',
      'away',
    ];

    states.forEach((s) => {
      const expr = STATE_EXPRESSIONS[s];
      expect(expr).toBeDefined();
      expect(expr.state).toBe(s);
      expect(expr.glowIntensity).toBeGreaterThan(0);
      expect(expr.bodyBobSpeed).toBeGreaterThan(0);
    });

    // Listening leans attentively forward
    expect(STATE_EXPRESSIONS.listening.headTiltX).toBeGreaterThan(0);
    // Thinking tilts up and sideways
    expect(STATE_EXPRESSIONS.thinking.headTiltX).toBeLessThan(0);
    expect(STATE_EXPRESSIONS.thinking.headTiltZ).toBeLessThan(0);
    // Speaking has rhythmic cadence
    expect(STATE_EXPRESSIONS.speaking.bodyBobSpeed).toBeGreaterThan(STATE_EXPRESSIONS.idle.bodyBobSpeed);
    // Happy has cheerful eyes
    expect(STATE_EXPRESSIONS.happy.eyeScaleX).toBeGreaterThan(1.0);
    // Surprised has wide eyes
    expect(STATE_EXPRESSIONS.surprised.eyeScaleX).toBeGreaterThan(1.2);
  });

  it('renders DwirroScene with test-id and displays state badge', () => {
    render(<DwirroScene state="idle" />);
    expect(screen.getByTestId('dwirro-avatar-scene')).toBeInTheDocument();
    expect(screen.getByText(/Online/i)).toBeInTheDocument();
    expect(screen.getByText(/Dwirro v1.0 • 3D Agent/i)).toBeInTheDocument();
  });

  it('renders graceful fallback in non-WebGL jsdom test environment without crashing', () => {
    render(<DwirroScene state="listening" />);
    expect(screen.getByTestId('dwirro-avatar-fallback')).toBeInTheDocument();
    expect(screen.getByText('Listening...')).toBeInTheDocument();
    expect(screen.getByText('Listening to your voice...')).toBeInTheDocument();
  });

  it('supports interactive state selection and triggers onStateChange', () => {
    const handleStateChange = vi.fn();
    render(<DwirroScene state="idle" onStateChange={handleStateChange} interactive={true} />);

    const thinkingBtn = screen.getByRole('button', { name: /thinking/i });
    fireEvent.click(thinkingBtn);

    expect(handleStateChange).toHaveBeenCalledWith('thinking');
    expect(screen.getByText(/Processing context.../i)).toBeInTheDocument();
  });
});
