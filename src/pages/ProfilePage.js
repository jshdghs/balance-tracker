import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getUserData, saveUserData } from '../utils/localStorageUtils';

const currencies = ['₹', '$', '€', '£'];

function ProfilePage() {
  const transactions = useSelector(state => state.transactions.list);
  const today = new Date().toISOString().split('T')[0];

  const [user, setUser] = useState({
    name: '',
    email: '',
    currency: '₹'
  });
  const [editMode, setEditMode] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });

  // Load user from localStorage
  useEffect(() => {
    const data = getUserData();
    if (data) setUser(data);
  }, []);

  // Handlers
  const handleChange = e => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    saveUserData(user);
    setEditMode(false);
  };

  const lifetimeExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const lifetimeSavings = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0) - lifetimeExpenses;

  const todayExpenses = transactions.filter(
    t => t.type === 'expense' && t.date === today
  );

  const filteredByDate = transactions.filter(t => {
    if (!dateRange.from || !dateRange.to) return true;
    return t.date >= dateRange.from && t.date <= dateRange.to;
  });

  return (
    <div className="profile-page">
      <h2>👤 Profile</h2>

      <div className="profile-section">
        <h3>User Info</h3>
        {editMode ? (
          <div className="edit-form">
            <input
              type="text"
              name="name"
              value={user.name}
              placeholder="Name"
              onChange={handleChange}
            />
            <input
              type="email"
              name="email"
              value={user.email}
              placeholder="Email"
              onChange={handleChange}
            />
            <select
              name="currency"
              value={user.currency}
              onChange={handleChange}
            >
              {currencies.map(cur => (
                <option key={cur} value={cur}>
                  {cur}
                </option>
              ))}
            </select>
            <button onClick={handleSave}>Save</button>
          </div>
        ) : (
          <div className="profile-info">
            <p><strong>Name:</strong> {user.name || '-'}</p>
            <p><strong>Email:</strong> {user.email || '-'}</p>
            <p><strong>Currency:</strong> {user.currency}</p>
            <button onClick={() => setEditMode(true)}>Edit Profile</button>
          </div>
        )}
      </div>

      <div className="stats-section">
        <h3>📊 Lifetime Stats</h3>
        <p><strong>Total Expenses:</strong> {user.currency}{lifetimeExpenses}</p>
        <p><strong>Total Savings:</strong> {user.currency}{lifetimeSavings}</p>
      </div>

      <div className="filter-section">
        <h3>📅 Filter by Date Range</h3>
        <label>From:</label>
        <input
          type="date"
          value={dateRange.from}
          onChange={(e) =>
            setDateRange(prev => ({ ...prev, from: e.target.value }))
          }
        />
        <label>To:</label>
        <input
          type="date"
          value={dateRange.to}
          onChange={(e) =>
            setDateRange(prev => ({ ...prev, to: e.target.value }))
          }
        />
      </div>

      <div className="today-expenses-section">
        <h3>📌 Today's Expenses</h3>
        <table className="expenses-table">
          <thead>
            <tr>
              <th>Amount</th>
              <th>Category</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            {todayExpenses.length === 0 ? (
              <tr>
                <td colSpan="3">No expenses today.</td>
              </tr>
            ) : (
              todayExpenses.map((expense, index) => (
                <tr key={index}>
                  <td>{user.currency}{expense.amount}</td>
                  <td>{expense.category || expense.title}</td>
                  <td>{expense.note || '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProfilePage;
