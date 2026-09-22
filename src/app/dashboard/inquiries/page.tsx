"use client";

import { useEffect, useState, useCallback } from "react";
import {
  MessageSquareSearch,
  Sparkles,
  Search,
  CheckCircle2,
  X,
  AlertCircle,
  Loader2,
  Calendar,
  Mail,
  Phone,
  DoorOpen,
  ArrowRight,
  PackageCheck,
} from "lucide-react";
import { format } from "date-fns";

interface GuestInquiry {
  id: string;
  referenceCode: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  roomNumber: string;
  checkOutDate: string;
  category: string;
  description: string;
  status: string;
  createdAt: string;
  matchedItems: Array<{
    id: string;
    itemNumber: string;
    title: string;
    status: string;
    storageLocation: string;
  }>;
}

interface MatchCandidate {
  item: {
    id: string;
    itemNumber: string;
    title: string;
    category: string;
    roomNumber: string;
    storageLocation: string;
    foundDate: string;
    loggedBy: { fullName: string };
  };
  score: number;
  confidence: "HIGH" | "MEDIUM" | "LOW";
  matchReasons: string[];
}

export default function GuestInquiriesPage() {
  const [inquiries, setInquiries] = useState<GuestInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  // Smart Matchmaker Modal State
  const [selectedInquiry, setSelectedInquiry] = useState<GuestInquiry | null>(null);
  const [matchingCandidates, setMatchingCandidates] = useState<MatchCandidate[]>([]);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [linkingItemId, setLinkingItemId] = useState<string | null>(null);
  const [matchSuccessMessage, setMatchSuccessMessage] = useState<string | null>(null);

  const fetchInquiries = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== "ALL") params.append("status", statusFilter);

      const res = await fetch(`/api/inquiries?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setInquiries(data.inquiries || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  // Open Smart Matchmaker
  const handleOpenMatcher = async (inquiry: GuestInquiry) => {
    setSelectedInquiry(inquiry);
    setMatchingCandidates([]);
    setMatchSuccessMessage(null);
    setLoadingMatches(true);

    try {
      const res = await fetch(`/api/inquiries/${inquiry.id}/matches`);
      if (res.ok) {
        const data = await res.json();
        setMatchingCandidates(data.matches || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingMatches(false);
    }
  };

  // Link Item with Inquiry
  const handleLinkItem = async (foundItemId: string) => {
    if (!selectedInquiry) return;
    setLinkingItemId(foundItemId);

    try {
      const res = await fetch(`/api/inquiries/${selectedInquiry.id}/link-item`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          foundItemId,
          notes: `Linked via smart match tool with score confidence.`,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMatchSuccessMessage(data.message || "Item linked successfully!");
        fetchInquiries();
      } else {
        alert(data.error || "Failed to link item");
      }
    } catch {
      alert("Network error while linking item.");
    } finally {
      setLinkingItemId(null);
    }
  };

  const filteredInquiries = inquiries.filter((inq) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      inq.referenceCode.toLowerCase().includes(q) ||
      inq.guestName.toLowerCase().includes(q) ||
      inq.roomNumber.toLowerCase().includes(q) ||
      inq.description.toLowerCase().includes(q)
    );
  });

  const getInquiryStatusBadge = (status: string) => {
    switch (status) {
      case "OPEN":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
            Open
          </span>
        );
      case "UNDER_REVIEW":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
            Under Review / Matched
          </span>
        );
      case "RESOLVED":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
            Resolved
          </span>
        );
      case "CLOSED":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-200 text-slate-700">
            Closed
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Guest Inquiries & Smart Matchmaker
          </h1>
          <p className="text-sm text-slate-500">
            Review guest reports, cross-reference storage items, and link matched inventory.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search inquiries by guest name, ref code (e.g. INQ-4821), or room..."
            className="w-full pl-9 pr-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
          >
            <option value="ALL">All Inquiry Statuses</option>
            <option value="OPEN">Open (Unmatched)</option>
            <option value="UNDER_REVIEW">Under Review / Matched</option>
            <option value="RESOLVED">Resolved (Returned)</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>
      </div>

      {/* Inquiries List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center">
            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-2" />
            <p className="text-sm text-slate-500">Loading guest inquiries...</p>
          </div>
        ) : filteredInquiries.length === 0 ? (
          <div className="py-20 text-center text-slate-500">
            <MessageSquareSearch className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-800">No guest inquiries found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Guest submissions from the public report form will automatically appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredInquiries.map((inq) => (
              <div
                key={inq.id}
                className="p-5 hover:bg-slate-50/75 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Inquiry Info */}
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {inq.referenceCode}
                    </span>
                    <span className="font-bold text-slate-900">{inq.guestName}</span>
                    {getInquiryStatusBadge(inq.status)}
                    <span className="text-xs text-slate-400">
                      Submitted {format(new Date(inq.createdAt), "MMM d, yyyy")}
                    </span>
                  </div>

                  <p className="text-sm text-slate-700 max-w-3xl leading-relaxed">
                    &ldquo;{inq.description}&rdquo;
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <DoorOpen className="w-3.5 h-3.5 text-slate-400" /> Room {inq.roomNumber}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" /> Checkout:{" "}
                      {format(new Date(inq.checkOutDate), "MMM d, yyyy")}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-slate-400" /> {inq.guestEmail}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-slate-400" /> {inq.guestPhone}
                    </span>
                  </div>

                  {inq.matchedItems.length > 0 && (
                    <div className="pt-2 flex items-center gap-2">
                      <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-2 py-1 rounded border border-amber-200 flex items-center gap-1">
                        <PackageCheck className="w-3.5 h-3.5 text-amber-600" /> Linked with Item #
                        {inq.matchedItems[0].itemNumber} ({inq.matchedItems[0].title})
                      </span>
                    </div>
                  )}
                </div>

                {/* Match Action */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleOpenMatcher(inq)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Run Smart Match
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SMART MATCHMAKER MODAL */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Smart Inventory Match Analysis
                  </h2>
                  <p className="text-xs text-slate-500">
                    Scanning active storage against Inquiry {selectedInquiry.referenceCode} (Room{" "}
                    {selectedInquiry.roomNumber})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Target Inquiry Details Recap */}
            <div className="my-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <div className="font-semibold text-slate-800">
                Guest: {selectedInquiry.guestName} • Room {selectedInquiry.roomNumber} • Checkout:{" "}
                {format(new Date(selectedInquiry.checkOutDate), "MMM d, yyyy")}
              </div>
              <p className="text-slate-600 italic">&ldquo;{selectedInquiry.description}&rdquo;</p>
            </div>

            {matchSuccessMessage && (
              <div className="my-3 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                {matchSuccessMessage}
              </div>
            )}

            {/* Match Results */}
            <div className="mt-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Identified Storage Matches
              </h3>

              {loadingMatches ? (
                <div className="py-12 text-center text-xs text-slate-400">
                  <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-emerald-600" />
                  Running algorithmic cross-check against storage bins...
                </div>
              ) : matchingCandidates.length === 0 ? (
                <div className="py-8 text-center p-4 rounded-xl border border-dashed border-slate-200 text-slate-500 text-xs">
                  <AlertCircle className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
                  No matching candidates currently in storage score above the 30% confidence threshold.
                  <p className="text-[11px] text-slate-400 mt-1">
                    Housekeeping may not have discovered or logged this item yet. Check back after next shift turnover.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {matchingCandidates.map((candidate) => (
                    <div
                      key={candidate.item.id}
                      className="p-4 rounded-xl border border-slate-200 bg-white hover:border-emerald-300 transition shadow-xs"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-slate-700">
                              {candidate.item.itemNumber}
                            </span>
                            <span className="font-bold text-sm text-slate-900">
                              {candidate.item.title}
                            </span>
                            {/* Score Pill */}
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-extrabold ${
                                candidate.confidence === "HIGH"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : candidate.confidence === "MEDIUM"
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-slate-100 text-slate-700"
                              }`}
                            >
                              {candidate.score}% Match ({candidate.confidence})
                            </span>
                          </div>

                          <div className="text-xs text-slate-500 mt-1 flex items-center gap-3">
                            <span>Room: {candidate.item.roomNumber}</span>
                            <span>Bin: {candidate.item.storageLocation}</span>
                            <span>
                              Found: {format(new Date(candidate.item.foundDate), "MMM d, yyyy")}
                            </span>
                          </div>

                          {/* Match Reasons */}
                          <div className="mt-2.5 flex flex-wrap gap-1.5">
                            {candidate.matchReasons.map((reason, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700"
                              >
                                ✓ {reason}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Link Button */}
                        <button
                          onClick={() => handleLinkItem(candidate.item.id)}
                          disabled={linkingItemId === candidate.item.id}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition flex items-center gap-1 disabled:opacity-50 flex-shrink-0"
                        >
                          {linkingItemId === candidate.item.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <ArrowRight className="w-3.5 h-3.5" />
                          )}
                          Link & Match
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedInquiry(null)}
                className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition"
              >
                Close Matchmaker
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
