export type MaterialPage={src:string;caption?:string};
export type Material={id:string;title:string;author?:string;kind:'画卷'|'三维'|'工具'|'参考';source:string;url:string;description:string;image:string;images?:MaterialPage[];acquisition?:string;downloadUrl?:string;custom?:boolean};
export const collectionMaterials:Material[]=[
  {
    "id": "yangjin-grazing",
    "title": "仿古山水十二开 · 牧牛一开",
    "author": "杨晋",
    "kind": "画卷",
    "source": "中艺画城",
    "url": "https://www.guohuafuzhi.com/photos-view-id-492.page",
    "description": "柳岸浅渚，牧童骑牛穿行其间。",
    "image": "/materials/yanjin-grazing.webp",
    "images": [
      {
        "src": "/materials/yanjin-grazing.webp",
        "caption": "牧牛这一开"
      }
    ],
    "acquisition": "公开单页预览；仅收录已匹配的牧牛这一开。"
  },
  {
    "id": "xiezhiliu-lotus",
    "title": "荷花图轴",
    "author": "谢稚柳",
    "kind": "画卷",
    "source": "三典轩书画图库",
    "url": "https://www.sdxco.cn/zt/20168/201685872.html",
    "description": "墨荷层叠，白花与莲蓬相映。",
    "image": "/materials/xiezhiliu-lotus.webp",
    "images": [
      {
        "src": "/materials/xiezhiliu-lotus.webp",
        "caption": "完整画面"
      }
    ],
    "acquisition": "完整公开预览；高清原图下载为会员服务。"
  },
  {
    "id": "zhangdaqian-begonia",
    "title": "叠石海棠图轴",
    "author": "张大千",
    "kind": "画卷",
    "source": "木直艺术中心",
    "url": "https://muzhiart.com/cms/show-2065.html",
    "description": "奇石叠起，海棠点染春色。",
    "image": "/materials/zhangdaqian-begonia.webp",
    "images": [
      {
        "src": "/materials/zhangdaqian-begonia.webp",
        "caption": "完整画面"
      }
    ],
    "acquisition": "公开完整竖轴预览；原页面另有4720×16592原图下载入口。"
  },
  {
    "id": "qiuying-landscape",
    "title": "山水图",
    "author": "传仇英",
    "kind": "画卷",
    "source": "中华珍宝馆 · 台北故宫藏",
    "url": "https://g2.ltfc.net/view/SUHA/65535dd35cb91f3822af24d8",
    "description": "青绿山水长卷，传款仇英；馆方研究列为16—18世纪苏州片。",
    "image": "/materials/qiuying-landscape.webp",
    "images": [
      {
        "src": "/materials/qiuying-landscape.webp",
        "caption": "局部预览，完整长卷见来源"
      }
    ],
    "acquisition": "局部预览已收录，完整长卷可在来源高清浏览。"
  },
  {
    "id": "shenzhou-album",
    "title": "山水册 · 当前册页",
    "author": "沈周",
    "kind": "画卷",
    "source": "小笑话网 · 古代国画资料",
    "url": "https://rqxh.net/article/view.aspx?id=20722",
    "description": "疏林山石与扁舟相映，保留当前册页完整画面。",
    "image": "/materials/shenzhou-album.webp",
    "images": [
      {
        "src": "/materials/shenzhou-album.webp",
        "caption": "当前册页"
      }
    ],
    "acquisition": "公开当前册页预览；来源页面另提供JPG、TIF网盘入口。"
  },
  {
    "id": "wangjian-album",
    "title": "山水十二册逸品册",
    "author": "王鉴",
    "kind": "画卷",
    "source": "中华珍宝馆",
    "url": "https://g2.ltfc.net/view/SUHA/608a61abaa7c385c8d943f10",
    "description": "清代王鉴山水册，十二开与封面按原次序收入一册。",
    "image": "/materials/wangjian-album-02.webp",
    "images": [
      {
        "src": "/materials/wangjian-album.webp",
        "caption": "封面"
      },
      {
        "src": "/materials/wangjian-album-02.webp",
        "caption": "第1开"
      },
      {
        "src": "/materials/wangjian-album-03.webp",
        "caption": "第2开"
      },
      {
        "src": "/materials/wangjian-album-04.webp",
        "caption": "第3开"
      },
      {
        "src": "/materials/wangjian-album-05.webp",
        "caption": "第4开"
      },
      {
        "src": "/materials/wangjian-album-06.webp",
        "caption": "第5开"
      },
      {
        "src": "/materials/wangjian-album-07.webp",
        "caption": "第6开"
      },
      {
        "src": "/materials/wangjian-album-08.webp",
        "caption": "第7开"
      },
      {
        "src": "/materials/wangjian-album-09.webp",
        "caption": "第8开"
      },
      {
        "src": "/materials/wangjian-album-10.webp",
        "caption": "第9开"
      },
      {
        "src": "/materials/wangjian-album-11.webp",
        "caption": "第10开"
      },
      {
        "src": "/materials/wangjian-album-12.webp",
        "caption": "第11开"
      },
      {
        "src": "/materials/wangjian-album-13.webp",
        "caption": "第12开"
      }
    ],
    "acquisition": "已收录13页公开预览（含封面），来源可高清浏览。"
  },
  {
    "id": "dongqichang-six",
    "title": "仿古山水 · 六开",
    "author": "董其昌",
    "kind": "画卷",
    "source": "中华珍宝馆 · 纳尔逊—阿特金斯艺术博物馆藏",
    "url": "https://g2.ltfc.net/view/SUHA/60898725c3e4f0508bcae626",
    "description": "明代董其昌仿古山水六开，同册收录，依原顺序翻看。",
    "image": "/materials/dongqichang-six.webp",
    "images": [
      {
        "src": "/materials/dongqichang-six.webp",
        "caption": "第1开"
      },
      {
        "src": "/materials/dongqichang-six-02.webp",
        "caption": "第2开"
      },
      {
        "src": "/materials/dongqichang-six-03.webp",
        "caption": "第3开"
      },
      {
        "src": "/materials/dongqichang-six-04.webp",
        "caption": "第4开"
      },
      {
        "src": "/materials/dongqichang-six-05.webp",
        "caption": "第5开"
      },
      {
        "src": "/materials/dongqichang-six-06.webp",
        "caption": "第6开"
      }
    ],
    "acquisition": "六开公开预览已收录，来源可高清浏览。"
  },
  {
    "id": "dongqichang-seven",
    "title": "山水册",
    "author": "董其昌",
    "kind": "画卷",
    "source": "三典轩书画图库",
    "url": "https://www.sdxco.cn/zt/201611/2016117250.html",
    "description": "淡设色写远山近树，题跋与画面相映。",
    "image": "/materials/dongqichang-seven.webp",
    "images": [
      {
        "src": "/materials/dongqichang-seven.webp",
        "caption": "同册公开预览"
      }
    ],
    "acquisition": "当前公开预览1张；七张高清原图需到来源页办理会员下载。"
  },
  {
    "id": "lanying-landscape",
    "title": "山水图",
    "author": "蓝瑛",
    "kind": "画卷",
    "source": "国立故宫博物院，台北 · CC0",
    "url": "https://digitalarchive.npm.gov.tw/opendata/Pub/Detail/14791?dep=P&mode=full",
    "description": "己亥秋仲作，1659年；绢本山水轴，题于西溪文山庄。",
    "image": "/materials/lanying-landscape.webp",
    "images": [
      {
        "src": "/materials/lanying-landscape.webp",
        "caption": "全轴预览"
      }
    ],
    "acquisition": "官方公开预览已收录，来源提供开放图档。"
  },
  {
    "id": "taocheng-landscape",
    "title": "山水图页",
    "author": "传陶成",
    "kind": "画卷",
    "source": "史密森尼国立亚洲艺术博物馆 · CC0",
    "url": "https://asia-archive.si.edu/object/F1915.36f/",
    "description": "纸本设色山水册页，传统归于陶成，馆方定为17世纪。",
    "image": "/materials/taocheng-landscape.webp",
    "images": [
      {
        "src": "/materials/taocheng-landscape.webp",
        "caption": "山水图页 · F1915.36f"
      }
    ],
    "acquisition": "官方开放图像已收录，可至来源下载原图。",
    "downloadUrl": "https://ids.si.edu/ids/download/id/FS-8257_06"
  }
];
