import React from 'react';

const getCategoryEmoji = (category) => {
  const cat = category?.toLowerCase() || '';
  if (cat.includes('food') || cat.includes('eat') || cat.includes('chai')) return '🍔';
  if (cat.includes('travel') || cat.includes('taxi') || cat.includes('auto')) return '🚕';
  if (cat.includes('bill') || cat.includes('recharge') || cat.includes('light')) return '💡';
  if (cat.includes('shop') || cat.includes('clothes')) return '🛍';
  if (cat.includes('home') || cat.includes('rent')) return '🏠';
  return '💰';
};

const ExpenseTable = ({ data }) => {
  if (!data || data.length === 0) return <p className="text-muted text-sm" style={{ padding: '20px', textAlign: 'center' }}>No expenses found.</p>;

  return (
    <div className="expense-table-container">
      <table className="expense-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Category</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={item.id || index}>
              <td>{new Date(item.created_at).toLocaleDateString()}</td>
              <td>{item.description}</td>
              <td className="category-pill">
                <span>{getCategoryEmoji(item.category)}</span> {item.category}
              </td>
              <td className="amount-cell">₹{item.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExpenseTable;
