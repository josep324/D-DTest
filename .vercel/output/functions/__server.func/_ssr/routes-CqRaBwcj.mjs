import { i as __toESM } from "../_runtime.mjs";
import { b as require_jsx_runtime, q as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { a as getScene, i as getCampaign, n as INVENTORY, r as PARTY, t as CAMPAIGNS } from "./content-7n9J_wLk.mjs";
import { a as number, n as array, o as object, r as boolean, s as string, t as _enum } from "../_libs/zod.mjs";
import { _ as Backpack, a as Sword, c as Moon, d as Footprints, f as Feather, g as BookOpen, h as ChevronLeft, l as Mic, m as ChevronRight, n as VolumeX, o as Send, p as Dices, r as Volume2, s as Search, t as X, u as MicOff } from "../_libs/lucide-react.mjs";
import { t as create } from "../_libs/zustand.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CqRaBwcj.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ABILITY_NAMES = {
	str: "Força",
	dex: "Destresa",
	con: "Constitució",
	int: "Intel·lecte",
	wis: "Saviesa",
	cha: "Encant"
};
var LEVEL_XP = [
	0,
	80,
	200,
	360
];
var MAX_LEVEL = LEVEL_XP.length;
function abilityMod(score) {
	return Math.floor((score - 10) / 2);
}
function profBonus(level) {
	return level >= 3 ? 3 : 2;
}
function checkMod(hero, ability, level) {
	return abilityMod(hero.abilities[ability]) + (hero.proficient.includes(ability) ? profBonus(level) : 0);
}
function levelForXp(xp) {
	let level = 1;
	LEVEL_XP.forEach((need, i) => {
		if (xp >= need) level = i + 1;
	});
	return level;
}
function die(sides) {
	return 1 + Math.floor(Math.random() * sides);
}
function heroOf(tale, id) {
	return tale.party.find((p) => p.id === id) ?? tale.party.find((p) => p.id === tale.activeId) ?? tale.party[0];
}
/** Advantage when an item set an edge for this hero or a companion stands at the same place. */
function autoMode(tale, hero) {
	if (tale.edge === hero.id) return {
		mode: "advantage",
		why: "un objecte et dóna avantatge"
	};
	const here = tale.positions[hero.id];
	const helper = tale.party.find((p) => p.id !== hero.id && tale.positions[p.id] === here);
	if (helper) return {
		mode: "advantage",
		why: `${helper.name} fa costat`
	};
	return {
		mode: "normal",
		why: ""
	};
}
/**
* Roll (or accept) a d20 for a hero. `physical` is a number read off a real die at the table.
*/
function makeCheck(tale, hero, ability, dc, label, mode, physical) {
	const mod = checkMod(hero, ability, tale.level);
	let rolls;
	if (physical !== void 0) rolls = [Math.max(1, Math.min(20, Math.round(physical)))];
	else rolls = mode === "normal" ? [die(20)] : [die(20), die(20)];
	const roll = mode === "advantage" ? Math.max(...rolls) : mode === "disadvantage" ? Math.min(...rolls) : rolls[0];
	const crit = roll === 20 ? "hit" : roll === 1 ? "fumble" : null;
	const success = crit === "hit" ? true : crit === "fumble" ? false : roll + mod >= dc;
	return {
		who: hero.name,
		heroId: hero.id,
		label,
		ability,
		mode: physical !== void 0 ? "normal" : mode,
		rolls,
		roll,
		mod,
		dc,
		success,
		crit,
		physical: physical !== void 0
	};
}
function describeRoll(show) {
	const how = show.mode === "advantage" ? " amb avantatge" : show.mode === "disadvantage" ? " amb desavantatge" : "";
	const tag = show.crit === "hit" ? " (un 20 natural!)" : show.crit === "fumble" ? " (un 1 natural)" : "";
	return `${show.who} tira ${ABILITY_NAMES[show.ability]}${how}: ${show.roll}${show.mod >= 0 ? "+" : ""}${show.mod} = ${show.roll + show.mod} contra ${show.dc}${tag}. ${show.success ? "Èxit" : "Fracàs"}.`;
}
var INTENTS = [
	{
		ability: "dex",
		dc: 13,
		reason: "Moure's sense fer soroll",
		re: /\b(sneak|creep|tiptoe|hide|slip past|pick|lockpick|dodge|balance|juggle)|(sigil|amag|esquiv|furt|colar|ganxo|sigilos|esconde)/i
	},
	{
		ability: "str",
		dc: 13,
		reason: "Un esforç físic dur",
		re: /\b(push|pull|lift|force|break|smash|haul|drag|shove|heave|climb)|(empeny|estira|aixec|trenc|força|forzar|empuj|levant|escal)/i
	},
	{
		ability: "wis",
		dc: 12,
		reason: "Notar el que costa de veure",
		re: /\b(look|search|inspect|examine|listen|watch|notice|track|follow|study the)|(mira|busc|busqu|inspecciona|escolta|observa|segueix|rastre|escucha|examina)/i
	},
	{
		ability: "int",
		dc: 13,
		reason: "Descobrir com funciona",
		re: /\b(read|decipher|recall|figure|solve|translate|analy[sz]e|remember|puzzle|study)|(llegeix|desxifra|recorda|resol|descifra|lee|resuelve)/i
	},
	{
		ability: "cha",
		dc: 12,
		reason: "Trobar les paraules justes",
		re: /\b(ask|persuade|convince|charm|talk|bargain|plead|reassure|haggle|speak to)|(pregunta|convenc|parla|regateja|demana|habla|pide)/i
	},
	{
		ability: "con",
		dc: 12,
		reason: "Aguantar una mica més",
		re: /\b(endure|brace|hold (?:on|out)|wade|push through|swim|carry on)|(aguanta|resisteix|nada|nedar|aguanta)/i
	}
];
function classifyAction(text) {
	const body = text.replace(/^[^:]{1,20}:\s*/, "");
	for (const it of INTENTS) if (it.re.test(body)) return {
		ability: it.ability,
		dc: it.dc,
		reason: it.reason,
		line: text
	};
	return null;
}
function xpAfter(tale, gained) {
	const xp = tale.xp + gained;
	const level = Math.max(tale.level, levelForXp(xp));
	return {
		xp,
		level,
		leveled: level > tale.level
	};
}
function xpForCheck(show) {
	return (show.success ? 10 : 4) + (show.crit === "hit" ? 5 : 0);
}
function checkMechanics(show) {
	const notes = [describeRoll(show)];
	const heartDelta = [];
	if (show.crit === "fumble") {
		heartDelta.push({
			id: show.heroId,
			delta: -1
		});
		notes.push(`${show.who} perd 1 cor per l'entrebanc. Els altres l'ajuden a aixecar-se.`);
	}
	return {
		heartDelta,
		xp: xpForCheck(show),
		notes
	};
}
function startEncounter(tale, spot) {
	const inits = tale.party.map((p) => ({
		id: p.id,
		name: p.name,
		score: die(20) + abilityMod(p.abilities.dex)
	}));
	const foe = {
		id: "foe",
		name: spot.name,
		score: die(20) + 1
	};
	const order = [...inits, foe].sort((a, b) => b.score - a.score);
	const resolveMax = 5 + tale.level * 3;
	return {
		encounter: {
			spotId: spot.id,
			name: spot.name,
			resolve: resolveMax,
			resolveMax,
			guard: 11 + tale.level,
			bite: tale.level >= 3 ? 3 : 2,
			order: order.map((o) => o.id),
			turn: 0,
			round: 1
		},
		notes: [`El problema es desperta a ${spot.name}. Iniciativa: ${order.map((o) => `${o.id === "foe" ? "el problema" : o.name} ${o.score}`).join(", ")}.`, "La companyia pot calmar el problema. Aquí no es mor ningú; un heroi amb 1 cor és retirat pels altres."]
	};
}
/** Let the trouble act until it is a hero's turn again. Mutates nothing; returns deltas. */
function runFoeTurns(tale, enc, hearts, notes, deltas) {
	let turn = enc.turn;
	let round = enc.round;
	for (let guardLoop = 0; guardLoop < enc.order.length + 1; guardLoop += 1) {
		if (enc.order[turn] !== "foe") break;
		const live = tale.party.filter((p) => hearts[p.id] > 1);
		if (live.length === 0) notes.push(`El problema de ${enc.name} bufa i veu tots els herois ja esgotats. Es reté.`);
		else {
			const target = live[Math.floor(Math.random() * live.length)];
			const swing = die(20) + 3;
			if (swing >= target.guard) {
				const dmg = Math.min(enc.bite, hearts[target.id] - 1);
				hearts[target.id] -= dmg;
				deltas[target.id] = (deltas[target.id] ?? 0) - dmg;
				notes.push(`El problema de ${enc.name} colpeja ${target.name} (${swing} contra defensa ${target.guard}) i costa ${dmg} cor.`);
			} else notes.push(`El problema de ${enc.name} ataca ${target.name} (${swing} contra defensa ${target.guard}) i falla.`);
		}
		turn += 1;
		if (turn >= enc.order.length) {
			turn = 0;
			round += 1;
		}
	}
	return {
		...enc,
		turn,
		round
	};
}
function beginEncounter(tale, spot) {
	const { encounter, notes } = startEncounter(tale, spot);
	const hearts = Object.fromEntries(tale.party.map((p) => [p.id, p.heart]));
	const deltas = {};
	const next = runFoeTurns(tale, encounter, hearts, notes, deltas);
	const active = next.order[next.turn];
	return {
		heartDelta: Object.entries(deltas).map(([id, delta]) => ({
			id,
			delta
		})),
		xp: 0,
		encounter: next,
		activeId: active === "foe" ? void 0 : active,
		notes
	};
}
function strikeMechanics(tale, show) {
	const enc = tale.encounter;
	if (!enc) return checkMechanics(show);
	const hero = heroOf(tale, show.heroId);
	const notes = [describeRoll(show)];
	const hearts = Object.fromEntries(tale.party.map((p) => [p.id, p.heart]));
	const deltas = {};
	let resolve = enc.resolve;
	let xp = 0;
	if (show.crit === "fumble") {
		const dmg = Math.min(1, hearts[hero.id] - 1);
		if (dmg > 0) {
			hearts[hero.id] -= dmg;
			deltas[hero.id] = -dmg;
		}
		notes.push(`${hero.name} s'estén massa i perd ${dmg} cor.`);
	} else if (show.success) {
		const dmg = die(4) + Math.max(0, abilityMod(hero.abilities[hero.attack])) + (show.crit === "hit" ? 3 : 0);
		resolve = Math.max(0, resolve - dmg);
		notes.push(`${hero.name} fa recular el problema ${dmg}. Li queden ${resolve} de ${enc.resolveMax} de resolució.`);
	} else notes.push(`${hero.name} no troba l'escletxa. El problema no es mou.`);
	if (resolve <= 0) {
		notes.push(`El problema de ${enc.name} queda calmat. Ningú no ha de patir més.`);
		return {
			heartDelta: Object.entries(deltas).map(([id, delta]) => ({
				id,
				delta
			})),
			xp: 30 + xpForCheck(show),
			encounter: null,
			notes
		};
	}
	let turn = enc.turn + 1;
	let round = enc.round;
	if (turn >= enc.order.length) {
		turn = 0;
		round += 1;
	}
	const next = runFoeTurns(tale, {
		...enc,
		resolve,
		turn,
		round
	}, hearts, notes, deltas);
	const active = next.order[next.turn];
	xp += xpForCheck(show);
	return {
		heartDelta: Object.entries(deltas).map(([id, delta]) => ({
			id,
			delta
		})),
		xp,
		encounter: next,
		activeId: active === "foe" ? void 0 : active,
		notes
	};
}
function restMechanics(tale) {
	return {
		heartDelta: tale.party.map((p) => ({
			id: p.id,
			delta: Math.min(p.heartMax - p.heart, Math.ceil(p.heartMax / 2))
		})).filter((h) => h.delta > 0),
		xp: 0,
		rest: true,
		notes: [`La companyia descansa. Cada heroi recupera fins a la meitat dels cors. Queden ${tale.rests - 1} descansos.`]
	};
}
function itemMechanics(tale, item, hero) {
	if (item.effect === "heal") {
		const target = [...tale.party].sort((a, b) => a.heart / a.heartMax - b.heart / b.heartMax)[0];
		const delta = Math.min(item.amount ?? 3, target.heartMax - target.heart);
		return {
			heartDelta: delta > 0 ? [{
				id: target.id,
				delta
			}] : [],
			xp: 0,
			consume: item.id,
			notes: [`${hero.name} fa servir ${item.name.toLowerCase()} amb ${target.name}, que recupera ${Math.max(0, delta)} cor.`]
		};
	}
	if (item.effect === "edge") return {
		heartDelta: [],
		xp: 0,
		edge: hero.id,
		notes: [`${hero.name} fa servir ${item.name.toLowerCase()}. La propera tirada té avantatge.`]
	};
	return null;
}
function uid() {
	if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
	return `id-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
}
var endChoice = {
	id: "open-chronicle",
	label: "Llegeix la crònica",
	hint: "El capítol ja està contat"
};
function beat(narration, choices, extra = {}) {
	return {
		narration,
		choices,
		...extra
	};
}
var BOOK = {
	"lantern-market:ask-baker": beat("La fornera s'espolsa les mans i abaixa la veu, cosa innecessària: el mercat ja escolta.\n\n«Sorra al poal a l'alba. I la saca era tèbia, com una pedra que ha estat a la butxaca. Qui la portava va sortir del pou, no hi va entrar.» Fa un gest cap als sacs de carbó. «Aquells van arribar sense carreter. Cremen blaus a les vores.»", [
		{
			id: "search-satchel",
			label: "Buida la saca sobre les pedres"
		},
		{
			id: "well-rope",
			label: "Baixa tant com deixi la corda"
		},
		{
			id: "follow-coal",
			label: "Segueix l'olor de carbó cap a la sala"
		},
		{
			id: "sacks",
			label: "Obre un sac de carbó"
		}
	], {
		moveTo: "stall",
		questTitle: "La sorra de la saca",
		questDetail: "La fornera jura que el portador va pujar del pou."
	}),
	"lantern-market:search-satchel": beat("En Holt buida la saca. Sorra, una engruna de pastís i una carta que ha sobreviscut amagada a la costura. La tinta ha corregut cap amunt per la pàgina.\n\nÉs una targeta de ruta: Pinassa, sota la sala, sortida a l'auroneda. Al peu, amb una lletra que no és del missatger: porta la campana cap a l'altre costat.", [
		{
			id: "well-rope",
			label: "Mira cap avall al pou"
		},
		{
			id: "follow-coal",
			label: "Porta la targeta de ruta a la sala"
		},
		{
			id: "ask-baker",
			label: "Ensenya la carta a la fornera"
		}
	], {
		chronicleTitle: "Tinta que corre cap amunt",
		chronicleBody: "L'única carta que ha sobreviscut demana a la companyia que porti una campana cap a l'altre costat.",
		moveTo: "well"
	}),
	"lantern-market:well-rope": beat("En Calder agafa la corda. Deu passes avall, l'aire es torna amable. L'aigua és tèbia i clara i plena de còdols corrents, tret que estan arranjats com una frase.\n\nLa Bramble la llegeix des de dalt: no és una trampa. És una petició. El riu de sota la muntanya vol que el seu correu es lliuri cap al mar, i va agafar un missatger prestat per dir-ho.", [
		{
			id: "follow-coal",
			label: "Segueix la petició fins a la sala"
		},
		{
			id: "search-satchel",
			label: "Surt i regira la saca"
		},
		{
			id: "ask-baker",
			label: "Digues a la fornera que el pou és amable"
		}
	], {
		moveTo: "well",
		heartDelta: [{
			id: "calder",
			delta: -1
		}]
	}),
	"lantern-market:sacks": beat("El sac pesa més que el carbó i fa menys soroll. Còdols de riu, cadascun marcat amb un segell de correu minúscul. Quan en Holt n'aixeca un, la foguera s'hi inclina.\n\nRes no ataca. Les pedres són correu perdut, que espera ser escalfat fins a convertir-se en paraules.", [{
		id: "follow-coal",
		label: "Porta un còdol a la sala"
	}, {
		id: "ask-baker",
		label: "Pregunta qui va signar pels sacs"
	}], { moveTo: "sacks" }),
	"lantern-market:follow-coal": beat("L'olor de carbó és un fil. Et treu de la neu i et porta per una escala que el mercat feia servir per recolzar-hi les pales. A baix, el llautó fa tic-tac.\n\nLa Sala de l'Orrery s'obre al teu voltant, i la neu no et segueix.", [
		{
			id: "read-letters",
			label: "Llegeix les cartes sota les pedres"
		},
		{
			id: "still-rings",
			label: "Demana a la Vesper que aturi els anells"
		},
		{
			id: "star-floor",
			label: "Puja a l'incrustació d'estels"
		},
		{
			id: "descend",
			label: "Segueix el so d'aigua cap avall"
		}
	], {
		nextSceneId: "orrery-hall",
		daypart: "Capvespre",
		clock: "19:10",
		weather: "Calma",
		sky: "CAPVESPRE · CALMA",
		questTitle: "El corrent al llautó",
		questDetail: "La sala segueix un riu, no un cel.",
		chronicleTitle: "A la Sala de l'Orrery",
		chronicleBody: "La companyia deixa la neu i troba la casa de correus girant com un cel."
	}),
	"orrery-hall:read-letters": beat("Les cartes són corrents i insuportables, com ho són les coses corrents. Un aniversari. Un deute perdonat. Una recepta de pastís que pot viatjar. Cadascuna té al damunt un còdol de riu perquè no se la dugui el vent cap a l'estació equivocada.\n\nLa Vesper diu que les pedres no són panys. Són bones maneres.", [
		{
			id: "still-rings",
			label: "Atura els anells"
		},
		{
			id: "descend",
			label: "Segueix el so d'aigua"
		},
		{
			id: "star-floor",
			label: "Planta't a l'estel mullat"
		}
	], { moveTo: "desk" }),
	"orrery-hall:still-rings": beat("La Vesper no mana a l'armil·lar. El saluda i hi presenta la companyia. Els anells alenteixen, avergonyits, i s'obre un buit prou gran per veure una escala de pedra mullada que baixa cap a un aire de tardor.\n\nLa petjada del missatger és al primer graó, encara humida.", [{
		id: "descend",
		label: "Baixa per l'escala mullada"
	}, {
		id: "read-letters",
		label: "Recull primer les cartes"
	}], {
		moveTo: "armillary",
		heartDelta: [{
			id: "vesper",
			delta: -1
		}]
	}),
	"orrery-hall:star-floor": beat("La incrustació mullada només té un dit de fondària, però té corrent. La llum la creua com una bagra. Quan la Bramble hi posa una mà, sent un camí sota l'aigua, que baixa cap al fum d'auró.", [{
		id: "descend",
		label: "Segueix el camí sota l'aigua"
	}, {
		id: "still-rings",
		label: "Demana als anells una porta"
	}], { moveTo: "stars" }),
	"orrery-hall:descend": beat("L'escala us deixa sota uns auros que no tenen res a fer a aquesta banda d'un coll nevat. La farga és encesa. Algú seu en una caixa, viu, avergonyit, amb una campana del tamany d'un puny.\n\n«Vaig intentar lliurar-la costa amunt», diu el missatger. «Només volia anar cap avall.»", [
		{
			id: "take-bell",
			label: "Accepta la campana i les cartes"
		},
		{
			id: "ask-courier",
			label: "Demana al missatger que ho expliqui clar"
		},
		{
			id: "bank-fire",
			label: "Tapa la farga"
		},
		{
			id: "close-book",
			label: "Acompanya el missatger a casa"
		}
	], {
		nextSceneId: "maple-forge",
		daypart: "Matí",
		clock: "07:05",
		weather: "Fum de llenya",
		sky: "MATÍ · FUM",
		day: 2,
		questTitle: "Porta-ho cap avall",
		questDetail: "El missatger és a salvo. La campana encara necessita una direcció.",
		chronicleTitle: "El missatger a la caixa",
		chronicleBody: "Viu, avergonyit i amb una campana que es nega a anar costa amunt."
	}),
	"maple-forge:take-bell": beat("La campana és més lleugera que la culpa i més pesada del que sembla. No sona fins que en Calder l'apunta cap al camí baix. Llavors una sola nota, educada, com algú que s'aclareix la gola a la porta.\n\nEl missatger riu una vegada, d'alleujament. Les pedres de la farga passen del blau al gris corrent.", [
		{
			id: "ask-courier",
			label: "Pregunta què volia dir la nota"
		},
		{
			id: "bank-fire",
			label: "Tapa la farga"
		},
		{
			id: "close-book",
			label: "Acompanya'l a casa"
		}
	], { moveTo: "camp" }),
	"maple-forge:ask-courier": beat("Parla com parla la gent que ha estat valenta en una sala confusa. Una veu al pou li va demanar un favor: portar la campana cap avall, cap a un riu que ha oblidat un nom. La sorra va ser un error. El missatger es va espantar i va omplir la saca amb el primer que va trobar sec.\n\n«Em sap greu l'olor de pastís», afegeix, i així saps que diu la veritat.", [{
		id: "take-bell",
		label: "Agafa la campana"
	}, {
		id: "close-book",
		label: "Promet que l'acompanyaràs a casa"
	}], { moveTo: "path" }),
	"maple-forge:bank-fire": beat("En Calder tapa la farga amb el pla de la pala, no amb el tall de res. El rierol deixa de pujar pels carrils i es posa a ser un rierol. Una fulla d'auró flota en la direcció correcta.\n\nLa Bramble marca el lloc amb guix vermell. Aquesta vegada, la ratlla es queda.", [{
		id: "take-bell",
		label: "Agafa la campana mentre està tranquil·la"
	}, {
		id: "close-book",
		label: "Tanca el capítol"
	}], { moveTo: "forge" }),
	"maple-forge:close-book": beat("Acompanyeu el missatger fins a la neu, que us rep sense fer cap comentari. La fornera plora a la manera eficient de qui té pastissos al forn i una persona que ha tornat.\n\nLa campana resta embolicada. En algun lloc, riu avall, un riu assaja un nom. El Correu de Pinassa és un capítol que podeu tancar.", [endChoice], {
		endTale: true,
		questTitle: "El correu és lliurat",
		questDetail: "El missatger és a casa. La campana baixarà un altre dia, i això és prou.",
		chronicleTitle: "A casa abans que es refredin els pastissos",
		chronicleBody: "La companyia torna el missatger. La campana no sona. La muntanya es calma.",
		moveTo: "path"
	}),
	"reed-crossing:speak-grey": beat("L'home de gris no és perdut. Espera que li parlin amb propietat. El seu abric és d'un barquer, i les seves botes fa temps que no es mullen.\n\n«Vaig posar la campana sota l'arc perquè deixés de cridar la gent pel nom equivocat», diu. «En va guardar un. M'agradaria recuperar-lo, però no puc entrar a l'aigua. He oblidat com es mulla un.»", [
		{
			id: "listen-arch",
			label: "Escolta a l'arc per ell"
		},
		{
			id: "blank-sign",
			label: "Pregunta pel rètol en blanc"
		},
		{
			id: "wade",
			label: "Endinsa't als joncs"
		},
		{
			id: "follow-chain",
			label: "Segueix la cadena riu amunt"
		}
	], {
		moveTo: "reeds",
		questTitle: "Segueix el rastre de la campana",
		questDetail: "El barquer no pot mullar-se. El nom que va perdre és riu amunt, o sota l'arc."
	}),
	"reed-crossing:blank-sign": beat("El picapedrer no alça els ulls. «Era un nom amb una V. Dues síl·labes. El vaig omplir perquè la campana el cridava de nit i els bols de la barra caminaven fins a la vora.»\n\nT'ofereix el cisell, després s'ho repensa i t'ofereix una pedra de fregar. «Si trobeu les lletres, les hi tornaré a posar. No hauria d'haver tingut por d'una paraula.»", [
		{
			id: "speak-grey",
			label: "Explica-ho al barquer"
		},
		{
			id: "listen-arch",
			label: "Escolta sota l'arc"
		},
		{
			id: "follow-chain",
			label: "Segueix la cadena riu amunt"
		}
	], { moveTo: "hut" }),
	"reed-crossing:shelter": beat("L'hostal és càlid de la manera concreta de la llana mullada i la sopa de ceba. La hostalera deixa el bol que sostenia.\n\n«El riu es va endur un nom i va deixar el deute», diu. «No estem encantats. Estem inacabats. Si aneu riu amunt, porteu un pastís. El fortí del peatge fa eco, i els ecos tenen més gana que els viatgers.»", [
		{
			id: "speak-grey",
			label: "Torna a sortir cap al barquer"
		},
		{
			id: "blank-sign",
			label: "Visita el picapedrer"
		},
		{
			id: "follow-chain",
			label: "Agafa el pastís i segueix la cadena"
		}
	], { moveTo: "inn" }),
	"reed-crossing:listen-arch": beat("Sota l'arc, la pluja sona com coberts que es guarden amb cura. Una nota s'enfila per la cadena — no forta, no un avís. Algú que diu aquí.\n\nLa perla de la Vesper fa tic-tac en resposta. La cadena no acaba al poble. Corre riu amunt, cap a l'antic peatge.", [
		{
			id: "follow-chain",
			label: "Segueix la cadena riu amunt"
		},
		{
			id: "wade",
			label: "Entra a l'aigua i busca la campana"
		},
		{
			id: "speak-grey",
			label: "Explica la nota al barquer"
		}
	], { moveTo: "arch" }),
	"reed-crossing:wade": beat("Els joncs us arriben al genoll i no més enllà. La campana és allà, verda i pacient, massa pesada per a una persona i massa estimada per arrossegar-la. Hi ha lletres rascades al llavi interior. La pluja gairebé se les ha menjades.\n\nLa Bramble traça el que pot: una V, una O, l'ombra d'una doble S. La resta del nom no és aquí. La cadena estira, molt suaument, riu amunt.", [{
		id: "follow-chain",
		label: "Segueix la cadena fins a la resta del nom"
	}, {
		id: "speak-grey",
		label: "Surt i explica-ho al barquer"
	}], {
		moveTo: "reeds",
		heartDelta: [{
			id: "bramble",
			delta: -1
		}]
	}),
	"reed-crossing:follow-chain": beat("Camineu per la riba al capvespre fins que el capvespre es rendeix. La cadena és un rumor sota el camí, i després un fet al pati del fortí del peatge. El matí us hi troba, i el fortí us rep amable.\n\nA la torre, un nom s'ha amagat dins els seus propis solcs.", [
		{
			id: "copy-name",
			label: "Copia el nom amb guix de camí"
		},
		{
			id: "ask-maren",
			label: "Pregunta si el barquer és la Maren"
		},
		{
			id: "ring-once",
			label: "Toca la cadena una vegada, suaument"
		},
		{
			id: "close-book",
			label: "Porta el nom a casa, al rètol"
		}
	], {
		nextSceneId: "toll-fort",
		daypart: "Matí",
		clock: "09:20",
		weather: "Serè",
		sky: "MATÍ · SERÈ",
		day: 2,
		questTitle: "Retorna el nom",
		questDetail: "La torre recorda la Maren Voss. El rètol del poble, encara no.",
		chronicleTitle: "Joncs a Aiguaquieta",
		chronicleBody: "La companyia segueix una cadena riu amunt i troba un nom amagat a la torre."
	}),
	"toll-fort:copy-name": beat("El guix vermell de la Bramble no serveix. Fa servir el blanc. MAREN VOSS reposa en una llosa, clar com el pa. Les lletres no es difuminen quan el vent les prova.\n\nDes del pati, el barquer — no l'has sentit arribar — diu: «Sí. Aquest. Vaig deixar-lo aquí perquè una campana que et diu el nom tota la nit és un company de pis difícil.»", [
		{
			id: "ask-maren",
			label: "Deixa que digui la resta"
		},
		{
			id: "ring-once",
			label: "Toca la cadena una vegada"
		},
		{
			id: "close-book",
			label: "Porta el fregat a casa"
		}
	], { moveTo: "tower" }),
	"toll-fort:ask-maren": beat("És la Maren Voss. Va deixar el bac l'any que l'arc es va esquerdar, i des de llavors ha estat sec, cosa que va creure que era seguretat i que va resultar ser un passadís llarg.\n\n«Torneu el nom al rètol», diu. «Em plantaré sota la pluja a propòsit. Estic cansat de ser un rumor amb botes.»", [{
		id: "close-book",
		label: "Acompanya'l a casa, al rètol"
	}, {
		id: "ring-once",
		label: "Toca la cadena com a promesa"
	}], { moveTo: "gate" }),
	"toll-fort:ring-once": beat("Una nota. La cadena la porta sense dramatisme. Lluny, els bols de l'hostal probablement fan un pas educat enrere de la vora i després s'ho repensen abans de saltar.\n\nEn Holt somriu. «Això és una campana a qui s'ha demanat, no manat.»", [{
		id: "copy-name",
		label: "Copia el nom"
	}, {
		id: "close-book",
		label: "Torna mentre la nota encara és a l'aire"
	}], { moveTo: "yard" }),
	"toll-fort:close-book": beat("El picapedrer plora, breument, i després fa la feina. MAREN VOSS torna al rètol. El barquer es queda sota la pluja fins que les espatlles se li enfosqueixen, i sembla tan alleujat que fa una mica de gràcia.\n\nSota l'arc, la campana sona una vegada, sola, i després guarda un silenci decent. Aiguaquieta ja es pot tancar.", [endChoice], {
		endTale: true,
		questTitle: "El nom és al rètol",
		questDetail: "La Maren Voss és mullada, recordada i ja no és un rumor.",
		chronicleTitle: "El rètol recorda",
		chronicleBody: "La companyia porta el nom a casa. La campana sona una vegada i accepta reposar."
	}),
	"salt-wharf:harbormaster": beat("La capitana del port té sal a les celles i cap paciència amb misteris que retarden marees, és a dir, una mica en té.\n\n«La carta nocturna era sencera al migdia. Al vespre la costa havia desaparegut i un mariner havia desaparegut amb ella. L'Alosa no navega a cegues. Teniu cinc dies, i jo tinc una campana esquerdada i una reputació. Arregleu el problema més amable dels dos.»", [
		{
			id: "footprints",
			label: "Segueix les petjades mullades"
		},
		{
			id: "open-crate",
			label: "Obre la caixa de l'estrella"
		},
		{
			id: "cracked-bell",
			label: "Inspecciona la campana"
		}
	], { moveTo: "warehouse" }),
	"salt-wharf:footprints": beat("Esquerra, dreta, i després la idea d'un peu. L'última petjada és freda. La Bramble s'estira sobre els taulons i mira de gairell, que és com les escoltes fan confessar els bassals.\n\nL'aigua de la petjada apunta, molt lleugerament, cap a una caixa marcada amb una estrella de guix.", [
		{
			id: "open-crate",
			label: "Obre la caixa de l'estrella"
		},
		{
			id: "harbormaster",
			label: "Explica-ho a la capitana del port"
		},
		{
			id: "cracked-bell",
			label: "Comprova la campana de passada"
		}
	], { moveTo: "pier" }),
	"salt-wharf:cracked-bell": beat("L'esquerda és vella. El batall és nou, embolicat amb tela de vela perquè no desperti tot el port. Dins la tela, un nus que en Holt coneix: feina de mariner, curosa, avergonyida d'ella mateixa.\n\nQui va amagar la carta no volia escàndol. Volia un retard.", [{
		id: "open-crate",
		label: "Troba la carta abans que s'acabi el retard"
	}, {
		id: "footprints",
		label: "Torna a les petjades"
	}], { moveTo: "warehouse" }),
	"salt-wharf:open-crate": beat("La caixa de l'estrella conté un abric de llana, una taronja i una clau de la torre de les cartes. Cap carta. Una nota amb lletra rodona: Sala de nit. No navegueu a les fosques sense el Far de l'Estella.\n\nLa clau és tèbia. La torre és dalt de l'escala que l'escrivent va fer veure que no esmentava.", [
		{
			id: "search-room",
			label: "Regira la sala de cartes"
		},
		{
			id: "read-note",
			label: "Llegeix la nota en veu alta"
		},
		{
			id: "telescope",
			label: "Gira el telescopi cap avall"
		},
		{
			id: "to-gate",
			label: "Porta la nota cap a la comporta"
		}
	], {
		nextSceneId: "night-chart",
		daypart: "Capvespre",
		clock: "21:40",
		weather: "Serè",
		sky: "CAPVESPRE · SERÈ",
		questTitle: "Adoba la costa",
		questDetail: "La sala de cartes té la resta de l'amabilitat, i el tros de costa que falta.",
		chronicleTitle: "Petjades que s'aturen",
		chronicleBody: "Una clau tèbia, una taronja i un avís de no navegar sense el far.",
		moveTo: "crates"
	}),
	"night-chart:search-room": beat("Regireu com la gent a qui han demanat que tingui cura amb el paper. La costa tallada no és a la taula. Pel telescopi, apuntat malament cap a un terrat, un tros pàl·lid es veu sota una teula com una llengua.\n\nEn Holt ja mesura la pujada amb els ulls i decideix agafar les escales.", [
		{
			id: "telescope",
			label: "Envia en Holt a buscar el tros"
		},
		{
			id: "read-note",
			label: "Llegeix primer la nota"
		},
		{
			id: "to-gate",
			label: "Porta el que tens a la comporta"
		}
	], { moveTo: "telescope" }),
	"night-chart:read-note": beat("La Vesper la llegeix sense afegir-hi trons. El fanaler del Far de l'Estella no ha tornat. El mariner va amagar la carta perquè l'Alosa hagués d'esperar. És una bona idea maldestra, que és la classe més comuna.\n\nLa costa encara s'ha de cosir. Un vaixell que espera també hauria de poder veure.", [{
		id: "telescope",
		label: "Ves a buscar la costa tallada"
	}, {
		id: "to-gate",
		label: "Porta la nota a la comporta"
	}], { moveTo: "desk" }),
	"night-chart:telescope": beat("El tros sota la teula és la mitja lluna de costa que falta, embolicada amb tela encerada i amb un clau al damunt perquè el vent no millorés el pla. El tall és net. Es pot adobar.\n\nA baix, al mur de mar, els fanals ja s'agrupen. La tripulació de l'Alosa enrotlla corda quan és nerviosa.", [{
		id: "to-gate",
		label: "Porta la costa a la comporta"
	}, {
		id: "read-note",
		label: "Porta també la nota"
	}], {
		moveTo: "telescope",
		chronicleTitle: "La costa sota una teula",
		chronicleBody: "La riba que faltava era amagada, no destruïda."
	}),
	"night-chart:to-gate": beat("El vent del matí us porta fins a la comporta. El mariner és al pati amb la cara de qui ha assajat una confessió i voldria saltar-se a la disculpa.\n\nA l'aigua, un esquif amb una vela remendada intenta arribar a temps.", [
		{
			id: "speak-crew",
			label: "Demana a la tripulació una marea més"
		},
		{
			id: "mend-chart",
			label: "Adoba la carta al carro"
		},
		{
			id: "light-signal",
			label: "Fes senyals al Far de l'Estella"
		},
		{
			id: "close-book",
			label: "Espera que la llum respongui"
		}
	], {
		nextSceneId: "tide-gate",
		daypart: "Matí",
		clock: "06:50",
		weather: "Vent",
		sky: "MATÍ · VENT",
		day: 2,
		questTitle: "Una marea de paciència",
		questDetail: "El fanaler gairebé és a port. Algú ha de demanar al vaixell que esperi, i dir-ho de debò.",
		chronicleTitle: "Cap a la comporta",
		chronicleBody: "La companyia porta una costa tallada i una bona raó a la comporta."
	}),
	"tide-gate:speak-crew": beat("En Calder no crida. Diu el nom del fanaler — el heu après tots, és a la nota — i diu una marea. La contramestra mira l'esquif, després la possibilitat d'una carta adobada, i escup, pensativa, a favor del vent.\n\n«Una marea», diu. «Digueu al vostre mariner que els nusos eren bons. El pla era podrit. Totes dues coses poden ser certes.»", [
		{
			id: "mend-chart",
			label: "Adoba la carta mentre esperen"
		},
		{
			id: "light-signal",
			label: "Encén el senyal"
		},
		{
			id: "close-book",
			label: "Que aquest sigui el final"
		}
	], { moveTo: "yard" }),
	"tide-gate:mend-chart": beat("Cola, pressió i un pes. La costa s'estira. La Bramble hi bufa com si fos sopa. La mitja lluna s'uneix tan bé que només qui busqués una cicatriu la trobaria.\n\nLa Vesper copeja el marge, on les cartes deixen lloc a l'honestedat, i escriu: una marea aguantada pel Far de l'Estella.", [{
		id: "light-signal",
		label: "Fes senyals al far"
	}, {
		id: "close-book",
		label: "Tanca el llibre amb una costa sencera"
	}], {
		moveTo: "cart",
		chronicleTitle: "Una costa tornada al seu lloc",
		chronicleBody: "La carta nocturna torna a ser sencera, amb una nota al marge sobre la paciència."
	}),
	"tide-gate:light-signal": beat("El fanal d'en Calder encaixa a la ranura de senyals com si la ranura hagués estat sola. Tres mostres lentes, el patró de la capitana del port per a «aguanteu». Una llumeta respon des de l'esquif, i després una de més forta des del cap quan el fanaler arriba a l'escala del Far de l'Estella i fa la seva feina.\n\nLa campana esquerdada del port sona igualment. Algú és feliç.", [{
		id: "close-book",
		label: "Mira la llum i tanca el llibre"
	}, {
		id: "mend-chart",
		label: "Acaba la carta si encara et necessita"
	}], { moveTo: "tower" }),
	"tide-gate:close-book": beat("L'Alosa espera una marea, que és un petit miracle fet de corda i bones maneres. El Far de l'Estella crema. Al mariner li fan cridar, el fan menjar i el tornen a posar al torn de guàrdia. La carta puja a bord amb la seva cicatriu i el seu marge honest.\n\nEl Port del Crepuscle conserva el seu vaixell, el seu fanaler i la seva història. Podeu tancar el llibre.", [endChoice], {
		endTale: true,
		questTitle: "La llum és encesa",
		questDetail: "El vaixell va esperar. La costa és sencera. El port fa soroll de bona manera.",
		chronicleTitle: "Una marea",
		chronicleBody: "Aguanten la porta, adoben la carta i miren com respon el Far de l'Estella."
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
	const name = playerName.trim() || "Viatger";
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
		beat: 0,
		level: 1,
		xp: 0,
		summary: "",
		finished: false,
		encounter: null,
		pendingRoll: null,
		edge: null,
		rests: 2,
		partner: ""
	};
}
/** Fill in anything an older save or a pasted code does not know about yet. */
function normalizeTale(raw) {
	const base = PARTY.map((p) => ({ ...p }));
	const party = (raw.party ?? base).map((c) => {
		const ref = base.find((b) => b.id === c.id);
		return ref ? {
			...ref,
			...c,
			abilities: c.abilities ?? ref.abilities,
			proficient: c.proficient ?? ref.proficient,
			attack: c.attack ?? ref.attack,
			voice: c.voice ?? ref.voice
		} : c;
	});
	return {
		...raw,
		party,
		level: raw.level ?? 1,
		xp: raw.xp ?? 0,
		summary: raw.summary ?? "",
		finished: raw.finished ?? false,
		encounter: raw.encounter ?? null,
		pendingRoll: raw.pendingRoll ?? null,
		edge: raw.edge ?? null,
		rests: raw.rests ?? 2,
		partner: raw.partner ?? "",
		inventory: (raw.inventory ?? []).map((item) => {
			const ref = INVENTORY.find((i) => i.id === item.id);
			return ref ? {
				...ref,
				uses: item.uses ?? ref.uses
			} : item;
		})
	};
}
function localGm(tale, action) {
	const key = action.choiceId ? `${tale.sceneId}:${action.choiceId}` : "";
	if (key && BOOK[key]) return BOOK[key];
	const scene = getScene(tale.campaignId, tale.sceneId);
	const actor = tale.party.find((p) => p.id === tale.activeId) ?? tale.party[0];
	const spot = findSpot(tale, action.text) ?? scene?.hotspots.find((h) => h.id === tale.positions[actor.id]);
	if (!scene || !spot) return beat(`${actor.name} espera. La taula és en silenci.`, choicesFor(tale.sceneId));
	if (action.roll || action.notes?.length) {
		const facts = (action.notes ?? []).join(" ");
		return beat(`${action.roll?.success ?? true ? `Compta. ${spot.examine}` : `Es resisteix, i els altres aturen l'entrebanc abans que sigui una ferida. ${spot.examine}`}\n\n${facts}`.trim(), choicesFor(tale.sceneId).slice(0, 4), { moveTo: spot.id });
	}
	if (action.choiceId === "open-chronicle") return beat(tale.narration, [endChoice]);
	return beat(`${actor.name} s'hi posa de debò. ${action.text.trim()} ${scene.ambient} ${spot.examine}`, choicesFor(tale.sceneId).slice(0, 3), { moveTo: spot.id });
}
function recap(tale, result, chronicleBody) {
	if (result.summary) return result.summary.slice(0, 600);
	const line = chronicleBody ?? result.narration.split("\n\n")[0];
	return `${tale.summary} ${line}`.trim().slice(-600);
}
function applyTale(tale, playerLine, result, mech) {
	const campaign = getCampaign(tale.campaignId);
	if (!campaign) return tale;
	let scene = getScene(tale.campaignId, tale.sceneId) ?? campaign.scenes[0];
	let sceneId = tale.sceneId;
	let chapter = tale.chapter;
	let positions = { ...tale.positions };
	const day = result.day ?? tale.day;
	let activeId = mech?.activeId ?? tale.activeId;
	let gained = mech?.xp ?? 0;
	const next = result.nextSceneId ? getScene(tale.campaignId, result.nextSceneId) : void 0;
	const travelled = Boolean(next && next.id !== scene.id);
	if (next && travelled) {
		scene = next;
		sceneId = next.id;
		chapter += 1;
		gained += 40;
		positions = {};
		tale.party.forEach((p, i) => {
			positions[p.id] = next.hotspots[i % next.hotspots.length].id;
		});
	} else if (result.moveTo && scene.hotspots.some((h) => h.id === result.moveTo)) positions[tale.activeId] = result.moveTo;
	const deltas = mech ? mech.heartDelta : (result.heartDelta ?? []).map((h) => ({
		id: h.id,
		delta: Math.max(-2, Math.min(2, h.delta))
	}));
	let party = tale.party.map((c) => {
		const delta = deltas.filter((h) => h.id === c.id).reduce((n, h) => n + h.delta, 0);
		const heart = Math.max(1, Math.min(c.heartMax, c.heart + delta));
		return heart === c.heart ? c : {
			...c,
			heart
		};
	});
	const finished = tale.finished || Boolean(result.endTale) || result.choices.every((c) => c.id === "open-chronicle");
	if (finished && !tale.finished) gained += 60;
	const grown = xpAfter(tale, gained);
	if (grown.leveled && grown.level <= MAX_LEVEL) {
		const steps = grown.level - tale.level;
		party = party.map((c) => ({
			...c,
			heartMax: c.heartMax + 3 * steps,
			heart: c.heart + 3 * steps
		}));
	}
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
	let encounter = mech && "encounter" in mech ? mech.encounter ?? null : tale.encounter;
	if (travelled) encounter = null;
	if (!party.some((p) => p.id === activeId)) activeId = party[0].id;
	let inventory = tale.inventory;
	if (mech?.consume) inventory = inventory.map((i) => i.id === mech.consume ? {
		...i,
		uses: (i.uses ?? 1) - 1
	} : i).filter((i) => i.uses === void 0 || i.uses > 0);
	let edge = tale.edge;
	if (mech?.edge) edge = mech.edge;
	else if (mech?.notes.some((n) => n.includes(" tira "))) edge = null;
	return {
		...tale,
		sceneId,
		chapter,
		day,
		daypart: result.daypart || (next ? next.daypart : tale.daypart),
		clock: result.clock || (next ? next.clock : tale.clock),
		weather: result.weather || (next ? next.weather : tale.weather),
		sky: result.sky || (next ? next.sky : tale.sky),
		activeId,
		party,
		positions,
		quest,
		chronicle,
		inventory,
		narration: result.narration,
		choices: result.choices.slice(0, 4),
		log,
		level: grown.level,
		xp: grown.xp,
		summary: recap(tale, result, result.chronicleBody),
		finished,
		encounter,
		pendingRoll: finished ? null : result.rollRequest ?? null,
		edge,
		rests: mech?.rest ? Math.max(0, tale.rests - 1) : tale.rests,
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
		return normalizeTale({
			...tale,
			id: uid(),
			updatedAt: Date.now()
		});
	} catch {
		return null;
	}
}
var KEY = "thornwake.v1";
function snapshot(patch = {}) {
	const s = useGame.getState();
	return {
		playerName: s.playerName,
		tales: s.tales,
		sound: s.sound,
		voice: s.voice,
		lang: s.lang,
		partner: s.partner,
		...patch
	};
}
function persist(slice) {
	try {
		localStorage.setItem(KEY, JSON.stringify(slice));
	} catch {}
}
var useGame = create((set, get) => ({
	screen: "gate",
	playerName: "Viatger",
	tales: [],
	taleId: null,
	worldIndex: -1,
	pickedId: null,
	mode: "move",
	storyOpen: true,
	modal: null,
	sound: false,
	voice: true,
	lang: "ca",
	partner: "",
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
		persist(snapshot({ sound }));
	},
	setVoice: (voice) => {
		set({ voice });
		persist(snapshot({ voice }));
	},
	setLang: (lang) => {
		set({ lang });
		persist(snapshot({ lang }));
	},
	setPartner: (value) => {
		const partner = value.slice(0, 24);
		set((s) => ({
			partner,
			tales: s.tales.map((t) => t.id === s.taleId ? {
				...t,
				partner
			} : t)
		}));
		persist(snapshot({ partner }));
	},
	setPending: (request) => {
		set((s) => ({ tales: s.tales.map((t) => t.id === s.taleId ? {
			...t,
			pendingRoll: request
		} : t) }));
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
		persist(snapshot({ playerName: name }));
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
				playerName: typeof data.playerName === "string" && data.playerName ? data.playerName : "Viatger",
				tales: data.tales.map(normalizeTale),
				sound: Boolean(data.sound),
				voice: data.voice !== false,
				lang: data.lang === "en" || data.lang === "es" ? data.lang : "ca",
				partner: typeof data.partner === "string" ? data.partner : ""
			});
		} catch {}
	},
	addTale: (tale) => {
		tale = {
			...tale,
			partner: tale.partner || get().partner
		};
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
		persist(snapshot({
			playerName: tale.playerName,
			tales
		}));
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
		persist(snapshot({ tales }));
	},
	commit: (id, line, result, toldBy, mech) => {
		const tales = get().tales.map((t) => t.id === id ? applyTale(t, line, result, mech) : t);
		set({
			tales,
			toldBy,
			writing: false,
			dice: null
		});
		persist(snapshot({ tales }));
	},
	setActive: (id) => {
		set((s) => ({ tales: s.tales.map((t) => t.id === s.taleId && !(t.encounter && t.encounter.order[t.encounter.turn] !== id) ? {
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
var Input$1 = object({
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
	}).optional(),
	facts: array(string().max(300)).max(10).optional(),
	summary: string().max(600).optional(),
	level: number().int().min(1).max(10).optional(),
	lang: _enum([
		"en",
		"ca",
		"es"
	]).default("ca"),
	partner: string().max(40).optional(),
	inventory: array(string().max(40)).max(20).optional(),
	heroLine: string().max(160).optional(),
	encounter: string().max(200).optional()
});
var consultStoryteller = createServerFn({ method: "POST" }).validator((input) => Input$1.parse(input)).handler(createSsrRpc("a3742cd4620cb4535adf58f82f1703136bc6cb142f4c94ad485f0a4121e9637e"));
var Input = object({
	text: string().min(1).max(1500),
	voice: _enum([
		"onyx",
		"nova",
		"shimmer",
		"echo",
		"fable",
		"alloy"
	]).default("fable")
});
/** Narration as audio. Any failure is soft: the browser voice takes over on the client. */
var narrateAloud = createServerFn({ method: "POST" }).validator((input) => Input.parse(input)).handler(createSsrRpc("c140a7ccb80857dcff13165823eab1f17c3dc57db2f8d87884fed2cdad3244b2"));
var BCP47 = {
	en: "en-US",
	ca: "ca-ES",
	es: "es-ES"
};
var current = null;
var ticket = 0;
var nanoDown = false;
var cache = /* @__PURE__ */ new Map();
function clean(text) {
	return text.replace(/\s+/g, " ").trim();
}
function stopSpeaking() {
	ticket += 1;
	if (current) {
		current.pause();
		current = null;
	}
	if (typeof speechSynthesis !== "undefined") speechSynthesis.cancel();
}
function browserSpeak(text, lang, onEnd) {
	if (typeof speechSynthesis === "undefined") {
		onEnd?.();
		return;
	}
	const utter = new SpeechSynthesisUtterance(text);
	utter.lang = BCP47[lang];
	utter.rate = .96;
	const match = speechSynthesis.getVoices().find((v) => v.lang.toLowerCase().startsWith(lang));
	if (match) utter.voice = match;
	utter.onend = () => onEnd?.();
	utter.onerror = () => onEnd?.();
	speechSynthesis.speak(utter);
}
/** Read narration aloud: NanoGPT voice first, the browser's own voice if that is unavailable. */
async function speak(raw, opts) {
	const text = clean(raw);
	if (!text) return;
	stopSpeaking();
	const mine = ticket;
	const key = `${opts.voice}|${text}`;
	let src = cache.get(key);
	if (!src && !nanoDown) try {
		const res = await narrateAloud({ data: {
			text: text.slice(0, 1500),
			voice: opts.voice
		} });
		if (res.ok) {
			src = res.audio;
			cache.set(key, src);
			if (cache.size > 24) cache.delete(cache.keys().next().value);
		} else nanoDown = true;
	} catch {
		nanoDown = true;
	}
	if (mine !== ticket) return;
	if (!src) {
		browserSpeak(text, opts.lang, opts.onEnd);
		return;
	}
	const audio = new Audio(src);
	current = audio;
	audio.onended = () => opts.onEnd?.();
	audio.onerror = () => {
		nanoDown = true;
		if (mine === ticket) browserSpeak(text, opts.lang, opts.onEnd);
	};
	try {
		await audio.play();
	} catch {
		if (mine === ticket) browserSpeak(text, opts.lang, opts.onEnd);
	}
}
function recognitionCtor() {
	if (typeof window === "undefined") return null;
	const w = window;
	return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}
function canListen() {
	return recognitionCtor() !== null;
}
/** Push-to-talk. Returns a stop function. `onText` gets interim text; `onFinal` the finished sentence. */
function listen(lang, handlers) {
	const Ctor = recognitionCtor();
	if (!Ctor) {
		handlers.onEnd();
		return () => {};
	}
	stopSpeaking();
	const rec = new Ctor();
	rec.lang = BCP47[lang];
	rec.interimResults = true;
	rec.continuous = false;
	let finalText = "";
	rec.onresult = (e) => {
		let interim = "";
		for (let i = 0; i < e.results.length; i += 1) {
			const part = e.results[i][0].transcript;
			if (e.results[i].isFinal) finalText += part;
			else interim += part;
		}
		handlers.onText((finalText + interim).trim());
	};
	rec.onerror = () => handlers.onEnd();
	rec.onend = () => {
		if (finalText.trim()) handlers.onFinal(finalText.trim());
		handlers.onEnd();
	};
	try {
		rec.start();
	} catch {
		handlers.onEnd();
	}
	return () => {
		try {
			rec.stop();
		} catch {}
	};
}
/** "I rolled 14", "un 14", "14!" → 14. Digits only; the recogniser writes numerals. */
function numberFromSpeech(text) {
	const m = text.match(/\b(\d{1,2})\b/);
	if (!m) return null;
	const n = Number(m[1]);
	return n >= 1 && n <= 20 ? n : null;
}
function encounterFacts(tale) {
	const enc = tale.encounter;
	if (!enc) return void 0;
	const turn = enc.order[enc.turn];
	const who = tale.party.find((p) => p.id === turn)?.name ?? "el problema";
	return `Problema a ${enc.name}, resolució ${enc.resolve}/${enc.resolveMax}, ronda ${enc.round}, torn: ${who}`;
}
/** Ask the storyteller (or the table book) what happens, then fold the result into the tale. */
async function perform(line, opts = {}) {
	const state = useGame.getState();
	const current = activeTale(state);
	if (!current || current.finished) return;
	if (state.writing && !opts.resume) return;
	if (opts.choiceId === "open-chronicle") {
		state.setModal("chronicle");
		return;
	}
	stopSpeaking();
	state.setWriting(true);
	if (!opts.rolled) state.setDice(null);
	const rolled = opts.rolled;
	const mech = opts.mech ?? (rolled ? checkMechanics(rolled) : void 0);
	const roll = rolled ? {
		label: rolled.label,
		total: rolled.roll + rolled.mod,
		dc: rolled.dc,
		success: rolled.success
	} : void 0;
	const local = localGm(current, {
		choiceId: opts.choiceId,
		text: line,
		roll,
		notes: mech?.notes
	});
	const actor = heroOf(current);
	try {
		const res = await consultStoryteller({ data: {
			campaignId: current.campaignId,
			sceneId: current.sceneId,
			playerName: current.playerName,
			partner: current.partner || void 0,
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
			roll,
			facts: mech?.notes,
			summary: current.summary || void 0,
			level: current.level,
			lang: state.lang,
			inventory: current.inventory.map((i) => i.name),
			heroLine: `${actor.name}, ${actor.role}, ${actor.heart}/${actor.heartMax} hearts`,
			encounter: encounterFacts(current)
		} });
		if (res.ok) state.commit(current.id, line, res.result, "live", mech);
		else state.commit(current.id, line, local, "book", mech);
	} catch {
		state.commit(current.id, line, local, "book", mech);
	}
}
/** Roll for a request (or accept a physical die), show it, then let the story answer. */
function rollFor(request, mode, physical) {
	const state = useGame.getState();
	const tale = activeTale(state);
	if (!tale || state.writing || tale.finished) return;
	const hero = heroOf(tale, request.heroId);
	const auto = autoMode(tale, hero);
	const label = `${hero.name} · ${ABILITY_NAMES[request.ability]} — ${request.reason}`;
	const show = makeCheck(tale, hero, request.ability, request.dc, label, mode ?? auto.mode, physical);
	state.setWriting(true);
	state.setPending(null);
	state.setDice(show);
	const mech = request.kind === "strike" ? strikeMechanics(tale, show) : checkMechanics(show);
	const line = request.line ?? `${hero.name} ho intenta: ${request.reason}.`;
	window.setTimeout(() => void perform(line, {
		rolled: show,
		mech,
		resume: true
	}), physical !== void 0 ? 400 : 1e3);
}
/** Free-form words from the table. If they sound uncertain, ask for a roll first. */
function say(text) {
	const state = useGame.getState();
	const tale = activeTale(state);
	if (!tale || state.writing || tale.finished) return;
	const hero = heroOf(tale);
	const line = `${hero.name}: ${text}`;
	const check = tale.encounter ? null : classifyAction(text);
	if (check) {
		state.setPending({
			...check,
			heroId: hero.id,
			line,
			kind: "check"
		});
		return;
	}
	perform(line);
}
function strikeAt(spot) {
	const state = useGame.getState();
	const tale = activeTale(state);
	if (!tale || state.writing || tale.finished) return;
	const hero = heroOf(tale);
	const enc = tale.encounter;
	if (!enc) {
		if (!spot.threat) {
			perform(`${hero.name} busca baralla a ${spot.name} i només hi troba el temps.`);
			return;
		}
		perform(`${hero.name} s'encara amb el problema de ${spot.name}.`, { mech: beginEncounter(tale, spot) });
		return;
	}
	if (spot.id !== enc.spotId) {
		perform(`${hero.name} mira ${spot.name}, però el problema és a ${enc.name}.`);
		return;
	}
	if (enc.order[enc.turn] !== hero.id) {
		const who = tale.party.find((p) => p.id === enc.order[enc.turn]);
		if (who) state.setActive(who.id);
		return;
	}
	state.setPending({
		heroId: hero.id,
		ability: hero.attack,
		dc: enc.guard,
		reason: `Fes recular el problema de ${spot.name}`,
		kind: "strike",
		line: `${hero.name} fa recular el problema de ${spot.name}.`
	});
}
function stepBack() {
	const state = useGame.getState();
	const tale = activeTale(state);
	if (!tale?.encounter || state.writing) return;
	perform(`${heroOf(tale).name} fa recular la companyia de ${tale.encounter.name}.`, { mech: {
		heartDelta: [],
		xp: 0,
		encounter: null,
		notes: [`La companyia es retira del problema de ${tale.encounter.name}. Ningú no queda ferit.`]
	} });
}
function restParty() {
	const state = useGame.getState();
	const tale = activeTale(state);
	if (!tale || state.writing || tale.finished || tale.encounter || tale.rests <= 0) return;
	perform("La companyia fa campament i descansa.", { mech: restMechanics(tale) });
}
function consumeItem(item) {
	const state = useGame.getState();
	const tale = activeTale(state);
	if (!tale || state.writing || tale.finished) return;
	const hero = heroOf(tale);
	const mech = itemMechanics(tale, item, hero) ?? void 0;
	perform(`${hero.name} fa servir ${item.name.toLowerCase()}. ${item.detail}`, { mech });
}
function onPlaceMove(spot, mode) {
	const tale = activeTale(useGame.getState());
	if (!tale) return;
	const hero = heroOf(tale);
	if (!getScene(tale.campaignId, tale.sceneId)) return;
	if (mode === "look") perform(`${hero.name} mira de prop ${spot.name}.`);
	else perform(`${hero.name} va a ${spot.name}.`);
}
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
				alt: "Un drac de bronze passant per una torre del castell al capvespre",
				className: "absolute inset-0 size-full object-cover"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-r from-ink/10 via-ink/20 to-ink/80" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-label": sound ? "Silencia la taula" : "Dona una mica de so a la taula",
				onClick: () => setSound(!sound),
				className: "absolute top-4 left-4 z-10 flex size-11 items-center justify-center rounded-full border border-gold/50 bg-ink/50 text-gold",
				children: sound ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "size-4" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "absolute bottom-4 left-4 z-10 hidden font-serif text-sm text-mist/80 sm:block",
				children: "La torre de ponent · al capvespre"
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
								children: "UN LLIBRE D'AVENTURES"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "gold-title mt-3 font-display text-4xl tracking-widest sm:text-5xl",
								children: "THORNWAKE"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 font-serif text-sm text-gold-bright/90",
								children: "La Campana d'Aiguaquieta"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "my-4 h-px w-16 bg-gold/40" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-serif text-lg text-parchment",
								children: "La teva taula t'espera."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 max-w-sm font-serif text-sm leading-relaxed text-mist",
								children: "Un joc de rol de taula amb una narradora d'IA que parla. Una companyia, tres contes, perill suau. Seu i tria, o tasta el conte del riu."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-6 flex w-full flex-col gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextButton, {
									tone: "solid",
									onClick: () => setScreen("select"),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center justify-center gap-2",
										children: ["Seu a la taula ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4" })]
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextButton, {
									onClick: () => {
										const { playerName, addTale } = useGame.getState();
										addTale(createTale("stillwater", playerName));
									},
									children: "Tasta un conte"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 font-sans text-xs leading-relaxed text-mist",
								children: "El tast obre Aiguaquieta. Qui vulgui pot seure; els contes es queden en aquest dispositiu."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 font-sans text-xs tracking-widest text-gold-dim",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "min-h-11",
									onClick: () => setModal("notes"),
									children: "NOTES DE LA TAULA"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "min-h-11",
									onClick: () => setModal("about"),
									children: "SOBRE EL JOC"
								})]
							})
						]
					})
				})
			})
		]
	});
}
function ownerName(tale, person) {
	return (person.id === "vesper" || person.id === "holt") && tale.partner ? tale.partner : tale.playerName;
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
	const voice = useGame((s) => s.voice);
	const setVoice = useGame((s) => s.setVoice);
	const lang = useGame((s) => s.lang);
	const [draft, setDraft] = (0, import_react.useState)("");
	const [levelUp, setLevelUp] = (0, import_react.useState)(null);
	const lastLevel = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (!tale) setScreen("select");
	}, [tale, setScreen]);
	const taleLevel = tale?.level;
	const taleKey = tale?.id;
	(0, import_react.useEffect)(() => {
		if (taleLevel === void 0) return;
		if (lastLevel.current !== null && taleLevel > lastLevel.current) {
			setLevelUp(taleLevel);
			const t = window.setTimeout(() => setLevelUp(null), 4500);
			lastLevel.current = taleLevel;
			return () => window.clearTimeout(t);
		}
		lastLevel.current = taleLevel;
	}, [taleLevel, taleKey]);
	(0, import_react.useEffect)(() => () => stopSpeaking(), []);
	if (!tale) return null;
	const scene = getScene(tale.campaignId, tale.sceneId);
	if (!scene) return null;
	const actor = tale.party.find((p) => p.id === tale.activeId) ?? tale.party[0];
	function onPlace(spot) {
		if (tale?.pendingRoll) return;
		if (mode === "strike") strikeAt(spot);
		else onPlaceMove(spot, mode);
	}
	function onDice() {
		if (!tale || writing || tale.pendingRoll || tale.finished) return;
		const hero = heroOf(tale);
		const best = Object.keys(hero.abilities).sort((x, y) => checkMod(hero, y, tale.level) - checkMod(hero, x, tale.level))[0];
		useGame.getState().setPending({
			heroId: hero.id,
			ability: best,
			dc: 12,
			reason: "Confiar en una bona mà",
			kind: "check",
			line: `${hero.name} pregunta als daus què guarda el moment.`
		});
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
							label: "Crònica",
							onClick: () => setModal("chronicle"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "size-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
							label: voice ? "Silencia la veu de la narradora" : "Deixa parlar la narradora",
							onClick: () => {
								if (voice) stopSpeaking();
								setVoice(!voice);
							},
							children: voice ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MicOff, { className: "size-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
							label: sound ? "Silencia la sala" : "So de la sala",
							onClick: () => setSound(!sound),
							children: sound ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "size-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setStoryOpen(!storyOpen),
							className: "hidden h-11 items-center border border-gold/50 px-3 font-serif text-sm text-parchment sm:flex",
							children: "La narradora"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
							label: "Surt de la taula",
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
							"Dia ",
							tale.day,
							" · ",
							tale.daypart
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-sans text-xs text-mist",
						children: [
							tale.clock,
							" · Nivell ",
							tale.level,
							tale.level < MAX_LEVEL ? ` · ${tale.xp}/${LEVEL_XP[tale.level]} XP` : " · al màxim"
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
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-sans text-xs text-mist",
										children: [person.role, tale.partner ? ` · ${ownerName(tale, person)}` : ""]
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
										" · Defensa ",
										person.guard,
										tale.edge === person.id ? " · avantatge" : ""
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
						children: "Veure el viatge"
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
					voice,
					lang,
					heroVoice: "fable",
					finished: tale.finished,
					blocked: Boolean(tale.pendingRoll),
					tale,
					onChoice: (id, label) => void perform(label, { choiceId: id }),
					onSend: (text) => {
						const line = (text ?? draft).trim();
						if (!line) return;
						setDraft("");
						say(line);
					},
					onClose: () => setStoryOpen(false)
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "z-30 mx-3 mb-2 lg:absolute lg:right-4 lg:bottom-28",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextButton, {
					onClick: () => setStoryOpen(true),
					children: "Obre la narradora"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "z-20 px-3 text-center font-sans text-xs text-mist lg:absolute lg:bottom-24 lg:left-1/2 lg:-translate-x-1/2",
				children: mode === "move" ? `Mou ${actor.name} · tria un lloc` : mode === "look" ? `Mira amb ${actor.name} · tria un lloc` : tale.encounter ? `Ataca amb ${actor.name} · fes recular el problema de ${tale.encounter.name}` : `Ataca amb ${actor.name} · tria un lloc tens`
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "sticky bottom-0 z-30 mt-auto flex justify-center px-2 py-3 lg:absolute lg:inset-x-0 lg:bottom-3 lg:mt-0",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex max-w-full gap-1 overflow-x-auto border border-gold/40 bg-ink/85 p-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Act, {
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footprints, { className: "size-4" }),
							label: "Mou",
							on: mode === "move",
							onClick: () => setMode("move")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Act, {
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sword, { className: "size-4" }),
							label: "Ataca",
							on: mode === "strike",
							onClick: () => setMode("strike")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Act, {
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-4" }),
							label: "Mira",
							on: mode === "look",
							onClick: () => setMode("look")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Act, {
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Backpack, { className: "size-4" }),
							label: "Motxilla",
							on: false,
							onClick: () => setModal("pack")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Act, {
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dices, { className: "size-4" }),
							label: "Daus",
							on: false,
							onClick: onDice
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Act, {
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "size-4" }),
							label: `Descans ${tale.rests}`,
							on: false,
							onClick: restParty,
							disabled: tale.rests <= 0 || Boolean(tale.encounter) || tale.finished || writing
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setModal("chronicle"),
							className: "flex h-16 w-28 shrink-0 flex-col items-center justify-center bg-ember px-2 text-center font-sans text-xs tracking-widest text-parchment",
							children: ["SEGUEIX", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "EL CONTE" })]
						})
					]
				})
			}),
			tale.encounter ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EncounterBar, { tale }) : null,
			tale.pendingRoll && !writing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RollPrompt, {
				tale,
				request: tale.pendingRoll,
				lang
			}, `${tale.pendingRoll.ability}-${tale.pendingRoll.reason}-${tale.beat}`) : null,
			dice ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "fixed bottom-28 left-1/2 z-40 w-72 -translate-x-1/2 border border-gold bg-ink/95 px-4 py-3 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-display text-4xl text-gold-bright",
						children: [dice.roll, dice.rolls.length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "ml-2 font-sans text-xs text-mist",
							children: [
								"(",
								dice.rolls.join(" / "),
								" · ",
								dice.mode === "advantage" ? "la millor" : "la pitjor",
								")"
							]
						}) : null]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-serif text-sm text-parchment",
						children: dice.label
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-sans text-xs text-mist",
						children: [
							dice.mod >= 0 ? "+" : "",
							dice.mod,
							" = ",
							dice.roll + dice.mod,
							" vs ",
							dice.dc,
							" ·",
							" ",
							dice.crit === "hit" ? "un 20 natural!" : dice.crit === "fumble" ? "un 1 natural" : dice.success ? "surt bé" : "s'escapa",
							dice.physical ? " · dau de la taula" : ""
						]
					})
				]
			}) : null,
			levelUp ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pointer-events-none fixed top-24 left-1/2 z-50 -translate-x-1/2 border border-gold-bright bg-ink/95 px-5 py-3 text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-display text-lg tracking-widest text-gold-bright",
					children: ["NIVELL ", levelUp]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-serif text-sm text-parchment",
					children: "La companyia creix. Cada cor arriba una mica més lluny."
				})]
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
function Act({ icon, label, on, onClick, disabled }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		"aria-pressed": on,
		disabled,
		onClick,
		className: `flex h-16 w-16 shrink-0 flex-col items-center justify-center gap-1 font-sans text-xs disabled:opacity-35 ${on ? "bg-gold/15 text-gold-bright" : "text-mist"}`,
		children: [icon, label]
	});
}
function EncounterBar({ tale }) {
	const enc = tale.encounter;
	if (!enc) return null;
	const turnId = enc.order[enc.turn];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "z-30 mx-3 mb-2 border border-ember/70 bg-ink/90 p-3 lg:absolute lg:top-36 lg:left-1/2 lg:mx-0 lg:w-80 lg:-translate-x-1/2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-baseline justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "font-serif text-sm text-parchment",
					children: ["Problema a ", enc.name]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "font-sans text-xs text-mist",
					children: ["Ronda ", enc.round]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "bar-track mt-2 block",
				"aria-label": `Resolució ${enc.resolve} de ${enc.resolveMax}`,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "bar-fill block",
					style: { width: `${enc.resolve / enc.resolveMax * 100}%` }
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "mt-2 flex flex-wrap gap-1",
				children: enc.order.map((id) => {
					const hero = tale.party.find((p) => p.id === id);
					const on = id === turnId;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: `px-2 py-1 font-sans text-xs ${on ? "bg-gold/25 text-gold-bright" : "text-mist"} border ${on ? "border-gold" : "border-gold/20"}`,
						children: hero ? hero.name : "Problema"
					}, id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "mt-2 min-h-11 font-sans text-xs tracking-widest text-gold",
				onClick: stepBack,
				children: "RETIRA'T"
			})
		]
	});
}
function RollPrompt({ tale, request, lang }) {
	const setPending = useGame((s) => s.setPending);
	const hero = heroOf(tale, request.heroId);
	const auto = autoMode(tale, hero);
	const [mode, setMode] = (0, import_react.useState)(auto.mode);
	const [num, setNum] = (0, import_react.useState)("");
	const [hearing, setHearing] = (0, import_react.useState)(false);
	const stop = (0, import_react.useRef)(null);
	const mod = checkMod(hero, request.ability, tale.level);
	const physical = Number(num);
	const validPhysical = Number.isInteger(physical) && physical >= 1 && physical <= 20;
	(0, import_react.useEffect)(() => () => stop.current?.(), []);
	const hear = () => {
		if (hearing) {
			stop.current?.();
			return;
		}
		setHearing(true);
		stop.current = listen(lang, {
			onText: () => {},
			onFinal: (t) => {
				const n = numberFromSpeech(t);
				if (n) rollFor(request, mode, n);
			},
			onEnd: () => setHearing(false)
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-x-3 bottom-24 z-40 mx-auto max-w-md border border-gold bg-ink/95 p-4 sm:bottom-28",
		role: "dialog",
		"aria-label": "Tirada",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-sans text-xs tracking-widest text-gold-dim",
				children: request.kind === "strike" ? "ATAC" : "ES DEMANEN ELS DAUS"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				className: "mt-1 font-serif text-lg text-parchment",
				children: [
					hero.name,
					" · ",
					ABILITY_NAMES[request.ability],
					" ",
					mod >= 0 ? "+" : "",
					mod,
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-mist",
						children: ["contra ", request.dc]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-serif text-sm text-mist",
				children: request.reason
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 grid grid-cols-3 gap-1",
				role: "group",
				"aria-label": "Com cau el dau",
				children: [
					["normal", "Normal"],
					["advantage", "Avantatge"],
					["disadvantage", "Desavantatge"]
				].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-pressed": mode === id,
					onClick: () => setMode(id),
					className: `min-h-11 border px-1 font-sans text-xs ${mode === id ? "border-gold bg-gold/15 text-gold-bright" : "border-gold/25 text-mist"}`,
					children: label
				}, id))
			}),
			auto.why ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 font-sans text-xs text-gold-dim",
				children: [
					"Suggeriment: avantatge, ",
					auto.why,
					"."
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextButton, {
					tone: "ember",
					onClick: () => rollFor(request, mode),
					children: "Tira per mi"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-3 flex gap-2",
				onSubmit: (e) => {
					e.preventDefault();
					if (validPhysical) rollFor(request, mode, physical);
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: num,
						onChange: (e) => setNum(e.target.value.replace(/\D/g, "").slice(0, 2)),
						inputMode: "numeric",
						placeholder: "O el d20 de la taula",
						"aria-label": "El número del dau de la taula",
						className: "h-11 min-w-0 flex-1 border border-gold/40 bg-ink/40 px-2 font-serif text-sm text-parchment outline-none"
					}),
					canListen() ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: hear,
						"aria-label": hearing ? "Deixa d'escoltar" : "Digues el número",
						"aria-pressed": hearing,
						className: `flex size-11 items-center justify-center border ${hearing ? "border-gold-bright text-gold-bright" : "border-gold/40 text-gold"}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: "size-4" })
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						disabled: !validPhysical,
						className: "min-h-11 border border-gold/70 bg-gold/10 px-3 font-sans text-xs tracking-widest text-gold-bright disabled:opacity-40",
						children: "USA"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "mt-2 min-h-11 font-sans text-xs tracking-widest text-mist",
				onClick: () => setPending(null),
				children: "DEIXA-HO"
			})
		]
	});
}
function EndCard({ tale }) {
	const setModal = useGame((s) => s.setModal);
	const setScreen = useGame((s) => s.setScreen);
	const addTale = useGame((s) => s.addTale);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-4 pb-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "border border-gold-dim/50 bg-parchment-deep/50 p-3 text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-sm tracking-widest text-gold-dim",
				children: "EL CONTE ÉS CONTAT"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 font-serif text-sm text-soot",
				children: [
					"Dia ",
					tale.day,
					" · Nivell ",
					tale.level,
					" · ",
					tale.xp,
					" XP · ",
					tale.chronicle.length,
					" pàgines a la crònica"
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-2 grid gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setModal("chronicle"),
					className: "min-h-11 border border-gold-dim/60 bg-parchment-deep/60 px-3 font-serif text-sm text-soot",
					children: "Llegeix la crònica"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => addTale(createTale(tale.campaignId, tale.playerName)),
					className: "min-h-11 border border-gold-dim/60 px-3 font-serif text-sm text-soot",
					children: "Torna a jugar aquest conte"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setScreen("select"),
					className: "min-h-11 border border-gold-dim/60 px-3 font-serif text-sm text-soot",
					children: "Tria un altre conte"
				})
			]
		})]
	});
}
function StoryPanel({ narration, choices, writing, toldBy, draft, setDraft, onChoice, onSend, onClose, voice, lang, heroVoice, finished, blocked, tale }) {
	const [count, setCount] = (0, import_react.useState)(narration.length);
	const [skip, setSkip] = (0, import_react.useState)(true);
	const [hearing, setHearing] = (0, import_react.useState)(false);
	const stopListen = (0, import_react.useRef)(null);
	const spoken = (0, import_react.useRef)("");
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
	(0, import_react.useEffect)(() => {
		if (!voice || writing || spoken.current === narration) return;
		spoken.current = narration;
		speak(narration, {
			voice: heroVoice,
			lang
		});
	}, [
		voice,
		writing,
		narration,
		heroVoice,
		lang
	]);
	(0, import_react.useEffect)(() => () => {
		stopListen.current?.();
	}, []);
	const done = !writing && count >= narration.length;
	const body = narration.slice(0, count);
	const canTalk = canListen();
	const talk = () => {
		if (hearing) {
			stopListen.current?.();
			return;
		}
		setHearing(true);
		stopListen.current = listen(lang, {
			onText: setDraft,
			onFinal: (text) => {
				setDraft("");
				onSend(text);
			},
			onEnd: () => setHearing(false)
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Ornate, {
		variant: "light",
		className: "story-panel flex flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between px-4 pt-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-sans text-xs tracking-widest text-gold-dim",
					children: "LA NARRADORA"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "min-h-11 px-2 text-soot",
						"aria-label": "Torna-ho a escoltar",
						onClick: () => void speak(narration, {
							voice: heroVoice,
							lang
						}),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "size-4" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "min-h-11 px-2 text-soot lg:hidden",
						onClick: onClose,
						"aria-label": "Amaga la narradora",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "scroll-thin flex-1 overflow-y-auto px-4 py-3",
				children: [writing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "flex items-center gap-2 font-serif text-soot",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Feather, { className: "size-4" }), " Escrivint el conte…"]
				}) : body.split("\n\n").map((para, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-3 font-serif text-sm leading-relaxed text-soot",
					children: para
				}, i)), toldBy === "book" && done ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-sans text-xs text-gold-dim",
					children: "Contat des del llibre de la taula."
				}) : null]
			}),
			!writing && !done ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "px-4 pb-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "ml-auto block min-h-11 border border-gold-dim/40 px-3 font-sans text-xs text-soot",
					onClick: () => setSkip(true),
					children: "Salta la narració"
				})
			}) : null,
			done && finished ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EndCard, { tale }) : null,
			done && !finished && !blocked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
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
			done && blocked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "px-4 pb-2 font-serif text-sm text-soot",
				children: "Els daus esperen a la taula."
			}) : null,
			!finished ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "flex gap-2 border-t border-gold-dim/30 p-3",
				onSubmit: (e) => {
					e.preventDefault();
					if (!writing && !blocked) onSend();
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: draft,
						onChange: (e) => setDraft(e.target.value),
						placeholder: hearing ? "Escoltant…" : "Què fa la companyia?",
						maxLength: 400,
						className: "h-11 min-w-0 flex-1 border border-gold-dim/40 bg-parchment/40 px-2 font-serif text-sm text-soot outline-none"
					}),
					canTalk ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: talk,
						disabled: writing || blocked,
						"aria-pressed": hearing,
						"aria-label": hearing ? "Deixa d'escoltar" : "Digues la teva acció",
						className: `flex size-11 items-center justify-center border disabled:opacity-40 ${hearing ? "border-ember bg-ember/20 text-ember" : "border-gold-dim/50 text-soot"}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: "size-4" })
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						disabled: writing || blocked || !draft.trim(),
						className: "flex size-11 items-center justify-center bg-ember text-parchment disabled:opacity-40",
						"aria-label": "Envia",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "size-4" })
					})
				]
			}) : null
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
				alt: focused ? focused.scenes[0].name : "La taula d'una narradora amb un mapa, daus i miniatures",
				className: "absolute inset-0 size-full object-cover"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-l from-ink via-ink/55 to-ink/10" }),
			focused ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => setWorld(-1),
				className: "absolute top-4 left-1/2 z-10 -translate-x-1/2 border border-gold/50 bg-parchment px-4 py-2 font-sans text-xs tracking-widest text-soot",
				children: "TOTS ELS MONS"
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-label": "Món anterior",
				onClick: () => cycle(-1),
				className: "absolute top-1/2 left-3 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-gold/60 bg-ink/60 text-gold sm:left-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-label": "Món següent",
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
								children: "Tria la teva aventura"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-center font-serif text-sm leading-relaxed text-mist",
								children: picked ? picked.blurb : "Tres contes reposen a la taula. Tria'n un per veure'l de més a prop."
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
											picked ? `Comença ${picked.name}` : "Tria un conte",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mark, { className: "size-4" })
										]
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 grid grid-cols-2 gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextButton, {
									onClick: () => setModal("saves"),
									children: "Totes les partides"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextButton, {
									onClick: () => setModal("join"),
									children: "Continua un conte"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 flex flex-wrap justify-center gap-x-3 gap-y-1 text-center font-sans text-xs tracking-widest text-gold-dim",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "min-h-11",
										onClick: () => cycle(1),
										children: "MIRA LA TAULA"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "min-h-11",
										onClick: () => setModal("about"),
										children: "SOBRE AQUEST MÓN"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "min-h-11",
										onClick: () => setModal("settings"),
										children: "AJUSTOS"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "min-h-11",
										onClick: () => setModal("notes"),
										children: "NOTES DE LA TAULA"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "min-h-11",
										onClick: () => setScreen("gate"),
										children: "SURT DE LA TAULA"
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
							"aria-label": "Tanca",
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
		case "about": return "Sobre aquest món";
		case "notes": return "Notes de la taula";
		case "settings": return "Ajustos";
		case "saves": return "Totes les partides";
		case "join": return "Continua un conte";
		case "pack": return "La motxilla";
		case "chronicle": return "La teva crònica";
		default: return "";
	}
}
function About() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3 font-serif text-sm leading-relaxed text-mist",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Thornwake és una taula per a aventures en família. Jugueu una companyia de quatre — Calder, Bramble, Vesper i Holt — a través de tres contes originals, dos jugadors i una narradora que parla." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Una narradora d'IA seu al capdavant quan la taula pot arribar-hi. Si no, el llibre escrit pren el relleu i el capítol segueix avançant. Perill suau, sense sang, i a aquesta taula no es mor ningú." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Els contes són El Correu de Pinassa, La Campana d'Aiguaquieta i Port del Crepuscle. Cap no és la masmorra de ningú altre." })
		]
	});
}
function Notes() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
		className: "space-y-3 font-serif text-sm leading-relaxed text-mist",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Dos jugadors comparteixen la taula: un porta en Calder i la Bramble, l'altre la Vesper i en Holt. L'app és la narradora." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Digueu o escriviu què fa la companyia. Quan és incert, la narradora demana una tirada: feu servir el dau de l'app o un d20 real de la taula, escrit o dit en veu alta." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Avantatge si un company és al costat o un objecte et dóna avantatge. Un 20 natural sempre reïx, un 1 natural sempre falla." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Ataca un lloc tens per començar un problema. Tireu iniciativa, feu torns i feu recular el problema fins que es calmi." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "No es mor ningú. Un heroi amb 1 cor és retirat pels altres. Descanseu dues vegades per conte i feu servir el pastís de mel o l'embenat per curar." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Els contes es queden en aquest navegador. Compartiu un codi de conte per continuar en un altre dispositiu." })
		]
	});
}
function Settings() {
	const playerName = useGame((s) => s.playerName);
	const setName = useGame((s) => s.setName);
	const partner = useGame((s) => s.partner);
	const setPartner = useGame((s) => s.setPartner);
	const sound = useGame((s) => s.sound);
	const setSound = useGame((s) => s.setSound);
	const voice = useGame((s) => s.voice);
	const setVoice = useGame((s) => s.setVoice);
	const input = "mt-2 h-11 w-full border border-gold/40 bg-ink/40 px-3 font-serif text-base text-parchment outline-none";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "block font-sans text-xs tracking-widest text-mist",
				children: ["PRIMER JUGADOR · CALDER I BRAMBLE", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: playerName,
					onChange: (e) => setName(e.target.value),
					maxLength: 24,
					className: input
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "block font-sans text-xs tracking-widest text-mist",
				children: ["SEGON JUGADOR · VESPER I HOLT (OPCIONAL)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: partner,
					onChange: (e) => setPartner(e.target.value),
					maxLength: 24,
					className: input
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextButton, {
				tone: voice ? "solid" : "ghost",
				onClick: () => setVoice(!voice),
				children: voice ? "La narradora parla en veu alta" : "La narradora és en silenci"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextButton, {
				tone: sound ? "solid" : "ghost",
				onClick: () => setSound(!sound),
				children: sound ? "So de la sala activat" : "So de la sala desactivat"
			})
		]
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
		children: "Encara no hi ha cap conte. Tria'n un i comença."
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
						children: campaign?.name ?? "Un conte"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-sans text-xs text-mist",
						children: [
							t.playerName,
							t.partner ? ` & ${t.partner}` : "",
							" · Dia ",
							t.day,
							" · Nivell ",
							t.level,
							t.finished ? " · Acabat" : "",
							" · ",
							new Date(t.updatedAt).toLocaleString("ca-ES")
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 grid grid-cols-2 gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextButton, {
							tone: "solid",
							onClick: () => {
								openTale(t.id);
							},
							children: "Continua"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextButton, {
							onClick: () => {
								if (armed === t.id) {
									retireTale(t.id);
									setArmed(null);
								} else setArmed(t.id);
							},
							children: armed === t.id ? "Confirma" : "Retira"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "mt-2 min-h-11 font-sans text-xs tracking-widest text-gold",
						onClick: () => {
							sessionStorage.setItem("thornwake-share", encodeTale(t));
							setModal("join");
						},
						children: "Comparteix el codi del conte"
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
				children: "Enganxa un codi de conte d'una altra taula, o copia'n un de les teves partides per passar-lo. No es puja res enlloc."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
				value: code,
				onChange: (e) => setCode(e.target.value),
				rows: 5,
				className: "w-full border border-gold/40 bg-ink/40 p-3 font-sans text-xs text-parchment outline-none",
				placeholder: "Codi del conte"
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
							setError("Aquest codi no s'obre. Comprova que s'hagi copiat tota la línia.");
							return;
						}
						sessionStorage.removeItem("thornwake-share");
						addTale(tale);
					},
					children: "Seu"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextButton, {
					onClick: () => {
						if (!code) return;
						navigator.clipboard?.writeText(code);
					},
					children: "Copia"
				})]
			})
		]
	});
}
function Pack() {
	const tale = useGame(activeTale);
	const setModal = useGame((s) => s.setModal);
	if (!tale) return null;
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
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-sans text-xs text-gold-dim",
						children: [
							owner?.name,
							item.uses ? ` · en queden ${item.uses}` : "",
							item.effect === "edge" ? " · dóna avantatge" : ""
						]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "min-h-11 shrink-0 px-2 font-sans text-xs tracking-widest text-gold",
					onClick: () => {
						setModal(null);
						consumeItem(item);
					},
					children: "Usa"
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
				["read", "Llegeix"],
				["scenes", "Escenes"],
				["finds", "Descobertes"]
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
				"Dia ",
				tale.day,
				" de la teva aventura · ",
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
							" · Dia ",
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
						children: seen ? "Visitada" : "Encara no"
					})] })]
				}, scene.id);
			})
		}) : null,
		tab === "finds" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3 font-serif text-sm text-soot",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-sans text-xs tracking-widest text-gold-dim",
					children: "ARA"
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
var SplitComponent = Thornwake;
//#endregion
export { SplitComponent as component };
