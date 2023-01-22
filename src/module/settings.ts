// SPDX-FileCopyrightText: 2022 Johannes Loher
//
// SPDX-License-Identifier: MIT
import ExportSettings from '../application/ExportSettings';
import { FVTTNPCGen } from '../application/FVTTNPCGen';
import GeneratorWindow from '../application/GeneratorWindow';

export function registerSettings(): void {
  // Register any custom module settings here
  game.settings.register(FVTTNPCGen.ID, FVTTNPCGen.SETTINGS.REGISTERED_RACES, {
    scope: 'client',
    config: false,
    type: Array,
    default: [],
  });

  // settings for saving unchecked boxes
  game.settings.register(FVTTNPCGen.ID, FVTTNPCGen.SETTINGS.DISABLED_BOXES, {
    scope: 'client',
    config: false,
    type: Array,
    default: [],
  });

  // setting for saving weights
  game.settings.register(FVTTNPCGen.ID, FVTTNPCGen.SETTINGS.WEIGHTS, {
    scope: 'client',
    config: false,
    type: Object,
    default: {},
  });

  // settings for token images
  game.settings.register(FVTTNPCGen.ID, FVTTNPCGen.SETTINGS.IMAGE_LOCATIONS, {
    scope: 'world',
    config: false,
    type: Object,
    default: {},
  });

  // settings for class bound token images
  game.settings.register(FVTTNPCGen.ID, FVTTNPCGen.SETTINGS.ROLE_SPECIFIC_IMAGES, {
    name: game.i18n.localize(`npcGen.settings.${FVTTNPCGen.SETTINGS.ROLE_SPECIFIC_IMAGES}.Name`),
    hint: game.i18n.localize(`npcGen.settings.${FVTTNPCGen.SETTINGS.ROLE_SPECIFIC_IMAGES}.Hint`),
    scope: 'world',
    config: true,
    type: Boolean,
    default: false,
    // restricted: true,
  });

  // register json editor
  game.settings.registerMenu(FVTTNPCGen.ID, FVTTNPCGen.SETTINGS.JSON_EDITOR, {
    name: game.i18n.localize(`npcGen.settings.${FVTTNPCGen.SETTINGS.JSON_EDITOR}.Title`),
    label: game.i18n.localize(`npcGen.settings.${FVTTNPCGen.SETTINGS.JSON_EDITOR}.Label`),
    hint: game.i18n.localize(`npcGen.settings.${FVTTNPCGen.SETTINGS.JSON_EDITOR}.Hint`),
    icon: 'far fa-file-code',
    type: GeneratorWindow,
    restricted: true,
  });

  // register settings export
  game.settings.registerMenu(FVTTNPCGen.ID, FVTTNPCGen.SETTINGS.EXPORT_SETTINGS, {
    name: game.i18n.localize(`npcGen.settings.${FVTTNPCGen.SETTINGS.EXPORT_SETTINGS}.Title`),
    label: game.i18n.localize(`npcGen.settings.${FVTTNPCGen.SETTINGS.EXPORT_SETTINGS}.Label`),
    hint: game.i18n.localize(`npcGen.settings.${FVTTNPCGen.SETTINGS.EXPORT_SETTINGS}.Hint`),
    icon: 'fas fa-exchange-alt',
    type: ExportSettings,
    restricted: true,
  });
}

