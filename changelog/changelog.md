<h2>v0.6.1</h2>
<h3>June 21<sup>st</sup> 2022</h3>

<ul>
<li> Fixed a typo inside <code>util.ts</code>. (variataion => variation)
</ul>

<h2>v0.6.0</h2>
<h3>June 15<sup>th</sup> 2022</h3>

<ul>
<li> Adjusted tracer opacity for suppressed weapons
<li> Adjusted casing spawns
<li> Changed some animation values (recoil impulse lengths and magnitudes)
<li> Retroactively renamed all versions to comply with the <a href="https://semver.org">SemVer</a> (Semantic Versioning) specification
<li> Made the changelog prettier
<li> Fixed some bad links on the attributions page
<li> Fixed a bug with shooting at an invalid time
</ul>

<h2>v0.5.1</h2>
<h3>June 7<sup>th</sup> 2022</h3>

<ul>
<li> Fixed a typo in the changelog
<li> Holding attack either while the weapon is reloading or while the weapon isn't ready to fire will allow the weapon to fire when it is ready to do so again
<li> For ammo types that lack distinct saturated tracer colors (9mm, 12 gauge and 5.56mm), a new option allows the game to create new values based on ammo types that have distinct saturated tracers.
<li> Fixed a bug where presets wouldn't apply correctly when re-entering the 'Bot 1v1' level
<li> Fixed a bug where exiting 'Bot 1v1' would prevent re-entering the level with fatal crashes
<li> Fixed a bug where levels' event listeners weren't being cleaned up properly
</ul>

<h2>v0.5.0</h2>
<h3>June 6<sup>th</sup> 2022</h3>

<ul>
<li> Restructuring, housekeeping
<li> Fixed 'prev_item' not working correctly
<li> Fixed and re-added distance-based rendering
<li> Added pause menu, functionality to gracefully exit a level
<li> Binded 'cancel' to x
<li> Minor styling updates
</ul>

<h2>v0.4.0</h2>
<h3>June 1<sup>st</sup> 2022</h3>

<ul>
<li> Added weapons:
    <ul> 
    <li> SV-98
    <li> L86A2
    <li> AN-94
    <li> P30L
    <li> Dual P30L
    <li> FAMAS
    <li> OTs-38
    <li> Dual OTs-38
    <li> M134
    <li> M79
    </ul> 
<li> Added "automatic" burst fire; hold the attack button to fire off burst weapons in an automatic fashion
<li> Hand outlines are no longer pitch black
<li> Headshot kills are indicated with a red glow in the alternate killfeed
</ul>

<h2>v0.3.0</h2>
<h3>May 29<sup>th</sup> 2022</h3>

<ul>
<li> Total bot AI overhaul
<li> Added better system to interact with localStorage
<li> Added option to hide UI (bound to p)
<li> More settings are modifiable
<li> Added second level
<li> Added level select screen
<li> Temporarily disabled distance-based rendering optimization
<li> Added support for mouse wheel key binds
</ul>

<h2>v0.2.0</h2>
<h3>May 25<sup>th</sup> 2022</h3>

<ul>
<li> Made the boot-up message less dramatic
<li> Firing your weapon slows you down
<li> Added a second weapon slot
    <ul> 
    <li> Added quickswitch and noslow mechanics, based off of <a href="https://github.com/surviv-underclock/docs">this paper on the subject</a>
    </ul> 
<li> Made hand outlines slightly thicker
<li> Fixed a bug that prevented firing while reloading single-shot realoding weapons like the M870
<li> Minor weapon adjustments (mostly cosmetic)
<li> Binded 'slot0', 'slot1', 'last_item', 'next_item' and 'prev_item' to 1, 2, Q, MWheelUp and MWheelDown respectively
<li> Added an attributions page
<li> Game remebers health presets
<li> Option to disable AI added
</ul>

<h2>v0.1.0</h2>
<h3>May 24<sup>th</sup> 2022</h3>

<ul>
<li> Changelog created
</ul>