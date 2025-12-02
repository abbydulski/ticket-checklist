export interface ChecklistStep {
  id: number;
  title: string;
  description: string;
}

export const CHECKLIST_STEPS: ChecklistStep[] = [
  // Section 1: Job Prep
  { id: 1, title: 'Schedule the Job', description: 'To Schedule the Job:\n-Ensure job is added to [Field Team Spreadsheet](https://docs.google.com/spreadsheets/d/1rYt_fyrlUMnSZB97MwX-XVBHNyJSpYeKerGR1GwxE_Y/edit?gid=0#gid=0)\n-Additionally, ensure a google calander invite has been created with Josue, Zack, Robert, and Daniel that includes Site Contact Info, and Price\n-Put any images or information from client into the main company folder under a [subfolder](https://drive.google.com/drive/u/3/folders/11n1EzrSNTScBCjyhzE0W6m82PlxIa2L3) for the individual project' },
  { id: 2, title: 'Collect Site Materials and Site Contact Information', description: 'You have now scheduled the project but need more information before getting started on the project. Chat with the client who you scheduled the project with::\n-Ask if any plans exist\n  -"Do you have any as-builts, utility plans, or site drawings for this project?"\n-Clarify what types of plans of plans help the most\n  -"Civil plans, utility composites, water/sewer/storm layouts, electrical, comms, or any previous locating maps all help us make sure nothing gets missed"\n-Explain why they matter \n  -"These give us a better idea of what to expect underground so we can be as accurate as possible"\n-Request preferred file types \n  -"PDFs are perfect, but CAD files work too if you have them"\n-Confirm how they will send them \n -"Email, shared link, google drive, printed copy onsite, etc.")\n-Request onsite contact information \n  -"Who should we call or check in with when we arrive tomorrow? A name and phone number helps us get on site quickly"\n-Add all information given onto calander\n  -"all information given from client is to be added onto google calendar for quick access"' },
  { id: 3, title: 'Create Job Ticket', description: 'Now you need to create the job ticket in the ASC Web App:\n-Open up the [ASC Web App](https://app.advancedspadecompany.com/orgs/demo-org)\n-Select "Tickets" tab\n-Select "Create New Ticket"\n-Ticket generating information (Ticket name should be Company_City_Street Address, matching field team schedule and calendar. Skip the invoice number section. Label priority appropriately. Label the status to match project milestone. Assign to the field tech who will complete the project. Add any associated user who needs to be notified of status. Add project start date, deliverale due date, customer name, address, and any additional notes)\n-Select "Create"\n-Attach project related documentation (Select "Surveys" tab, click "Create New Survey", fill out new surey tab options by leavining utility type blank, putting the identical survey name as to the ticket name with a title change only at the end (include - Site Photos), leave device option blank, insert surveyor name, upload data accordingly (PDFs or images), select "Create Survey", select "Save", attach survey to ticket by selecting the ticket and "Attach Survey Data", find the survey from the list, and select "Attach" and "Save Surveys")\n-Ticket is now created with attachments\n-Share ticket information on google calendar for easy access' },
  { id: 4, title: 'Airspace Clearance Request/Confirmation', description: 'Verify we have proper drone clearance and permissions for the site' },
  { id: 5, title: 'Complete Equipment Pre-Check', description: 'Before heading to the site:\n-Make sure you have all [Field Equipment]() and [Safety Equipment]()\n-Power on your equipment to confirm it is charged, working, and ready to use\n-Verify everything is loaded in the truck so nothing gets left behind' },

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

