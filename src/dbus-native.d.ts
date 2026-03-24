declare module 'dbus-native' {
  interface DBusMessage {
    destination?: string;
    path: string;
    interface?: string;
    member: string;
    signature?: string;
    body?: any[];
    type?: number;
    serial?: number;
  }

  interface DBusConnection {
    invoke(msg: DBusMessage, callback: (err: Error | null, ...args: any[]) => void): void;
    on(event: string, handler: (msg: any) => void): void;
    message(msg: DBusMessage): void;
  }

  interface DBusModule {
    sessionBus(opts?: any): DBusConnection;
    systemBus(opts?: any): DBusConnection;
  }

  const dbus: DBusModule;
  export = dbus;
}
