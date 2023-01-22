import { pick, sample, has, difference, filter } from 'underscore';
import merge from 'lodash-es/merge';
import ImageLocationSettings from './imageLocationSettings.js';
import { FVTTNPCGen } from './FVTTNPCGen.js';
import {
  AbilityKey,
  ClassJSON,
  ListJSON,
  LanguagesJSON,
  TraitsJSON,
  PlotHooksJSON,
  ProfessionsJSON,
  RacesJSON,
  NamesJSON,
  NPCAbilities,
  SexJSON,
  NPCObject,
  ProfessionIndex,
  PlotHookIndex,
  TraitsIndex,
  NPCClassKey,
  NPCRace,
  NPCAbilityModKey,
  AnyAbilityBonus,
  AbilityBonusKey,
  NPCSubclassKey,
  NPCGender,
  NPCRaceIndex,
  NPCAbilityKey,
  NPCSkillIndex,
  SizeIndex,
  NPCSkills,
  SkillIndex,
  NPCObjectIndex,
} from '../lib/augments/generatorObject.js';
import {
  ImageLocationIndex,
  ImageLocations,
  ImgLocSettingsAppFormOptions,
  NPCApplicationOptions,
  NPCData,
  Weights,
  WeightsIndex,
} from '../lib/augments/settings.js';

export default class NPCGenerator extends FormApplication<NPCApplicationOptions, NPCData> {
  jsonOptions;
  done = false;

  classesJSON: ClassJSON;
  languagesJSON: LanguagesJSON;
  namesJSON: NamesJSON;
  personalityTraitsJSON: TraitsJSON;
  plotHooksJSON: PlotHooksJSON;
  professionsJSON: ProfessionsJSON;
  racesJSON: RacesJSON;
  sexJSON: SexJSON;
  listJSON: ListJSON;

  /* -------------< Input Data >--------------- */
  classes;
  personalityTraits;
  plotHooks;
  professions;
  races;
  orientation;
  gender;
  relationshipStatus;
  skillList;
  abilityList;
  languages;
  useSubclass = false;
  useMinMaxStats = false;
  disabledBoxes = FVTTNPCGen.getSetting<string[]>(FVTTNPCGen.SETTINGS.DISABLED_BOXES);
  weights = FVTTNPCGen.getSetting<Weights>(FVTTNPCGen.SETTINGS.WEIGHTS);

  /* -------------< Generator Data >--------------- */

  // ability score
  genStr = '';
  genDex = '';
  genCon = '';
  genInt = '';
  genWis = '';
  genCha = '';

  genStrMod = 0;
  genDexMod = 0;
  genConMod = 0;
  genIntMod = 0;
  genWisMod = 0;
  genChaMod = 0;

  // relationship
  genGender = '';
  genRelationship = '';
  genOrientation = '';

  // race
  genRace = '';
  genAge = '';
  genLanguages: string[] = [];
  genHeight = '';
  genWeight = '';
  genSpeed = '';

  // profession
  genProfession = '';

  // plothook
  genPlotHook = '';

  // traits
  genTraits: string[] = [];

  // class
  genClass = '';
  genHp = '';
  genProficiencies: string[] = [];
  genSaveThrows: string[] = [];
  genSkills: string[] = [];
  genSubclass = 'None';

  // level
  level = 1;

  // name
  genFirstName = 'First Name';
  genLastName = 'Last Name';

  // icon
  genIcon = 'icons/svg/mystery-man.svg';

