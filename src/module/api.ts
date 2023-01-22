import {
  classesJSON,
  languagesJSON,
  namesJSON,
  personalityTraitsJSON,
  plotHooksJSON,
  professionsJSON,
  racesJSON,
  sexJSON,
  listJSON,
} from '../FVTTNPCGen';
import NPCGenerator from '../application/NPCGenerator';
import defaultOptions from '../data/defaultApiOptions';
import { DefaultNPCOptions, NPCObject } from '../lib/augments/generatorObject';

/**
 * @param {number} [amount=1]
 * @param {defaultOptions} [options={}]
 */
export default async function generateNPC(amount = 1, options: Partial<DefaultNPCOptions>, fillDefault = false) {
  if (options.createFoolishNumber !== true && amount > 64) {
    ui.notifications.warn(game.i18n.localize('npcGen.error.ui'));
    throw new Error(game.i18n.localize('npcGen.error.console'));
  }

  let confirmed = false;

  await Dialog.confirm({
    title: game.i18n.localize('npcGen.confirm.apply.Title'),
    content: `<p>${game.i18n.localize('npcGen.amountToGen').replace('%n', amount.toString())}</p>`,
    yes: () => {
      confirmed = true;
    },
    defaultYes: false,
  });

  if (!confirmed) return;

  if (fillDefault) {
    jQuery.extend(true, options, defaultOptions as DefaultNPCOptions);
    // Object.keys(defaultOptions as DefaultNPCOptions).forEach((key) => {
    //   if (key in options === false) options[key as NPCOptionIndex] = defaultOptions[key as NPCOptionIndex];
    // });
  }
  const actors = [];

  for (let i = 1; i < amount + 1; i++) {
    const generator = new NPCGenerator({
      classesJSON: classesJSON,
      languagesJSON: languagesJSON,
      namesJSON: namesJSON,
      personalityTraitsJSON: personalityTraitsJSON,
      plotHooksJSON: plotHooksJSON,
      professionsJSON: professionsJSON,
      racesJSON: racesJSON,
      sexJSON: sexJSON,
      listJSON: listJSON,
    });

    await generator.generateNPC(options as NPCObject);
    const actorData = await generator._apiSave();
    generator.close();
    if (actorData) actors.push(actorData);
  }

  console.log(actors);

  return await Actor.createDocuments(actors); // CONFIG.Actor.documentClass.create(actors);
}
