//#region node_modules/.nitro/vite/services/ssr/assets/content-BlwjfujB.js
var PARTY = [
	{
		id: "calder",
		name: "Calder",
		role: "Warden",
		heart: 18,
		heartMax: 18,
		guard: 15,
		portrait: "/art/calder.jpg"
	},
	{
		id: "bramble",
		name: "Bramble",
		role: "Scout",
		heart: 14,
		heartMax: 14,
		guard: 13,
		portrait: "/art/bramble.jpg"
	},
	{
		id: "vesper",
		name: "Vesper",
		role: "Arcanist",
		heart: 12,
		heartMax: 12,
		guard: 11,
		portrait: "",
		cameo: "vesper"
	},
	{
		id: "holt",
		name: "Holt",
		role: "Knife",
		heart: 13,
		heartMax: 13,
		guard: 14,
		portrait: "",
		cameo: "holt"
	}
];
var INVENTORY = [
	{
		id: "lantern",
		name: "Brass lantern",
		detail: "Burns clean. The glass is river-scratched.",
		ownerId: "calder"
	},
	{
		id: "rope",
		name: "Soft rope",
		detail: "Ten paces, knotted every arm.",
		ownerId: "calder"
	},
	{
		id: "chalk",
		name: "Trail chalk",
		detail: "White, and a stub of red.",
		ownerId: "bramble"
	},
	{
		id: "string",
		name: "Spare bowstring",
		detail: "Waxed. Also ties a splint.",
		ownerId: "bramble"
	},
	{
		id: "bead",
		name: "Orrery bead",
		detail: "Warm when a true north is near.",
		ownerId: "vesper"
	},
	{
		id: "circle",
		name: "Pocket chalk circle",
		detail: "For listening, not for locking doors.",
		ownerId: "vesper"
	},
	{
		id: "picks",
		name: "Latch picks",
		detail: "For boxes, gates, and stubborn windows.",
		ownerId: "holt"
	},
	{
		id: "knife",
		name: "Folding knife",
		detail: "Rope, fruit, and the occasional warning.",
		ownerId: "holt"
	}
];
var speak = (id, label, hint) => ({
	id,
	label,
	hint
});
var CAMPAIGNS = [
	{
		id: "ashpine",
		name: "Ashpine Post",
		blurb: "A courier vanished before the pass closed. The satchel came back full of river sand.",
		chapters: "Three chapters",
		levels: "Levels 1–2",
		span: "One night",
		canon: "Ashpine is a snowy market under a mountain pass. A courier's satchel was found on the well rope, emptied of letters and filled with dry river sand. The coal furnace under the mountain was lit at noon, but no one claims the coal. The company is Calder, Bramble, Vesper, and Holt. The trail leads from Lantern Market to the Orrery Hall and then to the Maple Forge on the far side of the mountain. Family tone, no gore. The mystery is a displaced river-spirit using the post road to send a warning, not a villain to kill.",
		scenes: [
			{
				id: "lantern-market",
				name: "Lantern Market",
				image: "/art/market.jpg",
				daypart: "Morning",
				clock: "08:40",
				weather: "Snow",
				sky: "MORNING · SNOW",
				ambient: "Snow stitches the stalls shut. Lanterns stay lit because the sun never quite arrives.",
				chronicleTitle: "Sand in the satchel",
				opening: "Snow has stitched the market shut except for the well and one stubborn pie stall. The courier's satchel hangs on the well-rope, empty of letters, heavy with dry river sand — and the pass is not a river.\n\nThe baker waves you over with a floury hand. Under the mountain, she says, the furnace was lit at noon. No one in Ashpine will claim the coal.",
				quest: {
					title: "The sand in the satchel",
					detail: "Ask the baker, search the well, or follow the smell of strange coal."
				},
				choices: [
					speak("ask-baker", "Ask the baker what she saw", "She was first to the well"),
					speak("search-satchel", "Empty the satchel on the stones"),
					speak("well-rope", "Climb down as far as the rope allows"),
					speak("follow-coal", "Follow the coal-smell toward the hall")
				],
				hotspots: [
					{
						id: "road",
						name: "Pass road",
						x: 50,
						y: 18,
						examine: "Bootprints end where the snow gets serious. One print is damp, as if the walker stepped out of a stream."
					},
					{
						id: "pines",
						name: "Pine stand",
						x: 18,
						y: 58,
						examine: "Resin, and a strip of courier-red cloth caught too high for a fall."
					},
					{
						id: "stall",
						name: "Pie stall",
						x: 32,
						y: 46,
						examine: "The baker kept a bowl of sand because it 'hummed' when the oven was open."
					},
					{
						id: "well",
						name: "The well",
						x: 48,
						y: 60,
						examine: "The bucket smells like a riverbank. The water below is warm."
					},
					{
						id: "fire",
						name: "Campfire",
						x: 66,
						y: 72,
						examine: "Travelers left it banked. Someone added coal that burns blue at the edges."
					},
					{
						id: "sacks",
						name: "Coal sacks",
						x: 74,
						y: 44,
						examine: "Stamped with the post's mark. One sack is full of smooth river stones instead.",
						threat: true
					}
				]
			},
			{
				id: "orrery-hall",
				name: "Orrery Hall",
				image: "/art/orrery.jpg",
				daypart: "Nightfall",
				clock: "19:10",
				weather: "Still",
				sky: "NIGHTFALL · STILL",
				ambient: "The star-floor ticks. Somewhere under the brass, water is moving where water should not be.",
				chronicleTitle: "Under the armillary",
				opening: "The hall was a post office before it was a sky-room. Brass rings turn though no hand touches them. Letters are pinned under weights of river stone.\n\nVesper's bead warms. The armillary is not tracking stars. It is tracking a current.",
				quest: {
					title: "The current in the brass",
					detail: "Read the weighted letters, or follow the tick beneath the floor."
				},
				choices: [
					speak("read-letters", "Read the letters under the stones"),
					speak("still-rings", "Ask Vesper to still the rings"),
					speak("star-floor", "Step onto the star inlay"),
					speak("descend", "Follow the water-sound downward")
				],
				hotspots: [
					{
						id: "window",
						name: "High window",
						x: 78,
						y: 20,
						examine: "Night outside, but the glass sweats as if the room were a river cave."
					},
					{
						id: "armillary",
						name: "Armillary",
						x: 46,
						y: 40,
						examine: "The rings pause when you say the courier's route aloud.",
						threat: true
					},
					{
						id: "telescope",
						name: "Telescope",
						x: 74,
						y: 50,
						examine: "It points at the floor, not the sky. Through it, the tiles look like shallows."
					},
					{
						id: "stars",
						name: "Star floor",
						x: 52,
						y: 66,
						examine: "One inlay is wet. A minnow-flicker of light crosses it and is gone."
					},
					{
						id: "desk",
						name: "Chart desk",
						x: 24,
						y: 58,
						examine: "A route card: Ashpine to the maple side. The ink has run toward the bottom of the page."
					}
				]
			},
			{
				id: "maple-forge",
				name: "Maple Forge",
				image: "/art/forge.jpg",
				daypart: "Morning",
				clock: "07:05",
				weather: "Woodsmoke",
				sky: "MORNING · SMOKE",
				ambient: "Autumn, somehow, on this side of the mountain. The forge breathes like a tide.",
				chronicleTitle: "The forge that drank a river",
				opening: "You come out under maples the color of embers. The cliff forge is lit, and the coals are smooth stones. A shallow stream climbs the cart-rails toward the fire, polite as a guest.\n\nThe courier sits on a crate, dry, embarrassed, and holding a bell the size of a fist. 'It wanted the letters carried the other way,' they say. 'Downhill. Toward the sea.'",
				quest: {
					title: "Carry it downhill",
					detail: "Decide what the company does with the bell, the letters, and the tired courier."
				},
				choices: [
					speak("take-bell", "Accept the bell and the letters"),
					speak("ask-courier", "Ask the courier to tell it plainly"),
					speak("bank-fire", "Bank the forge so the stones can cool"),
					speak("close-book", "Walk the courier home and close the chapter")
				],
				hotspots: [
					{
						id: "maples",
						name: "Maple stand",
						x: 22,
						y: 30,
						examine: "Leaves float upstream. Bramble marks it with red chalk and the chalk line drifts too."
					},
					{
						id: "forge",
						name: "Cliff forge",
						x: 66,
						y: 38,
						examine: "Heat without hunger. The bellows sigh on their own.",
						threat: true
					},
					{
						id: "rails",
						name: "Cart rails",
						x: 54,
						y: 52,
						examine: "Wet all the way to the tent. Uphill."
					},
					{
						id: "path",
						name: "The path",
						x: 38,
						y: 64,
						examine: "The courier's boots. Both of them. They walked out under their own power."
					},
					{
						id: "camp",
						name: "Camp tent",
						x: 48,
						y: 78,
						examine: "A blanket, a pie wrapped in baker's cloth, and the little bell wrapped so it will not ring by accident."
					}
				]
			}
		]
	},
	{
		id: "stillwater",
		name: "Stillwater Bell",
		blurb: "A river mystery of missing names, oaths, and a bell that still answers.",
		chapters: "Two chapters",
		levels: "Levels 1–2",
		span: "Until dusk",
		canon: "Stillwater Crossing is a riverside village. An innkeeper counts copper bowls when the crossing goes quiet. A stonecutter rubs a blank sign. A bell is sunk beneath a ruined arch and still rings in the shallows. The company is Calder, Bramble, Vesper, and Holt. The second place is the old toll fort upriver, where the bell's chain is anchored. The mystery resolves by restoring a name to the sign and letting the bell rest. No gore, no death. The figure in grey is a ferryman who retired and does not know how to leave.",
		scenes: [{
			id: "reed-crossing",
			name: "Stillwater Crossing",
			image: "/art/crossing.jpg",
			daypart: "Sunset",
			clock: "17:30",
			weather: "Rain",
			sky: "SUNSET · RAIN",
			ambient: "Rain on the river. Lanterns gather in the shallows between the stones.",
			chronicleTitle: "Reeds in Stillwater",
			opening: "The innkeeper is counting copper bowls now that the crossing has fallen quiet. One bowl stays in her hand. Across the road, the stonecutter rubs a blank sign as though a missing name might come back under his thumb.\n\nLantern reflections gather in the hollows between the stones. A man in a burial-grey coat stands where the reeds begin, and points — not at you — at the water.",
			quest: {
				title: "A bell beneath the water",
				detail: "Speak with the stranger, read the blank sign, or listen at the bridge."
			},
			choices: [
				speak("speak-grey", "Speak to the figure in grey"),
				speak("blank-sign", "Read the blank sign"),
				speak("shelter", "Take shelter at the inn"),
				speak("listen-arch", "Listen beneath the arch")
			],
			hotspots: [
				{
					id: "inn",
					name: "The inn",
					x: 36,
					y: 34,
					examine: "Bowls in a row. The innkeeper says the river took a name and left the debt."
				},
				{
					id: "gardens",
					name: "Gardens",
					x: 20,
					y: 50,
					examine: "Herbs lean toward the water. Even the rosemary."
				},
				{
					id: "bridge",
					name: "The bridge",
					x: 56,
					y: 52,
					examine: "The keystone is warm. If you lean close, something answers with one soft note."
				},
				{
					id: "arch",
					name: "Ruined arch",
					x: 80,
					y: 28,
					examine: "Ivy, and a chain that goes into the river and does not come back.",
					threat: true
				},
				{
					id: "reeds",
					name: "The reeds",
					x: 28,
					y: 74,
					examine: "The grey coat is a ferryman's coat. He has dry boots. He has been dry for years."
				},
				{
					id: "hut",
					name: "Round hut",
					x: 70,
					y: 76,
					examine: "The stonecutter's chisels, and a dozen practice signs, all blank."
				}
			]
		}, {
			id: "toll-fort",
			name: "Toll Fort",
			image: "/art/fort.jpg",
			daypart: "Morning",
			clock: "09:20",
			weather: "Clear",
			sky: "MORNING · CLEAR",
			ambient: "Upriver the fort holds the other end of a chain nobody tows anymore.",
			chronicleTitle: "The chain at the toll",
			opening: "The toll fort has not charged a coin since the arch fell. In the yard, the chain comes out of a well-cap and runs south, toward the village, under the flagstones' imagination.\n\nCut into the round tower, at eye height, is a name that was chiseled, then filled, then almost forgotten: MAREN VOSS. The ferryman says it like a person remembering their own hands.",
			quest: {
				title: "Give the name back",
				detail: "Carry Maren Voss back to the blank sign, or ring the chain once and let the bell sleep."
			},
			choices: [
				speak("copy-name", "Copy the name in trail chalk"),
				speak("ask-maren", "Ask if the ferryman is Maren"),
				speak("ring-once", "Ring the chain, once, gently"),
				speak("close-book", "Take the name home to the sign")
			],
			hotspots: [
				{
					id: "tower",
					name: "Round tower",
					x: 30,
					y: 46,
					examine: "The filled carving. Rain never quite sticks to those six letters."
				},
				{
					id: "gate",
					name: "Open gate",
					x: 42,
					y: 64,
					examine: "No toll box. A bowl, copper, with a single dry leaf in it."
				},
				{
					id: "yard",
					name: "Courtyard",
					x: 60,
					y: 48,
					examine: "The chain hums if two people stand on it. It is an instrument, not a lock.",
					threat: true
				},
				{
					id: "cart",
					name: "Supply cart",
					x: 74,
					y: 34,
					examine: "Old rope. Holt says the knots are ferryman knots."
				},
				{
					id: "wall",
					name: "Wall walk",
					x: 80,
					y: 60,
					examine: "You can see the village smoke. The river between you looks, for a moment, like a road."
				}
			]
		}]
	},
	{
		id: "harbor",
		name: "Dusk Harbor",
		blurb: "The ship leaves when the fifth tide turns. The chart is cracked. The footprints are wet.",
		chapters: "Three chapters",
		levels: "Five days",
		span: "Before the gate",
		canon: "Dusk Harbor has five days until the tidegate opens and a hired ship leaves without its night chart. The harbormaster's bell is cracked. Wet footprints cross the wharf and stop in the middle. The company is Calder, Bramble, Vesper, and Holt. The chart was stored in a tower chart-room (the Night Chart) and the tidegate itself is a stone sea-wall. The person who hid the chart is an adult deckhand who wanted to stop the ship leaving before a lighthouse tender returned. Resolve by finding the tender's mark and mending the chart. No gore.",
		scenes: [
			{
				id: "salt-wharf",
				name: "Saltglass Wharf",
				image: "/art/harbor.jpg",
				daypart: "Dusk",
				clock: "18:05",
				weather: "Fair",
				sky: "DUSK · FAIR",
				ambient: "Tar, salt, and a bell with a crack you can feel in your teeth.",
				chronicleTitle: "Footprints that stop",
				opening: "Five days until the tidegate opens. The hired ship will leave without its night chart if nobody mends the theft. The harbormaster's bell is cracked down the side and still gets rung, out of pride.\n\nWet footprints cross the wharf and stop in the middle of dry boards, as if the walker remembered they were not supposed to be water.",
				quest: {
					title: "The chart before the fifth tide",
					detail: "Speak to the harbormaster, follow the footprints, or open the marked crate."
				},
				choices: [
					speak("harbormaster", "Speak to the harbormaster"),
					speak("footprints", "Follow the wet footprints"),
					speak("cracked-bell", "Look at the cracked bell"),
					speak("open-crate", "Open the crate marked with a star")
				],
				hotspots: [
					{
						id: "crates",
						name: "Crate stacks",
						x: 30,
						y: 44,
						examine: "One crate is starred in chalk. It ticks, softly, like a cooling kettle."
					},
					{
						id: "ship",
						name: "Moored ship",
						x: 64,
						y: 34,
						examine: "The Lark. Her boatswain will not sail a coast they cannot see at night."
					},
					{
						id: "pier",
						name: "The pier",
						x: 46,
						y: 56,
						examine: "Footprints. Left foot, right foot, then none. The boards around the last print are dry.",
						threat: true
					},
					{
						id: "warehouse",
						name: "Warehouse",
						x: 76,
						y: 58,
						examine: "Charts live upstairs, the clerk says, except the one that doesn't."
					},
					{
						id: "water",
						name: "The water",
						x: 48,
						y: 76,
						examine: "Lanterns double themselves. One reflection waves. Nobody on the pier is waving."
					}
				]
			},
			{
				id: "night-chart",
				name: "Night Chart",
				image: "/art/orrery.jpg",
				daypart: "Nightfall",
				clock: "21:40",
				weather: "Clear",
				sky: "NIGHTFALL · CLEAR",
				ambient: "A tower room pretending to be a sky. The charts are pinned over the stars.",
				chronicleTitle: "The missing coast",
				opening: "The chart room smells of ink and oranges. Someone has cut the coast off the night chart in a careful crescent — not torn, cut — and left a deckhand's knot on the telescope.\n\nPinned beneath the armillary: a note. 'The tender at Splint Light has not come in. Do not sail the dark without them.'",
				quest: {
					title: "Mend the coast",
					detail: "Find the cut piece, or take the note to the tidegate and hold the ship."
				},
				choices: [
					speak("search-room", "Search the room for the cut coast"),
					speak("read-note", "Read the note aloud"),
					speak("telescope", "Turn the telescope down, not up"),
					speak("to-gate", "Carry the note to the tidegate")
				],
				hotspots: [
					{
						id: "window",
						name: "High window",
						x: 78,
						y: 22,
						examine: "You can see Splint Light. It is dark. It should not be."
					},
					{
						id: "armillary",
						name: "Armillary",
						x: 48,
						y: 40,
						examine: "The note is weighed with a sailor's knife. Holt knows the knot.",
						threat: true
					},
					{
						id: "telescope",
						name: "Telescope",
						x: 74,
						y: 52,
						examine: "Pointed at a roof two streets over. A pale scrap is stuck under a tile."
					},
					{
						id: "stars",
						name: "Star floor",
						x: 52,
						y: 66,
						examine: "Chalk, not magic: a map of the wharf, and an X on the starred crate."
					},
					{
						id: "desk",
						name: "Chart desk",
						x: 26,
						y: 58,
						examine: "Spare vellum. A patient hand could draw the coast back."
					}
				]
			},
			{
				id: "tide-gate",
				name: "Tidegate",
				image: "/art/fort.jpg",
				daypart: "Morning",
				clock: "06:50",
				weather: "Wind",
				sky: "MORNING · WIND",
				ambient: "The sea-wall holds the harbor in. Wind practices on the banners.",
				chronicleTitle: "Hold the gate",
				opening: "The tidegate is a fort that decided to become a door. The Lark's crew is already coiling lines. In the yard, the deckhand waits with the cut coast of the chart folded inside a clean shirt, and with news: the tender's skiff is coming in under a patched sail.\n\nNobody has to steal anything now. Somebody does have to say, out loud, that the ship will wait one tide.",
				quest: {
					title: "One tide of patience",
					detail: "Speak for the tender, mend the chart, and let the gate open when the light is lit."
				},
				choices: [
					speak("speak-crew", "Ask the crew for one more tide"),
					speak("mend-chart", "Mend the chart on the cart"),
					speak("light-signal", "Signal Splint Light with the lantern"),
					speak("close-book", "Watch the light answer, and close the book")
				],
				hotspots: [
					{
						id: "tower",
						name: "Gate tower",
						x: 30,
						y: 46,
						examine: "The signal slot faces the sea. Calder's lantern fits it."
					},
					{
						id: "gate",
						name: "The gate",
						x: 44,
						y: 64,
						examine: "Timber and tide-marks. It opens outward, the way a careful person leaves a room."
					},
					{
						id: "yard",
						name: "Yard",
						x: 60,
						y: 48,
						examine: "The deckhand. Tired, not wicked. They slept here so they would not lose their nerve.",
						threat: true
					},
					{
						id: "cart",
						name: "Chart cart",
						x: 74,
						y: 36,
						examine: "Vellum, paste, and a weight. The coast wants to lie flat."
					},
					{
						id: "wall",
						name: "Sea-wall",
						x: 82,
						y: 60,
						examine: "A skiff. A patched sail. A small light, newly lit, answering yours."
					}
				]
			}
		]
	}
];
function getCampaign(id) {
	return CAMPAIGNS.find((c) => c.id === id);
}
function getScene(campaignId, sceneId) {
	return getCampaign(campaignId)?.scenes.find((s) => s.id === sceneId);
}
//#endregion
export { getScene as a, getCampaign as i, INVENTORY as n, PARTY as r, CAMPAIGNS as t };
