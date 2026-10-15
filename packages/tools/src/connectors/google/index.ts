export interface GoogleConnectorConfig {
  clientId?: string;
  clientSecret?: string;
  redirectUri?: string;
}

export class GoogleConnector {
  constructor(private config: GoogleConnectorConfig = {}) {}

  public isConfigured(): boolean {
    return Boolean(this.config.clientId);
  }
}
