import nodemailer from 'nodemailer';
import config from '../../../../../config.json';

const transporterConfig =
    process.env.NODE_ENV === 'production'
        ? config.mail
        : {
              host: 'maildev',
              port: 1025,
          };

const transporter = transporterConfig
    ? nodemailer.createTransport(transporterConfig)
    : null;

const from = config.mail.from;

export async function sendMail({ to, subject, text }: any) {
    if (!transporter) {
        console.error('Mail not configured');
        return;
    }
    return await transporter.sendMail({
        from,
        to,
        subject,
        text,
    });
}
