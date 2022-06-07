import { level as level0 } from "./assets/levels/level0/level.js";
import { level as level1 } from "./assets/levels/level1/level.js";
import { level as level2 } from "./assets/levels/level2/level.js";
gamespace.levels = [level0, level1, level2];
gamespace.events.dispatchEvent("levelsLoaded");