export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    uri: process.env.MONGODB_URI,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: '7d',
  },
  rabbitmq: {
    url: process.env.RABBITMQ_URL || 'amqp://localhost:5672',
    queue: 'campaign_tasks',
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
    phoneNumber: process.env.SMS_PHONE_NUMBER,
  },
});
