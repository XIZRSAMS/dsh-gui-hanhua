/**
 * dsh-gui-hanhua — GUI可视信息汉化 V1.1（常驻版）Host 半区。
 *
 * 以宿主插件形式常驻：应用启动时自动加载，配置经 settings 服务持久化到
 * settings.yaml（与其他插件一致），重启后配置与插件本体都自动恢复。
 *
 * ============ 开源扩展指南（欢迎二次开发）============
 * 本插件将开源到 GitHub。Host 半区"活代码"集中如下：
 *   1. 默认翻译字典：DEFAULT_TOOLS / DEFAULT_COMMANDS / DEFAULT_PLUGINS（集中定义）。
 *   2. settings 命名空间：NS = settingsNamespace("gui-hanhua")（settings.yaml 的键）。
 *   3. 命令面板双语钩子：ensureCommandsHanhuaPatched（vendor/dsh-commands-hanua.js），
 *      命令名保持英文、描述显示中文（dsh-commands list() 只读钩子 + 文件字典通道）。
 *   4. 权限选项双语：字典经 client 半区写入浏览器全局（__guiHanhuaPermissionDict）。
 *   5. settings 白名单：ensureSettingsNamespaceExposed（vendor/dsh-settings-expose.js）。
 * 修改注意：host 半区修改后需重启应用生效（client 半区刷新页面即可）。
 */
import z from "@deepseek-ai/schemastery";
import { settingsNamespace } from "@deepseek-ai/dsh-settings";
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { ensureSettingsNamespaceExposed } from "./vendor/dsh-settings-expose.js";
import { ensureCommandsHanhuaPatched } from "./vendor/dsh-commands-hanhua.js";

/** Cordis 插件名。 */
export const name = "gui-hanhua";
/** 依赖的宿主服务。 */
export const inject = ["settings", "timer"];

/** 设置命名空间（settings.yaml 中的键）。 */
const NS = settingsNamespace("gui-hanhua");

// ================= 默认翻译字典（纯数据，用户可在设置页覆盖） =================
const DEFAULT_FLAGS = { master: true, persist: true, toolCards: true, pluginList: true, commandMenu: true, agentPreset: true };

const DEFAULT_TOOLS = {
  read: { zh: "读取文件", desc: "读取文本文件内容，支持指定起始行与行数。", enabled: true },
  write: { zh: "写入文件", desc: "创建新文件或整体替换一个文件的内容。", enabled: true },
  edit: { zh: "编辑文件", desc: "在现有文本文件中做精确的局部修改。", enabled: true },
  glob: { zh: "查找文件", desc: "按路径模式搜索文件。", enabled: true },
  grep: { zh: "搜索内容", desc: "在文件内容中按正则表达式查找文本。", enabled: true },
  pwsh: { zh: "执行 PowerShell", desc: "运行一条 PowerShell 命令并返回输出。", enabled: true },
  bash: { zh: "执行终端命令", desc: "运行一条终端命令（bash）。", enabled: true },
  run_code: { zh: "运行代码", desc: "在沙箱中执行一段代码。", enabled: true },
  web_search: { zh: "联网搜索", desc: "从互联网搜索最新信息，返回来源链接。", enabled: true },
  web_fetch: { zh: "抓取网页", desc: "获取并读取指定网页的内容。", enabled: true },
  skill: { zh: "加载技能", desc: "载入某项技能的完整操作说明。", enabled: true },
  todo_write: { zh: "任务清单", desc: "记录并更新当前工作的步骤清单。", enabled: true },
  ask_user_question: { zh: "询问用户", desc: "向用户提出一个需要确认或选择的问题。", enabled: true },
  job_list: { zh: "查看后台任务", desc: "列出所有已启动的后台任务。", enabled: true },
  job_output: { zh: "读取任务输出", desc: "读取某个后台任务的运行结果。", enabled: true },
  job_kill: { zh: "终止任务", desc: "请求停止一个正在运行的后台任务。", enabled: true },
  get_goal: { zh: "查看目标", desc: "读取当前长期目标的进度与状态。", enabled: true },
  create_goal: { zh: "创建目标", desc: "为长期工作创建一个自动延续的目标。", enabled: true },
  update_goal: { zh: "更新目标", desc: "暂停、恢复、修改或标记目标完成。", enabled: true },
  send_message: { zh: "发送消息", desc: "向后台子代理传递后续指令。", enabled: true },
  interrupt_agent: { zh: "中断代理", desc: "请求停止某个子代理当前的工作。", enabled: true },
  list_agents: { zh: "查看子代理", desc: "列出可继续对话的后台子代理。", enabled: true },
  subagent: { zh: "委托子代理", desc: "把独立任务交给子代理在后台处理。", enabled: true },
  subagent_fork: { zh: "派生子代理", desc: "基于本对话的上下文派生子代理继续工作。", enabled: true },
  workflow: { zh: "工作流编排", desc: "用脚本大规模并行编排多个子代理。", enabled: true },
  ralph: { zh: "拉尔夫循环", desc: "以全新代理反复迭代，直到目标完成或受阻。", enabled: true },
  read_image: { zh: "读取图片", desc: "直接在对话中查看一张图片。", enabled: true },
  inspect_image: { zh: "分析图片", desc: "用视觉模型描述或提取图片中的信息。", enabled: true },
  tdai_memory_search: { zh: "记忆搜索", desc: "检索长期记忆中记录的事实与偏好。", enabled: true },
  tdai_conversation_search: { zh: "对话检索", desc: "按关键词检索历史对话的原始内容。", enabled: true },
  exit_plan_mode: { zh: "提交计划", desc: "展示完整方案，请求批准后开始执行。", enabled: true },
  cordis_define: { zh: "定义插件包", desc: "创建插件的一个不可变代码版本。", enabled: true },
  cordis_run: { zh: "运行插件包", desc: "激活并启动指定的插件包。", enabled: true },
  cordis_stop: { zh: "停止插件", desc: "暂停插件效果，保留定义以便恢复。", enabled: true },
  cordis_undefine: { zh: "移除插件", desc: "永久删除插件及其全部版本。", enabled: true },
  cordis_inspect_list: { zh: "查看能力目录", desc: "列出当前可用的服务、事件与查询入口。", enabled: true },
  cordis_inspect_query: { zh: "查询能力契约", desc: "查询具体服务、槽位或主题的精确接口。", enabled: true },
  cordis_inspect_self: { zh: "检查自身插件", desc: "查看本会话插件的版本、源码与诊断。", enabled: true },
  cordis_package_inspect: { zh: "检查插件包", desc: "检查某个插件包的源码与状态。", enabled: true },
  cordis_runtime_inspect: { zh: "检查运行时", desc: "检查插件运行时的状态信息。", enabled: true }
};

