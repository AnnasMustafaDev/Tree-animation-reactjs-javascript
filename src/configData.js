/**
 * Configuration Data Management
 * Stores and retrieves birthday greeting data using localStorage
 */

const STORAGE_KEY = 'birthdayConfigs';
const DEFAULT_MESSAGE = 'May Allah make your life bloom with more joy, color, sucess and endless happiness. Here is to a year of growing stronger and more beautiful.';

/**
 * Initialize storage with default data if empty
 */
export const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    const defaultData = {
      configs: {
        '0055': {
          name: 'Aisha',
          greeting: 'Happy Birthday Aisha',
          message: DEFAULT_MESSAGE,
        },
      },
      defaultGreeting: 'Happy Birthday',
      defaultMessage: DEFAULT_MESSAGE,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
  }
};

/**
 * Get all configurations
 */
export const getAllConfigs = () => {
  initializeStorage();
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : {};
};

/**
 * Get config by code
 */
export const getConfigByCode = (code) => {
  const data = getAllConfigs();
  return data.configs?.[code] || null;
};

/**
 * Get default greeting and message
 */
export const getDefaults = () => {
  const data = getAllConfigs();
  return {
    greeting: data.defaultGreeting || 'Happy Birthday',
    message: data.defaultMessage || DEFAULT_MESSAGE,
  };
};

/**
 * Save or update a configuration
 */
export const saveConfig = (code, name, greeting, message) => {
  const data = getAllConfigs();
  if (!data.configs) data.configs = {};
  
  data.configs[code] = {
    name,
    greeting,
    message,
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  return data.configs[code];
};

/**
 * Delete a configuration
 */
export const deleteConfig = (code) => {
  const data = getAllConfigs();
  if (data.configs?.[code]) {
    delete data.configs[code];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  }
  return false;
};

/**
 * Update default greeting and message
 */
export const updateDefaults = (greeting, message) => {
  const data = getAllConfigs();
  data.defaultGreeting = greeting;
  data.defaultMessage = message;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  return { greeting, message };
};

/**
 * Get all codes and names (for display in admin)
 */
export const getAllCodeNamePairs = () => {
  const data = getAllConfigs();
  return Object.entries(data.configs || {}).map(([code, config]) => ({
    code,
    name: config.name,
    greeting: config.greeting,
    message: config.message,
  }));
};
