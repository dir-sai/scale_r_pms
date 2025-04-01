import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const experimentId = searchParams.get('experimentId');

    if (!experimentId) {
      return new Response('Missing experimentId', { status: 400 });
    }

    // Get experiment data with variants
    const experiment = await db.experiment.findUnique({
      where: { id: experimentId },
      include: {
        variants: {
          include: {
            _count: {
              select: {
                exposures: true,
                conversions: true,
              },
            },
          },
        },
      },
    });

    if (!experiment) {
      return new Response('Experiment not found', { status: 404 });
    }

    // Calculate conversion rates and confidence intervals
    const analysis = experiment.variants.map(variant => {
      const exposures = variant._count.exposures;
      const conversions = variant._count.conversions;
      const conversionRate = exposures > 0 ? conversions / exposures : 0;
      
      // Calculate 95% confidence interval
      const standardError = Math.sqrt((conversionRate * (1 - conversionRate)) / exposures);
      const marginOfError = 1.96 * standardError;

      return {
        variantId: variant.id,
        variantName: variant.name,
        exposures,
        conversions,
        conversionRate,
        confidenceInterval: {
          lower: Math.max(0, conversionRate - marginOfError),
          upper: Math.min(1, conversionRate + marginOfError),
        },
      };
    });

    return Response.json({
      experiment,
      analysis,
    });
  } catch (error) {
    console.error('Analysis error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}