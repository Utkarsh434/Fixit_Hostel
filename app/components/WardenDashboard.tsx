'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Ticket, User, Status, Priority, Category } from '@prisma/client';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Trash2 } from 'lucide-react'; // Icon for the delete button

type TicketWithStudent = Ticket & {
  student: {
    name: string;
  };
};

const WardenDashboard = () => {
  const [tickets, setTickets] = useState<TicketWithStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for inline editing
  const [editingTicketId, setEditingTicketId] = useState<string | null>(null);
  const [editData, setEditData] = useState<{ category: Category; priority: Priority } | null>(null);

  // State for technician assignment
  const [selectedTechnician, setSelectedTechnician] = useState<Record<string, string>>({});


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
  
  // Handlers for inline editing
  const handleEditClick = (ticket: TicketWithStudent) => {
    setEditingTicketId(ticket.id);
    setEditData({ category: ticket.category, priority: ticket.priority });
  };

  const handleCancelEdit = () => {
    setEditingTicketId(null);
    setEditData(null);
  };

  const handleUpdateClassification = async (ticketId: string) => {
    if (!editData) return;

    try {
      await axios.put(`/api/tickets/${ticketId}/classify`, editData);
      toast.success('Ticket updated successfully!');
      setEditingTicketId(null);
      setEditData(null);
      fetchTickets(); // Refresh data
    } catch (err) {
      toast.error('Failed to update ticket.');
    }
  };

  // --- NEW: Handler for deleting a ticket ---
  const handleDeleteTicket = async (ticketId: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this ticket?')) {
      return;
    }

    try {
      await axios.delete(`/api/tickets/${ticketId}`);
      toast.success('Ticket deleted successfully!');
      fetchTickets(); // Refresh the list
    } catch (err) {
      toast.error('Failed to delete ticket.');
    }
  };


  // Other Handlers
  const handleAssign = async (ticketId: string) => {
    const technicianName = selectedTechnician[ticketId];
    if (!technicianName) {
      toast.error('Please select a technician.');
      return;
    }
    try {
      await axios.put(`/api/tickets/${ticketId}/assign`, { technicianName });
      toast.success('Ticket assigned successfully!');
      fetchTickets();
    } catch (err) {
      toast.error('Failed to assign ticket.');
    }
  };

  const handleStatusChange = async (ticketId: string, newStatus: Status) => {
    try {
      await axios.put(`/api/tickets/${ticketId}/status`, { status: newStatus });
      toast.success(`Ticket status updated to ${newStatus}!`);
      fetchTickets();
    } catch (err) {
      toast.error('Failed to update status.');
    }
  };
  
  const handlePrint = () => {
    const doc = new jsPDF();
    autoTable(doc, { didDrawPage: () => {} }); // Initialize autoTable
    const ticketsToPrint = tickets.filter(
      (ticket) => ticket.status === 'ASSIGNED' || ticket.status === 'IN_PROGRESS'
    );

    if (ticketsToPrint.length === 0) {
      toast.error('No active work orders to print.');
      return;
    }

    doc.text("Hostel Maintenance Work Orders", 14, 15);
    autoTable(doc, {
      startY: 20,
      head: [['Student', 'Location', 'Issue', 'Priority', 'Assigned To']],
      body: ticketsToPrint.map(ticket => [
        ticket.student.name,
        `${ticket.hostel || 'N/A'}, ${ticket.roomNumber || 'N/A'}`,
        ticket.title,
        ticket.priority,
        ticket.assignedTechnicianName || 'N/A',
      ]),
    });
    doc.save(`work-orders_${new Date().toISOString().slice(0, 10)}.pdf`);
    toast.success('Work order PDF generated!');
  };


  if (loading) return <div className="text-center p-8">Loading tickets...</div>;
  if (error) return <div className="text-red-600 text-center p-8">{error}</div>;

  return (
    <div className="bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-md">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-900">All Maintenance Tickets</h2>
        <button
          onClick={handlePrint}
          className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors w-full sm:w-auto"
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
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AI Priority</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {tickets.map((ticket) => (
              <tr key={ticket.id} className="hover:bg-gray-50">
                <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-800 font-medium">{ticket.student.name}</td>
                <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-600">{`${ticket.hostel || 'N/A'}, ${ticket.roomNumber || 'N/A'}`}</td>
                <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-600">{ticket.title}</td>

                {/* Editable Category Cell */}
                <td className="py-4 px-4 whitespace-nowrap text-sm">
                  {editingTicketId === ticket.id ? (
                    <select
                      value={editData?.category}
                      onChange={(e) => setEditData({ ...editData!, category: e.target.value as Category })}
                      className="block w-full p-2 text-sm text-gray-600 border-gray-300 rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-500"
                    >
                      {Object.values(Category).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  ) : (
                    <span className="text-gray-800">{ticket.category}</span>
                  )}
                </td>

                {/* Editable Priority Cell */}
                <td className="py-4 px-4 whitespace-nowrap">
                  {editingTicketId === ticket.id ? (
                    <select
                      value={editData?.priority}
                      onChange={(e) => setEditData({ ...editData!, priority: e.target.value as Priority })}
                      className="block w-full p-2 text-sm text-gray-600 border-gray-300 rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-500"
                    >
                       {Object.values(Priority).map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  ) : (
                     <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      ticket.priority === 'P1_CRITICAL' ? 'bg-red-100 text-red-800' :
                      ticket.priority === 'P2_HIGH' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                  }`}>
                      {ticket.priority}
                  </span>
                  )}
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

                <td className="py-4 px-4 whitespace-nowrap text-sm font-medium">
                  {editingTicketId === ticket.id ? (
                    <div className="flex items-center space-x-2">
                      <button onClick={() => handleUpdateClassification(ticket.id)} className="text-green-600 hover:text-green-900">Save</button>
                      <button onClick={handleCancelEdit} className="text-red-600 hover:text-red-900">Cancel</button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                       <button onClick={() => handleEditClick(ticket)} className="text-gray-600 hover:text-gray-900 text-xs">Edit Priority</button>
                       
                       {ticket.status === 'OPEN' && (
                        <div className='flex items-center gap-1'>
                           <select
                              value={selectedTechnician[ticket.id] || ''}
                              onChange={(e) => setSelectedTechnician(prev => ({ ...prev, [ticket.id]: e.target.value }))}
                              className="block w-full p-1 text-xs border-gray-300 rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-500"
                            >
                              <option value="">Select Technician</option>
                              {hardcodedTechnicians.map(name => <option key={name} value={name}>{name}</option>)}
                            </select>
                           <button onClick={() => handleAssign(ticket.id)} className="bg-gray-800 text-white px-2 py-1 rounded-md text-xs hover:bg-gray-700">Assign</button>
                        </div>
                       )}

                       {ticket.status === 'ASSIGNED' && <button onClick={() => handleStatusChange(ticket.id, 'IN_PROGRESS')} className="text-blue-600 hover:text-blue-900 text-xs">Start Work</button>}
                       {ticket.status === 'IN_PROGRESS' && <button onClick={() => handleStatusChange(ticket.id, 'RESOLVED')} className="text-green-600 hover:text-green-900 text-xs">Mark as Resolved</button>}
                       {ticket.assignedTechnicianName && ticket.status !== 'OPEN' && <span className="text-xs text-gray-500">Assigned to {ticket.assignedTechnicianName}</span>}
                      
                      <button
                        onClick={() => handleDeleteTicket(ticket.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete Ticket"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                    </div>
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

