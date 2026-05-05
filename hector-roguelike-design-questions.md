# Hector Roguelike Design Questions

This document is for deciding the new direction before rewriting the GDD or refactoring the game. Answer in rough notes first. Perfect wording can come later.

## Current High-Level Pitch

Hector is the main character. By day, he lives in a terraced house, gathers resources, rests, prepares items, and benefits from room upgrades. By night, he ventures into alleys on a branching roguelike map with combat, events, rest stops, shops, and bosses.

## Core Decisions

Fill these in as they become clear.

- Working title: 
- Tone:
- Main character summary:
- Core day loop:
- Core night loop:
- Combat style:
- Main permanent progression:
- Main run-specific progression:
- Defeat consequence:
- First MVP scope:

---

## 1. Hector

1. Is Hector the only playable cat forever, or just the starting cat?
   - Answer: Hector will be the main character and always in the party, but i'd like to have a maximum party of three and be able to switch party members. But this will be a later feature. I want the game more fleshed out first.

2. What is Hector like personality-wise?
   - Answer: Very sweet and cute during the day, tough at night. But cat personality i dont think will be relevant anymore with this new game setup. 

3. What are Hector's starting stats?
   - Suggested default: HP, Attack, Defense, Speed, Luck.
   - Answer: Suggested default is good.

4. Does Hector have classes, builds, or one flexible talent tree?
   - Answer: I want every cat to be their own class, and make hector unique in that he can be three classes at once. But for now i would hector to just be a fighter class, with for example up to 10 abilities in a tree to unlock after level ups. 

5. Can Hector permanently die, or does he always return home after defeat?
   - Answer: No, a cat has more than one life after all. 

6. What happens when Hector loses a night run?
   - Answer: He resets back to level 1 and loses all items and abilities he unlocked during the night run and goes back home. He does take any obtained resources with him to spend at home. 

---

## 2. Tone And World

1. Should the game feel cozy-comedic, spooky, melancholic, adventurous, or a mix?
   - Answer: During the day i want it to be cozy/comedic, during the night spooky/comedic.

2. Are the alleys truly dangerous, or dangerous in a cat-sized way?
   - Answer: I am not sure. Perhaps they are cat-sized for now, but after fleshing the game out more and going further into the game they get more unrealistic.

3. Should combat be real violence, cartoon scuffles, or non-lethal cat drama?
   - Answer: cartoon scuffles

4. What kinds of enemies belong in the world?
   - Examples: rival cats, dogs, noisy humans, rain, bins, shadows, scooters.
   - Answer: rats, birds, dogs, other cats for now. Later on i want more unrealistic enemies.

5. What should bosses feel like?
   - Answer: For now, just have a regular enemy do 1.5x damage and have 3x health as a boss.

---

## 3. House Phase

1. What resources exist?
   - Suggested candidates: Food, Coins, Comfort, Scrap, Energy, Curiosity.
   - Answer: How many currencies do you think should exist? I was thinking fishbones as currency and tuna(canned) as food. Anything else?

2. Does Hector choose one daytime activity, or do rooms passively generate resources?
   - Answer: Rooms passively gather resources. In every room i want hector to be doing something (if unlocked). Multiple clones, but as the day goes by quickly it creates the illusion hector is doing many things.

3. What daytime activities should exist?
   - Examples: Nap, Forage, Train, Cook, Scout, Tinker, Groom.
   - Answer: Nap, Groom, Eat, Play, regular cat things. Perhaps also add funny things like sitting in the litterbox. 

4. How long is one day?
   - Options: one player action, a short real-time timer, or idle/offline time.
   - Answer: a short real-time timer, 30 seconds?

5. Should offline progress exist?
   - Answer: No
6. How do room upgrades help night runs?
   - Examples: cushion gives max HP, kitchen creates healing items, attic stores relics.
   - Answer: I am not sure, give me suggestions. I would like upgrades to help night runs by giving either (small) flat stat upgrades or one or two potions.

---

## 4. House Layout

1. Is the house layout fixed?
   - Proposed layout: Floor 1 Living Room + Kitchen, Floor 2 Bedroom + Storage/Washing Machine, Floor 3 Attic.
   - Answer: Yes

2. Should the house be shown as a side-cutaway dollhouse?
   - Answer: Yes

3. Can rooms visually change when upgraded?
   - Answer: Not yet, this is for much later.

4. Should room upgrades have tiers?
   - Example: Basic Cushion -> Warm Cushion -> Royal Cushion.
   - Answer: Yes

