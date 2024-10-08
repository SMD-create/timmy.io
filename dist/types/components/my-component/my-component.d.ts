interface ChatMessage {
    type: string;
    content: any;
    isAIReply?: boolean;
}
export declare class MyComponent {
    /**
     * Backend chat messages
     */
    chatMessages: ChatMessage[];
    componentWillLoad(): Promise<void>;
    render(): any;
}
export {};
