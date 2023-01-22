import { NPCData } from './settings';

export interface DefaultNPCOptions {
  ClassBarbarian: boolean;
  ClassBard: boolean;
  ClassCleric: boolean;
  ClassDruid: boolean;
  ClassFighter: boolean;
  ClassMonk: boolean;
  ClassPaladin: boolean;
  ClassRanger: boolean;
  ClassRogue: boolean;
  ClassSorcerer: boolean;
  ClassWarlock: boolean;
  ClassWizard: boolean;
  GenderFemale: boolean;
  GenderMale: boolean;
  'GenderNon-Binary': boolean;
  OrientationAsexual: boolean;
  OrientationBisexual: boolean;
  OrientationHeterosexual: boolean;
  OrientationHomosexual: boolean;
  ProfessionEntertainer: boolean;
  ProfessionLearned: boolean;
  'ProfessionLesser Nobility': boolean;
  ProfessionMartial: boolean;
  ProfessionProfessional: boolean;
  ProfessionUnderclass: boolean;
  'ProfessionWorking Class': boolean;
  RaceDragonborn: boolean;
  RaceDwarf: boolean;
  RaceElf: boolean;
  RaceGnome: boolean;
  'RaceHalf-Elf': boolean;
  'RaceHalf-Orc': boolean;
  RaceHalfling: boolean;
  RaceHuman: boolean;
  RaceTiefling: boolean;
  RelationshipStatusDivorced: boolean;
  'RelationshipStatusIn a relationship': boolean;
  RelationshipStatusMarried: boolean;
  'RelationshipStatusMarried and having an affair': boolean;
  'RelationshipStatusRecently broken up': boolean;
  'RelationshipStatusRecently divorced': boolean;
  'RelationshipStatusRecently widowed': boolean;
  'RelationshipStatusSeeing someone who is married': boolean;
  RelationshipStatusSingle: boolean;
  RelationshipStatusWidowed: boolean;
  'TraitBad Traits': boolean;
  'TraitGood Traits': boolean;
  level: number;
  createFoolishNumber: boolean;
}

type NPCOptionIndex = keyof DefaultNPCOptions;

type NPCClassKey =
  | 'Barbarian'
  | 'Bard'
  | 'Cleric'
  | 'Druid'
  | 'Fighter'
  | 'Monk'
  | 'Paladin'
  | 'Ranger'
  | 'Rogue'
  | 'Sorcerer'
  | 'Warlock'
  | 'Wizard';

type NPCSubclassKey =
  | 'Beserker'
  | 'College of Lore'
  | 'Life'
  | 'Circle of the Land'
  | 'Champion'
  | 'Way of the Open Hand'
  | 'Oath of Devotion'
  | 'Hunter'
  | 'Thief'
  | 'Draconic Bloodline'
  | 'The Fiend'
  | 'School of Evocation';

type Proficiencies = {
  Armor?: string[];
  Weapons?: string[];
  Tools?: string[];
  'Saving Throws'?: string[];
  Skills?: string[];
};

type NPCClassValue = {
  source: string;
  hp?: string;
  proficiencies?: Proficiencies;
  subclasses?: {
    [index in NPCSubclassKey]: {
      source: string;
      hp?: string;
      'Saving Throws': string[];
      Skills?: string[];
      proficiencies?: Proficiencies;
    };
  };
  attributeSortOrder?: string[];
};

export type ClassJSON = {
  [index in NPCClassKey]: NPCClassValue;
};

export type ListJSON = {
  Skills: SkillsList;
  Abilities: AbilityKey[];
  Sizes: Sizes;
};

export type LanguagesJSON = [];

type NamesIndex = 'First' | 'Last';

type NPCGender = 'Male' | 'Female';

type NPCRace = 'Human' | 'Dwarf' | 'Elf' | 'Halfling' | 'Dragonborn' | 'Gnome' | 'Half-Elf' | 'Half-Orc' | 'Tiefling';

type NPCRaceIndex = NPCRace | 'All';

export type NamesJSON = {
  First: {
    [index in NPCGender]: {
      [index in NPCRaceIndex]: string[];
    };
  };
  Last: {
    [index in NPCRaceIndex]: string[];
  };
};

type TraitsIndex = 'Good Traits' | 'Bad Traits';

export type TraitsJSON = {
  [index in TraitsIndex]: string[];
};

type ProfessionIndex =
  | 'All'
  | 'Learned'
  | 'Lesser Nobility'
  | 'Professional'
  | 'Working Class'
  | 'Martial'
  | 'Underclass'
  | 'Entertainer';

type PlotHookIndex = ProfessionIndex | 'All';

export type PlotHooksJSON = {
  [index in PlotHookIndex]: string[];
};

export type ProfessionsJSON = {
  [index in ProfessionIndex]: string[];
};

type AbilityBonusKey = 'Any' | 'Choice' | AbilityKey;

type AnyAbilityBonus = {
  [index in AbilityBonusKey]: number;
};

type NPCRaceValue = {
  source: string;
  age: number;
  abilityBonus: {
    [index in AbilityBonusKey]?: number | AnyAbilityBonus[];
  };
  languages: Partial<LanguagesJSON>;
  height: {
    size: Partial<Sizes>;
    base: number;
    mod: string;
  };
  weight: {
    base: number;
    mod: string;
  };
  speed: number;
};

export type RacesJSON = {
  [index in NPCRace]: NPCRaceValue;
};

export type SexJSON = {
  Orientation: string[];
  Gender: string[];
  'Relationship Status': string[];
};

type AbilityKey = 'Str' | 'Dex' | 'Con' | 'Int' | 'Wis' | 'Cha';
type AbilityValue = {
  value: number;
  proficient: number;
};

type NPCAbilities = {
  [index in AbilityKey]: AbilityValue;
};

type NPCAbilityKey = 'genStr' | 'genDex' | 'genCon' | 'genInt' | 'genWis' | 'genCha';
type NPCAbilityModKey = 'genStrMod' | 'genDexMod' | 'genConMod' | 'genIntMod' | 'genWisMod' | 'genChaMod';

type SkillIndex =
  | 'Acrobatics'
  | 'Animal Handling'
  | 'Arcana'
  | 'Athletics'
  | 'Deception'
  | 'History'
  | 'Insight'
  | 'Intimidation'
  | 'Investigation'
  | 'Medicine'
  | 'Nature'
  | 'Perception'
  | 'Performance'
  | 'Persuasion'
  | 'Religion'
  | 'Sleight of Hand'
  | 'Stealth'
  | 'Survival';

type SkillsList = {
  [index in SkillIndex]: string;
};

type NPCSkillIndex = keyof NPCSkills;

type NPCSkillValue = {
  dc?: number;
  mod?: number;
  proficient: number;
  save?: number;
  saveBonus?: number;
};

type NPCSkills = {
  StrIndex?: NPCSkillValue;
};

type SizeIndex = 'Tiny' | 'Small' | 'Medium' | 'Large' | 'Huge' | 'Gargantuan';
type Sizes = {
  [index in SizeIndex]: string;
};

export type NPCObjectIndex = keyof NPCObject;
export type NPCObject = NPCData & {
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
  genGender: number;
  genRelationship: string;
  genOrientation: string;
  genRace: string;
  genAge: string;
  genLanguages: string;
  genHeight: string;
  genWeight: string;
  genSpeed: string;
  genProfession: string;
  genPlotHook: string;
  genTraits: string;
  genClass: string;
  genHp: string;
  genProficiencies: string;
  genSaveThrows: string;
  genSkills: string;
  genSubclass: string;
  level: string;
  genFirstName: string;
  genLastName: string;
  genIcon: string;
};
