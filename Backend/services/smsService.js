import twilio from 'twilio';

const client = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN 
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

export const sendVerificationSMS = async (phone, code) => {
  try {
    if (!client) {
      console.log('📱 SMS Service not configured. Verification code:', code);
      return { success: true, message: 'SMS service not configured (development mode)' };
    }

    const message = await client.messages.create({
      body: `Your समाधान verification code is: ${code}. Valid for 10 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });

    console.log('✅ SMS sent successfully:', message.sid);
    return { success: true, messageSid: message.sid };
  } catch (error) {
    console.error('❌ SMS sending failed:', error);
    return { success: false, error: error.message };
  }
};

export const sendPasswordResetSMS = async (phone, code) => {
  try {
    if (!client) {
      console.log('📱 SMS Service not configured. Reset code:', code);
      return { success: true, message: 'SMS service not configured (development mode)' };
    }

    const message = await client.messages.create({
      body: `Your समाधान password reset code is: ${code}. Valid for 10 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });

    console.log('✅ Password reset SMS sent:', message.sid);
    return { success: true, messageSid: message.sid };
  } catch (error) {
    console.error('❌ Password reset SMS failed:', error);
    return { success: false, error: error.message };
  }
};
