export type DeliveryChannel = 'push' | 'in_app' | 'character_speech' | 'silent_batch';

export interface DeliveryDecision {
  channel: DeliveryChannel;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  deliverImmediately: boolean;
}

export class NotificationDecisionEngine {
  public decide(category: string, userActive: boolean): DeliveryDecision {
    return {
      channel: userActive ? 'in_app' : 'push',
      priority: 'normal',
      deliverImmediately: true,
    };
  }
}
