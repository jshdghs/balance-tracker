import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTransaction, deleteTransaction, editTransaction } from '../redux/transactionsSlice';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';

const TransactionsPage = () => {
  const dispatch = useDispatch();
  const transactions = useSelector((state) => state.transactions.list);

  const [form, setForm] = useState({
    id: '',
    title: '',
    note: '', // ✅ Added note (description)
    amount: '',
    type: 'income',
    date: ''
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({ id: '', title: '', note: '', amount: '', type: 'income', date: '' });
    setIsEditing(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.amount || !form.date) {
      toast.error('Please fill in all fields!');
      return;
    }

    const transactionData = {
      ...form,
      amount: Number(form.amount)
    };

    if (isEditing) {
      dispatch(editTransaction(transactionData));
      toast.success('Transaction updated!');
    } else {
      dispatch(addTransaction({ ...transactionData, id: uuidv4() }));
      toast.success('Transaction added!');
    }

    resetForm();
  };

  const handleEdit = (transaction) => {
    setForm(transaction);
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    dispatch(deleteTransaction(id));
    toast.info('Transaction deleted');
    if (form.id === id) resetForm();
  };

  return (
    <div className="transactions-page">
      <h2>Transactions</h2>

      <form className="transaction-form" onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
        />
        <input
          name="note"
          placeholder="Description"
          value={form.note}
          onChange={handleChange}
        />
        <input
          name="amount"
          type="number"
          placeholder="Amount"
          value={form.amount}
          onChange={handleChange}
        />
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <input
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
        />
        <button type="submit">{isEditing ? 'Update' : 'Add'}</button>
        {isEditing && (
          <button type="button" onClick={resetForm}>Cancel</button>
        )}
      </form>

      <table className="transactions-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th> {/* ✅ New Column */}
            <th>Amount</th>
            <th>Type</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.id}>
              <td>{t.title}</td>
              <td>{t.note || '-'}</td> {/* ✅ Display Note */}
              <td>₹{t.amount}</td>
              <td>{t.type}</td>
              <td>{t.date}</td>
              <td>
                <button onClick={() => handleEdit(t)}>✏️</button>{' '}
                <button onClick={() => handleDelete(t.id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionsPage;
