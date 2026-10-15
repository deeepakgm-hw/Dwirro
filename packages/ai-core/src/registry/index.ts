export class ModelRegistry {
  private registeredModels = new Map<string, string>();

  public register(modelName: string, provider: string): void {
    this.registeredModels.set(modelName, provider);
  }

  public getProvider(modelName: string): string | undefined {
    return this.registeredModels.get(modelName);
  }
}
