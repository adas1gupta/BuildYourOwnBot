import os
import time
import re
from slack_sdk import WebClient
from slack_sdk.errors import SlackApiError

# Initialize the Slack client
slack_bot_token = os.environ.get('SLACK_BOT_TOKEN')
client = WebClient(token=slack_bot_token)

class SlackBot:
    def __init__(self):
        self.bot_id = self.get_bot_id()
        self.last_checked = time.time()
        
    def get_bot_id(self):
        """Get the bot's user ID"""
        try:
            result = client.auth_test()
            return result["user_id"]
        except SlackApiError as e:
            print(f"Error getting bot ID: {e.response['error']}")
            return None

    def listen_to_mentions(self, channel_id):
        """Listen to mentions of the bot in the specified channel"""
        try:
            result = client.conversations_history(channel=channel_id)
            messages = result["messages"]
            
            for message in messages:
                if f"<@{self.bot_id}>" in message.get("text", ""):
                    self.handle_mention(channel_id, message)
                    
        except SlackApiError as e:
            print(f"Error reading messages: {e.response['error']}")

    def handle_mention(self, channel_id, message):
        """Handle mentions of the bot"""
        try:
            # Extract the text without the mention
            text = message.get("text", "")
            text = re.sub(f"<@{self.bot_id}>", "", text).strip()
            
            # Generate response based on the message
            response = self.generate_response(text)
            
            # Send the response
            client.chat_postMessage(
                channel=channel_id,
                text=response,
                thread_ts=message.get("ts")  # Reply in thread if message is in a thread
            )
            
        except SlackApiError as e:
            print(f"Error handling mention: {e.response['error']}")

    def generate_response(self, text):
        """Generate a response based on the message text"""
        # Add your custom logic here
        if "hello" in text.lower():
            return "Hello! How can I help you today?"
        elif "help" in text.lower():
            return "I can help you with the following commands:\n- hello: Get a greeting\n- help: Show this help message"
        else:
            return "I received your message! Feel free to ask for 'help' to see what I can do."

    def list_channels(self):
        """List all public channels the bot has access to"""
        try:
            result = client.conversations_list(types="public_channel")
            channels = result["channels"]
            return channels
        except SlackApiError as e:
            print(f"Error listing channels: {e.response['error']}")
            return []

def main():
    bot = SlackBot()
    
    # Get list of channels
    channels = bot.list_channels()
    
    print(f"Bot is running and monitoring {len(channels)} channels")
    
    while True:
        try:
            # Monitor each channel the bot is in
            for channel in channels:
                bot.listen_to_mentions(channel["id"])
            
            # Wait before checking again to avoid rate limiting
            time.sleep(5)
            
        except Exception as e:
            print(f"Error in main loop: {str(e)}")
            time.sleep(5)

if __name__ == "__main__":
    main()