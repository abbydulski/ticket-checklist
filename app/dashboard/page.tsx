'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { Plus, LogOut, Trash2, UserPlus } from 'lucide-react';
import Image from 'next/image';
import { getIncompleteTicketsWithSteps, createTicket, deleteTicket, reassignTicket, getAllUsers } from '@/lib/ticketService';
import { Ticket, TicketStep } from '@/lib/supabase';
import { CHECKLIST_STEPS } from '@/lib/constants';

interface TicketWithSteps extends Ticket {
  steps?: TicketStep[];
}

export default function DashboardPage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const router = useRouter();
  const [tickets, setTickets] = useState<TicketWithSteps[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [newTicketName, setNewTicketName] = useState('');
  const [creating, setCreating] = useState(false);
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [reassignTicketId, setReassignTicketId] = useState<string | null>(null);
  const [users, setUsers] = useState<{ id: string; email: string }[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [reassigning, setReassigning] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      loadTickets();
      loadUsers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadTickets = async () => {
    setLoading(true);
    const result = await getIncompleteTicketsWithSteps();
    if (result.success && result.tickets) {
      setTickets(result.tickets);
    }
    setLoading(false);
  };

  const loadUsers = async () => {
    try {
      console.log('Loading users...');
      const result = await getAllUsers();
      console.log('Users result:', result);
      if (result.success && result.users) {
        setUsers(result.users);
      } else {
        console.error('Failed to load users:', result.error);
      }
    } catch (error) {
      console.error('Error in loadUsers:', error);
    }
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

  const handleDeleteTicket = async (ticketId: string, ticketName: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation to ticket detail

    if (confirm(`Are you sure you want to delete "${ticketName}"? This cannot be undone.`)) {
      const result = await deleteTicket(ticketId);

      if (result.success) {
        // Reload tickets after deletion
        loadTickets();
      } else {
        alert('Failed to delete ticket');
      }
    }
  };

  const handleOpenReassign = (ticketId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation to ticket detail
    console.log('Opening reassign modal for ticket:', ticketId);
    console.log('Available users:', users);
    setReassignTicketId(ticketId);
    setSelectedUserId('');
    setShowReassignModal(true);
  };

  const handleReassignTicket = async () => {
    console.log('=== REASSIGN STARTED ===');
    console.log('Ticket ID:', reassignTicketId);
    console.log('Selected User ID:', selectedUserId);
    console.log('Current User:', user);
    console.log('Available Users:', users);

    if (!reassignTicketId || !selectedUserId || !user) {
      console.error('Missing required data:', { reassignTicketId, selectedUserId, user });
      return;
    }

    // Check if selected user is the current user
    let selectedUser;
    if (selectedUserId === user.id) {
      console.log('Assigning to current user (self)');
      selectedUser = { id: user.id, email: user.email || '' };
    } else {
      console.log('Assigning to another user');
      selectedUser = users.find(u => u.id === selectedUserId);
    }

    if (!selectedUser) {
      console.error('Selected user not found:', selectedUserId);
      alert('Selected user not found. Please try again.');
      return;
    }

    console.log('Selected user object:', selectedUser);
    setReassigning(true);

    try {
      console.log('Calling reassignTicket API...');
      const result = await reassignTicket(reassignTicketId, selectedUser.id, selectedUser.email);
      console.log('Reassign result:', result);

      if (result.success) {
        console.log('Reassignment successful!');
        setShowReassignModal(false);
        setReassignTicketId(null);
        setSelectedUserId('');
        await loadTickets(); // Reload to show updated assignment
      } else {
        console.error('Reassignment failed:', result.error);
        const errorMsg = result.error && typeof result.error === 'object' && 'message' in result.error
          ? (result.error as any).message
          : 'Unknown error';
        alert('Failed to reassign ticket. Error: ' + errorMsg);
      }
    } catch (error) {
      console.error('Exception during reassignment:', error);
      const errorMsg = error instanceof Error ? error.message : String(error);
      alert('An error occurred: ' + errorMsg);
    } finally {
      setReassigning(false);
      console.log('=== REASSIGN ENDED ===');
    }
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
    <div className="min-h-screen p-4 sm:p-6" style={{ backgroundColor: '#D3D3D3' }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <Image
                src="/logo.svg"
                alt="Company Logo"
                width={120}
                height={40}
                className="object-contain w-24 sm:w-32"
              />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Ticket Dashboard</h1>
                <p className="text-gray-600 text-xs sm:text-sm truncate max-w-[200px] sm:max-w-none">{user.email}</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center justify-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors text-sm sm:text-base"
            >
              <LogOut size={18} />
              <span>Sign Out</span>
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
            tickets.map((ticket) => {
              // Calculate section progress
              const sections = [
                { name: 'Job Prep', start: 1, end: 5 },
                { name: 'Field Ops', start: 6, end: 15 },
                { name: 'Office', start: 16, end: 20 },
              ];

              const getSectionProgress = (start: number, end: number) => {
                if (!ticket.steps) return { completed: 0, total: end - start + 1 };
                const sectionSteps = ticket.steps.filter(s => s.step_id >= start && s.step_id <= end);
                const completed = sectionSteps.filter(s => s.is_completed).length;
                return { completed, total: sectionSteps.length };
              };

              return (
                <div
                  key={ticket.id}
                  className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition-shadow relative group"
                >
                  <div
                    onClick={() => router.push(`/ticket/${ticket.id}`)}
                    className="cursor-pointer"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
                      <div className="flex-1">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">{ticket.ticket_name}</h3>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                          <span>Progress: {ticket.completed_steps}/{ticket.total_steps}</span>
                          <span className="hidden sm:inline">•</span>
                          <span>Created: {new Date(ticket.created_at).toLocaleDateString()}</span>
                          {ticket.created_by_email && (
                            <>
                              <span className="hidden sm:inline">•</span>
                              <span className="truncate max-w-[150px] sm:max-w-none">By: {ticket.created_by_email}</span>
                            </>
                          )}
                          {ticket.assigned_to_email && (
                            <>
                              <span className="hidden sm:inline">•</span>
                              <span className="truncate max-w-[150px] sm:max-w-none text-blue-600 font-medium">
                                Assigned: {ticket.assigned_to_email}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="text-left sm:text-right">
                        <div className="text-xl sm:text-2xl font-bold text-gray-900">
                          {Math.round((ticket.completed_steps / ticket.total_steps) * 100)}%
                        </div>
                      </div>
                    </div>

                    {/* Section Progress Bars */}
                    <div className="grid grid-cols-3 gap-2 sm:gap-3">
                      {sections.map((section) => {
                        const { completed, total } = getSectionProgress(section.start, section.end);
                        const sectionProgress = (completed / total) * 100;

                        return (
                          <div key={section.name} className="text-center">
                            <div className="text-[10px] sm:text-xs font-semibold text-gray-500 mb-1 truncate">
                              {section.name}
                            </div>
                            <div className="text-xs sm:text-sm font-bold text-gray-900 mb-1">
                              {completed}/{total}
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                              <div
                                className="bg-gray-900 h-1.5 sm:h-2 rounded-full transition-all duration-300"
                                style={{ width: `${sectionProgress}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* Reassign Button */}
                    <button
                      onClick={(e) => handleOpenReassign(ticket.id, e)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Reassign ticket"
                    >
                      <UserPlus size={20} />
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={(e) => handleDeleteTicket(ticket.id, ticket.ticket_name, e)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete ticket"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* New Ticket Modal */}
      {showNewTicketModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Create New Ticket</h2>
            <input
              type="text"
              value={newTicketName}
              onChange={(e) => setNewTicketName(e.target.value)}
              placeholder="e.g., PROJ-123 - User Authentication"
              className="w-full px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 mb-4 text-sm sm:text-base"
              onKeyDown={(e) => e.key === 'Enter' && !creating && handleCreateTicket()}
            />
            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={() => {
                  setShowNewTicketModal(false);
                  setNewTicketName('');
                }}
                className="flex-1 px-4 py-2.5 sm:py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTicket}
                disabled={!newTicketName.trim() || creating}
                className="flex-1 px-4 py-2.5 sm:py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-black disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
              >
                {creating ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reassign Ticket Modal */}
      {showReassignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Reassign Ticket</h2>
            <p className="text-sm text-gray-600 mb-4">
              Select a team member to assign this ticket to:
            </p>
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="w-full px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 mb-4 text-sm sm:text-base"
            >
              <option value="">Select a user...</option>
              {/* Current user first */}
              {user && (
                <option key={user.id} value={user.id}>
                  {user.email} (Me)
                </option>
              )}
              {/* Other users */}
              {users.filter(u => u.id !== user?.id).map((u) => (
                <option key={u.id} value={u.id}>
                  {u.email}
                </option>
              ))}
            </select>
            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={() => {
                  setShowReassignModal(false);
                  setReassignTicketId(null);
                  setSelectedUserId('');
                }}
                className="flex-1 px-4 py-2.5 sm:py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleReassignTicket}
                disabled={!selectedUserId || reassigning}
                className="flex-1 px-4 py-2.5 sm:py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-black disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
              >
                {reassigning ? 'Reassigning...' : 'Reassign'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

