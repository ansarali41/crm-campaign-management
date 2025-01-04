export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  MONGODB_URI:
    process.env.MONGODB_URI || 'mongodb://localhost:27017/crm-campaign',
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: '7d',
  },
  rabbitmq: {
    url: process.env.RABBITMQ_URL || 'amqp://localhost:5672',
    email_queue: 'email_queue',
    sms_queue: 'sms_queue',
    campaign_queue: 'campaign_queue',
  },
  email: {
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT, 10) || 587,
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD,
  },
  sms: {
    accountSid: process.env.SMS_ACCOUNT_SID,
    authToken: process.env.SMS_AUTH_TOKEN,
    fromNumber: process.env.SMS_FROM_NUMBER,
  },
});
