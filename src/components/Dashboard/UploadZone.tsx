import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadIcon, FileTextIcon, Cross2Icon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useDocumentStore } from '@/stores/useDocumentStore';
import { toast } from '@/hooks/use-toast';

interface UploadFile extends File {
  id: string;
  progress: number;
  status: 'uploading' | 'processing' | 'completed' | 'error';
}

export const UploadZone = () => {
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const { addDocument, setIsUploading } = useDocumentStore();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: UploadFile[] = acceptedFiles.map(file => ({
      ...file,
      id: crypto.randomUUID(),
      progress: 0,
      status: 'uploading' as const,
    }));

    setUploadFiles(prev => [...prev, ...newFiles]);
    setIsUploading(true);

    // Simulate upload process
    newFiles.forEach(file => {
      simulateUpload(file);
    });
  }, []);

  const simulateUpload = async (file: UploadFile) => {
    // Simulate upload progress
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setUploadFiles(prev => 
        prev.map(f => f.id === file.id ? { ...f, progress } : f)
      );
    }

    // Switch to processing
    setUploadFiles(prev => 
      prev.map(f => f.id === file.id ? { ...f, status: 'processing' } : f)
    );

    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Complete
    setUploadFiles(prev => 
      prev.map(f => f.id === file.id ? { ...f, status: 'completed' } : f)
    );

    // Add to store
    addDocument({
      name: file.name,
      type: file.type,
      size: file.size,
      processingStatus: 'completed',
      summary: 'Document successfully processed and indexed for search.',
      chunks: Math.floor(Math.random() * 50) + 10,
    });

    toast({
      title: "Document uploaded",
      description: `${file.name} has been successfully processed.`,
    });

    // Remove from upload list after 3 seconds
    setTimeout(() => {
      setUploadFiles(prev => prev.filter(f => f.id !== file.id));
    }, 3000);
  };

  const removeFile = (fileId: string) => {
    setUploadFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'text/markdown': ['.md'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <div 
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer
          transition-all duration-300 glass-card
          ${isDragActive 
            ? 'border-primary bg-primary/5 shadow-glow' 
            : 'border-glass-border hover:border-primary/50'
          }
        `}
      >
        <input {...getInputProps()} />
        
        <motion.div
          animate={{ 
            y: isDragActive ? -10 : 0,
            scale: isDragActive ? 1.1 : 1,
          }}
          className="space-y-4"
        >
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-primary flex items-center justify-center floating">
            <UploadIcon className="w-8 h-8 text-white" />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">
              {isDragActive ? 'Drop files here' : 'Upload Documents'}
            </h3>
            <p className="text-muted-foreground mb-4">
              Drag & drop your documents or click to browse
            </p>
            <p className="text-sm text-muted-foreground">
              Supports PDF, DOC, DOCX, TXT, MD (max 10MB)
            </p>
          </div>
          
          <Button variant="outline" className="glass-button">
            Choose Files
          </Button>
        </motion.div>
      </div>

      {/* Upload Progress */}
      <AnimatePresence>
        {uploadFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-3"
          >
            <h4 className="font-medium text-sm text-muted-foreground">
              Uploading {uploadFiles.length} file(s)
            </h4>
            
            {uploadFiles.map((file) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="glass-card p-4 rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <FileTextIcon className="w-5 h-5 text-primary" />
                    <span className="font-medium text-sm">{file.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-muted-foreground capitalize">
                      {file.status}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(file.id)}
                      className="w-6 h-6 p-0"
                    >
                      <Cross2Icon className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                
                {file.status === 'uploading' && (
                  <Progress value={file.progress} className="h-2" />
                )}
                
                {file.status === 'processing' && (
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                    <span className="text-xs text-muted-foreground">
                      Processing and indexing...
                    </span>
                  </div>
                )}
                
                {file.status === 'completed' && (
                  <div className="flex items-center space-x-2 text-green-500">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-xs">Completed successfully</span>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};