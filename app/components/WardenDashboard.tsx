'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Ticket, User, Status, Priority } from '@prisma/client';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // <-- 1. Import autoTable correctly

// Define a more specific type for our tickets that includes the student name
type TicketWithStudent = Ticket & {
  student: {
    name: string;
  };
};

const WardenDashboard = () => {
  const [tickets, setTickets] = useState<TicketWithStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTechnician, setSelectedTechnician] = useState<{ [key: string]: string }>({});
  const [error, setError] = useState<string | null>(null);

  const hardcodedTechnicians = [
    'Rajeev ji (Electrician)',
    'Sanjay ji (Plumber)',
    'Binod ji (Carpenter)',
  ];

  const fetchTickets = async () => {
    try {
      const { data } = await axios.get<TicketWithStudent[]>('/api/tickets');
      setTickets(data);
    } catch (err) {
      toast.error('Failed to fetch tickets.');
      setError('Could not load ticket data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleAssign = async (ticketId: string) => {
    const technicianName = selectedTechnician[ticketId];
    if (!technicianName) {
      toast.error('Please select a technician.');
      return;
    }

    try {
      await axios.put(`/api/tickets/${ticketId}/assign`, { technicianName });
      toast.success('Ticket assigned successfully!');
      fetchTickets(); // Refresh the ticket list
    } catch (err) {
      toast.error('Failed to assign ticket.');
    }
  };

  const handleStatusChange = async (ticketId: string, newStatus: Status) => {
    try {
      await axios.put(`/api/tickets/${ticketId}/status`, { status: newStatus });
      toast.success(`Ticket status updated to ${newStatus}!`);
      fetchTickets(); // Refresh the ticket list
    } catch (err) {
      toast.error('Failed to update status.');
    }
  };

  const handlePrint = () => {
    const doc = new jsPDF(); // Create a new jsPDF instance

    // Filter for only active work orders
    const ticketsToPrint = tickets.filter(
      (ticket) => ticket.status === 'ASSIGNED' || ticket.status === 'IN_PROGRESS'
    );

    if (ticketsToPrint.length === 0) {
      toast.error('No active work orders to print.');
      return;
    }

    doc.text("Hostel Maintenance Work Orders", 14, 15);

    autoTable(doc, { // <-- 2. Use autoTable as a function
      startY: 20,
      head: [['Student', 'Location', 'Issue', 'AI Priority', 'Assigned To']],
      body: ticketsToPrint.map(ticket => [
        ticket.student.name,
        `${ticket.hostel}, ${ticket.roomNumber}`,
        ticket.title,
        ticket.priority,
        ticket.assignedTechnicianName || 'N/A',
      ]),
    });

    doc.save(`work-orders_${new Date().toISOString().slice(0, 10)}.pdf`);
    toast.success('Work order PDF generated!');
  };

  if (loading) return <div>Loading tickets...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">All Maintenance Tickets</h2>
        <button
          onClick={handlePrint}
          className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
        >
          Print Work Orders
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AI Priority</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-400">
            {tickets.map((ticket) => (
              <tr key={ticket.id}>
                <td className="py-4 px-4 text-gray-500 whitespace-nowrap">{ticket.student.name}</td>
                <td className="py-4 px-4 text-gray-500 whitespace-nowrap">{`${ticket.hostel}, ${ticket.roomNumber}`}</td>
                <td className="py-4 px-4 text-gray-500 whitespace-nowrap">{ticket.title}</td>
                <td className="py-4 px-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      ticket.priority === 'P1_CRITICAL' ? 'bg-red-100 text-red-800' :
                      ticket.priority === 'P2_HIGH' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                  }`}>
                      {ticket.priority}
                  </span>
                </td>
                <td className="py-4 px-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    ticket.status === 'OPEN' ? 'bg-red-100 text-red-800' :
                    ticket.status === 'ASSIGNED' ? 'bg-yellow-100 text-yellow-800' :
                    ticket.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {ticket.status}
                  </span>
                </td>
                <td className="py-4 px-4 whitespace-nowrap">
                  {ticket.status === 'OPEN' && (
                    <div className="flex items-center space-x-2">
                      <select
                        value={selectedTechnician[ticket.id] || ''}
                        onChange={(e) => setSelectedTechnician({ ...selectedTechnician, [ticket.id]: e.target.value })}
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
                      >
                        <option value="" disabled>Select Technician</option>
                        {hardcodedTechnicians.map(name => <option key={name} value={name}>{name}</option>)}
                      </select>
                      <button onClick={() => handleAssign(ticket.id)} className="bg-gray-800 text-white px-3 py-2 rounded-md text-sm hover:bg-gray-700">Assign</button>
                    </div>
                  )}
                  {ticket.status === 'ASSIGNED' && (
                    <button onClick={() => handleStatusChange(ticket.id, 'IN_PROGRESS')} className="bg-blue-500 text-white px-3 py-2 rounded-md text-sm hover:bg-blue-600">Start Work</button>
                  )}
                  {ticket.status === 'IN_PROGRESS' && (
                    <button onClick={() => handleStatusChange(ticket.id, 'RESOLVED')} className="bg-green-500 text-white px-3 py-2 rounded-md text-sm hover:bg-green-600">Mark as Resolved</button>
                  )}
                  {ticket.status === 'RESOLVED' && (
                    <span className="text-sm text-gray-500">Work Completed</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WardenDashboard;
