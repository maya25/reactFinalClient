const _storage = window.localStorage;

export const set = (key, value) => {
  _storage.setItem(key, JSON.stringify(value));
};

export const get = key => {
  return JSON.parse(_storage.getItem(key));
};

export const remove = key => {
  _storage.removeItem(key);
};
