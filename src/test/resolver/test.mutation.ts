import {Args, Int, Mutation, Resolver} from '@nestjs/graphql';
import { Test } from '../models/Test';
import { TestService } from '../test.service';
import {ITest} from '../models/ITest';
import {DateTime} from '../../global/scalars/DateTime';
import {HttpException} from '@nestjs/common';
import {checkPassword} from '../../generate';
import { v4 as uuid } from 'uuid';
import {SchuleService} from '../../schule/schule.service'
import {createpdf} from '../../pdf'
import {sendmail} from '../../mail'

@Resolver(() => Test)
export class TestMutation {
  constructor(
    private readonly service: TestService,
  ) {}

  @Mutation(() => Int, { nullable: false })
  async SendTests(
    @Args('dienststelle', { type: () => String, nullable: false }) dienststelle: string,
    @Args('passwort', { type: () => String, nullable: false }) passwort: string,
    @Args('zeitpunkt', { type: () => DateTime, nullable: false }) zeitpunkt: DateTime,
    @Args('daten', { type: () => [ITest], nullable: false }) daten: ITest[],
    @Args('hersteller', { type: () => String, nullable: true }) hersteller?: string,
  ): Promise<number> {
    const deutscheZeit = (zeitpunkt: DateTime): string => {
      const date = zeitpunkt.toString().split(' ')[0]
      const time = zeitpunkt.toString().split(' ')[1]

      return `${date.split('-').reverse().join('.')} ${time.substr(0, 5)}`;
    }

    const s = new SchuleService();
    const tmp = await s.find({ dienststelle, unconfirmed: { $exists: false } });

    if (tmp.length === 0) throw new HttpException('Keine Schule gefunden', 404);
    if (tmp.length > 1) throw new HttpException('Mehrere Einträge gefunden', 404);

    if (!checkPassword(passwort, (tmp[0] as undefined as any).passwort)) {
      throw new HttpException('AccessDenied', 403);
    }

    let successful = 0;
    let done = 0;
    let errors = [];

    daten.forEach(async (d) => {
      const neu = await this.service.insert({
        name: d.name,
        zeitpunkt,
        _schule: tmp[0]._id,
      })

      const pdf = await createpdf(d.name, tmp[0].name, tmp[0].telefon, deutscheZeit(zeitpunkt), neu._id, d.geburtsdatum, hersteller);

      const html = `
        <html>
            <body>
                <h1>Testergebnis</h1>
                <h3>Schnelltest in der Schule</h3>
                <p>${d.name} wurde am ${deutscheZeit(zeitpunkt)} getestet.</p>
                <h2><span style="background-color:greenyellow;">Ergebnis: NEGATIV</span></h2>
                <p>Hierbei handelt es sich um einen &quot;Antigen-Schnelltest&quot; unter Aufsicht einer unterwiesenen Lehrkraft.</p>
                <p>Im Anhang befindet sich die Bestätigung mit einem QR-Code zur Überprüfung.</p>
            </body>
        </html>
      `

      try {
        await sendmail(d.email.toString(), 'Testergebnis Schnelltest Schule', html, pdf);
        successful++;
        done++;
      } catch (e) {
        errors.push(e);
        done++;
      }
    })

    await new Promise<void>(async (resolve) => {
      const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))
      while (done !== daten.length) {
        await sleep(500);
      }
      resolve();
    })

    return successful;
  }
}
