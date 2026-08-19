/**
 * dsh-gui-hanhua — GUI可视信息汉化 V1.1（常驻版）浏览器半区。
 * Hand-written ModuleLoader bundle（与 dsh-tool-vision 相同模式，无需构建步骤）。
 *
 * ============ 开源扩展指南（欢迎二次开发）============
 * 本插件将开源到 GitHub。所有"活代码"（可修改点）集中如下：
 *   1. 默认翻译字典：DEFAULT_TOOLS / DEFAULT_COMMANDS / DEFAULT_PLUGINS
 *      （新增工具/命令/插件的中文名与说明，直接在此追加条目）。
 *   2. 汉化生效开关：normalizeConfig 的 flags 归一化 + SettingsSection 概览的 SwitchRow。
 *   3. 翻译字典编辑：EntryRow / NewEntryForm（搜索、增删改、启用/禁用）。
 *   4. 命令面板双语：host 端 vendor/dsh-commands-hanua.js（dsh-commands 的 list() 钩子）。
 *   5. 权限选项双语：globalThis.__guiHanhuaPermissionDict（composer 与设置页选项）。
 *   6. AI 智能功能：runAiTask（"自动识别"/"AI 自检"——打开新对话自动发送任务提示词），
 *      提示词模板 buildAutoPrompt / buildSelfCheckPrompt，可自由定制任务指令。
 *   7. 界面文案：全部集中在 CSS 变量与 h(...) 调用中，无外部资源依赖。
 * 部署方式：复制本目录到 profiles/<profile>/node_modules/dsh-gui-hanhua/，
 * 并在 profiles/<profile>/cordis.patch.yml 注册（- id: gui-hanhua, name: 'dsh-gui-hanhua'）。
 * 注意：修改后无需构建（纯手写 bundle），刷新页面即生效（client 端）。
 */
