export interface IncomingNotification {
  id: string;
  source: string;
  payload: Record<string, any>;
  receivedAt: number;
}

export class NotificationIngestService {
  public ingest(notification: IncomingNotification): IncomingNotification {
    return notification;
  }
}
