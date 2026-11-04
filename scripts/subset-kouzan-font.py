"""Build the title font, retaining brush-style fallback for absent/empty glyphs."""
import sys,re,json
from pathlib import Path
root=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(root/'.tools/python'))
from fontTools.ttLib import TTFont
from fontTools import subset
font=TTFont(next((root/'.assets-source/kouzan').glob('*.ttf')))
if 'glyf' in font:
    empty={name for name in font.getGlyphOrder() if font['glyf'][name].numberOfContours==0}
    for table in font['cmap'].tables:
        if table.isUnicode():
            for code,name in list(table.cmap.items()):
                if 0x4e00<=code<=0x9fff and name in empty:del table.cmap[code]
cmap=font.getBestCmap()
aliases=dict(zip('长图导处暂这类还没览选择线无迹','長圖導處暫這類還沒覽選擇線無跡'))
aliases.update({'杨':'楊','谢':'謝','张':'張','叠':'疊','轴':'軸','鉴':'鑑','开':'開','蓝':'藍','传':'傳'})
for simple,traditional in aliases.items():
    if ord(simple) not in cmap and ord(traditional) in cmap:
        for table in font['cmap'].tables:
            if table.isUnicode():table.cmap[ord(simple)]=cmap[ord(traditional)]
text=''.join(path.read_text(encoding='utf-8-sig') for path in (root/'src').rglob('*.ts*') if 'vendor' not in path.parts)
text=''.join(sorted(set(re.findall(r'[\u4e00-\u9fff]',text))))
cmap=font.getBestCmap()
titles='山水山川立境山水画卷山水拾藏长江万里图千里江山图生成山水导入一处山川拾一份山水'
materials=root/'src/materials.ts'
if materials.exists():
    match=re.search(r'collectionMaterials:Material\[\]=(\[.*\]);',materials.read_text(encoding='utf-8-sig'),re.S)
    if match:titles+=''.join(item['title'] for item in json.loads(match.group(1)))
missing=sorted(set(c for c in titles if ord(c) not in cmap))
fallback=TTFont(root/'public/fonts/brush-sc.ttf')
fallback_map=fallback.getBestCmap()
for character in missing:
    name=fallback_map.get(ord(character))
    if not name or ('glyf' in fallback and fallback['glyf'][name].numberOfContours==0):
        raise ValueError('Missing fallback character: '+hex(ord(character)))
options=subset.Options()
options.drop_tables.extend(['gasp','mort'])
options.name_IDs=['*']
subsetter=subset.Subsetter(options=options)
subsetter.populate(text=text)
subsetter.subset(font)
for record in font['name'].names:
    if record.nameID in (1,4,6,16):record.string='ShanshuiKouzanTitle'.encode(record.getEncoding(),errors='replace')
font.flavor='woff2'
font.save(root/'public/fonts/kouzan-title.woff2')
print(json.dumps({'titleCoverage':'complete with brush fallback','fallback':missing,'bytes':(root/'public/fonts/kouzan-title.woff2').stat().st_size},ensure_ascii=True))
