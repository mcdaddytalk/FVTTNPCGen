import ace from 'ace-builds';

export interface NPCGenFormApplicationOptions extends FormApplicationOptions {
  settings: NPCGenSettings | string;
}

export interface NPCGenData {
  settings: NPCGenSettings | string;
}

type StrIndex<TValue> = {
  [key: string]: TValue;
};

type NumIndex<TValue> = {
  [key: number]: TValue;
};

type ImageLocationIndex = keyof ImageLocations;

type ImageLocations = {
  StrIndex: string[];
};

type WeightsIndex = keyof Weights;

type Weights = {
  StrIndex: object | boolean | number | string | string[];
};

export interface NPCGenSettings {
  disabledBoxes: string[];
  weights: Weights;
  imageLocations: ImageLocations;
  classesJSON: string;
  languagesJSON: string;
  namesJSON: string;
  traitsJSON: string;
  plothooksJSON: string;
  professionsJSON: string;
  racesJSON: string;
  sexJSON: string;
  listJSON: string;
  onlyClassesJSON: boolean;
  onlyLanguagesJSON: boolean;
  onlyNamesJSON: boolean;
  onlyTraitsJSON: boolean;
  onlyPlothooksJSON: boolean;
  onlyProfessionsJSON: boolean;
  onlyRacesJSON: boolean;
  onlySexJSON: boolean;
  onlyListJSON: boolean;
  compatMode: boolean;
}

export type NPCEditor = {
  classesJSON: ace.Ace.Editor | undefined;
  languagesJSON: ace.Ace.Editor | undefined;
  namesJSON: ace.Ace.Editor | undefined;
  traitsJSON: ace.Ace.Editor | undefined;
  plothooksJSON: ace.Ace.Editor | undefined;
  professionsJSON: ace.Ace.Editor | undefined;
  racesJSON: ace.Ace.Editor | undefined;
  sexJSON: ace.Ace.Editor | undefined;
  listJSON: ace.Ace.Editor | undefined;
};

export type NPCEditorData = Pick<
  NPCGenSettings,
  | 'onlyClassesJSON'
  | 'onlyLanguagesJSON'
  | 'onlyNamesJSON'
  | 'onlyTraitsJSON'
  | 'onlyPlothooksJSON'
  | 'onlyProfessionsJSON'
  | 'onlyRacesJSON'
  | 'onlySexJSON'
  | 'onlyListJSON'
>;

export interface SettingConfig {
  restricted: boolean;
}

export interface ImgLocSettingsAppFormOptions extends FormApplicationOptions {
  races: string[];
  genders: string[];
  classes: string[];
}

export interface ImgLocSettingsData {
  races: string[];
  genders: string[];
  classes: string[];
  settings: ImageLocations;
  roleSpecific: string;
}

export interface NPCApplicationOptions extends FormApplicationOptions {
  settings: NPCGenSettings | string;
}

export interface NPCData {
  classes: string[];
  personalityTraits: string[];
  plotHooks: string[];
  professions: string[];
  races: string[];
  orientation: string[];
  gender: string[];
  relationshipStatus: string[];
  useSubclass: boolean;
  useMinMaxStats: boolean;

  genStr: string;
  genDex: string;
  genCon: string;
  genInt: string;
  genWis: string;
  genCha: string;

  genStrMod: number;
  genDexMod: number;
  genConMod: number;
  genIntMod: number;
  genWisMod: number;
  genChaMod: number;

  genGender: string;
  genRelationship: string;
  genOrientation: string;

  genRace: string;
  genAge: string;
  genLanguages: string[];
  genHeight: string;
  genWeight: string;
  genSpeed: string;
  genProfession: string;
  genPlotHook: string;
  genTraits: string[];

  genClass: string;
  genHp: string;
  genProficiencies: string[];
  genSaveThrows: string[];
  genSkills: string[];
  genSubclass: string;

  level: number;

  genFirstName: string;
  genLastName: string;

  genIcon: string;

  disabledBoxes: string[];
  weights: Weights;
}
