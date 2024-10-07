import fetch from 'node-fetch';

export default async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Update to specific domain if needed
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }
  try {
    const apiUrl = 'https://chateasy.logbase.io/api/conversation?id=cdb63a0953cd227918b86be96d56f60d42993f5ff8de771d38adba7cfc1f74ed&storeId=timmy-demo.myshopify.com';

    // Fetch data from the external API
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!data.conversation) {
      return res.status(500).json({ error: 'No conversation found' });
    }

    // Extract and format messages
    const allMessages = data.conversation.map(item => item.messages || []);
    const flattenedMessages = allMessages.flatMap(item => item);

    const formattedMessages = flattenedMessages
      .filter(message => message)
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
      .flat();

    res.json({ chat: formattedMessages });
  } catch (error) {
    console.error('Error fetching conversation:', error);
    res.status(500).json({ error: 'Failed to fetch conversation' });
  }
};
