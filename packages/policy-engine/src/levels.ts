import { ActionLevel } from '@aip/shared-types';

export const ACTION_LEVEL_DESCRIPTIONS: Record<ActionLevel, { label: string; badgeColor: string; description: string }> = {
  L0: {
    label: 'L0 - Autonomous',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    description: 'Autonomous action: No prior confirmation needed.',
  },
  L1: {
    label: 'L1 - Notify Only',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    description: 'Executes automatically with asynchronous user notification.',
  },
  L2: {
    label: 'L2 - Review & Approve',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    description: 'Requires explicit user approval before execution.',
  },
  L3: {
    label: 'L3 - High Consequence',
    badgeColor: 'bg-orange-100 text-orange-800 border-orange-300',
    description: 'High consequence action: Requires multi-step confirmation and audit logging.',
  },
  L4: {
    label: 'L4 - Strictly Manual',
    badgeColor: 'bg-red-100 text-red-800 border-red-300',
    description: 'Strictly manual (Do it yourself): Assistant cannot execute under any condition.',
  },
};
