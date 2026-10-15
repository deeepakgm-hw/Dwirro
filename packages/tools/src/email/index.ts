export interface SendEmailParams {
  to: string;
  subject: string;
  body: string;
}

export class EmailTool {
  public async draftEmail(params: SendEmailParams): Promise<{ id: string; status: string }> {
    return { id: 'draft-1', status: 'drafted' };
  }
}
