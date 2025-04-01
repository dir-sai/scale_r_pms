import { NextResponse } from 'next/server';
import LogRocket from 'logrocket';

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    
    // Verify webhook signature
    const signature = req.headers.get('X-Delighted-Signature');
    if (!verifyDelightedSignature(signature, JSON.stringify(payload))) {
      return new Response('Invalid signature', { status: 401 });
    }

    // Extract LogRocket session URL from properties
    const sessionURL = payload.properties?.logrocket_session;
    
    if (sessionURL) {
      // Update LogRocket metadata with NPS score
      LogRocket.track('delighted_nps_received', {
        score: payload.score,
        comment: payload.comment,
        sessionURL,
        person_id: payload.person_id,
        survey_type: payload.survey_type,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delighted webhook error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

function verifyDelightedSignature(signature: string | null, payload: string): boolean {
  if (!signature || !process.env.DELIGHTED_WEBHOOK_SECRET) return false;
  
  const crypto = require('crypto');
  const hmac = crypto.createHmac('sha256', process.env.DELIGHTED_WEBHOOK_SECRET);
  const calculated = hmac.update(payload).digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(calculated)
  );
}