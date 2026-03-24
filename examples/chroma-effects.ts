/**
 * 示例：演示各种 ChromaFX 灯光效果
 */
import { DeviceManager, Device } from '../src';

const manager = new DeviceManager();

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function demoEffects(device: Device): Promise<void> {
  console.log(`\n演示灯光效果: ${device.name}\n`);

  // 光谱循环
  console.log('1. 光谱循环效果...');
  await device.fx.spectrum();
  await sleep(3000);

  // 波浪效果（从左到右）
  console.log('2. 波浪效果（从左到右）...');
  await device.fx.wave(0);
  await sleep(3000);

  // 波浪效果（从右到左）
  console.log('3. 波浪效果（从右到左）...');
  await device.fx.wave(1);
  await sleep(3000);

  // 静态红色
  console.log('4. 静态红色...');
  await device.fx.static(255, 0, 0);
  await sleep(2000);

  // 静态绿色
  console.log('5. 静态绿色...');
  await device.fx.static(0, 255, 0);
  await sleep(2000);

  // 静态蓝色
  console.log('6. 静态蓝色...');
  await device.fx.static(0, 0, 255);
  await sleep(2000);

  // 单色呼吸灯（红色）
  console.log('7. 单色呼吸灯（红色）...');
  await device.fx.breathSingle(255, 0, 0);
  await sleep(4000);

  // 双色呼吸灯（红蓝交替）
  console.log('8. 双色呼吸灯（红蓝交替）...');
  await device.fx.breathDual(255, 0, 0, 0, 0, 255);
  await sleep(4000);

  // 随机颜色呼吸灯
  console.log('9. 随机颜色呼吸灯...');
  await device.fx.breathRandom();
  await sleep(4000);

  // 响应式效果
  console.log('10. 响应式效果（蓝色，快速）...');
  await device.fx.reactive(0, 0, 255, 1);
  await sleep(4000);

  // 涟漪效果
  console.log('11. 涟漪效果（白色）...');
  await device.fx.ripple(255, 255, 255, 20);
  await sleep(4000);

  // 随机颜色涟漪
  console.log('12. 随机颜色涟漪...');
  await device.fx.rippleRandom(20);
  await sleep(4000);

  // 关闭灯光
  console.log('13. 关闭灯光...');
  await device.fx.none();
}

async function main() {
  console.log('正在连接 OpenRazer daemon...');
  await manager.connect();

  if (manager.devices.length === 0) {
    console.log('未发现设备，请确保 OpenRazer daemon 正在运行且已连接雷蛇设备。');
    return;
  }

  console.log(`发现 ${manager.devices.length} 个设备`);
  console.log('开始演示各种灯光效果...\n');
  console.log('（每个效果持续 2-4 秒）\n');

  // 对每个设备演示效果
  for (const device of manager.devices) {
    try {
      await demoEffects(device);
    } catch (e) {
      console.warn(`设备 ${device.name} 不支持某些效果:`, e);
    }
  }

  console.log('\n演示完成！');
}

main().catch(console.error);
