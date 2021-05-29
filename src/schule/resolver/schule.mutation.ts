import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Schule } from '../models/Schule';
import { SchuleService } from '../schule.service';
import { EmailAddress } from '../../global/scalars/EmailAddress';
import { HttpException } from '@nestjs/common';
import { checkPassword, secureHash } from '../../generate';
import { v4 as uuid } from 'uuid';
import { sendmail } from '../../mail';

import { ADMINDATA } from '../../config';

@Resolver(() => Schule)
export class SchuleMutation {
  constructor(
    private readonly service: SchuleService,
  ) {}

  @Mutation(() => Schule, { nullable: true })
  async Register(
    @Args('name', { type: () => String, nullable: false }) name: string,
    @Args('dienststelle', { type: () => String, nullable: false }) dienststelle: string,
    @Args('passwort', { type: () => String, nullable: false }) passwort: string,
    @Args('ansprechperson', { type: () => String, nullable: false }) ansprechperson: string,
    @Args('email', { type: () => EmailAddress, nullable: false }) email: string,
    @Args('telefon', { type: () => String, nullable: false }) telefon: string,
  ): Promise<Schule> {
    const set = {
      _id: uuid(),
      name,
      dienststelle,
      passwort: await secureHash(passwort),
      ansprechperson,
      email,
      telefon,
      unconfirmed: true
    }

    sendmail(ADMINDATA.mail, 'Neue Schule hat sich registriert', `<html><body><h1>Neue Schule:</h1><p>${name}</p></body></html>`, null);

    return this.service.insert(set);
  }

  @Mutation(() => Schule, { nullable: false })
  async SetDaten(
    @Args('dienststelle', { type: () => String, nullable: false }) dienststelle: string,
    @Args('passwort', { type: () => String, nullable: false }) passwort: string,
    @Args('daten', { type: () => String, nullable: false }) daten: string,
  ): Promise<Schule> {
    const tmp = await this.service.find({ dienststelle, unconfirmed: { $exists: false } });

    if (tmp.length === 0) throw new HttpException('Keine Schule gefunden', 404);
    if (tmp.length > 1) throw new HttpException('Mehrere Einträge gefunden', 404);

    if (!checkPassword(passwort, (tmp[0] as undefined as any).passwort)) {
      throw new HttpException('AccessDenied', 403);
    }

    return this.service.update(tmp[0]._id, { $set: { daten } });
  }

  @Mutation(() => Boolean, { nullable: false })
  async DelSchule(
    @Args('dienststelle', { type: () => String, nullable: false }) dienststelle: string,
    @Args('passwort', { type: () => String, nullable: false }) passwort: string,
  ): Promise<boolean> {
    const tmp = await this.service.find({ dienststelle, unconfirmed: { $exists: false } });

    if (tmp.length === 0) throw new HttpException('Keine Schule gefunden', 404);
    if (tmp.length > 1) throw new HttpException('Mehrere Einträge gefunden', 404);

    if (!checkPassword(passwort, (tmp[0] as undefined as any).passwort)) {
      throw new HttpException('AccessDenied', 403);
    }

    this.service.delete(tmp[0]._id);
    return true;
  }
}