window.__ModuleLoader__.load({
  id: "dsh-gui-hanhua",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
    Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
    var react = require("react");
    var h = react.createElement;

    // ================= CSS（主题变量，明暗自适应） =================
    var CSS = ".__gh_welcome{display:flex;flex-direction:column;gap:10px;border:1px solid var(--dsw-alias-border-l1);border-radius:12px;padding:14px 16px;background:linear-gradient(135deg,color-mix(in srgb,var(--dsw-alias-brand-primary) 8%,var(--dsw-alias-bg-layer-1)) 0%,var(--dsw-alias-bg-layer-1) 55%)}" +
      ".__gh_settings{display:flex;flex-direction:column;gap:14px;width:100%;max-width:760px;color:var(--dsw-alias-label-primary)}" +
      ".__gh_hero{border-radius:12px;padding:16px 18px;border:1px solid var(--dsw-alias-border-l1);background-image:linear-gradient(color-mix(in srgb,var(--dsw-alias-brand-primary) 7%,transparent) 1px,transparent 1px),linear-gradient(90deg,color-mix(in srgb,var(--dsw-alias-brand-primary) 7%,transparent) 1px,transparent 1px);background-size:22px 22px;background-color:color-mix(in srgb,var(--dsw-alias-brand-primary) 5%,var(--dsw-alias-bg-layer-1));position:relative;overflow:hidden}" +
      ".__gh_hero:after{content:\"\";position:absolute;top:-40px;right:-40px;width:120px;height:120px;border-radius:50%;background:radial-gradient(circle,color-mix(in srgb,var(--dsw-alias-brand-primary) 22%,transparent),transparent 70%);pointer-events:none}" +
      ".__gh_hero-title{font-size:16px;font-weight:700;letter-spacing:.3px;color:var(--dsw-alias-label-primary)}" +
      ".__gh_hero-sub{font-size:12px;color:var(--dsw-alias-label-secondary);margin-top:2px}" +
      ".__gh_tabs{display:flex;gap:4px;border-bottom:1px solid var(--dsw-alias-border-l1);padding-bottom:8px}" +
      ".__gh_tab{border:1px solid transparent;background:transparent;color:var(--dsw-alias-label-secondary);font:inherit;font-size:13px;padding:5px 12px;border-radius:7px;cursor:pointer;transition:background .15s,color .15s}" +
      ".__gh_tab:hover{color:var(--dsw-alias-label-primary)}" +
      ".__gh_tab.is-active{color:var(--dsw-alias-label-primary);background:color-mix(in srgb,var(--dsw-alias-brand-primary) 13%,transparent);border-color:color-mix(in srgb,var(--dsw-alias-brand-primary) 30%,transparent)}" +
      ".__gh_section{display:flex;flex-direction:column;gap:12px}" +
      ".__gh_stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}" +
      ".__gh_stat{border:1px solid var(--dsw-alias-border-l1);border-radius:10px;padding:12px;background:var(--dsw-alias-bg-layer-1);display:flex;flex-direction:column;gap:2px}" +
      ".__gh_stat b{font-size:20px;font-weight:700;font-variant-numeric:tabular-nums;color:var(--dsw-alias-label-primary)}" +
      ".__gh_stat span{font-size:11.5px;color:var(--dsw-alias-label-tertiary)}" +
      ".__gh_cards{display:flex;flex-direction:column;gap:10px}" +
      ".__gh_switch-row{display:flex;align-items:center;justify-content:space-between;gap:12px;border:1px solid var(--dsw-alias-border-l1);border-radius:10px;padding:12px 14px;background:var(--dsw-alias-bg-layer-1);cursor:default}" +
      ".__gh_switch-row.is-primary{border-color:color-mix(in srgb,var(--dsw-alias-brand-primary) 45%,var(--dsw-alias-border-l1));background:linear-gradient(135deg,color-mix(in srgb,var(--dsw-alias-brand-primary) 9%,var(--dsw-alias-bg-layer-1)) 0%,var(--dsw-alias-bg-layer-1) 60%)}" +
      ".__gh_switch-text{display:flex;flex-direction:column;gap:2px;min-width:0}" +
      ".__gh_switch-label{font-size:13px;font-weight:600;color:var(--dsw-alias-label-primary)}" +
      ".__gh_switch-hint{font-size:11.5px;color:var(--dsw-alias-label-tertiary)}" +
      ".__gh_switch{position:relative;flex:none;width:38px;height:21px;border-radius:999px;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-2);cursor:pointer;padding:0;transition:background .15s,border-color .15s}" +
      ".__gh_switch span{position:absolute;top:2px;left:2px;width:15px;height:15px;border-radius:50%;background:var(--dsw-alias-label-tertiary);transition:transform .15s,background .15s}" +
      ".__gh_switch.is-on{background:color-mix(in srgb,var(--dsw-alias-brand-primary) 28%,var(--dsw-alias-bg-layer-2));border-color:var(--dsw-alias-brand-primary)}" +
      ".__gh_switch.is-on span{transform:translateX(17px);background:var(--dsw-alias-brand-primary);box-shadow:0 0 8px color-mix(in srgb,var(--dsw-alias-brand-primary) 60%,transparent)}" +
      ".__gh_note{font-size:12px;color:var(--dsw-alias-label-tertiary);line-height:19px;margin:0}" +
      ".__gh_hint{font-size:12px;color:var(--dsw-alias-label-secondary)}" +
      ".__gh_hint-inline{font-size:11.5px;color:var(--dsw-alias-state-warn-primary)}" +
      ".__gh_search{position:relative;display:flex;align-items:center;color:var(--dsw-alias-label-tertiary)}" +
      ".__gh_search-icon{position:absolute;left:12px;font-size:15px;pointer-events:none}" +
      ".__gh_search input{width:100%;height:36px;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);font:inherit;font-size:13px;border-radius:8px;outline:none;padding:0 12px 0 34px}" +
      ".__gh_search input:focus-visible{border-color:var(--dsw-alias-brand-primary);box-shadow:0 0 0 2px color-mix(in srgb,var(--dsw-alias-brand-primary) 18%,transparent)}" +
      ".__gh_list{display:flex;flex-direction:column;gap:10px}" +
      ".__gh_entry{border:1px solid var(--dsw-alias-border-l1);border-radius:10px;padding:12px;background:var(--dsw-alias-bg-layer-1);display:flex;flex-direction:column;gap:8px}" +
      ".__gh_entry-head{display:flex;align-items:center;justify-content:space-between;gap:10px}" +
      ".__gh_code{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:12px;color:color-mix(in srgb,var(--dsw-alias-brand-primary) 70%,var(--dsw-alias-label-primary));background:color-mix(in srgb,var(--dsw-alias-brand-primary) 10%,transparent);padding:2px 7px;border-radius:5px;word-break:break-all}" +
      ".__gh_check{display:inline-flex;align-items:center;gap:5px;font-size:12px;color:var(--dsw-alias-label-secondary);cursor:pointer}" +
      ".__gh_entry-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}" +
      ".__gh_input{height:32px;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);font:inherit;font-size:12.5px;border-radius:7px;outline:none;padding:0 10px;min-width:0}" +
      ".__gh_input:focus-visible{border-color:var(--dsw-alias-brand-primary);box-shadow:0 0 0 2px color-mix(in srgb,var(--dsw-alias-brand-primary) 15%,transparent)}" +
      ".__gh_entry-actions{display:flex;align-items:center;gap:8px}" +
      ".__gh_btn{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);font:inherit;font-size:12.5px;border-radius:7px;padding:5px 14px;cursor:pointer;transition:border-color .15s,box-shadow .15s}" +
      ".__gh_btn:hover:not(:disabled){border-color:var(--dsw-alias-brand-primary)}" +
      ".__gh_btn:disabled{opacity:.45;cursor:default}" +
      ".__gh_btn.primary{border-color:color-mix(in srgb,var(--dsw-alias-brand-primary) 55%,transparent);background:color-mix(in srgb,var(--dsw-alias-brand-primary) 16%,var(--dsw-alias-bg-layer-2))}" +
      ".__gh_btn.danger{border-color:color-mix(in srgb,var(--dsw-alias-state-error-primary) 50%,transparent);color:var(--dsw-alias-state-error-primary)}" +
      ".__gh_new{border:1px dashed var(--dsw-alias-border-l2);border-radius:10px;padding:12px;display:flex;flex-direction:column;gap:8px}" +
      ".__gh_textarea{width:100%;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);font:inherit;font-size:12px;border-radius:8px;outline:none;padding:10px;resize:vertical;box-sizing:border-box}" +
      ".__gh_textarea:focus-visible{border-color:var(--dsw-alias-brand-primary)}" +
      ".__gh_data-row{display:flex;align-items:center;justify-content:space-between;gap:12px}" +
      ".__gh_data-info h4{margin:0;font-size:13px;color:var(--dsw-alias-label-primary)}" +
      ".__gh_data-info p{margin:3px 0 0;font-size:12px;color:var(--dsw-alias-label-tertiary);line-height:18px}" +
      ".__gh_help h4{margin:0 0 4px;font-size:13px;color:var(--dsw-alias-label-primary)}" +
      ".__gh_help p{margin:0 0 10px;font-size:12.5px;line-height:20px;color:var(--dsw-alias-label-secondary)}" +
      ".__gh_panel{display:flex;flex-direction:column;gap:14px;width:100%;max-width:760px;color:var(--dsw-alias-label-primary)}" +
      ".__gh_status{color:var(--dsw-alias-label-tertiary);font-size:13px;line-height:20px;margin:0}" +
      ".__gh_failure{color:var(--dsw-alias-state-error-primary);font-size:13px;display:flex;align-items:center;gap:10px}" +
      ".__gh_failure p{margin:0}" +
      ".__gh_failure button{border:1px solid var(--dsw-alias-border-l2);color:var(--dsw-alias-label-primary);font:inherit;cursor:pointer;background:transparent;border-radius:6px;padding:4px 10px}" +
      ".__gh_heading{display:flex;align-items:baseline;gap:7px;padding:0 2px}" +
      ".__gh_heading h3{margin:0;font-size:13px;font-weight:600}" +
      ".__gh_heading span{color:var(--dsw-alias-label-tertiary);font-variant-numeric:tabular-nums;font-size:12px}" +
      ".__gh_cards2{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));align-items:start;gap:10px;margin:0;padding:0;list-style:none}" +
      ".__gh_pcard{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);border-radius:10px;min-width:0;overflow:hidden}" +
      ".__gh_pcard[data-open=true]{border-color:color-mix(in srgb,var(--dsw-alias-brand-primary) 40%,var(--dsw-alias-border-l1));box-shadow:0 0 0 1px color-mix(in srgb,var(--dsw-alias-brand-primary) 15%,transparent),0 2px 10px color-mix(in srgb,var(--dsw-alias-brand-primary) 8%,transparent)}" +
      ".__gh_pcard-head{display:flex;align-items:center;gap:8px;width:100%;border:none;background:transparent;padding:11px 12px;cursor:pointer;text-align:left;font:inherit;color:inherit;min-width:0}" +
      ".__gh_pcard-title{font-size:13px;font-weight:600;color:var(--dsw-alias-label-primary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0}" +
      ".__gh_pcard-en{font-size:11px;color:var(--dsw-alias-label-tertiary);font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;flex:none}" +
      ".__gh_pcard-unt{flex:none;font-size:10px;border:1px solid color-mix(in srgb,var(--dsw-alias-state-warn-primary) 45%,transparent);color:var(--dsw-alias-state-warn-primary);border-radius:4px;padding:1px 5px}" +
      ".__gh_pcard-trailing{margin-left:auto;display:flex;align-items:center;gap:7px;flex:none}" +
      ".__gh_pcard-tag{font-size:11px;border-radius:5px;padding:1px 7px}" +
      ".__gh_pcard-tag[data-enabled=true]{color:var(--dsw-alias-state-success-primary);background:color-mix(in srgb,var(--dsw-alias-state-success-primary) 12%,transparent)}" +
      ".__gh_pcard-tag[data-enabled=false]{color:var(--dsw-alias-label-tertiary);background:var(--dsw-alias-bg-layer-2)}" +
      ".__gh_pcard-details{display:flex;flex-direction:column;gap:8px;padding:0 12px 12px}" +
      ".__gh_dl{margin:0;display:flex;flex-direction:column;gap:4px}" +
      ".__gh_dl>div{display:flex;gap:8px;font-size:12px}" +
      ".__gh_dl dt{color:var(--dsw-alias-label-tertiary);flex:none}" +
      ".__gh_dl dd{margin:0;color:var(--dsw-alias-label-secondary);min-width:0;word-break:break-word}" +
      ".__gh_tool{display:flex;flex-direction:column;border:1px solid var(--dsw-alias-border-l1);border-radius:8px;margin:2px 0;background:var(--dsw-alias-bg-layer-1);overflow:hidden}" +
      ".__gh_tool[data-state=running]{border-color:color-mix(in srgb,var(--dsw-alias-state-warn-primary) 40%,var(--dsw-alias-border-l1))}" +
      ".__gh_tool[data-state=error]{border-color:color-mix(in srgb,var(--dsw-alias-state-error-primary) 45%,var(--dsw-alias-border-l1))}" +
      ".__gh_tool-row{display:flex;align-items:center;gap:8px;padding:8px 12px;cursor:pointer;min-width:0;user-select:none}" +
      ".__gh_tool-row:hover{background:color-mix(in srgb,var(--dsw-alias-brand-primary) 5%,transparent)}" +
      ".__gh_dot{width:8px;height:8px;border-radius:50%;flex:none;background:var(--dsw-alias-label-tertiary)}" +
      ".__gh_dot[data-state=running]{background:var(--dsw-alias-state-warn-primary);animation:__gh_pulse 1.2s ease-in-out infinite}" +
      ".__gh_dot[data-state=ok]{background:var(--dsw-alias-state-success-primary)}" +
      ".__gh_dot[data-state=error]{background:var(--dsw-alias-state-error-primary)}" +
      ".__gh_dot[data-state=stopped]{background:var(--dsw-alias-state-warn-primary);opacity:.6}" +
      "@keyframes __gh_pulse{0%,100%{opacity:1}50%{opacity:.35}}" +
      ".__gh_tool-title{font-size:13px;font-weight:600;color:var(--dsw-alias-label-primary);flex:none}" +
      ".__gh_tool-en{font-size:11px;color:var(--dsw-alias-label-tertiary);font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;flex:none}" +
      ".__gh_tool-summary{font-size:12px;color:var(--dsw-alias-label-secondary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0}" +
      ".__gh_chevron{font-size:11px;color:var(--dsw-alias-label-tertiary);flex:none;transition:transform .15s}" +
      ".__gh_chevron[data-open=true]{transform:rotate(180deg)}" +
      ".__gh_filelink{border:none;background:transparent;color:var(--dsw-alias-brand-primary);font:inherit;font-size:12px;text-align:left;padding:0 12px 8px;cursor:pointer;text-decoration:underline;text-underline-offset:2px;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}" +
      ".__gh_tool-body{display:flex;flex-direction:column;gap:8px;padding:0 12px 12px}" +
      ".__gh_tool-desc{font-size:12px;color:var(--dsw-alias-label-tertiary);line-height:18px}" +
      ".__gh_io{display:grid;grid-template-columns:max-content 1fr;column-gap:12px;align-items:baseline;max-height:160px;overflow-y:auto;border:1px solid var(--dsw-alias-border-l1);border-radius:8px;padding:8px 12px;background:var(--dsw-alias-bg-layer-2)}" +
      ".__gh_io-label{font-size:10px;font-weight:700;color:var(--dsw-alias-label-tertiary);position:sticky;top:0;align-self:start}" +
      ".__gh_io-text{margin:0;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:11.5px;line-height:17px;white-space:pre-wrap;word-break:break-word;color:var(--dsw-alias-label-secondary);min-width:0}" +
      ".__gh_io-text[data-error=true]{color:var(--dsw-alias-state-error-primary)}" +
      ".__gh_io-divider{height:1px;background:var(--dsw-alias-border-l2);flex:none}" +
      ".__gh_inspect{align-self:flex-start;border:1px solid var(--dsw-alias-border-l2);background:transparent;color:var(--dsw-alias-label-secondary);font:inherit;font-size:12px;border-radius:6px;padding:4px 12px;cursor:pointer}" +
      ".__gh_inspect:hover{border-color:var(--dsw-alias-brand-primary);color:var(--dsw-alias-label-primary)}" +
      ".__gh_fallback{font-size:12px;color:var(--dsw-alias-label-tertiary);padding:8px 12px;border:1px dashed var(--dsw-alias-border-l2);border-radius:8px;margin:2px 0}" +
      ".__gh_cmdrow{display:flex;align-items:center;gap:8px;border:1px solid var(--dsw-alias-border-l1);border-radius:8px;margin:2px 0;padding:8px 12px;background:var(--dsw-alias-bg-layer-1);min-width:0}" +
      ".__gh_cmdrow-name{flex:none;font-weight:600;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:12px;color:var(--dsw-alias-label-primary)}" +
      ".__gh_cmdrow-zh{flex:none;font-size:13px;font-weight:600;color:var(--dsw-alias-label-primary)}" +
      ".__gh_cmdrow-desc{font-size:12px;color:var(--dsw-alias-label-secondary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0}" +
      // ===== AI 智能功能（自动识别 / AI 自检）样式 =====
      ".__gh_ai{border:1px solid color-mix(in srgb,var(--dsw-alias-brand-primary) 30%,var(--dsw-alias-border-l1));border-radius:10px;padding:12px 14px;display:flex;flex-direction:column;gap:8px;background:linear-gradient(135deg,color-mix(in srgb,var(--dsw-alias-brand-primary) 7%,var(--dsw-alias-bg-layer-1)) 0%,var(--dsw-alias-bg-layer-1) 60%)}" +
      ".__gh_ai-title{font-size:13px;font-weight:700;color:var(--dsw-alias-label-primary)}" +
      ".__gh_ai-actions{display:flex;gap:8px;align-items:center}" +
      ".__gh_ai-hint{font-size:11.5px;color:var(--dsw-alias-label-tertiary);line-height:17px;margin:0}" +
      ".__gh_ai-hint p{margin:0;font-size:11.5px;color:var(--dsw-alias-label-tertiary);line-height:17px}" +
      ".__gh_ai-status{font-size:12px;color:var(--dsw-alias-state-warn-primary);margin:0}";
    var tagId = "dsh-gui-hanhua/main.css";
    if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
      var tag = document.createElement("style");
      tag.dataset.plugin = "dsh-gui-hanhua";
      tag.dataset.pluginCss = tagId;
      tag.textContent = CSS;
      document.head.appendChild(tag);
    }

var DEFAULT_TOOLS = {
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

var DEFAULT_COMMANDS = {
  plan: { zh: "计划", desc: "进入或退出计划模式（先规划后执行）。", enabled: true },
  compact: { zh: "压缩", desc: "手动压缩当前会话的上下文。", enabled: true },
  goal: { zh: "目标", desc: "管理当前会话的长期目标。", enabled: true },
  feedback: { zh: "反馈", desc: "提交消息反馈。", enabled: true }
};

var DEFAULT_PLUGINS = {
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

    // ================= 工具函数 =================
    function moduleShortName(moduleName) {
      return (moduleName.startsWith("@") ? moduleName.slice(moduleName.indexOf("/") + 1) : moduleName)
        .replace(/^cordis:/, "").replace(/^cordis-plugin-/, "").replace(/^dsh-(?:host-|client-)?/, "");
    }
    function firstLine(text) { var i = text.indexOf("\n"); return i === -1 ? text : text.slice(0, i); }
    function pickString(obj, keys) { for (var k = 0; k < keys.length; k++) { var v = obj[keys[k]]; if (typeof v === "string" && v !== "") return v; } return undefined; }
    var SUMMARY_KEYS = {
      bash: ["description", "command"], pwsh: ["description", "command"], read: ["path", "file_path", "url"],
      write: ["path", "file_path"], edit: ["path", "file_path"], web_search: ["query"], web_fetch: ["url"],
      grep: ["pattern"], glob: ["pattern"], skill: ["name"], job_output: ["job_id"], ask_user_question: ["question"]
    };
    function deriveSummary(toolName, argsRaw) {
      if (argsRaw === "") return "";
      try {
        var parsed = JSON.parse(argsRaw);
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
          var keys = SUMMARY_KEYS[toolName] || ["description", "path", "file_path", "pattern", "query", "command", "url", "name", "question", "objective"];
          var picked = pickString(parsed, keys);
          if (picked !== undefined) return firstLine(picked);
          for (var k in parsed) { if (typeof parsed[k] === "string" && parsed[k] !== "") return firstLine(parsed[k]); }
        }
      } catch (e) { /* 忽略 */ }
      return firstLine(argsRaw);
    }
    function resultText(node) {
      var parts = [];
      if (node && Array.isArray(node.content)) {
        for (var i = 0; i < node.content.length; i++) {
          var block = node.content[i];
          if (block && block.type === "text") parts.push(block.text);
          else if (block !== undefined) { try { parts.push(JSON.stringify(block, null, 2)); } catch (e) { } }
        }
      }
      if (parts.length === 0 && node && node.error) parts.push((node.error.name || "Error") + ": " + (node.error.code || "unknown"));
      return parts.join("\n");
    }
    function buildToolModel(toolName, block) {
      var okBlock = block !== null && typeof block === "object";
      var done = okBlock && "kind" in block;
      var argsRaw = done ? (block.call && block.call.argsRaw) : (okBlock ? block.argsRaw : undefined);
      var raw = typeof argsRaw === "string" ? argsRaw : "";
      var state = "running";
      if (done) state = block.error && block.error.code === "interrupted" ? "stopped" : block.isError ? "error" : "ok";
      var summary = deriveSummary(toolName, raw);
      var output = done ? resultText(block) : null;
      var filePath;
      if (raw !== "") {
        try {
          var parsed = JSON.parse(raw);
          if (parsed && typeof parsed === "object") {
            for (var i = 0; i < 2; i++) {
              var key = i === 0 ? "path" : "file_path";
              var v = parsed[key];
              if (typeof v === "string" && v !== "") { filePath = firstLine(v); break; }
            }
          }
        } catch (e) { /* 忽略 */ }
      }
      var body = null;
      if (raw !== "") { try { body = JSON.stringify(JSON.parse(raw), null, 2); } catch (e) { body = raw; } }
      return { state: state, summary: summary, output: output, filePath: filePath, body: body };
    }
    var PHASE_ZH = { pending: "等待依赖", loading: "加载中", active: "已挂载", failed: "挂载失败", unloading: "卸载中" };
    function phaseZh(phase) { return phase === null || phase === undefined ? "未挂载" : (PHASE_ZH[phase] || phase); }

    // ================= store（纯数据，UI 与注册从这里读） =================
    // 结构归一化：任何进入 store 的外部数据（settings 快照、导入 JSON）都必须
    // 补齐完整结构，绝不允许空对象 / 残缺对象覆盖默认值导致 cfg.flags 变 undefined。
    function normalizeConfig(v, useDefaults) {
      var o = v && typeof v === "object" && !Array.isArray(v) ? v : {};
      var flags = o.flags && typeof o.flags === "object" && !Array.isArray(o.flags) ? o.flags : {};
      var tools = o.tools && typeof o.tools === "object" && !Array.isArray(o.tools) ? o.tools : {};
      var plugins = o.plugins && typeof o.plugins === "object" && !Array.isArray(o.plugins) ? o.plugins : {};
      var commands = o.commands && typeof o.commands === "object" && !Array.isArray(o.commands) ? o.commands : {};
      var presets = o.presets && typeof o.presets === "object" && !Array.isArray(o.presets) ? o.presets : {};
      var updateCheck = o.updateCheck && typeof o.updateCheck === "object" && !Array.isArray(o.updateCheck) ? o.updateCheck : {};
      // useDefaults：空/残缺部分用内置默认字典兜底——启动竞态时空快照也绝不产生空 store，
      // 更不会让一次用户修改把磁盘上的完整字典覆盖成空。
      if (useDefaults) {
        if (!tools || Object.keys(tools).length === 0) tools = DEFAULT_TOOLS;
        if (!plugins || Object.keys(plugins).length === 0) plugins = DEFAULT_PLUGINS;
        if (!commands || Object.keys(commands).length === 0) commands = DEFAULT_COMMANDS;
      }
      return {
        flags: {
          master: flags.master === undefined ? true : !!flags.master,
          persist: flags.persist === undefined ? true : !!flags.persist,
          toolCards: flags.toolCards === undefined ? true : !!flags.toolCards,
          pluginList: flags.pluginList === undefined ? true : !!flags.pluginList,
          commandMenu: flags.commandMenu === undefined ? true : !!flags.commandMenu,
          agentPreset: flags.agentPreset === undefined ? true : !!flags.agentPreset
        },
        tools: tools,
        plugins: plugins,
        commands: commands,
        presets: presets,
        updateCheck: updateCheck
      };
    }
    function createStore() {
      var config = normalizeConfig(null, true);
      var listeners = new Set();
      return {
        get: function () { return config; },
        set: function (next) { config = normalizeConfig(next); listeners.forEach(function (l) { try { l(); } catch (e) { } }); },
        subscribe: function (l) { listeners.add(l); return function () { listeners.delete(l); }; }
      };
    }
    function useConfig(store) {
      var state = react.useState(0);
      var force = state[1];
      react.useEffect(function () { return store.subscribe(function () { force(function (v) { return v + 1; }); }); }, [store]);
      return store.get();
    }
    function shallowClone(v) { try { return JSON.parse(JSON.stringify(v)); } catch (e) { return {}; } }
    // 兼容新旧 settingsScope 快照形状：
    // - 旧版：getSnapshot() 直接返回文档 { flags, tools, plugins, commands }
    // - 4.1+：getSnapshot() 返回快照包装 { status, value, base, user, revision, writable, mode }，
    //   真正的文档在 value 里（status === "ready" 时才有值，loading/unavailable 时为 undefined）。
    function unwrapSnapshot(snap) {
      if (snap && typeof snap === "object" && !Array.isArray(snap) && "value" in snap &&
        ("status" in snap || "revision" in snap || "writable" in snap)) {
        return snap.value;
      }
      return snap;
    }

    // ================= 错误边界 =================
    var ErrorBoundary = (function () {
      function ErrorBoundary(props) {
        react.Component.call(this, props);
        this.state = { failed: false };
      }
      ErrorBoundary.prototype = Object.create(react.Component.prototype);
      ErrorBoundary.prototype.constructor = ErrorBoundary;
      ErrorBoundary.getDerivedStateFromError = function () { return { failed: true }; };
      ErrorBoundary.prototype.componentDidCatch = function (err) { if (this.props.onError) this.props.onError(err); };
      ErrorBoundary.prototype.render = function () {
        if (this.state.failed) return this.props.fallback ? this.props.fallback : null;
        return this.props.children;
      };
      return ErrorBoundary;
    })();
    var SAFE_FALLBACK = h("div", { className: "__gh_fallback" }, "汉化视图渲染出错，已跳过（原版显示不受影响）。");

    // ================= 工具卡片 =================
    function HanhuaToolCard(props) {
      var toolName = props.toolName, block = props.block, openFile = props.openFile, inspect = props.inspect, s = props.store;
      var cfg = useConfig(s);
      var entry = cfg.tools[toolName];
      var zh = entry && entry.zh ? entry.zh : toolName;
      var desc = entry && entry.desc ? entry.desc : "";
      var model = buildToolModel(toolName, block);
      var openState = react.useState(false);
      var open = openState[0], setOpen = openState[1];
      var expandable = model.body !== null || model.output !== null;
      var showFile = model.filePath && typeof openFile === "function";
      var onToggle = function () { if (expandable) setOpen(function (v) { return !v; }); };
      var onOpenFile = function (e) { e.stopPropagation(); if (model.filePath) openFile(model.filePath); };
      var summary = model.summary || toolName;
      return h("div", { className: "__gh_tool", "data-state": model.state, "data-tool": toolName },
        h("div", { className: "__gh_tool-row", onClick: onToggle },
          h("span", { className: "__gh_dot", "data-state": model.state, "aria-hidden": true }),
          h("span", { className: "__gh_tool-title" }, zh),
          h("span", { className: "__gh_tool-en" }, toolName),
          h("span", { className: "__gh_tool-summary" }, summary),
          expandable ? h("span", { className: "__gh_chevron", "data-open": open ? "true" : undefined }, "▾") : null),
        showFile ? h("button", { type: "button", className: "__gh_filelink", onClick: onOpenFile }, model.filePath) : null,
        open ? h("div", { className: "__gh_tool-body" },
          desc !== "" ? h("div", { className: "__gh_tool-desc" }, desc) : null,
          model.body !== null ? h("div", { className: "__gh_io" },
            h("span", { className: "__gh_io-label" }, "IN"),
            h("pre", { className: "__gh_io-text" }, model.body)) : null,
          model.body !== null && model.output !== null ? h("span", { className: "__gh_io-divider", "aria-hidden": true }) : null,
          model.output !== null ? h("div", { className: "__gh_io" },
            h("span", { className: "__gh_io-label" }, "OUT"),
            h("pre", { className: "__gh_io-text", "data-error": model.state === "error" ? "true" : undefined }, model.output)) : null,
          typeof inspect === "function" ? h("button", { type: "button", className: "__gh_inspect", onClick: inspect }, "检查详情") : null) : null);
    }

    // ================= 命令执行行 =================
    function HanhuaCommandRow(props) {
      var node = props.node, s = props.store;
      var cfg = useConfig(s);
      var name = node && typeof node.name === "string" ? node.name : "";
      var entry = name !== "" && cfg.commands && cfg.commands[name] ? cfg.commands[name] : null;
      var zh = entry && entry.zh ? entry.zh : name;
      var desc = entry && entry.desc ? entry.desc : "";
      return h("div", { className: "__gh_cmdrow", "data-command": name },
        h("span", { className: "__gh_cmdrow-name" }, "/" + name),
        h("span", { className: "__gh_cmdrow-zh" }, zh),
        desc !== "" ? h("span", { className: "__gh_cmdrow-desc" }, desc) : null);
    }

    // ================= 插件列表页 =================
    function HanhuaPluginListTab(props) {
      var s = props.store, load = props.listInventory;
      var cfg = useConfig(s);
      var st = react.useState({ status: "loading" });
      var state = st[0], setState = st[1];
      var qs = react.useState("");
      var query = qs[0], setQuery = qs[1];
      var es = react.useState(null);
      var expanded = es[0], setExpanded = es[1];
      var rs = react.useState(0);
      var request = rs[0], setRequest = rs[1];
      react.useEffect(function () {
        var current = true;
        load().then(function (r) {
          if (!current) return;
          if (r && r.ok && Array.isArray(r.entries)) setState({ status: "ready", entries: r.entries });
          else setState({ status: "error", error: (r && r.error) || "未知错误" });
        }, function (err) { if (current) setState({ status: "error", error: String((err && err.message) || err) }); });
        return function () { current = false; };
      }, [request, load]);
      var q = query.trim().toLocaleLowerCase();
      var entries = state.status === "ready"
        ? state.entries.filter(function (e) { return ((e.moduleName || "") + " " + (e.entryId || "")).toLocaleLowerCase().includes(q); })
        : [];
      var retry = function () { setState({ status: "loading" }); setRequest(function (v) { return v + 1; }); };
      return h("div", { className: "__gh_panel" },
        h("div", { className: "__gh_search" },
          h("span", { className: "__gh_search-icon", "aria-hidden": true }, "⌕"),
          h("input", { type: "search", value: query, placeholder: "搜索插件", "aria-label": "搜索插件", onChange: function (e) { setQuery(e.currentTarget.value); } })),
        state.status === "loading" ? h("p", { className: "__gh_status" }, "正在读取插件…") : null,
        state.status === "error" ? h("div", { className: "__gh_failure" },
          h("p", { role: "alert" }, "暂时无法读取插件清单：" + (state.error || "未知错误") + "（可到「GUI汉化设置 → 插件汉化」手动添加翻译）。"),
          h("button", { type: "button", onClick: retry }, "重试")) : null,
        state.status === "ready" ? h("div", null,
          h("div", { className: "__gh_heading" },
            h("h3", null, "插件列表"),
            h("span", null, entries.length)),
          entries.length === 0 ? h("p", { className: "__gh_status" }, "没有匹配的插件。") : null,
          entries.length > 0 ? h("ul", { className: "__gh_cards2" }, entries.map(function (entry) {
            var short = moduleShortName(entry.moduleName || "");
            var item = cfg.plugins[short] || cfg.plugins[entry.moduleName] || cfg.plugins[entry.entryId];
            var title = item && item.zh ? item.zh : short;
            var open = expanded === entry.entryId;
            var phase = phaseZh(entry.fiberPhase);
            var configZh = entry.enabled ? "已启用" : "已停用";
            return h("li", { className: "__gh_pcard", "data-open": open ? "true" : undefined, key: entry.entryId },
              h("button", { type: "button", className: "__gh_pcard-head", "aria-expanded": open, onClick: function () { setExpanded(open ? null : entry.entryId); } },
                h("strong", { className: "__gh_pcard-title", title: entry.moduleName }, title),
                item === undefined ? h("span", { className: "__gh_pcard-unt", title: "该插件暂无中文翻译" }, "未翻译") : null,
                h("span", { className: "__gh_pcard-en" }, short),
                h("span", { className: "__gh_pcard-trailing" },
                  entry.enabled ? h("span", { className: "__gh_dot", "data-state": "ok", title: phase, role: "img", "aria-label": phase }) : null,
                  h("span", { className: "__gh_pcard-tag", "data-enabled": entry.enabled ? "true" : "false" }, configZh),
                  h("span", { className: "__gh_chevron", "data-open": open ? "true" : undefined }, "▾"))),
              open ? h("div", { className: "__gh_pcard-details" },
                h("code", { className: "__gh_code" }, entry.entryId),
                h("dl", { className: "__gh_dl" },
                  h("div", null, h("dt", null, "配置状态"), h("dd", null, configZh)),
                  entry.enabled ? h("div", null, h("dt", null, "Cordis 状态"), h("dd", null, phase)) : null,
                  item && item.desc ? h("div", null, h("dt", null, "说明"), h("dd", null, item.desc)) : null)) : null);
          })) : null) : null);
    }

    // ================= 设置页通用组件 =================
    function SwitchRow(props) {
      var checked = props.checked, onChange = props.onChange, label = props.label, hint = props.hint, primary = props.primary;
      return h("label", { className: "__gh_switch-row" + (primary ? " is-primary" : "") },
        h("span", { className: "__gh_switch-text" },
          h("span", { className: "__gh_switch-label" }, label),
          hint ? h("span", { className: "__gh_switch-hint" }, hint) : null),
        h("button", { type: "button", role: "switch", "aria-checked": checked ? "true" : "false", className: "__gh_switch" + (checked ? " is-on" : ""), onClick: function () { onChange(!checked); } },
          h("span", null)));
    }
    function EntryRow(props) {
      var section = props.section, keyName = props.keyName, value = props.value, s = props.store, applyPatch = props.applyPatch;
      var zs = react.useState(value ? value.zh : "");
      var zh = zs[0], setZh = zs[1];
      var ds = react.useState(value ? value.desc : "");
      var desc = ds[0], setDesc = ds[1];
      var ens = react.useState(value ? value.enabled : true);
      var enabled = ens[0], setEnabled = ens[1];
      var sgs = react.useState(false);
      var saving = sgs[0], setSaving = sgs[1];
      react.useEffect(function () {
        setZh(value ? value.zh : "");
        setDesc(value ? value.desc : "");
        setEnabled(value ? value.enabled : true);
      }, [value]);
      var save = function () {
        if (!zh.trim() || saving) return;
        setSaving(true);
        var patch = {};
        patch[section] = {};
        patch[section][keyName] = { zh: zh.trim(), desc: desc, enabled: enabled };
        applyPatch(patch).then(function () { setSaving(false); }, function () { setSaving(false); });
      };
      var remove = function () {
        if (saving) return;
        setSaving(true);
        var patch = {};
        patch[section] = {};
        patch[section][keyName] = null;
        applyPatch(patch).then(function () { setSaving(false); }, function () { setSaving(false); });
      };
      return h("div", { className: "__gh_entry" },
        h("div", { className: "__gh_entry-head" },
          h("code", { className: "__gh_code" }, keyName),
          h("label", { className: "__gh_check" },
            h("input", { type: "checkbox", checked: enabled, onChange: function (e) { setEnabled(e.currentTarget.checked); } }),
            "启用")),
        h("div", { className: "__gh_entry-grid" },
          h("input", { className: "__gh_input", type: "text", value: zh, placeholder: "中文名（必填）", onChange: function (e) { setZh(e.currentTarget.value); } }),
          h("input", { className: "__gh_input", type: "text", value: desc, placeholder: "一句话说明（可选）", onChange: function (e) { setDesc(e.currentTarget.value); } })),
        h("div", { className: "__gh_entry-actions" },
          h("button", { type: "button", className: "__gh_btn primary", disabled: !zh.trim() || saving, onClick: save }, saving ? "保存中…" : "保存"),
          value ? h("button", { type: "button", className: "__gh_btn danger", disabled: saving, onClick: remove }, "删除") : null));
    }
    function NewEntryForm(props) {
      var section = props.section, s = props.store, applyPatch = props.applyPatch;
      var ks = react.useState("");
      var keyName = ks[0], setKeyName = ks[1];
      var zs = react.useState("");
      var zh = zs[0], setZh = zs[1];
      var ds = react.useState("");
      var desc = ds[0], setDesc = ds[1];
      var cfg = useConfig(s);
      var exists = keyName.trim() !== "" && !!cfg[section][keyName.trim()];
      var add = function () {
        if (!keyName.trim() || !zh.trim() || exists) return;
        var patch = {};
        patch[section] = {};
        patch[section][keyName.trim()] = { zh: zh.trim(), desc: desc, enabled: true };
        applyPatch(patch).then(function (r) { if (r && r.ok) { setKeyName(""); setZh(""); setDesc(""); } }, function () { });
      };
      return h("div", { className: "__gh_new" },
        h("div", { className: "__gh_entry-grid" },
          h("input", { className: "__gh_input", type: "text", value: keyName, placeholder: "英文标识（如 read / tool-fs / plan）", onChange: function (e) { setKeyName(e.currentTarget.value); } }),
          h("input", { className: "__gh_input", type: "text", value: zh, placeholder: "中文名（必填）", onChange: function (e) { setZh(e.currentTarget.value); } })),
        h("div", { className: "__gh_entry-grid" },
          h("input", { className: "__gh_input", type: "text", value: desc, placeholder: "一句话说明（可选）", onChange: function (e) { setDesc(e.currentTarget.value); } })),
        h("div", { className: "__gh_entry-actions" },
          h("button", { type: "button", className: "__gh_btn primary", disabled: !keyName.trim() || !zh.trim() || exists, onClick: add }, "新增"),
          exists ? h("span", { className: "__gh_hint-inline" }, "该标识已存在，请直接编辑下方条目") : null));
    }
    function SettingsSection(props) {
      var s = props.store, applyPatch = props.applyPatch, load = props.listInventory, runAiTask = props.runAiTask, checkUpdate = props.checkUpdate, confirmUpdate = props.confirmUpdate;
      var cfg = useConfig(s);
      var ts = react.useState("overview");
      var tab = ts[0], setTab = ts[1];
      var qs = react.useState("");
      var q = qs[0], setQ = qs[1];
      var is = react.useState(null);
      var inv = is[0], setInv = is[1];
      var as = react.useState("");
      var aiMsg = as[0], setAiMsg = as[1];
      // 版本更新状态文本（host 写入 updateCheck，经 store 同步到这里）
      var uc = (cfg.updateCheck && typeof cfg.updateCheck === "object") ? cfg.updateCheck : {};
      var ucStatus = uc.status || "";
      var ucText = "";
      if (ucStatus === "current") ucText = "✅ 已是最新版本（v" + (uc.localVersion || "?") + "）";
      else if (ucStatus === "update-available") ucText = "🚀 发现新版本 v" + (uc.remoteVersion || "?") + "（当前 v" + (uc.localVersion || "?") + "）——点击「立即更新」自动下载安装";
      else if (ucStatus === "ahead") ucText = "ℹ️ 本地版本（v" + (uc.localVersion || "?") + "）领先于仓库";
      else if (ucStatus === "updating") ucText = "⏳ 正在下载并应用更新…";
      else if (ucStatus === "updated") ucText = "🎉 " + (uc.message || "更新完成，请重启应用生效");
      else if (ucStatus === "check-failed" || ucStatus === "update-failed") ucText = "⚠️ " + (uc.message || "操作失败，请稍后重试");
      else ucText = "版本检查未运行（点击「检查更新」手动触发）";
      // 自动弹窗：检测到新版本时确认一次（session 级防重复）
      react.useEffect(function () {
        if (ucStatus === "update-available" && uc.remoteVersion) {
          try {
            if (window.__ghUpdatePrompted) return;
            window.__ghUpdatePrompted = true;
            var ok = window.confirm("发现新版本 v" + uc.remoteVersion + "（当前 v" + (uc.localVersion || "?") + "）\n\n是否立即更新？\n更新将自动下载并覆盖插件文件，完成后需重启应用生效。");
            if (ok && confirmUpdate) confirmUpdate(uc.remoteVersion);
          } catch (e) { /* 弹窗被环境禁用时静默 */ }
        }
      }, [ucStatus, uc.remoteVersion]);
      react.useEffect(function () {
        var current = true;
        load().then(function (r) { if (current) setInv(r && r.ok ? r.entries : null); }, function () { if (current) setInv(null); });
        return function () { current = false; };
      }, [load]);
      var toolNames = Object.keys(cfg.tools).sort();
      var pluginNames = Object.keys(cfg.plugins).sort();
      var commandNames = Object.keys(cfg.commands).sort();
      var ql = q.trim().toLocaleLowerCase();
      function filter(list) {
        if (ql === "") return list;
        return list.filter(function (k) {
          return k.toLocaleLowerCase().includes(ql) ||
            (cfg.tools[k] && cfg.tools[k].zh && cfg.tools[k].zh.includes(q.trim())) ||
            (cfg.plugins[k] && cfg.plugins[k].zh && cfg.plugins[k].zh.includes(q.trim())) ||
            (cfg.commands[k] && cfg.commands[k].zh && cfg.commands[k].zh.includes(q.trim()));
        });
      }
      var toolStats = toolNames.filter(function (k) { return cfg.tools[k] && cfg.tools[k].enabled; }).length;
      var pluginStats = pluginNames.filter(function (k) { return cfg.plugins[k] && cfg.plugins[k].enabled; }).length;
      var commandStats = commandNames.filter(function (k) { return cfg.commands[k] && cfg.commands[k].enabled; }).length;
      var TABS = [["overview", "概览"], ["tools", "工具汉化"], ["commands", "命令汉化"], ["plugins", "插件汉化"], ["data", "数据"], ["help", "帮助"]];
      return h("div", { className: "__gh_settings" },
        h("div", { className: "__gh_hero" },
          h("div", { className: "__gh_hero-title" }, "GUI可视信息汉化 V" + (uc.localVersion || "1.1.0")),
          h("div", { className: "__gh_hero-sub" }, "DeepSeek Harness 界面信息汉化 · 常驻版（设置自动保存到磁盘）")),
        h("div", { className: "__gh_tabs" }, TABS.map(function (t) {
          return h("button", { key: t[0], type: "button", className: "__gh_tab" + (tab === t[0] ? " is-active" : ""), onClick: function () { setTab(t[0]); } }, t[1]);
        })),
        tab === "overview" ? h("div", { className: "__gh_section" },
          h("div", { className: "__gh_stats" },
            h("div", { className: "__gh_stat" }, h("b", null, toolStats), h("span", null, "已启用工具翻译")),
            h("div", { className: "__gh_stat" }, h("b", null, commandStats), h("span", null, "已启用命令翻译")),
            h("div", { className: "__gh_stat" }, h("b", null, pluginStats), h("span", null, "已启用插件翻译")),
            h("div", { className: "__gh_stat" }, h("b", null, Object.keys(cfg.plugins).length), h("span", null, "插件字典条目"))),
          h("div", { className: "__gh_cards" },
            h(SwitchRow, { primary: true, checked: !!cfg.flags.master, onChange: function (v) { applyPatch({ flags: { master: v } }); }, label: "汉化功能总开关", hint: "一键开启 / 关闭全部汉化效果（关闭后界面恢复原版，本设置页仍可访问）" }),
            h(SwitchRow, { checked: !!cfg.flags.toolCards, onChange: function (v) { applyPatch({ flags: { toolCards: v } }); }, label: "工具卡片汉化", hint: "对话中 AI 工具调用卡片显示中文名称与说明" }),
            h(SwitchRow, { checked: !!cfg.flags.pluginList, onChange: function (v) { applyPatch({ flags: { pluginList: v } }); }, label: "插件列表汉化", hint: "设置 → 插件 → 插件列表显示中文名称" }),
            h(SwitchRow, { checked: !!cfg.flags.commandMenu, onChange: function (v) { applyPatch({ flags: { commandMenu: v } }); }, label: "命令面板汉化", hint: "/ 命令菜单中每条命令显示中文说明（命令名保持英文，执行不受影响）" }),
            h(SwitchRow, { checked: !!cfg.flags.agentPreset, onChange: function (v) { applyPatch({ flags: { agentPreset: v } }); }, label: "Agent预设汉化", hint: "新会话页与设置中的 Agent 预设显示中文名称与说明（字典可在 settings.yaml 的 gui-hanhua.presets 段维护，AI 自动识别也会扫描预设）" }),
            h(SwitchRow, { checked: !!cfg.flags.persist, onChange: function (v) { applyPatch({ flags: { persist: v } }); }, label: "配置持久化", hint: "修改自动保存到磁盘 settings.yaml；关闭后修改仅本次会话生效" })),
          // ===== AI 智能功能（自动识别 / AI 自检）=====
          // 自动识别：让 AI 分析当前未汉化的插件并自动补全汉化字典（写入 settings.yaml，插件即时生效）。
          // AI 自检：让 AI 检查插件文件/配置/注册状态，发现问题自动修复或给出建议。
          h("div", { className: "__gh_ai" },
            h("div", { className: "__gh_ai-title" }, "智能功能"),
            h("div", { className: "__gh_ai-hint" },
              h("p", null, "1. 自动识别：分析当前已安装但未汉化的插件，自动生成中文名与说明并写入配置，插件即时生效；"),
              h("p", null, "2. AI 自检：检查插件文件、配置与注册状态，发现并修复问题或给出建议；"),
              h("p", null, "3. 点击按钮会打开一个新对话，并自动向 AI 发送任务请求（AI 写文件时需您在场确认授权）；"),
              h("p", null, "4. 注意：两种功能都会消耗 token。")),
            h("div", { className: "__gh_ai-actions" },
              h("button", { type: "button", className: "__gh_btn primary", onClick: function () { if (runAiTask) runAiTask("auto", setAiMsg); } }, "自动识别"),
              h("button", { type: "button", className: "__gh_btn", onClick: function () { if (runAiTask) runAiTask("selfcheck", setAiMsg); } }, "AI 自检")),
            aiMsg !== "" ? h("p", { className: "__gh_ai-status" }, aiMsg) : null),
          // ===== 版本更新（检查更新 / 自动更新）=====
          // 原理：host 启动与「检查更新」时对比 GitHub 仓库版本；发现新版本自动弹窗确认，
          // 确认后 host 下载并覆盖插件文件（含备份），完成后提示重启应用。
          h("div", { className: "__gh_ai" },
            h("div", { className: "__gh_ai-title" }, "版本更新"),
            h("p", { className: "__gh_ai-hint" }, ucText),
            h("div", { className: "__gh_ai-actions" },
              h("button", { type: "button", className: "__gh_btn", onClick: function () { if (checkUpdate) checkUpdate(); } }, "检查更新"),
              ucStatus === "update-available" ? h("button", { type: "button", className: "__gh_btn primary", onClick: function () { if (confirmUpdate) confirmUpdate(uc.remoteVersion); } }, "立即更新") : null)),
          h("p", { className: "__gh_note" }, "本插件为常驻插件：应用启动自动加载，配置自动保存到磁盘，刷新或重启后全部自动恢复。"))
          : null,
        tab === "tools" ? h("div", { className: "__gh_section" },
          h("div", { className: "__gh_search" },
            h("span", { className: "__gh_search-icon", "aria-hidden": true }, "⌕"),
            h("input", { type: "search", value: q, placeholder: "搜索工具", "aria-label": "搜索工具", onChange: function (e) { setQ(e.currentTarget.value); } })),
          h("div", { className: "__gh_list" }, filter(toolNames).map(function (k) {
            return h(EntryRow, { key: k, section: "tools", keyName: k, value: cfg.tools[k], store: s, applyPatch: applyPatch });
          })),
          h(NewEntryForm, { section: "tools", store: s, applyPatch: applyPatch }))
          : null,
        tab === "commands" ? h("div", { className: "__gh_section" },
          h("div", { className: "__gh_search" },
            h("span", { className: "__gh_search-icon", "aria-hidden": true }, "⌕"),
            h("input", { type: "search", value: q, placeholder: "搜索命令", "aria-label": "搜索命令", onChange: function (e) { setQ(e.currentTarget.value); } })),
          h("div", { className: "__gh_hint" }, "命令说明用于命令执行后的对话行。输入 / 弹出的命令菜单受平台沙箱限制无法在插件层汉化（命令名与说明由系统渲染）。"),
          h("div", { className: "__gh_list" }, filter(commandNames).map(function (k) {
            return h(EntryRow, { key: k, section: "commands", keyName: k, value: cfg.commands[k], store: s, applyPatch: applyPatch });
          })),
          h(NewEntryForm, { section: "commands", store: s, applyPatch: applyPatch }))
          : null,
        tab === "plugins" ? h("div", { className: "__gh_section" },
          h("div", { className: "__gh_search" },
            h("span", { className: "__gh_search-icon", "aria-hidden": true }, "⌕"),
            h("input", { type: "search", value: q, placeholder: "搜索插件", "aria-label": "搜索插件", onChange: function (e) { setQ(e.currentTarget.value); } })),
          inv && Array.isArray(inv) && inv.length > 0 ? h("div", { className: "__gh_hint" }, "以下为当前已安装插件：未翻译的可以直接填写中文名后点保存。") : null,
          h("div", { className: "__gh_list" }, filter(inv && Array.isArray(inv) ? inv.map(function (e) { return moduleShortName(e.moduleName || ""); }).filter(function (k) { return cfg.plugins[k] || true; }) : pluginNames).map(function (k) {
            return h(EntryRow, { key: k, section: "plugins", keyName: k, value: cfg.plugins[k], store: s, applyPatch: applyPatch });
          })),
          h(NewEntryForm, { section: "plugins", store: s, applyPatch: applyPatch }))
          : null,
        tab === "data" ? h(DataPanel, { store: s, applyPatch: applyPatch }) : null,
        tab === "help" ? h(HelpPanel, null) : null);
    }
    function DataPanel(props) {
      var s = props.store;
      var cfg = useConfig(s);
      var es = react.useState("");
      var exportText = es[0], setExportText = es[1];
      var imp = react.useState("");
      var importText = imp[0], setImportText = imp[1];
      var ms = react.useState("");
      var msg = ms[0], setMsg = ms[1];
      var genExport = function () {
        try { setExportText(JSON.stringify({ flags: cfg.flags, tools: cfg.tools, plugins: cfg.plugins, commands: cfg.commands }, null, 2)); }
        catch (e) { setMsg("导出失败：" + String((e && e.message) || e)); }
      };
      var doImport = function () {
        var data;
        try { data = JSON.parse(importText); } catch (e) { setMsg("导入失败：JSON 格式错误"); return; }
        var patch = { flags: data.flags || {}, tools: data.tools || {}, plugins: data.plugins || {}, commands: data.commands || {} };
        props.applyPatch({ _replace: true, flags: patch.flags, tools: patch.tools, plugins: patch.plugins, commands: patch.commands }).then(function (r) {
          if (r && r.ok) { setMsg("导入成功，配置已生效。"); setImportText(""); } else { setMsg("导入失败：" + ((r && r.error) || "未知错误")); }
        });
      };
      var doReset = function () {
        props.applyPatch({ _reset: true }).then(function (r) {
          if (r && r.ok) setMsg("已恢复默认配置。"); else setMsg("恢复失败：" + ((r && r.error) || "未知错误"));
        });
      };
      return h("div", { className: "__gh_section" },
        h("div", { className: "__gh_data-row" },
          h("div", { className: "__gh_data-info" }, h("h4", null, "导出配置"), h("p", null, "点击「生成导出内容」后全选复制下方 JSON，妥善保存；可用于迁移或备份。")),
          h("button", { type: "button", className: "__gh_btn primary", onClick: genExport }, "生成导出内容")),
        h("textarea", { className: "__gh_textarea", readOnly: true, value: exportText, placeholder: "导出内容将显示在这里…", rows: 8 }),
        h("div", { className: "__gh_data-row" },
          h("div", { className: "__gh_data-info" }, h("h4", null, "导入配置"), h("p", null, "粘贴之前导出的 JSON，导入会整体替换当前字典。")),
          h("button", { type: "button", className: "__gh_btn primary", onClick: doImport }, "应用导入")),
        h("textarea", { className: "__gh_textarea", value: importText, placeholder: "在此粘贴要导入的 JSON…", rows: 6, onChange: function (e) { setImportText(e.currentTarget.value); } }),
        h("div", { className: "__gh_data-row" },
          h("div", { className: "__gh_data-info" }, h("h4", null, "恢复默认"), h("p", null, "丢弃全部自定义修改，恢复插件内置的默认翻译字典。")),
          h("button", { type: "button", className: "__gh_btn danger", onClick: doReset }, "恢复默认")),
        h("div", { className: "__gh_data-row" },
          h("div", { className: "__gh_data-info" }, h("h4", null, "持久化说明"), h("p", null, "本插件配置自动保存到磁盘 settings.yaml，应用重启后自动恢复；关闭「配置持久化」后修改仅本次会话生效。")),
          h("span", { className: "__gh_hint-inline" }, cfg.flags.persist ? "已开启" : "已关闭")),
        msg !== "" ? h("p", { className: "__gh_note" }, msg) : null);
    }
    function HelpPanel() {
      return h("div", { className: "__gh_section" },
        h("div", { className: "__gh_help" },
          // GitHub 仓库直达入口（开源仓库：欢迎 Star / Issue / PR）
          h("h4", null, "📦 GitHub 仓库"),
          h("p", null,
            h("a", { href: "https://github.com/XIZRSAMS/dsh-gui-hanhua", target: "_blank", rel: "noopener", style: { color: "var(--dsw-alias-brand-primary)", textDecoration: "underline", textUnderlineOffset: "2px" } }, "github.com/XIZRSAMS/dsh-gui-hanhua"),
            " —— 开源项目，欢迎 Star ⭐、提交 Issue 与 Pull Request；更新日志与历史版本可在仓库查看。"),
          h("h4", null, "如何打开本插件"),
          h("p", null, "点击左侧边栏底部的「设置」（齿轮图标）→ 在设置面板左侧找到「GUI汉化设置」并点击，即可进入本插件的管理页。"),
          h("h4", null, "本插件做了什么"),
          h("p", null, "① 对话中 AI 调用的工具卡片：把英文工具名（如 pwsh、web_search）显示为中文名 + 英文原名 + 一句话说明；"),
          h("p", null, "② 设置 → 插件 → 「插件列表」：把插件包名显示为中文名，保留英文原名与状态信息；"),
          h("p", null, "③ 斜杠命令面板与执行后行：命令名保持英文，描述显示中文说明（如 /plan → 计划模式：进入或退出计划模式）；"),
          h("p", null, "④ 权限选择器：Read Only（只读）/ Workspace Write（工作区写入）/ Full access（完全访问）双语显示；"),
          h("p", null, "⑤ 设置页入口「GUI汉化设置」：集中管理全部开关、翻译字典与智能功能。"),
          h("h4", null, "功能总览"),
          h("p", null, "· 汉化功能总开关：一键开启 / 关闭全部汉化效果；"),
          h("p", null, "· 工具卡片汉化：对话中 AI 工具调用卡片的中文名称与说明；"),
          h("p", null, "· 插件列表汉化：设置 → 插件 → 插件列表的中文名称；"),
          h("p", null, "· 命令面板汉化：/ 命令菜单中每条命令的中文说明（命令名保持英文）；"),
          h("p", null, "· Agent预设汉化：新会话页与设置中的 Agent 预设显示中文名称与说明（字典在 settings.yaml 的 gui-hanhua.presets 段维护，AI 自动识别也会扫描预设）；"),
          h("p", null, "· 配置持久化：所有修改自动保存到磁盘 settings.yaml；"),
          h("p", null, "· 工具 / 命令 / 插件三个字典页：可搜索、编辑、新增、删除、启用 / 禁用翻译条目；"),
          h("p", null, "· 数据页：导出配置（JSON 备份）、导入配置（整体替换）、恢复默认（还原内置字典）。"),
          h("h4", null, "智能功能（AI 自动识别 / AI 自检）"),
          h("p", null, "1. 「自动识别」：点击后打开一个新对话，自动向 AI 发送任务——AI 会读取当前已安装但未汉化的插件清单，生成中文名与说明并写入 settings.yaml 的 gui-hanhua 段（插件/工具/命令/Agent 预设全覆盖），完成后插件即时生效；"),
          h("p", null, "2. 「AI 自检」：点击后打开新对话，AI 检查插件注册状态、文件完整性、配置完整性与冲突情况，能直接修复的问题自动修复，其余给出建议；"),
          h("p", null, "3. 注意：两种功能都会消耗 token；AI 写配置文件时需要您在场确认授权；执行结果请切换到新对话查看。"),
          h("h4", null, "常驻与持久化"),
          h("p", null, "· 本插件是常驻插件：应用启动时自动加载（web-desktop 与 web 两个 profile 均已注册），无需手动运行；"),
          h("p", null, "· 「配置持久化」开启后，翻译配置自动保存到磁盘 settings.yaml，应用重启后自动恢复；关闭后仅本次会话生效；"),
          h("p", null, "· 「汉化功能总开关」：一键开启或关闭全部汉化效果，关闭后界面恢复原版，随时可再开启。"),
          h("h4", null, "使用要点"),
          h("p", null, "· 所有修改即时生效，无需刷新；"),
          h("p", null, "· 未翻译的工具 / 插件 / 命令会保持英文原样显示，不会报错；"),
          h("p", null, "· 本插件采用非破坏性低优先级注册，与其他插件的冲突面最小；若某个卡片显示异常，关闭对应开关即可恢复；"),
          h("p", null, "· 插件为开源友好设计：字典、默认配置、界面文案均在源码中集中定义，方便二次开发与自定义。"),
          h("h4", null, "版本更新"),
          h("p", null, "1. 插件启动时自动检查 GitHub 仓库版本（也可在设置页点「检查更新」手动触发）；"),
          h("p", null, "2. 发现新版本会自动弹窗确认，确认后自动下载并覆盖插件文件（覆盖前自动备份 .bak），完成后重启应用生效；"),
          h("p", null, "3. 状态显示：已是最新版本 / 发现新版本 vX / 本地领先 / 更新中 / 更新完成 / 失败原因。"),
          h("h4", null, "排查问题"),
          h("p", null, "· 卡片没变化：确认「概览」中总开关与对应开关已开启，且字典中存在该工具 / 插件的条目并已启用；"),
          h("p", null, "· 命令面板说明不显示：确认「命令面板汉化」开关开启，且字典中存在该命令条目；"),
          h("p", null, "· 设置页入口消失：检查 profiles/web-desktop/cordis.patch.yml 与 profiles/web/cordis.patch.yml 中 dsh-gui-hanhua 是否被禁用，或查看应用日志；"),
          h("p", null, "· 界面出现乱码：多为文件编码问题，可用「AI 自检」让 AI 检查相关文件编码并修复；"),
          h("p", null, "· 智能功能无反应：确认应用支持会话服务，或手动新建对话后重试；AI 写文件需您批准权限。")));
    }

    // ================= 插件主体 =================
    var inject = ["slots", "settingsScope", "remote", "remote.pluginInventory"];
    var name = "gui-hanhua";

    // 总入口：任何初始化异常只记录日志，绝不逃逸（防止拖垮整个客户端模块加载）
    function apply(ctx) {
      try {
        applyInner(ctx);
      } catch (e) {
        console.error("[gui-hanhua] 插件初始化异常，已隔离（其余界面不受影响）:", e);
      }
    }
    function applyInner(ctx) {
      var slots = ctx.get("slots");
      if (!slots) return;
      // 权限选项双语字典（浏览器全局；dsh-client-ui-permission-presets 的
      // patch 钩子读取，选项显示「英文（中文）」；字典缺失时行为原样）
      try {
        globalThis.__guiHanhuaPermissionDict = {
          "read-only": "只读",
          "workspace-write": "工作区写入",
          "danger-full-access": "完全访问"
        };
      } catch (e) { /* 忽略 */ }
      var scope = ctx.settingsScope.bind({ namespace: "gui-hanhua" });
      var store = createStore();
      // Agent 预设双语字典：受「Agent预设汉化」开关控制（flags.agentPreset）。
      // 开启时写入浏览器全局（dsh-client-ui-agent-preset 的 patch 钩子按预设 id 读取），
      // 关闭时置空（预设显示原数据）；切换开关即时生效。
      var PRESET_DICT = {
        "anchored-standard": { name: "锚定标准模式（实验）", description: "以极简预设的真实工具对启动（持久 bash + str_replace_editor），首个持久工具调用或回复后解锁完整标准能力。" },
        "zero-anchored-standard": { name: "零锚定标准模式（实验）", description: "注入一轮零工具锚定轮（固定用户消息），从下一轮起解锁完整标准工具。" },
        "router-standard": { name: "路由标准模式（实验）", description: "按任务类型路由——修复走计划（spec），构建走执行（doer）；首个工具调用后解锁完整标准工具。" },
        "v4-flash-godmode-opencode-go": { name: "Flash 路由（opencode-go）", description: "Flash 专属路由：按任务类型（构建/修复）内部路由，neutral 人设 + 分类引导 + 回顾锚 + 反跑题锚。" },
        "warmupbetter": { name: "预热增强", description: "预热轮要求模型尽可能长时间预热思维链，并在正式提示词到达前列出自提醒。" },
        "warmupbetter-replay": { name: "预热增强·回放", description: "第一轮的思维链与回复回放已记录的预热输出，下一轮以完整标准能力运行。" },
        "whoami-standard": { name: "Whoami 标准（实验）", description: "在空工具面上播种一轮固定的「你是谁」自我介绍，用户首条真实消息后解锁常驻完整能力。" },
        "minimal-gitbash": { name: "极简模式（Git Bash）", description: "极简模式的 Windows 变体：bash 映射到 Git for Windows 的 bash（MSYS）。" },
        "minimal-win": { name: "极简模式（Windows）", description: "官方极简模式的 Windows 版：bash 替换为 PowerShell，pwsh + str_replace_editor 双工具。" }
      };
      var updatePresetDict = function () {
        try {
          var cfgNow = store.get();
          if (!cfgNow || !cfgNow.flags || cfgNow.flags.agentPreset === false) { globalThis.__guiHanhuaPresetDict = {}; return; }
          var merged = {};
          // 1) 内置默认（client）为底
          for (var k in PRESET_DICT) merged[k] = PRESET_DICT[k];
          // 2) settings.yaml 的 gui-hanhua.presets 段覆盖/补充（AI 自动识别写入的数据也在这里）
          var p = cfgNow.presets || {};
          for (var k2 in p) {
            var e = p[k2];
            if (!e || typeof e !== "object") continue;
            if (e.enabled === false) { delete merged[k2]; continue; }
            var base = merged[k2] || {};
            merged[k2] = {
              name: (typeof e.zh === "string" && e.zh) ? e.zh : (base.name || k2),
              description: (typeof e.desc === "string" && e.desc) ? e.desc : (base.description || "")
            };
          }
          globalThis.__guiHanhuaPresetDict = merged;
        } catch (e) { /* 忽略 */ }
      };
      updatePresetDict();
      var alive = true;
      var sync = function () {
        if (!alive) return;
        try {
          var snap = scope.getSnapshot();
          // 4.1+ 快照是包装对象，文档在 value 里；旧版直接返回文档。解包后归一化，
          // 空/残缺时用内置默认字典兜底，保证 store 永远有完整可用的字典。
          store.set(normalizeConfig(unwrapSnapshot(snap), true));
        } catch (e) { console.error("[gui-hanhua] 同步配置失败:", e); }
      };
      sync();
      var un = typeof scope.subscribe === "function" ? scope.subscribe(sync) : null;
      ctx.effect(function () {
        return function () {
          alive = false;
          if (un) un();
          if (scope.dispose) scope.dispose();
        };
      }, "gui-hanhua: settings scope");

      // 插件清单：产品同款 remote 通道
      var listInventory = function () {
        try {
          return ctx.remote.pluginInventory.list().then(function (result) {
            if (result && result.ok && result.value && Array.isArray(result.value.entries)) {
              return { ok: true, entries: result.value.entries };
            }
            return { ok: false, error: "remote 通道返回异常" };
          }, function (err) { return { ok: false, error: String((err && err.message) || err) }; });
        } catch (err) {
          return Promise.resolve({ ok: false, error: String((err && err.message) || err) });
        }
      };

      var registry = {
        tools: new Map(),
        pluginTab: null,
        commandRows: new Map(),
        disposeTools: function () { this.tools.forEach(function (off) { try { off(); } catch (e) { } }); this.tools.clear(); },
        disposePluginTab: function () { if (this.pluginTab) { try { this.pluginTab(); } catch (e) { } this.pluginTab = null; } },
        disposeCommandRows: function () { this.commandRows.forEach(function (off) { try { off(); } catch (e) { } }); this.commandRows.clear(); }
      };
      var syncTools = function () {
        registry.disposeTools();
        var cfg = store.get();
        if (!cfg || !cfg.flags || !cfg.flags.master || !cfg.flags.toolCards) return;
        Object.keys(cfg.tools || {}).forEach(function (toolName) {
          var entry = cfg.tools[toolName];
          if (!entry || !entry.enabled) return;
          try {
            var off = slots.register({ name: "tool.call.toolview", key: toolName, priority: -100 }, function (props) {
              return h(ErrorBoundary, { fallback: SAFE_FALLBACK }, h(HanhuaToolCard, Object.assign({}, props, { store: store })));
            });
            registry.tools.set(toolName, off);
          } catch (e) { /* 单个工具注册失败：跳过 */ }
        });
      };
      var syncPluginTab = function () {
        registry.disposePluginTab();
        var cfg = store.get();
        if (!cfg || !cfg.flags || !cfg.flags.master || !cfg.flags.pluginList) return;
        try {
          registry.pluginTab = slots.register({ name: "settings.plugins.tab", id: "all", priority: -1, label: function () { return "插件列表"; } }, function (props) {
            return h(ErrorBoundary, { fallback: SAFE_FALLBACK }, h(HanhuaPluginListTab, Object.assign({}, props, { store: store, listInventory: listInventory })));
          });
        } catch (e) { /* 槽位未声明：跳过 */ }
      };
      var syncCommandRows = function () {
        registry.disposeCommandRows();
        var cfg = store.get();
        if (!cfg || !cfg.flags || !cfg.flags.master) return;
        Object.keys(cfg.commands || {}).forEach(function (cmdName) {
          var entry = cfg.commands[cmdName];
          if (!entry || !entry.enabled) return;
          try {
            var off = slots.register({ name: "conversation.chat.commandview", key: cmdName, priority: -100 }, function (props) {
              return h(ErrorBoundary, { fallback: SAFE_FALLBACK }, h(HanhuaCommandRow, Object.assign({}, props, { store: store })));
            });
            registry.commandRows.set(cmdName, off);
          } catch (e) { /* 单个命令注册失败：跳过 */ }
        });
      };
      var syncAll = function () { syncTools(); syncPluginTab(); syncCommandRows(); };

      // 应用补丁：{ flags?, tools?, plugins?, commands?, presets?, _replace?, _reset? }
      var applyPatch = function (patch) {
        var cfg = store.get();
        var next;
        if (patch && patch._reset) {
          // 「恢复默认」= 恢复内置默认字典（非清空）
          next = { flags: { master: true, persist: true, toolCards: true, pluginList: true, commandMenu: true, agentPreset: true }, tools: DEFAULT_TOOLS, plugins: DEFAULT_PLUGINS, commands: DEFAULT_COMMANDS, presets: {} };
        } else if (patch && patch._replace) {
          next = {
            flags: Object.assign({ master: true, persist: true, toolCards: true, pluginList: true, commandMenu: true, agentPreset: true }, patch.flags || {}),
            tools: shallowClone(patch.tools || {}),
            plugins: shallowClone(patch.plugins || {}),
            commands: shallowClone(patch.commands || {}),
            presets: shallowClone(patch.presets || {})
          };
        } else {
          next = shallowClone(cfg);
          if (!next || !next.flags) next = normalizeConfig(next, true);
          if (patch && patch.flags) Object.assign(next.flags, patch.flags);
          ["tools", "plugins", "commands", "presets"].forEach(function (section) {
            var p = patch && patch[section];
            if (!p) return;
            Object.keys(p).forEach(function (k) {
              if (p[k] === null) delete next[section][k];
              else next[section][k] = p[k];
            });
          });
        }
        next = normalizeConfig(next);
        store.set(next);
        syncAll();
        // 持久化：persist 开启时写 settings；flags 变化总是写（保证开关状态保存）。
        // 写盘前与最新快照合并：磁盘上存在而本次操作未涉及的条目/开关必须保留，
        // 防止 store 中缺失的数据被覆盖（启动竞态下 store 可能落后于磁盘文档）。
        var shouldPersist = next.flags.persist || (patch && patch.flags && "persist" in patch.flags);
        if (shouldPersist) {
          try {
            var freshSnap = null;
            try { freshSnap = unwrapSnapshot(scope.getSnapshot()); } catch (e) { freshSnap = null; }
            var mergedFlags = next.flags;
            var mergedTools = next.tools;
            var mergedPlugins = next.plugins;
            var mergedCommands = next.commands;
            var mergedPresets = next.presets;
            if (freshSnap && typeof freshSnap === "object" && !Array.isArray(freshSnap)) {
              // flags：本次 patch 未显式修改的键保留磁盘值（尊重用户之前的选择）
              if (freshSnap.flags && typeof freshSnap.flags === "object") {
                var patchFlags = (patch && patch.flags) || {};
                mergedFlags = Object.assign({}, next.flags);
                ["master", "persist", "toolCards", "pluginList", "commandMenu", "agentPreset"].forEach(function (k) {
                  if (!(k in patchFlags) && freshSnap.flags[k] !== undefined) mergedFlags[k] = !!freshSnap.flags[k];
                });
              }
              // 字典：磁盘为底 + 本次结果覆盖；本次显式删除（null）的键除外
              var mergeSection = function (sectionName, freshPart, nextPart) {
                var base = Object.assign({}, freshPart && typeof freshPart === "object" && !Array.isArray(freshPart) ? freshPart : {});
                Object.keys(nextPart || {}).forEach(function (k) { base[k] = nextPart[k]; });
                var p = patch && patch[sectionName];
                if (p) {
                  Object.keys(p).forEach(function (k) { if (p[k] === null) delete base[k]; });
                }
                return base;
              };
              mergedTools = mergeSection("tools", freshSnap.tools, next.tools);
              mergedPlugins = mergeSection("plugins", freshSnap.plugins, next.plugins);
              mergedCommands = mergeSection("commands", freshSnap.commands, next.commands);
              mergedPresets = mergeSection("presets", freshSnap.presets, next.presets);
            }
            scope.set("flags", mergedFlags);
            scope.set("tools", mergedTools);
            scope.set("plugins", mergedPlugins);
            scope.set("commands", mergedCommands);
            scope.set("presets", mergedPresets);
          } catch (e) { console.error("[gui-hanhua] 保存配置失败:", e); }
        }
        // 预设字典同步（开关切换 / 字典变化即时生效）
        try { updatePresetDict(); } catch (e) { /* 忽略 */ }
        return Promise.resolve({ ok: true });
      };

      // ===== AI 智能功能（自动识别 / AI 自检）=====
      // 原理：点击按钮 → 打开一个新对话（workspaces.startSession，产品标准路径）
      //      → 轮询到新会话出现（sessions.list.current 变化）
      //      → 用 conversation.sendSession 自动发送任务提示词
      //      → AI 在新对话中用自己的工具读取文件/写入配置，完成汉化或自检。
      // 提示词已内置明确的任务指令与目标文件路径，AI 只需照做；写配置需要用户在场批准。
      var buildAutoPrompt = function (unlocalized) {
        var list = unlocalized && unlocalized.length > 0 ? unlocalized.join("\n") : "（当前暂未发现未汉化插件，请自行扫描）";
        return "【GUI 自动汉化任务】\n" +
          "请帮助汉化 DeepSeek Harness 的界面信息（插件名 / 工具名 / 命令说明 / Agent 预设）。\n" +
          "当前已安装但尚未汉化的插件/工具（英文原名）：\n" + list + "\n\n" +
          "请执行：\n" +
          "1. 先确认 DSH 配置目录：运行命令 `echo $env:USERPROFILE` 得到用户目录，DSH 配置目录即 <用户目录>\\.dsh（Linux/macOS 为 ~/.dsh）。\n" +
          "2. 读取 <DSH配置目录>\\settings.yaml 中 gui-hanhua 段的 tools / plugins / commands / presets 字典，了解已有条目的格式（zh / desc / enabled）。\n" +
          "3. 为上一步列出的每个未汉化条目设计简短中文名（zh）与一句话中文说明（desc）。\n" +
          "4. 将新增条目写入 settings.yaml 对应的段（插件→plugins，工具→tools，命令→commands），保持 YAML 缩进与现有条目一致。\n" +
          "5. 额外任务——Agent 预设汉化：扫描 <DSH配置目录>\\.agent-presets\\ 目录下所有预设（每个子目录的 preset.yml 含 name / description / order），" +
          "对照 settings.yaml 的 gui-hanhua.presets 段（zh / desc / enabled 格式），为 name 或 description 仍为英文（或缺失条目）的预设设计中文名（zh）与中文说明（desc），" +
          "写入 gui-hanhua.presets 段（enabled: true，保持 YAML 格式）。\n" +
          "6. 若无法直接写该文件（沙箱/权限），请明确请求用户授权后重试。\n" +
          "7. 完成后简要汇报：新增了多少条汉化（插件 / 工具 / 命令 / 预设分别多少）。\n\n" +
          "注意：命令名/工具名/预设 id 本身保持英文不变，只汉化显示名称与说明；不要修改 settings.yaml 中其他插件的配置。";
      };
      var buildSelfCheckPrompt = function () {
        return "【GUI 汉化插件自检任务】\n" +
          "请检查 DeepSeek Harness 的「GUI可视信息汉化」（gui-hanhua）插件：\n" +
          "1. 先确认 DSH 配置目录：运行 `echo $env:USERPROFILE` 得到用户目录，DSH 配置目录即 <用户目录>\\.dsh（Linux/macOS 为 ~/.dsh）。\n" +
          "2. 读取 <DSH配置目录>\\profiles\\web-desktop\\cordis.patch.yml 与 <DSH配置目录>\\profiles\\web\\cordis.patch.yml，确认 gui-hanhua 注册存在且 disabled 为 false。\n" +
          "3. 检查 <DSH配置目录>\\profiles\\web-desktop\\node_modules\\dsh-gui-hanhua\\ 与 <DSH配置目录>\\profiles\\web\\node_modules\\dsh-gui-hanhua\\ 的文件完整性（client.js / index.js / package.json / vendor/ 是否存在且编码正常）。\n" +
          "4. 检查 <DSH配置目录>\\settings.yaml 中 gui-hanhua 段：flags（master/persist/toolCards/pluginList/commandMenu/agentPreset）、tools、plugins、commands、presets 是否完整，master 是否为 true。\n" +
          "5. 检查 gui-hanhua.presets 段：是否存在、条目格式（zh / desc / enabled）是否完整、与 <DSH配置目录>\\.agent-presets\\ 目录下的预设是否匹配（缺少条目或存在多余条目）。\n" +
          "6. 检查 <DSH配置目录>\\.agent-presets\\ 下各预设的 preset.yml 编码是否正常（UTF-8、无乱码、可正常解析）。\n" +
          "7. 检查插件是否有明显的冲突或配置损坏（例如注册被禁用、文件缺失、字典为空）。\n" +
          "8. 发现问题：说明原因并给出修复建议；能直接修复的（如配置字段缺失、presets 段补全）请直接修复（若需权限请先请求）。\n" +
          "9. 完成汇报：插件状态 + 发现的问题 + 已修复内容。";
      };
      // 发送提示词到指定会话（多路径容错）：
      //   路径1：binding.session.prompt(...) 直调（conversation.sendSession 内部同款）
      //   路径2：conversation.sendSession(session, ...)（显式传会话）
      //   路径3：conversation.send(...)（作用域寻址，兜底）
      var sendPromptTo = function (sessionId, prompt, sessionsSvc, conversationSvc) {
        var attempt = function (label, p) {
          return p.then(function (r) {
            var ok = r && r.ok;
            console.log("[gui-hanhua] 发送成功（" + label + "）:", ok);
            return ok ? { ok: true } : { ok: false, error: (r && r.error && (r.error.message || r.error.code)) || "send rejected" };
          }, function (err) {
            console.log("[gui-hanhua] 发送失败（" + label + "）:", String((err && err.message) || err));
            return { ok: false, error: String((err && err.message) || err), label: label };
          });
        };
        try {
          var binding = sessionsSvc && sessionsSvc.binding(sessionId);
          var session = binding && binding.session;
          if (session && typeof session.prompt === "function") {
            return attempt("session.prompt", session.prompt([{ type: "text", text: prompt }], "queue"));
          }
          if (session && conversationSvc && typeof conversationSvc.sendSession === "function") {
            return attempt("sendSession", conversationSvc.sendSession(session, prompt, [], "queue"));
          }
          if (conversationSvc && typeof conversationSvc.send === "function") {
            return attempt("send", conversationSvc.send(prompt));
          }
          console.log("[gui-hanhua] 无可用发送方法（session.prompt/sendSession/send 均不可用）");
          return Promise.resolve({ ok: false, error: "no send method available" });
        } catch (e) {
          console.error("[gui-hanhua] AI 任务发送异常:", e);
          return Promise.resolve({ ok: false, error: String((e && e.message) || e) });
        }
      };
      // kind: "auto"（自动识别）| "selfcheck"（AI 自检）；uiSetState 为设置页状态回调（显示结果）
      var runAiTask = function (kind, uiSetState) {
        var report = function (msg) {
          console.log("[gui-hanhua] AI 任务:", msg);
          try { if (uiSetState) uiSetState(msg); } catch (e) { }
        };
        try {
          var workspaces = ctx.get("workspaces");
          var sessionsSvc = ctx.get("sessions");
          var conversationSvc = ctx.get("conversation");
          if (!workspaces) { report("缺少工作区服务，无法发起 AI 任务"); return; }
          if (!sessionsSvc) { report("缺少会话服务，无法发起 AI 任务"); return; }
          if (!conversationSvc) { report("缺少对话服务，无法发起 AI 任务"); return; }
          var doSend = function (prompt) {
            // 1) 打开新对话（产品标准路径：连接当前/最近工作区并打开空白会话）
            var beforeId = null;
            try { var snap0 = sessionsSvc.list && sessionsSvc.list.getSnapshot(); beforeId = snap0 && snap0.current; } catch (e) { beforeId = null; }
            try { workspaces.startSession(); } catch (e) { report("打开新对话失败：" + String((e && e.message) || e)); return; }
            report("已请求打开新对话，正在等待会话就绪…");
            // 2) 轮询新会话出现（sessions.list.current 变化）
            var tries = 0, finished = false;
            var finish = function (msg) { if (finished) return; finished = true; if (timer) clearInterval(timer); report(msg); };
            var timer = setInterval(function () {
              tries++;
              var cur = null;
              try { var snap = sessionsSvc.list && sessionsSvc.list.getSnapshot(); cur = snap && snap.current; } catch (e) { cur = null; }
              if (cur && cur !== beforeId) {
                // 3) 新会话已出现：等待会话绑定就绪（binding.session.prompt 可用）后发送
                var bindTries = 0;
                var bindTimer = setInterval(function () {
                  bindTries++;
                  var b = null, sess = null;
                  try { b = sessionsSvc.binding(cur); sess = b && b.session; } catch (e) { }
                  if (sess && typeof sess.prompt === "function") {
                    clearInterval(bindTimer);
                    sendPromptTo(cur, prompt, sessionsSvc, conversationSvc).then(function (r) {
                      finish(r && r.ok ? "✓ 任务已发送到新对话（请切换查看）" : ("发送失败：" + ((r && r.error) || "未知原因")));
                    });
                  } else if (bindTries > 20) {
                    clearInterval(bindTimer);
                    sendPromptTo(cur, prompt, sessionsSvc, conversationSvc).then(function (r) {
                      finish(r && r.ok ? "✓ 任务已发送到新对话（会话绑定较慢）" : ("发送失败：" + ((r && r.error) || "未知原因")));
                    });
                  }
                }, 250);
                // 终止外层轮询
                clearInterval(timer); finished = true;
              } else if (tries > 40) {
                if (cur) {
                  finish("未能确认新会话，已向当前对话发送任务（请查看）");
                  sendPromptTo(cur, prompt, sessionsSvc, conversationSvc);
                } else {
                  finish("未能检测到新会话（sessions.list 不可用或未更新），请手动新建对话后重试");
                }
              }
            }, 250);
          };
          if (kind === "selfcheck") { doSend(buildSelfCheckPrompt()); return; }
          // 自动识别：先取当前已安装插件清单，过滤已汉化的，把未汉化列表交给 AI
          listInventory().then(function (r) {
            var names = [];
            if (r && r.ok && Array.isArray(r.entries)) {
              names = r.entries.map(function (e) { return moduleShortName(e.moduleName || ""); });
            }
            var cfg = store.get();
            var un = names.filter(function (n) { return !(cfg.plugins && cfg.plugins[n]); });
            doSend(buildAutoPrompt(un));
          }, function () { doSend(buildAutoPrompt([])); });
        } catch (e) {
          console.error("[gui-hanhua] AI 任务失败:", e);
          report("AI 任务失败：" + String((e && e.message) || e));
        }
      };

      // ===== 版本更新（检查 / 确认自动更新）=====
      // 原理：host 端负责下载与覆盖文件（Node 可写盘）；client 端只通过 settings 通道
      // 传递意图——写 updateCheck.trigger 触发 host 检查，写 confirmAt/confirmVersion 确认更新。
      // host 把检查/更新结果写回 updateCheck.status，client 读取展示并弹窗。
      var requestUpdateCheck = function () {
        try {
          var uc = (store.get().updateCheck && typeof store.get().updateCheck === "object") ? store.get().updateCheck : {};
          scope.set("updateCheck", Object.assign({}, uc, { trigger: Date.now() }));
        } catch (e) { console.error("[gui-hanhua] 触发版本检查失败:", e); }
      };
      var confirmUpdate = function (version) {
        try {
          var uc = (store.get().updateCheck && typeof store.get().updateCheck === "object") ? store.get().updateCheck : {};
          scope.set("updateCheck", Object.assign({}, uc, { confirmAt: Date.now(), confirmVersion: version }));
        } catch (e) { console.error("[gui-hanhua] 确认更新失败:", e); }
      };

      // 注册设置页（入口名：GUI汉化设置）
      try {
        slots.inject("settings.section", function () {
          return slots.register({ name: "settings.section", id: "gui-hanhua", order: 90, label: function () { return "GUI汉化设置"; } }, function (props) {
            return h(ErrorBoundary, { fallback: SAFE_FALLBACK }, h(SettingsSection, Object.assign({}, props, { store: store, applyPatch: applyPatch, listInventory: listInventory, runAiTask: runAiTask, checkUpdate: requestUpdateCheck, confirmUpdate: confirmUpdate })));
          });
        });
      } catch (e) { console.error("[gui-hanhua] 设置页注册失败:", e); }

      // 工具卡片 / 插件列表 / 命令执行行（等待槽位声明；声明时再拉一次快照，
      // 覆盖「settings 文档晚于槽位加载」的启动竞态）
      try {
        slots.inject("tool.call.toolview", function () { try { sync(); } catch (e) { } try { syncTools(); } catch (e) { console.error("[gui-hanhua] 工具卡片同步失败:", e); } return function () { registry.disposeTools(); }; });
      } catch (e) { /* 跳过 */ }
      try {
        slots.inject("settings.plugins.tab", function () { try { sync(); } catch (e) { } try { syncPluginTab(); } catch (e) { console.error("[gui-hanhua] 插件列表同步失败:", e); } return function () { registry.disposePluginTab(); }; });
      } catch (e) { /* 跳过 */ }
      try {
        slots.inject("conversation.chat.commandview", function () { try { sync(); } catch (e) { } try { syncCommandRows(); } catch (e) { console.error("[gui-hanhua] 命令行同步失败:", e); } return function () { registry.disposeCommandRows(); }; });
      } catch (e) { /* 跳过 */ }

      try { syncAll(); } catch (e) { console.error("[gui-hanhua] 初次同步失败:", e); }
    }

    exports.name = name;
    exports.inject = inject;
    exports.apply = apply;
    return module.exports;
  }
});
