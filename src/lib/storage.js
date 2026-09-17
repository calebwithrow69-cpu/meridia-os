// Replaces the claude.ai-only `window.storage`. Same shape (get/set/list,
// async, `{value}` / `{keys}`) so the rest of the app didn't need to change,
// backed by real localStorage so saves persist in an actual browser.
export const Storage = {
  async get(key) {
    try {
      const value = localStorage.getItem(key);
      return value === null ? null : { value };
    } catch (e) {
      throw e;
    }
  },
  async set(key, value) {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (e) {
      return false;
    }
  },
  async list(prefix) {
    try {
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(prefix)) keys.push(k);
      }
      return { keys };
    } catch (e) {
      return { keys: [] };
    }
  },
};
