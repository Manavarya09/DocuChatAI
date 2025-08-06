import { create } from 'zustand';

export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: Date;
  processingStatus: 'uploading' | 'processing' | 'completed' | 'error';
  summary?: string;
  chunks?: number;
}

export interface SearchResult {
  id: string;
  documentId: string;
  documentName: string;
  content: string;
  score: number;
  metadata: Record<string, any>;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: SearchResult[];
  isTyping?: boolean;
}

interface DocumentStore {
  // Document state
  documents: Document[];
  uploadProgress: number;
  isUploading: boolean;
  
  // Search state
  searchQuery: string;
  searchResults: SearchResult[];
  isSearching: boolean;
  
  // Chat state
  chatMessages: ChatMessage[];
  isChatting: boolean;
  currentMessage: string;
  
  // View state
  currentView: 'dashboard' | 'search' | 'chat' | 'analytics';
  selectedDocument: Document | null;
  
  // Actions
  setCurrentView: (view: 'dashboard' | 'search' | 'chat' | 'analytics') => void;
  
  // Document actions
  addDocument: (document: Omit<Document, 'id' | 'uploadedAt'>) => void;
  updateDocument: (id: string, updates: Partial<Document>) => void;
  removeDocument: (id: string) => void;
  setUploadProgress: (progress: number) => void;
  setIsUploading: (uploading: boolean) => void;
  
  // Search actions
  setSearchQuery: (query: string) => void;
  setSearchResults: (results: SearchResult[]) => void;
  setIsSearching: (searching: boolean) => void;
  performSearch: (query: string) => Promise<void>;
  
  // Chat actions
  addChatMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  setIsChatting: (chatting: boolean) => void;
  setCurrentMessage: (message: string) => void;
  sendChatMessage: (message: string) => Promise<void>;
  clearChat: () => void;
}

export const useDocumentStore = create<DocumentStore>((set, get) => ({
  // Initial state
  documents: [],
  uploadProgress: 0,
  isUploading: false,
  
  searchQuery: '',
  searchResults: [],
  isSearching: false,
  
  chatMessages: [],
  isChatting: false,
  currentMessage: '',
  
  currentView: 'dashboard',
  selectedDocument: null,
  
  // Actions
  setCurrentView: (view) => set({ currentView: view }),
  
  // Document actions
  addDocument: (document) => {
    const newDocument: Document = {
      ...document,
      id: crypto.randomUUID(),
      uploadedAt: new Date(),
    };
    set((state) => ({ documents: [...state.documents, newDocument] }));
  },
  
  updateDocument: (id, updates) => {
    set((state) => ({
      documents: state.documents.map((doc) =>
        doc.id === id ? { ...doc, ...updates } : doc
      ),
    }));
  },
  
  removeDocument: (id) => {
    set((state) => ({
      documents: state.documents.filter((doc) => doc.id !== id),
    }));
  },
  
  setUploadProgress: (progress) => set({ uploadProgress: progress }),
  setIsUploading: (uploading) => set({ isUploading: uploading }),
  
  // Search actions
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSearchResults: (results) => set({ searchResults: results }),
  setIsSearching: (searching) => set({ isSearching: searching }),
  
  performSearch: async (query) => {
    set({ isSearching: true, searchQuery: query });
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Mock search results
    const mockResults: SearchResult[] = [
      {
        id: '1',
        documentId: '1',
        documentName: 'Research Paper.pdf',
        content: `This document discusses advanced machine learning techniques for natural language processing. The content includes detailed explanations of transformer architectures and their applications in modern AI systems.`,
        score: 0.95,
        metadata: { page: 1, section: 'Introduction' },
      },
      {
        id: '2',
        documentId: '2',
        documentName: 'Technical Specification.docx',
        content: `System requirements and architecture overview for the new platform. This section covers scalability considerations and performance benchmarks.`,
        score: 0.87,
        metadata: { page: 3, section: 'Architecture' },
      },
    ];
    
    set({ searchResults: mockResults, isSearching: false });
  },
  
  // Chat actions
  addChatMessage: (message) => {
    const newMessage: ChatMessage = {
      ...message,
      id: crypto.randomUUID(),
      timestamp: new Date(),
    };
    set((state) => ({
      chatMessages: [...state.chatMessages, newMessage],
    }));
  },
  
  setIsChatting: (chatting) => set({ isChatting: chatting }),
  setCurrentMessage: (message) => set({ currentMessage: message }),
  
  sendChatMessage: async (message) => {
    const { addChatMessage } = get();
    
    // Add user message
    addChatMessage({ role: 'user', content: message });
    
    set({ isChatting: true });
    
    // Simulate AI response
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    const aiResponse = `Based on your documents, here's what I found: The content you're asking about relates to advanced AI techniques and system architecture. According to the research paper, transformer architectures are particularly effective for natural language processing tasks.`;
    
    const sources: SearchResult[] = [
      {
        id: '1',
        documentId: '1',
        documentName: 'Research Paper.pdf',
        content: 'Transformer architectures and their applications...',
        score: 0.95,
        metadata: { page: 1, section: 'Introduction' },
      },
    ];
    
    addChatMessage({
      role: 'assistant',
      content: aiResponse,
      sources,
    });
    
    set({ isChatting: false });
  },
  
  clearChat: () => set({ chatMessages: [] }),
}));