# OpenRazer SDK

[![npm version](https://img.shields.io/npm/v/openrazer-sdk)](https://www.npmjs.com/package/openrazer-sdk)
[![License: GPL-2.0](https://img.shields.io/github/license/openrazer/openrazer-sdk)](LICENSE)

用于通过 OpenRazer daemon 控制雷蛇外设的 Node.js SDK。

## 特性

- **设备发现** — 自动枚举所有已连接的雷蛇设备
- **设备控制** — 查询设备信息、功能和当前状态
- **灯光效果** — 应用呼吸灯、光谱、静态颜色、波浪、自定义 ChromaFX 等效果
- **原生 D-Bus** — 通过 D-Bus 与 `openrazer-daemon` 直接通信
- **TypeScript** — 内置完整类型定义

## 前置要求

本 SDK 需要系统已安装并运行 **OpenRazer**。请先参考 [OpenRazer 项目](https://github.com/openrazer/openrazer) 进行安装。

### 安装 OpenRazer

**Ubuntu / Debian:**
```bash
sudo apt install openrazer-daemon openrazer-driver-manager
```

**Fedora:**
```bash
sudo dnf install openrazer-daemon python3-openrazer
```

**Arch Linux:**
```bash
sudo pacman -S openrazer-daemon
```

安装完成后，请确保 `openrazer-daemon` 正在运行。

### 验证 daemon 状态

```bash
# 检查 daemon 是否运行
systemctl --user status razerd

# 如果未运行，启动它
systemctl --user start razerd
```

## 安装 SDK

```bash
npm install openrazer-sdk
```

## 快速开始

```typescript
import { DeviceManager, ChromaFX, SingleLedFX } from 'openrazer-sdk';

// 发现设备
const manager = new DeviceManager();
console.log('发现的设备:', manager.devices.map(d => d.name));

// 获取第一个设备
const device = manager.devices[0];
console.log(`正在控制: ${device.name}`);

// 应用呼吸灯效果 (ChromaFX)
await device.fx.breathSingle(255, 0, 0);

// 应用单 LED 效果
const led = new SingleLedFX(device.devicePath, 'logo');
await led.static(0, 255, 0);
```

## API 概览

### DeviceManager

- `devices: Device[]` — 所有已发现设备的列表
- `refresh()` — 重新扫描设备

### Device

- `name: string` — 显示名称
- `serial: string` — 设备序列号
- `type: string` — 设备类型（键盘、鼠标、耳机等）
- `fx: ChromaFX` — 设备灯光效果控制器

### ChromaFX（通过 `device.fx` 访问）

- `spectrum()` — 光谱循环效果
- `wave(direction)` — 波浪效果（0: 从左到右, 1: 从右到左）
- `static(r, g, b)` — 静态颜色
- `breathSingle(r, g, b)` — 单色呼吸灯
- `breathDual(r1, g1, b1, r2, g2, b2)` — 双色呼吸灯
- `breathRandom()` — 随机颜色呼吸灯
- `reactive(r, g, b, speed)` — 响应式效果
- `ripple(r, g, b, refreshRate)` — 涟漪效果
- `rippleRandom(refreshRate)` — 随机颜色涟漪
- `none()` — 关闭灯光

### SingleLedFX

- `new SingleLedFX(devicePath, ledName)` — 构造函数，ledName 如 'logo'、'backlight'
- `static(r, g, b)` — 静态颜色
- `spectrum()` — 光谱循环
- `none()` — 关闭灯光
- `getBrightness()` / `setBrightness()` — 亮度控制

## 示例

更多示例请查看 [`examples/`](./examples) 目录：

- `devices.ts` — 列出所有设备及其属性
- `chroma-effects.ts` — 演示各种 ChromaFX 灯光模式
- `single-led.ts` — 控制单独 LED 区域
