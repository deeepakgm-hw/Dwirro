import { ScheduleEvent, BillItem } from '@aip/shared-types';

export function detectScheduleConflicts(events: ScheduleEvent[]): ScheduleEvent[] {
  const sorted = [...events].sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );

  return sorted.map((event, idx) => {
    const eventStart = new Date(event.startTime).getTime();
    const eventEnd = new Date(event.endTime).getTime();

    const hasOverlap = sorted.some((other, otherIdx) => {
      if (idx === otherIdx) return false;
      const otherStart = new Date(other.startTime).getTime();
      const otherEnd = new Date(other.endTime).getTime();
      return eventStart < otherEnd && eventEnd > otherStart;
    });

    return { ...event, hasConflict: hasOverlap };
  });
}

export function detectDuplicateBills(bills: BillItem[]): BillItem[] {
  return bills.map((bill, idx) => {
    const isDuplicate = bills.some((other, otherIdx) => {
      if (idx === otherIdx) return false;
      return (
        bill.payee.toLowerCase().trim() === other.payee.toLowerCase().trim() &&
        bill.amount === other.amount &&
        bill.dueDate === other.dueDate
      );
    });
    return { ...bill, hasConflict: isDuplicate };
  });
}

export function generateBillReminderDates(dueDateStr: string): { threeDay: string; oneDay: string; dayOf: string } {
  const due = new Date(dueDateStr);
  
  const threeDayBefore = new Date(due);
  threeDayBefore.setDate(due.getDate() - 3);

  const oneDayBefore = new Date(due);
  oneDayBefore.setDate(due.getDate() - 1);

  return {
    threeDay: threeDayBefore.toISOString().split('T')[0],
    oneDay: oneDayBefore.toISOString().split('T')[0],
    dayOf: due.toISOString().split('T')[0],
  };
}

export function isPastTimestamp(isoString: string): boolean {
  return new Date(isoString).getTime() < Date.now();
}

export function formatTimeLocal(isoString: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return isoString;
  }
}

export function formatDateLocal(isoString: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return isoString;
  }
}
