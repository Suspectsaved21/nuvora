import { useState, useContext, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatContext from "@/context/ChatContext";
import { Message } from "@/types/chat";
import AuthContext from "@/context/AuthContext";

const TextChat = () => {
  const { user } = useContext(AuthContext);
  const { messages, sendMessage, partner, isConnected, isTyping, setIsTyping } = useContext(ChatContext);
  const [message, setMessage] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !isConnected) return;
    
    sendMessage(message.trim());
    setMessage("");
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    setIsTyping(e.target.value.length > 0);
  };
  
  return (
    <div className="h-full flex flex-col bg-secondary/50 dark:bg-secondary/30 rounded-lg border border-border">
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold">
          {isConnected && partner
            ? `Chat with ${partner.username}`
            : "Chat"}
        </h3>
      </div>
      
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          
          {isTyping && (
            <div className="flex items-center text-muted-foreground text-sm">
              <div className="flex space-x-1">
                <span className="animate-pulse">•</span>
                <span className="animate-pulse delay-100">•</span>
                <span className="animate-pulse delay-200">•</span>
              </div>
              <span className="ml-2">{partner?.username} is typing</span>
            </div>
          )}
        </div>
      </ScrollArea>
      
      <form onSubmit={handleSendMessage} className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Input
            value={message}
            onChange={handleInputChange}
            placeholder={
              isConnected
                ? "Type a message..."
                : "Waiting for connection..."
            }
            disabled={!isConnected}
            className="flex-1"
          />
          <Button
            type="submit"
            size="icon"
            disabled={!isConnected || !message.trim()}
            className="bg-purple hover:bg-purple-dark"
          >
            <Send size={16} />
          </Button>
        </div>
      </form>
    </div>
  );
};

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble = ({ message }: MessageBubbleProps) => {
  if (message.sender === "system") {
    return (
      <div className="flex justify-center">
        <div className="glass-morphism px-3 py-1 rounded-full text-sm text-center max-w-xs mx-auto">
          {message.text}
        </div>
      </div>
    );
  }
  
  return (
    <div
      className={`flex ${
        message.isOwn ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`px-4 py-2 rounded-2xl max-w-xs ${
          message.isOwn
            ? "bg-purple text-white rounded-br-none"
            : "bg-secondary dark:bg-secondary/50 rounded-bl-none"
        }`}
      >
        <div className="text-sm">{message.text}</div>
        <div className="text-xs opacity-70 text-right mt-1">
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
};

export default TextChat;
