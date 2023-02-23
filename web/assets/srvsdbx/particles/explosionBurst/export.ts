export default {
   name: "explosionBurst",
   targetVersion: "0.10.0",
   images: ["./part-frag-burst-01.svg"],
   lifetime: 500,
   drag: 1,
   rotVel: 0,
   baseSize: {
      width: 2.5,
      height: "auto"
   },
   scale: {
      start: 1,
      end: 4
   },
   alpha: {
      start: 1,
      end: 0
   },
   tint: () => `hsl(16, 100%, ${srvsdbx_Math.meanDevPM_random(26.4, 0.5, true)}%)`
} satisfies ExportInterface<SimpleParticle>;