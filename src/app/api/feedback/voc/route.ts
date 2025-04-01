import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { z } from 'zod';

const vocSchema = z.object({
  category: z.enum(['bug', 'feature', 'experience', 'support', 'other']),
  sentiment: z.enum(['positive', 'neutral', 'negative']),
  feedback: z.string().min(1),
  context: z.record(z.any()).optional(),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 });
    }

    const json = await req.json();
    const data = vocSchema.parse(json);

    const response = await db.voCResponse.create({
      data: {
        ...data,
        userId: session.user.id,
        userType: session.user.role.toLowerCase(),
      },
    });

    return Response.json(response);
  } catch (error) {
    console.error('VoC submission error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}