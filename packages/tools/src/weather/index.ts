export class WeatherTool {
  public async getCurrentWeather(location: string): Promise<{ location: string; temperatureC: number; condition: string }> {
    return { location, temperatureC: 22, condition: 'Clear' };
  }
}