const DEFAULT_COMMANDS = {
  plan: { zh: "计划", desc: "进入或退出计划模式（先规划后执行）。", enabled: true },
  compact: { zh: "压缩", desc: "手动压缩当前会话的上下文。", enabled: true },
  goal: { zh: "目标", desc: "管理当前会话的长期目标。", enabled: true },
  feedback: { zh: "反馈", desc: "提交消息反馈。", enabled: true },
  export: { zh: "导出", desc: "将会话日志导出为 ZIP 压缩包下载。", enabled: true },
  permission: { zh: "权限预设", desc: "切换权限预设（沙箱模式与审批策略）。", enabled: true }
};

const DEFAULT_PLUGINS = {
  agent: { zh: "Agent 基础", desc: "代理基础组件。", enabled: true },
  "agent-default-model": { zh: "默认模型", desc: "管理默认模型选择。", enabled: true },
  "agent-instructions": { zh: "Agent 指令", desc: "代理指令注入。", enabled: true },
  "agent-loop": { zh: "Agent 循环", desc: "代理的创建与驱动核心。", enabled: true },
  "agent-presets": { zh: "Agent 预设", desc: "代理预设的注册、挂载与管理。", enabled: true },
  "agent-tool-presentation": { zh: "工具呈现", desc: "工具调用方式的呈现模式。", enabled: true },
  "anonymous-user-id": { zh: "匿名用户标识", desc: "生成匿名用户 ID。", enabled: true },
  "api-gateway": { zh: "API 网关", desc: "统一的外部接口入口。", enabled: true },
  "api-remotes": { zh: "远程接口", desc: "前后端远程调用定义。", enabled: true },
  "app-boot": { zh: "应用启动", desc: "应用启动引导。", enabled: true },
  "atomic-write": { zh: "原子写入", desc: "文件原子写入。", enabled: true },
  attachment: { zh: "附件", desc: "图片等二进制附件。", enabled: true },
  "attachment-local": { zh: "本地附件", desc: "本地附件存储实现。", enabled: true },
  base: { zh: "基础核心", desc: "框架底层基础能力。", enabled: true },
  "bash-local": { zh: "本地终端", desc: "在本机执行终端命令。", enabled: true },
  "bash-sandbox": { zh: "终端沙箱", desc: "终端命令沙箱。", enabled: true },
  brand: { zh: "品牌", desc: "品牌标识与文案。", enabled: true },
  connection: { zh: "客户端连接", desc: "浏览器与后端的连接通道。", enabled: true },
  hmr: { zh: "客户端热更新", desc: "浏览器插件热重载。", enabled: true },
  locale: { zh: "界面语言", desc: "界面语言偏好与翻译字典。", enabled: true },
  modules: { zh: "客户端模块", desc: "Web 插件模块的扫描与加载。", enabled: true },
  runtime: { zh: "客户端运行时", desc: "浏览器端运行基础。", enabled: true },
  "schema-form": { zh: "表单渲染", desc: "设置表单的自动渲染。", enabled: true },
  "ui-agent-preset": { zh: "Agent 预设界面", desc: "Agent 预设选择界面。", enabled: true },
  "ui-attachment": { zh: "附件界面", desc: "附件上传与展示界面。", enabled: true },
  "ui-commands": { zh: "命令界面", desc: "斜杠命令菜单界面。", enabled: true },
  "ui-conversation": { zh: "对话界面", desc: "会话列表与聊天主界面。", enabled: true },
  "ui-cordis": { zh: "插件管理界面", desc: "动态插件运行卡片与面板。", enabled: true },
  "ui-deliverables": { zh: "成果物界面", desc: "会话成果展示。", enabled: true },
  "ui-directory-picker-browse": { zh: "目录选择界面", desc: "目录浏览选择器。", enabled: true },
  "ui-directory-picker-native": { zh: "原生目录选择", desc: "系统原生目录选择器。", enabled: true },
  "ui-goal": { zh: "目标界面", desc: "长期目标的展示界面。", enabled: true },
  "ui-input-trigger": { zh: "输入触发界面", desc: "输入框快捷触发与斜杠菜单。", enabled: true },
  "ui-jobs": { zh: "任务界面", desc: "后台任务展示界面。", enabled: true },
  "ui-layout": { zh: "界面布局", desc: "三栏布局与面板开关。", enabled: true },
  "ui-message-feedback": { zh: "消息反馈界面", desc: "消息点赞等反馈界面。", enabled: true },
  "ui-model-selection": { zh: "模型选择界面", desc: "模型选择器界面。", enabled: true },
  "ui-permission-presets": { zh: "权限预设界面", desc: "会话权限模式选择界面。", enabled: true },
  "ui-plan": { zh: "计划界面", desc: "计划模式的展示界面。", enabled: true },
  "ui-primitives": { zh: "界面基础组件", desc: "共享 UI 基础组件库。", enabled: true },
  "ui-settings": { zh: "设置界面", desc: "设置面板主体框架。", enabled: true },
  "ui-settings-general": { zh: "通用设置", desc: "设置面板「通用」页。", enabled: true },
  "ui-settings-models": { zh: "模型设置", desc: "设置面板「模型」页。", enabled: true },
  "ui-settings-plugin-inventory": { zh: "插件列表界面", desc: "设置面板「插件列表」页。", enabled: true },
  "ui-settings-plugins": { zh: "插件配置界面", desc: "设置面板「插件配置」页。", enabled: true },
  "ui-sidebar": { zh: "侧边栏界面", desc: "左侧工作区浏览栏。", enabled: true },
  "ui-skill": { zh: "技能界面", desc: "技能加载与展示界面。", enabled: true },
  "ui-slots": { zh: "插槽系统界面", desc: "UI 插槽注册系统。", enabled: true },
  "ui-subagent": { zh: "子代理界面", desc: "子代理列表与交互界面。", enabled: true },
  "ui-theme": { zh: "主题界面", desc: "主题选择与外观设置。", enabled: true },
  "ui-tool": { zh: "工具卡片界面", desc: "对话中工具调用卡片的渲染。", enabled: true },
  "ui-trajectory": { zh: "轨迹视图", desc: "对话轨迹视图。", enabled: true },
  "ui-user-questions": { zh: "提问界面", desc: "向用户提问的界面。", enabled: true },
  "ui-workflow-run": { zh: "工作流界面", desc: "工作流运行展示界面。", enabled: true },
  "ui-workspace": { zh: "工作区界面", desc: "工作区与目录浏览。", enabled: true },
  web: { zh: "网页客户端", desc: "浏览器端主程序。", enabled: true },
  "web-react": { zh: "React 运行时", desc: "浏览器端 React 基础。", enabled: true },
  cmdline: { zh: "命令行", desc: "命令行入口。", enabled: true },
  "code-runtime": { zh: "代码运行器", desc: "执行用户代码的运行环境。", enabled: true },
  "code-runtime-worker-thread": { zh: "代码运行线程", desc: "代码运行的工作线程实现。", enabled: true },
  "command-compact": { zh: "压缩命令", desc: "手动压缩会话的命令。", enabled: true },
  "command-feedback": { zh: "反馈命令", desc: "消息反馈命令。", enabled: true },
  "command-goal": { zh: "目标命令", desc: "长期目标管理命令。", enabled: true },
  commands: { zh: "命令系统", desc: "斜杠命令的注册与执行。", enabled: true },
  compaction: { zh: "会话压缩", desc: "长对话自动摘要压缩。", enabled: true },
  "compaction-basic": { zh: "基础压缩", desc: "基础摘要压缩实现。", enabled: true },
  "compaction-tool-result-pruner": { zh: "结果裁剪", desc: "工具结果超长裁剪。", enabled: true },
  "cordis-client-runner": { zh: "客户端插件运行器", desc: "浏览器端动态插件运行器。", enabled: true },
  "cordis-host-runner": { zh: "主机插件运行器", desc: "后端动态插件运行器。", enabled: true },
  credentials: { zh: "凭据", desc: "凭据统一接口。", enabled: true },
  "credentials-local": { zh: "本地凭据", desc: "本地凭据存储实现。", enabled: true },
  fs: { zh: "文件系统", desc: "文件读写的统一接口。", enabled: true },
  "fs-local": { zh: "本地文件系统", desc: "本机文件读写实现。", enabled: true },
  "fs-observation-policy": { zh: "文件观察策略", desc: "文件读写观察策略。", enabled: true },
  "fs-sandbox": { zh: "文件沙箱", desc: "文件操作沙箱。", enabled: true },
  goal: { zh: "目标系统", desc: "长期目标的后端管理。", enabled: true },
  "goal-round-driver": { zh: "目标轮次驱动", desc: "目标自动续跑驱动。", enabled: true },
  headless: { zh: "无头模式", desc: "无界面运行模式。", enabled: true },
  "home-paths": { zh: "目录定位", desc: "应用数据目录定位。", enabled: true },
  apiproxy: { zh: "API 代理", desc: "统一 API 响应代理。", enabled: true },
  "directory-picker": { zh: "目录选择", desc: "目录选择统一接口。", enabled: true },
  "directory-picker-auto": { zh: "自动目录选择", desc: "自动目录选择实现。", enabled: true },
  "directory-picker-browse": { zh: "浏览目录选择", desc: "浏览式目录选择实现。", enabled: true },
  "directory-picker-native": { zh: "原生目录选择", desc: "原生对话框目录选择。", enabled: true },
  "frontend-static": { zh: "前端静态资源", desc: "前端页面静态文件服务。", enabled: true },
  "plugin-inventory": { zh: "插件清单", desc: "插件装载状态的只读清单。", enabled: true },
  webserver: { zh: "Web 服务器", desc: "提供浏览器页面的 HTTP 服务。", enabled: true },
  invariants: { zh: "不变量检查", desc: "运行时不变量注册。", enabled: true },
  jobs: { zh: "后台任务", desc: "后台任务统一注册表。", enabled: true },
  "jobs-local": { zh: "本地任务", desc: "后台任务本地实现。", enabled: true },
  "launch-environment": { zh: "启动环境", desc: "启动环境信息。", enabled: true },
  llm: { zh: "大模型接入", desc: "模型提供商适配与调用。", enabled: true },
  "llm-deepseek": { zh: "DeepSeek 模型", desc: "DeepSeek 大模型适配器。", enabled: true },
  "llm-pi-ai": { zh: "PI AI 模型", desc: "PI AI 模型适配器。", enabled: true },
  "llm-retry": { zh: "模型重试", desc: "模型调用重试策略。", enabled: true },
  "mcp-client": { zh: "MCP 客户端", desc: "模型上下文协议客户端。", enabled: true },
  "message-feedback": { zh: "消息反馈", desc: "消息反馈存储。", enabled: true },
  "native-command": { zh: "原生命令", desc: "原生系统命令执行。", enabled: true },
  "output-retention": { zh: "输出保留", desc: "工具输出保留策略。", enabled: true },
  "permission-presets": { zh: "权限预设", desc: "会话权限模式预设。", enabled: true },
  persona: { zh: "人设系统", desc: "代理角色与行为指令。", enabled: true },
  "plan-mode": { zh: "计划模式", desc: "先规划后执行的工作模式。", enabled: true },
  "pwsh-local": { zh: "本地 PowerShell", desc: "本机 PowerShell 执行。", enabled: true },
  "pwsh-sandbox": { zh: "PowerShell 沙箱", desc: "PowerShell 命令沙箱。", enabled: true },
  "repeat-tool-reminder": { zh: "重复工具提醒", desc: "重复工具调用提醒。", enabled: true },
  sandbox: { zh: "沙箱", desc: "命令沙箱策略。", enabled: true },
  "sandbox-local": { zh: "本地沙箱", desc: "本机沙箱实现。", enabled: true },
  "sandbox-policy": { zh: "沙箱策略", desc: "沙箱模式解析。", enabled: true },
  "sandbox-windows-acl": { zh: "Windows 沙箱", desc: "Windows 文件沙箱实现。", enabled: true },
  schedule: { zh: "定时调度", desc: "定时任务调度。", enabled: true },
  scope: { zh: "作用域", desc: "会话作用域管理。", enabled: true },
  session: { zh: "会话", desc: "会话创建与内存管理。", enabled: true },
  "session-checkpoint-policy": { zh: "检查点策略", desc: "会话检查点策略。", enabled: true },
  "session-log-export": { zh: "会话导出", desc: "会话日志导出。", enabled: true },
  "session-persistence": { zh: "会话存储", desc: "会话日志的持久化。", enabled: true },
  "session-persistence-jsonl": { zh: "JSONL 会话存储", desc: "JSONL 格式会话存储实现。", enabled: true },
  "session-projection": { zh: "会话投影", desc: "会话状态投影。", enabled: true },
  "session-projection-cache": { zh: "投影缓存", desc: "会话投影缓存。", enabled: true },
  "session-query": { zh: "会话查询", desc: "历史会话检索。", enabled: true },
  "session-query-sqlite": { zh: "SQLite 会话查询", desc: "SQLite 会话检索实现。", enabled: true },
  "session-reference": { zh: "会话引用", desc: "跨会话引用解析。", enabled: true },
  "session-stats": { zh: "会话统计", desc: "会话用量统计。", enabled: true },
  "session-telemetry": { zh: "会话遥测", desc: "会话遥测数据。", enabled: true },
  "session-telemetry-otel": { zh: "OTel 遥测", desc: "OpenTelemetry 遥测实现。", enabled: true },
  "session-title": { zh: "会话标题", desc: "会话标题生成与维护。", enabled: true },
  "session-title-first-prompt-llm": { zh: "首问标题", desc: "首个提问生成标题。", enabled: true },
  "session-title-llm": { zh: "LLM 标题", desc: "大模型生成会话标题。", enabled: true },
  settings: { zh: "设置系统", desc: "设置文档与命名空间。", enabled: true },
  "settings-file": { zh: "设置文件", desc: "设置文件存储实现。", enabled: true },
  shell: { zh: "终端", desc: "命令执行统一接口。", enabled: true },
  "shell-env": { zh: "终端环境", desc: "终端环境变量注入。", enabled: true },
  skill: { zh: "技能系统", desc: "技能注册与目录。", enabled: true },
  "skill-badge": { zh: "技能徽章", desc: "技能徽章界面。", enabled: true },
  "skill-filesystem": { zh: "技能文件", desc: "技能文件加载。", enabled: true },
  spill: { zh: "溢出存储", desc: "大块文本的临时落盘。", enabled: true },
  "spill-local": { zh: "本地溢出存储", desc: "本地溢出存储实现。", enabled: true },
  "spill-policy": { zh: "溢出策略", desc: "溢出存储策略。", enabled: true },
  storage: { zh: "存储", desc: "存储后端注册中枢。", enabled: true },
  "storage-domain": { zh: "存储域", desc: "存储域管理。", enabled: true },
  "storage-json": { zh: "JSON 存储", desc: "JSON 存储实现。", enabled: true },
  subagent: { zh: "子代理", desc: "子代理启动与派发。", enabled: true },
  "subagent-fork-in-process": { zh: "进程内子代理", desc: "进程内子代理实现。", enabled: true },
  "subagent-in-process-driver": { zh: "进程内驱动", desc: "进程内子代理驱动。", enabled: true },
  "subagent-spawn-in-process": { zh: "进程内生成", desc: "进程内子代理生成。", enabled: true },
  subprocess: { zh: "子进程", desc: "子进程管理。", enabled: true },
  "subprocess-local": { zh: "本地子进程", desc: "本地子进程实现。", enabled: true },
  "system-prompt": { zh: "系统提示词", desc: "组装每步模型提示词。", enabled: true },
  terminal: { zh: "终端", desc: "交互式终端会话。", enabled: true },
  "terminal-bash": { zh: "终端 Bash", desc: "Bash 终端实现。", enabled: true },
  "time-context": { zh: "时间上下文", desc: "时间信息注入。", enabled: true },
  timeout: { zh: "超时策略", desc: "工具调用超时控制。", enabled: true },
  "tmux-context": { zh: "Tmux 上下文", desc: "Tmux 上下文信息。", enabled: true },
  "token-meter": { zh: "令牌计量", desc: "token 用量估算。", enabled: true },
  "tool-ask-user": { zh: "提问工具", desc: "向用户提问的工具。", enabled: true },
  "tool-bash": { zh: "终端工具", desc: "终端命令工具。", enabled: true },
  "tool-bash-persistent": { zh: "持久终端工具", desc: "持久化终端会话工具。", enabled: true },
  "tool-call-timeout-policy": { zh: "调用超时策略", desc: "工具调用超时策略。", enabled: true },
  "tool-cordis": { zh: "插件工具", desc: "动态插件管理工具。", enabled: true },
  "tool-fs": { zh: "文件工具", desc: "文件读写编辑等工具。", enabled: true },
  "tool-fs-search": { zh: "搜索工具", desc: "文件内容搜索工具。", enabled: true },
  "tool-goal": { zh: "目标工具", desc: "长期目标管理工具。", enabled: true },
  "tool-jobs": { zh: "任务工具", desc: "后台任务管理工具。", enabled: true },
  "tool-pwsh": { zh: "PowerShell 工具", desc: "PowerShell 命令工具。", enabled: true },
  "tool-ralph": { zh: "拉尔夫工具", desc: "拉尔夫循环工具。", enabled: true },
  tools: { zh: "工具系统", desc: "工具注册与执行管道。", enabled: true },
  "tool-skill": { zh: "技能工具", desc: "加载技能的工具。", enabled: true },
  "tool-str-replace-editor": { zh: "替换编辑工具", desc: "字符串替换编辑工具。", enabled: true },
  "tool-subagent": { zh: "子代理工具", desc: "委托子代理的工具。", enabled: true },
  "tool-subagent-control": { zh: "子代理控制工具", desc: "中断子代理等控制工具。", enabled: true },
  "tool-subagent-report": { zh: "子代理报告工具", desc: "子代理报告工具。", enabled: true },
  "tool-todo": { zh: "任务清单工具", desc: "任务清单工具。", enabled: true },
  "tool-web": { zh: "网络工具", desc: "联网搜索抓取工具。", enabled: true },
  "tool-workflow": { zh: "工作流工具", desc: "工作流编排工具。", enabled: true },
  "typert-loader": { zh: "类型加载器", desc: "接口类型的动态加载。", enabled: true },
  "typert-protocol": { zh: "类型协议", desc: "远程调用协议定义。", enabled: true },
  "typert-registry": { zh: "类型注册表", desc: "接口类型的注册与解析。", enabled: true },
  "user-approval": { zh: "审批", desc: "操作审批流程。", enabled: true },
  "user-questions": { zh: "用户提问", desc: "向用户提问的服务。", enabled: true },
  "web-app": { zh: "Web 应用", desc: "Web 应用组装。", enabled: true },
  "web-frontend": { zh: "Web 前端", desc: "前端资源构建与提供。", enabled: true },
  "web-search-deepseek": { zh: "DeepSeek 搜索", desc: "DeepSeek 网页搜索提供方。", enabled: true },
  workflow: { zh: "工作流", desc: "多代理工作流引擎。", enabled: true },
  "workflow-worker-thread": { zh: "工作流线程", desc: "工作流运行线程实现。", enabled: true },
  workspace: { zh: "工作区", desc: "工作区注册与目录。", enabled: true },
  cordis: { zh: "Cordis 框架", desc: "插件框架核心。", enabled: true },
  group: { zh: "插件分组", desc: "插件分组管理。", enabled: true },
  include: { zh: "插件包含", desc: "插件配置文件包含。", enabled: true },
  loader: { zh: "插件加载器", desc: "插件加载与生命周期。", enabled: true },
  timer: { zh: "计时器", desc: "定时器服务。", enabled: true },
  dsh: { zh: "DSH 主包", desc: "DeepSeek Harness 主包。", enabled: true }
};

