export default {
   name: "fire_effect",
   targetVersion: "0.10.0",
   images: [
      "./map-inferno-burning-particle-01.svg",
      "./map-inferno-burning-particle-02.svg",
      "./map-inferno-burning-particle-03.svg",
      "./map-inferno-burning-particle-04.svg",
      "./map-inferno-burning-particle-05.svg",
      "./map-inferno-burning-particle-06.svg",
      "./map-inferno-burning-particle-07.svg",
      "./map-inferno-burning-particle-08.svg",
      "./map-inferno-burning-particle-09.svg",
      "./map-inferno-burning-particle-10.svg",
      "./map-inferno-burning-particle-11.svg",
      "./map-inferno-burning-particle-12.svg"
   ],
   lifetime: () => srvsdbx_Math.bounds_random(500, 750),
   drag: srvsdbx_Math.bounds_random(5, 10),
   rotVel: () => srvsdbx_Math.toRad(srvsdbx_Math.bounds_random(0, 1.5), "turns"),
   baseSize: {
      width: "auto",
      height: 4
   },
   scale: {
      start: srvsdbx_Math.bounds_random(0.3, 0.4),
      end: srvsdbx_Math.bounds_random(0.07, 0.1)
   },
   alpha: {
      start: 1,
      end: 0.7
   },
   tint: "#FFFFFF"
} satisfies ExportInterface<SimpleParticle>;