'use client';

interface Recommendation {
  priority: string;
  hazardType: string;
  title: string;
  description: string;
  actionItems: string[];
}

const PRIORITY_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  critical: { bg: 'bg-red-100', text: 'text-red-700', label: 'Critical' },
  high: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'High' },
  medium: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Medium' },
  low: { bg: 'bg-green-100', text: 'text-green-700', label: 'Low' },
};

export function Recommendations({ items }: { items: Recommendation[] }) {
  if (items.length === 0) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Preparation Checklist</h2>
      <p className="text-gray-500">Personalized recommendations based on your risk profile.</p>

      <div className="space-y-4 mt-4">
        {items.map((rec, i) => {
          const style = PRIORITY_STYLES[rec.priority] || PRIORITY_STYLES.low;
          return (
            <div key={i} className="bg-white rounded-xl border p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${style.bg} ${style.text}`}>
                  {style.label}
                </span>
                <h3 className="font-semibold">{rec.title}</h3>
              </div>
              <ul className="space-y-2">
                {rec.actionItems.map((item, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="mt-0.5 w-5 h-5 rounded border-2 border-gray-300 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
