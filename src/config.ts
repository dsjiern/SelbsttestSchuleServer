import { DBuser, DBpwd, DBhost, DBport, DBsource, DBdb, MAILhost, MAILport, MAILsecure, MAILuser, MAILpwd, SERVERport, SERVERlisten, SERVERhost, ADMINmail } from './env';

export const DBDATA = {
  user: DBuser,
  pwd: DBpwd,
  host: DBhost,
  port: DBport,
  source: DBsource,
  db: DBdb,
};

export const SMTPDATA = {
  host: MAILhost,
  port: MAILport,
  secure: MAILsecure,
  user: MAILuser,
  pwd: MAILpwd,
};

export const SERVERDATA = {
  port: SERVERport, // 3000
  listen: SERVERlisten, // '127.0.0.1'
  host: SERVERhost, // 'https://www.selbsttest-schule.de'
};

export const ADMINDATA = {
  mail: ADMINmail,
};