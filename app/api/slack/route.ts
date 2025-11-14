import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { ticketName, completedSteps, totalSteps } = await request.json();
    
    const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;
    
    if (!slackWebhookUrl) {
      return NextResponse.json(
        { error: 'Slack webhook URL not configured' },
        { status: 500 }
      );
    }

    const message = {
      text: ` *Ticket Checklist Completed*`,
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: 'Ticket Checklist Completed',
            emoji: true,
          },
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Ticket:*\n${ticketName}`,
            },
            {
              type: 'mrkdwn',
              text: `*Status:*\nAll steps completed`,
            },
            {
              type: 'mrkdwn',
              text: `*Progress:*\n${completedSteps}/${totalSteps} steps`,
            },
            {
              type: 'mrkdwn',
              text: `*Completed:*\n${new Date().toLocaleString()}`,
            },
          ],
        },
        {
          type: 'divider',
        },
        {
          type: 'context',
          elements: [
            {
              type: 'mrkdwn',
              text: 'Sent from Ticket Checklist App',
            },
          ],
        },
      ],
    };

    const response = await fetch(slackWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      throw new Error('Failed to send message to Slack');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending to Slack:', error);
    return NextResponse.json(
      { error: 'Failed to send message to Slack' },
      { status: 500 }
    );
  }
}
