(() => {
    const s = memoryManager.getItem("settings");
    if (s) {
        gamespace._overrideSettings({
            visual: {
                debug: s.visual?.debug ?? s.debug ?? false,
                graphicsQuality: s.visual?.graphicsQuality ?? s.graphicsQuality ?? 1.5,
                monitors: s.visual?.monitors ?? s.monitors ?? [0, 0],
                hud: s.visual?.hud ?? s.ui ?? true,
                maxDecals: s.visual?.maxDecals ?? Infinity
            },
            balanceChanges: {
                weapons: {
                    general: {
                        noslow: s.balanceChanges?.weapons?.general?.noslow ?? true,
                        quickswitch: (() => {
                            const v = +s.balanceChanges?.weapons?.general?.quickswitch;
                            return [0, 1, 2].includes(v) ? v : 1;
                        })() ?? 1,
                        headshots: s.balanceChanges?.weapons?.general?.headshots ?? true,
                        noBuckshotSpawnVar: s.balanceChanges?.weapons?.general?.noBuckshotSpawnVar ?? false
                    },
                    m79: {
                        grenadeSpin: s.balanceChanges?.weapons?.m79?.grenadeSpin ?? true,
                        moveSpeedPenalty: s.balanceChanges?.weapons?.m79?.moveSpeedPenalty ?? true,
                        spawnCasingOnReload: s.balanceChanges?.weapons?.m79?.spawnCasingOnReload ?? false
                    },
                    mp220: {
                        pullBothTriggers: s.balanceChanges?.weapons?.mp220?.pullBothTriggers ?? false
                    }
                }
            },
            bonusFeatures: {
                botDebug: s.bonusFeatures?.botDebug ?? s.bonus_features?.bot_debug ?? false,
                csgoStyleKillfeed: s.bonusFeatures?.csgoStyleKillfeed ?? s.bonus_features?.csgo_style_killfeed ?? false,
                damageNumbersStack: s.bonusFeatures?.damageNumbersStack ?? s.bonus_features?.damage_numbers_stack ?? false,
                headshotsUseSaturatedTracers: s.bonusFeatures?.headshotsUseSaturatedTracers ?? s.bonus_features?.headshots_use_saturated_tracers ?? false,
                showDamageNumbers: s.bonusFeatures?.showDamageNumbers ?? s.bonus_features?.show_damage_numbers ?? false,
                useInterpolatedSaturatedTracers: s.bonusFeatures?.useInterpolatedSaturatedTracers ?? s.bonus_features?.use_interpolated_tracer_colors ?? false,
            },
            name: s.name?.toString?.() ?? "Player",
            useNativeMath: s.useNativeMath ?? true
        });
    }
    else {
        memoryManager.setItem("settings", gamespace.settings);
    }
    perf.showMeters(...gamespace.settings.visual.monitors);
})();
gamespace.makeMenu(true);
gamespace.console.log("Main menu created");
