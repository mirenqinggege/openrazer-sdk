export const DBUS_SERVICE_NAME = 'org.razer';
export const DBUS_BUS: 'session' | 'system' = 'session';
export const DBUS_BASE_PATH = '/org/razer/device';

export const WAVE_RIGHT = 0;
export const WAVE_LEFT = 1;

export const POLL_RATES = [125, 250, 500, 1000, 2000, 4000, 8000];

export const REACTIVE_SPEEDS: Record<number, number> = {
  500: 1,
  1000: 2,
  1500: 3,
  2000: 4,
};
