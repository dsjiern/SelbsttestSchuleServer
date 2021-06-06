import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { db } from './db';
import { initDB } from './init';

import { NestExpressApplication } from '@nestjs/platform-express';

import { CronJob } from 'cron';
import * as moment from 'moment';

import { SERVERDATA } from './config';

async function bootstrap(argv: string[]) {
  await db.connect();
  await initDB(argv.findIndex(a => a.toLowerCase() === 'init') !== -1, argv.findIndex(a => a.toLowerCase() === 'reset') !== -1);

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  await app.listen(SERVERDATA.port, SERVERDATA.listen);
}

let args: string[];
if (process.env.npm_config_argv) {
  args = JSON.parse(process.env.npm_config_argv || '').remain || [];
} else {
  args = process.argv.slice(2);
}

process.on('uncaughtException', (error) => {
  // tslint:disable-next-line:no-console
  console.error(error);
});

const cleanjob = new CronJob('0 0 * * * *', () => {
  const clearbefore = moment().subtract(60,'hours').format('YYYY-MM-DD HH:mm:ss');
  db.collection('test').deleteMany({ zeitpunkt: { $lt: clearbefore } })
}, null, true, 'Europe/Berlin');
cleanjob.start();

bootstrap(args).then();
