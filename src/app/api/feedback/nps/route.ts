import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { z } from 'zod';

const npsSchema = z.object({
  score: z.number().min(0).max(10),
  feedback: z.string().optional(),
  touchpoint: z.string(),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 });
    }

    const json = await req.json();
    const data = npsSchema.parse(json);

    const response = await db.nPSResponse.create({
      data: {
        ...data,
        userId: session.user.id,
        userType: session.user.role.toLowerCase(),
      },
    });

    return Response.json(response);
  } catch (error) {
    console.error('NPS submission error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}