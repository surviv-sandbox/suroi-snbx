export default {
    name: "rainbowBlaster",
    targetVersion: "0.10.0",
    damage: 1e3,
    obstacleMultiplier: 1e10,
    radii: {
        min: 1,
        max: 2
    },
    particle: "srvsdbx::explosionRounds",
    decal: "srvsdbx::roundsExplosion"
} satisfies ExportInterface<SimpleExplosion>;