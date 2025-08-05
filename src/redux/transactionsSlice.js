import { createSlice } from '@reduxjs/toolkit';
import { loadFromStorage, saveToStorage } from '../utils/localStorageUtils';

const initialState = {
  list: loadFromStorage('transactions') || [],
};

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    addTransaction: (state, action) => {
      state.list.push(action.payload);
      saveToStorage('transactions', state.list);
    },
    deleteTransaction: (state, action) => {
      state.list = state.list.filter(t => t.id !== action.payload);
      saveToStorage('transactions', state.list);
    },
    editTransaction: (state, action) => {
      const index = state.list.findIndex(t => t.id === action.payload.id);
      if (index !== -1) state.list[index] = action.payload;
      saveToStorage('transactions', state.list);
    },
  },
});

export const { addTransaction, deleteTransaction, editTransaction } = transactionsSlice.actions;
export default transactionsSlice.reducer;
