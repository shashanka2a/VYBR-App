import nodemailer from 'nodemailer'

// Define OtpType enum locally to avoid Prisma client issues
enum OtpType {
  EMAIL_VERIFICATION = 'EMAIL_VERIFICATION',
  PASSWORD_RESET = 'PASSWORD_RESET'
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})

export async function sendOTPEmail(email: string, code: string, type: OtpType) {
  const subject = type === OtpType.EMAIL_VERIFICATION 
    ? 'Verify your email address' 
    : 'Reset your password'
  
  const template = type === OtpType.EMAIL_VERIFICATION 
    ? getVerificationEmailTemplate(code)
    : getPasswordResetEmailTemplate(code)

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject,
    html: template,
  }

  try {
    await transporter.sendMail(mailOptions)
    return { success: true }
  } catch (error) {
    console.error('Failed to send email:', error)
    return { success: false, error: 'Failed to send email' }
  }
}

function getVerificationEmailTemplate(code: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Verify Your Email</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .code-box { background: #f4f4f4; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0; }
            .code { font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #2563eb; }
            .footer { margin-top: 30px; font-size: 14px; color: #666; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Verify Your Email Address</h1>
            </div>
            <p>Thank you for registering! Please use the following 6-digit code to verify your email address:</p>
            <div class="code-box">
                <div class="code">${code}</div>
            </div>
            <p>This code will expire in 10 minutes. If you didn't request this verification, please ignore this email.</p>
            <div class="footer">
                <p>This is an automated message, please do not reply to this email.</p>
            </div>
        </div>
    </body>
    </html>
  `
}

function getPasswordResetEmailTemplate(code: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Reset Your Password</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .code-box { background: #f4f4f4; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0; }
            .code { font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #dc2626; }
            .footer { margin-top: 30px; font-size: 14px; color: #666; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Reset Your Password</h1>
            </div>
            <p>You requested to reset your password. Please use the following 6-digit code:</p>
            <div class="code-box">
                <div class="code">${code}</div>
            </div>
            <p>This code will expire in 10 minutes. If you didn't request this reset, please ignore this email.</p>
            <div class="footer">
                <p>This is an automated message, please do not reply to this email.</p>
            </div>
        </div>
    </body>
    </html>
  `
}