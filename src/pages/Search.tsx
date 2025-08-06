import { motion } from 'framer-motion';
import { SearchInterface } from '@/components/Search/SearchInterface';

const Search = () => {
  return (
    <div className="container mx-auto px-6 py-8 pt-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-[600px]"
      >
        <SearchInterface />
      </motion.div>
    </div>
  );
};

export default Search;