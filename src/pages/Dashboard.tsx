import { motion } from 'framer-motion';
import { UploadZone } from '@/components/Dashboard/UploadZone';
import { DocumentGrid } from '@/components/Dashboard/DocumentGrid';
import heroImage from '@/assets/hero-bg.jpg';

const Dashboard = () => {
  return (
    <div className="relative">
      {/* Hero Section with Background */}
      <div 
        className="relative min-h-[60vh] flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${heroImage})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/60 to-background" />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative text-center space-y-6 px-6"
        >
          <h1 className="text-5xl lg:text-6xl font-bold gradient-text">
            DocuChat AI
          </h1>
          <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Transform your documents into intelligent conversations. Upload, search, and chat with your content using advanced AI.
          </p>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-12"
        >

          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <UploadZone />
          </motion.div>

          {/* Documents Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <DocumentGrid />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;