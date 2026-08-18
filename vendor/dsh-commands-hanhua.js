/**
 * dsh-commands catalog 双语化钩子（幂等 patch）。
 *
 * 双语策略：命令名保持英文（执行路径零风险），描述/参数提示汉化为中文。
 * 在 dsh-commands/lib/index.js 的 `list(agent)` 注入只读钩子：
 * 返回前经 globalThis.__guiHanhuaReadDict(globalThis.__guiHanhuaDictFile)
 * 读取命令字典（由插件启动时注入的读取函数，含 mtime 缓存），
 * 把每个命令 descriptor 的 description（及 input.hint）换成中文。
 *
 * 为什么不用 globalThis 直接传字典：宿主插件与 dsh-commands 的加载上下文
 * 可能不同（4.1 桌面版），且 patch 生效需要一次重启；文件通道跨进程、
 * 跨时序可靠——插件把字典写入 profiles 根目录 JSON 并注入读取函数，
 * 本钩子只调函数拿结果，字典缺失/为空时行为完全原样。
 *
 * 安全设计：
 *  - 钩子只读；读取函数/文件不存在 → 行为与原版完全一致；
 *  - patch 幂等（标记注释），重复启动不重复注入；
 *  - dsh 更新会覆盖源文件，插件下次启动重新 patch（与 dsh-settings-expose 同模式）；
 *  - 任何失败只告警，绝不抛给框架。
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, sep } from "node:path";

const MARK_START = "/* __gui_hanhua_catalog_patch__ */";
const MARK_END = "/* __gui_hanhua_catalog_patch_end__ */";

/** list(): 双语化分支（插在 return 之前；name 保持英文，只换 description/hint）。 */
const LIST_INJECT = `\t\t\t${MARK_START}
\t\t\tconst __ghRead = globalThis && globalThis.__guiHanhuaReadDict;
\t\t\tconst __ghFile = globalThis && globalThis.__guiHanhuaDictFile;
\t\t\tconst __dict = typeof __ghRead === "function" && typeof __ghFile === "string" ? __ghRead(__ghFile) : undefined;
\t\t\tif (__dict && typeof __dict === "object") {
\t\t\t\treturn Object.freeze([...this.view(agent).values()].map((command) => {
\t\t\t\t\tconst d = command.descriptor;
\t\t\t\t\tconst e = __dict[d.name];
\t\t\t\t\tif (e && e.enabled !== false && (typeof e.desc === "string" && e.desc || typeof e.hint === "string" && e.hint)) {
\t\t\t\t\t\tconst out = { name: d.name, description: typeof e.desc === "string" && e.desc ? e.desc : d.description };
\t\t\t\t\t\tif (d.input !== void 0) out.input = Object.freeze({ hint: typeof e.hint === "string" && e.hint ? e.hint : d.input.hint });
\t\t\t\t\t\treturn Object.freeze(out);
\t\t\t\t\t}
\t\t\t\t\treturn d;
\t\t\t\t}).sort((left, right) => left.name < right.name ? -1 : 1));
\t\t\t}
\t\t\t${MARK_END}
\t\t\treturn Object.freeze([...this.view(agent).values()].map((command) => command.descriptor).sort((left, right) => left.name < right.name ? -1 : 1));`;

/**
 * 幂等注入 dsh-commands 双语化钩子。失败只告警。
 * @param {import("cordis").Context} ctx
 * @param {{info?: Function, warn?: Function}} logger - dsh logger。
 */
export function ensureCommandsHanhuaPatched(ctx, logger) {
  void ctx;
  try {
    const target = findCommandsIndex();
    if (!target) {
      logger?.warn?.("[gui-hanhua] could not locate dsh-commands/lib/index.js; 命令面板双语化未启用（不影响其他汉化）");
      return;
    }
    let src;
    try {
      src = readFileSync(target, "utf8");
    } catch (error) {
      logger?.warn?.(`[gui-hanhua] cannot read ${target}: ${String(error)}`);
      return;
    }
    if (src.includes(MARK_START)) return; // 已 patch，幂等

    // --- list(): 双语化分支 ---
    const listRe = /list\(agent\)\s*\{\s*return Object\.freeze\(\[\.\.\.this\.view\(agent\)\.values\(\)\]\.map\(\(command\) => command\.descriptor\)\.sort\(\(left, right\) => left\.name < right\.name \? -1 : 1\)\);/;
    if (!listRe.test(src)) {
      logger?.warn?.("[gui-hanhua] dsh-commands list() pattern not found; 命令面板双语化跳过（不影响其他汉化）");
      return;
    }
    src = src.replace(listRe, (match) => {
      const indent = match.match(/^(\s*)list\(/)?.[1] ?? "\t\t\t";
      return `${indent}list(agent) {\n${LIST_INJECT.replace(/\n\t\t\t/g, "\n" + indent)}`;
    });

    writeFileSync(target, src, "utf8");
    logger?.info?.("[gui-hanhua] dsh-commands 命令面板双语化钩子已注入（重启后生效）");
  } catch (error) {
    logger?.warn?.(`[gui-hanhua] dsh-commands patch failed: ${String(error)}`);
  }
}

function findCommandsIndex() {
  // 1) host 进程已加载 dsh-commands：从 CommonJS 模块缓存读真实路径
  try {
    const Module = createRequire(import.meta.url)("module");
    const cache = Module._cache ?? {};
    for (const key of Object.keys(cache)) {
      if (key.includes(`${sep}dsh-commands${sep}`) && key.endsWith(`${sep}index.js`)) return key;
    }
  } catch { /* fall through */ }
  // 2) 回退：与 dsh-settings 同级目录探测
  try {
    const require = createRequire(import.meta.url);
    const settingsEntry = require.resolve("@deepseek-ai/dsh-settings");
    const candidate = join(dirname(dirname(dirname(settingsEntry))), "dsh-commands", "lib", "index.js");
    if (existsSync(candidate)) return candidate;
  } catch { /* fall through */ }
  return "";
}
