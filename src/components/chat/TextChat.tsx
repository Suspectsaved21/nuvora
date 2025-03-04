
import { useState, useContext, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatContext from "@/context/ChatContext";
import { Message } from "@/types/chat";
import AuthContext from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const TextChat = () => {
  const { user } = useContext(AuthContext);
  const { messages, sendMessage, partner, isConnected, isTyping, setIsTyping } = useContext(ChatContext);
  const [message, setMessage] = useState("");
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  // Update local messages when context messages change
  useEffect(() => {
    setLocalMessages(messages);
  }, [messages]);
  
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [localMessages]);
  
  // Set up real-time subscription for new messages
  useEffect(() => {
    if (!user || !partner || !isConnected) return;
    
    // Only set up the subscription for real Supabase users
    if (partner.id && partner.id.length > 10) {
      const channel = supabase
        .channel('messages-updates')
        .on('postgres_changes', 
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `receiver_id=eq.${user.id}`
          }, 
          (payload) => {
            // Only add messages from the current partner
            if (payload.new.sender_id === partner.id) {
              const newMessage: Message = {
                id: payload.new.id,
                sender: payload.new.sender_id,
                text: payload.new.content,
                timestamp: new Date(payload.new.created_at).getTime(),
                isOwn: false
              };
              
              // Check if message already exists to prevent duplicates
              if (!localMessages.some(m => m.id === newMessage.id)) {
                setLocalMessages(prev => [...prev, newMessage]);
              }
            }
          })
        .subscribe();
        
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user, partner, isConnected, localMessages]);
  
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
          {localMessages.map((msg) => (
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
