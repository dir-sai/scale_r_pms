import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { z } from 'zod';
import LogRocket from 'logrocket';

const exposureSchema = z.object({
  experimentId: z.string(),
  variantId: z.string(),
  sessionId: z.string(),
  metadata: z.record(z.any()).optional(),
});

const conversionSchema = z.object({
  experimentId: z.string(),
  variantId: z.string(),
  sessionId: z.string(),
  type: z.string(),
  value: z.number().optional(),
  metadata: z.record(z.any()).optional(),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    const json = await req.json();
    const { type, ...data } = json;

    switch (type) {
      case 'exposure':
        const exposureData = exposureSchema.parse(data);
        const exposure = await db.exposure.create({
          data: {
            ...exposureData,
            userId: session?.user?.id,
          },
        });

        // Link with LogRocket session
        LogRocket.track('experiment_exposure', {
          ...exposureData,
          userId: session?.user?.id,
          timestamp: new Date().toISOString(),
        });

        return Response.json(exposure);

      case 'conversion':
        const conversionData = conversionSchema.parse(data);
        const conversion = await db.conversion.create({
          data: {
            ...conversionData,
            userId: session?.user?.id,
          },
        });

        // Link with LogRocket session
        LogRocket.track('experiment_conversion', {
          ...conversionData,
          userId: session?.user?.id,
          timestamp: new Date().toISOString(),
        });

        return Response.json(conversion);

      default:
        return new Response('Invalid event type', { status: 400 });
    }
  } catch (error) {
    console.error('Experiment tracking error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}