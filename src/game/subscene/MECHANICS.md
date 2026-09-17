## Mechanics & Balancing

Level One is a **timed** defensive mission.

The player operates as a sniper/gunner from a helicopter circling the battlefield. The main objective is to prevent enemy forces from taking control of the strategic point at the summit while also surviving attacks from the ground.

## Player

The player controls the sniper from the helicopter.

The player can:

- Aim freely from the helicopter
- Use the rifle in normal view
- Activate the sniper scope for precise aiming
- Fire at enemy soldiers
- Fire at vehicles (explained) and environmental objects
- Reload/change magazines

The player has an unlimited total ammunition supply, but ammunition is divided into magazines.

When a magazine is empty, the player must change it before firing again.

Changing the magazine takes time, during which the player cannot shoot.

This means ammunition itself is not scarce, but **reload timing is part of the gameplay**.

## Helicopter

The helicopter continuously circles the battlefield during Level One.

The player does not directly control its flight path.

Its movement changes the player's viewing angle and forces the player to constantly reassess enemy positions.

The helicopter can be attacked by enemies on the ground.

Enemy soldiers can shoot toward it, while enemy vehicles can attack it using missiles.

The scripted helicopter crash that leads into Level Two is separate from the normal failure conditions of Level One.

## Enemy Spawning

Enemy soldiers enter the battlefield from sheds located around the area.

Enemies should not all enter at the same time.

Their spawn timing and quantity should create increasing pressure throughout the level.

Spawn behavior should be configurable using values such as:

- Spawn interval
- Number of active enemies
- Number of enemies spawned per wave
- Maximum total enemies
- Spawn location

## Enemy Soldiers

After entering the battlefield, enemy soldiers can choose between different behaviors depending on the situation.

They may:

- Advance toward the pyramid
- Move toward cover
- Hide behind obstacles
- Shoot at the helicopter
- Leave cover and continue advancing
- Climb the pyramid
- Reach the summit

Not every enemy should behave in exactly the same way.

Some enemies may focus primarily on reaching the summit, while others may create pressure by attacking the helicopter or using cover.

This creates multiple threats that the player must prioritize.

## Cover

Objects on the battlefield can provide cover for enemy soldiers.

Enemies should be able to move behind suitable obstacles and temporarily protect themselves from the sniper.

Examples include:

- Walls
- Vehicles
- Buildings
- Barriers
- Terrain objects

Enemies may later leave cover and continue advancing or attack the helicopter from their position.

## Pyramid and Summit

The pyramid is the central objective of the level.

Enemy soldiers can climb toward the summit.

Reaching the summit does not immediately end the mission.

Instead, the game keeps track of how many enemy soldiers have successfully reached the strategic point.

If the number reaches a predefined threshold, the strategic position is considered captured.

This results in **Game Over**.

The summit capture threshold should be configurable for balancing.

Example:

`maxEnemiesAtSummit = X`

## Enemy Vehicles

There can be a maximum of **2 enemy vehicles** on the battlefield.

Enemy vehicles are equipped with missiles and represent a major threat to the helicopter.

The player can shoot at the vehicles, but **direct rifle fire does NOT damage or destroy them**.

Vehicles cannot be destroyed by conventional sniper fire.

This means the player must use environmental hazards to eliminate them.

Relevant balancing parameters include:

- Maximum number of vehicles: `2`
- Missile firing interval
- Missile preparation time
- Vehicle spawn timing
- Vehicle position

## Explosive Barrels

Gunpowder / explosive barrels are placed around the battlefield.

The player can shoot these barrels to trigger a large explosion.

The explosion affects objects and enemies within a defined radius.

It can:

- Kill nearby enemy soldiers
- Destroy an enemy vehicle if the vehicle is close enough to the barrel
- Potentially eliminate several enemies at once

This creates an environmental strategy element.

Instead of always shooting enemies directly, the player can wait until soldiers or vehicles move close to an explosive barrel and then trigger it.

Explosive barrels therefore act as limited tactical opportunities on the battlefield.

Important balancing parameters include:

- Explosion radius
- Explosion damage
- Number of explosive barrels
- Barrel placement
- Distance required to destroy a vehicle
- Whether barrels can trigger other nearby barrels

## Sniper Damage

Enemy attacks can hit the sniper.

If the sniper is successfully hit, the mission immediately ends with:

**Game Over**

Enemy accuracy and firing frequency should therefore be balanced carefully so that attacks create pressure without feeling unavoidable.

Possible balancing parameters include:

- Enemy accuracy
- Enemy firing interval
- Time spent aiming before firing
- Distance modifiers
- Cover modifiers

## Mission Duration

The player must defend the strategic position for approximately **2–3 minutes**.

The exact duration should remain configurable while balancing the level.

During this time, pressure should gradually increase through combinations of:

- More enemies
- Faster spawning
- More aggressive enemy behavior
- Increased attacks on the helicopter
- Introduction of enemy vehicles
- More enemies reaching the pyramid simultaneously

The goal is for the level to become progressively more difficult rather than maintaining the same intensity from beginning to end.

## Win Condition

The player successfully completes the defensive phase if the strategic point remains secure for the required mission duration.

After successfully surviving the defensive phase, the level transitions into the scripted final sequence in which the helicopter is hit and crashes.

The sniper survives the crash.

This ends Level One and starts Level Two.

## Game Over Conditions

The player loses Level One if either of the following occurs:

- The sniper is hit by enemy fire.
- The configured maximum number of enemy soldiers reaches the summit.

## Balancing Parameters

Values that affect difficulty should be configurable rather than hard-coded wherever possible.

Important parameters include:

- Mission duration
- Enemy spawn interval
- Maximum active enemies
- Number of enemies per wave
- Summit capture threshold
- Enemy movement speed
- Enemy climbing speed
- Enemy accuracy
- Enemy firing interval
- Maximum vehicle count
- Vehicle missile firing interval
- Rifle magazine size
- Magazine reload time
- Explosion radius
- Explosion damage
- Number and placement of explosive barrels

The exact values should be adjusted through playtesting rather than being treated as permanent design rules.
