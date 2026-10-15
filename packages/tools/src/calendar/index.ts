export interface CalendarToolParams {
  startDate: string;
  endDate: string;
}

export class CalendarTool {
  public async listEvents(params: CalendarToolParams): Promise<any[]> {
    return [];
  }
}
