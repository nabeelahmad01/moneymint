import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export async function sendOTPEmail(email: string, otp: string, type: 'signup' | 'reset'): Promise<boolean> {
    const subject = type === 'signup'
        ? 'Verify Your Email - MoneyMint'
        : 'Reset Your Password - MoneyMint';

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; background: #0f0f0f; color: #fff; padding: 20px; }
        .container { max-width: 500px; margin: 0 auto; background: linear-gradient(135deg, #1a1a2e, #16213e); padding: 30px; border-radius: 15px; }
        .otp { font-size: 32px; font-weight: bold; color: #00d4ff; text-align: center; letter-spacing: 8px; padding: 20px; background: rgba(0,212,255,0.1); border-radius: 10px; margin: 20px 0; }
        .logo { text-align: center; font-size: 24px; font-weight: bold; color: #00d4ff; margin-bottom: 20px; }
        p { color: #ccc; line-height: 1.6; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">💰 MoneyMint</div>
        <h2 style="text-align: center; color: #fff;">${type === 'signup' ? 'Welcome!' : 'Password Reset'}</h2>
        <p>Your verification code is:</p>
        <div class="otp">${otp}</div>
        <p>This code will expire in 10 minutes.</p>
        <p style="color: #888; font-size: 12px;">If you didn't request this, please ignore this email.</p>
      </div>
    </body>
    </html>
  `;

    try {
        await transporter.sendMail({
            from: `"MoneyMint" <${process.env.EMAIL_USER}>`,
            to: email,
            subject,
            html,
        });
        return true;
    } catch (error) {
        console.error('Email send error:', error);
        return false;
    }
}
