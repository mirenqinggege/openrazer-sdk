export type DeviceType = 'mouse' | 'keyboard' | 'mousemat' | 'headset';

export type WaveDirection = 0 | 1;  // 0 = 右, 1 = 左

export enum ReactiveSpeed {
  FAST = 1,
  MEDIUM = 2,
  SLOW = 3,
  VERY_SLOW = 4
}

export interface DeviceInfo {
  name: string;
  serial: string;
  type: DeviceType;
  firmwareVersion: string;
  driverVersion: string;
  vid: number;
  pid: number;
  capabilities: string[];
}

export interface DPIRange {
  min: number;
  max: number;
}

export enum RazerErrorCode {
  CONNECTION_FAILED = 'CONNECTION_FAILED',
  DEVICE_NOT_FOUND = 'DEVICE_NOT_FOUND',
  METHOD_NOT_SUPPORTED = 'METHOD_NOT_SUPPORTED',
  DBUS_ERROR = 'DBUS_ERROR',
  TIMEOUT = 'TIMEOUT',
}

export class RazerError extends Error {
  code: RazerErrorCode;
  device?: string;

  constructor(code: RazerErrorCode, message: string, device?: string) {
    super(message);
    this.code = code;
    this.device = device;
    this.name = 'RazerError';
  }
}
