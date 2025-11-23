const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

(async () => {
  try {
    console.log('Using email config:');
    console.log({
      host: process.env.EMAIL_HOST || 'sandbox.smtp.mailtrap.io',
      port: process.env.EMAIL_PORT || '587',
      user: process.env.MAILTRAP_USER || process.env.EMAIL_USER,
      pass: process.env.MAILTRAP_PASS || process.env.EMAIL_PASS
    });

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'sandbox.smtp.mailtrap.io',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.MAILTRAP_USER || process.env.EMAIL_USER,
        pass: process.env.MAILTRAP_PASS || process.env.EMAIL_PASS
      }
    });

    // verify connection
    await transporter.verify();
    console.log('SMTP connection verified');

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'petfinder@exemplo.com',
      to: process.env.TEST_EMAIL_RECIPIENT || 'teste@example.com',
      subject: 'Teste SMTP PetFinder',
      text: 'Este é um e-mail de teste do PetFinder enviado via nodemailer.'
    });

    console.log('Message sent:', info.messageId);
    console.log(info);
  } catch (err) {
    console.error('Erro ao enviar teste de email:', err);
    process.exitCode = 1;
  }
})();
