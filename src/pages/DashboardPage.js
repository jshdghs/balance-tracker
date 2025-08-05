import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import SummaryCard from '../components/SummaryCard';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6384'];

function DashboardPage() {
  const transactions = useSelector((state) => state.transactions.list);
  const [selectedDate, setSelectedDate] = useState('');
  const today = new Date().toISOString().split('T')[0];

  const filteredTransactions = selectedDate
    ? transactions.filter(t => t.date === selectedDate)
    : transactions;

  const todayExpenses = transactions.filter(
    t => t.type === 'expense' && t.date === today
  );

  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const remainingBudget = totalIncome - totalExpenses;
  const savings = remainingBudget * 0.2;

  // Bar chart data (group by date)
  const groupedByDate = filteredTransactions.reduce((acc, t) => {
    const date = t.date;
    if (!acc[date]) acc[date] = { date, income: 0, expense: 0 };
    if (t.type === 'income') acc[date].income += t.amount;
    else acc[date].expense += t.amount;
    return acc;
  }, {});

  const barChartData = Object.values(groupedByDate);

  // Pie chart data (group by category)
  const categoryMap = {};
  filteredTransactions.forEach((t) => {
    if (t.type === 'expense') {
      const category = t.title.toLowerCase();
      if (!categoryMap[category]) categoryMap[category] = 0;
      categoryMap[category] += t.amount;
    }
  });

  const pieChartData = Object.entries(categoryMap).map(([name, value]) => ({
    name,
    value
  }));

  return (
    <div className="dashboard-page">
      <h2>Dashboard</h2>

      {/* Date Filter */}
      <div style={{ margin: '1rem 0' }}>
        <label htmlFor="dateFilter">📅 Filter by Date:</label>
        <input
          type="date"
          id="dateFilter"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          style={{ marginLeft: '1rem' }}
        />
        <button onClick={() => setSelectedDate('')} style={{ marginLeft: '1rem' }}>
          Reset
        </button>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <SummaryCard title="Total Income" amount={`₹${totalIncome}`} />
        <SummaryCard title="Total Expenses" amount={`₹${totalExpenses}`} />
        <SummaryCard title="Remaining Budget" amount={`₹${remainingBudget}`} />
        <SummaryCard title="Savings" amount={`₹${savings}`} />
      </div>

      <div className="chart-section">
        <div className="chart-card">
          <h3>Income vs Expenses (Bar)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barChartData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="income" fill="#4CAF50" />
              <Bar dataKey="expense" fill="#F44336" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Expense by Category (Pie)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieChartData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Today's Expenses Table */}
      <h3 style={{ marginTop: '2rem' }}>📌 Today's Expenses ({todayExpenses.length})</h3>
      <table className="expenses-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Amount</th>
            <th>Type</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {todayExpenses.length === 0 ? (
            <tr>
              <td colSpan="4">No expenses today.</td>
            </tr>
          ) : (
            todayExpenses.map((expense, index) => (
              <tr key={index}>
                <td>{expense.title}</td>
                <td>₹{expense.amount}</td>
                <td>{expense.type}</td>
                <td>{expense.date}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default DashboardPage;
