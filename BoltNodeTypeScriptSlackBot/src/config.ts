/**
 * Application configuration
 */
export const config = {
    // Default port for the application
    defaultPort: 3000,
    
    // Slack configuration
    slack: {
      // Maximum number of results to show in a single message
      maxResultsPerMessage: 5,
      
      // Bot display settings
      bot: {
        name: 'First Slack Bot',
        icon: ':mag:', // Emoji for the bot
      },
      
      // Command configuration
      commands: {
        search: '/search',
        help: '/whatever-help',
        feedback: '/feedback',
      },
    },
    
    // API configuration
    conversaDocs: {
      // API URL - should be overridden by environment variable
      apiUrl: process.env.API_URL || 'https://api.whatever.com/v1',
      
      // Maximum number of results to return from the API
      maxResults: 10,
      
      // Cache settings
      cache: {
        enabled: true,
        ttl: 60 * 60 * 1000, // 1 hour in milliseconds
      },
    },
    
    // Logging configuration
    logging: {
      level: process.env.LOG_LEVEL || 'info',
      format: process.env.NODE_ENV === 'production' ? 'json' : 'pretty',
    },
  };