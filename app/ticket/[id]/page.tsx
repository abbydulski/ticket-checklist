'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, ArrowRight, CheckCircle2, Circle } from 'lucide-react';
import Image from 'next/image';
import { getTicket, updateStepCompletion } from '@/lib/ticketService';
import { Ticket, TicketStep } from '@/lib/supabase';

export default function TicketDetailPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const ticketId = params.id as string;

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [steps, setSteps] = useState<TicketStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentStepChecked, setCurrentStepChecked] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && ticketId) {
      loadTicket();
    }
  }, [user, ticketId]);

  const loadTicket = async () => {
    setLoading(true);
    const result = await getTicket(ticketId);
    
    if (result.success && result.ticket && result.steps) {
      setTicket(result.ticket);
      setSteps(result.steps);
      
      // Find the first incomplete step
      const firstIncomplete = result.steps.findIndex((s: TicketStep) => !s.is_completed);
      if (firstIncomplete !== -1) {
        setCurrentStep(firstIncomplete);
      } else if (result.ticket.is_complete) {
        // All steps complete, redirect to dashboard
        router.push('/dashboard');
      }
    } else {
      alert('Failed to load ticket');
      router.push('/dashboard');
    }
    
    setLoading(false);
  };

  const handleCheckboxChange = () => {
    setCurrentStepChecked(!currentStepChecked);
  };

  const handleNext = async () => {
    if (!currentStepChecked || !ticket) return;

    const currentStepData = steps[currentStep];
    
    // Update step completion in Supabase
    await updateStepCompletion(ticketId, currentStepData.step_id, true);
    
    // Update local state
    const updatedSteps = [...steps];
    updatedSteps[currentStep] = { ...currentStepData, is_completed: true };
    setSteps(updatedSteps);
    setCurrentStepChecked(false);

    // Check if this was the last step
    const allComplete = updatedSteps.every(s => s.is_completed);
    
    if (allComplete) {
      // Ticket is complete, send to Slack and redirect
      await handleSendToSlack();
      router.push('/dashboard');
    } else {
      // Move to next incomplete step
      const nextIncomplete = updatedSteps.findIndex((s, idx) => idx > currentStep && !s.is_completed);
      if (nextIncomplete !== -1) {
        setCurrentStep(nextIncomplete);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setCurrentStepChecked(false);
    }
  };

  const handleSendToSlack = async () => {
    if (!ticket) return;

    try {
      const response = await fetch('/api/slack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketName: ticket.ticket_name,
          completedSteps: steps.length,
          totalSteps: steps.length,
        }),
      });

      if (!response.ok) {
        console.error('Failed to send to Slack');
      }
    } catch (error) {
      console.error('Error sending to Slack:', error);
    }
  };

  if (authLoading || loading || !user || !ticket) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#D3D3D3' }}>
        <div className="text-gray-900 text-xl">Loading...</div>
      </div>
    );
  }

  const completedCount = steps.filter(s => s.is_completed).length;
  const progress = (completedCount / steps.length) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#D3D3D3' }}>
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl">
        {/* Header with Logo */}
        <div className="flex justify-center mb-4">
          <Image 
            src="/logo.svg" 
            alt="Company Logo" 
            width={180} 
            height={60}
            className="object-contain"
          />
        </div>

        {/* Ticket Info */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{ticket.ticket_name}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>Step {currentStep + 1} of {steps.length}</span>
            <span>•</span>
            <span>{completedCount} completed</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gray-900 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Current Step */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {steps[currentStep].step_title}
          </h2>
          <p className="text-gray-600">
            {steps[currentStep].step_description}
          </p>
        </div>

        {/* Checkbox Confirmation */}
        {!steps[currentStep].is_completed && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={currentStepChecked}
                onChange={handleCheckboxChange}
                className="w-5 h-5 text-gray-900 border-gray-300 rounded focus:ring-gray-900 cursor-pointer"
              />
              <span className="text-gray-700 font-medium">
                I confirm this step is complete
              </span>
            </label>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors flex items-center gap-2"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>

          {!steps[currentStep].is_completed && (
            <button
              onClick={handleNext}
              disabled={!currentStepChecked}
              className="flex-1 bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-black disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {currentStep === steps.length - 1 ? 'Complete Ticket' : 'Next Step'}
              <ArrowRight size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

