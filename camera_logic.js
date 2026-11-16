/* Pure camera maths for the zoom game, shared by the page and by checks/. Same maths as recipes/zoom_presets.py
   in blender-funnel: size in frame goes as 1 / distance, the preset gives the size change and how it is spread in time. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.CameraLogic = factory();
})(typeof self !== "undefined" ? self : this, function () {
  const FPS = 30.03;

  function framesFor(preset, durScale) {
    return Math.max(2, Math.round(preset.dur_s * (durScale || 1) * FPS));
  }

  /* Size factor at each of n frames: 1.0 at the start, 1 + size_pct/100 at the end (for strength 1). */
  function zoomCurve(preset, n, strength) {
    const total = Math.log(1 + preset.size_pct / 100) * (strength === undefined ? 1 : strength);
    const prof = preset.profile, out = [];
    for (let k = 0; k < n; k++) {
      const u = (k / (n - 1)) * (prof.length - 1);
      const i = Math.min(Math.floor(u), prof.length - 2);
      const p = prof[i] + (prof[i + 1] - prof[i]) * (u - i);
      out.push(Math.exp(total * p));
    }
    return out;
  }

  /* vertical field of view in radians for a lens (mm) on a sensor of height sensorH (mm) */
  function vfov(lens, sensorH) { return 2 * Math.atan((sensorH / 2) / lens); }

  /* camera position round a target: azimuth/elevation in degrees, distance in metres */
  function around(target, azDeg, elDeg, dist) {
    const a = azDeg * Math.PI / 180, e = elDeg * Math.PI / 180;
    return [target[0] + Math.cos(e) * Math.sin(a) * dist, target[1] + Math.sin(e) * dist, target[2] + Math.cos(e) * Math.cos(a) * dist];
  }

  return { FPS, framesFor, zoomCurve, vfov, around };
});
