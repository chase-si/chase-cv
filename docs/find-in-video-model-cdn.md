# Find in Video 模型 CDN

模型分片可存入 Cloudflare R2，通过自定义域名和 CDN 分发。视频和人脸推理仍在浏览器本地处理。

## 文件与版本

将 `public/models/buffalo_l/` 文件夹上传到专用存储桶，保留分片文件名。当前存储桶直接在根目录放置 `buffalo_l/`：

```text
buffalo_l/det_10g.onnx.5838f7fe0536.part00
buffalo_l/w600k_r50.onnx.4c06341c33c2.part00
…
buffalo_l/w600k_r50.onnx.4c06341c33c2.part08
```

应用始终读取随站点发布的 `/models/manifest.json`，只将模型分片请求切换到 CDN。这样清单与应用版本一致，下载后仍校验完整文件的字节数和 SHA-256。更新模型时先上传新 hash 文件，再发布对应清单，保留旧分片以兼容已打开的页面。

## Cloudflare 配置

1. 使用仅存放公开模型资源的存储桶，绑定自定义域名，例如 `models.dashuaibi.vip`。公开域名会使桶内所有已知路径的文件可被下载，勿放入私有文件。
2. 配置 CORS 允许无凭据的 `GET`、`HEAD` 请求。公开模型可使用以下策略：

   ```json
   [
     {
       "AllowedOrigins": ["*"],
       "AllowedMethods": ["GET", "HEAD"],
       "ExposeHeaders": ["Content-Length", "ETag"],
       "MaxAgeSeconds": 86400
     }
   ]
   ```

3. 为该主机的 `/buffalo_l/` 路径创建 Cache Rule，设置为可缓存，并设置边缘和浏览器 TTL 为一年。规则只匹配带 hash 的分片，不包含清单。`.part00` 等后缀不在 Cloudflare 默认缓存扩展名中，必须明确配置规则。
4. 若通过 API 上传，分片对象同时设置 `Cache-Control: public, max-age=31536000, immutable`。通过控制台上传时，可使用上面的浏览器 TTL 规则实现长期缓存。

## 应用配置

在构建前设置：

```dotenv
NEXT_PUBLIC_FIND_IN_VIDEO_MODEL_BASE_URL=https://models.dashuaibi.vip
```

该值会编译进浏览器的模型 Worker；修改后必须重新构建和部署。留空时继续使用同源 `/models/`，适合本地开发。ONNX runtime 的 `/onnx/` 路径保持同源。

仓库的 GitHub Actions 部署工作流在构建阶段读取同名 Repository secret。在 GitHub 仓库的 **Settings → Secrets and variables → Actions → New repository secret** 中配置：

- Name：`NEXT_PUBLIC_FIND_IN_VIDEO_MODEL_BASE_URL`
- Secret：`https://models.dashuaibi.vip`（不加 `/models` 或 `/buffalo_l`）

新增或修改 Secret 后，需要重新运行部署工作流才能生效。未配置时会回退到同源 `/models/`。该值虽然通过 Secret 注入，仍会作为公开下载地址编译到浏览器代码中。

本地开发可在 `.env.local` 中设置同名变量来验证 CDN；未设置时不依赖外部资源域名。

## 验证

- 确认 10 个分片均可访问，长度与本地文件一致；拼接后 SHA-256 与清单一致。
- 带 `Origin` 的请求返回 `Access-Control-Allow-Origin: *`。
- 重复 GET 请求出现 `CF-Cache-Status: HIT`，并检查浏览器 TTL。
- 新部署的网站应从资源域名请求分片，清单仍请求站点本身。缓存未被清理时，重复使用应复用浏览器缓存；模型初始化仍在设备上执行。

2026-10-14 已验证：`chase-cv` 存储桶中的 10 个分片均可完整下载，两个模型的 SHA-256 和字节数与站点清单一致；带主站 Origin 的请求返回 `Access-Control-Allow-Origin: *` 与 `Cache-Control: max-age=31536000`，重复请求返回 `CF-Cache-Status: HIT`。使用最终 CDN 地址的生产构建通过；代码尚未提交或部署。
