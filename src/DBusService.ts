import dbus from 'dbus-native';
import {DBUS_SERVICE_NAME} from './constants';
import {RazerError, RazerErrorCode} from './types';

type DBusSignature = string;

interface DBusMessage {
  destination?: string;
  path: string;
  interface?: string;
  member: string;
  signature?: DBusSignature;
  body?: any[];
}

export class DBusService {
  private connection!: ReturnType<typeof dbus.sessionBus>;
  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized) return;

    this.connection = dbus.sessionBus();
    this.initialized = true;
  }

  async callMethod(
    path: string,
    iface: string,
    method: string,
    signature: DBusSignature,
    args: any[]
  ): Promise<any> {
    if (!this.connection) {
      throw new RazerError(RazerErrorCode.CONNECTION_FAILED, 'DBus not initialized');
    }

    const msg: DBusMessage = {
      destination: DBUS_SERVICE_NAME,
      path,
      interface: iface,
      member: method,
      signature,
      body: args,
    };

    return new Promise((resolve, reject) => {
      this.connection.invoke(
        msg,
        (err: Error | null, ...results: any[]) => {
          if (err) {
            if ('message' in err) {
              if (err.message.includes('Unknown method') || err.message.includes('No such interface')) {
                reject(new RazerError(RazerErrorCode.METHOD_NOT_SUPPORTED, err.message, path));
              } else {
                reject(new RazerError(RazerErrorCode.DBUS_ERROR, err.message, path));
              }
            } else {
              reject(new RazerError(RazerErrorCode.DBUS_ERROR, err, path));
            }
          } else {
            resolve(results.length === 1 ? results[0] : results);
          }
        }
      );
    });
  }

  async getProperty(path: string, iface: string, prop: string): Promise<any> {
    // 使用 org.freedesktop.DBus.Properties.Get 获取属性
    return this.callMethod(
      path,
      'org.freedesktop.DBus.Properties',
      'Get',
      'ss',
      [iface, prop]
    );
  }
}

export const dbusService = new DBusService();
