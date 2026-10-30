import { i as __toESM } from "../_runtime.mjs";
import { b as require_jsx_runtime, q as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { a as getScene, i as getCampaign, n as INVENTORY, r as PARTY, t as CAMPAIGNS } from "./content-BlwjfujB.mjs";
import { a as number, n as array, o as object, r as boolean, s as string, t as _enum } from "../_libs/zod.mjs";
import { a as Sword, c as Footprints, d as ChevronRight, f as ChevronLeft, l as Feather, m as Backpack, n as VolumeX, o as Send, p as BookOpen, r as Volume2, s as Search, t as X, u as Dices } from "../_libs/lucide-react.mjs";
import { t as create } from "../_libs/zustand.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CQE-1zJ1.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function uid() {
	if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
	return `id-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
}
var endChoice = {
	id: "open-chronicle",
	label: "Read the chronicle",
	hint: "The chapter is told"
};
function beat(narration, choices, extra = {}) {
	return {
		narration,
		choices,
		...extra
	};
}
var BOOK = {
	"lantern-market:ask-baker": beat("The baker dusts her hands and lowers her voice, which is unnecessary; the market is already listening.\n\n'Sand in the bucket at dawn. And the satchel was warm, like a stone that has been in a pocket. Whoever carried it walked out of the well, not into it.' She nods at the coal sacks. 'Those arrived without a driver. Blue at the edges when they burn.'", [
		{
			id: "search-satchel",
			label: "Empty the satchel on the stones"
		},
		{
			id: "well-rope",
			label: "Climb down as far as the rope allows"
		},
		{
			id: "follow-coal",
			label: "Follow the coal-smell toward the hall"
		},
		{
			id: "sacks",
			label: "Open a coal sack"
		}
	], {
		moveTo: "stall",
		questTitle: "The sand in the satchel",
		questDetail: "The baker swears the carrier climbed out of the well."
	}),
	"lantern-market:search-satchel": beat("Holt tips the satchel. Sand, a pie-crumb, and one letter that survived by hiding in the seam. The ink has run uphill across the page.\n\nIt is a route card: Ashpine, under the hall, out at the maples. At the bottom, in a hand that is not the courier's: carry the bell the other way.", [
		{
			id: "well-rope",
			label: "Look down the well"
		},
		{
			id: "follow-coal",
			label: "Take the route card into the hall"
		},
		{
			id: "ask-baker",
			label: "Show the letter to the baker"
		}
	], {
		chronicleTitle: "Ink that runs uphill",
		chronicleBody: "The only surviving letter asks the company to carry a bell the other way.",
		moveTo: "well"
	}),
	"lantern-market:well-rope": beat("Calder takes the rope. Ten paces down, the air turns kind. The water is warm and clear and full of ordinary pebbles, except they are arranged like a sentence.\n\nBramble reads it from the top: not a trap. A request. The river under the mountain wants its post delivered toward the sea, and it borrowed a courier to say so.", [
		{
			id: "follow-coal",
			label: "Follow the request into the hall"
		},
		{
			id: "search-satchel",
			label: "Climb out and search the satchel"
		},
		{
			id: "ask-baker",
			label: "Tell the baker the well is kind"
		}
	], {
		moveTo: "well",
		heartDelta: [{
			id: "calder",
			delta: -1
		}]
	}),
	"lantern-market:sacks": beat("The sack is heavier than coal and quieter. River stones, each one chalked with a tiny post-mark. When Holt lifts one, the campfire leans toward it.\n\nNothing attacks. The stones are lost mail, waiting to be warmed into words.", [{
		id: "follow-coal",
		label: "Carry a stone into the hall"
	}, {
		id: "ask-baker",
		label: "Ask who signed for the sacks"
	}], { moveTo: "sacks" }),
	"lantern-market:follow-coal": beat("The coal-smell is a thread. It leads off the snow and into a stair that the market has been using as a place to lean shovels. Below, brass ticks.\n\nThe Orrery Hall opens around you, and the snow does not follow.", [
		{
			id: "read-letters",
			label: "Read the letters under the stones"
		},
		{
			id: "still-rings",
			label: "Ask Vesper to still the rings"
		},
		{
			id: "star-floor",
			label: "Step onto the star inlay"
		},
		{
			id: "descend",
			label: "Follow the water-sound downward"
		}
	], {
		nextSceneId: "orrery-hall",
		daypart: "Nightfall",
		clock: "19:10",
		weather: "Still",
		sky: "NIGHTFALL · STILL",
		questTitle: "The current in the brass",
		questDetail: "The hall is tracking a river, not a sky.",
		chronicleTitle: "Into the Orrery Hall",
		chronicleBody: "The company leaves the snow and finds the post office turning like a sky."
	}),
	"orrery-hall:read-letters": beat("The letters are ordinary and unbearable in the way ordinary things are. A birthday. A debt forgiven. A recipe for pie that can travel. Every one is weighed with a river stone so it will not blow toward the wrong season.\n\nVesper says the stones are not locks. They are manners.", [
		{
			id: "still-rings",
			label: "Still the rings"
		},
		{
			id: "descend",
			label: "Follow the water-sound"
		},
		{
			id: "star-floor",
			label: "Stand on the wet star"
		}
	], { moveTo: "desk" }),
	"orrery-hall:still-rings": beat("Vesper does not command the armillary. They introduce the company. The rings slow, embarrassed, and a gap opens large enough to see a stair of wet stone going down toward autumn air.\n\nThe courier's bootprint is on the top step, still damp.", [{
		id: "descend",
		label: "Take the wet stair"
	}, {
		id: "read-letters",
		label: "Gather the letters first"
	}], {
		moveTo: "armillary",
		heartDelta: [{
			id: "vesper",
			delta: -1
		}]
	}),
	"orrery-hall:star-floor": beat("The wet inlay is only a finger deep, but it has a current. Light crosses it like a minnow. When Bramble puts in a hand, she feels a road under the water, sloping toward maple smoke.", [{
		id: "descend",
		label: "Follow the road under the water"
	}, {
		id: "still-rings",
		label: "Ask the rings for a door instead"
	}], { moveTo: "stars" }),
	"orrery-hall:descend": beat("The stair lets you out under maples that have no business growing on this side of a snowy pass. The forge is lit. A person sits on a crate, alive, sheepish, holding a bell the size of a fist.\n\n'I tried to deliver it uphill,' the courier says. 'It only wanted down.'", [
		{
			id: "take-bell",
			label: "Accept the bell and the letters"
		},
		{
			id: "ask-courier",
			label: "Ask the courier to tell it plainly"
		},
		{
			id: "bank-fire",
			label: "Bank the forge"
		},
		{
			id: "close-book",
			label: "Walk the courier home"
		}
	], {
		nextSceneId: "maple-forge",
		daypart: "Morning",
		clock: "07:05",
		weather: "Woodsmoke",
		sky: "MORNING · SMOKE",
		day: 2,
		questTitle: "Carry it downhill",
		questDetail: "The courier is safe. The bell still needs a direction.",
		chronicleTitle: "The courier on the crate",
		chronicleBody: "Alive, embarrassed, and holding a bell that refuses to go uphill."
	}),
	"maple-forge:take-bell": beat("The bell is lighter than guilt and heavier than it looks. It does not ring until Calder points it toward the low road. Then one note, polite, like a person clearing their throat at a doorway.\n\nThe courier laughs once, from relief. The stones in the forge dull from blue to ordinary grey.", [
		{
			id: "ask-courier",
			label: "Ask what the note meant"
		},
		{
			id: "bank-fire",
			label: "Bank the forge"
		},
		{
			id: "close-book",
			label: "Walk them home"
		}
	], { moveTo: "camp" }),
	"maple-forge:ask-courier": beat("They talk the way people do when they have been brave in a confusing room. A voice in the well asked for a favor: take the bell downhill, toward a river that has forgotten a name. The sand was a mistake. The courier panicked and stuffed the satchel with the nearest dry thing.\n\n'I am sorry about the pie smell,' they add, which is how you know they are telling the truth.", [{
		id: "take-bell",
		label: "Take the bell"
	}, {
		id: "close-book",
		label: "Promise to walk them home"
	}], { moveTo: "path" }),
	"maple-forge:bank-fire": beat("Calder banks the forge with the side of the shovel, not the blade of anything. The stream stops climbing the rails and settles into being a stream. A maple leaf floats the correct direction.\n\nBramble marks the spot with red chalk. This time the line stays.", [{
		id: "take-bell",
		label: "Take the bell while it is quiet"
	}, {
		id: "close-book",
		label: "Close the chapter"
	}], { moveTo: "forge" }),
	"maple-forge:close-book": beat("You walk the courier back as far as the snow, which receives you without comment. The baker cries in the efficient way of someone who has pies in the oven and a person returned.\n\nThe bell stays wrapped. Somewhere downhill a river practices a name. Ashpine Post is a chapter you can close.", [endChoice], {
		questTitle: "The post is delivered",
		questDetail: "The courier is home. The bell goes downhill another day, and that is enough.",
		chronicleTitle: "Home before the pies cool",
		chronicleBody: "The company brings the courier back. The bell does not ring. The mountain settles.",
		moveTo: "path"
	}),
	"reed-crossing:speak-grey": beat("The man in grey is not lost. He is waiting to be correctly addressed. His coat is a ferryman's coat, and his boots have not been wet in a long time.\n\n'I put the bell under the arch so it would stop calling people by the wrong names,' he says. 'It kept one. I would like it back, but I cannot go into the water. I have forgotten how to be wet.'", [
		{
			id: "listen-arch",
			label: "Listen at the arch for him"
		},
		{
			id: "blank-sign",
			label: "Ask about the blank sign"
		},
		{
			id: "wade",
			label: "Wade into the reeds"
		},
		{
			id: "follow-chain",
			label: "Follow the chain upriver"
		}
	], {
		moveTo: "reeds",
		questTitle: "Follow the bell's trail",
		questDetail: "The ferryman cannot get wet. The name he lost is upstream, or under the arch."
	}),
	"reed-crossing:blank-sign": beat("The stonecutter does not look up. 'It was a name with a V in it. Two syllables. I filled it in because the bell kept ringing it at night and the bowls on the bar walked to the edge.'\n\nHe offers you the chisel, then thinks better, and offers you a rubbing stone instead. 'If you find the letters, I will put them back. I should not have been afraid of a word.'", [
		{
			id: "speak-grey",
			label: "Tell the ferryman"
		},
		{
			id: "listen-arch",
			label: "Listen under the arch"
		},
		{
			id: "follow-chain",
			label: "Follow the chain upriver"
		}
	], { moveTo: "hut" }),
	"reed-crossing:shelter": beat("The inn is warm in the specific way of wet wool and onion soup. The innkeeper sets down the bowl she has been holding.\n\n'The river took a name and left the debt,' she says. 'We are not haunted. We are unfinished. If you are going upriver, take a pie. The toll fort echoes and echoes are hungrier than travelers.'", [
		{
			id: "speak-grey",
			label: "Go back out to the ferryman"
		},
		{
			id: "blank-sign",
			label: "Visit the stonecutter"
		},
		{
			id: "follow-chain",
			label: "Take the pie and follow the chain"
		}
	], { moveTo: "inn" }),
	"reed-crossing:listen-arch": beat("Under the arch the rain sounds like cutlery put away carefully. One note rises from the chain — not loud, not a warning. A person saying here.\n\nVesper's bead ticks in answer. The chain does not end in the village. It runs upriver, toward the old toll.", [
		{
			id: "follow-chain",
			label: "Follow the chain upriver"
		},
		{
			id: "wade",
			label: "Wade and look for the bell"
		},
		{
			id: "speak-grey",
			label: "Report the note to the ferryman"
		}
	], { moveTo: "arch" }),
	"reed-crossing:wade": beat("The reeds take you to the knee and no further. The bell is there, green and patient, too heavy for one person and too beloved to drag. Letters are scratched on the inner lip. Rain has nearly had them.\n\nBramble traces what she can: a V, an O, the ghost of a double S. The rest of the name is not here. The chain tugs, very gently, upriver.", [{
		id: "follow-chain",
		label: "Follow the chain to the rest of the name"
	}, {
		id: "speak-grey",
		label: "Climb out and tell him"
	}], {
		moveTo: "reeds",
		heartDelta: [{
			id: "bramble",
			delta: -1
		}]
	}),
	"reed-crossing:follow-chain": beat("You walk the bank at dusk until dusk gives up. The chain is a rumor under the path, then a fact in the yard of the toll fort. Morning finds you there, and the fort finds you kind.\n\nIn the tower, a name has been hidden in its own grooves.", [
		{
			id: "copy-name",
			label: "Copy the name in trail chalk"
		},
		{
			id: "ask-maren",
			label: "Ask if the ferryman is Maren"
		},
		{
			id: "ring-once",
			label: "Ring the chain once, gently"
		},
		{
			id: "close-book",
			label: "Take the name home to the sign"
		}
	], {
		nextSceneId: "toll-fort",
		daypart: "Morning",
		clock: "09:20",
		weather: "Clear",
		sky: "MORNING · CLEAR",
		day: 2,
		questTitle: "Give the name back",
		questDetail: "The tower remembers Maren Voss. The sign in the village does not, yet.",
		chronicleTitle: "Reeds in Stillwater",
		chronicleBody: "The company follows a chain upriver and finds a name hidden in the tower."
	}),
	"toll-fort:copy-name": beat("Bramble's red chalk will not do. She uses the white. MAREN VOSS sits on a shingle, plain as bread. The letters do not smudge when the wind tries them.\n\nFrom the yard, the ferryman — you did not hear him arrive — says, 'Yes. That one. I left it here because a bell that says your name all night is a hard roommate.'", [
		{
			id: "ask-maren",
			label: "Let him say the rest"
		},
		{
			id: "ring-once",
			label: "Ring the chain once"
		},
		{
			id: "close-book",
			label: "Carry the rubbing home"
		}
	], { moveTo: "tower" }),
	"toll-fort:ask-maren": beat("He is Maren Voss. He retired from the ferry the year the arch cracked, and he has been dry ever since, which he thought was safety and which turned out to be a long hallway.\n\n'Put the name back on the sign,' he says. 'I will stand in the rain on purpose. I am tired of being a rumor with boots.'", [{
		id: "close-book",
		label: "Take him home to the sign"
	}, {
		id: "ring-once",
		label: "Ring the chain as a promise"
	}], { moveTo: "gate" }),
	"toll-fort:ring-once": beat("One note. The chain carries it without drama. Far off, the bowls in the inn probably take one polite step back from the edge and then think better of jumping.\n\nHolt grins. 'That is a bell that has been asked, not ordered.'", [{
		id: "copy-name",
		label: "Copy the name"
	}, {
		id: "close-book",
		label: "Go back while the note is still in the air"
	}], { moveTo: "yard" }),
	"toll-fort:close-book": beat("The stonecutter cries, briefly, and then does the work. MAREN VOSS goes back into the sign. The ferryman stands in the rain until his shoulders darken, and he looks so relieved it is a little funny.\n\nUnder the arch, the bell rings once, on its own, and then keeps a decent silence. Stillwater can close.", [endChoice], {
		questTitle: "The name is on the sign",
		questDetail: "Maren Voss is wet, remembered, and no longer a rumor.",
		chronicleTitle: "The sign remembers",
		chronicleBody: "The company brings the name home. The bell rings once and agrees to rest."
	}),
	"salt-wharf:harbormaster": beat("The harbormaster has salt in her eyebrows and no patience for mysteries that delay tides, which is to say she has some.\n\n'The night chart was whole at noon. At dusk the coast was gone and a deckhand was gone with it. The Lark does not sail blind. You have five days, and I have a cracked bell and a reputation. Fix the kinder of those problems.'", [
		{
			id: "footprints",
			label: "Follow the wet footprints"
		},
		{
			id: "open-crate",
			label: "Open the starred crate"
		},
		{
			id: "cracked-bell",
			label: "Inspect the bell"
		}
	], { moveTo: "warehouse" }),
	"salt-wharf:footprints": beat("Left, right, and then the idea of a foot. The last print is cold. Bramble lies on the boards and looks sideways, which is how scouts embarrass puddles into confessing.\n\nThe water in the print points, very slightly, at a crate starred in chalk.", [
		{
			id: "open-crate",
			label: "Open the starred crate"
		},
		{
			id: "harbormaster",
			label: "Tell the harbormaster"
		},
		{
			id: "cracked-bell",
			label: "Check the bell on the way"
		}
	], { moveTo: "pier" }),
	"salt-wharf:cracked-bell": beat("The crack is old. The clapper is new, wrapped in sailcloth so it will not ring the whole harbor awake. Inside the cloth, a knot Holt knows: deckhand work, tidy, ashamed of itself.\n\nWhoever hid the chart did not want a scene. They wanted a delay.", [{
		id: "open-crate",
		label: "Find the chart before the delay runs out"
	}, {
		id: "footprints",
		label: "Go back to the footprints"
	}], { moveTo: "warehouse" }),
	"salt-wharf:open-crate": beat("The starred crate holds a wool coat, an orange, and a key to the chart tower. No chart. A note in a round hand: Night room. Do not sail the dark without Splint Light.\n\nThe key is warm. The tower is up the stair the clerk pretended not to mention.", [
		{
			id: "search-room",
			label: "Search the chart room"
		},
		{
			id: "read-note",
			label: "Read the note aloud"
		},
		{
			id: "telescope",
			label: "Turn the telescope down"
		},
		{
			id: "to-gate",
			label: "Take the note toward the gate"
		}
	], {
		nextSceneId: "night-chart",
		daypart: "Nightfall",
		clock: "21:40",
		weather: "Clear",
		sky: "NIGHTFALL · CLEAR",
		questTitle: "Mend the coast",
		questDetail: "The chart room has the rest of the kindness, and the missing piece of coast.",
		chronicleTitle: "Footprints that stop",
		chronicleBody: "A warm key, an orange, and a warning not to sail without the lighthouse.",
		moveTo: "crates"
	}),
	"night-chart:search-room": beat("You search like people who have been asked to be careful with paper. The cut coast is not in the desk. Through the telescope, pointed wrongly at a roof, a pale scrap shows under a tile like a tongue.\n\nHolt is already measuring the climb with his eyes and deciding to use the stairs instead.", [
		{
			id: "telescope",
			label: "Send Holt for the scrap"
		},
		{
			id: "read-note",
			label: "Read the note first"
		},
		{
			id: "to-gate",
			label: "Take what you have to the gate"
		}
	], { moveTo: "telescope" }),
	"night-chart:read-note": beat("Vesper reads it without adding thunder. The tender at Splint Light has not come in. The deckhand hid the chart so the Lark would have to wait. It is a clumsy good idea, which is the most common kind.\n\nThe coast still has to be sewn back. A ship that waits should also be able to see.", [{
		id: "telescope",
		label: "Fetch the cut coast"
	}, {
		id: "to-gate",
		label: "Carry the note to the tidegate"
	}], { moveTo: "desk" }),
	"night-chart:telescope": beat("The scrap under the tile is the missing crescent of coast, wrapped in oilcloth and weighted with a nail so the wind would not improve the plan. The cut is clean. It can be mended.\n\nDown on the sea-wall, lanterns are already gathering. The Lark's crew coils rope when they are nervous.", [{
		id: "to-gate",
		label: "Take the coast to the tidegate"
	}, {
		id: "read-note",
		label: "Bring the note as well"
	}], {
		moveTo: "telescope",
		chronicleTitle: "The coast under a tile",
		chronicleBody: "The missing shore was hidden, not destroyed."
	}),
	"night-chart:to-gate": beat("Morning wind takes you down to the tidegate. The deckhand is in the yard with the look of a person who has rehearsed a confession and would like to skip to the apology.\n\nOut on the water, a skiff with a patched sail is trying to be on time.", [
		{
			id: "speak-crew",
			label: "Ask the crew for one more tide"
		},
		{
			id: "mend-chart",
			label: "Mend the chart on the cart"
		},
		{
			id: "light-signal",
			label: "Signal Splint Light"
		},
		{
			id: "close-book",
			label: "Wait for the light to answer"
		}
	], {
		nextSceneId: "tide-gate",
		daypart: "Morning",
		clock: "06:50",
		weather: "Wind",
		sky: "MORNING · WIND",
		day: 2,
		questTitle: "One tide of patience",
		questDetail: "The tender is almost in. Someone has to ask the ship to wait, and mean it.",
		chronicleTitle: "Down to the gate",
		chronicleBody: "The company carries a cut coast and a decent reason to the tidegate."
	}),
	"tide-gate:speak-crew": beat("Calder does not shout. He says the tender's name — you have all learned it by now, it is on the note — and he says one tide. The boatswain looks at the skiff, then at the mended chance of a chart, and spits, thoughtfully, downwind.\n\n'One tide,' she says. 'Tell your deckhand the knots were good. The plan was rotten. Both can be true.'", [
		{
			id: "mend-chart",
			label: "Mend the chart while they wait"
		},
		{
			id: "light-signal",
			label: "Light the signal"
		},
		{
			id: "close-book",
			label: "Let that be the ending"
		}
	], { moveTo: "yard" }),
	"tide-gate:mend-chart": beat("Paste, pressure, and a weight. The coast lies down. Bramble blows on it as if it were soup. The crescent joins so well that only a person looking for a scar would find one.\n\nVesper taps the margin, where charts leave room for honesty, and writes: held one tide for Splint Light.", [{
		id: "light-signal",
		label: "Signal the lighthouse"
	}, {
		id: "close-book",
		label: "Close the book on a whole coast"
	}], {
		moveTo: "cart",
		chronicleTitle: "A coast put back",
		chronicleBody: "The night chart is whole again, with a note in the margin about patience."
	}),
	"tide-gate:light-signal": beat("Calder's lantern fits the signal slot as if the slot had been lonely. Three slow shows, the harbormaster's pattern for hold. A small light answers from the skiff, then a stronger one from the headland as the tender reaches the stair of Splint Light and does their job.\n\nThe cracked bell down in the harbor rings anyway. Someone is happy.", [{
		id: "close-book",
		label: "Watch the light and close the book"
	}, {
		id: "mend-chart",
		label: "Finish the chart if it still needs you"
	}], { moveTo: "tower" }),
	"tide-gate:close-book": beat("The Lark waits one tide, which is a small miracle made of rope and manners. Splint Light burns. The deckhand is yelled at, fed, and put back on the watch bill. The chart goes aboard with its scar and its honest margin.\n\nDusk Harbor keeps its ship, its tender, and its story. You can close the book.", [endChoice], {
		questTitle: "The light is lit",
		questDetail: "The ship waited. The coast is whole. The harbor is loud in a glad way.",
		chronicleTitle: "One tide",
		chronicleBody: "They hold the gate, mend the chart, and watch Splint Light answer."
	})
};
function choicesFor(sceneId) {
	return CAMPAIGNS.flatMap((c) => c.scenes).find((s) => s.id === sceneId)?.choices.slice(0, 4) ?? [];
}
function findSpot(tale, text) {
	const scene = getScene(tale.campaignId, tale.sceneId);
	if (!scene) return void 0;
	const low = text.toLowerCase();
	return scene.hotspots.find((h) => low.includes(h.name.toLowerCase()) || low.includes(h.id.replace("-", " ")));
}
function createTale(campaignId, playerName) {
	const campaign = getCampaign(campaignId);
	if (!campaign) throw new Error("Unknown tale");
	const scene = campaign.scenes[0];
	const party = PARTY.map((p) => ({ ...p }));
	const positions = {};
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
		chronicle: [{
			id: uid(),
			day: 1,
			title: scene.chronicleTitle,
			body: scene.opening,
			sceneName: scene.name,
			campaignName: campaign.name,
			image: scene.image
		}],
		narration: scene.opening,
		choices: scene.choices,
		log: [{
			role: "gm",
			text: scene.opening
		}],
		updatedAt: Date.now(),
		beat: 0
	};
}
function localGm(tale, action) {
	const key = action.choiceId ? `${tale.sceneId}:${action.choiceId}` : "";
	if (key && BOOK[key]) return BOOK[key];
	const scene = getScene(tale.campaignId, tale.sceneId);
	const actor = tale.party.find((p) => p.id === tale.activeId) ?? tale.party[0];
	const spot = findSpot(tale, action.text) ?? scene?.hotspots.find((h) => h.id === tale.positions[actor.id]);
	if (!scene || !spot) return beat(`${actor.name} waits. The table is quiet.`, choicesFor(tale.sceneId));
	if (action.roll) {
		const { success, total, dc, label } = action.roll;
		return beat(success ? `${label}. ${total} against ${dc} — it turns. ${spot.examine} Nobody is hurt beyond a bruise of pride.` : `${label}. ${total} against ${dc} — it slips. ${actor.name} is pulled back by the others before it becomes a wound. ${spot.examine}`, choicesFor(tale.sceneId).slice(0, 3), {
			heartDelta: success ? [{
				id: actor.id,
				delta: -1
			}] : [{
				id: actor.id,
				delta: -2
			}],
			moveTo: spot.id
		});
	}
	if (action.choiceId === "open-chronicle") return beat(tale.narration, [endChoice]);
	return beat(`${actor.name} tries it in earnest. ${action.text.trim()} ${scene.ambient} ${spot.examine}`, choicesFor(tale.sceneId).slice(0, 3), { moveTo: spot.id });
}
function applyTale(tale, playerLine, result) {
	const campaign = getCampaign(tale.campaignId);
	if (!campaign) return tale;
	let scene = getScene(tale.campaignId, tale.sceneId) ?? campaign.scenes[0];
	let sceneId = tale.sceneId;
	let chapter = tale.chapter;
	let positions = { ...tale.positions };
	let day = result.day ?? tale.day;
	const next = result.nextSceneId ? getScene(tale.campaignId, result.nextSceneId) : void 0;
	if (next && next.id !== scene.id) {
		scene = next;
		sceneId = next.id;
		chapter += 1;
		positions = {};
		tale.party.forEach((p, i) => {
			positions[p.id] = next.hotspots[i % next.hotspots.length].id;
		});
	} else if (result.moveTo && scene.hotspots.some((h) => h.id === result.moveTo)) positions[tale.activeId] = result.moveTo;
	const party = tale.party.map((c) => {
		const delta = result.heartDelta?.find((h) => h.id === c.id)?.delta ?? 0;
		const heart = Math.max(1, Math.min(c.heartMax, c.heart + delta));
		return heart === c.heart ? c : {
			...c,
			heart
		};
	});
	const chronicle = [...tale.chronicle];
	if (result.chronicleTitle && result.chronicleBody) chronicle.push({
		id: uid(),
		day,
		title: result.chronicleTitle,
		body: result.chronicleBody,
		sceneName: scene.name,
		campaignName: campaign.name,
		image: scene.image
	});
	const quest = result.questTitle && result.questDetail ? {
		title: result.questTitle,
		detail: result.questDetail
	} : tale.quest;
	const log = tale.log.slice(-10);
	log.push({
		role: "you",
		text: playerLine
	}, {
		role: "gm",
		text: result.narration
	});
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
		updatedAt: Date.now()
	};
}
function encodeTale(tale) {
	const bytes = new TextEncoder().encode(JSON.stringify(tale));
	let bin = "";
	bytes.forEach((b) => {
		bin += String.fromCharCode(b);
	});
	return btoa(bin).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}
function decodeTale(code) {
	try {
		const pad = code.trim().replaceAll("-", "+").replaceAll("_", "/");
		const padded = pad + "=".repeat((4 - pad.length % 4) % 4);
		const bin = atob(padded);
		const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
		const tale = JSON.parse(new TextDecoder().decode(bytes));
		if (!getCampaign(tale.campaignId) || !getScene(tale.campaignId, tale.sceneId)) return null;
		if (!tale.narration || !Array.isArray(tale.party) || tale.party.length < 1) return null;
		return {
			...tale,
			id: uid(),
			updatedAt: Date.now()
		};
	} catch {
		return null;
	}
}
function skillMod(id) {
	if (id === "bramble" || id === "holt") return 4;
	if (id === "calder") return 3;
	return 3;
}
function rollCheck(mod, dc = 13) {
	const roll = 1 + Math.floor(Math.random() * 20);
	const total = roll + mod;
	return {
		roll,
		mod,
		total,
		dc,
		success: total >= dc
	};
}
var KEY = "thornwake.v1";
function persist(slice) {
	try {
		localStorage.setItem(KEY, JSON.stringify(slice));
	} catch {}
}
var useGame = create((set, get) => ({
	screen: "gate",
	playerName: "Traveler",
	tales: [],
	taleId: null,
	worldIndex: -1,
	pickedId: null,
	mode: "move",
	storyOpen: true,
	modal: null,
	sound: false,
	writing: false,
	toldBy: null,
	dice: null,
	hydrated: false,
	setScreen: (screen) => set({
		screen,
		modal: null
	}),
	setWorld: (worldIndex) => set({ worldIndex }),
	pick: (pickedId) => set({ pickedId }),
	setMode: (mode) => set({ mode }),
	setStoryOpen: (storyOpen) => set({ storyOpen }),
	setModal: (modal) => set({ modal }),
	setSound: (sound) => {
		set({ sound });
		persist({
			playerName: get().playerName,
			tales: get().tales,
			sound
		});
	},
	setWriting: (writing) => set({ writing }),
	setToldBy: (toldBy) => set({ toldBy }),
	setDice: (dice) => set({ dice }),
	setName: (playerName) => {
		const name = playerName.slice(0, 24);
		set((s) => ({
			playerName: name,
			tales: s.tales.map((t) => t.id === s.taleId ? {
				...t,
				playerName: name || t.playerName
			} : t)
		}));
		persist({
			playerName: name,
			tales: get().tales,
			sound: get().sound
		});
	},
	hydrate: () => {
		if (get().hydrated) return;
		set({ hydrated: true });
		try {
			const raw = localStorage.getItem(KEY);
			if (!raw) return;
			const data = JSON.parse(raw);
			if (!data || !Array.isArray(data.tales)) return;
			set({
				playerName: typeof data.playerName === "string" && data.playerName ? data.playerName : "Traveler",
				tales: data.tales,
				sound: Boolean(data.sound)
			});
		} catch {}
	},
	addTale: (tale) => {
		const tales = [tale, ...get().tales].slice(0, 12);
		set({
			tales,
			taleId: tale.id,
			screen: "play",
			storyOpen: true,
			mode: "move",
			modal: null,
			toldBy: null
		});
		persist({
			playerName: tale.playerName,
			tales,
			sound: get().sound
		});
	},
	openTale: (id) => set({
		taleId: id,
		screen: "play",
		modal: null,
		storyOpen: true,
		mode: "move"
	}),
	retireTale: (id) => {
		const tales = get().tales.filter((t) => t.id !== id);
		set({
			tales,
			taleId: get().taleId === id ? null : get().taleId
		});
		persist({
			playerName: get().playerName,
			tales,
			sound: get().sound
		});
	},
	commit: (id, line, result, toldBy) => {
		const tales = get().tales.map((t) => t.id === id ? applyTale(t, line, result) : t);
		set({
			tales,
			toldBy,
			writing: false,
			dice: null
		});
		persist({
			playerName: get().playerName,
			tales,
			sound: get().sound
		});
	},
	setActive: (id) => {
		set((s) => ({ tales: s.tales.map((t) => t.id === s.taleId ? {
			...t,
			activeId: id
		} : t) }));
	}
}));
function activeTale(state) {
	return state.tales.find((t) => t.id === state.taleId) ?? null;
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var Input = object({
	campaignId: string().max(40),
	sceneId: string().max(40),
	playerName: string().max(40),
	activeId: string().max(20),
	action: string().min(1).max(500),
	party: array(object({
		id: string().max(20),
		heart: number().int().min(0).max(40)
	})).max(4),
	recent: array(object({
		role: _enum(["you", "gm"]),
		text: string().max(500)
	})).max(6),
	roll: object({
		label: string().max(120),
		total: number().int(),
		dc: number().int(),
		success: boolean()
	}).optional()
});
var consultStoryteller = createServerFn({ method: "POST" }).validator((input) => Input.parse(input)).handler(createSsrRpc("a3742cd4620cb4535adf58f82f1703136bc6cb142f4c94ad485f0a4121e9637e"));
function Mark({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 48 48",
		className,
		"aria-hidden": true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "24",
				cy: "24",
				r: "21",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "1.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				fill: "currentColor",
				d: "M24 7c1.2 5.2.6 8.4-1.2 12.2-3.2 1.2-6.6 4.2-7.2 8.2 4.6-1.6 8.2-1.2 12.6.6-1.4-4.8-1.2-7.2-6.2-9.4C24.6 14 25.2 11 24 7z"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "24",
				cy: "24",
				r: "1.6",
				fill: "currentColor"
			})
		]
	});
}
function Ornate({ children, variant = "dark", className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: clsx("ornate", variant === "dark" ? "ornate-dark" : "ornate-light", className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "ornate-mark tl" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "ornate-mark tr" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "ornate-mark bl" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "ornate-mark br" }),
			children
		]
	});
}
function Portrait({ person, className }) {
	if (person.portrait) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: person.portrait,
		alt: "",
		className: clsx("size-full object-cover", className)
	});
	const vesper = person.cameo !== "holt";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 80 80",
		className: clsx("size-full", className),
		"aria-hidden": true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("radialGradient", {
				id: `${person.id}-bg`,
				cx: "35%",
				cy: "30%",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
					offset: "0%",
					stopColor: vesper ? "#3d4e73" : "#4a3428"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
					offset: "100%",
					stopColor: "#120e0b"
				})]
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				width: "80",
				height: "80",
				fill: `url(#${person.id}-bg)`
			}),
			vesper ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				fill: "#ead9b4",
				d: "M48 18c6 2 10 10 9 18-4 1-6 4-6 8 4 3 6 8 4 14-8 3-16 2-22-2 2-6 1-10-2-14 3-6 2-12 1-16 5-6 11-10 16-8z"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				fill: "#ead9b4",
				d: "M26 20c8-6 18-4 22 4 2 6-1 10-1 14 5 2 8 8 7 14-9 4-18 3-26-1 1-5 0-9-3-13 2-4 4-10 1-18z"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: vesper ? "M30 16c8-8 24-4 28 6-8 0-12 2-16 8-4-6-8-10-12-14z" : "M24 16c6-4 16-6 22-2-6 2-8 6-8 10-6-2-10-4-14-8z",
				fill: vesper ? "#d5d8e4" : "#1a120e"
			})
		]
	});
}
function TextButton({ children, onClick, disabled, tone = "ghost" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		disabled,
		onClick,
		className: clsx("min-h-11 w-full px-3 text-center font-sans text-sm tracking-wide transition disabled:opacity-40", tone === "ghost" && "border border-gold/40 bg-ink/40 text-gold-bright hover:border-gold hover:bg-gold/10", tone === "solid" && "border border-gold/70 bg-gold/10 text-gold-bright hover:bg-gold/20", tone === "ember" && "border border-ember/80 bg-ember text-parchment hover:bg-ember/90"),
		children
	});
}
function Gate() {
	const setScreen = useGame((s) => s.setScreen);
	const setModal = useGame((s) => s.setModal);
	const sound = useGame((s) => s.sound);
	const setSound = useGame((s) => s.setSound);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "relative min-h-dvh overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: "/art/hero.jpg",
				alt: "A bronze dragon passing a castle turret at dusk",
				className: "absolute inset-0 size-full object-cover"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-r from-ink/10 via-ink/20 to-ink/80" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-label": sound ? "Silence the table" : "Give the table a little sound",
				onClick: () => setSound(!sound),
				className: "absolute top-4 left-4 z-10 flex size-11 items-center justify-center rounded-full border border-gold/50 bg-ink/50 text-gold",
				children: sound ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "size-4" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "absolute bottom-4 left-4 z-10 hidden font-serif text-sm text-mist/80 sm:block",
				children: "The western turret · at dusk"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative z-10 flex min-h-dvh items-end justify-center p-4 sm:items-center sm:justify-end sm:p-10 lg:pr-20",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ornate, {
					className: "w-full max-w-md",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-center px-6 py-8 text-center sm:px-8",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mark, { className: "mb-3 size-10 text-gold" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-sans text-xs tracking-widest text-mist",
								children: "A BOOK OF ADVENTURES"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "gold-title mt-3 font-display text-4xl tracking-widest sm:text-5xl",
								children: "THORNWAKE"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 font-serif text-sm text-gold-bright/90",
								children: "Stillwater Bell"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "my-4 h-px w-16 bg-gold/40" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-serif text-lg text-parchment",
								children: "Your table awaits."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 max-w-sm font-serif text-sm leading-relaxed text-mist",
								children: "A tabletop roleplaying game with an AI storyteller. One company, three tales, mild peril. Sit down and choose, or preview the river story."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-6 flex w-full flex-col gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextButton, {
									tone: "solid",
									onClick: () => setScreen("select"),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center justify-center gap-2",
										children: ["Sit at the table ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4" })]
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextButton, {
									onClick: () => {
										const { playerName, addTale } = useGame.getState();
										addTale(createTale("stillwater", playerName));
									},
									children: "Preview a tale"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 font-sans text-xs leading-relaxed text-mist",
								children: "Preview opens Stillwater. Anyone can sit; tales stay on this device."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 font-sans text-xs tracking-widest text-gold-dim",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "min-h-11",
									onClick: () => setModal("notes"),
									children: "TABLE NOTES"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "min-h-11",
									onClick: () => setModal("about"),
									children: "ABOUT"
								})]
							})
						]
					})
				})
			})
		]
	});
}
var OFFSETS = [
	{
		dx: -3.2,
		dy: -1.5
	},
	{
		dx: 3.4,
		dy: .8
	},
	{
		dx: -1.6,
		dy: 3.6
	},
	{
		dx: 3.8,
		dy: 3.2
	}
];
function Play() {
	const tale = useGame(activeTale);
	const setScreen = useGame((s) => s.setScreen);
	const mode = useGame((s) => s.mode);
	const setMode = useGame((s) => s.setMode);
	const storyOpen = useGame((s) => s.storyOpen);
	const setStoryOpen = useGame((s) => s.setStoryOpen);
	const writing = useGame((s) => s.writing);
	const sound = useGame((s) => s.sound);
	const setSound = useGame((s) => s.setSound);
	const setModal = useGame((s) => s.setModal);
	const dice = useGame((s) => s.dice);
	const toldBy = useGame((s) => s.toldBy);
	const setActive = useGame((s) => s.setActive);
	const [draft, setDraft] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (!tale) setScreen("select");
	}, [tale, setScreen]);
	if (!tale) return null;
	const scene = getScene(tale.campaignId, tale.sceneId);
	if (!scene) return null;
	const actor = tale.party.find((p) => p.id === tale.activeId) ?? tale.party[0];
	async function perform(line, choiceId, rolled) {
		const state = useGame.getState();
		const current = activeTale(state);
		if (!current || state.writing) return;
		if (choiceId === "open-chronicle") {
			state.setModal("chronicle");
			return;
		}
		state.setWriting(true);
		if (!rolled) state.setDice(null);
		const local = localGm(current, {
			choiceId,
			text: line,
			roll: rolled ? {
				total: rolled.roll + rolled.mod,
				dc: rolled.dc,
				success: rolled.success,
				label: rolled.label
			} : void 0
		});
		try {
			const res = await consultStoryteller({ data: {
				campaignId: current.campaignId,
				sceneId: current.sceneId,
				playerName: current.playerName,
				activeId: current.activeId,
				action: line,
				party: current.party.map((p) => ({
					id: p.id,
					heart: p.heart
				})),
				recent: current.log.slice(-6).map((l) => ({
					role: l.role,
					text: l.text.slice(0, 480)
				})),
				roll: rolled ? {
					label: rolled.label,
					total: rolled.roll + rolled.mod,
					dc: rolled.dc,
					success: rolled.success
				} : void 0
			} });
			if (res.ok) state.commit(current.id, line, res.result, "live");
			else state.commit(current.id, line, local, "book");
		} catch {
			state.commit(current.id, line, local, "book");
		}
	}
	function onPlace(spot) {
		if (mode === "look") {
			perform(`${actor.name} looks closely at ${spot.name}.`);
			return;
		}
		if (mode === "strike") {
			if (!spot.threat) {
				perform(`${actor.name} searches ${spot.name} for a fight and finds only weather.`);
				return;
			}
			const check = rollCheck(skillMod(actor.id), 13);
			const shown = {
				who: actor.name,
				label: `${actor.name} presses at ${spot.name}`,
				roll: check.roll,
				mod: check.mod,
				dc: check.dc,
				success: check.success
			};
			useGame.getState().setDice(shown);
			window.setTimeout(() => void perform(shown.label, void 0, shown), 900);
			return;
		}
		perform(`${actor.name} goes to ${spot.name}.`);
	}
	function onDice() {
		const check = rollCheck(skillMod(actor.id), 12);
		const shown = {
			who: actor.name,
			label: `${actor.name} asks the dice`,
			roll: check.roll,
			mod: check.mod,
			dc: check.dc,
			success: check.success
		};
		useGame.getState().setDice(shown);
		window.setTimeout(() => void perform(`${shown.label} and gets ${check.total} against ${check.dc}.`, void 0, shown), 900);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "wood relative flex min-h-dvh flex-col overflow-x-hidden lg:block lg:h-dvh lg:overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "z-30 flex items-start justify-between gap-2 px-3 py-3 lg:absolute lg:inset-x-0 lg:top-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mark, { className: "size-9 shrink-0 text-gold" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-xs tracking-widest text-gold sm:text-sm",
						children: "THORNWAKE"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-serif text-sm text-parchment sm:text-base",
						children: scene.name
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
							label: "Chronicle",
							onClick: () => setModal("chronicle"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "size-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
							label: sound ? "Silence" : "Sound",
							onClick: () => setSound(!sound),
							children: sound ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "size-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setStoryOpen(!storyOpen),
							className: "hidden h-11 items-center border border-gold/50 px-3 font-serif text-sm text-parchment sm:flex",
							children: "The Storyteller"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
							label: "Leave the table",
							onClick: () => setScreen("select"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none absolute top-16 left-1/2 z-30 hidden -translate-x-1/2 md:block",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "pointer-events-auto border border-gold/30 bg-ink/75 px-4 py-2 text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-serif text-sm text-parchment",
						children: [
							"Day ",
							tale.day,
							" · ",
							tale.daypart
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-sans text-xs text-mist",
						children: [
							tale.clock,
							" · ",
							scene.hotspots.length,
							" places in view · Journey"
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "absolute top-16 right-3 z-20 hidden font-sans text-xs tracking-widest text-mist lg:block",
				children: tale.sky
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "board-perspective z-10 flex justify-center px-2 py-2 lg:absolute lg:inset-0 lg:items-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "board-plane",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "board-frame",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "board-stage",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: scene.image,
									alt: scene.name,
									className: "absolute inset-0 size-full object-cover"
								}),
								scene.hotspots.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-label": h.name,
									disabled: writing,
									onClick: () => onPlace(h),
									className: `place-pip ${mode === "move" || mode === "look" ? "on" : ""}`,
									style: {
										left: `${h.x}%`,
										top: `${h.y}%`
									},
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "pointer-events-none absolute top-5 left-1/2 hidden -translate-x-1/2 bg-ink/80 px-1 font-sans text-xs whitespace-nowrap text-parchment group-hover:block lg:block",
										children: mode === "move" || mode === "look" ? h.name : ""
									})
								}, h.id)),
								tale.party.map((person, index) => {
									const spot = scene.hotspots.find((h) => h.id === tale.positions[person.id]) ?? scene.hotspots[0];
									const off = OFFSETS[index % OFFSETS.length];
									const on = person.id === actor.id;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										className: "token",
										style: {
											left: `${spot.x + off.dx}%`,
											top: `${spot.y + off.dy}%`
										},
										onClick: () => setActive(person.id),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `mx-auto block size-8 overflow-hidden rounded-full border-2 ${on ? "border-gold-bright" : "border-gold/50"}`,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portrait, { person })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "mt-0.5 block bg-ink/80 px-1 font-sans text-xs text-parchment",
											children: person.name
										})]
									}, person.id);
								})
							]
						})
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
				className: "party-rail z-20 flex gap-2 overflow-x-auto px-3 pb-2 lg:absolute lg:top-24 lg:left-3 lg:w-60 lg:flex-col lg:overflow-y-auto",
				children: tale.party.map((person) => {
					const on = person.id === actor.id;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setActive(person.id),
						className: `flex w-52 shrink-0 gap-2 border p-2 text-left lg:w-full ${on ? "border-gold bg-ink/70" : "border-gold/20 bg-ink/50"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "size-12 shrink-0 overflow-hidden border border-gold/40",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portrait, { person })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "min-w-0 flex-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-baseline justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-serif text-sm text-parchment",
										children: person.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-sans text-xs text-mist",
										children: person.role
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "bar-track mt-2 block",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "bar-fill block",
										style: { width: `${person.heart / person.heartMax * 100}%` }
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "mt-1 block font-sans text-xs text-mist",
									children: [
										person.heart,
										"/",
										person.heartMax,
										" · Guard ",
										person.guard
									]
								})
							]
						})]
					}, person.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "z-20 mx-3 mb-2 max-w-sm border border-gold/25 bg-ink/75 p-3 lg:absolute lg:bottom-28 lg:left-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-serif text-sm text-parchment",
						children: tale.quest.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 font-serif text-sm leading-relaxed text-mist",
						children: tale.quest.detail
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "mt-2 font-sans text-xs tracking-widest text-gold",
						onClick: () => setModal("chronicle"),
						children: "View journey"
					})
				]
			}),
			storyOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "z-30 mx-3 mb-2 lg:absolute lg:top-20 lg:right-4 lg:bottom-28 lg:mx-0 lg:w-96",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoryPanel, {
					narration: tale.narration,
					choices: tale.choices,
					writing,
					toldBy,
					draft,
					setDraft,
					onChoice: (id, label) => void perform(label, id),
					onSend: () => {
						const line = draft.trim();
						if (!line) return;
						setDraft("");
						perform(`${actor.name}: ${line}`);
					},
					onClose: () => setStoryOpen(false)
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "z-30 mx-3 mb-2 lg:absolute lg:right-4 lg:bottom-28",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextButton, {
					onClick: () => setStoryOpen(true),
					children: "Open the storyteller"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "z-20 px-3 text-center font-sans text-xs text-mist lg:absolute lg:bottom-24 lg:left-1/2 lg:-translate-x-1/2",
				children: mode === "move" ? `Move ${actor.name} · choose a place` : mode === "look" ? `Look with ${actor.name} · choose a place` : `Strike with ${actor.name} · choose a tense place`
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "sticky bottom-0 z-30 mt-auto flex justify-center px-2 py-3 lg:absolute lg:inset-x-0 lg:bottom-3 lg:mt-0",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex max-w-full gap-1 overflow-x-auto border border-gold/40 bg-ink/85 p-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Act, {
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footprints, { className: "size-4" }),
							label: "Move",
							on: mode === "move",
							onClick: () => setMode("move")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Act, {
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sword, { className: "size-4" }),
							label: "Strike",
							on: mode === "strike",
							onClick: () => setMode("strike")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Act, {
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-4" }),
							label: "Look",
							on: mode === "look",
							onClick: () => setMode("look")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Act, {
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Backpack, { className: "size-4" }),
							label: "Pack",
							on: false,
							onClick: () => setModal("pack")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Act, {
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dices, { className: "size-4" }),
							label: "Dice",
							on: false,
							onClick: onDice
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setModal("chronicle"),
							className: "flex h-16 w-28 shrink-0 flex-col items-center justify-center bg-ember px-2 text-center font-sans text-xs tracking-widest text-parchment",
							children: ["FOLLOW", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "THE STORY" })]
						})
					]
				})
			}),
			dice ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "fixed bottom-28 left-1/2 z-40 w-64 -translate-x-1/2 border border-gold bg-ink/95 px-4 py-3 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-4xl text-gold-bright",
						children: dice.roll
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-serif text-sm text-parchment",
						children: dice.label
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-sans text-xs text-mist",
						children: [
							"+",
							dice.mod,
							" = ",
							dice.roll + dice.mod,
							" vs ",
							dice.dc,
							" · ",
							dice.success ? "it turns" : "it slips"
						]
					})
				]
			}) : null
		]
	});
}
function IconButton({ children, label, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"aria-label": label,
		onClick,
		className: "flex size-11 items-center justify-center border border-gold/30 bg-ink/60 text-gold",
		children
	});
}
function Act({ icon, label, on, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		"aria-pressed": on,
		onClick,
		className: `flex h-16 w-16 shrink-0 flex-col items-center justify-center gap-1 font-sans text-xs ${on ? "bg-gold/15 text-gold-bright" : "text-mist"}`,
		children: [icon, label]
	});
}
function StoryPanel({ narration, choices, writing, toldBy, draft, setDraft, onChoice, onSend, onClose }) {
	const [count, setCount] = (0, import_react.useState)(narration.length);
	const [skip, setSkip] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		setSkip(false);
		setCount(0);
	}, [narration]);
	(0, import_react.useEffect)(() => {
		if (writing) return;
		const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		if (skip || reduce) {
			setCount(narration.length);
			return;
		}
		const id = window.setInterval(() => {
			setCount((v) => {
				if (v >= narration.length) {
					window.clearInterval(id);
					return v;
				}
				return Math.min(narration.length, v + 5);
			});
		}, 16);
		return () => window.clearInterval(id);
	}, [
		narration,
		skip,
		writing
	]);
	const done = !writing && count >= narration.length;
	const body = narration.slice(0, count);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Ornate, {
		variant: "light",
		className: "story-panel flex flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between px-4 pt-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-sans text-xs tracking-widest text-gold-dim",
					children: "THE STORYTELLER"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "min-h-11 px-2 text-soot lg:hidden",
					onClick: onClose,
					"aria-label": "Hide storyteller",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "scroll-thin flex-1 overflow-y-auto px-4 py-3",
				children: [writing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "flex items-center gap-2 font-serif text-soot",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Feather, { className: "size-4" }), " Writing the tale…"]
				}) : body.split("\n\n").map((para, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-3 font-serif text-sm leading-relaxed text-soot",
					children: para
				}, i)), toldBy === "book" && done ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-sans text-xs text-gold-dim",
					children: "Told from the table book."
				}) : null]
			}),
			!writing && !done ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "px-4 pb-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "ml-auto block min-h-11 border border-gold-dim/40 px-3 font-sans text-xs text-soot",
					onClick: () => setSkip(true),
					children: "Skip narration"
				})
			}) : null,
			done ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-col gap-2 px-4 pb-2",
				children: choices.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => onChoice(c.id, c.label),
					className: "min-h-11 border border-gold-dim/50 bg-parchment-deep/40 px-3 py-2 text-left font-serif text-sm text-soot hover:bg-parchment-deep",
					children: [c.label, c.hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-0.5 block font-sans text-xs text-gold-dim",
						children: c.hint
					}) : null]
				}, c.id))
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "flex gap-2 border-t border-gold-dim/30 p-3",
				onSubmit: (e) => {
					e.preventDefault();
					if (!writing) onSend();
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: draft,
					onChange: (e) => setDraft(e.target.value),
					placeholder: `What does the company do?`,
					maxLength: 400,
					className: "h-11 min-w-0 flex-1 border border-gold-dim/40 bg-parchment/40 px-2 font-serif text-sm text-soot outline-none"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "submit",
					disabled: writing || !draft.trim(),
					className: "flex size-11 items-center justify-center bg-ember text-parchment disabled:opacity-40",
					"aria-label": "Send",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "size-4" })
				})]
			})
		]
	});
}
function Select() {
	const worldIndex = useGame((s) => s.worldIndex);
	const setWorld = useGame((s) => s.setWorld);
	const pickedId = useGame((s) => s.pickedId);
	const pick = useGame((s) => s.pick);
	const playerName = useGame((s) => s.playerName);
	const setScreen = useGame((s) => s.setScreen);
	const setModal = useGame((s) => s.setModal);
	const addTale = useGame((s) => s.addTale);
	const focused = worldIndex >= 0 ? CAMPAIGNS[worldIndex] : null;
	const bg = focused ? focused.scenes[0].image : "/art/table.jpg";
	const picked = CAMPAIGNS.find((c) => c.id === pickedId) ?? null;
	function cycle(dir) {
		const next = worldIndex + dir;
		if (next < -1) setWorld(CAMPAIGNS.length - 1);
		else if (next >= CAMPAIGNS.length) setWorld(-1);
		else setWorld(next);
		const id = next >= 0 && next < CAMPAIGNS.length ? CAMPAIGNS[next].id : null;
		if (id) pick(id);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "relative min-h-dvh overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: bg,
				alt: focused ? focused.scenes[0].name : "A storyteller's table with a map, dice, and miniatures",
				className: "absolute inset-0 size-full object-cover"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-l from-ink via-ink/55 to-ink/10" }),
			focused ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => setWorld(-1),
				className: "absolute top-4 left-1/2 z-10 -translate-x-1/2 border border-gold/50 bg-parchment px-4 py-2 font-sans text-xs tracking-widest text-soot",
				children: "ALL WORLDS"
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-label": "Previous world",
				onClick: () => cycle(-1),
				className: "absolute top-1/2 left-3 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-gold/60 bg-ink/60 text-gold sm:left-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-label": "Next world",
				onClick: () => cycle(1),
				className: "absolute top-1/2 right-3 z-10 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full border border-gold/60 bg-ink/60 text-gold sm:flex",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => setModal("settings"),
				className: "absolute bottom-4 left-4 z-10 flex min-h-11 items-center gap-2 rounded-full border border-gold/40 bg-ink/70 pr-3 pl-1 text-sm text-parchment",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "flex size-9 items-center justify-center rounded-full bg-gold/20 font-display text-gold",
					children: playerName.slice(0, 1).toUpperCase()
				}), playerName]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative z-10 flex min-h-dvh items-end justify-center p-4 sm:items-center sm:justify-end sm:p-8 lg:pr-16",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ornate, {
					className: "mb-16 w-full max-w-md sm:mb-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "px-5 py-6 sm:px-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-center font-serif text-2xl text-parchment",
								children: "Select your adventure"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-center font-serif text-sm leading-relaxed text-mist",
								children: picked ? picked.blurb : "Three tales lie on the table. Choose one to look closer."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-5 grid grid-cols-3 gap-2",
								children: CAMPAIGNS.map((c, i) => {
									const on = pickedId === c.id;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => {
											pick(c.id);
											setWorld(i);
										},
										className: `flex min-h-28 flex-col items-center gap-2 border px-1 py-3 text-center ${on ? "border-gold bg-gold/10" : "border-gold/25 bg-ink/30"}`,
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "size-12 overflow-hidden rounded-full border border-gold/50",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
													src: c.scenes[0].image,
													alt: "",
													className: "size-full object-cover"
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-serif text-xs leading-tight text-parchment",
												children: c.name
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-sans text-xs leading-tight text-mist",
												children: [
													c.chapters,
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
													c.levels
												]
											})
										]
									}, c.id);
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextButton, {
									tone: "solid",
									disabled: !picked,
									onClick: () => {
										if (!picked) return;
										addTale(createTale(picked.id, playerName));
									},
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center justify-center gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mark, { className: "size-4" }),
											picked ? `Begin ${picked.name}` : "Choose a tale",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mark, { className: "size-4" })
										]
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 grid grid-cols-2 gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextButton, {
									onClick: () => setModal("saves"),
									children: "All saves"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextButton, {
									onClick: () => setModal("join"),
									children: "Join a friend"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 flex flex-wrap justify-center gap-x-3 gap-y-1 text-center font-sans text-xs tracking-widest text-gold-dim",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "min-h-11",
										onClick: () => cycle(1),
										children: "EXPLORE THE TABLETOP"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "min-h-11",
										onClick: () => setModal("about"),
										children: "ABOUT THIS WORLD"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "min-h-11",
										onClick: () => setModal("settings"),
										children: "SETTINGS"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "min-h-11",
										onClick: () => setModal("notes"),
										children: "TABLE NOTES"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "min-h-11",
										onClick: () => setScreen("gate"),
										children: "LEAVE THE TABLE"
									})
								]
							})
						]
					})
				})
			})
		]
	});
}
function Thornwake() {
	const screen = useGame((s) => s.screen);
	const hydrate = useGame((s) => s.hydrate);
	const sound = useGame((s) => s.sound);
	(0, import_react.useEffect)(() => {
		hydrate();
	}, [hydrate]);
	(0, import_react.useEffect)(() => {
		if (!sound) return;
		const ac = new AudioContext();
		const gain = ac.createGain();
		gain.gain.value = .012;
		const low = ac.createOscillator();
		low.type = "sine";
		low.frequency.value = 92;
		const high = ac.createOscillator();
		high.type = "triangle";
		high.frequency.value = 146;
		const highGain = ac.createGain();
		highGain.gain.value = .4;
		low.connect(gain);
		high.connect(highGain).connect(gain);
		gain.connect(ac.destination);
		low.start();
		high.start();
		return () => {
			low.stop();
			high.stop();
			ac.close();
		};
	}, [sound]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		screen === "gate" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gate, {}) : null,
		screen === "select" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {}) : null,
		screen === "play" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, {}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Modals, {})
	] });
}
function Modals() {
	const modal = useGame((s) => s.modal);
	const setModal = useGame((s) => s.setModal);
	const tale = useGame(activeTale);
	(0, import_react.useEffect)(() => {
		if (!modal) return;
		const onKey = (e) => {
			if (e.key === "Escape") setModal(null);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [modal, setModal]);
	if (!modal) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-end justify-center bg-ink/75 p-3 sm:items-center",
		role: "presentation",
		onClick: () => setModal(null),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			role: "dialog",
			"aria-modal": "true",
			className: "modal-card w-full max-w-lg overflow-y-auto",
			onClick: (e) => e.stopPropagation(),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Ornate, {
				variant: modal === "chronicle" ? "light" : "dark",
				className: "p-5 sm:p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3 flex items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: `font-serif text-2xl ${modal === "chronicle" ? "text-soot" : "text-parchment"}`,
							children: titleFor(modal)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-label": "Close",
							className: "flex size-11 items-center justify-center",
							onClick: () => setModal(null),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
						})]
					}),
					modal === "about" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(About, {}) : null,
					modal === "notes" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Notes, {}) : null,
					modal === "settings" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, {}) : null,
					modal === "saves" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Saves, {}) : null,
					modal === "join" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Join, {}) : null,
					modal === "pack" && tale ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pack, {}) : null,
					modal === "chronicle" && tale ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chronicle, {}) : null
				]
			})
		})
	});
}
function titleFor(modal) {
	switch (modal) {
		case "about": return "About this world";
		case "notes": return "Table notes";
		case "settings": return "Settings";
		case "saves": return "All saves";
		case "join": return "Join a friend";
		case "pack": return "The pack";
		case "chronicle": return "Your chronicle";
		default: return "";
	}
}
function About() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3 font-serif text-sm leading-relaxed text-mist",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Thornwake is a table for family quests. You play one company of four — Calder, Bramble, Vesper, and Holt — through three original tales." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "An AI storyteller sits at the head when the table can reach one. If it cannot, the written book takes over, and the chapter still moves. Mild peril, no gore, and nobody at this table dies." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "The tales are Ashpine Post, Stillwater Bell, and Dusk Harbor. None of them are someone else’s dungeon." })
		]
	});
}
function Notes() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
		className: "space-y-3 font-serif text-sm leading-relaxed text-mist",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Choose who acts by tapping a portrait. The ring on the board is the one who moves." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Move, look, or strike by picking a marked place. Or write what the company does." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Dice are honest. A high roll opens a door. A low one costs a little heart, never a life." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Follow the story to read the chronicle. Tales stay in this browser until you retire them." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Join a friend by pasting their tale-code. It is long on purpose: it is the whole chapter." })
		]
	});
}
function Settings() {
	const playerName = useGame((s) => s.playerName);
	const setName = useGame((s) => s.setName);
	const sound = useGame((s) => s.sound);
	const setSound = useGame((s) => s.setSound);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
			className: "block font-sans text-xs tracking-widest text-mist",
			children: ["NAME AT THE TABLE", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				value: playerName,
				onChange: (e) => setName(e.target.value),
				maxLength: 24,
				className: "mt-2 h-11 w-full border border-gold/40 bg-ink/40 px-3 font-serif text-base text-parchment outline-none"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextButton, {
			tone: sound ? "solid" : "ghost",
			onClick: () => setSound(!sound),
			children: sound ? "Sound is on" : "Sound is off"
		})]
	});
}
function Saves() {
	const tales = useGame((s) => s.tales);
	const openTale = useGame((s) => s.openTale);
	const retireTale = useGame((s) => s.retireTale);
	const setModal = useGame((s) => s.setModal);
	const [armed, setArmed] = (0, import_react.useState)(null);
	if (tales.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "font-serif text-sm text-mist",
		children: "No tales yet. Choose one and begin."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "space-y-3",
		children: tales.map((t) => {
			const campaign = getCampaign(t.campaignId);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "border border-gold/30 p-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-serif text-parchment",
						children: campaign?.name ?? "A tale"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-sans text-xs text-mist",
						children: [
							t.playerName,
							" · Day ",
							t.day,
							" · ",
							new Date(t.updatedAt).toLocaleString()
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 grid grid-cols-2 gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextButton, {
							tone: "solid",
							onClick: () => {
								openTale(t.id);
							},
							children: "Continue"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextButton, {
							onClick: () => {
								if (armed === t.id) {
									retireTale(t.id);
									setArmed(null);
								} else setArmed(t.id);
							},
							children: armed === t.id ? "Retire it" : "Retire"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "mt-2 min-h-11 font-sans text-xs tracking-widest text-gold",
						onClick: () => {
							sessionStorage.setItem("thornwake-share", encodeTale(t));
							setModal("join");
						},
						children: "Share tale-code"
					})
				]
			}, t.id);
		})
	});
}
function Join() {
	const addTale = useGame((s) => s.addTale);
	const [code, setCode] = (0, import_react.useState)(() => sessionStorage.getItem("thornwake-share") ?? "");
	const [error, setError] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-serif text-sm leading-relaxed text-mist",
				children: "Paste a tale-code from another table, or copy one from your saves to pass along. Nothing is uploaded."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
				value: code,
				onChange: (e) => setCode(e.target.value),
				rows: 5,
				className: "w-full border border-gold/40 bg-ink/40 p-3 font-sans text-xs text-parchment outline-none",
				placeholder: "Tale-code"
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-serif text-sm text-gold-bright",
				children: error
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextButton, {
					tone: "solid",
					onClick: () => {
						const tale = decodeTale(code);
						if (!tale) {
							setError("That code does not open. Check that the whole line was copied.");
							return;
						}
						sessionStorage.removeItem("thornwake-share");
						addTale(tale);
					},
					children: "Sit down"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextButton, {
					onClick: () => {
						if (!code) return;
						navigator.clipboard?.writeText(code);
					},
					children: "Copy"
				})]
			})
		]
	});
}
function Pack() {
	const tale = useGame(activeTale);
	const setModal = useGame((s) => s.setModal);
	if (!tale) return null;
	const actor = tale.party.find((p) => p.id === tale.activeId) ?? tale.party[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "space-y-2",
		children: tale.inventory.map((item) => {
			const owner = tale.party.find((p) => p.id === item.ownerId);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex items-start justify-between gap-3 border border-gold/25 p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-serif text-parchment",
						children: item.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-serif text-sm text-mist",
						children: item.detail
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-sans text-xs text-gold-dim",
						children: owner?.name
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "min-h-11 shrink-0 px-2 font-sans text-xs tracking-widest text-gold",
					onClick: () => {
						setModal(null);
						runLine(`${actor.name} uses the ${item.name.toLowerCase()}. ${item.detail}`);
					},
					children: "Use"
				})]
			}, item.id);
		})
	});
}
function Chronicle() {
	const tale = useGame(activeTale);
	const [tab, setTab] = (0, import_react.useState)("read");
	if (!tale) return null;
	const campaign = getCampaign(tale.campaignId);
	const latest = tale.chronicle[tale.chronicle.length - 1];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-4 grid grid-cols-3 gap-2",
			children: [
				["read", "Read"],
				["scenes", "Scenes"],
				["finds", "Discoveries"]
			].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => setTab(id),
				className: `min-h-11 border text-sm ${tab === id ? "border-gold-dim bg-parchment-deep text-soot" : "border-gold-dim/30 text-soot"}`,
				children: label
			}, id))
		}),
		tab === "read" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "font-sans text-xs tracking-widest text-gold-dim",
			children: [
				"Day ",
				tale.day,
				" of your adventure · ",
				campaign?.name
			]
		}), latest ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mt-3 font-serif text-2xl text-soot",
				children: latest.title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: latest.image,
				alt: "",
				className: "mt-3 aspect-video w-full object-cover"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 space-y-4",
				children: [...tale.chronicle].reverse().map((entry) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-sans text-xs text-gold-dim",
						children: [
							entry.sceneName,
							" · Day ",
							entry.day
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
						className: "font-serif text-lg text-soot",
						children: entry.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-serif text-sm leading-relaxed whitespace-pre-wrap text-soot",
						children: entry.body
					})
				] }, entry.id))
			})
		] }) : null] }) : null,
		tab === "scenes" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "space-y-2",
			children: (campaign?.scenes ?? []).map((scene) => {
				const seen = tale.chronicle.some((c) => c.sceneName === scene.name) || tale.sceneId === scene.id;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center gap-3 border border-gold-dim/30 p-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: scene.image,
						alt: "",
						className: "size-14 object-cover"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-serif text-soot",
						children: scene.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-sans text-xs text-gold-dim",
						children: seen ? "Visited" : "Not yet"
					})] })]
				}, scene.id);
			})
		}) : null,
		tab === "finds" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3 font-serif text-sm text-soot",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-sans text-xs tracking-widest text-gold-dim",
					children: "NOW"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
				tale.quest.title,
				". ",
				tale.quest.detail
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-2",
				children: tale.inventory.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
					item.name,
					" — ",
					item.detail
				] }, item.id))
			})]
		}) : null
	] });
}
async function runLine(line) {
	const state = useGame.getState();
	const current = activeTale(state);
	if (!current || state.writing) return;
	state.setWriting(true);
	const local = localGm(current, { text: line });
	try {
		const res = await consultStoryteller({ data: {
			campaignId: current.campaignId,
			sceneId: current.sceneId,
			playerName: current.playerName,
			activeId: current.activeId,
			action: line,
			party: current.party.map((p) => ({
				id: p.id,
				heart: p.heart
			})),
			recent: current.log.slice(-6).map((l) => ({
				role: l.role,
				text: l.text.slice(0, 480)
			}))
		} });
		if (res.ok) state.commit(current.id, line, res.result, "live");
		else state.commit(current.id, line, local, "book");
	} catch {
		state.commit(current.id, line, local, "book");
	}
}
var SplitComponent = Thornwake;
//#endregion
export { SplitComponent as component };
