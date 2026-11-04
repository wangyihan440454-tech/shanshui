import sys,os
sys.path.insert(0,r'D:\Codex\shanshui\.tools\python')
import av
from PIL import Image,ImageDraw
p=sys.argv[1]
c=av.open(p)
s=c.streams.video[0]
duration=float(s.duration*s.time_base) if s.duration else float(c.duration/av.time_base)
print({'duration':duration,'width':s.width,'height':s.height,'frames':s.frames})
times=[duration*i/8 for i in range(8)]
images=[]
for f in c.decode(s):
 t=float(f.time or 0)
 if len(images)<8 and t>=times[len(images)]:
  im=f.to_image();im.thumbnail((480,300));images.append((t,im.copy()))
 if len(images)==8:break
sheet=Image.new('RGB',(480*2,330*4),'#21272a');d=ImageDraw.Draw(sheet)
for i,(t,im) in enumerate(images):
 x=(i%2)*480;y=(i//2)*330;sheet.paste(im,(x+(480-im.width)//2,y+25));d.text((x+8,y+6),f'{t:.1f}s',fill='white')
sheet.save(r'D:\Codex\shanshui\docs\reference-video\contact-sheet.jpg',quality=90)