5. What is each room's gameplay role?
   - Living Room: Play
   - Kitchen: Eat food
   - Bedroom: Nap
   - Storage/Washing Room: Litterbox
   - Attic: Storage

---

## 5. Calendar And Day/Night

1. Is the calendar mostly flavor, or mechanically important?
   - Answer: I is mostly for the player to track how many days they need to finish the game. 

2. Should weekdays, seasons, or weather matter?
   - Answer: Not yet.

3. Should certain events or bosses appear on certain dates?
   - Answer: Not yet. 

4. How many nights make up a chapter or act?
   - Answer: None. 

5. Can Hector go out every night?
   - Answer: Yes

---

## 6. Night Map

1. Is the alley map generated fresh every night?
   - Answer: Fresh every night

2. How many nodes before a boss?
   - Suggested MVP default: 8 nodes.
   - Answer: Suggested

3. Should the player see all node types in advance?
   - Answer: Yes

4. What node types should exist?
   - Proposed: Combat, Event, Rest, Shop, Elite, Boss.
   - Answer: Proposed

5. Can Hector abandon a run and return home early?
   - Answer: Yes

6. What are the first alley zones?
   - Examples: Back Alley, Market Street, Rooftops, Canal Path.
   - Answer: Just the back alley for now.

---

## 7. Combat

1. Is combat one Hector vs one enemy, one vs many, or variable?
   - Answer: Variable 1 vs 1-5

2. What actions are available?
   - Proposed: Attack, Ability, Item, Defend, Flee.
   - Answer:

3. Do abilities use mana, stamina, cooldowns, or another resource?
   - Answer: Mana(MP)

4. Should enemies show intent before acting?
   - Answer: What do you think?

5. What status effects should exist?
   - Examples: Wet, Hungry, Spooked, Inspired, Scratched, Hidden.
   - Answer: Wet, Hungry, Spooked for now.

6. How long should a normal battle last?
   - Suggested: 3 to 6 turns.
   - Answer: 3 to 6 turns. Boss battles around 10

7. Can Hector gain temporary combat rewards during a run?
   - Answer: Yes

---

## 8. Progression

1. Is XP permanent across runs?
   - Answer: No

2. What does XP buy?
   - Answer: After certain XP tresholds, hector levels up. Similar to octopath traveler, i want to be able to buy skills(active or passive) for the current selected class 

3. Are talents permanent?
   - Answer: no

4. Are items kept after a run or lost at dawn?
   - Answer: Lost

5. Are house upgrades permanent?
   - Answer: Yes

6. Do you want cards, relics, equipment, traditional abilities, or a mix?
   - Answer: I am leaning towards abilities

7. What should make each run feel different?
   - Answer: What do you think?

---

## 9. Items And Shops

1. What item categories exist?
   - Examples: food, toys, charms, bandages, tools, maps.
   - Answer: Items and shops are for later

2. What does the shop sell?
   - Answer:Items and shops are for later

3. Who runs the shop?
   - Answer:Items and shops are for later

4. Does money come from the house phase, night phase, or both?
   - Answer:Items and shops are for later

5. Can Hector steal, trade, or barter?
   - Answer:Items and shops are for later

---

## 10. Bosses

1. Is there a boss every night, or after several nights?
   - Answer: Every

2. Do bosses gate story progression?
   - Answer: No, there is no story for now.

3. Do bosses unlock new alley zones?
   - Answer: Yes, but not for now

4. Should bosses be repeatable with scaling difficulty?
   - Answer: Yes

5. Who is the first boss?
   - Answer: Give me a suggestion

---

## 11. Existing Content

1. Should Miso, Bean, and Mochi be removed completely?
   - Answer: Yes

2. Could they become NPCs, rivals, shopkeepers, or allies?
   - Answer: No

3. Should the project be renamed?
   - Answer: Hector's adventure

4. What current systems should definitely survive?
   - Answer: Not sure.

5. What current systems should definitely be removed?
   - Answer: Honestly probably most things, but id like your recommendation

---

## Suggested MVP

Use this section to decide the first playable version.

- One playable cat: Hector
- One fixed terraced house with five rooms
- One day action per day
- One generated alley map per night
- Combat, event, rest, shop, boss nodes
- Turn-based combat with Attack, Ability, Item
- Permanent XP talents
- Permanent room upgrades
- One alley zone
- One boss
- Around 8 to 12 total night encounters/events

MVP changes:

- Keep: Everything except One day action per day and Permanent XP talents
- Cut: One day action per day, Permanent XP talents
- Maybe later:

