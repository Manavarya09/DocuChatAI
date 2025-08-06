import { Header } from '@/components/Layout/Header';
import { useDocumentStore } from '@/stores/useDocumentStore';
import Dashboard from './Dashboard';
import Search from './Search';
import Chat from './Chat';
import Analytics from './Analytics';

const Index = () => {
  const { currentView } = useDocumentStore();

  const renderCurrentView = () => {
    switch (currentView) {
      case 'search':
        return <Search />;
      case 'chat':
        return <Chat />;
      case 'analytics':
        return <Analytics />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {renderCurrentView()}
    </div>
  );
};

export default Index;
