import { h } from "@stencil/core";
export class MyComponent {
    constructor() {
        this.chatMessages = [];
    }
    async componentWillLoad() {
        try {
            const response = await fetch('http://localhost:5000/api/fetch-conversation'); // Replace with your backend URL
            if (response.ok) {
                const data = await response.json();
                this.chatMessages = data.chat; // Assuming the response structure is compatible
            }
            else {
                console.error('Error fetching chat messages');
            }
        }
        catch (error) {
            console.error('Error:', error);
        }
    }
    render() {
        return (h("div", { key: '4ed09a429e048f25b360f09cc0014a220724eb5c', class: "chat-container" }, h("div", { key: '7a2678396d1f26a7f622493940959bcccfa4452a', class: "chat-header" }, "Timmy AI"), h("div", { key: '69331ff5d6b9c4479e39af0fce1dbbe725c4f220', class: "chat-messages" }, this.chatMessages &&
            this.chatMessages.map((msg, index) => {
                if (msg.type === 'text') {
                    return (h("div", { class: `chat-message ${msg.isAIReply ? 'ai' : 'user'}`, key: index }, msg.content));
                }
                else if (msg.type === 'card') {
                    return (h("div", { class: "chat-card", key: index }, h("h4", null, msg.content.title.text), h("img", { src: msg.content.imageUrl, alt: msg.content.title.text }), h("a", { href: msg.content.productUrl, target: "_blank", rel: "noopener noreferrer" }, "View Product")));
                }
                return null; // In case of unrecognized message type
            }))));
    }
    static get is() { return "my-component"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() {
        return {
            "$": ["my-component.css"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["my-component.css"]
        };
    }
    static get states() {
        return {
            "chatMessages": {}
        };
    }
}
//# sourceMappingURL=my-component.js.map
