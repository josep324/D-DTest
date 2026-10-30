export type Choice = { id: string; label: string; hint?: string };

export type Ability = "str" | "dex" | "con" | "int" | "wis" | "cha";
export type RollMode = "normal" | "advantage" | "disadvantage";

export type Weapon = { name: string; dice: string; ability: Ability };

export type Character = {
  id: string;
  name: string;
  role: string;
  heart: number;
  heartMax: number;
  guard: number;
  abilities: Record<Ability, number>;
  proficient: Ability[];
  attack: Ability;
  voice: string;
  weapon: Weapon;
  /** Unconscious at 0 hearts: makes death saves instead of acting. */
  down?: boolean;
  saves?: { ok: number; fail: number };
  /** Only in hardcore: three failed saves. */
  fallen?: boolean;
  portrait: string;
  cameo?: "vesper" | "holt";
};

/** A roll the player has to make to try something. Every word is authored, nothing is improvised. */
export type Check = {
  ability: Ability;
  dc: number;
  reason: string;
  success: string;
  fail: string;
  /** Raised on success so doors stay open and clues stay found. */
  flag?: string;
  xp?: number;
  onFail?: "fight";
  /** Hearts lost by whoever fails it (a fall, a cold river). */
  hurt?: number;
  /** On an exit: passing the roll also walks the company through. */
  go?: boolean;
  /** Other ways to do it ("force the door" vs "pick the lock"), picked by what the player says. */
  alts?: { keywords: string[]; ability: Ability; dc: number; reason: string }[];
};

export type FoeDef = {
  name: string;
  hp: number;
  ac: number;
  atk: number;
  dmg: string;
  xp: number;
  count?: number;
  /** "la rata gegant": how the narrator names it mid-sentence. */
  the?: string;
  /** Attacks as soon as the company walks in. */
  ambush?: boolean;
};

export type Topic = {
  keywords: string[];
  say: string;
  flag?: string;
  /** Only available once this flag (or any of "a|b") is up. */
  requires?: string;
  ends?: boolean;
  xp?: number;
};

export type Hotspot = {
  id: string;
  name: string;
  x: number;
  y: number;
  examine: string;
  threat?: boolean;
  /** Module rooms only. */
  kind?: "feature" | "npc" | "exit" | "foe" | "item";
  keywords?: string[];
  check?: Check;
  to?: string;
  requires?: { flag: string; hint: string };
  talk?: Topic[];
  foe?: FoeDef;
  itemId?: string;
  /** Raised when an item is picked up. */
  flag?: string;
};

export type Scene = {
  id: string;
  name: string;
  image: string;
  daypart: string;
  clock: string;
  weather: string;
  sky: string;
  ambient: string;
  hotspots: Hotspot[];
  opening: string;
  /** Said instead of the opening when the company comes back (module tales). */
  back?: string;
  quest: { title: string; detail: string };
  choices: Choice[];
  chronicleTitle: string;
};

export type GuideStep = {
  id: string;
  title: string;
  /** What to do, in plain words. */
  text: string;
  /** A sentence that does it, offered as a button. */
  phrase: string;
  /** Flag (or "a|b") that says the step is done. */
  done: string;
  /** Hotspot to light up while the step is current. */
  target?: string;
};

export type Campaign = {
  id: string;
  name: string;
  blurb: string;
  chapters: string;
  levels: string;
  span: string;
  scenes: Scene[];
  canon: string;
  /** A coach for first-time players: the next thing to try, how to say it and where to look. */
  guide?: GuideStep[];
  /** "module" tales are played by free action against authored rooms, not by picking choices. */
  kind?: "story" | "module";
  mission?: string;
  items?: Item[];
};

export type Item = {
  id: string;
  name: string;
  detail: string;
  ownerId: string;
  effect?: "heal" | "edge";
  amount?: number;
  uses?: number;
};

export type RollRequest = {
  heroId?: string;
  ability: Ability;
  dc: number;
  reason: string;
  kind?: "check" | "strike" | "attack";
  /** The player's own words, kept so the storyteller answers them once the dice are down. */
  line?: string;
  /** Hotspot (check) or foe id (attack) this roll is for. */
  target?: string;
};

export type FoeState = {
  id: string;
  spotId: string;
  name: string;
  hp: number;
  hpMax: number;
  ac: number;
  atk: number;
  dmg: string;
  xp: number;
  the: string;
};

export type Fight = {
  foes: FoeState[];
  order: string[];
  turn: number;
  round: number;
};

export type Encounter = {
  spotId: string;
  name: string;
  resolve: number;
  resolveMax: number;
  guard: number;
  bite: number;
  order: string[];
  turn: number;
  round: number;
};

export type ChronicleEntry = {
  id: string;
  day: number;
  title: string;
  body: string;
  sceneName: string;
  campaignName: string;
  image: string;
};

export type LogLine = { role: "you" | "gm"; text: string };

export type Tale = {
  id: string;
  playerName: string;
  campaignId: string;
  sceneId: string;
  chapter: number;
  day: number;
  daypart: string;
  clock: string;
  weather: string;
  sky: string;
  activeId: string;
  party: Character[];
  positions: Record<string, string>;
  quest: { title: string; detail: string };
  inventory: Item[];
  chronicle: ChronicleEntry[];
  narration: string;
  choices: Choice[];
  log: LogLine[];
  updatedAt: number;
  beat: number;
  level: number;
  xp: number;
  summary: string;
  finished: boolean;
  encounter: Encounter | null;
  pendingRoll: RollRequest | null;
  edge: string | null;
  rests: number;
  partner: string;
  flags: string[];
  fight: Fight | null;
  hardcore: boolean;
};

/** Everything the rules decided this turn, before the storyteller dresses it in words. */
export type Mechanics = {
  heartDelta: { id: string; delta: number }[];
  xp: number;
  encounter?: Encounter | null;
  activeId?: string;
  edge?: string | null;
  consume?: string;
  rest?: boolean;
  notes: string[];
  flags?: string[];
  fight?: Fight | null;
  give?: Item;
  heroPatch?: Record<string, Partial<Character>>;
  /** The company was beaten and is carried back to the start. */
  routed?: boolean;
};

export type GmResult = {
  narration: string;
  choices: Choice[];
  questTitle?: string;
  questDetail?: string;
  heartDelta?: { id: string; delta: number }[];
  chronicleTitle?: string;
  chronicleBody?: string;
  moveTo?: string;
  nextSceneId?: string;
  daypart?: string;
  weather?: string;
  sky?: string;
  clock?: string;
  day?: number;
  summary?: string;
  rollRequest?: RollRequest;
  endTale?: boolean;
};

export type DiceShow = {
  who: string;
  heroId: string;
  label: string;
  ability: Ability;
  mode: RollMode;
  rolls: number[];
  roll: number;
  mod: number;
  dc: number;
  success: boolean;
  crit: "hit" | "fumble" | null;
  physical: boolean;
};
