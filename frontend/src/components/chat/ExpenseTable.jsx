import React from 'react';

const ExpenseTable = ({ data }) => {
  if (!data || data.length === 0) return <p className="text-muted text-sm">No expenses found.</p>;

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
              <td className="category-pill">{item.category}</td>
              <td className="amount-cell">₹{item.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExpenseTable;
