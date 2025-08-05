import { configureStore } from '@reduxjs/toolkit';
import transactionsReducer from './transactionsSlice';
import budgetsReducer from './budgetsSlice';

const store = configureStore({
  reducer: {
    transactions: transactionsReducer,
    budgets: budgetsReducer
  }
});

export default store;
