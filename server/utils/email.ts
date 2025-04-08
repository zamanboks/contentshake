import nodemailer from 'nodemailer';
import * as emailValidator from 'email-validator';
import disposableEmailDomains from 'disposable-email-domains';
import { randomBytes } from 'crypto';

// Set up email configuration
// For production, you would use actual SMTP credentials
// For development, we're using the "ethereal" test account service from nodemailer
let transporter: nodemailer.Transporter;

// Initialize the transporter
async function initializeTransporter() {
  // Create a test account if we don't have SMTP credentials
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log('Creating test email account...');
    const testAccount = await nodemailer.createTestAccount();
    
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    
    console.log('Test email credentials:', {
      user: testAccount.user,
      pass: testAccount.pass,
      preview: 'https://ethereal.email'
    });
  } else {
    // Use provided SMTP credentials
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
}

// Generate a random verification code
export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Generate a random reset token
export function generateResetToken(): string {
  return randomBytes(32).toString('hex');
}

// Send verification email
export async function sendVerificationEmail(email: string, code: string): Promise<boolean> {
  if (!transporter) {
    await initializeTransporter();
  }
  
  try {
    const info = await transporter.sendMail({
      from: '"ContentShake.ai" <verification@contentshake.ai>',
      to: email,
      subject: 'Verify Your Email Address',
      text: `Your verification code is: ${code}. This code will expire in 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #6366f1; padding: 20px; text-align: center; color: white;">
            <h1>ContentShake.ai</h1>
          </div>
          <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
            <h2>Verify Your Email Address</h2>
            <p>Thank you for signing up for ContentShake.ai. To complete your registration, please enter the following verification code:</p>
            <div style="background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 24px; letter-spacing: 5px; margin: 20px 0;">
              <strong>${code}</strong>
            </div>
            <p>This code will expire in 10 minutes.</p>
            <p>If you didn't request this verification, please ignore this email.</p>
          </div>
          <div style="background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #6b7280;">
            <p>&copy; ${new Date().getFullYear()} ContentShake.ai. All rights reserved.</p>
          </div>
        </div>
      `,
    });
    
    console.log('Verification email sent:', info.messageId);
    
    // If using ethereal email, log the preview URL
    if (info.messageId && !process.env.SMTP_HOST) {
      console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    }
    
    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    return false;
  }
}

// Check if email is valid and not from a disposable domain
export function isValidEmail(email: string): { isValid: boolean; reason?: string } {
  // Check basic email format
  if (!emailValidator.validate(email)) {
    return { isValid: false, reason: 'Invalid email format' };
  }
  
  // Check for disposable email domains
  const domain = email.split('@')[1].toLowerCase();
  if (disposableEmailDomains.includes(domain)) {
    return { isValid: false, reason: 'Disposable email domains are not allowed' };
  }
  
  return { isValid: true };
}

// Send password reset email
export async function sendPasswordResetEmail(email: string, token: string, resetUrl: string): Promise<boolean> {
  if (!transporter) {
    await initializeTransporter();
  }
  
  try {
    const info = await transporter.sendMail({
      from: '"ContentShake.ai" <noreply@contentshake.ai>',
      to: email,
      subject: 'Reset Your Password',
      text: `You requested to reset your password. Please click on the following link to reset your password: ${resetUrl}. This link will expire in 1 hour.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #6366f1; padding: 20px; text-align: center; color: white;">
            <h1>ContentShake.ai</h1>
          </div>
          <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
            <h2>Reset Your Password</h2>
            <p>You requested to reset your password. Click the button below to create a new password:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="background-color: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Reset Password</a>
            </div>
            <p>This link will expire in 1 hour.</p>
            <p>If you didn't request this password reset, please ignore this email.</p>
          </div>
          <div style="background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #6b7280;">
            <p>&copy; ${new Date().getFullYear()} ContentShake.ai. All rights reserved.</p>
          </div>
        </div>
      `,
    });
    
    console.log('Password reset email sent:', info.messageId);
    
    // If using ethereal email, log the preview URL
    if (info.messageId && !process.env.SMTP_HOST) {
      console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    }
    
    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return false;
  }
}

// Initialize the email transporter when the module is loaded
initializeTransporter().catch(console.error);