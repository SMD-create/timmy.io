import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import serverless from 'serverless-http';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the backend!');
});

// Route to fetch conversation from external API
app.get('/api/fetch-conversation', async (req, res) => {
  try {
    const apiUrl = 'https://chateasy.logbase.io/api/conversation?id=cdb63a0953cd227918b86be96d56f60d42993f5ff8de771d38adba7cfc1f74ed&storeId=timmy-demo.myshopify.com';

    // Fetch data from the external API
    const response = await fetch(apiUrl);
    const data = await response.json();

    console.log('API Response:', data); // Log the response to see its structure

    if (!data.conversation) {
      return res.status(500).json({ error: 'No conversation found' });
    }

    // Extract and format the conversation messages
    const allMessages = data.conversation.map(item => item.messages || []);
    const flattenedMessages = allMessages.flatMap(item => item);
    const formattedMessages = flattenedMessages
      .filter(message => message) // Check for defined messages
      .map(message => {
        if (message.type === 'card' && Array.isArray(message.cards)) {
          return message.cards.map(card => ({
            type: 'card',
            content: {
              title: card.title,
              description: card.description,
              imageUrl: card.imageUrl,
              productUrl: card.buttons?.find(button => button.type === 'openUrl')?.url,
            },
            isAIReply: message.isAIReply,
          }));
        } else if (message.imageUrl) {
          return {
            type: 'image',
            content: message.imageUrl,
            productUrl: message.buttons?.find(button => button.type === 'openUrl')?.url,
            isAIReply: message.isAIReply,
          };
        } else {
          const formattedMessage = message.message
            .replace(/<\/?[^>]+(>|$)/g, '')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .replace(/\ \"/g, ' ')
            .replace(/\"/g, '')
            .replace(/\n/g, ' ');

          return {
            type: 'text',
            content: formattedMessage,
            isAIReply: message.isAIReply,
          };
        }
      })
      .flat(); // Flatten the array in case there are multiple cards per message

    res.json({ chat: formattedMessages });
  } catch (error) {
    console.error('Error fetching conversation:', error);
    res.status(500).json({ error: 'Failed to fetch conversation' });
  }
});

// Export the app as a serverless function
module.exports = app;
module.exports.handler = serverless(app);
