import Designer from '../vendor/shan-shui/classes/Designer';
import Frame from '../vendor/shan-shui/classes/Frame';
import Range from '../vendor/shan-shui/classes/Range';
import PRNG from '../vendor/shan-shui/classes/PRNG';
import Perlin from '../vendor/shan-shui/classes/Perlin';
import { config } from '../vendor/shan-shui/config';

/** Original Shan Shui design and brushwork; entire computation runs off the UI thread. */
export function generateLandscape(seed: number, width = 4800): string {
  PRNG.seed = seed;
  Perlin.perlin = undefined;
  const frame = new Frame(1);
  const plan = new Designer(new Range(-500, width + 500)).plan;
  for (const sketch of plan) frame.sketchToLayer(sketch);
  const order = config.renderer.tagOrder;
  frame.layers.sort((a,b) => order[a.tag] - order[b.tag] || a.y - b.y || a.x - b.x);
  const art = frame.layers.map(layer => layer.elements.map(e => e.stringify).join('')).join('');
  // A gentle paper tint, retaining the generator's native white mountain silhouettes.
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="1000" viewBox="0 0 ${width} 1000"><rect width="100%" height="100%" fill="#f7f7f2"/>${art}<rect width="100%" height="100%" fill="#d8dfce" opacity=".15" style="mix-blend-mode:multiply"/></svg>`;
}
