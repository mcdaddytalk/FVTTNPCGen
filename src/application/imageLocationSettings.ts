import { ImgLocSettingsAppFormOptions, ImgLocSettingsData } from '../lib/augments/settings';
import { FVTTNPCGen } from './FVTTNPCGen';

export default class ImageLocationSettings extends FormApplication<ImgLocSettingsAppFormOptions, ImgLocSettingsData> {
  races: string[];
  genders: string[];
  classes: string[];

  constructor(options: ImgLocSettingsAppFormOptions) {
    super({}, {});

    this.races = options.races;
    this.genders = options.genders;
    this.classes = options.classes;
  }

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      id: 'npcGen-image-location-settings',
      classes: ['sheet'],
      template: FVTTNPCGen.TEMPLATES.IMAGESETTINGS,
      resizable: true,
      minimizable: false,
      title: '',
    });
  }

  async getData(options: Partial<ImgLocSettingsAppFormOptions> | undefined): Promise<ImgLocSettingsData> {
    const data = super.getData(options) as ImgLocSettingsData;

    data.races = this.races;
    data.genders = this.genders;
    data.classes = this.classes;
    data.settings = FVTTNPCGen.getSetting(FVTTNPCGen.SETTINGS.IMAGE_LOCATIONS);
    data.roleSpecific = FVTTNPCGen.getSetting(FVTTNPCGen.SETTINGS.ROLE_SPECIFIC_IMAGES);

    return data;
  }

  /**
   * @param {JQuery} html
   */
  activateListeners(html: JQuery<HTMLElement>) {
    super.activateListeners(html);

    html.find('.npcGenTextInput').on('change', (ev: JQuery.ChangeEvent) => {
      if (ev.originalEvent?.isTrusted) return;
      const target = ev.target as HTMLInputElement;
      target.value = target.value.replace(/([^/]+$)/, '');
    });

    html.find('button#cancelButton').on('click', () => {
      this.close();
    });
  }

  /**
   * @param {Event} event
   * @param {Object} formData
   */
  async _updateObject(event: Event, formData: ImgLocSettingsData | undefined) {
    game.settings.set('npcgen', 'imageLocations', formData);
  }
}
