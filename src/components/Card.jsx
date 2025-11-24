import React from 'react';

const Card = ({ id, title, assigned = false, assignedTo = null }) => (
  <div className="card">
    {/* Header */}
    <div className="card-header">
      <h3 className="card-title">
        <span className="card-id">#{id}</span> {title}
      </h3>
      <button className="card-menu">⋮</button>
    </div>

    {/* Assignment */}
    <div className="card-assignment">
      <div className="avatar">
        {assignedTo ? (
          <span className="avatar-initial">
            {assignedTo.charAt(0).toUpperCase()}
          </span>
        ) : (
          <div className="avatar-placeholder"></div>
        )}
      </div>
      <span className="assignment-text">
        {assigned ? assignedTo : 'Not assigned'}
      </span>
    </div>

    <style jsx>{`
      .card {
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        border: 1px solid #e5e7eb;
        padding: 16px;
        transition: box-shadow 0.2s;
      }

      .card:hover {
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }

      .card-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        margin-bottom: 12px;
      }

      .card-title {
        font-size: 14px;
        font-weight: 500;
        color: #1f2937;
        margin: 0;
      }

      .card-id {
        color: #06b6d4;
      }

      .card-menu {
        background: none;
        border: none;
        color: #9ca3af;
        cursor: pointer;
        padding: 0;
        font-size: 18px;
        font-weight: bold;
        line-height: 1;
        transition: color 0.2s;
      }

      .card-menu:hover {
        color: #4b5563;
      }

      .card-assignment {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .avatar {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background-color: #e5e7eb;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .avatar-initial {
        font-size: 12px;
        font-weight: 500;
        color: #4b5563;
      }

      .avatar-placeholder {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        border: 2px solid #d1d5db;
      }

      .assignment-text {
        font-size: 12px;
        color: #6b7280;
      }
    `}</style>
  </div>
);

export default Card;