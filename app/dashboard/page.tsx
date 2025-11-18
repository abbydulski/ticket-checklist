'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { Plus, LogOut, CheckCircle2, Circle } from 'lucide-react';
import Image from 'next/image';
import { getIncompleteTickets, createTicket } from '@/lib/ticketService';
import { Ticket } from '@/lib/supabase';

const CHECKLIST_STEPS = [
  { id: 1, title: 'Review Requirements', description: 'Understand the ticket requirements and acceptance criteria' },
  { id: 2, title: 'Create Branch', description: 'Create a new git branch for this ticket' },
  { id: 3, title: 'Implement Changes', description: 'Write the code to implement the required changes' },
  { id: 4, title: 'Write Tests', description: 'Add unit tests for the new functionality' },
  { id: 5, title: 'Code Review', description: 'Submit PR and get code review approval' },
  { id: 6, title: 'QA Testing', description: 'Test the changes in QA environment' },
  { id: 7, title: 'Update Documentation', description: 'Update relevant documentation' },
  { id: 8, title: 'Deploy', description: 'Deploy to production' },
];

export default function DashboardPage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [newTicketName, setNewTicketName] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      loadTickets();
    }
  }, [user]);

  const loadTickets = async () => {
    setLoading(true);
    const result = await getIncompleteTickets();
    if (result.success && result.tickets) {
      setTickets(result.tickets);
    }
    setLoading(false);
  };

  const handleCreateTicket = async () => {
    if (!newTicketName.trim() || !user) return;

    setCreating(true);
    const result = await createTicket(newTicketName, CHECKLIST_STEPS, user.id, user.email || '');
    
    if (result.success && result.ticketId) {
      setShowNewTicketModal(false);
      setNewTicketName('');
      router.push(`/ticket/${result.ticketId}`);
    } else {
      alert('Failed to create ticket');
    }
    setCreating(false);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#D3D3D3' }}>
        <div className="text-gray-900 text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: '#D3D3D3' }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Image 
                src="/logo.svg" 
                alt="Company Logo" 
                width={150} 
                height={50}
                className="object-contain"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Ticket Dashboard</h1>
                <p className="text-gray-600 text-sm">{user.email}</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut size={20} />
              Sign Out
            </button>
          </div>
        </div>

        {/* Create New Ticket Button */}
        <button
          onClick={() => setShowNewTicketModal(true)}
          className="w-full bg-gray-900 text-white py-4 rounded-xl font-semibold hover:bg-black transition-colors flex items-center justify-center gap-2 mb-6"
        >
          <Plus size={24} />
          Create New Ticket
        </button>

        {/* Tickets List */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Incomplete Tickets</h2>
          
          {loading ? (
            <div className="bg-white rounded-xl p-8 text-center text-gray-600">
              Loading tickets...
            </div>
          ) : tickets.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center text-gray-600">
              No incomplete tickets. Create one to get started!
            </div>
          ) : (
            tickets.map((ticket) => (
              <div
                key={ticket.id}
                onClick={() => router.push(`/ticket/${ticket.id}`)}
                className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{ticket.ticket_name}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>Progress: {ticket.completed_steps}/{ticket.total_steps}</span>
                      <span>•</span>
                      <span>Created: {new Date(ticket.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      {Math.round((ticket.completed_steps / ticket.total_steps) * 100)}%
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* New Ticket Modal */}
      {showNewTicketModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Create New Ticket</h2>
            <input
              type="text"
              value={newTicketName}
              onChange={(e) => setNewTicketName(e.target.value)}
              placeholder="e.g., PROJ-123 - User Authentication"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 mb-4"
              onKeyDown={(e) => e.key === 'Enter' && !creating && handleCreateTicket()}
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowNewTicketModal(false);
                  setNewTicketName('');
                }}
                className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTicket}
                disabled={!newTicketName.trim() || creating}
                className="flex-1 px-4 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-black disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {creating ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

