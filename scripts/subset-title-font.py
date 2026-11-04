import sys
from pathlib import Path
sys.path.insert(0, r'D:\Codex\shanshui\.tools\python')
from fontTools.ttLib import TTFont
from fontTools import subset
root=Path(r'D:\Codex\shanshui')
font=TTFont(root/'.assets-source/qiji.ttf')
text='長江萬里圖长江万里图前半卷'
cmap=font.getBestCmap()
print('Qiji missing:', ''.join(c for c in text if ord(c) not in cmap))
options=subset.Options()
options.flavor='woff2'
options.name_IDs=['*']
subsetter=subset.Subsetter(options=options)
subsetter.populate(text=text)
subsetter.subset(font)
for record in font['name'].names:
    if record.nameID in (1,4,6,16):
        value='ShanshuiMingTitle'
        record.string=value.encode(record.getEncoding(),errors='replace')
font.flavor='woff2'
font.save(root/'public/fonts/ming-title.woff2')
print('Title font bytes:',(root/'public/fonts/ming-title.woff2').stat().st_size)
