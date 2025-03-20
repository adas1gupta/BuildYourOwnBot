import { App } from '@slack/bolt';
import dotenv from 'dotenv';
import { handleEvents } from './handlers/events';
import { handleCommands } from './handlers/commands';
import { handleActions } from './handlers/actions';
import { queryConversaDocs } from './api/conversadocs';
import { logger } from './utils/logger';
import { formatMessage } from './utils/formatter';
import { config } from './config';

dotenv.config();
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: process.env.SOCKET_MODE === 'true',
  appToken: process.env.SOCKET_MODE === 'true' ? process.env.SLACK_APP_TOKEN : undefined,
});
handleEvents(app);
handleCommands(app);
handleActions(app);


// Basic message handler
app.message(async ({ message, say, client, context }) => {
  try {
    logger.info('Received message:', message);
    
    if ('text' in message && message.text && message.text.trim() !== '') {
      // Typing indicator to show the bot is processing
      await client.chat.postEphemeral({
        channel: message.channel,
        user: message.user,
        text: 'Thinking...'
      });
      
      // Query ConversaDocs API
      const response = await queryConversaDocs(message.text, {
        userId: message.user,
        channelId: message.channel
      });

      const formattedResponse = formatMessage(response);
      await say(formattedResponse);
    } else {
      await say('I received your message, but there was no text to respond to.');
    }
  } catch (error) {
    logger.error('Error processing message:', error);
    await say('Sorry, I encountered an error while processing your message.');
  }
});

app.error(async (error) => {
  logger.error('Application error:', error);
});

(async () => {
  try {
    const port = process.env.PORT || config.defaultPort || 3000;
    await app.start(port);
    logger.info(`⚡️ Slack ConversaDocs bot is running on port ${port}!`);
  } catch (error) {
    logger.error('Failed to start app:', error);
    process.exit(1);
  }
})();