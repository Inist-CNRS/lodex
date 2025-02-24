import nodemailer from 'nodemailer';
import config from '../../../config.json';

const transporterConfig =
    process.env.NODE_ENV !== 'production'
        ? config.mail
        : {
              smtp: 'maildev',
              smtp_port: 25,
          };

const transporter = nodemailer.createTransport(transporterConfig);

const from = config.mail.from;

export async function sendmail({ to, subject, text }) {
    return await transporter.sendMail({
        from,
        to,
        subject,
        text,
    });
}
