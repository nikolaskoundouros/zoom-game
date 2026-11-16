// Zoom maths: every preset must start at size 1.0 and end at exactly its measured size change, moving one way only.
const L = require("../camera_logic.js");
const P = require("../zoom_presets.json").presets;
let bad = 0;
if (P.length !== 9) { console.error("expected 9 presets, found " + P.length); bad++; }
for (const p of P) {
  const n = L.framesFor(p), c = L.zoomCurve(p, n);
  const want = 1 + p.size_pct / 100;
  const dir = p.size_pct > 0 ? 1 : -1;
  const mono = c.every((v, i) => i === 0 || (c[i] - c[i - 1]) * dir >= -1e-9);
  const ok = Math.abs(c[0] - 1) < 1e-6 && Math.abs(c[n - 1] - want) < 1e-6 && mono;
  if (!ok) { console.error(`${p.id} ${p.label}: start ${c[0]}, end ${c[n - 1]} (want ${want}), monotone ${mono}`); bad++; }
}
const half = L.zoomCurve({ size_pct: 100, profile: [0, 0.5, 1] }, 5, 0.5);        // strength 0.5 of a x2 zoom ends at x sqrt(2)
if (Math.abs(half[4] - Math.SQRT2) > 1e-9) { console.error("strength dial wrong: " + half[4]); bad++; }
if (Math.abs(L.vfov(36.1, 36) * 180 / Math.PI - 53.1) > 0.2) { console.error("vfov wrong"); bad++; }
console.log(bad ? "check_logic FAILED" : "check_logic ok (" + P.length + " presets)");
process.exit(bad ? 1 : 0);
