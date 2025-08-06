import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PaperPlaneIcon, PersonIcon, RocketIcon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDocumentStore } from '@/stores/useDocumentStore';

export const ChatInterface = () => {
  const { 
    chatMessages, 
    isChatting, 
    currentMessage, 
    setCurrentMessage, 
    sendChatMessage, 
    clearChat 
  } = useDocumentStore();
  
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSend = async () => {
    if (!input.trim() || isChatting) return;
    
    const message = input.trim();
    setInput('');
    setCurrentMessage(message);
    
    await sendChatMessage(message);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="max-w-4xl mx-auto h-[600px] flex flex-col">
      {/* Chat Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between p-6 border-b border-glass-border"
      >
        <div>
          <h1 className="text-2xl font-bold gradient-text">
            Chat with Your Documents
          </h1>
          <p className="text-muted-foreground">
            Ask questions and get answers with source citations
          </p>
        </div>
        
        {chatMessages.length > 0 && (
          <Button 
            variant="outline" 
            onClick={clearChat}
            className="glass-button"
          >
            Clear Chat
          </Button>
        )}
      </motion.div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 hide-scrollbar">
        <AnimatePresence>
          {chatMessages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-primary flex items-center justify-center mb-6 floating">
                <RocketIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                Start a conversation
              </h3>
              <p className="text-muted-foreground mb-6">
                Ask me anything about your uploaded documents. I'll provide detailed answers with source references.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
                {[
                  "What are the main topics in my documents?",
                  "Summarize the key findings",
                  "What methodology was used?",
                  "Are there any technical requirements mentioned?"
                ].map((suggestion, index) => (
                  <motion.div
                    key={suggestion}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setInput(suggestion)}
                      className="w-full text-left justify-start glass-button"
                    >
                      {suggestion}
                    </Button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            chatMessages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-3 max-w-[80%] ${
                  message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}>
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-gradient-primary'
                  }`}>
                    {message.role === 'user' ? (
                      <PersonIcon className="w-4 h-4" />
                    ) : (
                      <RocketIcon className="w-4 h-4 text-white" />
                    )}
                  </div>

                  {/* Message Content */}
                  <div className={`space-y-2 ${message.role === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                    <Card className={`glass-card border-glass-border ${
                      message.role === 'user' 
                        ? 'bg-primary/10' 
                        : 'bg-secondary/50'
                    }`}>
                      <CardContent className="p-4">
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                          {message.content}
                        </p>
                      </CardContent>
                    </Card>

                    {/* Sources */}
                    {message.sources && message.sources.length > 0 && (
                      <div className="space-y-2 w-full">
                        <p className="text-xs text-muted-foreground">Sources:</p>
                        {message.sources.map((source, sourceIndex) => (
                          <motion.div
                            key={source.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: sourceIndex * 0.1 }}
                          >
                            <Card className="glass-card border-glass-border">
                              <CardContent className="p-3">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-xs font-medium text-primary">
                                    {source.documentName}
                                  </span>
                                  <Badge variant="outline" className="text-xs">
                                    {Math.round(source.score * 100)}% match
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground line-clamp-2">
                                  {source.content}
                                </p>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {/* Timestamp */}
                    <span className="text-xs text-muted-foreground">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isChatting && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start space-x-3"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
              <RocketIcon className="w-4 h-4 text-white" />
            </div>
            <Card className="glass-card border-glass-border">
              <CardContent className="p-4">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 border-t border-glass-border"
      >
        <div className="glass-card p-3 rounded-2xl border border-glass-border">
          <div className="flex items-end space-x-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask a question about your documents..."
              disabled={isChatting}
              className="border-0 bg-transparent resize-none placeholder:text-muted-foreground/70 focus-visible:ring-0 min-h-[20px] max-h-32"
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isChatting}
              size="sm"
              className="bg-gradient-primary hover:shadow-glow flex-shrink-0"
            >
              {isChatting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <PaperPlaneIcon className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};