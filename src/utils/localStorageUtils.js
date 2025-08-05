// src/utils/localStorageUtils.js

export const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error('Error saving to storage', err);
  }
};

export const loadFromStorage = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.error('Error loading from storage', err);
    return null;
  }
};
export const getUserData = () => {
  const data = localStorage.getItem('userData');
  return data ? JSON.parse(data) : null;
};

export const saveUserData = (user) => {
  localStorage.setItem('userData', JSON.stringify(user));
};

