import React from 'react';
import { NavLink } from 'react-router-dom';

function Header() {
  return (
    <header className="header">
      <h1>💰 Finance Tracker</h1>
      <nav>
        <NavLink to="/Dashboard">Dashboard</NavLink>
        <NavLink to="/Transactions">Transactions</NavLink>
        <NavLink to="/Budgets">Budgets</NavLink>
        <NavLink to="/Profile">Profile</NavLink>
      </nav>
    </header>
  );
}

export default Header;
