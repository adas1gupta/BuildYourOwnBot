import { App } from '@slack/bolt';
import dotenv from 'dotenv';

dotenv.config();
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

app.message(async ({ message, say }) => {
  console.log('Received message:', message);
  
  if ('text' in message && message.text && message.text.trim() !== '') {
    await say(`You said: ${message.text}`);
    
    // Integrate with ConversaDocs API here

  } else {
    // No text
    await say('I received your message, but there was no text to respond to.');
  }
});


(async () => {
  await app.start(process.env.PORT || 3000);
  console.log('⚡️ Bolt app is running!');
})();