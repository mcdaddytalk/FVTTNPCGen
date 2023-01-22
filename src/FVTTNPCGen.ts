// SPDX-FileCopyrightText: 2022 Johannes Loher
//
// SPDX-License-Identifier: MIT

/**
 * This is your TypeScript entry file for Foundry VTT.
 * Register custom settings, sheets, and constants using the Foundry API.
 * Change this heading to be more descriptive to your module, or remove it.
 * Author: [your name]
 * Content License: [copyright and-or license] If using an existing system
 * 					you may want to put a (link to a) license or copyright
 * 					notice here (e.g. the OGL).
 * Software License: [your license] Put your desired license here, which
 * 					 determines how others may use and modify your module.
 */

// Import TypeScript modules
import { registerJSONEditorSettings, registerSettings } from './module/settings';
import { preloadTemplates } from './module/preloadTemplates';
import { registerHelpers } from './module/handlebars';
import NPCGenerator from './application/NPCGenerator';
import generateNPC from './module/api';
import defaultApiOptions from './data/defaultApiOptions';
import { FVTTNPCGen } from './application/FVTTNPCGen';
import {
  ClassJSON,
  LanguagesJSON,
  ListJSON,
  NamesJSON,
  PlotHooksJSON,
  ProfessionsJSON,
  RacesJSON,
  SexJSON,
  TraitsJSON,
} from './lib/augments/generatorObject';

export let classesJSON: ClassJSON;
export let personalityTraitsJSON: TraitsJSON;
export let plotHooksJSON: PlotHooksJSON;
export let professionsJSON: ProfessionsJSON;
export let racesJSON: RacesJSON;
export let sexJSON: SexJSON;
export let listJSON: ListJSON;
export let languagesJSON: LanguagesJSON;
export let namesJSON: NamesJSON;

async function initJSON() {
  jQuery.getJSON('modules/FVTTNPCGen/data/classes.json', (json) => (classesJSON = json));
  jQuery.getJSON('modules/FVTTNPCGen/data/personalitytraits.json', (json) => (personalityTraitsJSON = json));
  jQuery.getJSON('modules/FVTTNPCGen/data/plothooks.json', (json) => (plotHooksJSON = json));
  jQuery.getJSON('modules/FVTTNPCGen/data/professions.json', (json) => (professionsJSON = json));
  jQuery.getJSON('modules/FVTTNPCGen/data/races.json', (json) => (racesJSON = json));
  jQuery.getJSON('modules/FVTTNPCGen/data/sex.json', (json) => (sexJSON = json));
  jQuery.getJSON('modules/FVTTNPCGen/data/lists.json', (json) => (listJSON = json));
  jQuery.getJSON('modules/FVTTNPCGen/data/languages.json', (json) => (languagesJSON = json));
  jQuery.getJSON('modules/FVTTNPCGen/data/names.json', (json) => (namesJSON = json));
}

// Initialize module
Hooks.once('init', async () => {
  console.log('FVTTNPCGen | Initializing FVTTNPCGen');

  // Assign custom classes and constants here

  /* -------------< Ace >------------ */
  [
    'ace/mode/json',
    'ace/ext/language_tools',
    'ace/ext/error_marker',
    'ace/theme/twilight',
    'ace/snippets/json',
  ].forEach((s) => ace.config.loadModule(s));
  /* -------------< End Ace >------------ */

  // Initialize generator JSONs
  initJSON();

  FVTTNPCGen.initialize();

  // handlebars helper that keeps disabled checkboxes off
  registerHelpers();

  // init variable for unsaved watcher
  window.npcGen = window.npcGen || {};

  // register settings for json editor
  registerJSONEditorSettings();

  // Register custom module settings
  registerSettings();

  // Preload Handlebars templates
  await preloadTemplates();

  // Register custom sheets (if any)

  // register api
  window.npcGen.generateNPC = generateNPC;
  window.npcGen.defaultApiOptions = defaultApiOptions;
  window.npcGen.NPCGenerator = NPCGenerator;
  window.npcGen.data = {
    classesJSON,
    languagesJSON,
    namesJSON,
    personalityTraitsJSON,
    plotHooksJSON,
    professionsJSON,
    racesJSON,
    sexJSON,
    listJSON,
  };
});

// Setup module
Hooks.once('setup', async () => {
  // Do anything after initialization but before
  // ready
});

// When ready
Hooks.once('ready', async () => {
  // Do anything once the module is ready
});

// Add any additional hooks if necessary
Hooks.on('renderActorDirectory', (actorDirectory: ActorDirectory, html: JQuery<HTMLElement>) => {
  if (game.user?.isGM) {
    const generateButton = jQuery(
      `<button class="npc-generator-btn"><i class="fas fa-fire"></i> Generate NPC</button>`,
    );
    html.find('.npc-generator-btn').remove();

    html.find('.directory-footer').append(generateButton);

    generateButton.on('click', (ev) => {
      ev.preventDefault();
      const generator = new NPCGenerator({
        classesJSON,
        languagesJSON,
        namesJSON,
        personalityTraitsJSON,
        plotHooksJSON,
        professionsJSON,
        racesJSON,
        sexJSON,
        listJSON,
      });
      generator.render(true);
    });
  }
});
