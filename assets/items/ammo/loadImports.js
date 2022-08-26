import*as gun0 from"./assets/items/firearms/AK-47/export.js";
import*as gun1 from"./assets/items/firearms/AKM/export.js";
import*as gun2 from"./assets/items/firearms/AN-94/export.js";
import*as gun3 from"./assets/items/firearms/AWM-S/export.js";
import*as gun4 from"./assets/items/firearms/CZ-3A1/export.js";
import*as gun5 from"./assets/items/firearms/Dual G18C/export.js";
import*as gun6 from"./assets/items/firearms/Dual M1911/export.js";
import*as gun7 from"./assets/items/firearms/Dual M9/export.js";
import*as gun8 from"./assets/items/firearms/Dual OTs-38/export.js";
import*as gun9 from"./assets/items/firearms/Dual P30L/export.js";
import*as gun10 from"./assets/items/firearms/FAMAS/export.js";
import*as gun11 from"./assets/items/firearms/G18C/export.js";
import*as gun12 from"./assets/items/firearms/L86A2/export.js";
import*as gun13 from"./assets/items/firearms/M134/export.js";
import*as gun14 from"./assets/items/firearms/M1911/export.js";
import*as gun15 from"./assets/items/firearms/M4A1-S/export.js";
import*as gun16 from"./assets/items/firearms/M79/export.js";
import*as gun17 from"./assets/items/firearms/M870/export.js";
import*as gun18 from"./assets/items/firearms/M9/export.js";
import*as gun19 from"./assets/items/firearms/MP220/export.js";
import*as gun20 from"./assets/items/firearms/Mosin-Nagant/export.js";
import*as gun21 from"./assets/items/firearms/OTs-38/export.js";
import*as gun22 from"./assets/items/firearms/P30L/export.js";
import*as gun23 from"./assets/items/firearms/PKP Pecheneg/export.js";
import*as gun24 from"./assets/items/firearms/SV-98/export.js";
import*as gun25 from"./assets/items/firearms/USAS-12/export.js";
parseGunData([[gun0.default,"./assets/items/firearms/AK-47/"],[gun1.default,"./assets/items/firearms/AKM/"],[gun2.default,"./assets/items/firearms/AN-94/"],[gun3.default,"./assets/items/firearms/AWM-S/"],[gun4.default,"./assets/items/firearms/CZ-3A1/"],[gun5.default,"./assets/items/firearms/Dual G18C/"],[gun6.default,"./assets/items/firearms/Dual M1911/"],[gun7.default,"./assets/items/firearms/Dual M9/"],[gun8.default,"./assets/items/firearms/Dual OTs-38/"],[gun9.default,"./assets/items/firearms/Dual P30L/"],[gun10.default,"./assets/items/firearms/FAMAS/"],[gun11.default,"./assets/items/firearms/G18C/"],[gun12.default,"./assets/items/firearms/L86A2/"],[gun13.default,"./assets/items/firearms/M134/"],[gun14.default,"./assets/items/firearms/M1911/"],[gun15.default,"./assets/items/firearms/M4A1-S/"],[gun16.default,"./assets/items/firearms/M79/"],[gun17.default,"./assets/items/firearms/M870/"],[gun18.default,"./assets/items/firearms/M9/"],[gun19.default,"./assets/items/firearms/MP220/"],[gun20.default,"./assets/items/firearms/Mosin-Nagant/"],[gun21.default,"./assets/items/firearms/OTs-38/"],[gun22.default,"./assets/items/firearms/P30L/"],[gun23.default,"./assets/items/firearms/PKP Pecheneg/"],[gun24.default,"./assets/items/firearms/SV-98/"],[gun25.default,"./assets/items/firearms/USAS-12/"]]).forEach(e=>gamespace.guns.set(e.name,e));
gamespace.events.dispatchEvent("gunsLoaded");
import*as ammo0 from"./assets/items/ammo/12 gauge (buckshot)/export.js";
import*as ammo1 from"./assets/items/ammo/308sub/export.js";
import*as ammo2 from"./assets/items/ammo/40mm/export.js";
import*as ammo3 from"./assets/items/ammo/45ACP/export.js";
import*as ammo4 from"./assets/items/ammo/556mm/export.js";
import*as ammo5 from"./assets/items/ammo/762x39mm/export.js";
import*as ammo6 from"./assets/items/ammo/762x41mm/export.js";
import*as ammo7 from"./assets/items/ammo/762x51mm/export.js";
import*as ammo8 from"./assets/items/ammo/762x54mmR/export.js";
import*as ammo9 from"./assets/items/ammo/9x19mm/export.js";
import*as ammo10 from"./assets/items/ammo/FRAG-12/export.js";
parseAmmoData([[ammo0.default,"./assets/items/ammo/12 gauge (buckshot)/"],[ammo1.default,"./assets/items/ammo/308sub/"],[ammo2.default,"./assets/items/ammo/40mm/"],[ammo3.default,"./assets/items/ammo/45ACP/"],[ammo4.default,"./assets/items/ammo/556mm/"],[ammo5.default,"./assets/items/ammo/762x39mm/"],[ammo6.default,"./assets/items/ammo/762x41mm/"],[ammo7.default,"./assets/items/ammo/762x51mm/"],[ammo8.default,"./assets/items/ammo/762x54mmR/"],[ammo9.default,"./assets/items/ammo/9x19mm/"],[ammo10.default,"./assets/items/ammo/FRAG-12/"]]).forEach(e=>gamespace.bulletInfo.set(e.name,e));
gamespace.events.dispatchEvent("ammosLoaded");
import*as explosion0 from"./assets/explosions/frag/export.js";
import*as explosion1 from"./assets/explosions/usas/export.js";
parseExplosionData([[explosion0.default,"./assets/explosions/frag/"],[explosion1.default,"./assets/explosions/usas/"]]).forEach(e=>gamespace.explosionInfo.set(e.name,e));
gamespace.events.dispatchEvent("explosionsLoaded");
import{level as level0}from"./assets/levels/level0/level.js";
import{level as level1}from"./assets/levels/level1/level.js";
import{level as level2}from"./assets/levels/level2/level.js";
checkLevelVersions([level0,level1,level2]).forEach(l => gamespace.levels.set(l.name, l));
gamespace.events.dispatchEvent("levelsLoaded");