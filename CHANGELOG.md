# 更新日志 / Changelog

## v1.0.0 (2026-08-18)

### 功能 / Features
- 工具卡片汉化（对话中 AI 工具调用卡片中文名称与说明）
- 插件列表汉化（设置 → 插件，230+ 插件中文名）
- 命令面板双语（英文命令名 + 中文说明，支持自定义字典）
- 权限选择器双语（Read Only / Workspace Write / Full access）
- 总开关 + 分项开关 + 配置持久化
- 翻译字典可视化编辑（搜索 / 新增 / 删除 / 启用禁用 / 导入导出 / 恢复默认）
- 智能功能：AI 自动识别（自动汉化未汉化插件）、AI 自检（检查并修复插件问题）
- 常驻加载（web-desktop / web 双 profile 支持）

### 技术 / Internals
- 手写 ModuleLoader bundle（无构建步骤）
- 幂等 patch（dsh-commands 双语钩子、settings 白名单），失败仅告警
- 开源友好：默认字典集中定义、AI 提示词可定制
