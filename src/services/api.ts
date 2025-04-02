import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export interface ApiError extends Error {
  response?: {
    status: number;
    data?: {
      status?: string;
      error?: string;
    };
  };
}

// Define the ProteinData interface
export interface ProteinData {
  name: string;
  pdbId: string;
  description: string;
  function: string;
  relatedDrugs: string[];
  externalLinks: {
    uniprot: string;
    pdb: string;
    genecards: string;
  };
}

// Response validation interface
export interface ProteinResponse {
  success: boolean;
  data?: ProteinData;
  error?: string;
}

const api = {
  search: async (query: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/search`, {
        params: { query }
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 503 && error.response?.data?.status === 'model_loading') {
        throw new Error('AI model is currently loading. This may take a few minutes on first run.');
      }
      throw error;
    }
  },

  getProtein: async (proteinId: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/protein/${proteinId}`);
      return response.data;
    } catch (error: any) {
      console.error(`Error fetching protein ${proteinId}:`, error);
      throw error;
    }
  },

  healthCheck: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/health`);
      return { status: response.data.status === 'ok' ? 'online' : 'offline' };
    } catch (error: any) {
      console.error('API health check failed:', error);
      return { status: 'offline' };
    }
  }
};

export const searchBiomedical = api.search;
export const getProteinDetails = api.getProtein;
export const checkHealth = api.healthCheck;

export default api;

