export type Choice = { id: string; label: string; hint?: string };

export type Ability = "str" | "dex" | "con" | "int" | "wis" | "cha";
export type RollMode = "normal" | "advantage" | "disadvantage";

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
  portrait: string;
  cameo?: "vesper" | "holt";
};

export type Hotspot = {
  id: string;
  name: string;
  x: number;
  y: number;
  examine: string;
  threat?: boolean;
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
  quest: { title: string; detail: string };
  choices: Choice[];
  chronicleTitle: string;
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
  kind?: "check" | "strike";
  /** The player's own words, kept so the storyteller answers them once the dice are down. */
  line?: string;
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
