import { motion, AnimatePresence } from 'framer-motion';
import { FileTextIcon, TrashIcon, EyeOpenIcon, ClockIcon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDocumentStore } from '@/stores/useDocumentStore';
import { formatDistanceToNow } from 'date-fns';

export const DocumentGrid = () => {
  const { documents, removeDocument } = useDocumentStore();

  const getFileIcon = (type: string) => {
    return FileTextIcon;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-500 border-green-500/30';
      case 'processing':
        return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      case 'error':
        return 'bg-red-500/20 text-red-500 border-red-500/30';
      default:
        return 'bg-blue-500/20 text-blue-500 border-blue-500/30';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (documents.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <FileTextIcon className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No documents yet</h3>
        <p className="text-muted-foreground">
          Upload your first document to get started with AI-powered search and chat.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Your Documents</h2>
        <Badge variant="secondary" className="glass-card">
          {documents.length} document{documents.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
      >
        <AnimatePresence>
          {documents.map((document, index) => {
            const FileIcon = getFileIcon(document.type);
            
            return (
              <motion.div
                key={document.id}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Card className="glass-card border-glass-border hover:shadow-glow transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                          <FileIcon className="w-5 h-5 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-medium truncate" title={document.name}>
                            {document.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {formatFileSize(document.size)}
                          </p>
                        </div>
                      </div>
                      
                      <Badge 
                        variant="outline" 
                        className={getStatusColor(document.processingStatus)}
                      >
                        {document.processingStatus}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="pb-3">
                    {document.summary && (
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                        {document.summary}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <ClockIcon className="w-3 h-3" />
                        <span>
                          {formatDistanceToNow(document.uploadedAt, { addSuffix: true })}
                        </span>
                      </div>
                      
                      {document.chunks && (
                        <span>{document.chunks} chunks</span>
                      )}
                    </div>
                  </CardContent>

                  <CardFooter className="pt-0">
                    <div className="flex items-center space-x-2 w-full">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 glass-button group-hover:border-primary/50"
                      >
                        <EyeOpenIcon className="w-3 h-3 mr-2" />
                        View
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeDocument(document.id)}
                        className="text-destructive hover:text-destructive glass-button"
                      >
                        <TrashIcon className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};