export interface ChecklistStep {
  id: number;
  title: string;
  description: string;
}

export const CHECKLIST_STEPS: ChecklistStep[] = [
  // Section 1: Job Prep
  { id: 1, title: 'Create Job Ticket', description: 'Create and initialize the job ticket in the system' },
  { id: 2, title: 'Confirm Job with Client', description: 'Confirm job details, schedule, and expectations with client' },
  { id: 3, title: 'Collect Site Materials and Contact Information', description: 'Gather all necessary site materials, maps, and contact information' },
  { id: 4, title: 'Confirm Drone Clearance', description: 'Verify we have proper drone clearance and permissions for the site' },
  { id: 5, title: 'Complete Equipment Pre-Check', description: 'Pre-check all equipment before heading to site' },

  // Section 2: Field Operations
  { id: 6, title: 'Final Equipment Check', description: 'Final equipment check on-site before beginning work' },
  { id: 7, title: 'Communicate with Client', description: 'On-site communication and coordination with client' },
  { id: 8, title: 'Site Walk', description: 'Walk the site and assess conditions, hazards, and access points' },
  { id: 9, title: 'EM Locate', description: 'Perform electromagnetic location to identify underground utilities' },
  { id: 10, title: 'GPR', description: 'Conduct ground penetrating radar survey' },
  { id: 11, title: 'Rodder', description: 'Complete rodder operations for utility tracing' },
  { id: 12, title: 'Site Photography', description: 'Capture comprehensive site photographs and documentation' },
  { id: 13, title: 'Emlid', description: 'Collect Emlid GPS data for precise positioning' },
  { id: 14, title: 'Drone', description: 'Conduct drone aerial survey and capture footage' },
  { id: 15, title: 'Site Departure', description: 'Final site check, cleanup, and departure procedures' },

  // Section 3: Office Work
  { id: 16, title: 'Upload Emlid', description: 'Upload and process Emlid GPS data' },
  { id: 17, title: 'Upload Drone', description: 'Upload and process drone footage and imagery' },
  { id: 18, title: 'Close Report', description: 'Complete and finalize the comprehensive site report' },
  { id: 19, title: 'Publish Report', description: 'Publish and deliver report to client' },
  { id: 20, title: 'Invoice Job', description: 'Generate and send invoice for completed work' },
];

