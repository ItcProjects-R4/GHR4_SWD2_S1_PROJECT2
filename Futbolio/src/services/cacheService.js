const TTL = Number(import.meta.env.VITE_CACHE_TTL_MINUTES) || 15;

const CacheService = {
  set(key, data) {
    try {
      const item = { data, timestamp: Date.now() };
      localStorage.setItem(key, JSON.stringify(item));
    } catch (e) {
      console.warn('[Cache] Storage full, clearing old items');
      this.clearExpired();
    }
  },

  get(key) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const item = JSON.parse(raw);
      const age = (Date.now() - item.timestamp) / 60000;
      if (age < TTL) return item.data;
      return null;
    } catch {
      return null;
    }
  },

  getStale(key) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      return JSON.parse(raw).data;
    } catch {
      return null;
    }
  },

  clearExpired() {
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      try {
        const item = JSON.parse(localStorage.getItem(key));
        if (item?.timestamp) {
          const age = (Date.now() - item.timestamp) / 60000;
          if (age > TTL * 4) localStorage.removeItem(key);
        }
      } catch { /* skip non-cache items */ }
    });
  },

  clear() {
    localStorage.clear();
  },
};

export default CacheService;
