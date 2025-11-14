# Ticket Checklist App

A team organizational tool for managing ticket completion checklists with Slack integration.

## Features

- ✅ Step-by-step checklist workflow
- 📊 Progress tracking
- 🔄 Navigate between steps
- 📱 Mobile-responsive design
- 💬 Slack notifications on completion
- 🎨 Clean, modern UI

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Slack workspace with webhook access
- GitHub account
- Vercel account

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd ticket-checklist
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy the example env file:
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` and add your Slack webhook URL:
   ```
   SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Setting Up Slack Integration

1. Go to [Slack API - Incoming Webhooks](https://api.slack.com/messaging/webhooks)
2. Click "Create New App" → "From scratch"
3. Name your app and select your workspace
4. Go to "Incoming Webhooks" and toggle "Activate Incoming Webhooks"
5. Click "Add New Webhook to Workspace"
6. Select the channel where you want notifications
7. Copy the webhook URL and add it to your `.env.local` file

## Deploying to Vercel

### Option 1: Deploy via Vercel Dashboard

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Click "Import Project"
4. Select your GitHub repository
5. Add your environment variable:
   - Key: `SLACK_WEBHOOK_URL`
   - Value: Your Slack webhook URL
6. Click "Deploy"

### Option 2: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. Add environment variable in Vercel dashboard:
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Add `SLACK_WEBHOOK_URL`

### Connecting to GitHub

Vercel automatically connects to your GitHub repository. Any push to your main branch will trigger a new deployment.

## Customizing the App

### Adding Your Company Logo

1. Replace `public/logo.svg` with your company logo (PNG or SVG format recommended)
2. If using a different filename, update the `src` in `app/page.tsx` (line ~104)
3. See `public/LOGO_INSTRUCTIONS.md` for detailed instructions

### Customizing the Checklist Steps

Edit the `CHECKLIST_STEPS` array in `app/page.tsx` to customize your checklist items:

```typescript
const CHECKLIST_STEPS = [
  { id: 1, title: 'Your Step', description: 'Step description' },
  // Add more steps...
];
```

## Project Structure

```
ticket-checklist/
├── app/
│   ├── api/
│   │   └── slack/
│   │       └── route.ts       # Slack API endpoint
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Main app component
├── public/                    # Static assets
│   ├── logo.svg               # Company logo (replace with yours)
│   └── LOGO_INSTRUCTIONS.md   # Logo setup guide
├── .env.local.example         # Environment variables template
├── next.config.js             # Next.js configuration
├── package.json               # Dependencies
├── tailwind.config.js         # Tailwind CSS config
└── tsconfig.json              # TypeScript config
```

## Future: Converting to Mobile App

This app is built with React, making it easy to convert to React Native for a mobile app:

1. Use React Native with Expo
2. Reuse most of the component logic
3. Adapt UI components to React Native components
4. Use React Native's AsyncStorage for local data
5. Implement push notifications instead of Slack (or keep both)

## Technologies Used

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Vercel** - Hosting
- **Slack API** - Notifications

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
