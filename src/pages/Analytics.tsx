import { motion } from 'framer-motion';
import { AnalyticsDashboard } from '@/components/Analytics/AnalyticsDashboard';

const Analytics = () => {
  return (
    <div className="container mx-auto px-6 py-8 pt-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <AnalyticsDashboard />
      </motion.div>
    </div>
  );
};

export default Analytics;