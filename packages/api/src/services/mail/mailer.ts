import nodemailer from 'nodemailer';
import config from '../../../../../config.json';

// see docker-compose.dev.yml
const [ host, port ] = String(process.env.MAILER_HOST || 'localhost:1025').split(':')
const transporterConfig =
    process.env.NODE_ENV === 'production'
        ? config.mail
        : {
              host,
              port,
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
