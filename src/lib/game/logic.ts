import { CAMPAIGNS, getCampaign, getScene, INVENTORY, PARTY } from "@/lib/game/content";
import type { Choice, GmResult, Hotspot, Tale } from "@/lib/game/types";

function uid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `id-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
}

const endChoice: Choice = { id: "open-chronicle", label: "Read the chronicle", hint: "The chapter is told" };

function beat(
  narration: string,
  choices: Choice[],
  extra: Partial<GmResult> = {},
): GmResult {
  return { narration, choices, ...extra };
}

const BOOK: Record<string, GmResult> = {
  "lantern-market:ask-baker": beat(
    "The baker dusts her hands and lowers her voice, which is unnecessary; the market is already listening.\n\n'Sand in the bucket at dawn. And the satchel was warm, like a stone that has been in a pocket. Whoever carried it walked out of the well, not into it.' She nods at the coal sacks. 'Those arrived without a driver. Blue at the edges when they burn.'",
    [
      { id: "search-satchel", label: "Empty the satchel on the stones" },
      { id: "well-rope", label: "Climb down as far as the rope allows" },
      { id: "follow-coal", label: "Follow the coal-smell toward the hall" },
      { id: "sacks", label: "Open a coal sack" },
    ],
    { moveTo: "stall", questTitle: "The sand in the satchel", questDetail: "The baker swears the carrier climbed out of the well." },
  ),
  "lantern-market:search-satchel": beat(
    "Holt tips the satchel. Sand, a pie-crumb, and one letter that survived by hiding in the seam. The ink has run uphill across the page.\n\nIt is a route card: Ashpine, under the hall, out at the maples. At the bottom, in a hand that is not the courier's: carry the bell the other way.",
    [
      { id: "well-rope", label: "Look down the well" },
      { id: "follow-coal", label: "Take the route card into the hall" },
      { id: "ask-baker", label: "Show the letter to the baker" },
    ],
    {
      chronicleTitle: "Ink that runs uphill",
      chronicleBody: "The only surviving letter asks the company to carry a bell the other way.",
      moveTo: "well",
    },
  ),
  "lantern-market:well-rope": beat(
    "Calder takes the rope. Ten paces down, the air turns kind. The water is warm and clear and full of ordinary pebbles, except they are arranged like a sentence.\n\nBramble reads it from the top: not a trap. A request. The river under the mountain wants its post delivered toward the sea, and it borrowed a courier to say so.",
    [
      { id: "follow-coal", label: "Follow the request into the hall" },
      { id: "search-satchel", label: "Climb out and search the satchel" },
      { id: "ask-baker", label: "Tell the baker the well is kind" },
    ],
    { moveTo: "well", heartDelta: [{ id: "calder", delta: -1 }] },
  ),
  "lantern-market:sacks": beat(
    "The sack is heavier than coal and quieter. River stones, each one chalked with a tiny post-mark. When Holt lifts one, the campfire leans toward it.\n\nNothing attacks. The stones are lost mail, waiting to be warmed into words.",
    [
      { id: "follow-coal", label: "Carry a stone into the hall" },
      { id: "ask-baker", label: "Ask who signed for the sacks" },
    ],
    { moveTo: "sacks" },
  ),
  "lantern-market:follow-coal": beat(
    "The coal-smell is a thread. It leads off the snow and into a stair that the market has been using as a place to lean shovels. Below, brass ticks.\n\nThe Orrery Hall opens around you, and the snow does not follow.",
    [
      { id: "read-letters", label: "Read the letters under the stones" },
      { id: "still-rings", label: "Ask Vesper to still the rings" },
      { id: "star-floor", label: "Step onto the star inlay" },
      { id: "descend", label: "Follow the water-sound downward" },
    ],
    {
      nextSceneId: "orrery-hall",
      daypart: "Nightfall",
      clock: "19:10",
      weather: "Still",
      sky: "NIGHTFALL · STILL",
      questTitle: "The current in the brass",
      questDetail: "The hall is tracking a river, not a sky.",
      chronicleTitle: "Into the Orrery Hall",
      chronicleBody: "The company leaves the snow and finds the post office turning like a sky.",
    },
  ),
  "orrery-hall:read-letters": beat(
    "The letters are ordinary and unbearable in the way ordinary things are. A birthday. A debt forgiven. A recipe for pie that can travel. Every one is weighed with a river stone so it will not blow toward the wrong season.\n\nVesper says the stones are not locks. They are manners.",
    [
      { id: "still-rings", label: "Still the rings" },
      { id: "descend", label: "Follow the water-sound" },
      { id: "star-floor", label: "Stand on the wet star" },
    ],
    { moveTo: "desk" },
  ),
  "orrery-hall:still-rings": beat(
    "Vesper does not command the armillary. They introduce the company. The rings slow, embarrassed, and a gap opens large enough to see a stair of wet stone going down toward autumn air.\n\nThe courier's bootprint is on the top step, still damp.",
    [
      { id: "descend", label: "Take the wet stair" },
      { id: "read-letters", label: "Gather the letters first" },
    ],
    { moveTo: "armillary", heartDelta: [{ id: "vesper", delta: -1 }] },
  ),
  "orrery-hall:star-floor": beat(
    "The wet inlay is only a finger deep, but it has a current. Light crosses it like a minnow. When Bramble puts in a hand, she feels a road under the water, sloping toward maple smoke.",
    [
      { id: "descend", label: "Follow the road under the water" },
      { id: "still-rings", label: "Ask the rings for a door instead" },
    ],
    { moveTo: "stars" },
  ),
  "orrery-hall:descend": beat(
    "The stair lets you out under maples that have no business growing on this side of a snowy pass. The forge is lit. A person sits on a crate, alive, sheepish, holding a bell the size of a fist.\n\n'I tried to deliver it uphill,' the courier says. 'It only wanted down.'",
    [
      { id: "take-bell", label: "Accept the bell and the letters" },
      { id: "ask-courier", label: "Ask the courier to tell it plainly" },
      { id: "bank-fire", label: "Bank the forge" },
      { id: "close-book", label: "Walk the courier home" },
    ],
    {
      nextSceneId: "maple-forge",
      daypart: "Morning",
      clock: "07:05",
      weather: "Woodsmoke",
      sky: "MORNING · SMOKE",
      day: 2,
      questTitle: "Carry it downhill",
      questDetail: "The courier is safe. The bell still needs a direction.",
      chronicleTitle: "The courier on the crate",
      chronicleBody: "Alive, embarrassed, and holding a bell that refuses to go uphill.",
    },
  ),
  "maple-forge:take-bell": beat(
    "The bell is lighter than guilt and heavier than it looks. It does not ring until Calder points it toward the low road. Then one note, polite, like a person clearing their throat at a doorway.\n\nThe courier laughs once, from relief. The stones in the forge dull from blue to ordinary grey.",
    [
      { id: "ask-courier", label: "Ask what the note meant" },
      { id: "bank-fire", label: "Bank the forge" },
      { id: "close-book", label: "Walk them home" },
    ],
    { moveTo: "camp" },
  ),
  "maple-forge:ask-courier": beat(
    "They talk the way people do when they have been brave in a confusing room. A voice in the well asked for a favor: take the bell downhill, toward a river that has forgotten a name. The sand was a mistake. The courier panicked and stuffed the satchel with the nearest dry thing.\n\n'I am sorry about the pie smell,' they add, which is how you know they are telling the truth.",
    [
      { id: "take-bell", label: "Take the bell" },
      { id: "close-book", label: "Promise to walk them home" },
    ],
    { moveTo: "path" },
  ),
  "maple-forge:bank-fire": beat(
    "Calder banks the forge with the side of the shovel, not the blade of anything. The stream stops climbing the rails and settles into being a stream. A maple leaf floats the correct direction.\n\nBramble marks the spot with red chalk. This time the line stays.",
    [
      { id: "take-bell", label: "Take the bell while it is quiet" },
      { id: "close-book", label: "Close the chapter" },
    ],
    { moveTo: "forge" },
  ),
  "maple-forge:close-book": beat(
    "You walk the courier back as far as the snow, which receives you without comment. The baker cries in the efficient way of someone who has pies in the oven and a person returned.\n\nThe bell stays wrapped. Somewhere downhill a river practices a name. Ashpine Post is a chapter you can close.",
    [endChoice],
    {
      questTitle: "The post is delivered",
      questDetail: "The courier is home. The bell goes downhill another day, and that is enough.",
      chronicleTitle: "Home before the pies cool",
      chronicleBody: "The company brings the courier back. The bell does not ring. The mountain settles.",
      moveTo: "path",
    },
  ),
  "reed-crossing:speak-grey": beat(
    "The man in grey is not lost. He is waiting to be correctly addressed. His coat is a ferryman's coat, and his boots have not been wet in a long time.\n\n'I put the bell under the arch so it would stop calling people by the wrong names,' he says. 'It kept one. I would like it back, but I cannot go into the water. I have forgotten how to be wet.'",
    [
      { id: "listen-arch", label: "Listen at the arch for him" },
      { id: "blank-sign", label: "Ask about the blank sign" },
      { id: "wade", label: "Wade into the reeds" },
      { id: "follow-chain", label: "Follow the chain upriver" },
    ],
    {
      moveTo: "reeds",
      questTitle: "Follow the bell's trail",
      questDetail: "The ferryman cannot get wet. The name he lost is upstream, or under the arch.",
    },
  ),
  "reed-crossing:blank-sign": beat(
    "The stonecutter does not look up. 'It was a name with a V in it. Two syllables. I filled it in because the bell kept ringing it at night and the bowls on the bar walked to the edge.'\n\nHe offers you the chisel, then thinks better, and offers you a rubbing stone instead. 'If you find the letters, I will put them back. I should not have been afraid of a word.'",
    [
      { id: "speak-grey", label: "Tell the ferryman" },
      { id: "listen-arch", label: "Listen under the arch" },
      { id: "follow-chain", label: "Follow the chain upriver" },
    ],
    { moveTo: "hut" },
  ),
  "reed-crossing:shelter": beat(
    "The inn is warm in the specific way of wet wool and onion soup. The innkeeper sets down the bowl she has been holding.\n\n'The river took a name and left the debt,' she says. 'We are not haunted. We are unfinished. If you are going upriver, take a pie. The toll fort echoes and echoes are hungrier than travelers.'",
    [
      { id: "speak-grey", label: "Go back out to the ferryman" },
      { id: "blank-sign", label: "Visit the stonecutter" },
      { id: "follow-chain", label: "Take the pie and follow the chain" },
    ],
    { moveTo: "inn" },
  ),
  "reed-crossing:listen-arch": beat(
    "Under the arch the rain sounds like cutlery put away carefully. One note rises from the chain — not loud, not a warning. A person saying here.\n\nVesper's bead ticks in answer. The chain does not end in the village. It runs upriver, toward the old toll.",
    [
      { id: "follow-chain", label: "Follow the chain upriver" },
      { id: "wade", label: "Wade and look for the bell" },
      { id: "speak-grey", label: "Report the note to the ferryman" },
    ],
    { moveTo: "arch" },
  ),
  "reed-crossing:wade": beat(
    "The reeds take you to the knee and no further. The bell is there, green and patient, too heavy for one person and too beloved to drag. Letters are scratched on the inner lip. Rain has nearly had them.\n\nBramble traces what she can: a V, an O, the ghost of a double S. The rest of the name is not here. The chain tugs, very gently, upriver.",
    [
      { id: "follow-chain", label: "Follow the chain to the rest of the name" },
      { id: "speak-grey", label: "Climb out and tell him" },
    ],
    { moveTo: "reeds", heartDelta: [{ id: "bramble", delta: -1 }] },
  ),
  "reed-crossing:follow-chain": beat(
    "You walk the bank at dusk until dusk gives up. The chain is a rumor under the path, then a fact in the yard of the toll fort. Morning finds you there, and the fort finds you kind.\n\nIn the tower, a name has been hidden in its own grooves.",
    [
      { id: "copy-name", label: "Copy the name in trail chalk" },
      { id: "ask-maren", label: "Ask if the ferryman is Maren" },
      { id: "ring-once", label: "Ring the chain once, gently" },
      { id: "close-book", label: "Take the name home to the sign" },
    ],
    {
      nextSceneId: "toll-fort",
      daypart: "Morning",
      clock: "09:20",
      weather: "Clear",
      sky: "MORNING · CLEAR",
      day: 2,
      questTitle: "Give the name back",
      questDetail: "The tower remembers Maren Voss. The sign in the village does not, yet.",
      chronicleTitle: "Reeds in Stillwater",
      chronicleBody: "The company follows a chain upriver and finds a name hidden in the tower.",
    },
  ),
  "toll-fort:copy-name": beat(
    "Bramble's red chalk will not do. She uses the white. MAREN VOSS sits on a shingle, plain as bread. The letters do not smudge when the wind tries them.\n\nFrom the yard, the ferryman — you did not hear him arrive — says, 'Yes. That one. I left it here because a bell that says your name all night is a hard roommate.'",
    [
      { id: "ask-maren", label: "Let him say the rest" },
      { id: "ring-once", label: "Ring the chain once" },
      { id: "close-book", label: "Carry the rubbing home" },
    ],
    { moveTo: "tower" },
  ),
  "toll-fort:ask-maren": beat(
    "He is Maren Voss. He retired from the ferry the year the arch cracked, and he has been dry ever since, which he thought was safety and which turned out to be a long hallway.\n\n'Put the name back on the sign,' he says. 'I will stand in the rain on purpose. I am tired of being a rumor with boots.'",
    [
      { id: "close-book", label: "Take him home to the sign" },
      { id: "ring-once", label: "Ring the chain as a promise" },
    ],
    { moveTo: "gate" },
  ),
  "toll-fort:ring-once": beat(
    "One note. The chain carries it without drama. Far off, the bowls in the inn probably take one polite step back from the edge and then think better of jumping.\n\nHolt grins. 'That is a bell that has been asked, not ordered.'",
    [
      { id: "copy-name", label: "Copy the name" },
      { id: "close-book", label: "Go back while the note is still in the air" },
    ],
    { moveTo: "yard" },
  ),
  "toll-fort:close-book": beat(
    "The stonecutter cries, briefly, and then does the work. MAREN VOSS goes back into the sign. The ferryman stands in the rain until his shoulders darken, and he looks so relieved it is a little funny.\n\nUnder the arch, the bell rings once, on its own, and then keeps a decent silence. Stillwater can close.",
    [endChoice],
    {
      questTitle: "The name is on the sign",
      questDetail: "Maren Voss is wet, remembered, and no longer a rumor.",
      chronicleTitle: "The sign remembers",
      chronicleBody: "The company brings the name home. The bell rings once and agrees to rest.",
    },
  ),
  "salt-wharf:harbormaster": beat(
    "The harbormaster has salt in her eyebrows and no patience for mysteries that delay tides, which is to say she has some.\n\n'The night chart was whole at noon. At dusk the coast was gone and a deckhand was gone with it. The Lark does not sail blind. You have five days, and I have a cracked bell and a reputation. Fix the kinder of those problems.'",
    [
      { id: "footprints", label: "Follow the wet footprints" },
      { id: "open-crate", label: "Open the starred crate" },
      { id: "cracked-bell", label: "Inspect the bell" },
    ],
    { moveTo: "warehouse" },
  ),
  "salt-wharf:footprints": beat(
    "Left, right, and then the idea of a foot. The last print is cold. Bramble lies on the boards and looks sideways, which is how scouts embarrass puddles into confessing.\n\nThe water in the print points, very slightly, at a crate starred in chalk.",
    [
      { id: "open-crate", label: "Open the starred crate" },
      { id: "harbormaster", label: "Tell the harbormaster" },
      { id: "cracked-bell", label: "Check the bell on the way" },
    ],
    { moveTo: "pier" },
  ),
  "salt-wharf:cracked-bell": beat(
    "The crack is old. The clapper is new, wrapped in sailcloth so it will not ring the whole harbor awake. Inside the cloth, a knot Holt knows: deckhand work, tidy, ashamed of itself.\n\nWhoever hid the chart did not want a scene. They wanted a delay.",
    [
      { id: "open-crate", label: "Find the chart before the delay runs out" },
      { id: "footprints", label: "Go back to the footprints" },
    ],
    { moveTo: "warehouse" },
  ),
  "salt-wharf:open-crate": beat(
    "The starred crate holds a wool coat, an orange, and a key to the chart tower. No chart. A note in a round hand: Night room. Do not sail the dark without Splint Light.\n\nThe key is warm. The tower is up the stair the clerk pretended not to mention.",
    [
      { id: "search-room", label: "Search the chart room" },
      { id: "read-note", label: "Read the note aloud" },
      { id: "telescope", label: "Turn the telescope down" },
      { id: "to-gate", label: "Take the note toward the gate" },
    ],
    {
      nextSceneId: "night-chart",
      daypart: "Nightfall",
      clock: "21:40",
      weather: "Clear",
      sky: "NIGHTFALL · CLEAR",
      questTitle: "Mend the coast",
      questDetail: "The chart room has the rest of the kindness, and the missing piece of coast.",
      chronicleTitle: "Footprints that stop",
      chronicleBody: "A warm key, an orange, and a warning not to sail without the lighthouse.",
      moveTo: "crates",
    },
  ),
  "night-chart:search-room": beat(
    "You search like people who have been asked to be careful with paper. The cut coast is not in the desk. Through the telescope, pointed wrongly at a roof, a pale scrap shows under a tile like a tongue.\n\nHolt is already measuring the climb with his eyes and deciding to use the stairs instead.",
    [
      { id: "telescope", label: "Send Holt for the scrap" },
      { id: "read-note", label: "Read the note first" },
      { id: "to-gate", label: "Take what you have to the gate" },
    ],
    { moveTo: "telescope" },
  ),
  "night-chart:read-note": beat(
    "Vesper reads it without adding thunder. The tender at Splint Light has not come in. The deckhand hid the chart so the Lark would have to wait. It is a clumsy good idea, which is the most common kind.\n\nThe coast still has to be sewn back. A ship that waits should also be able to see.",
    [
      { id: "telescope", label: "Fetch the cut coast" },
      { id: "to-gate", label: "Carry the note to the tidegate" },
    ],
    { moveTo: "desk" },
  ),
  "night-chart:telescope": beat(
    "The scrap under the tile is the missing crescent of coast, wrapped in oilcloth and weighted with a nail so the wind would not improve the plan. The cut is clean. It can be mended.\n\nDown on the sea-wall, lanterns are already gathering. The Lark's crew coils rope when they are nervous.",
    [
      { id: "to-gate", label: "Take the coast to the tidegate" },
      { id: "read-note", label: "Bring the note as well" },
    ],
    { moveTo: "telescope", chronicleTitle: "The coast under a tile", chronicleBody: "The missing shore was hidden, not destroyed." },
  ),
  "night-chart:to-gate": beat(
    "Morning wind takes you down to the tidegate. The deckhand is in the yard with the look of a person who has rehearsed a confession and would like to skip to the apology.\n\nOut on the water, a skiff with a patched sail is trying to be on time.",
    [
      { id: "speak-crew", label: "Ask the crew for one more tide" },
      { id: "mend-chart", label: "Mend the chart on the cart" },
      { id: "light-signal", label: "Signal Splint Light" },
      { id: "close-book", label: "Wait for the light to answer" },
    ],
    {
      nextSceneId: "tide-gate",
      daypart: "Morning",
      clock: "06:50",
      weather: "Wind",
      sky: "MORNING · WIND",
      day: 2,
      questTitle: "One tide of patience",
      questDetail: "The tender is almost in. Someone has to ask the ship to wait, and mean it.",
      chronicleTitle: "Down to the gate",
      chronicleBody: "The company carries a cut coast and a decent reason to the tidegate.",
    },
  ),
  "tide-gate:speak-crew": beat(
    "Calder does not shout. He says the tender's name — you have all learned it by now, it is on the note — and he says one tide. The boatswain looks at the skiff, then at the mended chance of a chart, and spits, thoughtfully, downwind.\n\n'One tide,' she says. 'Tell your deckhand the knots were good. The plan was rotten. Both can be true.'",
    [
      { id: "mend-chart", label: "Mend the chart while they wait" },
      { id: "light-signal", label: "Light the signal" },
      { id: "close-book", label: "Let that be the ending" },
    ],
    { moveTo: "yard" },
  ),
  "tide-gate:mend-chart": beat(
    "Paste, pressure, and a weight. The coast lies down. Bramble blows on it as if it were soup. The crescent joins so well that only a person looking for a scar would find one.\n\nVesper taps the margin, where charts leave room for honesty, and writes: held one tide for Splint Light.",
    [
      { id: "light-signal", label: "Signal the lighthouse" },
      { id: "close-book", label: "Close the book on a whole coast" },
    ],
    { moveTo: "cart", chronicleTitle: "A coast put back", chronicleBody: "The night chart is whole again, with a note in the margin about patience." },
  ),
  "tide-gate:light-signal": beat(
    "Calder's lantern fits the signal slot as if the slot had been lonely. Three slow shows, the harbormaster's pattern for hold. A small light answers from the skiff, then a stronger one from the headland as the tender reaches the stair of Splint Light and does their job.\n\nThe cracked bell down in the harbor rings anyway. Someone is happy.",
    [
      { id: "close-book", label: "Watch the light and close the book" },
      { id: "mend-chart", label: "Finish the chart if it still needs you" },
    ],
    { moveTo: "tower" },
  ),
  "tide-gate:close-book": beat(
    "The Lark waits one tide, which is a small miracle made of rope and manners. Splint Light burns. The deckhand is yelled at, fed, and put back on the watch bill. The chart goes aboard with its scar and its honest margin.\n\nDusk Harbor keeps its ship, its tender, and its story. You can close the book.",
    [endChoice],
    {
      questTitle: "The light is lit",
      questDetail: "The ship waited. The coast is whole. The harbor is loud in a glad way.",
      chronicleTitle: "One tide",
      chronicleBody: "They hold the gate, mend the chart, and watch Splint Light answer.",
    },
  ),
};

function choicesFor(sceneId: string): Choice[] {
  const scene = CAMPAIGNS.flatMap((c) => c.scenes).find((s) => s.id === sceneId);
  return scene?.choices.slice(0, 4) ?? [];
}

function findSpot(tale: Tale, text: string): Hotspot | undefined {
  const scene = getScene(tale.campaignId, tale.sceneId);
  if (!scene) return undefined;
  const low = text.toLowerCase();
  return scene.hotspots.find((h) => low.includes(h.name.toLowerCase()) || low.includes(h.id.replace("-", " ")));
}

export function createTale(campaignId: string, playerName: string): Tale {
  const campaign = getCampaign(campaignId);
  if (!campaign) throw new Error("Unknown tale");
  const scene = campaign.scenes[0];
  const party = PARTY.map((p) => ({ ...p }));
  const positions: Record<string, string> = {};
  party.forEach((p, i) => {
    positions[p.id] = scene.hotspots[i % scene.hotspots.length].id;
  });
  const name = playerName.trim() || "Traveler";
  return {
    id: uid(),
    playerName: name,
    campaignId,
    sceneId: scene.id,
    chapter: 1,
    day: 1,
    daypart: scene.daypart,
    clock: scene.clock,
    weather: scene.weather,
    sky: scene.sky,
    activeId: party[0].id,
    party,
    positions,
    quest: { ...scene.quest },
    inventory: INVENTORY.map((item) => ({ ...item })),
    chronicle: [
      {
        id: uid(),
        day: 1,
        title: scene.chronicleTitle,
        body: scene.opening,
        sceneName: scene.name,
        campaignName: campaign.name,
        image: scene.image,
      },
    ],
    narration: scene.opening,
    choices: scene.choices,
    log: [{ role: "gm", text: scene.opening }],
    updatedAt: Date.now(),
    beat: 0,
  };
}

export function localGm(
  tale: Tale,
  action: { choiceId?: string; text: string; roll?: { total: number; dc: number; success: boolean; label: string } },
): GmResult {
  const key = action.choiceId ? `${tale.sceneId}:${action.choiceId}` : "";
  if (key && BOOK[key]) return BOOK[key];

  const scene = getScene(tale.campaignId, tale.sceneId);
  const actor = tale.party.find((p) => p.id === tale.activeId) ?? tale.party[0];
  const spot = findSpot(tale, action.text) ?? scene?.hotspots.find((h) => h.id === tale.positions[actor.id]);

  if (!scene || !spot) {
    return beat(`${actor.name} waits. The table is quiet.`, choicesFor(tale.sceneId));
  }

  if (action.roll) {
    const { success, total, dc, label } = action.roll;
    const narration = success
      ? `${label}. ${total} against ${dc} — it turns. ${spot.examine} Nobody is hurt beyond a bruise of pride.`
      : `${label}. ${total} against ${dc} — it slips. ${actor.name} is pulled back by the others before it becomes a wound. ${spot.examine}`;
    return beat(narration, choicesFor(tale.sceneId).slice(0, 3), {
      heartDelta: success ? [{ id: actor.id, delta: -1 }] : [{ id: actor.id, delta: -2 }],
      moveTo: spot.id,
    });
  }

  if (action.choiceId === "open-chronicle") {
    return beat(tale.narration, [endChoice]);
  }

  return beat(
    `${actor.name} tries it in earnest. ${action.text.trim()} ${scene.ambient} ${spot.examine}`,
    choicesFor(tale.sceneId).slice(0, 3),
    { moveTo: spot.id },
  );
}

export function applyTale(tale: Tale, playerLine: string, result: GmResult): Tale {
  const campaign = getCampaign(tale.campaignId);
  if (!campaign) return tale;
  let scene = getScene(tale.campaignId, tale.sceneId) ?? campaign.scenes[0];
  let sceneId = tale.sceneId;
  let chapter = tale.chapter;
  let positions = { ...tale.positions };
  let day = result.day ?? tale.day;

  const next = result.nextSceneId ? getScene(tale.campaignId, result.nextSceneId) : undefined;
  if (next && next.id !== scene.id) {
    scene = next;
    sceneId = next.id;
    chapter += 1;
    positions = {};
    tale.party.forEach((p, i) => {
      positions[p.id] = next.hotspots[i % next.hotspots.length].id;
    });
  } else if (result.moveTo && scene.hotspots.some((h) => h.id === result.moveTo)) {
    positions[tale.activeId] = result.moveTo;
  }

  const party = tale.party.map((c) => {
    const delta = result.heartDelta?.find((h) => h.id === c.id)?.delta ?? 0;
    const heart = Math.max(1, Math.min(c.heartMax, c.heart + delta));
    return heart === c.heart ? c : { ...c, heart };
  });

  const chronicle = [...tale.chronicle];
  if (result.chronicleTitle && result.chronicleBody) {
    chronicle.push({
      id: uid(),
      day,
      title: result.chronicleTitle,
      body: result.chronicleBody,
      sceneName: scene.name,
      campaignName: campaign.name,
      image: scene.image,
    });
  }

  const quest =
    result.questTitle && result.questDetail
      ? { title: result.questTitle, detail: result.questDetail }
      : tale.quest;

  const log = tale.log.slice(-10);
  log.push({ role: "you", text: playerLine }, { role: "gm", text: result.narration });

  return {
    ...tale,
    sceneId,
    chapter,
    day,
    daypart: result.daypart || (next ? next.daypart : tale.daypart),
    clock: result.clock || (next ? next.clock : tale.clock),
    weather: result.weather || (next ? next.weather : tale.weather),
    sky: result.sky || (next ? next.sky : tale.sky),
    party,
    positions,
    quest,
    chronicle,
    narration: result.narration,
    choices: result.choices.slice(0, 4),
    log,
    beat: tale.beat + 1,
    updatedAt: Date.now(),
  };
}

export function encodeTale(tale: Tale): string {
  const bytes = new TextEncoder().encode(JSON.stringify(tale));
  let bin = "";
  bytes.forEach((b) => {
    bin += String.fromCharCode(b);
  });
  return btoa(bin).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

export function decodeTale(code: string): Tale | null {
  try {
    const pad = code.trim().replaceAll("-", "+").replaceAll("_", "/");
    const padded = pad + "=".repeat((4 - (pad.length % 4)) % 4);
    const bin = atob(padded);
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    const tale = JSON.parse(new TextDecoder().decode(bytes)) as Tale;
    if (!getCampaign(tale.campaignId) || !getScene(tale.campaignId, tale.sceneId)) return null;
    if (!tale.narration || !Array.isArray(tale.party) || tale.party.length < 1) return null;
    return { ...tale, id: uid(), updatedAt: Date.now() };
  } catch {
    return null;
  }
}

export function skillMod(id: string): number {
  if (id === "bramble" || id === "holt") return 4;
  if (id === "calder") return 3;
  return 3;
}

export function rollCheck(mod: number, dc = 13) {
  const roll = 1 + Math.floor(Math.random() * 20);
  const total = roll + mod;
  return { roll, mod, total, dc, success: total >= dc };
}
