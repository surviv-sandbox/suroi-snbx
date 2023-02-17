export default {
   name: "rainbow_ball",
   targetVersion: "0.10.0",
   images: ["./rainbow-ball.svg"],
   lifetime: Infinity,
   drag: 1,
   rotVel: 0,
   baseSize: {
      width: 2,
      height: "auto"
   },
   scale: 1,
   alpha: 1,
   tint: "#FFFFFF",
   subLayer: -1
} satisfies ExportInterface<SimpleParticle>;