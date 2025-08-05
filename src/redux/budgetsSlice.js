import { createSlice } from '@reduxjs/toolkit';
import { loadFromStorage, saveToStorage } from '../utils/localStorageUtils';

const initialState = {
  list: loadFromStorage('budgets') || []
};

const budgetsSlice = createSlice({
  name: 'budgets',
  initialState,
  reducers: {
    addBudget: (state, action) => {
      state.list.push(action.payload);
      saveToStorage('budgets', state.list);
    },
    updateBudget: (state, action) => {
      const index = state.list.findIndex(b => b.category === action.payload.category);
      if (index !== -1) {
        state.list[index] = action.payload;
        saveToStorage('budgets', state.list);
      }
    }
  }
});

export const { addBudget, updateBudget } = budgetsSlice.actions;
export default budgetsSlice.reducer;
