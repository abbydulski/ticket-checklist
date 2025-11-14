'use client';

import { useState } from 'react';
import { CheckCircle2, Circle, Send, ArrowRight, ArrowLeft } from 'lucide-react';

// Define your checklist steps here
const CHECKLIST_STEPS = [
  { id: 1, title: 'Requirements Gathered', description: 'All requirements documented and approved' },
  { id: 2, title: 'Design Review', description: 'Design has been reviewed and signed off' },
  { id: 3, title: 'Code Implementation', description: 'Code written and self-reviewed' },
  { id: 4, title: 'Unit Tests', description: 'Unit tests written and passing' },
  { id: 5, title: 'Peer Review', description: 'Code reviewed by at least one team member' },
  { id: 6, title: 'QA Testing', description: 'QA has tested the changes' },
  { id: 7, title: 'Documentation', description: 'Documentation updated' },
  { id: 8, title: 'Deployment Ready', description: 'Ready for production deployment' },
];

export default function Home() {
  const [ticketName, setTicketName] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [isStarted, setIsStarted] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleStart = () => {
    if (ticketName.trim()) {
      setIsStarted(true);
    }
  };

  const handleStepComplete = () => {
    const newCompleted = new Set(completedSteps);
    newCompleted.add(CHECKLIST_STEPS[currentStep].id);
    setCompletedSteps(newCompleted);

    if (currentStep < CHECKLIST_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsComplete(true);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSendToSlack = async () => {
    setIsSending(true);
    try {
      const response = await fetch('/api/slack', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ticketName,
          completedSteps: CHECKLIST_STEPS.length,
          totalSteps: CHECKLIST_STEPS.length,
        }),
      });

      if (response.ok) {
        alert('Report sent to Slack successfully!');
        // Reset the form
        setTicketName('');
        setCurrentStep(0);
        setCompletedSteps(new Set());
        setIsStarted(false);
        setIsComplete(false);
      } else {
        alert('Failed to send to Slack. Please try again.');
      }
    } catch (error) {
      console.error('Error sending to Slack:', error);
      alert('Error sending to Slack. Please check your configuration.');
    } finally {
      setIsSending(false);
    }
  };

  const progressPercentage = (completedSteps.size / CHECKLIST_STEPS.length) * 100;

  // Initial screen - Enter ticket name
  if (!isStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Ticket Checklist</h1>
          <p className="text-gray-600 mb-6">Enter your ticket name to begin</p>
          
          <input
            type="text"
            value={ticketName}
            onChange={(e) => setTicketName(e.target.value)}
            placeholder="e.g., PROJ-123 - User Authentication"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 mb-6"
            onKeyPress={(e) => e.key === 'Enter' && handleStart()}
          />
          
          <button
            onClick={handleStart}
            disabled={!ticketName.trim()}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            Start Checklist
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    );
  }

  // Completion screen
  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={48} className="text-white" />
          </div>
          
          <h2 className="text-3xl font-bold text-gray-800 mb-2">All Done!</h2>
          <p className="text-gray-600 mb-6">
            You've completed all checklist items for <strong>{ticketName}</strong>
          </p>
          
          <button
            onClick={handleSendToSlack}
            disabled={isSending}
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 disabled:bg-gray-300 transition-colors flex items-center justify-center gap-2 mb-3"
          >
            <Send size={20} />
            {isSending ? 'Sending...' : 'Send Report to Slack'}
          </button>
          
          <button
            onClick={() => {
              setTicketName('');
              setCurrentStep(0);
              setCompletedSteps(new Set());
              setIsStarted(false);
              setIsComplete(false);
            }}
            className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            Start New Ticket
          </button>
        </div>
      </div>
    );
  }

  // Checklist screen
  const currentStepData = CHECKLIST_STEPS[currentStep];
  const isCurrentStepComplete = completedSteps.has(currentStepData.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{ticketName}</h1>
          <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
            <span>Step {currentStep + 1} of {CHECKLIST_STEPS.length}</span>
            <span>{completedSteps.size} completed</span>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Current Step Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex items-start gap-4 mb-6">
            {isCurrentStepComplete ? (
              <CheckCircle2 size={32} className="text-green-500 flex-shrink-0" />
            ) : (
              <Circle size={32} className="text-gray-300 flex-shrink-0" />
            )}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {currentStepData.title}
              </h2>
              <p className="text-gray-600">{currentStepData.description}</p>
            </div>
          </div>

          <div className="flex gap-3">
            {currentStep > 0 && (
              <button
                onClick={handlePrevious}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft size={20} />
                Previous
              </button>
            )}
            
            <button
              onClick={handleStepComplete}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              {currentStep === CHECKLIST_STEPS.length - 1 ? 'Complete' : 'Next'}
              {currentStep < CHECKLIST_STEPS.length - 1 && <ArrowRight size={20} />}
            </button>
          </div>
        </div>

        {/* Steps Overview */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">All Steps</h3>
          <div className="space-y-3">
            {CHECKLIST_STEPS.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  index === currentStep ? 'bg-blue-50 border-2 border-blue-200' : ''
                } ${completedSteps.has(step.id) ? 'opacity-60' : ''}`}
              >
                {completedSteps.has(step.id) ? (
                  <CheckCircle2 size={24} className="text-green-500 flex-shrink-0" />
                ) : (
                  <Circle size={24} className="text-gray-300 flex-shrink-0" />
                )}
                <span className={`text-sm ${completedSteps.has(step.id) ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
