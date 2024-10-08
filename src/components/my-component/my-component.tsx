import { Component, State, h } from '@stencil/core';

interface ChatMessage {
  type: string; // e.g., 'text' or 'card'
  content: any; // can be a string for text or an object for cards
  isAIReply?: boolean; // Optional property to indicate if the message is from AI
}

@Component({
  tag: 'my-component',
  styleUrl: 'my-component.css',
  shadow: true,
})
export class MyComponent {
  /**
   * Backend chat messages
   */
  @State() chatMessages: ChatMessage[] = [];

  async componentWillLoad() {
    try {
      const response = await fetch('http://localhost:5000/api/fetch'); // Replace with your backend URL
      if (response.ok) {
        const data = await response.json();
        this.chatMessages = data.chat; // Assuming the response structure is compatible
      } else {
        console.error('Error fetching chat messages');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  render() {
    return (
      <div class="chat-container">
        <div class="chat-header">Timmy AI</div>
        <div class="chat-messages">
          {this.chatMessages &&
            this.chatMessages.map((msg, index) => {
              if (msg.type === 'text') {
                return (
                  <div class={`chat-message ${msg.isAIReply ? 'ai' : 'user'}`} key={index}>
                    {msg.content}
                  </div>
                );
              } else if (msg.type === 'card') {
                return (
                  <div class="chat-card" key={index}>
                    <h4>{msg.content.title.text}</h4>
                    <img src={msg.content.imageUrl} alt={msg.content.title.text} />
                    <a href={msg.content.productUrl} target="_blank" rel="noopener noreferrer">
                      View Product
                    </a>
                  </div>
                );
              }
              return null; // In case of unrecognized message type
            })}
        </div>
        {/*<div class="chat-input-container">
          <input type="text" class="chat-input" placeholder="Type your message..." />
          <button class="send-button">Send</button>
        </div>*/}
      </div>
    );
  }
}
