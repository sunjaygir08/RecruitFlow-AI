/**
 * ScoreBadge — Color-coded AI score display.
 *
 * Score ranges:
 * 90-100 → Highly Recommended (green)
 * 75-89  → Recommended (blue/indigo)
 * 60-74  → Consider (yellow)
 * <60    → Not Recommended (red)
 */

export default function ScoreBadge({ score }) {
  if (!score && score !== 0) {
    return (
      <span className="text-xs text-gray-400 italic">Not scored</span>
    );
  }

  let style, label;

  if (score >= 90) {
    style = 'bg-green-100 text-green-700 border-green-200';
    label = 'Highly Recommended';
  } else if (score >= 75) {
    style = 'bg-indigo-100 text-indigo-700 border-indigo-200';
    label = 'Recommended';
  } else if (score >= 60) {
    style = 'bg-amber-100 text-amber-700 border-amber-200';
    label = 'Consider';
  } else {
    style = 'bg-red-100 text-red-700 border-red-200';
    label = 'Not Recommended';
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${style}`}
    >
      <span className="font-bold">{score}</span>
      <span className="text-opacity-80">{label}</span>
    </span>
  );
}
