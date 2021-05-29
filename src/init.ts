import * as prompt from 'prompt-async';

import { db } from './db';

const pr = async (message) => {
  return (await prompt.get({
    properties: {
      test: {
        message,
      },
    },
  }));
};

export const initDB = async (init: boolean, reset: boolean): Promise<void> => {
  prompt.start();

  console.log('initialisiere Datenbank...');

  const ed = db.getDB();
  const colls = ['schule','test'];

  if (reset) {
    const test = await pr('Wirklich löschen? Bitte mit "JA!" bestätigen!');

    if (test === 'JA!') {
      console.log('setze Collections zurück...');

      await Promise.all(colls.map(c => new Promise<void>(async (resolve) => {
        if (await ed.collection(c).findOne() !== null) {
          await new Promise(resolve2 => ed.collection(c).drop(resolve2));
        }
        resolve();
      })));
      console.log('   Collections geleert!');
    }
  }

  const collections: any[] = await new Promise(resolve => ed.listCollections().toArray((e, i) => resolve(i)));

  console.log('erstelle Collections...');
  colls.forEach(c => {
    if (!collections.find(C => C.name === c)) {
      ed.createCollection(c);
    }
  });
  console.log('   Collections erstellt!');

  console.log('Datenbank bereit!');
}