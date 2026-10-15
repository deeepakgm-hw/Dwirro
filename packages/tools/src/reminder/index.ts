export interface SetReminderParams {
  title: string;
  time: string;
}

export class ReminderTool {
  public async scheduleReminder(params: SetReminderParams): Promise<{ id: string; status: string }> {
    return { id: 'rem-1', status: 'scheduled' };
  }
}
