import { difference } from 'underscore';

export function registerHelpers() {
  Handlebars.registerHelper('ischeckboxon', function (name, data) {
    const prefixes = ['Gender', 'Trait', 'Profession', 'RelationshipStatus', 'Orientation', 'Race', 'Class'];

    for (const prefix of prefixes) {
      if (data.data.root.disabledBoxes.includes(prefix + name)) {
        return false;
      }
    }

    return true;
  });

  // handlebars helper that keeps disabled checkboxes off
  Handlebars.registerHelper('ischeckboxonextended', function (name, data) {
    const prefixes = ['Gender', 'Trait', 'Profession', 'RelationshipStatus', 'Orientation', 'Race', 'Class'];

    for (const prefix of prefixes) {
      if (data.data.root.disabledBoxes.includes(prefix + name)) {
        return false;
      }
    }

    if (
      difference(game.settings.get('npcgen', 'registeredRaces') as unknown[], window.npcGen.globalRacesList).length !==
      0
    ) {
      setTimeout(() => game.settings.set('npcgen', 'registeredRaces', window.npcGen.globalRacesList), 1000);
      return false;
    }

    if (data.data.root.disabledBoxes.includes(name)) {
      return false;
    }

    return true;
  });

  // handlebars helper for getting probability weight
  Handlebars.registerHelper('npcGenProbWeight', function (name, type, data) {
    if (Object.keys(data.data.root.weights).includes('Prob' + type + name)) {
      return data.data.root.weights['Prob' + type + name];
    } else if (type === 'Trait') {
      return 3;
    } else {
      return 1;
    }
  });

  /**
   * @description concat function from just-handlebars-helpers
   *
   * @license https://github.com/leapfrogtechnology/just-handlebars-helpers/blob/master/LICENSE
   */
  Handlebars.registerHelper('concat', function (...params) {
    // Ignore the object appended by handlebars.
    if (typeof params[params.length - 1] === 'object') {
      params.pop();
    }

    return params.join('');
  });
}