export function registerJSONEditorSettings(): void {
  // editor content settings

  game.settings.register(FVTTNPCGen.ID, FVTTNPCGen.SETTINGS.JSON.CLASSES, {
    scope: 'world',
    config: false,
    type: String,
    default: '{\n    \n}',
  });

  game.settings.register(FVTTNPCGen.ID, FVTTNPCGen.SETTINGS.JSON.LANGUAGES, {
    scope: 'world',
    config: false,
    type: String,
    default: '[\n    \n]',
  });

  game.settings.register(FVTTNPCGen.ID, FVTTNPCGen.SETTINGS.JSON.NAMES, {
    scope: 'world',
    config: false,
    type: String,
    default:
      '{\n    "First": {\n        "Male": {\n            \n        },\n        "Female": {\n            \n        }\n    },\n    "Last": {\n    \n    }\n}',
  });

  game.settings.register(FVTTNPCGen.ID, FVTTNPCGen.SETTINGS.JSON.TRAITS, {
    scope: 'world',
    config: false,
    type: String,
    default: '{\n    "Good Traits": [\n        \n    ],\n    "Bad Traits": [\n        \n    ]\n}',
  });

  game.settings.register(FVTTNPCGen.ID, FVTTNPCGen.SETTINGS.JSON.PLOTHOOKS, {
    scope: 'world',
    config: false,
    type: String,
    default: '{\n    \n}',
  });

  game.settings.register(FVTTNPCGen.ID, FVTTNPCGen.SETTINGS.JSON.PROFESSIONS, {
    scope: 'world',
    config: false,
    type: String,
    default:
      '{\n    "Learned": [\n        \n    ],\n    "Lesser Nobility": [\n        \n    ],\n    "Professional": [\n        \n    ],\n    "Working Class": [\n        \n    ],\n    "Martial": [\n        \n    ],\n    "Underclass": [\n        \n    ],\n    "Entertainer": [\n        \n    ]\n}',
  });

  game.settings.register(FVTTNPCGen.ID, FVTTNPCGen.SETTINGS.JSON.RACES, {
    scope: 'world',
    config: false,
    type: String,
    default: '{\n    \n}',
  });

  game.settings.register(FVTTNPCGen.ID, FVTTNPCGen.SETTINGS.JSON.SEX, {
    scope: 'world',
    config: false,
    type: String,
    default:
      '{\n    "Orientation": [\n        \n    ],\n    "Gender": [\n        \n    ],\n    "Relationship Status": [\n        \n    ]\n}',
  });

  game.settings.register(FVTTNPCGen.ID, FVTTNPCGen.SETTINGS.JSON.LIST, {
    scope: 'world',
    config: false,
    type: String,
    default: '{\n    "Skills": {\n    \n},\n     "Abilities": {\n    \n},\n    "Sizes":  {\n    \n}\n}',
  });

  // only custom settings

  game.settings.register(FVTTNPCGen.ID, FVTTNPCGen.SETTINGS.ONLY_JSON.CLASSES, {
    scope: 'world',
    config: false,
    type: Boolean,
    default: false,
  });

  game.settings.register(FVTTNPCGen.ID, FVTTNPCGen.SETTINGS.ONLY_JSON.LANGUAGES, {
    scope: 'world',
    config: false,
    type: Boolean,
    default: false,
  });

  game.settings.register(FVTTNPCGen.ID, FVTTNPCGen.SETTINGS.ONLY_JSON.NAMES, {
    scope: 'world',
    config: false,
    type: Boolean,
    default: false,
  });

  game.settings.register(FVTTNPCGen.ID, FVTTNPCGen.SETTINGS.ONLY_JSON.TRAITS, {
    scope: 'world',
    config: false,
    type: Boolean,
    default: false,
  });

  game.settings.register(FVTTNPCGen.ID, FVTTNPCGen.SETTINGS.ONLY_JSON.PLOTHOOKS, {
    scope: 'world',
    config: false,
    type: Boolean,
    default: false,
  });

  game.settings.register(FVTTNPCGen.ID, FVTTNPCGen.SETTINGS.ONLY_JSON.PROFESSIONS, {
    scope: 'world',
    config: false,
    type: Boolean,
    default: false,
  });

  game.settings.register(FVTTNPCGen.ID, FVTTNPCGen.SETTINGS.ONLY_JSON.RACES, {
    scope: 'world',
    config: false,
    type: Boolean,
    default: false,
  });

  game.settings.register(FVTTNPCGen.ID, FVTTNPCGen.SETTINGS.ONLY_JSON.SEX, {
    scope: 'world',
    config: false,
    type: Boolean,
    default: false,
  });

  game.settings.register(FVTTNPCGen.ID, FVTTNPCGen.SETTINGS.ONLY_JSON.LIST, {
    scope: 'world',
    config: false,
    type: Boolean,
    default: false,
  });

  game.settings.register(FVTTNPCGen.ID, FVTTNPCGen.SETTINGS.COMPAT_MODE, {
    scope: 'world',
    config: true,
    type: Boolean,
    default: true,
    name: game.i18n.localize(`npcGen.settings.${FVTTNPCGen.SETTINGS.COMPAT_MODE}.Name`),
    hint: game.i18n.localize(`npcGen.settings.${FVTTNPCGen.SETTINGS.COMPAT_MODE}.Hint`),
    // restricted: true,
  });
}
