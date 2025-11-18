export interface ChecklistStep {
  id: number;
  title: string;
  description: string;
}

export const CHECKLIST_STEPS: ChecklistStep[] = [
  // Section 1: Job Prep
  { id: 1, title: 'Create Job Ticket', description: 'Section 1: Job Prep - Create and initialize the job ticket' },
  { id: 2, title: 'Confirm Job with Client', description: 'Section 1: Job Prep - Confirm job details and schedule with client' },
  { id: 3, title: 'Collect Site Materials and Contact Information', description: 'Section 1: Job Prep - Gather all necessary site materials and contact info' },
  { id: 4, title: 'Confirm Drone Clearance', description: 'Section 1: Job Prep - Verify we have proper drone clearance for the site' },
  { id: 5, title: 'Complete Equipment Pre-Check', description: 'Section 1: Job Prep - Pre-check all equipment before heading to site' },
  
  // Section 2: Field Operations
  { id: 6, title: 'Final Equipment Check', description: 'Section 2: Field Operations - Final equipment check on-site' },
  { id: 7, title: 'Communicate with Client', description: 'Section 2: Field Operations - On-site communication with client' },
  { id: 8, title: 'Site Walk', description: 'Section 2: Field Operations - Walk the site and assess conditions' },
  { id: 9, title: 'EM Locate', description: 'Section 2: Field Operations - Perform electromagnetic location' },
  { id: 10, title: 'GPR', description: 'Section 2: Field Operations - Ground penetrating radar survey' },
  { id: 11, title: 'Rodder', description: 'Section 2: Field Operations - Rodder operations' },
  { id: 12, title: 'Site Photography', description: 'Section 2: Field Operations - Capture site photographs' },
  { id: 13, title: 'Emlid', description: 'Section 2: Field Operations - Emlid GPS data collection' },
  { id: 14, title: 'Drone', description: 'Section 2: Field Operations - Drone aerial survey' },
  { id: 15, title: 'Site Departure', description: 'Section 2: Field Operations - Final site check and departure' },
  
  // Section 3: Office Work
  { id: 16, title: 'Upload Emlid', description: 'Section 3: Office Work - Upload and process Emlid data' },
  { id: 17, title: 'Upload Drone', description: 'Section 3: Office Work - Upload and process drone footage' },
  { id: 18, title: 'Close Report', description: 'Section 3: Office Work - Complete and finalize the report' },
  { id: 19, title: 'Publish Report', description: 'Section 3: Office Work - Publish report to client' },
  { id: 20, title: 'Invoice Job', description: 'Section 3: Office Work - Generate and send invoice' },
];

