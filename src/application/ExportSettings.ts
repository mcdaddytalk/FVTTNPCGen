import { NPCGenData, NPCGenFormApplicationOptions, NPCGenSettings } from '../lib/augments/settings';
import { FVTTNPCGen } from './FVTTNPCGen';

export default class ExportSettings extends FormApplication<NPCGenFormApplicationOptions, NPCGenData> {
  constructor() {
    super({}, {});
  }

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      id: 'npcGen-export-settings',
      classes: ['sheet'],
      template: FVTTNPCGen.TEMPLATES.EXPORTSETTINGS,
      resizable: false,
      minimizable: false,
      title: '',
      width: 230,
    });
  }

  async getData(options: Partial<FormApplicationOptions>): Promise<NPCGenData> {
    const data = super.getData(options) as NPCGenData;

    data.settings = JSON.stringify(this.getSettings());

    return data;
  }

  getSettings() {
    return {
      disabledBoxes: game.settings.get(FVTTNPCGen.ID, FVTTNPCGen.SETTINGS.DISABLED_BOXES),
      weights: game.settings.get(FVTTNPCGen.ID, FVTTNPCGen.SETTINGS.WEIGHTS),
      imageLocations: game.settings.get(FVTTNPCGen.ID, FVTTNPCGen.SETTINGS.IMAGE_LOCATIONS),
      classesJSON: game.settings.get(FVTTNPCGen.ID, FVTTNPCGen.SETTINGS.JSON.CLASSES),
      languagesJSON: game.settings.get(FVTTNPCGen.ID, FVTTNPCGen.SETTINGS.JSON.LANGUAGES),
      namesJSON: game.settings.get(FVTTNPCGen.ID, FVTTNPCGen.SETTINGS.JSON.NAMES),
      traitsJSON: game.settings.get(FVTTNPCGen.ID, FVTTNPCGen.SETTINGS.JSON.TRAITS),
      plothooksJSON: game.settings.get(FVTTNPCGen.ID, FVTTNPCGen.SETTINGS.JSON.PLOTHOOKS),
      professionsJSON: game.settings.get(FVTTNPCGen.ID, FVTTNPCGen.SETTINGS.JSON.PROFESSIONS),
      racesJSON: game.settings.get(FVTTNPCGen.ID, FVTTNPCGen.SETTINGS.JSON.RACES),
      sexJSON: game.settings.get(FVTTNPCGen.ID, FVTTNPCGen.SETTINGS.JSON.SEX),
      listJSON: game.settings.get(FVTTNPCGen.ID, FVTTNPCGen.SETTINGS.JSON.LIST),
      onlyClassesJSON: game.settings.get(FVTTNPCGen.ID, FVTTNPCGen.SETTINGS.ONLY_JSON.CLASSES),
      onlyLanguagesJSON: game.settings.get(FVTTNPCGen.ID, FVTTNPCGen.SETTINGS.ONLY_JSON.LANGUAGES),
      onlyNamesJSON: game.settings.get(FVTTNPCGen.ID, FVTTNPCGen.SETTINGS.ONLY_JSON.NAMES),
      onlyTraitsJSON: game.settings.get(FVTTNPCGen.ID, FVTTNPCGen.SETTINGS.ONLY_JSON.TRAITS),
      onlyPlothooksJSON: game.settings.get(FVTTNPCGen.ID, FVTTNPCGen.SETTINGS.ONLY_JSON.PLOTHOOKS),
      onlyProfessionsJSON: game.settings.get(FVTTNPCGen.ID, FVTTNPCGen.SETTINGS.ONLY_JSON.PROFESSIONS),
      onlyRacesJSON: game.settings.get(FVTTNPCGen.ID, FVTTNPCGen.SETTINGS.ONLY_JSON.RACES),
      onlySexJSON: game.settings.get(FVTTNPCGen.ID, FVTTNPCGen.SETTINGS.ONLY_JSON.SEX),
      onlyListJSON: game.settings.get(FVTTNPCGen.ID, FVTTNPCGen.SETTINGS.ONLY_JSON.LIST),
      compatMode: game.settings.get(FVTTNPCGen.ID, FVTTNPCGen.SETTINGS.COMPAT_MODE),
    };
  }

  setSettings(input: NPCGenSettings) {
    if (input.disabledBoxes?.[0])
      game.settings.set(FVTTNPCGen.ID, FVTTNPCGen.SETTINGS.DISABLED_BOXES, input.disabledBoxes[0]);
    if (input.weights) game.settings.set(FVTTNPCGen.ID, FVTTNPCGen.SETTINGS.WEIGHTS, input.weights);
    if (input.imageLocations)
      game.settings.set(FVTTNPCGen.ID, FVTTNPCGen.SETTINGS.IMAGE_LOCATIONS, input.imageLocations);
    if (input.classesJSON) game.settings.set(FVTTNPCGen.ID, FVTTNPCGen.SETTINGS.JSON.CLASSES, input.classesJSON);
    if (input.languagesJSON) game.settings.set(FVTTNPCGen.ID, FVTTNPCGen.SETTINGS.JSON.LANGUAGES, input.languagesJSON);
    if (input.namesJSON) game.settings.set(FVTTNPCGen.ID, FVTTNPCGen.SETTINGS.JSON.NAMES, input.namesJSON);
    if (input.traitsJSON) game.settings.set(FVTTNPCGen.ID, FVTTNPCGen.SETTINGS.JSON.TRAITS, input.traitsJSON);
    if (input.plothooksJSON) game.settings.set(FVTTNPCGen.ID, FVTTNPCGen.SETTINGS.JSON.PLOTHOOKS, input.plothooksJSON);
    if (input.professionsJSON)
      game.settings.set(FVTTNPCGen.ID, FVTTNPCGen.SETTINGS.JSON.PROFESSIONS, input.professionsJSON);
    if (input.racesJSON) game.settings.set(FVTTNPCGen.ID, FVTTNPCGen.SETTINGS.JSON.RACES, input.racesJSON);
    if (input.sexJSON) game.settings.set(FVTTNPCGen.ID, FVTTNPCGen.SETTINGS.JSON.SEX, input.sexJSON);
    if (input.onlyClassesJSON)
      game.settings.set(FVTTNPCGen.ID, FVTTNPCGen.SETTINGS.ONLY_JSON.CLASSES, input.onlyClassesJSON);
    if (input.onlyLanguagesJSON)
      game.settings.set(FVTTNPCGen.ID, FVTTNPCGen.SETTINGS.ONLY_JSON.LANGUAGES, input.onlyLanguagesJSON);
    if (input.onlyNamesJSON) game.settings.set(FVTTNPCGen.ID, FVTTNPCGen.SETTINGS.ONLY_JSON.NAMES, input.onlyNamesJSON);
    if (input.onlyTraitsJSON)
      game.settings.set(FVTTNPCGen.ID, FVTTNPCGen.SETTINGS.ONLY_JSON.TRAITS, input.onlyTraitsJSON);
    if (input.onlyPlothooksJSON)
      game.settings.set(FVTTNPCGen.ID, FVTTNPCGen.SETTINGS.ONLY_JSON.PLOTHOOKS, input.onlyPlothooksJSON);
    if (input.onlyProfessionsJSON)
      game.settings.set(FVTTNPCGen.ID, FVTTNPCGen.SETTINGS.ONLY_JSON.PROFESSIONS, input.onlyProfessionsJSON);
    if (input.onlyRacesJSON) game.settings.set(FVTTNPCGen.ID, FVTTNPCGen.SETTINGS.ONLY_JSON.RACES, input.onlyRacesJSON);
    if (input.onlySexJSON) game.settings.set(FVTTNPCGen.ID, FVTTNPCGen.SETTINGS.ONLY_JSON.SEX, input.onlySexJSON);
    if (input.onlyListJSON) game.settings.set(FVTTNPCGen.ID, FVTTNPCGen.SETTINGS.ONLY_JSON.LIST, input.onlyListJSON);
    if (input.compatMode) game.settings.set(FVTTNPCGen.ID, FVTTNPCGen.SETTINGS.COMPAT_MODE, input.compatMode);
  }

  /**
   * @param {JQuery} html
   */
  activateListeners(html: JQuery<HTMLElement>) {
    super.activateListeners(html);

    html.find('button#cancelButton').on('click', () => {
      this.close();
    });
  }

  /**
   * @param {Event} event
   * @param {Object} formData
   */
  async _updateObject(event: Event, formData: { settingsText: string }) {
    this.setSettings(JSON.parse(formData.settingsText));
  }
}
