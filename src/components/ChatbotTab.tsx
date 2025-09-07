import { useState } from "react";
import { Send, Mic, Paperclip, MoreVertical } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Progress } from "./ui/progress";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface Message {
  id: number;
  content: string;
  isBot: boolean;
  timestamp: Date;
  typing?: boolean;
}

const initialMessages: Message[] = [
  {
    id: 1,
    content: "Hi! I'm VYBR AI, your personal housing assistant! 🏠 I can help you find the perfect place to live, connect with compatible roommates, and discover campus events. What would you like to explore today?",
    isBot: true,
    timestamp: new Date(Date.now() - 300000)
  },
  {
    id: 2,
    content: "Hey! I'm looking for a place near campus for next semester. Preferably something under $700/month with good study spaces.",
    isBot: false,
    timestamp: new Date(Date.now() - 240000)
  },
  {
    id: 3,
    content: "Perfect! I found several great options for you. Based on your budget and preferences, here are the top matches:\n\n🏢 **West Campus Dorms** - $650/month\n• 5 min walk to campus\n• 24/7 study lounges\n• High-speed WiFi\n\n🏠 **Campus View Apartments** - $680/month\n• Shuttle service to campus\n• Quiet study environment\n• Parking included\n\nWould you like more details about either of these?",
    isBot: true,
    timestamp: new Date(Date.now() - 180000)
  }
];

export function ChatbotTab() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [progress, setProgress] = useState(75);

  const sendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: messages.length + 1,
      content: inputValue,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const botResponse: Message = {
        id: messages.length + 2,
        content: "Let me help you with that! I'm analyzing the best options based on your preferences... 🤔",
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
      setProgress(prev => Math.min(prev + 10, 100));
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto md:my-6 md:rounded-xl md:shadow-lg md:border md:border-gray-200 md:overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 md:p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <ImageWithFallback 
                src="https://images.unsplash.com/photo-1666597107756-ef489e9f1f09?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBSSUyMHJvYm90JTIwYXZhdGFyJTIwZnJpZW5kbHl8ZW58MXx8fHwxNzU3MjM5ODUyfDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="VYBR AI Avatar"
                className="w-8 h-8 rounded-full object-cover"
              />
            </div>
            <div>
              <h2 className="font-semibold">VYBR AI Assistant</h2>
              <p className="text-xs text-white/80">Online • Ready to help</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-xs">
            <span>Profile Completion</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2 bg-white/20" />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 md:p-6 space-y-4 md:space-y-6 overflow-y-auto pb-20 md:pb-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}>
            <div className={`flex max-w-[85%] ${message.isBot ? 'flex-row' : 'flex-row-reverse'} items-end space-x-2`}>
              {message.isBot && (
                <Avatar className="w-8 h-8 mb-1">
                  <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-xs">
                    AI
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div className={`p-3 rounded-2xl ${
                message.isBot 
                  ? 'bg-gray-100 text-gray-800 rounded-bl-sm' 
                  : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-br-sm'
              }`}>
                <p className="whitespace-pre-wrap">{message.content}</p>
                <p className={`text-xs mt-1 ${message.isBot ? 'text-gray-500' : 'text-white/70'}`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-end space-x-2">
              <Avatar className="w-8 h-8 mb-1">
                <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-xs">
                  AI
                </AvatarFallback>
              </Avatar>
              <div className="bg-gray-100 p-3 rounded-2xl rounded-bl-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 md:p-6 bg-white border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="text-gray-500">
            <Paperclip className="w-5 h-5" />
          </Button>
          
          <div className="flex-1 relative">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about housing, roommates, or events..."
              className="pr-10 rounded-full border-gray-300"
            />
            <Button 
              variant="ghost" 
              size="sm" 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              <Mic className="w-4 h-4" />
            </Button>
          </div>
          
          <Button 
            onClick={sendMessage}
            className="rounded-full w-10 h-10 p-0 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Quick Actions */}
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {["Find Housing", "Match Roommates", "Campus Events", "Budget Calculator"].map((action) => (
            <Button 
              key={action} 
              variant="outline" 
              size="sm" 
              className="whitespace-nowrap text-xs rounded-full border-gray-300 hover:bg-gray-50"
              onClick={() => setInputValue(action)}
            >
              {action}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}