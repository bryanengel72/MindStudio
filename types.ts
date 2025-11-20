export interface Agent {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  externalUrl: string; // Renamed from githubUrl to support generic links
  tags: string[];
  match: number; // Percentage match (Netflix style)
  rating: string; // TV-MA, PG-13, etc.
  duration: string; // e.g., "24/7 uptime"
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export enum ChatStatus {
  IDLE = 'IDLE',
  THINKING = 'THINKING',
  STREAMING = 'STREAMING',
  ERROR = 'ERROR'
}