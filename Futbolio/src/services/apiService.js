import axios from 'axios';
import CacheService from './cacheService';
import { getMockData } from './mockData';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://v3.football.api-sports.io';
const API_KEY  = import.meta.env.VITE_API_FOOTBALL_KEY || '';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'x-apisports-key': API_KEY },
});

const ApiService = {
  async get(endpoint, params = {}, cacheKey = null) {
    // 1. Try cache
    if (cacheKey) {
      const cached = CacheService.get(cacheKey);
      if (cached) {
        console.log('[Cache HIT]', cacheKey);
        return cached;
      }
    }

    // 2. API call
    try {
      console.log('[API]', endpoint, params);
      const res = await api.get(endpoint, { params });
      
      // API-Football returns 200 OK even for account errors, but puts them in the 'errors' field
      const hasErrors = res.data?.errors && 
        (Array.isArray(res.data.errors) ? res.data.errors.length > 0 : Object.keys(res.data.errors).length > 0);
        
      if (hasErrors) {
        console.warn('[API Error/Limit] Falling back to mock data', res.data.errors);
        return getMockData(endpoint, params);
      }

      const data = res.data?.response ?? res.data;

      // If API returns an empty array or empty object, fall back to mock data
      const isEmptyArray = Array.isArray(data) && data.length === 0;
      const isEmptyObject = data && typeof data === 'object' && !Array.isArray(data) && Object.keys(data).length === 0;
      
      if (isEmptyArray || isEmptyObject) {
        console.warn('[API Empty] Falling back to mock data');
        return getMockData(endpoint, params);
      }

      if (cacheKey) CacheService.set(cacheKey, data);
      return data;
    } catch (err) {
      console.error('[API Error]', err?.response?.status, endpoint);

      // 3. Stale cache fallback
      if (cacheKey) {
        const stale = CacheService.getStale(cacheKey);
        if (stale) {
          console.warn('[Cache STALE fallback]', cacheKey);
          return stale;
        }
      }
      console.warn('[Network Error] Falling back to mock data', err);
      return getMockData(endpoint, params);
    }
  },
};

export default ApiService;
