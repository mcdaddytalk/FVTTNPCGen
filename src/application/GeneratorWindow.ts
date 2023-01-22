import { NPCEditor, NPCEditorData, NPCGenFormApplicationOptions } from '../lib/augments/settings';
import { FVTTNPCGen } from './FVTTNPCGen';

export default class GeneratorWindow extends FormApplication<NPCGenFormApplicationOptions, NPCEditorData> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected _updateObject(event: Event, formData?: object | undefined): Promise<void> {
    throw new Error('Method not implemented.');
  }

  editorArray: NPCEditor;
  unsaved: boolean;

  constructor(object = {}, options = {}) {
    super(object, options);

    this.editorArray = {
      classesJSON: undefined,
      languagesJSON: undefined,
      namesJSON: undefined,
      traitsJSON: undefined,
      plothooksJSON: undefined,
      professionsJSON: undefined,
      racesJSON: undefined,
      sexJSON: undefined,
      listJSON: undefined,
    };
    this.unsaved = false;

    this.sendToSettings = this.sendToSettings.bind(this);
    this.resetSettings = this.resetSettings.bind(this);
  }

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      id: 'json-editor-menu',
      title: 'JSON Editor',
      template: FVTTNPCGen.TEMPLATES.JSONEDITOR,
      classes: ['sheet'],
      closeOnSubmit: true,
      resizable: true,
      width: 602,
      height: 600,
    });
  }

  /**
   * @param  {JQuery} html
   */
  activateListeners(html: JQuery<HTMLElement>) {
    super.activateListeners(html);

    this.initEditorHtml();

    this.resetHidden(html, 'classesJSON');
    this.setTitle(game.i18n.localize('npcGen.classes'));

    // top button row
    html.find('.header-button[name="classesJSON"]').on('click', (e) => {
      e.preventDefault();
      this.checkPopup(
        html,
        'classesJSON',
        'https://github.com/mcdaddytalk/FVTTNPCGen/blob/master/src/data/classes.json',
      );
      this.resetHidden(html, 'classesJSON');
      this.setTitle(game.i18n.localize('npcGen.classes'));
    });
    html.find('.header-button[name="languagesJSON"]').on('click', (e) => {
      e.preventDefault();
      this.checkPopup(
        html,
        'languagesJSON',
        'https://github.com/mcdaddytalk/FVTTNPCGen/blob/master/src/data/languages.json',
      );
      this.resetHidden(html, 'languagesJSON');
      this.setTitle(game.i18n.localize('npcGen.language'));
    });
    html.find('.header-button[name="namesJSON"]').on('click', (e) => {
      e.preventDefault();
      this.checkPopup(html, 'namesJSON', 'https://github.com/mcdaddytalk/FVTTNPCGen/blob/master/src/data/names.json');
      this.resetHidden(html, 'namesJSON');
      this.setTitle(game.i18n.localize('npcGen.names'));
    });
    html.find('.header-button[name="traitsJSON"]').on('click', (e) => {
      e.preventDefault();
      this.checkPopup(
        html,
        'traitsJSON',
        'https://github.com/mcdaddytalk/FVTTNPCGen/blob/master/src/data/personalitytraits.json',
      );
      this.resetHidden(html, 'traitsJSON');
      this.setTitle(game.i18n.localize('npcGen.traits'));
    });
    html.find('.header-button[name="plothooksJSON"]').on('click', (e) => {
      e.preventDefault();
      this.checkPopup(
        html,
        'plothooksJSON',
        'https://github.com/mcdaddytalk/FVTTNPCGen/blob/master/src/data/plothooks.json',
      );
      this.resetHidden(html, 'plothooksJSON');
      this.setTitle(game.i18n.localize('npcGen.plotHook'));
    });
    html.find('.header-button[name="professionsJSON"]').on('click', (e) => {
      e.preventDefault();
      this.checkPopup(
        html,
        'professionsJSON',
        'https://github.com/mcdaddytalk/FVTTNPCGen/blob/master/src/data/professions.json',
      );
      this.resetHidden(html, 'professionsJSON');
      this.setTitle(game.i18n.localize('npcGen.professions'));
    });
    html.find('.header-button[name="racesJSON"]').on('click', (e) => {
      e.preventDefault();
      this.checkPopup(html, 'racesJSON', 'https://github.com/mcdaddytalk/FVTTNPCGen/blob/master/src/data/races.json');
      this.resetHidden(html, 'racesJSON');
      this.setTitle(game.i18n.localize('npcGen.races'));
    });
    html.find('.header-button[name="sexJSON"]').on('click', (e) => {
      e.preventDefault();
      this.checkPopup(html, 'sexJSON', 'https://github.com/mcdaddytalk/FVTTNPCGen/blob/master/src/data/sex.json');
      this.resetHidden(html, 'sexJSON');
      this.setTitle(game.i18n.localize('npcGen.relationship'));
    });
    html.find('.header-button[name="listJSON"]').on('click', (e) => {
      e.preventDefault();
      this.checkPopup(html, 'listJSON', 'https://github.com/mcdaddytalk/FVTTNPCGen/blob/master/src/data/lists.json');
      this.resetHidden(html, 'sexJSON');
      this.setTitle(game.i18n.localize('npcGen.lists'));
    });

    // bottom button row
    html.find('button.toggle-button').on('click', (event) => {
      const buttonId = event.target.id;
      const currentSetting = game.settings.get(FVTTNPCGen.ID, `only${capitalizeFirstLetter(buttonId)}`);
      if (currentSetting) {
        event.target.textContent = game.i18n.localize('npcGen.useDefault.On');
        game.settings.set(FVTTNPCGen.ID, `only${capitalizeFirstLetter(buttonId)}`, false);
      } else {
        event.target.textContent = game.i18n.localize('npcGen.useDefault.Off');
        game.settings.set(FVTTNPCGen.ID, `only${capitalizeFirstLetter(buttonId)}`, true);
      }
    });

    html.find('button.save-json-button').on('click', () => {
      this.sendToSettings();
    });
    html.find('button.reset-current-json').on('click', () => {
      this.resetSettings(html);
    });
  }

  /**
   * Default Options for this FormApplication
   */
  getData(options: Partial<FormApplicationOptions> | undefined): NPCEditorData {
    const data = super.getData(options) as NPCEditorData;

    data.onlyClassesJSON = FVTTNPCGen.getSetting<boolean>(FVTTNPCGen.SETTINGS.ONLY_JSON.CLASSES);
    data.onlyLanguagesJSON = FVTTNPCGen.getSetting<boolean>(FVTTNPCGen.SETTINGS.ONLY_JSON.LANGUAGES);
    data.onlyNamesJSON = FVTTNPCGen.getSetting<boolean>(FVTTNPCGen.SETTINGS.ONLY_JSON.NAMES);
    data.onlyTraitsJSON = FVTTNPCGen.getSetting<boolean>(FVTTNPCGen.SETTINGS.ONLY_JSON.TRAITS);
    data.onlyPlothooksJSON = FVTTNPCGen.getSetting<boolean>(FVTTNPCGen.SETTINGS.ONLY_JSON.PLOTHOOKS);
    data.onlyProfessionsJSON = FVTTNPCGen.getSetting<boolean>(FVTTNPCGen.SETTINGS.ONLY_JSON.PROFESSIONS);
    data.onlyRacesJSON = FVTTNPCGen.getSetting<boolean>(FVTTNPCGen.SETTINGS.ONLY_JSON.RACES);
    data.onlySexJSON = FVTTNPCGen.getSetting<boolean>(FVTTNPCGen.SETTINGS.ONLY_JSON.SEX);

    return data;
  }

  /**
   * @param  {JQuery} html
   * @param  {String} visibleEditor
   */
  resetHidden(html: JQuery<HTMLElement>, visibleEditor: string) {
    html.find('.editor[id="classesJSON"]').css('display', 'none');
    html.find('.header-button[name="classesJSON"]').css({ outline: 'unset', 'box-shadow': 'unset' });
    html.find('.toggle-button[id="classesJSON"]').css('display', 'none');

    html.find('.editor[id="languagesJSON"]').css('display', 'none');
    html.find('.header-button[name="languagesJSON"]').css({ outline: 'unset', 'box-shadow': 'unset' });
    html.find('.toggle-button[id="languagesJSON"]').css('display', 'none');

    html.find('.editor[id="namesJSON"]').css('display', 'none');
    html.find('.header-button[name="namesJSON"]').css({ outline: 'unset', 'box-shadow': 'unset' });
    html.find('.toggle-button[id="namesJSON"]').css('display', 'none');

    html.find('.editor[id="traitsJSON"]').css('display', 'none');
    html.find('.header-button[name="traitsJSON"]').css({ outline: 'unset', 'box-shadow': 'unset' });
    html.find('.toggle-button[id="traitsJSON"]').css('display', 'none');

    html.find('.editor[id="plothooksJSON"]').css('display', 'none');
    html.find('.header-button[name="plothooksJSON"]').css({ outline: 'unset', 'box-shadow': 'unset' });
    html.find('.toggle-button[id="plothooksJSON"]').css('display', 'none');

    html.find('.editor[id="professionsJSON"]').css('display', 'none');
    html.find('.header-button[name="professionsJSON"]').css({ outline: 'unset', 'box-shadow': 'unset' });
    html.find('.toggle-button[id="professionsJSON"]').css('display', 'none');

    html.find('.editor[id="racesJSON"]').css('display', 'none');
    html.find('.header-button[name="racesJSON"]').css({ outline: 'unset', 'box-shadow': 'unset' });
    html.find('.toggle-button[id="racesJSON"]').css('display', 'none');

    html.find('.editor[id="sexJSON"]').css('display', 'none');
    html.find('.header-button[name="sexJSON"]').css({ outline: 'unset', 'box-shadow': 'unset' });
    html.find('.toggle-button[id="sexJSON"]').css('display', 'none');

    html.find(`.editor[id="${visibleEditor}"]`).css('display', 'block');
    html.find(`.header-button[name="${visibleEditor}"]`).css({ outline: 'none', 'box-shadow': '0 0 5px red' });
    html.find(`.toggle-button[id="${visibleEditor}"]`).css('display', '');
  }

  checkPopup(html: JQuery<HTMLElement>, name: string, url: string | URL | undefined) {
    if (html.find(`.editor[id="${name}"]`).css('display') === 'block') {
      window.open(url, 'Example', 'menubar=no,status=no,height=600,width=500');
    }
  }

  /**
   * @param  {String} title
   */
  setTitle(title: string) {
    jQuery('#json-editor-menu header.window-header.flexrow.draggable.resizable h4.window-title')[0].textContent = title;
  }

  /**
   * @override
   * @private
   */
  _getHeaderButtons() {
    return [
      {
        label: 'Close',
        class: 'close',
        icon: 'fas fa-times',
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        onclick: (_ev: JQuery.ClickEvent) => {
          if (this.unsaved) {
            Dialog.confirm({
              title: game.i18n.localize('npcGen.confirm.close.Title'),
              content: `<p>${game.i18n.localize('npcGen.confirm.close.Desc')}</p>`,
              yes: () => {
                jQuery('#json-editor.json-code-editor button.save-json-button').trigger('click');
                setTimeout(() => {
                  this.close();
                }, 50);
              },
              no: () => this.close(),
              defaultYes: false,
            });
          } else {
            this.close();
          }
        },
      },
    ];
  }

  initEditorHtml() {
    this.createEditor('classesJSON');
    this.createEditor('languagesJSON');
    this.createEditor('namesJSON');
    this.createEditor('traitsJSON');
    this.createEditor('plothooksJSON');
    this.createEditor('professionsJSON');
    this.createEditor('racesJSON');
    this.createEditor('sexJSON');
  }

  sendToSettings() {
    game.settings.set(FVTTNPCGen.ID, 'classesJSON', this.editorArray['classesJSON']?.getValue());
    game.settings.set(FVTTNPCGen.ID, 'languagesJSON', this.editorArray['languagesJSON']?.getValue());
    game.settings.set(FVTTNPCGen.ID, 'namesJSON', this.editorArray['namesJSON']?.getValue());
    game.settings.set(FVTTNPCGen.ID, 'traitsJSON', this.editorArray['traitsJSON']?.getValue());
    game.settings.set(FVTTNPCGen.ID, 'plothooksJSON', this.editorArray['plothooksJSON']?.getValue());
    game.settings.set(FVTTNPCGen.ID, 'professionsJSON', this.editorArray['professionsJSON']?.getValue());
    game.settings.set(FVTTNPCGen.ID, 'racesJSON', this.editorArray['racesJSON']?.getValue());
    game.settings.set(FVTTNPCGen.ID, 'sexJSON', this.editorArray['sexJSON']?.getValue());
    ui.notifications.notify('Saved!');
    this.unsaved = false;
  }

  createEditor(name: string) {
    console.log('CREATE EDITOR', name);
    this.editorArray[name as keyof NPCEditor] = ace.edit(name);
    const editor = this.editorArray[name as keyof NPCEditor];
    if (!editor) return;
    editor.session.setMode('ace/mode/json');
    editor.setValue(game.settings.get(FVTTNPCGen.ID, name) as string, -1);
    editor.commands.addCommand({
      name: 'Save',
      bindKey: { win: 'Ctrl-S', mac: 'Command-S' },
      exec: this.sendToSettings,
    });
    editor.getSession().on('change', () => {
      if (this.unsaved === false) {
        this.unsaved = true;
      }
    });
    new ResizeObserver(() => {
      editor.resize();
      editor.renderer.updateFull();
    }).observe(editor.container);
  }
  /**
   * @param  {JQuery} html
   */
  resetSettings(html: JQuery<HTMLElement>) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _this = this;
    html.find('.editor').each(function (_index, element) {
      if (element.style.display === 'block') {
        const defaultVal = game.settings.settings.get(`npcgen.${element.id}`)?.default as string;
        _this.editorArray[element.id as keyof NPCEditor]?.setValue(defaultVal, -1);
      }
    });
  }
}

/**
 * @param  {String} string
 */
function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
