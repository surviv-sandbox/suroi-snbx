export default {
    name: "potato-smg-hit",
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
        target.radius = srvsdbx_Animation.easingFunctions.easeOutCubic(srvsdbx_Animation.easingFunctions.linterp.bindToBounds(50, 70)(1 - 1 / state.applyCount), 50, (gamespace.currentUpdate - afflictionTime) / 3000);
        target.modifiers.speed.set("potato-smg-hit", 0.8);
        // These don't stack, so we use the same key for any and all
    },
    tearDown(target) {
        target.radius = gamespace.PLAYER_SIZE;
    },
    lifetime: 3000
};
//# sourceMappingURL=export.js.map