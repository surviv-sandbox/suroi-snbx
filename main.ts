(() => {
    const s = memoryManager.getItem("settings") as void | JSONObject;

    if (s) {
        gamespace._overrideSettings({
            visual: {
                debug: (s.visual as badCodeDesign)?.debug ?? s.debug as boolean ?? false,
                graphicsQuality: (s.visual as badCodeDesign)?.graphicsQuality ?? s.graphicsQuality as number ?? 1.5,
                monitors: (s.visual as badCodeDesign)?.monitors ?? s.monitors as [0 | 1 | 2, 0 | 1 | 2] ?? [0, 0],
                hud: (s.visual as badCodeDesign)?.hud ?? s.ui as boolean ?? true,
                maxDecals: (s.visual as badCodeDesign)?.maxDecals ?? Infinity
            },
            balanceChanges: {
                weapons: {
                    general: {
                        noslow: (s.balanceChanges as badCodeDesign)?.weapons?.general?.noslow ?? true,
                        quickswitch: (() => {
                            const v = +(s.balanceChanges as badCodeDesign)?.weapons?.general?.quickswitch;

                            return [0, 1, 2].includes(v) ? v as 0 | 1 | 2 : 1;
                        })() ?? 1,
                        headshots: (s.balanceChanges as badCodeDesign)?.weapons?.general?.headshots ?? true,
                        noBuckshotSpawnVar: (s.balanceChanges as badCodeDesign)?.weapons?.general?.noBuckshotSpawnVar ?? false
                    },
                    m79: {
                        grenadeSpin: (s.balanceChanges as badCodeDesign)?.weapons?.m79?.grenadeSpin ?? true,
                        moveSpeedPenalty: (s.balanceChanges as badCodeDesign)?.weapons?.m79?.moveSpeedPenalty ?? true,
                        spawnCasingOnReload: (s.balanceChanges as badCodeDesign)?.weapons?.m79?.spawnCasingOnReload ?? false
                    },
                    mp220: {
                        pullBothTriggers: (s.balanceChanges as badCodeDesign)?.weapons?.mp220?.pullBothTriggers ?? false
                    }
                }
            },
            bonusFeatures: {
                botDebug: (s.bonusFeatures as badCodeDesign)?.botDebug ?? (s.bonus_features as badCodeDesign)?.bot_debug ?? false,
                csgoStyleKillfeed: (s.bonusFeatures as badCodeDesign)?.csgoStyleKillfeed ?? (s.bonus_features as badCodeDesign)?.csgo_style_killfeed ?? false,
                damageNumbersStack: (s.bonusFeatures as badCodeDesign)?.damageNumbersStack ?? (s.bonus_features as badCodeDesign)?.damage_numbers_stack ?? false,
                headshotsUseSaturatedTracers: (s.bonusFeatures as badCodeDesign)?.headshotsUseSaturatedTracers ?? (s.bonus_features as badCodeDesign)?.headshots_use_saturated_tracers ?? false,
                showDamageNumbers: (s.bonusFeatures as badCodeDesign)?.showDamageNumbers ?? (s.bonus_features as badCodeDesign)?.show_damage_numbers ?? false,
                useInterpolatedSaturatedTracers: (s.bonusFeatures as badCodeDesign)?.useInterpolatedSaturatedTracers ?? (s.bonus_features as badCodeDesign)?.use_interpolated_tracer_colors ?? false,
            },
            name: s.name?.toString?.() ?? "Player",
            useNativeMath: s.useNativeMath as boolean ?? true
        });
    } else {
        memoryManager.setItem("settings", gamespace.settings);
    }

    perf.showMeters(...gamespace.settings.visual.monitors);
})();

gamespace.makeMenu(true);
gamespace.console.log("Main menu created");