// ================= 默认 Agent 预设汉化字典（settings.yaml 的 gui-hanhua.presets 段） =================
const DEFAULT_PRESETS = {
  "anchored-standard": { zh: "锚定标准模式（实验）", desc: "以极简预设的真实工具对启动（持久 bash + str_replace_editor），首个持久工具调用或回复后解锁完整标准能力。", enabled: true },
  "zero-anchored-standard": { zh: "零锚定标准模式（实验）", desc: "注入一轮零工具锚定轮（固定用户消息），从下一轮起解锁完整标准工具。", enabled: true },
  "router-standard": { zh: "路由标准模式（实验）", desc: "按任务类型路由——修复走计划（spec），构建走执行（doer）；首个工具调用后解锁完整标准工具。", enabled: true },
  "v4-flash-godmode-opencode-go": { zh: "Flash 路由（opencode-go）", desc: "Flash 专属路由：按任务类型（构建/修复）内部路由，neutral 人设 + 分类引导 + 回顾锚 + 反跑题锚。", enabled: true },
  "warmupbetter": { zh: "预热增强", desc: "预热轮要求模型尽可能长时间预热思维链，并在正式提示词到达前列出自提醒。", enabled: true },
  "warmupbetter-replay": { zh: "预热增强·回放", desc: "第一轮的思维链与回复回放已记录的预热输出，下一轮以完整标准能力运行。", enabled: true },
  "whoami-standard": { zh: "Whoami 标准（实验）", desc: "在空工具面上播种一轮固定的「你是谁」自我介绍，用户首条真实消息后解锁常驻完整能力。", enabled: true },
  "minimal-gitbash": { zh: "极简模式（Git Bash）", desc: "极简模式的 Windows 变体：bash 映射到 Git for Windows 的 bash（MSYS）。", enabled: true },
  "minimal-win": { zh: "极简模式（Windows）", desc: "官方极简模式的 Windows 版：bash 替换为 PowerShell，pwsh + str_replace_editor 双工具。", enabled: true }
};

