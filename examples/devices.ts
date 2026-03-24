/**
 * 示例：列出所有设备及其属性
 */
import { DeviceManager, Device } from '../src';

async function main() {
  const manager = new DeviceManager();

  console.log('正在连接 OpenRazer daemon...');
  await manager.connect();

  console.log(`\nOpenRazer daemon 版本: ${manager.version}`);
  console.log(`发现 ${manager.devices.length} 个设备:\n`);

  for (const device of manager.devices) {
    console.log('========================================');
    console.log(`名称:        ${device.name}`);
    console.log(`序列号:      ${device.serial}`);
    console.log(`类型:        ${device.type}`);
    console.log(`固件版本:    ${device.firmwareVersion}`);
    console.log(`驱动版本:    ${device.driverVersion}`);
    console.log(`支持的功能:  ${device.capabilities.join(', ') || '无'}`);
    console.log('========================================\n');
  }

  // 监听设备添加/移除事件
  manager.on('device-added', (device) => {
    console.log('设备已添加:', (device as Device).name);
  });

  manager.on('device-removed', (serial) => {
    console.log('设备已移除:', serial);
  });

  // 保持运行以监听事件
  console.log('监听设备变化中... 按 Ctrl+C 退出');
}

main().catch(console.error);
