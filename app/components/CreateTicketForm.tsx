// app/components/CreateTicketForm.tsx
'use client';

import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const CreateTicketForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [hostel, setHostel] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await axios.post('/api/tickets/create', { title, description, hostel, roomNumber });
      toast.success('Ticket submitted successfully!');
      // Reset all fields
      setTitle('');
      setDescription('');
      setHostel('');
      setRoomNumber('');
    } catch (error) {
      toast.error('Failed to submit ticket.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Submit a New Ticket</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="hostel" className="block text-sm font-medium text-gray-700">Hostel Name</label>
                <input type="text" id="hostel" value={hostel} onChange={(e) => setHostel(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 text-gray-900 bg-gray-50 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="e.g., Hostel J" required disabled={isLoading} />
            </div>
            <div>
                <label htmlFor="roomNumber" className="block text-sm font-medium text-gray-700">Room Number</label>
                <input type="text" id="roomNumber" value={roomNumber} onChange={(e) => setRoomNumber(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 text-gray-900 bg-gray-50 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="e.g., C-218" required disabled={isLoading} />
            </div>
        </div>
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Issue Title</label>
          <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full px-3 py-2 text-gray-900 bg-gray-50 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="e.g., Leaking tap in bathroom" required disabled={isLoading} />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Detailed Description</label>
          <textarea id="description" rows={4} value={description} onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full px-3 py-2 text-gray-900 bg-gray-50 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Please provide as much detail as possible." required disabled={isLoading}></textarea>
        </div>
        <button type="submit" disabled={isLoading}
          className="w-full px-4 py-3 font-semibold text-white bg-black rounded-md hover:bg-gray-800 disabled:bg-gray-500">
          {isLoading ? 'Submitting...' : 'Submit Ticket'}
        </button>
      </form>
    </div>
  );
};

export default CreateTicketForm;