// ================= settings schema（磁盘持久化） =================
const entry = z.object({ zh: z.string(), desc: z.string(), enabled: z.boolean() });
// schema 构建绝不抛错：模块加载期任何异常都会导致宿主插件加载失败 → dsh 启动崩溃。
// 注意：schemastery 版本不支持 .partial()（会导致 z.object(...).partial is not a function）。
let schema;
try {
  schema = z.object({
    flags: z.object({
      master: z.boolean().default(true),
      persist: z.boolean().default(true),
      toolCards: z.boolean().default(true),
      pluginList: z.boolean().default(true),
      commandMenu: z.boolean().default(true),
      agentPreset: z.boolean().default(true)
    }),
    tools: z.dict(entry),
    plugins: z.dict(entry),
    commands: z.dict(entry),
    presets: z.dict(entry),
    // 版本更新检查状态（host 写入；client 读取展示并触发确认）。
    // 字段全部带默认值：缺失时自动填充，保证任意部分写入都可通过校验。
    updateCheck: z.object({
      status: z.string().default(""),
      remoteVersion: z.string().default(""),
      localVersion: z.string().default(""),
      checkedAt: z.number().default(0),
      message: z.string().default(""),
      trigger: z.number().default(0),
      confirmAt: z.number().default(0),
      confirmVersion: z.string().default("")
    })
  });
} catch (error) {
  // 兜底：任何 schema 构建失败都退回宽松结构，保证插件始终可加载、GUI 永不因本插件崩溃
  console.warn("[gui-hanhua] schema 构建失败，使用宽松兜底结构: " + String(error?.message ?? error));
  schema = z.object({
    flags: z.object({
      master: z.boolean().default(true),
      persist: z.boolean().default(true),
      toolCards: z.boolean().default(true),
      pluginList: z.boolean().default(true),
      commandMenu: z.boolean().default(true),
      agentPreset: z.boolean().default(true)
    }),
    tools: z.dict(entry),
    plugins: z.dict(entry),
    commands: z.dict(entry),
    presets: z.dict(entry)
  });
}

