# 安装指南 / Installation

## 方式一：市场安装（推荐，支持 `dsh plugin add`）

本插件声明了 `dsh.bundle` manifest，可通过 DeepSeek Harness 插件市场直接安装：

```bash
dsh plugin add dsh-gui-hanhua
```

安装后重启 DeepSeek Harness 即可。

## 方式二：手动复制

1. 将本目录复制到 DSH profile 的 node_modules：

   ```powershell
   Copy-Item .\dsh-gui-hanhua -Recurse "$env:USERPROFILE\.dsh\profiles\web-desktop\node_modules\"
   # 如同时使用 web profile：
   Copy-Item .\dsh-gui-hanhua -Recurse "$env:USERPROFILE\.dsh\profiles\web\node_modules\"
   ```

2. 在对应 profile 的 `cordis.patch.yml` 中注册：

   ```yaml
   - insert:
       - id: gui-hanhua
         name: 'dsh-gui-hanhua'
         disabled: false
   ```

3. **重启 DeepSeek Harness**——插件为常驻型，启动时自动加载。

## 安装后

打开 **设置 → GUI汉化设置** 即可管理全部功能（开关、翻译字典、智能功能）。

> 💡 无需构建：客户端为手写 bundle（ModuleLoader 格式），client 端改动刷新页面即生效，host 端改动需重启。
