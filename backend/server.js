import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

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
    const apiUrl = 'https://chateasy.logbase.io/api/conversation?id=91b455e77f20b34b8b483265cb9ae0629c9bb20ab70db6b59de1db37039b652a&storeId=dazzling-aura.myshopify.com';

    // Fetch data from the external API
    const response = await fetch(apiUrl);
    const data = await response.json();

    console.log('API Response:', data); // Log the response to see its structure

    if (!data.conversation) {
      return res.status(500).json({ error: 'No conversation found' });
    }

    // Extract all messages from the conversation
    const allMessages = data.conversation.map(item => item.messages || []);
    console.log('All Messages before flattening:', allMessages); // Log allMessages before flatMap

    // Flatten the messages array
    const flattenedMessages = allMessages.flatMap(item => item);

    // Format the messages like a chat
    const formattedMessages = flattenedMessages
      .filter(message => message) // Check for defined messages
      .map(message => {
        if (message.type === 'card' && Array.isArray(message.cards)) {
          // Format card messages
          return message.cards.map(card => ({
            type: 'card',
            content: {
              title: card.title,          // Assuming card has a title property
              description: card.description, // Assuming card has a description property
              imageUrl: card.imageUrl,     // Assuming card has an imageUrl property
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

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
