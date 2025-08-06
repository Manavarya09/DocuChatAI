import { motion } from 'framer-motion';
import { ChatInterface } from '@/components/Chat/ChatInterface';

const Chat = () => {
  return (
    <div className="container mx-auto px-6 py-8 pt-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-[600px]"
      >
        <ChatInterface />
      </motion.div>
    </div>
  );
};

export default Chat;