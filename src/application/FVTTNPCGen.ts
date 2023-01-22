export class FVTTNPCGen {
  static ID = 'FVTTNPCGen';

  static FLAGS = {};

  static SETTINGS = {
    REGISTERED_RACES: 'registeredRaces',
    DISABLED_BOXES: 'disabledBoxes',
    WEIGHTS: 'weights',
    IMAGE_LOCATIONS: 'imageLocations',
    ROLE_SPECIFIC_IMAGES: 'roleSpecificImages',
    JSON_EDITOR: 'jsonEditor',
    EXPORT_SETTINGS: 'exportSettings',
    JSON: {
      CLASSES: 'classesJSON',
      LANGUAGES: 'languagesJSON',
      NAMES: 'namesJSON',
      TRAITS: 'traitsJSON',
      PLOTHOOKS: 'plothooksJSON',
      PROFESSIONS: 'professionsJSON',
      RACES: 'racesJSON',
      SEX: 'sexJSON',
      LIST: 'listJSON',
    },
    ONLY_JSON: {
      CLASSES: 'onlyClassesJSON',
      LANGUAGES: 'onlyLanguagesJSON',
      NAMES: 'onlyNamesJSON',
      TRAITS: 'onlyTraitsJSON',
      PLOTHOOKS: 'onlyPlotHooksJSON',
      PROFESSIONS: 'onlyProfessionsJSON',
      RACES: 'onlyRacesJSON',
      SEX: 'onlySexJSON',
      LIST: 'onlyListJSON',
    },
    COMPAT_MODE: 'compatMode',
  };

  static TEMPLATES = {
    EXPORTSETTINGS: `modules/${this.ID}/templates/exportSettings.hbs`,
    JSONEDITOR: `modules/${this.ID}/templates/jsonEditor.hbs`,
    IMAGESETTINGS: `modules/${this.ID}/templates/imageSettings.hbs`,
    GENERATOR: `modules/${this.ID}/templates/generator.hbs`,
  };

  static initialize(): void {
    // TODO
  }

  static myStaticMethod(): void {
    throw new Error('not yet implemented');
  }

  static log(force: boolean, ...args: unknown[]): void {
    try {
      const shouldLog = force || game.modules.get('_dev-mode')?.api?.getPackageDebugValue(this.ID);

      if (shouldLog) {
        console.log(this.ID, '|', ...args);
      }
    } catch (e) {
      console.error(e);
    }
  }

  static getSetting<T>(key: string): T {
    return game.settings.get(this.ID, key) as T;
  }
}
