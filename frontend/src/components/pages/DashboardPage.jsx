import React from 'react';
import TicketList from '../TicketList.jsx';
import TicketForm from '../TicketForm.jsx';

const DashboardPage = ({ role }) => {
  return (
    <div className="flex">
      <div className="w-1/2 p-4">
        <TicketList />
      </div>
      <div className="w-1/2 p-4">
        {role === 'user' && <TicketForm />}
      </div>
    </div>
  );
};

export default DashboardPage;
