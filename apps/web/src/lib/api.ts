import axios from 'axios';

const localApiUrl = import.meta.env.VITE_API_LOCAL_URL ?? 'http://localhost:3001/api/v1';
const productionApiUrl =
  import.meta.env.VITE_API_PRODUCTION_URL ?? 'https://financeos-api.vercel.app/api/v1';

export const apiBaseUrl =
  import.meta.env.VITE_API_URL ?? (import.meta.env.PROD ? productionApiUrl : localApiUrl);

export const api = axios.create({
  baseURL: apiBaseUrl,
});
