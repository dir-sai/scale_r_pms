import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { INFRASTRUCTURE_APIS } from '@/config/infrastructure-apis';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return new Response('Unauthorized', { status: 401 });
    }

    const optimizeResponse = await fetch(
      `https://www.googleapis.com/optimize/v1/experiments?containerId=${INFRASTRUCTURE_APIS.googleOptimize.containerId}`,
      {
        headers: {
          Authorization: `Bearer ${INFRASTRUCTURE_APIS.googleOptimize.apiKey}`,
        },
      }
    );

    const experiments = await optimizeResponse.json();

    // Sync experiments with database
    for (const exp of experiments.items) {
      await db.experiment.upsert({
        where: {
          sourceId: exp.id,
        },
        update: {
          name: exp.name,
          status: exp.status.toLowerCase(),
          variants: {
            deleteMany: {},
            create: exp.variants.map((v: any) => ({
              name: v.name,
              weight: v.weight,
            })),
          },
        },
        create: {
          sourceId: exp.id,
          source: 'google_optimize',
          name: exp.name,
          status: exp.status.toLowerCase(),
          variants: {
            create: exp.variants.map((v: any) => ({
              name: v.name,
              weight: v.weight,
            })),
          },
        },
      });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Experiment sync error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}