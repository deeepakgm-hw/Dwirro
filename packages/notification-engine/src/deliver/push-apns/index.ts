export class APNSPushSender {
  public async send(deviceToken: string, alert: string): Promise<boolean> {
    return true;
  }
}
