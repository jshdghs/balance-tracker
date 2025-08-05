import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addBudget, updateBudget } from '../redux/budgetsSlice';
import { toast } from 'react-toastify';

const BudgetsPage = () => {
  const dispatch = useDispatch();
  const budgets = useSelector(state => state.budgets.list);
  const transactions = useSelector(state => state.transactions.list);

  const [form, setForm] = useState({ category: '', limit: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.category || !form.limit) {
      toast.error('All fields required');
      return;
    }

    dispatch(addBudget({ ...form, limit: Number(form.limit) }));
    toast.success('Budget added');
    setForm({ category: '', limit: '' });
  };

  const getSpent = (category) =>
    transactions
      .filter(t => t.type === 'expense' && t.title.toLowerCase().includes(category.toLowerCase()))
      .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="budgets-page">
      <h2>Budgets</h2>

      <form className="budget-form" onSubmit={handleSubmit}>
        <input
          name="category"
          placeholder="Category (e.g. Food)"
          value={form.category}
          onChange={handleChange}
        />
        <input
          name="limit"
          type="number"
          placeholder="Budget Limit"
          value={form.limit}
          onChange={handleChange}
        />
        <button type="submit">Add Budget</button>
      </form>

      <div className="budget-list">
        {budgets.map((b) => {
          const spent = getSpent(b.category);
          const percent = Math.min((spent / b.limit) * 100, 100);

          return (
            <div key={b.category} className="budget-item">
              <h4>{b.category}</h4>
              <p>Spent: ₹{spent} / ₹{b.limit}</p>
              <div className="progress-bar">
                <div
                  className={`progress-fill ${spent > b.limit ? 'over-budget' : ''}`}
                  style={{ width: `${percent}%` }}
                />
              </div>
              {spent > b.limit && <p className="warning">⚠ Over budget!</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BudgetsPage;
