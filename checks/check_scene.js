// Scene spec: the room, the props and the two characters must make sense before any picture is drawn.
const S = require("../scene_spec.json");
let bad = 0;
const fail = (m) => { console.error(m); bad++; };
const [x0, x1] = S.room.x, [z0, z1] = S.room.z;
if (x1 - x0 < 5 || z1 - z0 < 5 || S.room.height < 3) fail("room too small to film in");
const items = [];
for (const c of S.characters) items.push({ id: c.id, x: c.pos[0], z: c.pos[1], w: 2 * c.radius, d: 2 * c.radius });
for (const p of S.props) items.push({ id: p.id, x: p.pos[0], z: p.pos[1], w: p.size[0], d: p.size[1] });
const ids = new Set(items.map((i) => i.id));
if (ids.size !== items.length) fail("duplicate ids");
for (const i of items) {                                                    // everything inside the room with a 0.3 m margin
  if (i.x - i.w / 2 < x0 + 0.3 || i.x + i.w / 2 > x1 - 0.3 || i.z - i.d / 2 < z0 + 0.3 || i.z + i.d / 2 > z1 - 0.3) fail(`${i.id} too close to a wall or outside`);
}
for (let a = 0; a < items.length; a++) for (let b = a + 1; b < items.length; b++) {   // no two footprints overlap (5 cm gap)
  const A = items[a], B = items[b];
  if (Math.abs(A.x - B.x) < (A.w + B.w) / 2 + 0.05 && Math.abs(A.z - B.z) < (A.d + B.d) / 2 + 0.05) fail(`${A.id} and ${B.id} overlap`);
}
const names = S.characters.map((c) => c.id).sort().join();
if (names !== "boy,mom") fail("need exactly the characters boy and mom, found " + names);
const boy = S.characters.find((c) => c.id === "boy"), mom = S.characters.find((c) => c.id === "mom");
const gap = Math.hypot(boy.pos[0] - mom.pos[0], boy.pos[1] - mom.pos[1]);
if (gap < 0.8 || gap > 2.5) fail("boy and mom must stand 0.8 to 2.5 m apart, they are " + gap.toFixed(2));
if (S.props.filter((p) => p.kind === "stanchion").length < 4) fail("need at least 4 rope posts");
if (new Set(S.props.map((p) => p.kind)).size < 4) fail("need at least 4 kinds of prop");
for (const r of S.ropes) if (!ids.has(r.from) || !ids.has(r.to)) fail("rope joins a missing post: " + JSON.stringify(r));
console.log(bad ? "check_scene FAILED" : `check_scene ok (${S.characters.length} characters, ${S.props.length} props)`);
process.exit(bad ? 1 : 0);
