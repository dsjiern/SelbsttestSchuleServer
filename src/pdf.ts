import * as pdf from 'html-pdf';
import { AwesomeQR } from 'awesome-qr';

import { template } from './pdftemplate';
import { UUID } from './global/scalars/UUID';

import { SERVERDATA } from './config';

const options = {
  format: 'A4',
  orientation: 'portrait',
  border: '0mm',
  type: 'pdf',
}

export const createpdf = async (name: string, schule: string, telefon: string, zeitpunkt: string, id: UUID, geburt?: string, hersteller?: string) => {
  const url = `${SERVERDATA.host}/bestaetigen/${id}`

  const qr = await new AwesomeQR({
    text: url,
    size: 300,
    components: {
      data: {
        scale: 0.7,
      },
      timing: {
        scale: 0.7,
      },
      alignment: {
        scale: 0.7,
      },
      cornerAlignment: {
        scale: 0.7,
      }
    },
  }).draw()

  const content = template
    .replace('{{name}}', name)
    .replace('{{geburt}}', geburt ? `(geb. am: ${geburt})` : '')
    .replace('{{schule}}', schule)
    .replace('{{telefon}}', telefon)
    .replace('{{zeitpunkt}}', zeitpunkt)
    .replace('{{hersteller}}', hersteller ? `<u>Test-Hersteller:</u> ${hersteller}` : '')
    .replace('{{url}}', url)
    .replace('{{qr}}', 'data:image/png;base64,' + qr.toString('base64'))

  return new Promise<Buffer>((resolve, reject) => {
    pdf.create(content, options).toBuffer((err, res) => {
      if (err) return reject(err);
      return resolve(res);
    })
  });
}