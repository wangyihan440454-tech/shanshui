# Third-party notices

## Shan Shui

- Source: https://github.com/Megaemce/shan_shui
- Original author: Lingdong Huang (2018)
- React/TypeScript implementation: Megaemce; lineage also credits RedContritio
- Vendored revision: 312ea4e6a5f7cc54786562c5bd7a8713065235c8
- License: MIT; full notice in public/LICENSE-shan-shui.txt

Original geometry, configuration, and utility code remains in src/vendor/shan-shui. A dedicated Worker generates one intact scene from a stable seed; compressed stills provide an immediate fallback. The original upstream application UI is not used.

## Art-Of-Ink / PixelFlow

- Interaction reference: https://github.com/clouder118/Art-Of-Ink
- Reference revision: 5584553f3ab070b95508e214a9277fa031476d0f
- Fluid shader source: https://github.com/diwi/PixelFlow
- PixelFlow author: Thomas Diewald
- PixelFlow revision: 3db49397164bc76373ff7e15c0a31dadb0037801
- Shader license: MIT; full notice in public/LICENSE-PixelFlow.txt

The Processing runtime is replaced by our TypeScript WebGL 2 host. PixelFlow shaders retain their copyright headers; GLSL versions, precision and strict float literals are adapted for browsers. Art-Of-Ink's source-density mixing shader also retains its PixelFlow notice. The reference parameters and held-pointer velocity / temperature interaction are preserved, with bounded viewport simulation resolution. The reference repository's music and painting are not bundled. See src/vendor/art-of-ink/README.md.

## Collection images

- Wang Ximeng, A Thousand Li of Rivers and Mountains, Northern Song. Palace Museum: https://intl.dpm.org.cn/Ceramics/518.html . Display image from the museum's public digital collection CDN. Source attributed below the viewer. No claim to ownership of the museum's digital image or an unrestricted commercial license.
- Unidentified artist, Ten Thousand Miles along the Yangzi River, Ming dynasty, accession 1973.120.3a, The Metropolitan Museum of Art: https://www.metmuseum.org/art/collection/search/36011 . Met Open Access image, object API marks public domain. The supplied object/image is the FIRST HALF of the handscroll; this site preserves that qualification. https://collectionapi.metmuseum.org/public/collection/v1/objects/36011

Images are locally compressed for display. Painting-wall frames are previews of these sources, not separately titled original works.

## Fonts

- Noto Serif SC: https://github.com/notofonts/noto-cjk ; SIL Open Font License 1.1, public/fonts/OFL.txt.
- Ma Shan Zheng: https://github.com/google/fonts/tree/main/ofl/mashanzheng ; SIL Open Font License 1.1, public/fonts/OFL-MaShanZheng.txt.

Fonts are subsetted using the Google Fonts text endpoint and served locally.

## Design references

Opening-wall motion is inspired by https://ip.e-dunhuang.com/ without bundling its murals or code. One-chapter navigation uses circular excerpts of the existing paintings beneath prominent titles, following the user's updated reference. Palette inspiration: https://zhongguose.com/ . User-supplied videos are private interaction references and are not deployed.

## Other software

React (MIT), Three.js (MIT), Vite (MIT), TypeScript (Apache-2.0), tsx (MIT), sharp (Apache-2.0). Dependency licenses remain in their installed packages.

## 齐伋体题名子集
此前题签版本采用 Lingdong Huang 的齐伋体（明代凌闵刻本字形），版本 0.0.4：https://github.com/LingDong-/qiji-font 。
仅题名所需字形构建为 public/fonts/ming-title.woff2，内部重命名 ShanshuiMingTitle，完整 OFL 许可见 public/fonts/OFL-Qiji.txt。原字体放在忽略的 .assets-source/qiji.ttf；scripts/subset-title-font.py 可重建。此前宋代画卷采用现代马善政楷书题签。最新版本根据用户要求，将所有大标题统一为下述衡山毛笔行书；不声称字体是宋人或明人原迹。


## Kouzan Gyousho / 衡山毛筆フォント行書

Aoyagi Kouzan / 青柳衡山, distributed by Musashi System / 武蔵システム.
Official source and usage terms: https://opentype.jp/kouzangyousho.htm
Original download: https://opentype.jp/bin/KouzanGyousho.zip

The official page permits free, unrestricted commercial use and logo use, and inclusion in publications and CDs. Our bundled web subset is internally named ShanshuiKouzanTitle. Missing simplified title code points map to existing corresponding traditional glyphs; brush outlines remain original. Unsupported legacy gasp/mort tables are dropped for browser compatibility. See public/fonts/LICENSE-Kouzan.txt and scripts/subset-kouzan-font.py. This contemporary font is used consistently at the owner's request; it is not represented as historical Song/Ming calligraphy.

## Collected materials added 2026-10-27

The ten entries and their 27 displayed previews retain author/attribution, source URLs, public image URLs, acquisition limits, and verification notes in docs/material-sources-2026-10-27.json. The site serves compressed previews locally and links to the original sources; public visibility is not represented as a blanket reuse license.

- Yang Jin, selected grazing leaf: https://www.guohuafuzhi.com/photos-view-id-492.page
- Xie Zhiliu, Lotus: https://www.sdxco.cn/zt/20168/201685872.html (public preview; member high-resolution download)
- Zhang Daqian, Stacked Rocks and Begonia: https://muzhiart.com/cms/show-2065.html (complete low-resolution vertical preview)
- Traditionally attributed to Qiu Ying, Landscape: https://g2.ltfc.net/view/SUHA/65535dd35cb91f3822af24d8 (local excerpt, not the complete handscroll; attribution qualification retained)
- Shen Zhou, current album leaf: https://rqxh.net/article/view.aspx?id=20722
- Wang Jian, landscape album: https://g2.ltfc.net/view/SUHA/608a61abaa7c385c8d943f10 (cover plus twelve leaves)
- Dong Qichang, six landscapes: https://g2.ltfc.net/view/SUHA/60898725c3e4f0508bcae626
- Dong Qichang, Landscape album: https://www.sdxco.cn/zt/201611/2016117250.html (one public preview, seven high-resolution images are a membership resource)
- Lan Ying, Landscape, 1659: https://digitalarchive.npm.gov.tw/opendata/Pub/Detail/14791?dep=P&mode=full (official low-resolution preview under CC0; higher resolution may use different terms)
- Traditionally attributed to Tao Cheng, F1915.36f: https://asia.si.edu/explore-art-culture/collections/search/edanmdm%3Afsg_F1915.36f/ (official CC0 image; dated to the 17th century)

Original downloads and extracted HTML are excluded from the source repository and deployment; only the selected previews and provenance records are committed.
