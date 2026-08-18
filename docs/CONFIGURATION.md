# 配置说明 / Configuration

所有配置保存在 DSH 配置目录下 `settings.yaml` 的 `gui-hanhua` 段，也可在设置页可视化编辑（**设置 → GUI汉化设置**）。

## flags（功能开关）

| 字段 | 类型 | 默认 | 说明 |
|---|---|---|---|
| `master` | bool | true | 汉化功能总开关 |
| `toolCards` | bool | true | 工具卡片汉化（对话中 AI 工具调用卡片） |
| `pluginList` | bool | true | 插件列表汉化（设置 → 插件） |
| `commandMenu` | bool | true | 命令面板双语说明（命令名保持英文） |
| `persist` | bool | true | 修改持久化到磁盘 |

## 翻译字典

| 段 | 说明 |
|---|---|
| `tools` | 工具名 → 中文（`zh` / `desc` / `enabled`） |
| `plugins` | 插件名 → 中文 |
| `commands` | 命令说明 → 中文（命令名保持英文） |

示例：

```yaml
gui-hanhua:
  flags:
    master: true
    persist: true
    toolCards: true
    pluginList: true
    commandMenu: true
  tools:
    read:
      zh: 读取文件
      desc: 读取文本文件内容，支持指定起始行与行数。
      enabled: true
  plugins: {}
  commands:
    plan:
      zh: 计划
      desc: 进入或退出计划模式（先规划后执行）。
      enabled: true
```

## 智能功能

- **自动识别**：点击后打开新对话，AI 自动分析未汉化插件并写入配置。
- **AI 自检**：点击后打开新对话，AI 检查插件文件/配置/注册状态并修复。
- ⚠️ 两种功能都会消耗 token；写文件需用户在场授权。
