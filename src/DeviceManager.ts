import { dbusService } from './DBusService';
import { Device } from './Device';
import { DBUS_SERVICE_NAME, DBUS_BASE_PATH } from './constants';
import { RazerError, RazerErrorCode } from './types';

export class DeviceManager {
  private _devices: Device[] = [];
  private _version: string = '';
  private _syncEffects: boolean = false;
  private initialized = false;

  private eventListeners: Map<string, Set<Function>> = new Map();

  get devices(): Device[] {
    return this._devices;
  }

  get version(): string {
    return this._version;
  }

  get syncEffects(): boolean {
    return this._syncEffects;
  }

  set syncEffects(value: boolean) {
    this._syncEffects = value;
    this.setSyncEffects(value);
  }

  async connect(): Promise<void> {
    if (this.initialized) return;

    await dbusService.initialize();

    // 获取 daemon 版本
    try {
      this._version = await dbusService.callMethod(
        '/org/razer',
        'razer.daemon',
        'version',
        '',
        []
      );
    } catch {
      this._version = 'unknown';
    }

    // 获取设备列表
    await this.loadDevices();

    this.initialized = true;
  }

  private async loadDevices(): Promise<void> {
    try {
      const serials: string[] = await dbusService.callMethod(
        '/org/razer',
        'razer.devices',
        'getDevices',
        '',
        []
      );

      this._devices = [];

      for (const serial of serials) {
        const path = `${DBUS_BASE_PATH}/${serial}`;
        try {
          const device = await this.createDevice(path, serial);
          this._devices.push(device);
        } catch (e) {
          console.warn(`Failed to load device ${serial}:`, e);
        }
      }
    } catch (e) {
      if (e instanceof RazerError) {
        throw e;
      }
      throw new RazerError(RazerErrorCode.CONNECTION_FAILED, 'Failed to load devices');
    }
  }

  private async createDevice(path: string, serial: string): Promise<Device> {
    const [
      name,
      deviceType,
      firmware,
      driver,
      capabilities,
    ] = await Promise.all([
      dbusService.callMethod(path, 'razer.device.misc', 'getDeviceName', '', []),
      dbusService.callMethod(path, 'razer.device.misc', 'getDeviceType', '', []),
      dbusService.callMethod(path, 'razer.device.misc', 'getFirmware', '', []),
      dbusService.callMethod(path, 'razer.device.misc', 'getDriverVersion', '', []),
      this.getDeviceCapabilities(path),
    ]);

    const vidPid: number[] = await dbusService.callMethod(path, 'razer.device.misc', 'getVidPid', '', []);

    const deviceInfo = {
      name,
      serial,
      type: deviceType as Device['type'],
      firmwareVersion: firmware,
      driverVersion: driver,
      vid: vidPid[0],
      pid: vidPid[1],
      capabilities,
    };

    return new Device(path, deviceInfo);
  }

  private async getDeviceCapabilities(path: string): Promise<string[]> {
    const caps: string[] = [];

    // 检查各种能力
    const checks = [
      { method: 'hasMatrix', cap: 'matrix' },
      { method: 'hasDedicatedMacroKeys', cap: 'macro' },
    ];

    for (const check of checks) {
      try {
        const result = await dbusService.callMethod(path, 'razer.device.misc', check.method, '', []);
        if (result) {
          caps.push(check.cap);
        }
      } catch {
        // 忽略
      }
    }

    // 检查灯光能力
    try {
      await dbusService.callMethod(path, 'razer.device.lighting.chroma', 'setStatic', 'yyy', [0, 0, 0]);
      caps.push('lighting_static');
    } catch {
      // 忽略
    }

    try {
      await dbusService.callMethod(path, 'razer.device.lighting.chroma', 'setSpectrum', '', []);
      caps.push('lighting_spectrum');
    } catch {
      // 忽略
    }

    try {
      await dbusService.callMethod(path, 'razer.device.lighting.chroma', 'setWave', 'y', [0]);
      caps.push('lighting_wave');
    } catch {
      // 忽略
    }

    // 检查电池能力
    try {
      await dbusService.callMethod(path, 'razer.device.power', 'getBattery', '', []);
      caps.push('battery');
    } catch {
      // 忽略
    }

    return caps;
  }

  private async setSyncEffects(enabled: boolean): Promise<void> {
    await dbusService.callMethod('/org/razer', 'razer.devices', 'syncEffects', 'b', [enabled]);
  }

  async stopDaemon(): Promise<void> {
    await dbusService.callMethod('/org/razer', 'razer.daemon', 'stop', '', []);
  }

  on(event: 'device-added' | 'device-removed', callback: (device: Device | string) => void): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event)!.add(callback);
  }

  off(event: 'device-added' | 'device-removed', callback: Function): void {
    this.eventListeners.get(event)?.delete(callback);
  }
}
