import { motion } from 'framer-motion';
import { MagnifyingGlassIcon, ChatBubbleIcon, BarChartIcon, FileTextIcon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import { useDocumentStore } from '@/stores/useDocumentStore';

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: FileTextIcon },
  { id: 'search', label: 'Search', icon: MagnifyingGlassIcon },
  { id: 'chat', label: 'Chat', icon: ChatBubbleIcon },
  { id: 'analytics', label: 'Analytics', icon: BarChartIcon },
] as const;

export const Header = () => {
  const { currentView, setCurrentView } = useDocumentStore();

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-glass-border"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <FileTextIcon className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold gradient-text">
              DocuChat AI
            </h1>
          </motion.div>

          {/* Navigation */}
          <nav className="flex items-center space-x-2">
            {navigationItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setCurrentView(item.id as any)}
                    className={`
                      relative transition-all duration-300
                      ${isActive 
                        ? 'bg-primary text-primary-foreground shadow-glow' 
                        : 'hover:bg-secondary/50'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.label}
                    
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-primary rounded-md -z-10"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </Button>
                </motion.div>
              );
            })}
          </nav>

          {/* User Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3"
          >
            <Button variant="outline" size="sm" className="glass-button">
              Settings
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
};