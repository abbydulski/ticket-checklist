'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, ArrowRight, CheckCircle2, Circle } from 'lucide-react';
import Image from 'next/image';
import { getTicket, updateStepCompletion } from '@/lib/ticketService';
import { Ticket, TicketStep } from '@/lib/supabase';

// Simple markdown parser for links and bullets
function parseMarkdown(text: string): string {
  if (!text) return '';

  let html = text;

  // Parse markdown links: [text](url) -> <a href="url">text</a>
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline font-medium">$1</a>');

  // Parse bullet points: lines starting with - or * or •
  const lines = html.split('\n');
  const processedLines = lines.map(line => {
    const trimmed = line.trim();
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || trimmed.startsWith('• ')) {
      return '<li class="ml-4">' + trimmed.substring(2) + '</li>';
    }
    return line;
  });

  html = processedLines.join('\n');

  // Wrap consecutive <li> items in <ul>
  html = html.replace(/(<li class="ml-4">.*?<\/li>\n?)+/g, (match) => {
    return '<ul class="list-disc list-inside space-y-1 my-2">' + match + '</ul>';
  });

  // Convert line breaks to <br> (except those already in lists)
  html = html.replace(/\n(?!<\/li>|<li|<ul|<\/ul)/g, '<br>');

  return html;
}

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

  // Calculate section progress
  const sections = [
    { name: 'Job Prep', start: 1, end: 5 },
    { name: 'Field Operations', start: 6, end: 15 },
    { name: 'Office Work', start: 16, end: 20 },
  ];

  const getSectionProgress = (start: number, end: number) => {
    const sectionSteps = steps.filter(s => s.step_id >= start && s.step_id <= end);
    const completed = sectionSteps.filter(s => s.is_completed).length;
    return { completed, total: sectionSteps.length };
  };

  const getCurrentSection = () => {
    const stepId = steps[currentStep].step_id;
    if (stepId >= 1 && stepId <= 5) return 'Job Prep';
    if (stepId >= 6 && stepId <= 15) return 'Field Operations';
    if (stepId >= 16 && stepId <= 20) return 'Office Work';
    return '';
  };

  const completedCount = steps.filter(s => s.is_completed).length;
  const progress = (completedCount / steps.length) * 100;
  const currentSection = getCurrentSection();

  return (
    <div className="min-h-screen flex items-center justify-center p-3 sm:p-4" style={{ backgroundColor: '#D3D3D3' }}>
      <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 w-full max-w-3xl">
        {/* Header with Logo */}
        <div className="flex justify-center mb-4 sm:mb-6">
          <Image
            src="/logo.svg"
            alt="Company Logo"
            width={140}
            height={47}
            className="object-contain w-28 sm:w-36"
          />
        </div>

        {/* Ticket Info */}
        <div className="mb-4 sm:mb-6">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2">{ticket.ticket_name}</h1>
          <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
            <span>Step {currentStep + 1} of {steps.length}</span>
            <span>•</span>
            <span>{completedCount} completed</span>
          </div>
        </div>

        {/* Section Progress Cards */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-6">
          {sections.map((section) => {
            const { completed, total } = getSectionProgress(section.start, section.end);
            const sectionProgress = (completed / total) * 100;
            const isCurrentSection = section.name === currentSection;

            return (
              <div
                key={section.name}
                className={`p-2 sm:p-3 md:p-4 rounded-lg border-2 transition-all ${
                  isCurrentSection
                    ? 'border-gray-900 bg-gray-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="text-[10px] sm:text-xs font-semibold text-gray-500 mb-1 truncate">
                  {section.name}
                </div>
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
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

        {/* Current Section Banner */}
        <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gray-900 text-white rounded-lg">
          <div className="text-xs sm:text-sm font-semibold mb-1">Current Section</div>
          <div className="text-lg sm:text-xl md:text-2xl font-bold">{currentSection}</div>
        </div>

        {/* Current Step */}
        <div className="mb-4 sm:mb-6 p-4 sm:p-6 bg-gray-50 rounded-lg border-2 border-gray-200">
          <div className="text-xs sm:text-sm font-semibold text-gray-500 mb-2">
            Step {steps[currentStep].step_id} of {steps.length}
          </div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
            {steps[currentStep].step_title}
          </h2>
          <div
            className="text-gray-600 text-sm sm:text-base md:text-lg prose prose-sm sm:prose-base max-w-none"
            dangerouslySetInnerHTML={{ __html: parseMarkdown(steps[currentStep].step_description || '') }}
          />
        </div>

        {/* Checkbox Confirmation */}
        {!steps[currentStep].is_completed && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
            <label className="flex items-center gap-2 sm:gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={currentStepChecked}
                onChange={handleCheckboxChange}
                className="w-4 h-4 sm:w-5 sm:h-5 text-gray-900 border-gray-300 rounded focus:ring-gray-900 cursor-pointer flex-shrink-0"
              />
              <span className="text-gray-700 font-medium text-sm sm:text-base">
                I confirm this step is complete
              </span>
            </label>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
            <span>Back to Dashboard</span>
          </button>

          {!steps[currentStep].is_completed && (
            <button
              onClick={handleNext}
              disabled={!currentStepChecked}
              className="flex-1 bg-gray-900 text-white py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-black disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <span>{currentStep === steps.length - 1 ? 'Complete Ticket' : 'Next Step'}</span>
              <ArrowRight size={18} className="sm:w-5 sm:h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

