import * as nodemailer from 'nodemailer';
import * as smtpMail from 'nodemailer-smtp-transport';

import { SMTPDATA } from './config';

export const sendmail = async (to: string, subject: string, html: string, attachment: Buffer) => {
  const transporter = nodemailer.createTransport(smtpMail({
    host: SMTPDATA.host,
    port: SMTPDATA.port,
    secure: SMTPDATA.secure,
    auth: {
      user: SMTPDATA.user,
      pass: SMTPDATA.pwd,
    },
    tls: {
      rejectUnauthorized: false
    }
  }))

  const sender = '"Selbsttest Schule" <noreply@selbsttest-schule.de>';
  const mailOptions: any = {
    from: sender,
    to,
    subject,
    html,
  };

  if (attachment) {
    mailOptions.attachments = [
      {
        filename: 'Testnachweis.pdf',
        content: attachment,
      },
    ]
  }

  return new Promise<void>((resolve, reject) => {
    transporter.sendMail(mailOptions, (err) => {
      if (err) return reject(err);
      resolve();
    })
  })
}