  constructor(
    jsonOptions = {
      classesJSON: {},
      languagesJSON: [],
      namesJSON: {},
      personalityTraitsJSON: {},
      plotHooksJSON: {},
      professionsJSON: {},
      racesJSON: {},
      sexJSON: {},
      listJSON: {},
    },
  ) {
    super({}, {});

    this.jsonOptions = jsonOptions;

    this.done = false;

    this.generateNPC = this.generateNPC.bind(this);
    this._apiSave = this._apiSave.bind(this);

    /* -------------< Combine with user JSON if enabled >--------------- */

    if (FVTTNPCGen.getSetting<boolean>(FVTTNPCGen.SETTINGS.ONLY_JSON.CLASSES)) {
      this.classesJSON = JSON.parse(FVTTNPCGen.getSetting<string>(FVTTNPCGen.SETTINGS.JSON.CLASSES));
    } else {
      this.classesJSON = merge(
        this.jsonOptions.classesJSON,
        JSON.parse(FVTTNPCGen.getSetting<string>(FVTTNPCGen.SETTINGS.JSON.CLASSES)),
      );
    }

    if (FVTTNPCGen.getSetting<boolean>(FVTTNPCGen.SETTINGS.ONLY_JSON.LANGUAGES)) {
      this.languagesJSON = JSON.parse(FVTTNPCGen.getSetting<string>(FVTTNPCGen.SETTINGS.JSON.LANGUAGES));
    } else {
      this.languagesJSON = merge(
        this.jsonOptions.languagesJSON,
        JSON.parse(FVTTNPCGen.getSetting<string>(FVTTNPCGen.SETTINGS.JSON.LANGUAGES)),
      );
    }

    if (FVTTNPCGen.getSetting<boolean>(FVTTNPCGen.SETTINGS.ONLY_JSON.NAMES)) {
      this.namesJSON = JSON.parse(FVTTNPCGen.getSetting<string>(FVTTNPCGen.SETTINGS.JSON.NAMES));
    } else {
      this.namesJSON = merge(
        this.jsonOptions.namesJSON,
        JSON.parse(FVTTNPCGen.getSetting<string>(FVTTNPCGen.SETTINGS.JSON.NAMES)),
      );
    }

    if (FVTTNPCGen.getSetting<boolean>(FVTTNPCGen.SETTINGS.ONLY_JSON.TRAITS)) {
      this.personalityTraitsJSON = JSON.parse(FVTTNPCGen.getSetting<string>(FVTTNPCGen.SETTINGS.JSON.TRAITS));
    } else {
      this.personalityTraitsJSON = merge(
        this.jsonOptions.personalityTraitsJSON,
        JSON.parse(FVTTNPCGen.getSetting<string>(FVTTNPCGen.SETTINGS.JSON.TRAITS)),
      );
    }

    if (FVTTNPCGen.getSetting<boolean>(FVTTNPCGen.SETTINGS.ONLY_JSON.PLOTHOOKS)) {
      this.plotHooksJSON = JSON.parse(FVTTNPCGen.getSetting<string>(FVTTNPCGen.SETTINGS.JSON.PLOTHOOKS));
    } else {
      this.plotHooksJSON = merge(
        this.jsonOptions.plotHooksJSON,
        JSON.parse(FVTTNPCGen.getSetting<string>(FVTTNPCGen.SETTINGS.JSON.PLOTHOOKS)),
      );
    }

    if (FVTTNPCGen.getSetting<boolean>(FVTTNPCGen.SETTINGS.ONLY_JSON.PROFESSIONS)) {
      this.professionsJSON = JSON.parse(FVTTNPCGen.getSetting<string>(FVTTNPCGen.SETTINGS.JSON.PROFESSIONS));
    } else {
      this.professionsJSON = merge(
        this.jsonOptions.professionsJSON,
        JSON.parse(FVTTNPCGen.getSetting<string>(FVTTNPCGen.SETTINGS.JSON.PROFESSIONS)),
      );
    }

    if (FVTTNPCGen.getSetting<boolean>(FVTTNPCGen.SETTINGS.ONLY_JSON.RACES)) {
      this.racesJSON = JSON.parse(FVTTNPCGen.getSetting<string>(FVTTNPCGen.SETTINGS.JSON.RACES));
    } else {
      this.racesJSON = merge(
        this.jsonOptions.racesJSON,
        JSON.parse(FVTTNPCGen.getSetting<string>(FVTTNPCGen.SETTINGS.JSON.RACES)),
      );
    }

    if (FVTTNPCGen.getSetting<boolean>(FVTTNPCGen.SETTINGS.ONLY_JSON.SEX)) {
      this.sexJSON = JSON.parse(FVTTNPCGen.getSetting<string>(FVTTNPCGen.SETTINGS.JSON.SEX));
    } else {
      this.sexJSON = merge(
        this.jsonOptions.sexJSON,
        JSON.parse(FVTTNPCGen.getSetting<string>(FVTTNPCGen.SETTINGS.JSON.SEX)),
      );
    }

    this.listJSON = merge(
      this.jsonOptions.listJSON,
      JSON.parse(FVTTNPCGen.getSetting<string>(FVTTNPCGen.SETTINGS.JSON.LIST)),
    );

    /* -------------< Input Data >--------------- */

    this.classes = Object.keys(this.classesJSON);

    this.personalityTraits = Object.keys(this.personalityTraitsJSON);

    this.plotHooks = Object.keys(this.plotHooksJSON);

    this.professions = Object.keys(this.professionsJSON);

    this.races = Object.keys(this.racesJSON);

    this.orientation = this.sexJSON['Orientation'];

    this.gender = this.sexJSON['Gender'];

    this.relationshipStatus = this.sexJSON['Relationship Status'];

    this.skillList = Object.keys(this.listJSON.Skills);

    this.abilityList = this.listJSON.Abilities;
    this.languages = this.languagesJSON;

    this.useSubclass = false;

    this.useMinMaxStats = false;

    this.disabledBoxes = FVTTNPCGen.getSetting<string[]>(FVTTNPCGen.SETTINGS.DISABLED_BOXES);

    this.weights = FVTTNPCGen.getSetting<Weights>(FVTTNPCGen.SETTINGS.WEIGHTS);

    /* -------------< New Races? >--------------- */

    window.npcGen.globalRacesList = this.races;

    /* -------------< Generator Data >--------------- */

    // ability score
    this.genStr = '';
    this.genDex = '';
    this.genCon = '';
    this.genInt = '';
    this.genWis = '';
    this.genCha = '';

    this.genStrMod = 0;
    this.genDexMod = 0;
    this.genConMod = 0;
    this.genIntMod = 0;
    this.genWisMod = 0;
    this.genChaMod = 0;

    // relationship
    this.genGender = '';
    this.genRelationship = '';
    this.genOrientation = '';

    // race
    this.genRace = '';
    this.genAge = '';
    this.genLanguages = [];
    this.genHeight = '';
    this.genWeight = '';
    this.genSpeed = '';

    // profession
    this.genProfession = '';

    // plothook
    this.genPlotHook = '';

    // traits
    this.genTraits = [];

    // class
    this.genClass = '';
    this.genHp = '';
    this.genProficiencies = [];
    this.genSaveThrows = [];
    this.genSkills = [];
    this.genSubclass = 'None';

    // level
    this.level = 1;

    // name
    this.genFirstName = 'First Name';
    this.genLastName = 'Last Name';

    // icon
    this.genIcon = 'icons/svg/mystery-man.svg';
  }

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      id: 'npcgenerator-menu',
      title: 'NPC Generator',
      template: FVTTNPCGen.TEMPLATES.GENERATOR,
      classes: ['sheet'],
      closeOnSubmit: false,
      resizable: true,
      width: 1205,
    });
  }

  /**
   * Default Options for this FormApplication
   */
  getData(options: Partial<NPCApplicationOptions> | undefined): NPCData {
    const data = super.getData(options) as NPCData;

    // I hate this, but it works

    /* -------------< Input Data >--------------- */

    data.classes = this.classes;
    data.personalityTraits = this.personalityTraits;
    data.plotHooks = this.plotHooks;
    data.professions = this.professions;
    data.races = this.races;
    data.orientation = this.orientation;
    data.gender = this.gender;
    data.relationshipStatus = this.relationshipStatus;
    data.useSubclass = this.useSubclass;
    data.useMinMaxStats = this.useMinMaxStats;

    /* -------------< Generator Data >--------------- */

    // ability score
    data.genStr = this.genStr;
    data.genDex = this.genDex;
    data.genCon = this.genCon;
    data.genInt = this.genInt;
    data.genWis = this.genWis;
    data.genCha = this.genCha;

    data.genStrMod = this.genStrMod;
    data.genDexMod = this.genDexMod;
    data.genConMod = this.genConMod;
    data.genIntMod = this.genIntMod;
    data.genWisMod = this.genWisMod;
    data.genChaMod = this.genChaMod;

    // relationship
    data.genGender = this.genGender;
    data.genRelationship = this.genRelationship;
    data.genOrientation = this.genOrientation;

    // race
    data.genRace = this.genRace;
    data.genAge = this.genAge;
    data.genLanguages = this.genLanguages;
    data.genHeight = this.genHeight;
    data.genWeight = this.genWeight;
    data.genSpeed = this.genSpeed;

    // profession
    data.genProfession = this.genProfession;

    // plothook
    data.genPlotHook = this.genPlotHook;

    // traits
    data.genTraits = this.genTraits;

    // class
    data.genClass = this.genClass;
    data.genHp = this.genHp;
    data.genProficiencies = this.genProficiencies;
    data.genSaveThrows = this.genSaveThrows;
    data.genSkills = this.genSkills;
    data.genSubclass = this.genSubclass;

    // level
    data.level = this.level;

    // name
    data.genFirstName = this.genFirstName;
    data.genLastName = this.genLastName;

    // icon
    data.genIcon = this.genIcon;

    /* -------------< disabled boxes >--------------- */

    data.disabledBoxes = this.disabledBoxes;

    /* -------------< weights >--------------- */

    data.weights = this.weights;

    return data;
  }

  /**
   * Executes on form submission.
   * @param {Event} _e - the form submission event
   * @param {Object} d - the form data
   *
   *  'name': entry.metadata.label+' ['+entry.metadata.package+']',
   *  'type':'pack',
   *  'submenu':submenu.toLowerCase(),
   *  'key':entry.metadata.package+'.'+entry.metadata.name
   */
  async _updateObject(_e: Event, d: NPCObject) {
    console.info(
      '%cINFO | Entries in npc generator:',
      'color: #fff; background-color: #444; padding: 2px 4px; border-radius: 2px;',
      removeGenFromObj(d),
    );
    if (!this.done) {
      this.updateFormValues(d);
      this.generateNPC(d);
    } else {
      this.saveNPC(d);
    }
  }

  activateListeners(html: JQuery<HTMLElement>) {
    super.activateListeners(html);

    html.find('.npc-generator-header').on('click', (e) => {
      const panel = e.currentTarget.nextElementSibling as HTMLElement;
      const indicator = e.currentTarget.querySelector('.indicator') as HTMLElement;
      if (panel?.style.display !== 'none') {
        panel.style.display = 'none';
        indicator.innerText = '+';
      } else {
        panel.style.display = 'block';
        indicator.innerText = '-';
      }
    });

    html.find(".npc-generator-bottom-button[name='cancel']").on('click', (e: JQuery.ClickEvent) => {
      e.preventDefault();
      this.close();
    });

    html.find(".npc-generator-bottom-button[name='generate']").on('click', (e: JQuery.ClickEvent) => {
      e.preventDefault();
      jQuery(e.target.form).trigger('submit');
    });

    html.find(".npc-generator-bottom-button[name='accept']").on('click', (e: JQuery.ClickEvent) => {
      e.preventDefault();
      this.done = true;
      jQuery(e.target.form).trigger('submit');
      this.close();
    });

    html
      .find('.npc-generator-big-box')
      .find('input')
      .each((_, e) => {
        jQuery(e).on('input', (e) => {
          if (e.originalEvent?.target) {
            const { target } = e.originalEvent;
            (target as HTMLInputElement).size = (target as HTMLInputElement).value.length * 1.05 + 1;
          }
        });
        e.size = e.value.length * 1.05 + 1;
      });

    html.find('.npc-generator-box.header input[type="text"]').each((_, e) => {
      jQuery(e).on('input', (e) => {
        if (e.originalEvent?.target) {
          const { target } = e.originalEvent;
          (target as HTMLInputElement).size = (target as HTMLInputElement).value.length * 1.15 + 1.5;
        }
      });
      (e as HTMLInputElement).size = (e as HTMLInputElement).value.length * 1.15 + 1.5;
    });

    html
      .find('.npc-generator-big-box')
      .find('textarea')
      .each(function () {
        setTimeout(() => {
          this.style.height = 'auto';
          this.style.height = this.scrollHeight - 18 + 'px';
        }, 50);
      })
      .on('input', function () {
        this.style.height = 'auto';
        this.style.height = this.scrollHeight - 18 + 'px';
      });
  }

  setupInput(d: NPCObject) {
    const genders = this.getEnabledValues(d, 'Gender');
    /** @type {String[]} */
    const gendersOut: string[] = [];
    genders.forEach((gender) => {
      for (let i = 0; i < (this.getProbValue(d, 'Gender', gender) || 1); i++) {
        gendersOut.push(gender);
      }
    });

    const traits = this.getEnabledValues(d, 'Trait');
    /** @type {String[]} */
    const traitsOut: string[] = [];
    traits.forEach((trait) => {
      traitsOut.push(trait);
    });

    const professions = this.getEnabledValues(d, 'Profession');
    /** @type {String[]} */
    const professionsOut: string[] = [];
    professions.forEach((profession) => {
      for (let i = 0; i < (this.getProbValue(d, 'Profession', profession) || 1); i++) {
        professionsOut.push(profession);
      }
    });

    const relationshipStatus = this.getEnabledValues(d, 'RelationshipStatus');
    /** @type {String[]} */
    const relationshipStatusOut: string[] = [];
    relationshipStatus.forEach((relationshipStatus) => {
      for (let i = 0; i < (this.getProbValue(d, 'RelationshipStatus', relationshipStatus) || 1); i++) {
        relationshipStatusOut.push(relationshipStatus);
      }
    });

    const orientations = this.getEnabledValues(d, 'Orientation');
    /** @type {String[]} */
    const orientationsOut: string[] = [];
    orientations.forEach((orientation) => {
      for (let i = 0; i < (this.getProbValue(d, 'Orientation', orientation) || 1); i++) {
        orientationsOut.push(orientation);
      }
    });

    const races = this.getEnabledValues(d, 'Race', 'NameForced');
    /** @type {String[]} */
    const racesOut: string[] = [];
    races.forEach((race) => {
      for (let i = 0; i < (this.getProbValue(d, 'Race', race) || 1); i++) {
        racesOut.push(race);
      }
    });

    const classes = this.getEnabledValues(d, 'Class');
    /** @type {String[]} */
    const classesOut: string[] = [];
    classes.forEach((klass) => {
      for (let i = 0; i < (this.getProbValue(d, 'Class', klass) || 1); i++) {
        classesOut.push(klass);
      }
    });

    const returnvalue = [
      gendersOut,
      traitsOut,
      professionsOut,
      relationshipStatusOut,
      orientationsOut,
      racesOut,
      classesOut,
    ];

    console.log(returnvalue);

    return returnvalue;
  }

  /**
   * generates info on npc
   * @param  {Object} d
   */
  async generateNPC(d: NPCObject) {
    this.resetValues();

    const [genders, traits, professions, relationshipStatus, orientations, races, classes] = this.setupInput(d);

    // Gender
    this.generateGender(genders);

    // Traits
    this.generateTraits(d, traits);

    // Profession
    const professionArea = this.generateProfession(professions);

    // Relationship Status
    this.generateRelationship(relationshipStatus);

    // Sexual Orientation
    this.generateOrientation(orientations);

    // Main Race
    this.generateMainRace(races);

    // Main Class
    this.generateMainClass(classes);

    // Plothook
    this.generatePlothook(professionArea);

    // Level

    this.generateLevel(d);

    // proficiencies
    this.generateProficiencies();

    // saving throws
    this.generateSavingThrows();

    // skills
    this.generateSkills();

    // Race info
    // age
    this.generateAge();

    // languages
    this.generateLanguages();

    // height
    const heightMod = this.generateHeight();

    // weight
    this.generateWeight(heightMod);

    // speed
    this.generateSpeed();

    // Ability Scores
    // modifiers
    this.generateAbilityModifiers();

    // total
    this.generateAbilityTotals(d);

    // Class info
    // hp
    this.generateHp();

    // Sub Class
    this.generateSubclass(d);

    // First Name
    this.generateFirstName();

    // Last Name
    this.generateLastName();

    await this.generateIcon(this.genRace, this.genGender, this.genClass);

    this.render();
  }

  /**
   * saves npc to actor
   * @param {Object} d
   * @param {boolean} [isApi=false]
   */
  async saveNPC(d: NPCObject, isApi = false) {
    // set abilities
    const abilities = this.getAbilities(d);

    // set biography
    const biography = this.getBiography(d);

    // set skills
    const [skills, classSkills] = this.getSkills(d);

    // set class
    const classItem = this.getClassItem(d, classSkills as string[]);

    console.log(classItem);

    const actorOptions = this.getActorOptions(d, abilities, biography, skills as NPCSkills, classItem);

    if (!game.settings.get(FVTTNPCGen.ID, 'compatMode')) {
      actorOptions.type = 'npc';
      actorOptions.data.details.race = d.genRace;
      actorOptions.data.details.biography.value =
        `<p>${game.i18n.localize('npcGen.proficiencies')}: ` +
        d.genProficiencies.trim().slice(0, -1).replace(/\r?\n/g, ', ') +
        '\n</p>' +
        '<p>&nbsp;\n</p>' +
        `<p>${game.i18n.localize('npcGen.profession')}: ${d.genProfession}</p>\n` +
        biography;
    }

    if (!isApi) {
      const actor = await Actor.create(actorOptions); // CONFIG.Actor.documentClass.create(foundry.utils.deepClone(actorOptions));
      if (actor) actor.sheet?.render(true);
    } else {
      return actorOptions;
    }
  }

  /**
   * @param {String} race
   * @param {String} gender
   * @param {String} Class
   */
  async generateIcon(race: string, gender: string, Class: string): Promise<string | void> {
    const defaultReturn = 'icons/svg/mystery-man.svg';

    const locations = FVTTNPCGen.getSetting<ImageLocations>(FVTTNPCGen.SETTINGS.IMAGE_LOCATIONS);
    const path =
      locations?.[
        (FVTTNPCGen.getSetting<string>('roleSpecificImages') &&
        locations?.[(race + gender + Class) as ImageLocationIndex]?.length > 0
          ? race + gender + Class
          : race + gender) as ImageLocationIndex
      ];
    if (!path || path.length === 0) return defaultReturn;

    const regex =
      locations?.[
        (FVTTNPCGen.getSetting<string>('roleSpecificImages') &&
        locations?.[(race + gender + Class + 'Regex') as ImageLocationIndex]?.length > 0
          ? race + gender + Class + 'Regex'
          : race + gender + 'Regex') as ImageLocationIndex
      ];

    let iconList: string[] = [];

    try {
      const fileObject = await FilePicker.browse('public', path[0]);

      if (fileObject.target && fileObject.target !== '.') {
        iconList = iconList.concat(await this._getIcons(fileObject, 'public', regex[0]));
      }
    } catch {}

    try {
      const fileObject = await FilePicker.browse('data', path[0]);

      if (fileObject.target && fileObject.target !== '.') {
        iconList = iconList.concat(await this._getIcons(fileObject, 'data', regex[0]));
      }
    } catch {}

    if (iconList.length === 0) return defaultReturn;

    this.genIcon = sample(iconList) || '';

    return;
  }

  /**
   * @param {Object} fileObject
   * @param {String} source
   * @param {String?} regex
   */
  async _getIcons(fileObject: FilePicker.BrowseResult, source: string, regex?: string) {
    /** @type {String[]} */
    let iconList: string[] = [];

    /** @type {String[]} */
    const files = fileObject?.files;
    if (Array.isArray(files)) {
      if (regex?.length) {
        iconList = iconList.concat(files.filter((file) => new RegExp(regex).test(file)));
      } else {
        iconList = iconList.concat(files);
      }
    }

    const folderList: string[] = fileObject?.dirs;
    if (Array.isArray(folderList)) {
      await asyncForEach(folderList, async (folderPath: string) => {
        const newFileObject = await FilePicker.browse(source as FilePicker.SourceType, folderPath);
        const folderContent = await this._getIcons(newFileObject, source);

        if (regex?.length) {
          iconList = iconList.concat(folderContent.filter((file) => new RegExp(regex).test(file)));
        } else {
          iconList = iconList.concat(folderContent);
        }
      });
    }

    return iconList;
  }

  /**
   * @param {String[]} genders
   */
  generateGender(genders: string[]) {
    if (genders.length != 0) {
      this.genGender = sample(genders) || 'Male';
    }
  }

  /**
   * @param {Object} d
   * @param {String[]} traits
   */
  generateTraits(d: NPCObject, traits: string[]): void {
    if (traits.length != 0) {
      let traitList: string[] = [];
      traits.forEach((type) => {
        traitList = traitList.concat(
          sample(this.personalityTraitsJSON[type as TraitsIndex], this.getProbValue(d, 'Trait', type)),
        );
      });
      traitList.forEach((trait, index) => {
        traitList[index] = '•' + trait;
      });
      this.genTraits = traitList;
    }
  }

  /**
   * @param {String[]} professions
   */
  generateProfession(professions: string[]) {
    let professionArea = '';
    if (professions.length != 0) {
      professionArea = sample(professions) || 'Professional';
      this.genProfession = sample(this.professionsJSON[professionArea as ProfessionIndex]) || 'Merchant';
    }
    return professionArea;
  }

  /**
   * @param {String[]} relationshipStatus
   */
  generateRelationship(relationshipStatus: string[]) {
    if (relationshipStatus.length != 0) {
      this.genRelationship = sample(relationshipStatus) || 'Single';
    }
  }

  /**
   * @param {String[]} orientations
   */
  generateOrientation(orientations: string[]) {
    if (orientations.length != 0) {
      this.genOrientation = sample(orientations) || 'Heterosexual';
    }
  }

  /**
   * @param {String[]} races
   */
  generateMainRace(races: string[]) {
    if (races.length != 0) {
      this.genRace = sample(races) || 'Human';
    } else {
      this.genRace = sample(this.races) || 'Human';
    }
  }

  /**
   * @param {String[]} classes
   */
  generateMainClass(classes: string[]) {
    if (classes.length != 0) {
      this.genClass = sample(classes) || 'Fighter';
    } else {
      this.genClass = sample(this.classes) || 'Fighter';
    }
  }

  /**
   * @param {String} professionArea
   */
  generatePlothook(professionArea: string) {
    this.genPlotHook =
      sample(this.plotHooksJSON.All.concat(this.plotHooksJSON[professionArea as PlotHookIndex])) ||
      'This person has NOTHING going on... that is sus';
  }

  /**
   * @param {Object} d
   */
  generateLevel(d: NPCObject) {
    this.level = Number(d.level);
  }

  generateHp(object = this.classesJSON[this.genClass as NPCClassKey]) {
    if (!object.hp) throw new Error('Class has no HP value present');
    let hp = Number(object.hp.split('d')[1]);
    for (let i = 0; i < this.level - 1; i++) {
      hp += rollDiceString(object.hp);
    }

    hp += this.genConMod * this.level;
    this.genHp = String(hp);
  }

  generateProficiencies(object = this.classesJSON[this.genClass as NPCClassKey]) {
    const proficiencies: string[] = [];
    if (has(object.proficiencies, 'Armor')) {
      object.proficiencies?.Armor?.forEach((value) => {
        proficiencies.push(value);
      });
    }
    if (has(object.proficiencies, 'Weapons')) {
      object.proficiencies?.Weapons?.forEach((value) => {
        proficiencies.push(value);
      });
    }
    if (has(object.proficiencies, 'Tools')) {
      object.proficiencies?.Tools?.forEach((value) => {
        proficiencies.push(value);
      });
    }
    this.genProficiencies = proficiencies;
  }

  generateSavingThrows(object = this.classesJSON[this.genClass as NPCClassKey]) {
    this.genSaveThrows = object.proficiencies?.['Saving Throws'] || [];
  }

  generateSkills(object = this.classesJSON[this.genClass as NPCClassKey]) {
    const skills: string[] = [];
    object.proficiencies?.Skills?.forEach((array) => {
      let working = true;
      let samp = '';
      while (working) {
        if (array[0] === 'Any') {
          samp = sample(this.skillList) || '';
          if (!skills.includes(samp)) {
            working = false;
          }
        } else {
          samp = sample(array) || '';
          if (!skills.includes(samp)) {
            working = false;
          }
        }
      }
      skills.push(samp);
    });
    this.genSkills = skills;
  }

  generateAge() {
    this.genAge = String(Math.floor(weightedRandom(this.racesJSON[this.genRace as NPCRace].age, 3)));
  }

  generateLanguages() {
    const languages: string[] = [];
    this.racesJSON[this.genRace as NPCRace].languages.forEach((value) => {
      if (value === 'Any') {
        let working = true;
        let samp = '';
        while (working) {
          samp = sample(this.languages) || 'Common';
          if (!languages.includes(samp)) {
            working = false;
          }
        }
        languages.push(samp);
      } else {
        languages.push(value);
      }
    });
    this.genLanguages = languages;
  }

  generateHeight() {
    const baseHeight = Number(this.racesJSON[this.genRace as NPCRace].height.base);
    const heightMod = rollDiceString(this.racesJSON[this.genRace as NPCRace].height.mod) || 0;
    this.genHeight = inchesToFeet(baseHeight + heightMod);
    return heightMod;
  }

  /**
   * @param {Number} heightMod
   */
  generateWeight(heightMod: number) {
    const baseWeight = Number(this.racesJSON[this.genRace as NPCRace].weight.base);
    const weightMod = rollDiceString(this.racesJSON[this.genRace as NPCRace].weight.mod) || 1;
    this.genWeight = String(baseWeight + heightMod * weightMod);
  }

  generateSpeed() {
    this.genSpeed = String(this.racesJSON[this.genRace as NPCRace].speed);
  }

  generateAbilityModifiers() {
    if (this.racesJSON[this.genRace as NPCRace].abilityBonus) {
      this.genStrMod = (this.racesJSON[this.genRace as NPCRace].abilityBonus.Con as number) || 0;
      this.genDexMod = (this.racesJSON[this.genRace as NPCRace].abilityBonus.Dex as number) || 0;
      this.genConMod = (this.racesJSON[this.genRace as NPCRace].abilityBonus.Con as number) || 0;
      this.genIntMod = (this.racesJSON[this.genRace as NPCRace].abilityBonus.Int as number) || 0;
      this.genWisMod = (this.racesJSON[this.genRace as NPCRace].abilityBonus.Wis as number) || 0;
      this.genChaMod = (this.racesJSON[this.genRace as NPCRace].abilityBonus.Cha as number) || 0;
      if (this.racesJSON[this.genRace as NPCRace].abilityBonus.Any) {
        const amount = this.racesJSON[this.genRace as NPCRace].abilityBonus.Any as number;
        let working = true;
        let mod = '';
        let abilityMod = '';
        while (working) {
          mod = sample(this.abilityList) || 'Str';
          abilityMod = `gen${mod}Mod`;
          if (this[abilityMod as NPCAbilityModKey] === 0) {
            working = false;
          }
        }
        this[abilityMod as NPCAbilityModKey] += amount;
      }
      if (this.racesJSON[this.genRace as NPCRace].abilityBonus.Choice) {
        (this.racesJSON[this.genRace as NPCRace].abilityBonus?.Choice as AnyAbilityBonus[]).forEach((object) => {
          if (!object.Any) {
            const mod = sample(Object.keys(object)) || 'Any';
            const amount = object[mod as AbilityBonusKey];
            this[`gen${mod}Mod` as NPCAbilityModKey] += amount;
          }
          if (object.Any) {
            const amount = object.Any;
            let working = true;
            let mod = '';
            while (working) {
              mod = sample(this.abilityList) || 'Str';
              if (this[`gen${mod}Mod` as NPCAbilityModKey] === 0) {
                working = false;
              }
            }
            this[`gen${mod}Mod` as NPCAbilityModKey] += amount;
          }
        });
      }
    }
  }

  generateAbilityTotals(d: NPCData) {
    if (d.useMinMaxStats) {
      this.generateAbilityTotalsMinMax();
    } else {
      this.genStr = String(rollDiceString('4d6kh3') + this.genStrMod);
      this.genDex = String(rollDiceString('4d6kh3') + this.genDexMod);
      this.genCon = String(rollDiceString('4d6kh3') + this.genConMod);
      this.genInt = String(rollDiceString('4d6kh3') + this.genIntMod);
      this.genWis = String(rollDiceString('4d6kh3') + this.genWisMod);
      this.genCha = String(rollDiceString('4d6kh3') + this.genChaMod);
    }
  }

  generateAbilityTotalsMinMax() {
    const scoreList: number[] = [];

    for (let i = 0; i < 6; i++) {
      scoreList.push(rollDiceString('4d6kh3'));
    }

    scoreList.sort(ascending_sort);

    const attributeSortOrder: string[] = [];
    const object = this.classesJSON[this.genClass as NPCClassKey];
    object.attributeSortOrder?.forEach((value) => {
      attributeSortOrder.push(value);
    });

    const fullAttributeList = { Str: 0, Dex: 0, Con: 0, Int: 0, Wis: 0, Cha: 0 };

    attributeSortOrder.forEach((value) => {
      fullAttributeList[value as AbilityKey] = scoreList.pop() || 0;
    });

    scoreList.sort(random_sort);

    for (const key in fullAttributeList) {
      if (fullAttributeList[key as AbilityKey] === 0) {
        fullAttributeList[key as AbilityKey] = scoreList.pop() || 0;
      }
    }

    this.genStr = String(fullAttributeList['Str'] + this.genStrMod);
    this.genDex = String(fullAttributeList['Dex'] + this.genDexMod);
    this.genCon = String(fullAttributeList['Con'] + this.genConMod);
    this.genInt = String(fullAttributeList['Int'] + this.genIntMod);
    this.genWis = String(fullAttributeList['Wis'] + this.genWisMod);
    this.genCha = String(fullAttributeList['Cha'] + this.genChaMod);
  }

  generateSubclass(d: NPCData) {
    if (d.useSubclass) {
      if (has(this.classesJSON[this.genClass as NPCClassKey], 'subclasses')) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.genSubclass = sample(Object.keys(this.classesJSON[this.genClass as NPCClassKey].subclasses!)) || '';
        const subclassJSON =
          this.classesJSON[this.genClass as NPCClassKey].subclasses?.[this.genSubclass as NPCSubclassKey];

        // hp
        if (has(subclassJSON, 'hp')) {
          this.generateHp(subclassJSON);
        }

        if (has(subclassJSON, 'proficiencies')) {
          // proficiencies
          this.generateProficiencies(subclassJSON);

          // saving throws
          if (has(subclassJSON?.proficiencies, 'Saving Throws')) {
            this.generateSavingThrows(subclassJSON);
          }

          // skills
          if (has(subclassJSON?.proficiencies, 'Skills')) {
            this.generateSkills(subclassJSON);
          }
        }
      }
    }
  }

  generateFirstName() {
    let firstNames: string[] = [];
    if (Object.keys(this.namesJSON.First).includes(this.genGender)) {
      const nameForced = difference(
        FVTTNPCGen.getSetting<string[]>('registeredRaces').map((string) => `Race${string}FirstNameForced`),
        filter(this.disabledBoxes, (str: string) => {
          return str.includes('FirstNameForced');
        }),
      );
      if (nameForced.length !== 0) {
        nameForced.forEach((raceDirty) => {
          firstNames = firstNames.concat(
            this.namesJSON.First[this.genGender as NPCGender][
              raceDirty.replace('Race', '').replace('FirstNameForced', '') as NPCRaceIndex
            ],
          );
        });
      } else {
        if (this.namesJSON.First[this.genGender as NPCGender].All) {
          firstNames = firstNames.concat(this.namesJSON.First[this.genGender as NPCGender].All);
        }
        if (this.namesJSON.First[this.genGender as NPCGender][this.genRace as NPCRaceIndex]) {
          firstNames = firstNames.concat(
            this.namesJSON.First[this.genGender as NPCGender][this.genRace as NPCRaceIndex],
          );
        }
        // if (
        //   this.namesJSON.First[this.genGender as NPCGender][
        //     this.racesJSON[this.genRace as NPCRace].mainRace as NPCRaceIndex
        //   ]
        // ) {
        //   firstNames = firstNames.concat(this.namesJSON.First[this.genGender as NPCGender][this.racesJSON[this.genRace as NPCRaceIndex].mainRace]);
        // }
      }
    } else {
      Object.keys(this.namesJSON.First).forEach((gender) => {
        /** @type {String[]} */
        const nameForced = difference(
          FVTTNPCGen.getSetting<string[]>('registeredRaces').map((string) => `Race${string}FirstNameForced`),
          filter(this.disabledBoxes, (str: string) => {
            return str.includes('FirstNameForced');
          }),
        );
        if (nameForced.length !== 0) {
          nameForced.forEach((raceDirty) => {
            firstNames = firstNames.concat(
              this.namesJSON.First[gender as NPCGender][
                raceDirty.replace('Race', '').replace('FirstNameForced', '') as NPCRaceIndex
              ],
            );
          });
        } else {
          if (this.namesJSON.First[gender as NPCGender].All) {
            firstNames = firstNames.concat(this.namesJSON.First[gender as NPCGender].All);
          }
          if (this.namesJSON.First[gender as NPCGender][this.genRace as NPCRaceIndex]) {
            firstNames = firstNames.concat(this.namesJSON.First[gender as NPCGender][this.genRace as NPCRaceIndex]);
          }
          //   if (this.namesJSON.First[gender][this.racesJSON[this.genRace].mainRace]) {
          //     firstNames = firstNames.concat(this.namesJSON.First[gender][this.racesJSON[this.genRace].mainRace]);
          //   }
        }
      });
    }
    this.genFirstName = sample(firstNames) || 'NPC';
  }

  generateLastName() {
    let lastNames: string[] = [];
    /** @type {String[]} */
    const nameForced = difference(
      FVTTNPCGen.getSetting<string[]>('registeredRaces').map((string) => `Race${string}LastNameForced`),
      filter(this.disabledBoxes, (str: string) => {
        return str.includes('LastNameForced');
      }),
    );
    if (nameForced.length !== 0) {
      nameForced.forEach((raceDirty) => {
        lastNames = lastNames.concat(
          this.namesJSON.Last[raceDirty.replace('Race', '').replace('LastNameForced', '') as NPCRaceIndex],
        );
      });
    } else {
      if (this.namesJSON.Last.All) {
        lastNames = lastNames.concat(this.namesJSON.Last.All);
      }
      if (this.namesJSON.Last[this.genRace as NPCRaceIndex]) {
        lastNames = lastNames.concat(this.namesJSON.Last[this.genRace as NPCRaceIndex]);
      }
      //   if (this.namesJSON.Last[this.racesJSON[this.genRace].mainRace]) {
      //     lastNames = lastNames.concat(this.namesJSON.Last[this.racesJSON[this.genRace].mainRace]);
      //   }
    }
    this.genLastName = sample(lastNames) || 'Generator';
  }

  /**
   * @param {Object} d
   */
  getBiography(d: NPCObject) {
    let biography = '';

    // gender
    biography = biography.concat(`<p>${game.i18n.localize('npcGen.gender')}: ${d.genGender}</p>\n`);
    // relationship
    biography = biography.concat(`<p>${game.i18n.localize('npcGen.relationship')}: ${d.genRelationship}</p>\n`);
    // orientation
    biography = biography.concat(`<p>${game.i18n.localize('npcGen.orientation')}: ${d.genOrientation}</p>\n`);
    // age
    biography = biography.concat(`<p>${game.i18n.localize('npcGen.age')}: ${d.genAge}</p>\n`);
    // height
    biography = biography.concat(`<p>${game.i18n.localize('npcGen.height')}: ${d.genHeight}</p>\n`);
    // weight
    biography = biography.concat(`<p>${game.i18n.localize('npcGen.weight')}: ${d.genWeight}</p>\n`);
    // static line
    biography = biography.concat(`<p>&nbsp;</p>\n<p><strong>${game.i18n.localize('npcGen.traits')}:</strong></p>\n`);
    // traits
    biography = biography.concat('<ul>\n');
    d.genTraits.split(/\r?\n/).forEach((trait) => {
      biography = biography.concat(`<li>${trait.replace('•', '')}</li>\n`);
    });
    biography = biography.concat('</ul>\n');
    // static line
    biography = biography.concat('<p>&nbsp;</p>');
    // plot hook
    biography = biography.concat(`<p><strong>${game.i18n.localize('npcGen.plotHook')}:</strong> ${d.genPlotHook}</p>`);

    return biography;
  }

  /**
   * @param {Object} d
   */
  getAbilities(d: NPCObject): NPCAbilities {
    const abilities: NPCAbilities = {
      Str: {
        value: 0,
        proficient: 0,
      },
      Dex: {
        value: 0,
        proficient: 0,
      },
      Con: {
        value: 0,
        proficient: 0,
      },
      Int: {
        value: 0,
        proficient: 0,
      },
      Wis: {
        value: 0,
        proficient: 0,
      },
      Cha: {
        value: 0,
        proficient: 0,
      },
    };
    this.listJSON.Abilities.forEach((ability: string): void => {
      abilities[ability as AbilityKey] = { value: Number(d[`gen${ability}` as NPCAbilityKey]), proficient: 0 };
    });

    // saving throws
    d.genSaveThrows
      .trim()
      .slice(0, -1)
      .split(', ')
      .forEach((ability: string) => {
        if (abilities[ability as AbilityKey] !== undefined) {
          abilities[ability as AbilityKey].proficient = 1;
        }
      });

    return abilities;
  }

  /**
   * @param {Object} d
   */
  getSkills(d: NPCObject) {
    // const skills = Object.fromEntries(Object.entries(this.listJSON.Skills).map((entry) => [entry[1], { value: 0 }]));
    const skills: NPCSkills = {};
    const classSkills: string[] = [];
    d.genSkills
      .trim()
      .slice(0, -1)
      .split(', ')
      .forEach((skill: string) => {
        const skillValue = this.listJSON.Skills[skill as SkillIndex];
        if (skillValue) {
          classSkills.push(skillValue);
          skills[skillValue as NPCSkillIndex] = { proficient: 1 };
        }
      });

    return [skills, classSkills];
  }

  /**
   * @param {Object} d
   * @param {Array} classSkills
   */
  getClassItem(d: NPCObject, classSkills: string[]) {
    const config = {
      name: d.genClass,
      type: 'class',
      data: {
        source: this.classesJSON[d.genClass as NPCClassKey].source,
        levels: d.level,
        subclass: d.genSubclass,
        skills: {
          number: classSkills.length,
          value: classSkills,
        },
      },
    };
    const item = new CONFIG.Item.documentClass(foundry.utils.deepClone(config));
    console.log(item);
    return item;
  }

  /**
   * @param {Object} d
   * @param {Object} abilities
   * @param {String} biography
   * @param {Object} skills
   * @param {Entity<any>} classItem
   */
  getActorOptions(d: NPCObject, abilities: NPCAbilities, biography: string, skills: NPCSkills, classItem: Item) {
    return {
      name: `${d.genFirstName} ${d.genLastName}`,
      type: 'npc',
      img: d.genIcon,
      // system
      data: {
        abilities: abilities,
        attributes: {
          ac: {
            value: 10 + calculateAbilityMod(Number(d.genDex)),
          },
          hp: {
            value: Number(d.genHp),
            max: Number(d.genHp),
          },
          speed: {
            value: Number(d.genSpeed),
          },
        },
        details: {
          biography: {
            value: biography,
          },
          race: d.genRace,
          background: d.genProfession,
          level: Number(d.level),
        },
        skills: skills,
        traits: {
          size: this.listJSON.Sizes[this.racesJSON[d.genRace as NPCRace].height.size as unknown as SizeIndex],
          languages: {
            custom: d.genLanguages.trim().slice(0, -1).replace(',', ';'),
          },
          weaponProf: {
            custom: d.genProficiencies.trim().slice(0, -1).replace(/\r?\n/g, ';'),
          },
        },
      },
      items: [duplicate(classItem.data)],
    };
  }

  updateFormValues(d: NPCObject) {
    if (d.useSubclass) {
      this.useSubclass = true;
    }
    if (d.level) {
      this.level = d.level;
    }

    this.disabledBoxes = [];
    for (const property in d) {
      if (d[property as NPCObjectIndex] === false && !property.startsWith('gen') && !property.startsWith('Prob')) {
        this.disabledBoxes.push(property);
      }
      if (d[property as NPCObjectIndex] !== '1' && property.startsWith('Prob')) {
        this.weights[property as WeightsIndex] = d[property as NPCObjectIndex];
      }
    }
    game.settings.set(FVTTNPCGen.ID, 'disabledBoxes', this.disabledBoxes);
    game.settings.set(FVTTNPCGen.ID, 'weights', this.weights);
  }

  /**
   * @param {Object} d
   * @param {String} name
   * @param {string} [excludeEnd=""]
   */
  getEnabledValues(d: NPCObject, name: string, excludeEnd = '') {
    const filteredObject = pick(d, function (value, key) {
      if (value && key.startsWith(name) && (!key.endsWith(excludeEnd) || excludeEnd.length === 0)) {
        return true;
      }
      return false;
    });

    /** @type {String[]} */
    const renamedArray: string[] = [];

    Object.keys(filteredObject).forEach((key) => {
      renamedArray.push(key.replace(name, ''));
    });

    return renamedArray;
  }

  /**
   * @param  {Object} d
   * @param  {String} prefix
   * @param  {String} suffix
   */
  getProbValue(d: NPCObject, prefix: string, suffix: string): number {
    for (const key in d) {
      if (key === 'Prob' + prefix + suffix) {
        return d[key as NPCObjectIndex] as number;
      }
    }
    return 0;
  }

  resetValues() {
    this.genStr = '';
    this.genDex = '';
    this.genCon = '';
    this.genInt = '';
    this.genWis = '';
    this.genCha = '';
    this.genStrMod = 0;
    this.genDexMod = 0;
    this.genConMod = 0;
    this.genIntMod = 0;
    this.genWisMod = 0;
    this.genChaMod = 0;
    this.genGender = '';
    this.genRelationship = '';
    this.genOrientation = '';
    this.genRace = '';
    this.genAge = '';
    this.genLanguages = [];
    this.genHeight = '';
    this.genWeight = '';
    this.genSpeed = '';
    this.genProfession = '';
    this.genPlotHook = '';
    this.genTraits = [];
    this.genClass = '';
    this.genHp = '';
    this.genProficiencies = [];
    this.genSaveThrows = [];
    this.genSkills = [];
    this.genSubclass = 'None';
    this.level = 1;
    this.genFirstName = 'NPC';
    this.genLastName = 'Generator';
    this.genIcon = 'icons/svg/mystery-man.svg';
  }

  _getHeaderButtons() {
    return [
      ...[
        {
          label: 'Image Settings',
          class: 'setting',
          icon: 'fas fa-cog',
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          onclick: (_ev: JQuery.ClickEvent) => {
            new ImageLocationSettings({
              races: this.races,
              genders: this.gender,
              classes: this.classes,
            } as ImgLocSettingsAppFormOptions).render(true);
          },
        },
      ],
      ...super._getHeaderButtons(),
    ];
  }

  async _apiSave() {
    const data = this as unknown as NPCObject;
    Object.keys(data).forEach((key) => {
      if (Array.isArray(data[key as NPCObjectIndex]) && key.startsWith('gen'))
        (data[key as NPCObjectIndex] as string) = (data[key as NPCObjectIndex] as string[]).join(', ');
    });

    return await this.saveNPC(data, true);
  }
}

