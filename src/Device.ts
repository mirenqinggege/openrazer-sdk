import { dbusService } from './DBusService';
import { ChromaFX } from './effects/ChromaFX';
import { DeviceInfo, DeviceType, RazerError, RazerErrorCode } from './types';

export class Device {
  readonly name: string;
  readonly serial: string;
  readonly type: DeviceType;
  readonly firmwareVersion: string;
  readonly driverVersion: string;
  readonly capabilities: string[];
  readonly devicePath: string;

  private _brightness: number = 100;
  private _pollRate: number = 1000;
  private _batteryLevel?: number;
  private _isCharging?: boolean;

  readonly fx: ChromaFX;

  private eventListeners: Map<string, Set<Function>> = new Map();

  constructor(
    devicePath: string,
    private deviceInfo: DeviceInfo
  ) {
    this.devicePath = devicePath;
    this.name = deviceInfo.name;
    this.serial = deviceInfo.serial;
    this.type = deviceInfo.type;
    this.firmwareVersion = deviceInfo.firmwareVersion;
    this.driverVersion = deviceInfo.driverVersion;
    this.capabilities = deviceInfo.capabilities;
    this.fx = new ChromaFX(devicePath);
  }

  has(capability: string): boolean {
    return this.capabilities.includes(capability);
  }

  get brightness(): number {
    return this._brightness;
  }

  set brightness(value: number) {
    this._brightness = Math.max(0, Math.min(100, value));
  }

  get pollRate(): number {
    return this._pollRate;
  }

  set pollRate(value: number) {
    this._pollRate = value;
  }

  get batteryLevel(): number | undefined {
    return this._batteryLevel;
  }

  get isCharging(): boolean | undefined {
    return this._isCharging;
  }

  async refresh(): Promise<void> {
    // 刷新设备状态
    try {
      const brightness = await dbusService.getProperty(
        this.devicePath,
        'razer.device.lighting.brightness',
        'brightness'
      );
      this._brightness = brightness;
    } catch {
      // 忽略
    }
  }

  async setBrightness(brightness: number): Promise<void> {
    await dbusService.callMethod(
      this.devicePath,
      'razer.device.lighting.brightness',
      'setBrightness',
      'd',
      [brightness]
    );
    this._brightness = brightness;
  }

  async setPollRate(pollRate: number): Promise<void> {
    await dbusService.callMethod(
      this.devicePath,
      'razer.device.misc',
      'setPollRate',
      'y',
      [pollRate]
    );
    this._pollRate = pollRate;
  }

  on(event: string, callback: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event)!.add(callback);
  }

  off(event: string, callback: Function): void {
    this.eventListeners.get(event)?.delete(callback);
  }

  emit(event: string, ...args: any[]): void {
    this.eventListeners.get(event)?.forEach(cb => cb(...args));
  }
}
