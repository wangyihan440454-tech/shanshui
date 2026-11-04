export type Artwork = {
 id:string; title:string; subtitle:string; src:string; preview:string;
 width:number; height:number; direction:'rtl'|'ltr';
 source:string; sourceUrl:string; description:string; alt:string;
};
export const artworks:Artwork[] = [
 {id:'qianli',title:'千里江山图',subtitle:'北宋 · 王希孟',src:'/artworks/qianli-jiangshan.webp',preview:'/artworks/qianli-preview.webp',width:9113,height:360,direction:'rtl',source:'故宫博物院',sourceUrl:'https://intl.dpm.org.cn/Ceramics/518.html',description:'以石青石绿绘就连绵山川，舟桥与村落相映成境。',alt:'王希孟《千里江山图》完整图像，包含青绿山水及卷后题跋'},
 {id:'yangzi',title:'长江万里图 · 前半卷',subtitle:'明代 · 佚名',src:'/artworks/yangzi-river.webp',preview:'/artworks/yangzi-preview.webp',width:4000,height:511,direction:'rtl',source:'大都会艺术博物馆',sourceUrl:'https://www.metmuseum.org/art/collection/search/36011',description:'以浓淡墨色铺陈长江两岸的山川、林木与村落。',alt:'明代佚名《长江万里图》前半卷完整图像，保留此馆藏画幅全部内容'},
 {id:'generated',title:'生成山水',subtitle:'算法绘景 · 水墨长卷',src:'/landscapes/fallback.webp',preview:'/landscapes/fallback.webp',width:4800,height:1000,direction:'ltr',source:'{Shan, Shui}*',sourceUrl:'https://github.com/Megaemce/shan_shui',description:'山峦、林木与江上舟楫，由算法连续绘成一卷。',alt:'一件完整的生成山水长卷，层叠远山、林间屋舍与江上舟楫'},
];