/**
 * @param {Number} raw
 */
function calculateAbilityMod(raw: number) {
  return Math.ceil(raw / 2) - 5;
}

/**
 * @param  {Number} inches
 * @returns feet string
 */
function inchesToFeet(inches: number) {
  return `${Math.floor(inches / 12)}'${inches % 12}"`;
}

/**
 * @param  {Number} max - max number
 * @param  {Number} numDice - number of rolls
 */
function weightedRandom(max: number, numDice: number) {
  let num = 0;
  for (let i = 0; i < numDice; i++) {
    num += Math.random() * (max / numDice);
  }
  return num;
}

/**
 * @param  {String} diceString
 */
function rollDiceString(diceString: string): number {
  const diceStringMatch = diceString.match(
    /(?<numberOfDice>[\d]+)d(?<diceType>[\d]+)(?<keep>k(?<highOrLow>[hl])(?<keepAmount>[\d]+))?/i,
  );
  if (!diceStringMatch) throw new Error('Invalid dice string');
  const numberOfDice = diceStringMatch.groups?.numberOfDice ? parseInt(diceStringMatch.groups.numberOfDice) : 0;
  const diceType = diceStringMatch.groups?.diceType ? parseInt(diceStringMatch.groups?.diceType) : 0;
  let keep = diceStringMatch.groups?.keep;
  let highOrLow = diceStringMatch.groups?.highOrLow;
  let keepAmount = diceStringMatch.groups?.keepAmount ? parseInt(diceStringMatch.groups?.keepAmount) : 0;

  if (keep === undefined) {
    // if we don't have keep, we can use the same logic by setting the keep amount to be the same number as the total number of dice
    // and it'll be the same result
    keep = 'k';
    highOrLow = 'h';
    keepAmount = numberOfDice;
  }

  // const [count, dice] = diceString.split('d');
  let total = 0;
  const diceResults = [];

  for (let i = 0; i < numberOfDice; i++) {
    diceResults.push(Math.ceil(Math.random() * diceType));
  }

  if (highOrLow === 'h') {
    diceResults.sort(descending_sort);
  } else {
    diceResults.sort(ascending_sort);
  }

  for (let i = 0; i < keepAmount; i++) {
    total += diceResults[i];
  }

  console.info(
    '%cINFO | NPC Dice String Request:',
    'color: #fff; background-color: #444; padding: 2px 4px; border-radius: 2px;',
    // removeGenFromObj(diceString),
  );
  console.info(
    '%cINFO | NPC generator rolls:',
    'color: #fff; background-color: #444; padding: 2px 4px; border-radius: 2px;',
    // removeGenFromObj(diceResults),
  );
  console.info(
    '%cINFO | NPC generator total:',
    'color: #fff; background-color: #444; padding: 2px 4px; border-radius: 2px;',
    // removeGenFromObj(total),
  );

  return total;
}

/**
 * @param {Array} arr
 * @param {Function} callback
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function asyncForEach(arr: unknown[], callback: any) {
  for (let i = 0; i < arr.length; i++) {
    await callback(arr[i], i, arr);
  }
}

/**
 * @param {Object} obj
 */
function removeGenFromObj(obj: NPCObject) {
  const newObj = duplicate(obj);
  Object.keys(newObj).forEach((key) => {
    if (key.startsWith('gen')) {
      delete newObj[key as NPCObjectIndex];
    }
  });
  return newObj;
}

/**
 * Function to help perform a random sort of an array
 * @param {*} a
 * @param {*} b
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
function random_sort(a: any, b: any) {
  return Math.random() - 0.5;
}

/**
 * Function to help perform a ascending sort of an array
 * @param {*} a
 * @param {*} b
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
function ascending_sort(a: any, b: any) {
  return a - b;
}

/**
 * Function to help perform a descending sort of an array
 * @param {*} a
 * @param {*} b
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
function descending_sort(a: any, b: any) {
  return b - a;
}
