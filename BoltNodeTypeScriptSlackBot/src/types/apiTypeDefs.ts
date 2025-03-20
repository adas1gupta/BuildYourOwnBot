/**
 * API request payload
 */
export interface Request {
    query: string;
    userId: string;
    maxResults?: number;
    filters?: {
      tags?: string[];
      collections?: string[];
      dateRange?: {
        start: string;
        end: string;
      };
    };
  }
  
  /**
   * Result item from API query
   */
  export interface ResultItem {
    documentId: string;
    title: string;
    content: string;
    score: number;
    metadata: {
      author?: string;
      createdAt?: string;
      updatedAt?: string;
      source?: string;
      tags?: string[];
      collection?: string;
      url?: string;
    };
    highlights: {
      content: string[];
      title?: string[];
    };
  }
  
  /**
   * API response
   */
  export interface Response {
    results: ResultItem[];
    answer?: string;
    totalResults: number;
    processingTime: number;
    queryId: string;
  }
  
  /**
   * Document information
   */
  export interface Document {
    documentId: string;
    title: string;
    content: string;
    metadata: {
      author?: string;
      createdAt: string;
      updatedAt?: string;
      source?: string;
      tags?: string[];
      collection?: string;
      url?: string;
      fileType?: string;
      fileSize?: number;
    };
  }