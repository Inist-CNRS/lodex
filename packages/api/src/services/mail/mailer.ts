import nodemailer from 'nodemailer';
import config from 'config';

const transporter = nodemailer.createTransport({
    host: config.get('mail.host'),
    port: config.get('mail.port'),
});

export async function sendMail({ to, subject, text }: any) {
    return await transporter.sendMail({
        from: config.get('mail.from'),
        to,
        subject,
        text,
    });
}
