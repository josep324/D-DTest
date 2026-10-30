export type Choice = { id: string; label: string; hint?: string };

export type Character = {
  id: string;
  name: string;
  role: string;
  heart: number;
  heartMax: number;
  guard: number;
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

export type Item = { id: string; name: string; detail: string; ownerId: string };

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
};

export type DiceShow = {
  who: string;
  label: string;
  roll: number;
  mod: number;
  dc: number;
  success: boolean;
};
