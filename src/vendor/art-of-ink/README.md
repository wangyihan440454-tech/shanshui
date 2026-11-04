# Art-Of-Ink browser port

Interaction and physical parameters follow clouder118/Art-Of-Ink, revision 5584553f3ab070b95508e214a9277fa031476d0f. Original project: Processing 3.5.4 + PixelFlow. The desktop Java runtime is replaced by a WebGL 2 host; the algorithm is not replaced by an image displacement filter.

The fluid shaders are from Thomas Diewald's PixelFlow (MIT), revision 3db49397164bc76373ff7e15c0a31dadb0037801. Changes are GLSL 150 to GLSL ES 300 version declarations high precision floats, and explicit float literals required by GLSL ES. The addDensity shader is supplied by Art-Of-Ink and retains its PixelFlow copyright header. Full MIT notice: public/LICENSE-PixelFlow.txt.

Main parameters retained: velocity input scale 15, velocity radius 25, temperature radius 15, temperature input 15, vorticity .50, density dissipation .99, velocity dissipation .88, temperature dissipation .70, source mix .009, timestep .125 and 40 pressure iterations. The viewport uses the visible section of each intact handscroll as the current image source. Density is advected as RGBA color, continuously replenished from that source.

No music or reference painting from Art-Of-Ink is bundled. Our three existing artworks remain the image sources.

