export default {
   name: "wet_effect",
   targetVersion: "0.10.0",
   images: ["./map-beach-wet-particle-01.svg", "./map-beach-wet-particle-02.svg", "./map-beach-wet-particle-03.svg"],
   lifetime: () => srvsdbx_Math.bounds_random(750, 1000),
   drag: 0.25,
   rotVel: 0,
   baseSize: {
      width: "auto",
      height: 2
   },
   scale: {
      start: srvsdbx_Math.bounds_random(0.5, 0.6),
      end: srvsdbx_Math.bounds_random(0.07, 0.1)
   },
   alpha: {
      start: 1,
      end: 0.7
   },
   tint: "#FFFFFF"
} satisfies ExportInterface<SimpleParticle>;