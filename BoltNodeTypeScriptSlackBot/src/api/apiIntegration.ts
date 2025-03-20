import axios from 'axios';
import { logger } from '../utils/logger';
import { config } from '../config';
import { ConversaDocsRequest, ConversaDocsResponse } from '../types/conversadocs';

/**
 * Queries the ConversaDocs API with a user message
 * 
 * @param message - The user's message text
 * @param context - Additional context like userId and channelId
 * @returns The ConversaDocs API response
 */
export async function queryConversaDocs(
  message: string, 
  context: { userId: string; channelId: string }
): Promise<ConversaDocsResponse> {
  try {
    logger.info(`Querying ConversaDocs API for message: ${message.substring(0, 50)}...`);
    
    const request: ConversaDocsRequest = {
      query: message,
      userId: context.userId,
      maxResults: config.conversaDocs.maxResults,
      // Add any other parameters required by the ConversaDocs API
    };

    const response = await axios.post(
      config.conversaDocs.apiUrl,
      request,
      {
        headers: {
          'Authorization': `Bearer ${process.env.CONVERSADOCS_API_KEY}`,
          'Content-Type': 'application/json',
        }
      }
    );

    logger.info('ConversaDocs API response received');
    return response.data;
  } catch (error) {
    logger.error('Error querying ConversaDocs API:', error);
    
    if (axios.isAxiosError(error) && error.response) {
      logger.error(`ConversaDocs API error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
    }
    
    throw new Error('Failed to get response from ConversaDocs');
  }
}

/**
 * Gets document information from ConversaDocs
 * 
 * @param documentId - The document ID to retrieve
 * @returns The document information
 */
export async function getDocument(documentId: string): Promise<any> {
  try {
    const response = await axios.get(
      `${config.conversaDocs.apiUrl}/documents/${documentId}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.CONVERSADOCS_API_KEY}`,
          'Content-Type': 'application/json',
        }
      }
    );
    
    return response.data;
  } catch (error) {
    logger.error(`Error retrieving document ${documentId}:`, error);
    throw new Error('Failed to retrieve document information');
  }
}