import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MagnifyingGlassIcon, FileTextIcon, ArrowRightIcon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDocumentStore } from '@/stores/useDocumentStore';

const suggestedQueries = [
  "Explain the main concepts",
  "What are the key findings?",
  "Summarize the methodology",
  "Technical requirements",
  "Implementation details",
];

export const SearchInterface = () => {
  const { 
    searchQuery, 
    searchResults, 
    isSearching, 
    setSearchQuery, 
    performSearch 
  } = useDocumentStore();
  
  const [localQuery, setLocalQuery] = useState(searchQuery);

  const handleSearch = async (query: string = localQuery) => {
    if (!query.trim()) return;
    setSearchQuery(query);
    await performSearch(query);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setLocalQuery(suggestion);
    handleSearch(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-primary/20 text-primary px-1 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Search Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-3xl font-bold gradient-text">
          Search Your Documents
        </h1>
        <p className="text-muted-foreground">
          Use AI-powered semantic search to find exactly what you're looking for
        </p>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative"
      >
        <div className="relative glass-card p-2 rounded-2xl border border-glass-border">
          <div className="flex items-center space-x-3">
            <MagnifyingGlassIcon className="w-5 h-5 text-muted-foreground ml-3" />
            <Input
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask anything about your documents..."
              className="border-0 bg-transparent text-lg placeholder:text-muted-foreground/70 focus-visible:ring-0"
            />
            <Button
              onClick={() => handleSearch()}
              disabled={!localQuery.trim() || isSearching}
              className="mr-1 bg-gradient-primary hover:shadow-glow"
            >
              {isSearching ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <ArrowRightIcon className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Suggested Queries */}
      {!searchQuery && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <h3 className="text-sm font-medium text-muted-foreground">
            Suggested searches:
          </h3>
          <div className="flex flex-wrap gap-2">
            {suggestedQueries.map((suggestion, index) => (
              <motion.div
                key={suggestion}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + index * 0.05 }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="glass-button hover:border-primary/50"
                >
                  {suggestion}
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Search Results */}
      <AnimatePresence>
        {searchResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                Search Results
              </h2>
              <Badge variant="secondary" className="glass-card">
                {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
              </Badge>
            </div>

            <div className="space-y-4">
              {searchResults.map((result, index) => (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -2 }}
                >
                  <Card className="glass-card border-glass-border hover:shadow-glow transition-all duration-300 cursor-pointer">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <FileTextIcon className="w-5 h-5 text-primary" />
                          <div>
                            <h3 className="font-medium">{result.documentName}</h3>
                            <p className="text-sm text-muted-foreground">
                              {result.metadata.section} • Page {result.metadata.page}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline" className="glass-card">
                          {Math.round(result.score * 100)}% match
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">
                        {highlightText(result.content, searchQuery)}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading State */}
      {isSearching && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="w-8 h-8 mx-auto border-2 border-primary/30 border-t-primary rounded-full animate-spin mb-4" />
          <p className="text-muted-foreground">Searching through your documents...</p>
        </motion.div>
      )}

      {/* No Results */}
      {searchQuery && !isSearching && searchResults.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <MagnifyingGlassIcon className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No results found</h3>
          <p className="text-muted-foreground">
            Try rephrasing your search or uploading more documents.
          </p>
        </motion.div>
      )}
    </div>
  );
};