export class WebClientTransport {
  private socket: any = null;

  public connect(url: string = window.location.origin): void {
    // Connects to realtime Socket.IO backend gateway
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const webClientTransport = new WebClientTransport();