// 构建命令双语字典（命令名保持英文，只映射中文描述/参数提示）
function buildCommandDict(commands) {
  const dict = {};
  if (commands && typeof commands === "object" && !Array.isArray(commands)) {
    for (const name of Object.keys(commands)) {
      const e = commands[name];
      if (e && typeof e === "object" && e.enabled !== false) {
        dict[name] = {
          desc: typeof e.desc === "string" ? e.desc : "",
          hint: typeof e.hint === "string" ? e.hint : "",
          enabled: true
        };
      }
    }
  }
  return dict;
}

// 命令字典文件（profiles 根目录，patch 钩子经注入的读取函数读取）
// 插件位于 profiles/<profile>/node_modules/dsh-gui-hanhua/ → 向上三级即 profiles 根
const __pluginDir = dirname(fileURLToPath(import.meta.url));
const COMMAND_DICT_FILE = join(__pluginDir, "..", "..", "..", "gui-hanhua-command-dict.json");

// ================= 版本检查与自动更新 =================
// 数据源：GitHub 仓库 raw 文件；版本号以仓库 package.json 的 version 为准。
// 发布流程：修改代码 → 提升 package.json 的 version → 推送 GitHub → 用户端自动识别并更新。
const UPDATE_SOURCE = "https://raw.githubusercontent.com/XIZRSAMS/dsh-gui-hanhua/main";
const UPDATE_FILES = ["client.js", "index.js", "package.json", "vendor/dsh-commands-hanhua.js", "vendor/dsh-settings-expose.js"];
const PROFILES_ROOT = join(__pluginDir, "..", "..", "..");
const PROFILE_TARGETS = ["web-desktop", "web"].map((p) => join(PROFILES_ROOT, p, "node_modules", "dsh-gui-hanhua"));

