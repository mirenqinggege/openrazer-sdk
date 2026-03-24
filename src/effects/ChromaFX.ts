import { dbusService } from '../DBusService';
import { RazerError, RazerErrorCode } from '../types';

export class ChromaFX {
  constructor(private devicePath: string) {}

  private async call(method: string, signature: string, args: any[]): Promise<void> {
    try {
      await dbusService.callMethod(
        this.devicePath,
        'razer.device.lighting.chroma',
        method,
        signature,
        args
      );
    } catch (e) {
      if (e instanceof RazerError && e.code === RazerErrorCode.METHOD_NOT_SUPPORTED) {
        return; // 静默忽略不支持的方法
      }
      throw e;
    }
  }

  async none(): Promise<void> {
    await this.call('setNone', '', []);
  }

  async spectrum(): Promise<void> {
    await this.call('setSpectrum', '', []);
  }

  async wave(direction: 0 | 1): Promise<void> {
    await this.call('setWave', 'y', [direction]);
  }

  async static(red: number, green: number, blue: number): Promise<void> {
    await this.call('setStatic', 'yyy', [red, green, blue]);
  }

  async breathSingle(red: number, green: number, blue: number): Promise<void> {
    await this.call('setBreathSingle', 'yyy', [red, green, blue]);
  }

  async breathDual(r1: number, g1: number, b1: number, r2: number, g2: number, b2: number): Promise<void> {
    await this.call('setBreathDual', 'yyyyyy', [r1, g1, b1, r2, g2, b2]);
  }

  async breathRandom(): Promise<void> {
    await this.call('setBreathRandom', '', []);
  }

  async reactive(red: number, green: number, blue: number, speed: number): Promise<void> {
    await this.call('setReactive', 'yyy y', [red, green, blue, speed]);
  }

  async ripple(red: number, green: number, blue: number, refreshRate: number): Promise<void> {
    await this.call('setRipple', 'yyyd', [red, green, blue, refreshRate]);
  }

  async rippleRandom(refreshRate: number): Promise<void> {
    await this.call('setRippleRandomColour', 'd', [refreshRate]);
  }
}
