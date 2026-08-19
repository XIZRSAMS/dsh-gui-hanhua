<div align="center">

# 🌏 dsh-gui-hanhua

### DeepSeek Harness 界面信息汉化插件

> **语言永远不会成为 Agent 的门槛。**
>
> **Language should never be a barrier for Agents.**

![版本](https://img.shields.io/badge/version-1.1.0-blue)
![许可](https://img.shields.io/badge/license-MIT-green)
![话题](https://img.shields.io/badge/topic-dsh--plugin-brightgreen)
![平台](https://img.shields.io/badge/platform-DeepSeek%20Harness-8A2BE2)

**📌 当前版本：v1.1.0**

一款**常驻型**汉化插件，让 DeepSeek Harness 的界面开口说中文——AI 工具卡片、插件列表、命令面板、权限选项，全部显示中文（同时保留英文原名）。

[English Docs](./README.en.md)

</div>

---

## ✨ 功能特性

| | 功能 | 说明 |
|---|---|---|
| 🃏 | **工具卡片汉化** | 对话中 AI 工具调用卡片显示中文名 + 一句话说明（如 `pwsh` → 执行 PowerShell） |
| 📦 | **插件列表汉化** | 设置 → 插件：230+ 插件的中文名称，保留英文原名 |
| ⌨️ | **命令面板双语** | `/` 菜单显示**英文命令名 + 中文说明**——`/plan` → 计划模式：进入或退出计划模式（先规划后执行） |
| 🔐 | **权限选择器双语** | `Read Only（只读）` / `Workspace Write（工作区写入）` / `Full access（完全访问）` |
| 🎛️ | **总开关 + 分项开关** | 一键开启/关闭全部汉化，或按功能独立控制 |
| 💾 | **配置持久化** | 字典自动保存到 `settings.yaml`，重启自动恢复 |
| 🤖 | **AI 自动识别** | 一键打开新对话，让 Agent 自动分析并汉化未汉化的插件 |
| 🩺 | **AI 自检** | 一键让 Agent 检查插件文件、配置与注册状态，自动修复问题 |

---

## 📸 界面展示

<div align="center">

**插件主页面** —— 总开关、五项功能开关与智能功能

<img src="./assets/main.jpg" alt="插件主页面" width="500"/>

<br/><br/>

**插件面板全面汉化** —— 230+ 插件的中文名称与说明

<img src="./assets/plugin-list.png" alt="插件面板汉化" width="640"/>

<br/><br/>

**命令面板全面双语** —— 英文命令名 + 中文说明

<img src="./assets/command-menu.png" alt="命令面板双语" width="480"/>

<br/><br/>

**工作区写入权限汉化** —— `Read Only（只读）` / `Workspace Write（工作区写入）` / `Full access（完全访问）`

<img src="./assets/permission.png" alt="权限选择器双语" width="400"/>

</div>

---

## 🚀 安装方法

1. 将本目录复制到 DSH profile 的 node_modules：
   ```powershell
   # 以桌面版 profile 为例：
   Copy-Item .\dsh-gui-hanhua -Recurse "$env:USERPROFILE\.dsh\profiles\web-desktop\node_modules\"
   ```
2. 在 `cordis.patch.yml` 注册插件（web-desktop 与 web 两个 profile 都可用）：
   ```yaml
   - insert:
       - id: gui-hanhua
         name: 'dsh-gui-hanhua'
         disabled: false
   ```
3. **重启 DeepSeek Harness** —— 插件自动加载（常驻插件，无需手动运行）。
4. 打开 **设置 → GUI汉化设置** 即可管理全部功能。

> 💡 无需构建：客户端为手写 bundle——client 端改动刷新页面即可，host 端改动需重启。

---

## ⚙️ 配置说明

所有配置位于 `settings.yaml` 的 `gui-hanhua` 段：

| 字段 | 说明 |
|---|---|
| `flags.master` | 汉化功能总开关 |
| `flags.toolCards` | 工具卡片汉化 |
| `flags.pluginList` | 插件列表汉化 |
| `flags.commandMenu` | 命令面板双语说明 |
| `flags.persist` | 修改持久化到磁盘 |
| `tools` / `plugins` / `commands` | 翻译字典（每条含 `zh` / `desc` / `enabled`） |

全部可在设置页可视化编辑：搜索、新增、删除、启用/禁用。

---

## 🧠 智能功能（AI 驱动）

设置页提供两个 AI 按钮——点击后**打开新对话**并自动向 Agent 发送任务提示词：

| 按钮 | Agent 会做什么 |
|---|---|
| **自动识别** | 扫描当前已安装但未汉化的插件/工具，设计中文名与说明，写入 `settings.yaml`——插件即时生效 |
| **AI 自检** | 检查注册状态、文件完整性、配置完整性与冲突；能修复的直接修复，其余给出建议 |

> ⚠️ 两种功能都会**消耗 token**；写文件时需您在场确认授权。

---

## 🔧 工作原理

- **客户端**（`client.js`）：手写 ModuleLoader bundle——注册设置页、工具卡片/插件列表/命令执行行槽位、权限双语字典。
- **宿主端**（`index.js`）：注册 `gui-hanhua` 设置命名空间、持久化字典，并通过 `vendor/dsh-commands-hanhua.js` 向 `dsh-commands` 注入只读双语钩子（命令说明）。
- **安全优先**：所有补丁幂等、失败仅告警、插件未加载时行为与原版完全一致；插件自身出错也绝不影响 GUI 其他部分。

---

## ❓ 常见问题

- **卡片没汉化？** 确认总开关与对应分开关已开启，且字典中存在该条目并已启用。
- **设置入口不见了？** 检查 `cordis.patch.yml` 中 gui-hanhua 行是否有 `disabled: true`。
- **命令说明不显示？** 确认「命令面板汉化」开关开启，且字典中存在该命令。
- **界面乱码？** 多为文件编码问题——运行「AI 自检」，让 Agent 检查并修复相关文件。

---

## 🤝 参与贡献

本项目为二次开发友好设计：

- 默认字典（`DEFAULT_TOOLS` / `DEFAULT_COMMANDS` / `DEFAULT_PLUGINS`）集中定义，一处修改全局生效；
- AI 任务提示词（`buildAutoPrompt` / `buildSelfCheckPrompt`）可自由定制；
- 界面文案全部内联，无外部资源依赖；
- 部署即复制 + 注册，无需构建。

欢迎提交 Issue 与 Pull Request！

---

## 📄 开源许可

[MIT](./LICENSE) © 2026

<div align="center">

**语言永远不会成为 Agent 的门槛**

**🚀 还会持续更新的！**

</div>