// 本地版本（读部署目录的 package.json，与 GitHub 仓库同步维护）
function readLocalVersion() {
  try {
    const pkg = JSON.parse(readFileSync(join(__pluginDir, "package.json"), "utf8"));
    return typeof pkg.version === "string" && pkg.version ? pkg.version : "0.0.0";
  } catch { return "0.0.0"; }
}
// semver 比较：a<b → -1；a>b → 1；相等 → 0
function compareVersions(a, b) {
  const pa = String(a || "0").split(".").map(Number);
  const pb = String(b || "0").split(".").map(Number);
  const len = Math.max(pa.length, pb.length);
  for (let i = 0; i < len; i++) {
    const x = pa[i] || 0, y = pb[i] || 0;
    if (x < y) return -1;
    if (x > y) return 1;
  }
  return 0;
}
// 下载 GitHub raw 文件（文本）
async function downloadRaw(path) {
  const res = await fetch(UPDATE_SOURCE + "/" + path);
  if (!res.ok) throw new Error("下载 " + path + " 失败: HTTP " + res.status);
  const text = await res.text();
  if (!text || text.length < 100) throw new Error("下载内容为空: " + path);
  return text;
}
// 检查更新：对比远程版本，把状态写入 settings（client 读取展示）
async function checkForUpdate(ctx) {
  try {
    const pkgText = await downloadRaw("package.json");
    const pkg = JSON.parse(pkgText);
    const remote = typeof pkg.version === "string" ? pkg.version : "0.0.0";
    const local = readLocalVersion();
    const cmp = compareVersions(local, remote);
    const status = cmp < 0 ? "update-available" : cmp > 0 ? "ahead" : "current";
    await ctx.settings.update(NS, {
      updateCheck: {
        status, remoteVersion: remote, localVersion: local, checkedAt: Date.now(),
        message: cmp < 0 ? "发现新版本" : cmp > 0 ? "本地版本领先于仓库" : "已是最新版本"
      }
    });
  } catch (error) {
    await ctx.settings.update(NS, {
      updateCheck: { status: "check-failed", checkedAt: Date.now(), message: String(error?.message ?? error) }
    });
  }
}
// 执行更新：下载全部运行文件 → 校验 → 备份 → 覆盖两个 profile
async function performUpdate(ctx, targetVersion) {
  try {
    await ctx.settings.update(NS, {
      updateCheck: { status: "updating", remoteVersion: targetVersion, localVersion: readLocalVersion(), checkedAt: Date.now(), message: "正在下载并应用更新…" }
    });
    const downloads = {};
    for (const f of UPDATE_FILES) downloads[f] = await downloadRaw(f);
    // 校验：package.json 可解析且带 version；核心文件有足够内容
    const pkg = JSON.parse(downloads["package.json"]);
    if (!pkg.version) throw new Error("远程 package.json 缺少 version 字段");
    if (downloads["client.js"].length < 1000 || downloads["index.js"].length < 1000) throw new Error("核心文件下载不完整");
    // 备份 + 覆盖两个 profile
    let covered = 0;
    for (const base of PROFILE_TARGETS) {
      if (!existsSync(base)) continue;
      for (const f of UPDATE_FILES) {
        const full = join(base, f);
        try { if (existsSync(full)) copyFileSync(full, full + ".bak"); } catch { /* 备份失败不阻断 */ }
        mkdirSync(dirname(full), { recursive: true });
        writeFileSync(full, downloads[f], "utf8");
      }
      covered++;
    }
    if (covered === 0) throw new Error("未找到可更新的部署目录（两个 profile 均不存在）");
    await ctx.settings.update(NS, {
      updateCheck: {
        status: "updated", remoteVersion: pkg.version, localVersion: pkg.version, checkedAt: Date.now(),
        message: "更新完成（v" + pkg.version + "），请重启应用生效"
      }
    });
  } catch (error) {
    await ctx.settings.update(NS, {
      updateCheck: { status: "update-failed", checkedAt: Date.now(), message: "更新失败：" + String(error?.message ?? error) }
    });
  }
}

