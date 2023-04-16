type SGInfoMap = {
    applyCount: number;
};

export default {
    name: "potatoSmg",
    targetVersion: "0.10.0",
    init() {
        return {
            applyCount: 1
        };
    },
    renew(state) {
        state.applyCount++;
    },
    update(target, afflictionTime, lastUpdate, prototype, state) {
        target.radius = srvsdbx_Animation.easingFunctions.easeOutCubic(
            srvsdbx_Animation.easingFunctions.easeInCubic.bindToBounds(50, 70)(1 - 1 / state.applyCount),
            50,
            (gamespace.currentUpdate - afflictionTime) / 3000
        );

        target.modifiers.speedMultipliers.set("srvsdbx::potatoSmg", 0.8);
        // These don't stack, so we use the same key for any and all
    },
    tearDown(target) {
        target.radius = gamespace.PLAYER_SIZE;
    },
    lifetime: 3000
} satisfies ExportInterface<SimpleStatusEffect<SGInfoMap>>;