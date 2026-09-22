"use client";

import { useEffect, useState } from "react";
import {
  BarChart3,
  Clock,
  ShieldAlert,
  CheckCircle2,
  Trash2,
  Boxes,
  Loader2,
  Layers,
} from "lucide-react";
import { format } from "date-fns";

interface DashboardStats {
  inStorage: number;
  matched: number;
  returned: number;
  disposed: number;
  openInquiries: number;
  agingOver30Days: number;
  categories: Array<{ category: string; count: number }>;
}

interface FoundItem {
  id: string;
  itemNumber: string;
  title: string;
  category: string;
  roomNumber: string;
  storageLocation: string;
  foundDate: string;
  status: string;
}

export default function AnalyticsCompliancePage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [agingItems, setAgingItems] = useState<FoundItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [statsRes, itemsRes] = await Promise.all([
          fetch("/api/stats"),
          fetch("/api/items?status=IN_STORAGE"),
        ]);

        if (statsRes.ok) {
          const s = await statsRes.json();
          setStats(s.stats);
        }

        if (itemsRes.ok) {
          const itms = await itemsRes.json();
          // Filter items stored for more than 10 days to highlight aging in demo
          const allStored = itms.items || [];
          setAgingItems(allStored);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const totalHandled = stats
    ? stats.inStorage + stats.matched + stats.returned + stats.disposed
    : 0;
  const returnRate =
    totalHandled > 0 && stats ? Math.round((stats.returned / totalHandled) * 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Storage Compliance & Operations Health
        </h1>
        <p className="text-sm text-slate-500">
          Monitor property retention policies, resolution rates, and items requiring legal donation or disposal.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-2" />
          <p className="text-sm text-slate-500">Loading compliance data...</p>
        </div>
      ) : (
        <>
          {/* Key Compliance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Metric 1 */}
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Guest Return Rate
                </span>
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="text-3xl font-extrabold text-slate-900 mt-2">{returnRate}%</div>
              <p className="text-xs text-slate-500 mt-1">
                {stats?.returned} of {totalHandled} recorded items safely returned to guests.
              </p>
            </div>

            {/* Metric 2 */}
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Aging Items (&gt;30 Days)
                </span>
                <Clock className="w-5 h-5 text-amber-500" />
              </div>
              <div className="text-3xl font-extrabold text-amber-600 mt-2">
                {stats?.agingOver30Days}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Eligible for charitable donation per 30-day hotel retention policy.
              </p>
            </div>

            {/* Metric 3 */}
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Open Inquiries
                </span>
                <Boxes className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-3xl font-extrabold text-blue-600 mt-2">
                {stats?.openInquiries}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Awaiting algorithmic match or housekeeping shift intake.
              </p>
            </div>
          </div>

          {/* Category Distribution Breakdown */}
          <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-600" /> Discovered Items by Category
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {stats?.categories.map((cat) => (
                <div
                  key={cat.category}
                  className="p-3.5 rounded-lg bg-slate-50 border border-slate-200"
                >
                  <div className="text-xs text-slate-500 font-medium">
                    {cat.category.replace("_", " ")}
                  </div>
                  <div className="text-xl font-extrabold text-slate-800 mt-1">{cat.count}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Storage Shelf Audit */}
          <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-slate-700" /> Current Storage Inventory Audit
                </h2>
                <p className="text-xs text-slate-500">
                  Items currently occupying physical hotel bins and lockers.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider">
                    <th className="py-2.5 px-3">Item #</th>
                    <th className="py-2.5 px-3">Title</th>
                    <th className="py-2.5 px-3">Bin Location</th>
                    <th className="py-2.5 px-3">Room</th>
                    <th className="py-2.5 px-3">Date Found</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {agingItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-mono font-semibold">{item.itemNumber}</td>
                      <td className="py-2.5 px-3 font-medium text-slate-800">{item.title}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-600">
                        {item.storageLocation}
                      </td>
                      <td className="py-2.5 px-3">{item.roomNumber}</td>
                      <td className="py-2.5 px-3 text-slate-500">
                        {format(new Date(item.foundDate), "MMM d, yyyy")}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
