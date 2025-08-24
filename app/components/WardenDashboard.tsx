'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Status } from '@prisma/client';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // <-- 1. Import the autoTable function directly

// This is a TypeScript extension to make the autoTable method available on jsPDF instances
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

interface Ticket {
  id: string;
  title: string;
  priority: string;
  status: string;
  hostel: string; 
  roomNumber: string; 
  student: {
    name: string;
  };
  assignedTechnicianName?: string;
}

const technicians = [
    { id: '1', name: 'Rajeev ji (Electrician)' },
    { id: '2', name: 'Sanjay ji (Plumber)' },
    { id: '3', name: 'Binod ji (Carpenter)' },
];

const WardenDashboard = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [assignments, setAssignments] = useState<{ [key: string]: string }>({});

  const fetchTickets = async () => {
    try {
      const response = await axios.get('/api/tickets');
      setTickets(response.data);
    } catch (error) {
      toast.error('Failed to fetch tickets.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleAssignmentChange = (ticketId: string, technicianName: string) => {
    setAssignments((prev) => ({ ...prev, [ticketId]: technicianName }));
  };

  const handleAssignTicket = async (ticketId: string) => {
    const technicianName = assignments[ticketId];
    if (!technicianName) {
      toast.error('Please select a technician.');
      return;
    }

    try {
      await axios.put(`/api/tickets/${ticketId}/assign`, { technicianName });
      toast.success('Ticket assigned successfully!');
      fetchTickets();
    } catch (error) {
      toast.error('Failed to assign ticket.');
    }
  };

  const handleStatusChange = async (ticketId: string, newStatus: Status) => {
    try {
        await axios.put(`/api/tickets/${ticketId}/status`, { status: newStatus });
        toast.success(`Ticket status updated to ${newStatus}`);
        fetchTickets();
    } catch (error) {
        toast.error('Failed to update status.');
    }
  };

  const handlePrint = () => {
    const doc = new jsPDF();
    const tableColumn = ["Student", "Location", "Issue", "Priority", "Assigned To"];
    const tableRows: any[] = [];

    const ticketsToPrint = tickets.filter(
        (ticket) => ticket.status === 'ASSIGNED' || ticket.status === 'IN_PROGRESS'
    );

    ticketsToPrint.forEach(ticket => {
        const ticketData = [
            ticket.student.name,
            `${ticket.hostel}, ${ticket.roomNumber}`,
            ticket.title,
            ticket.priority,
            ticket.assignedTechnicianName || 'N/A',
        ];
        tableRows.push(ticketData);
    });

    doc.text("Hostel Maintenance Work Orders", 14, 15);
    // --- 2. Call autoTable as a function, passing the doc instance ---
    autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 20,
    });
    doc.save(`work-orders_${new Date().toISOString().slice(0, 10)}.pdf`);
    toast.success('Work order PDF generated!');
  };


  if (isLoading) {
    return <div className="p-6">Loading tickets...</div>;
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
        case 'P1_CRITICAL': return 'bg-red-100 text-red-800';
        case 'P2_HIGH': return 'bg-orange-100 text-orange-800';
        case 'P3_NORMAL': return 'bg-blue-100 text-blue-800';
        case 'P4_LOW': return 'bg-gray-100 text-gray-800';
        default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900">All Maintenance Tickets</h2>
        <button
            onClick={handlePrint}
            className="px-4 py-2 font-semibold text-white bg-black rounded-md hover:bg-gray-800"
        >
            Print Work Orders
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Issue</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">AI Priority</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {tickets.map((ticket) => (
              <tr key={ticket.id}>
                <td className="py-4 px-4 whitespace-nowrap text-gray-800">{ticket.student.name}</td>
                <td className="py-4 px-4 whitespace-nowrap text-gray-800">{`${ticket.hostel}, ${ticket.roomNumber}`}</td>
                <td className="py-4 px-4 whitespace-nowrap text-gray-800">{ticket.title}</td>
                <td className="py-4 px-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority.replace('_', ' ')}
                    </span>
                </td>
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
                <td className="py-4 px-4 whitespace-nowrap text-sm">
                  {ticket.status === 'OPEN' && (
                    <div className="flex items-center gap-2">
                      <select
                        value={assignments[ticket.id] || ''}
                        onChange={(e) => handleAssignmentChange(ticket.id, e.target.value)}
                        className="block w-full pl-3 pr-10 py-2 text-gray-700 border-gray-300 focus:outline-none focus:ring-black focus:border-black sm:text-sm rounded-md"
                      >
                        <option value="" disabled>Select Technician</option>
                        {technicians.map((tech) => (
                          <option key={tech.id} value={tech.name}>{tech.name}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleAssignTicket(ticket.id)}
                        className="px-3 py-2 font-semibold text-white bg-black rounded-md hover:bg-gray-800"
                      >
                        Assign
                      </button>
                    </div>
                  )}
                  {ticket.status === 'ASSIGNED' && (
                     <button onClick={() => handleStatusChange(ticket.id, 'IN_PROGRESS')} className="px-3 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">
                        Start Work
                     </button>
                  )}
                   {ticket.status === 'IN_PROGRESS' && (
                     <button onClick={() => handleStatusChange(ticket.id, 'RESOLVED')} className="px-3 py-2 font-semibold text-white bg-green-600 rounded-md hover:bg-green-700">
                        Mark as Resolved
                     </button>
                  )}
                  {ticket.status === 'RESOLVED' && (
                     <span className="text-gray-600">Assigned to {ticket.assignedTechnicianName}</span>
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
