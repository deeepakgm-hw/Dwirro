export type NotificationCategory = 'urgent_alert' | 'action_required' | 'informative' | 'marketing';

export class NotificationClassifier {
  public classify(text: string): NotificationCategory {
    return 'informative';
  }
}
