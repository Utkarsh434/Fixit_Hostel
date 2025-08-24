// app/components/StudentTicketView.tsx
'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

interface Ticket {
  id: string;
  title: string;
  status: string;
  createdAt: string;
  hostel: string;
  roomNumber: string;
  student: {
    name: string;
  };
}

const StudentTicketView = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPublicTickets = async () => {
      try {
        const response = await axios.get('/api/tickets/public');
        setTickets(response.data);
      } catch (error) {
        toast.error('Failed to fetch ticket list.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPublicTickets();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return <p className="p-6 text-center text-gray-600">Loading all tickets...</p>;
  }

  return (
    <div className="p-6 bg-white rounded-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">All Submitted Tickets</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Reported By</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Issue</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Date Reported</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {tickets.map((ticket) => (
              <tr key={ticket.id}>
                <td className="py-4 px-4 whitespace-nowrap text-gray-800">{ticket.student.name}</td>
                <td className="py-4 px-4 whitespace-nowrap text-gray-800">{`${ticket.hostel}, ${ticket.roomNumber}`}</td>
                <td className="py-4 px-4 whitespace-nowrap text-gray-800">{ticket.title}</td>
                <td className="py-4 px-4 whitespace-nowrap text-gray-600">{formatDate(ticket.createdAt)}</td>
                <td className="py-4 px-4 whitespace-nowrap">
                   <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      ticket.status === 'OPEN' ? 'bg-red-100 text-red-800' : 
                      ticket.status === 'ASSIGNED' ? 'bg-yellow-100 text-yellow-800' :
                      ticket.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                  }`}>
                      {ticket.status.replace('_', ' ')}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentTicketView;
