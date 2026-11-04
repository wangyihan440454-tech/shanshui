# 山水

保留墨夜倾斜画墙，并提供绢本浅色模式。两种开场都缓慢流动，可暂停；点击「进入」来到一屏一个、圆形山水衬景的专题导航，支持滚轮、滑动、键盘方向键和前后按钮。

## 启动与构建

Node.js 22.12+ 或 24+。项目位置：D:\Codex\shanshui。

```powershell
npm install
npm run dev
npm run build
npm run preview
```

本机 npm 包装脚本异常时：

```powershell
& 'D:\node.exe' 'D:\node_modules\npm\bin\npm-cli.js' run dev
```

也可直接运行 node node_modules/vite/bin/vite.js --host 127.0.0.1 --port 5173。
生产输出为 dist/，静态托管配置见 .openai/hosting.json；现有 Sites 站点保持公开访问。

## 三个专题

- 山川立境：本地导入 GLB、内嵌资源的 GLTF 或 OBJ，旋转、缩放、复位、线框预览。等待用户提供正式山水模型；不上传本地文件，也不以测试模型充当馆藏。
- 山水画卷：三件独立、完整展示的来源作品。千里江山图、长江万里图的前半卷、同一个种子的生成山水。默认先展长江万里图。馆藏名称及来源说明列在画卷下方；「选卷」切换作品。馆藏卷由右向左展开。
- 山水拾藏：关键词搜索、收藏、添加 http/https 来源链接。收藏和新增素材仅保存在当前浏览器，清理浏览器数据会删除；没有账号或数据库。

水墨交互移植 Art-Of-Ink 使用的 PixelFlow 图像密度流体。左键按住拖动拨墨，右键为热力输入；触摸按住拖动同样拨墨。方向按钮、键盘方向键与 Home/End 浏览整卷。「复原」重置当前画面。不支持 WebGL 2 或浮点渲染时自动保留普通长卷；系统减少动态效果时暂停开场并关闭流体。画卷不自动滚动，无音频。

## 修改入口

- src/config.ts：标题、颜色、画墙速度与倾角、生成种子和画幅。
- src/artworks.ts：作品文件、题名、来源链接、简述及展开方向。
- src/components/PaintingWall.tsx：开场画墙。原生成图没有虚构题名。
- src/components/TopicHub.tsx：一屏一个的专题导航与圆形衬景。
- src/components/ModelGallery.tsx：本地三维预览及资源释放。
- src/components/ScrollViewer.tsx：整卷、作品切换与来源说明。
- src/components/MaterialLibrary.tsx：浏览器素材收藏和添加链接。
- src/landscape/artOfInk.ts：WebGL 2 流体宿主；src/vendor/art-of-ink 保存原始来源的着色器。
- src/landscape/：Shan Shui Worker 适配器，进入原生成作品才启动，离开时终止。
- src/style.css：墨夜/绢本配色、排版与响应式。

App 的 onEnter 回调在开场过渡完成、进入专题导航时触发。页面使用 hash 路由，支持刷新与浏览器前进/后退。主题保存在 localStorage，当前专题记在 sessionStorage；从开场重新进入时固定先到山川立境。

## 验证与开发辅助

npm run check 及 npm run build。
原生成器可运行 node node_modules/tsx/dist/cli.mjs scripts/check-art.ts。
字体更新：node scripts/fetch-font.mjs。生成备用图：npm run generate:art。

开发专用 /qa/harness.html?mode=no-webgl、reduced、failure、slow 用于验证渲染回退、减少动态效果、Worker 故障与释放。failure/slow 模式需进入「山水画卷」并在「选卷」选择生成山水。qa 不进入 dist。

视频参考帧、上游克隆、下载原稿、测试模型和临时工具均不上传源仓库或部署包。来源与许可见 THIRD_PARTY_NOTICES.md。



## 标题字体

根据最新要求，开场、专题、画卷与内容页大标题统一为衡山毛笔行书。来源：https://opentype.jp/kouzangyousho.htm ，青柳衡山书写、武藏系统发布。字体子集随站打包；部分简体码位映射为原字体的繁体字形，保持整行笔触一致。来源和用途说明见 public/fonts/LICENSE-Kouzan.txt。重新制作可使用 scripts/subset-kouzan-font.py，需 FontTools 与 Brotli。

## 2026-10-27 素材补充

第三专题加入十件来源作品、27张公开预览。条目可按画名和作者搜索、收藏；点击「看画」在站内预览、放大，画册用按钮或方向键逐页翻阅。来源链接始终保留。十个条目和页序集中在 src/materials.ts；核对信息及原图入口见 docs/material-sources-2026-10-27.json。

董其昌《仿古山水》六开、王鉴册封面及十二开已收入。杨晋为用户匹配的牧牛一开，沈周为当前册页。董其昌另一《山水册》仅有一张公开预览，其七张高清下载为会员服务；谢稚柳高清也为会员下载。传仇英图采用局部预览，完整长卷通过来源浏览。不将公开预览一概标为开放授权。

