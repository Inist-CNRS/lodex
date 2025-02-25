import nodemailer from 'nodemailer';
import config from '../../../../config.json';

const transporterConfig =
    process.env.NODE_ENV === 'production'
        ? config.mail
        : {
              host: 'maildev',
              port: 1025,
          };

const transporter = nodemailer.createTransport(transporterConfig);

const from = config.mail.from;

export async function sendMail({ to, subject, text }) {
    return await transporter.sendMail({
        from,
        to,
        subject,
        text,
    });
}
