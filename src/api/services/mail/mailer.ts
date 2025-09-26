// @ts-expect-error TS(2792): Cannot find module 'nodemailer'. Did you mean to s... Remove this comment to see the full error message
import nodemailer from 'nodemailer';
import config from '../../../../config.json';

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
