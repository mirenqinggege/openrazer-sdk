/**
 * 示例：控制单独 LED 区域
 */
import { DeviceManager, SingleLedFX, Device } from '../src';

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 常见的 LED 区域名称
const COMMON_LED_ZONES = [
  'logo',       // 标志灯
  'backlight',  // 背光
  'scroll',     // 滚轮灯
  'dpi',        // DPI 灯
  'power',      // 电源灯
];

async function demoSingleLed(device: Device): Promise<void> {
  console.log(`\n演示单 LED 控制: ${device.name}`);

  for (const zone of COMMON_LED_ZONES) {
    try {
      // 尝试创建 SingleLedFX 实例
      const led = new SingleLedFX(device.devicePath, zone);

      console.log(`\n  区域: ${zone}`);

      // 静态颜色
      console.log(`    设置静态颜色 (红色)...`);
      await led.static(255, 0, 0);
      await sleep(1000);

      // 光谱效果
      console.log(`    光谱效果...`);
      await led.spectrum();
      await sleep(2000);

      // 关闭
      console.log(`    关闭...`);
      await led.none();
      await sleep(500);
    } catch (e) {
      // 忽略不支持的区域
    }
  }
}

async function main() {
  const manager = new DeviceManager();

  console.log('正在连接 OpenRazer daemon...');
  await manager.connect();

  if (manager.devices.length === 0) {
    console.log('未发现设备，请确保 OpenRazer daemon 正在运行且已连接雷蛇设备。');
    return;
  }

  console.log(`发现 ${manager.devices.length} 个设备`);
  console.log('\n注意：SingleLedFX 需要知道设备的 D-Bus 路径');
  console.log('请参考 DeviceManager 获取设备列表后手动指定路径\n');

  // 演示单 LED 效果
  for (const device of manager.devices) {
    try {
      await demoSingleLed(device);
    } catch (e) {
      console.warn(`设备 ${device.name} 演示失败:`, e);
    }
  }

  console.log('\n演示完成！');
}

main().catch(console.error);