// 首次读取时写入默认字典（settings 文档为空时）
export function apply(ctx) {
  const reg = ctx.settings.register(NS, schema);
  ensureSettingsNamespaceExposed(ctx, "gui-hanhua", ctx.logger);
  // 命令面板汉化钩子（幂等 patch dsh-commands；失败只告警，不影响其他汉化）
  ensureCommandsHanhuaPatched(ctx, ctx.logger);
  // 命令汉化字典经「文件 + 注入读取函数」通道提供给 dsh-commands 的 patch 钩子：
  // 插件与 dsh-commands 可能不在同一加载上下文（4.1 桌面版），文件通道跨进程可靠。
  const refreshCommandDict = function () {
    try {
      const doc = ctx.settings.get(NS) ?? {};
      // 「命令面板汉化」开关：关闭时字典置空（钩子读到空 → 保持英文原样）
      const flags = (doc.flags && typeof doc.flags === "object") ? doc.flags : {};
      const commandMenuOn = flags.commandMenu !== false;
      const dict = commandMenuOn ? buildCommandDict(doc.commands) : {};
      // 1) 内存字典（兼容同上下文）
      globalThis.__guiHanhuaCommandDict = dict;
      // 2) 字典文件 + 读取函数（跨上下文）
      globalThis.__guiHanhuaDictFile = COMMAND_DICT_FILE;
      if (typeof globalThis.__guiHanhuaReadDict !== "function") {
        const readRequire = createRequire(import.meta.url);
        globalThis.__guiHanhuaReadDict = function (file) {
          try {
            const fs = readRequire("node:fs");
            const st = fs.statSync(file);
            const cached = globalThis.__guiHanhuaDictCache;
            if (cached && cached.file === file && cached.mtime === st.mtimeMs) return cached.dict;
            const dict = JSON.parse(fs.readFileSync(file, "utf8"));
            globalThis.__guiHanhuaDictCache = { file, mtime: st.mtimeMs, dict };
            return dict;
          } catch (e) { return undefined; }
        };
      }
      try {
        writeFileSync(COMMAND_DICT_FILE, JSON.stringify(dict), "utf8");
      } catch (error) {
        ctx.logger.warn?.("[gui-hanhua] 命令字典文件写入失败: " + String(error?.message ?? error));
      }
    } catch (error) {
      ctx.logger.warn?.("[gui-hanhua] 刷新命令字典失败: " + String(error?.message ?? error));
    }
  };
  refreshCommandDict();
  // 版本更新联动：client 写 updateCheck.trigger（请求检查）或 confirmAt/confirmVersion（确认更新）时处理
  let lastTrigger = 0, lastConfirmAt = 0;
  const handleUpdateCheck = function () {
    try {
      const doc = ctx.settings.get(NS) ?? {};
      const uc = (doc.updateCheck && typeof doc.updateCheck === "object") ? doc.updateCheck : {};
      if (typeof uc.trigger === "number" && uc.trigger > 0 && uc.trigger !== lastTrigger) {
        lastTrigger = uc.trigger;
        checkForUpdate(ctx);
      }
      if (typeof uc.confirmAt === "number" && uc.confirmAt > 0 && uc.confirmAt !== lastConfirmAt) {
        lastConfirmAt = uc.confirmAt;
        if (typeof uc.confirmVersion === "string" && uc.confirmVersion) performUpdate(ctx, uc.confirmVersion);
      }
    } catch (e) { ctx.logger.warn?.("[gui-hanhua] 更新检查处理失败: " + String(e?.message ?? e)); }
  };
  reg.watch(function () { refreshCommandDict(); handleUpdateCheck(); });
  // 初始化用 promise 链（不返回 Promise 作为 disposer），任何失败只告警，绝不抛给框架
  ctx.effect(function () {
    Promise.resolve()
      .then(function () {
        const doc = ctx.settings.get(NS) ?? {};
        // 防御：doc 的任何字段缺失/为空都用默认值补齐，最终写入完整结构
        const flags = (doc.flags && typeof doc.flags === "object") ? doc.flags : DEFAULT_FLAGS;
        const tools = (doc.tools && typeof doc.tools === "object" && Object.keys(doc.tools).length > 0) ? doc.tools : DEFAULT_TOOLS;
        const plugins = (doc.plugins && typeof doc.plugins === "object" && Object.keys(doc.plugins).length > 0) ? doc.plugins : DEFAULT_PLUGINS;
        const commands = (doc.commands && typeof doc.commands === "object" && Object.keys(doc.commands).length > 0) ? doc.commands : DEFAULT_COMMANDS;
        const presets = (doc.presets && typeof doc.presets === "object" && Object.keys(doc.presets).length > 0) ? doc.presets : DEFAULT_PRESETS;
        return ctx.settings.update(NS, {
          flags: { master: true, persist: true, toolCards: true, pluginList: true, commandMenu: true, agentPreset: true, ...flags },
          tools, plugins, commands, presets
        });
      })
      .catch(function (error) {
        ctx.logger.warn?.("[gui-hanhua] 初始化默认配置失败: " + String(error?.message ?? error));
      });
    // 启动后自动检查一次更新（延迟等待 settings 就绪；失败仅告警不影响启动）
    try {
      ctx.effect(function () {
        return ctx.timeout(function () { checkForUpdate(ctx); }, 6000);
      }, "gui-hanhua: 启动版本检查");
    } catch (e) { ctx.logger.warn?.("[gui-hanhua] 启动版本检查调度失败: " + String(e?.message ?? e)); }
  }, "gui-hanhua: 默认配置初始化");
}
