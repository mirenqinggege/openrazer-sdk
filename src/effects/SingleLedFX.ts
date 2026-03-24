import { dbusService } from '../DBusService';
import { RazerError, RazerErrorCode } from '../types';

export class SingleLedFX {
  constructor(
    private devicePath: string,
    private ledName: string
  ) {}

  private get interfaceName(): string {
    return `razer.device.lighting.${this.ledName}`;
  }

  private async call(method: string, signature: string, args: any[]): Promise<void> {
    try {
      await dbusService.callMethod(this.devicePath, this.interfaceName, method, signature, args);
    } catch (e) {
      if (e instanceof RazerError && e.code === RazerErrorCode.METHOD_NOT_SUPPORTED) {
        return;
      }
      throw e;
    }
  }

  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  async getBrightness(): Promise<number> {
    return dbusService.getProperty(this.devicePath, this.interfaceName, 'brightness');
  }

  async setBrightness(brightness: number): Promise<void> {
    const methodName = `set${this.capitalize(this.ledName)}Brightness`;
    await this.call(methodName, 'd', [brightness]);
  }

  async getEffect(): Promise<string> {
    const methodName = `get${this.capitalize(this.ledName)}Effect`;
    return dbusService.callMethod(this.devicePath, this.interfaceName, methodName, '', []);
  }

  async static(red: number, green: number, blue: number): Promise<void> {
    const methodName = `set${this.capitalize(this.ledName)}Static`;
    await this.call(methodName, 'yyy', [red, green, blue]);
  }

  async none(): Promise<void> {
    const methodName = `set${this.capitalize(this.ledName)}None`;
    await this.call(methodName, '', []);
  }

  async spectrum(): Promise<void> {
    const methodName = `set${this.capitalize(this.ledName)}Spectrum`;
    await this.call(methodName, '', []);
  }
}
