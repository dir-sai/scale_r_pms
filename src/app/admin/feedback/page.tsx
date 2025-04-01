import { db } from '@/lib/db';

export default async function FeedbackDashboard() {
  const [npsResponses, vocResponses] = await Promise.all([
    db.nPSResponse.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    }),
    db.voCResponse.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    }),
  ]);

  const npsScore = npsResponses.reduce((acc, curr) => acc + curr.score, 0) / npsResponses.length;
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Feedback Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-4">
          <h2 className="text-xl font-semibold mb-4">NPS Score</h2>
          <div className="text-4xl font-bold">{npsScore.toFixed(1)}</div>
        </div>

        <div className="card p-4">
          <h2 className="text-xl font-semibold mb-4">VoC Sentiment</h2>
          <div className="space-y-2">
            {['positive', 'neutral', 'negative'].map(sentiment => {
              const count = vocResponses.filter(r => r.sentiment === sentiment).length;
              return (
                <div key={sentiment} className="flex justify-between">
                  <span>{sentiment}</span>
                  <span>{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add more charts and tables as needed */}
    </div>
  );
}