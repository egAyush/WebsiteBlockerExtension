import React from 'react';

const AddNew = ({ blocked, onDelete }) => {
  const handleDelete = () => {
    onDelete(blocked.url);
  };

  return (
    <div className="blocked" id={`blocked-${blocked.url}`}>
      <div className="blocked-title">
        {blocked.url}
        <div className="blocked-controls">
          <img src="delete.png" alt="Delete" onClick={handleDelete} />
        </div>
      </div>
    </div>
  );
};

export default AddNew;
