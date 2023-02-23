export default {
    name: "explosion_water",
    targetVersion: "0.10.0",
    damage: 2,
    obstacleMult: 1,
    radii: {
        min: 1.24,
        max: 1.25
    },
    scatter: {
        count: 8,
        velocity: () => srvsdbx_Math.bounds_random(5, 10),
        particleType: "srvsdbx::water_balloon_impact"
    }
} satisfies ExportInterface<SimpleExplosion>;