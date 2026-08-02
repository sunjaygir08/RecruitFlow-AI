/**
 * StatCard — Reusable metric card for dashboard.
 * Shows an icon, label, and numeric value.
 */

const colorMap = {
  indigo: { bg: 'bg-indigo-50', icon: 'text-indigo-600', border: 'border-indigo-100' },
  blue:   { bg: 'bg-blue-50',   icon: 'text-blue-600',   border: 'border-blue-100' },
  green:  { bg: 'bg-green-50',  icon: 'text-green-600',  border: 'border-green-100' },
  yellow: { bg: 'bg-amber-50',  icon: 'text-amber-600',  border: 'border-amber-100' },
  red:    { bg: 'bg-red-50',    icon: 'text-red-600',    border: 'border-red-100' },
};

export default function StatCard({ icon: Icon, label, value, subtitle, color = 'indigo' }) {
  const c = colorMap[color] || colorMap.indigo;

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <div className={`p-2 rounded-lg ${c.bg} ${c.border} border`}>
          <Icon size={18} className={c.icon} />
        </div>
      </div>
      <p className="text-3xl font-bold text-slate-800">{value ?? '—'}</p>
      {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
    </div>
  );
}
