"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Boxes,
  Plus,
  Search,
  CheckCircle,
  Truck,
  Trash2,
  History,
  X,
  AlertCircle,
  Loader2,
  ArrowRight,
  ShieldCheck,
  Check,
} from "lucide-react";
import { ITEM_CATEGORIES, ITEM_STATUSES, RETURN_METHODS } from "@/lib/validators";
import { format } from "date-fns";

interface FoundItem {
  id: string;
  itemNumber: string;
  title: string;
  category: string;
  roomNumber: string;
  locationDetails: string | null;
  storageLocation: string;
  status: string;
  imageUrl: string | null;
  foundDate: string;
  claimedByGuestName: string | null;
  returnMethod: string | null;
  courierTrackingNumber: string | null;
  disposalReason: string | null;
  resolvedAt: string | null;
  createdAt: string;
  loggedBy: {
    fullName: string;
    email: string;
  };
  guestInquiry?: {
    id: string;
    referenceCode: string;
    guestName: string;
    guestEmail: string;
  } | null;
}

interface AuditLog {
  id: string;
  action: string;
  details: string;
  performedByName: string;
  createdAt: string;
}

export default function DashboardInventoryPage() {
  const [items, setItems] = useState<FoundItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  // Modals & Drawers
  const [showLogModal, setShowLogModal] = useState(false);
  const [selectedItemForDetails, setSelectedItemForDetails] = useState<FoundItem | null>(null);
  const [itemAuditLogs, setItemAuditLogs] = useState<AuditLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  const [itemToRelease, setItemToRelease] = useState<FoundItem | null>(null);
  const [itemToDispose, setItemToDispose] = useState<FoundItem | null>(null);

  // Form states for modals
  const [logFormData, setLogFormData] = useState({
    title: "",
    category: "ELECTRONICS",
    roomNumber: "",
    locationDetails: "",
    storageLocation: "",
    imageUrl: "",
    foundDate: new Date().toISOString().split("T")[0],
  });
  const [logSubmitting, setLogSubmitting] = useState(false);
  const [logErrors, setLogErrors] = useState<Record<string, string[]>>({});

  const [releaseFormData, setReleaseFormData] = useState({
    claimedByGuestName: "",
    returnMethod: "IN_PERSON" as (typeof RETURN_METHODS)[number],
    courierTrackingNumber: "",
    notes: "",
  });
  const [releaseSubmitting, setReleaseSubmitting] = useState(false);
  const [releaseError, setReleaseError] = useState<string | null>(null);

  const [disposalReason, setDisposalReason] = useState("DONATED_TO_CHARITY");
  const [disposalNotes, setDisposalNotes] = useState("");
  const [disposalSubmitting, setDisposalSubmitting] = useState(false);

  // Fetch Items
  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const queryParams = new URLSearchParams();
      if (selectedStatus !== "ALL") queryParams.append("status", selectedStatus);
      if (selectedCategory !== "ALL") queryParams.append("category", selectedCategory);
      if (search.trim()) queryParams.append("search", search.trim());

      const res = await fetch(`/api/items?${queryParams.toString()}`);
      if (!res.ok) throw new Error("Failed to load inventory");
      const data = await res.json();
      setItems(data.items || []);
    } catch {
      setError("Unable to load found items inventory. Please refresh.");
    } finally {
      setLoading(false);
    }
  }, [selectedStatus, selectedCategory, search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchItems();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchItems]);

  // Load audit history when drawer opens
  const openItemDetails = async (item: FoundItem) => {
    setSelectedItemForDetails(item);
    setLoadingLogs(true);
    try {
      const res = await fetch(`/api/items/${item.id}`);
      if (res.ok) {
        const data = await res.json();
        setItemAuditLogs(data.item.auditLogs || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingLogs(false);
    }
  };

  // Submit new found item
  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setLogSubmitting(true);
    setLogErrors({});

    try {
      const res = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(logFormData),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.details) {
          setLogErrors(data.details);
        } else {
          alert(data.error || "Failed to log item");
        }
        return;
      }

      setShowLogModal(false);
      setLogFormData({
        title: "",
        category: "ELECTRONICS",
        roomNumber: "",
        locationDetails: "",
        storageLocation: "",
        imageUrl: "",
        foundDate: new Date().toISOString().split("T")[0],
      });
      fetchItems();
    } catch {
      alert("Failed to submit item record.");
    } finally {
      setLogSubmitting(false);
    }
  };

  // Submit release to guest
  const handleReleaseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemToRelease) return;
    setReleaseSubmitting(true);
    setReleaseError(null);

    try {
      const res = await fetch(`/api/items/${itemToRelease.id}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "RETURNED",
          claimedByGuestName: releaseFormData.claimedByGuestName,
          returnMethod: releaseFormData.returnMethod,
          courierTrackingNumber:
            releaseFormData.returnMethod === "COURIER"
              ? releaseFormData.courierTrackingNumber
              : undefined,
          notes: releaseFormData.notes,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setReleaseError(data.error || "Failed to process release");
        return;
      }

      setItemToRelease(null);
      setReleaseFormData({
        claimedByGuestName: "",
        returnMethod: "IN_PERSON",
        courierTrackingNumber: "",
        notes: "",
      });
      fetchItems();
    } catch {
      setReleaseError("Network error occurred.");
    } finally {
      setReleaseSubmitting(false);
    }
  };

  // Submit disposal
  const handleDisposalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemToDispose) return;
    setDisposalSubmitting(true);

    try {
      const res = await fetch(`/api/items/${itemToDispose.id}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "DISPOSED",
          disposalReason: disposalReason,
          notes: disposalNotes,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to record disposal");
        return;
      }

      setItemToDispose(null);
      setDisposalNotes("");
      fetchItems();
    } catch {
      alert("Network error occurred.");
    } finally {
      setDisposalSubmitting(false);
    }
  };

  // Quick stats calculation
  const storageCount = items.filter((i) => i.status === "IN_STORAGE").length;
  const matchedCount = items.filter((i) => i.status === "MATCHED").length;
  const returnedCount = items.filter((i) => i.status === "RETURNED").length;
  const disposedCount = items.filter((i) => i.status === "DISPOSED").length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "IN_STORAGE":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-mellow-secondary text-mellow-primary border border-mellow-border">
            In Storage
          </span>
        );
      case "MATCHED":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 animate-pulse">
            Matched (Pending Claim)
          </span>
        );
      case "RETURNED":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-stone-100 text-stone-700 border border-stone-200">
            Returned to Guest
          </span>
        );
      case "DISPOSED":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
            Disposed / Donated
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
          <h1 className="text-3xl font-serif font-normal text-mellow-black tracking-tight">Property Lost &amp; Found Ledger</h1>
          <p className="text-xs text-mellow-gray mt-1">
            Centralized property registry for discovered personal belongings and chain of custody.
          </p>
        </div>

        <button
          onClick={() => setShowLogModal(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-mellow-primary hover:bg-mellow-black text-white font-semibold text-xs uppercase tracking-wider shadow-xs transition duration-300"
        >
          <Plus className="w-4 h-4" /> Log Found Item
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-mellow-border shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-widest text-mellow-gray">In Storage</div>
            <div className="text-3xl font-serif text-mellow-primary font-normal mt-1">{storageCount}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-mellow-secondary text-mellow-primary border border-mellow-border flex items-center justify-center">
            <Boxes className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-mellow-border shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-widest text-mellow-gray">Matched Inquiries</div>
            <div className="text-3xl font-serif text-amber-700 font-normal mt-1">{matchedCount}</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Returned to Guests</div>
            <div className="text-2xl font-extrabold text-blue-600 mt-1">{returnedCount}</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Truck className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Disposed / Donated</div>
            <div className="text-2xl font-extrabold text-slate-600 mt-1">{disposedCount}</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
            <Trash2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, item #, room (e.g. 304), or storage bin..."
            className="w-full pl-9 pr-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex gap-2">
          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
          >
            <option value="ALL">All Statuses</option>
            {ITEM_STATUSES.map((st) => (
              <option key={st} value={st}>
                {st.replace("_", " ")}
              </option>
            ))}
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
          >
            <option value="ALL">All Categories</option>
            {ITEM_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat.replace("_", " ")}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Items Table / Cards */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center">
            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-2" />
            <p className="text-sm text-slate-500">Loading property ledger...</p>
          </div>
        ) : error ? (
          <div className="py-16 text-center text-red-600 flex flex-col items-center">
            <AlertCircle className="w-8 h-8 mb-2" />
            <p className="text-sm">{error}</p>
          </div>
        ) : items.length === 0 ? (
          <div className="py-20 text-center text-slate-500">
            <Boxes className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-800">No items match your criteria</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Try adjusting your search terms or filter selections, or log a newly discovered item above.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Item #</th>
                  <th className="py-3.5 px-4">Description</th>
                  <th className="py-3.5 px-4">Location Found</th>
                  <th className="py-3.5 px-4">Storage Location</th>
                  <th className="py-3.5 px-4">Date Found</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/75 transition group">
                    {/* Item Number */}
                    <td className="py-3.5 px-4 font-mono font-semibold text-xs text-slate-700">
                      {item.itemNumber}
                    </td>

                    {/* Title & Category */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{item.title}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 text-[10px] font-medium">
                          {item.category.replace("_", " ")}
                        </span>
                        {item.guestInquiry && (
                          <span className="text-[10px] text-amber-700 font-semibold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                            Linked: {item.guestInquiry.referenceCode} ({item.guestInquiry.guestName})
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Room */}
                    <td className="py-3.5 px-4 text-slate-700 font-medium">
                      {item.roomNumber}
                      {item.locationDetails && (
                        <div className="text-xs text-slate-400 truncate max-w-xs">
                          {item.locationDetails}
                        </div>
                      )}
                    </td>

                    {/* Storage Location */}
                    <td className="py-3.5 px-4 text-slate-600">
                      <span className="px-2 py-1 rounded bg-slate-100 font-mono text-xs border border-slate-200">
                        {item.storageLocation}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-xs text-slate-500">
                      {format(new Date(item.foundDate), "MMM d, yyyy")}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">{getStatusBadge(item.status)}</td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Details */}
                        <button
                          onClick={() => openItemDetails(item)}
                          className="px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition"
                        >
                          History
                        </button>

                        {/* Release to Guest (for In Storage or Matched) */}
                        {(item.status === "IN_STORAGE" || item.status === "MATCHED") && (
                          <button
                            onClick={() => {
                              setItemToRelease(item);
                              if (item.guestInquiry) {
                                setReleaseFormData((prev) => ({
                                  ...prev,
                                  claimedByGuestName: item.guestInquiry?.guestName || "",
                                }));
                              }
                            }}
                            className="px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-md transition flex items-center gap-1"
                          >
                            <Check className="w-3 h-3" /> Return
                          </button>
                        )}

                        {/* Dispose */}
                        {(item.status === "IN_STORAGE" || item.status === "MATCHED") && (
                          <button
                            onClick={() => setItemToDispose(item)}
                            title="Disposal / Donation after 30+ days"
                            className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL 1: Log Found Item */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Boxes className="w-5 h-5 text-emerald-600" /> Log Newly Discovered Item
              </h2>
              <button
                onClick={() => setShowLogModal(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateItem} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Item Title & Description *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sony WH-1000XM5 Black Headphones"
                  value={logFormData.title}
                  onChange={(e) => setLogFormData({ ...logFormData, title: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                {logErrors.title && (
                  <p className="text-xs text-red-600 mt-1">{logErrors.title[0]}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category *</label>
                  <select
                    value={logFormData.category}
                    onChange={(e) => setLogFormData({ ...logFormData, category: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                  >
                    {ITEM_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat.replace("_", " ")}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Room / Location Found *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Room 304, Lobby, Gym"
                    value={logFormData.roomNumber}
                    onChange={(e) => setLogFormData({ ...logFormData, roomNumber: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                  {logErrors.roomNumber && (
                    <p className="text-xs text-red-600 mt-1">{logErrors.roomNumber[0]}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Storage Bin / Shelf Location *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Closet 1 - Shelf B - Bin 4 or Safe Box 2"
                  value={logFormData.storageLocation}
                  onChange={(e) =>
                    setLogFormData({ ...logFormData, storageLocation: e.target.value })
                  }
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                />
                {logErrors.storageLocation && (
                  <p className="text-xs text-red-600 mt-1">{logErrors.storageLocation[0]}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Specific Location Notes (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Tucked under bed frame, near telephone cord"
                  value={logFormData.locationDetails}
                  onChange={(e) =>
                    setLogFormData({ ...logFormData, locationDetails: e.target.value })
                  }
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Date Discovered</label>
                  <input
                    type="date"
                    value={logFormData.foundDate}
                    onChange={(e) => setLogFormData({ ...logFormData, foundDate: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Photo URL (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={logFormData.imageUrl}
                    onChange={(e) => setLogFormData({ ...logFormData, imageUrl: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={logSubmitting}
                  className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition flex items-center gap-1.5 disabled:opacity-50"
                >
                  {logSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {logSubmitting ? "Logging..." : "Confirm & Store Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Release / Return to Guest */}
      {itemToRelease && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" /> Verify Guest Handover
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Item #{itemToRelease.itemNumber}: {itemToRelease.title}
                </p>
              </div>
              <button
                onClick={() => setItemToRelease(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {releaseError && (
              <div className="my-3 p-2.5 rounded-lg bg-red-50 text-xs text-red-700 border border-red-200">
                {releaseError}
              </div>
            )}

            <form onSubmit={handleReleaseSubmit} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Recipient Guest Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. David Chen"
                  value={releaseFormData.claimedByGuestName}
                  onChange={(e) =>
                    setReleaseFormData({ ...releaseFormData, claimedByGuestName: e.target.value })
                  }
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Handover Method *
                </label>
                <select
                  value={releaseFormData.returnMethod}
                  onChange={(e) =>
                    setReleaseFormData({
                      ...releaseFormData,
                      returnMethod: e.target.value as (typeof RETURN_METHODS)[number],
                    })
                  }
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                >
                  <option value="IN_PERSON">In-Person Collection at Front Desk</option>
                  <option value="COURIER">Dispatched via Courier / Shipping</option>
                </select>
              </div>

              {releaseFormData.returnMethod === "COURIER" && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Courier Name & Tracking Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. FedEx 78492019482 or DHL Express"
                    value={releaseFormData.courierTrackingNumber}
                    onChange={(e) =>
                      setReleaseFormData({
                        ...releaseFormData,
                        courierTrackingNumber: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Handover Notes / Verification ID
                </label>
                <input
                  type="text"
                  placeholder="e.g. Verified photo ID / passport"
                  value={releaseFormData.notes}
                  onChange={(e) =>
                    setReleaseFormData({ ...releaseFormData, notes: e.target.value })
                  }
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setItemToRelease(null)}
                  className="px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={releaseSubmitting}
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition flex items-center gap-1.5 disabled:opacity-50"
                >
                  {releaseSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {releaseSubmitting ? "Completing..." : "Complete Handover"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Mark Disposed */}
      {itemToDispose && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                <Trash2 className="w-5 h-5 text-slate-600" /> Item Disposal / Donation
              </h2>
              <button
                onClick={() => setItemToDispose(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 mt-2">
              For unclaimed items that have exceeded the hotel&apos;s retention period (30–60 days).
            </p>

            <form onSubmit={handleDisposalSubmit} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Disposal / Archival Method *
                </label>
                <select
                  value={disposalReason}
                  onChange={(e) => setDisposalReason(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                >
                  <option value="DONATED_TO_CHARITY">Donated to Local Charity Organization</option>
                  <option value="RECYCLED">Eco-Friendly Electronic Recycling</option>
                  <option value="DISCARDED_BROKEN">Damaged / Discarded</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Authorized Manager Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Donated in Goodwill batch #412"
                  value={disposalNotes}
                  onChange={(e) => setDisposalNotes(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setItemToDispose(null)}
                  className="px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={disposalSubmitting}
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition flex items-center gap-1.5 disabled:opacity-50"
                >
                  {disposalSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {disposalSubmitting ? "Archiving..." : "Confirm Archival"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DRAWER: Item Details & Audit History */}
      {selectedItemForDetails && (
        <div className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-xs flex justify-end">
          <div className="bg-white max-w-md w-full h-full shadow-2xl flex flex-col border-l border-slate-200">
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-slate-500">
                  {selectedItemForDetails.itemNumber}
                </span>
                <h3 className="font-bold text-slate-900 text-lg leading-tight mt-0.5">
                  {selectedItemForDetails.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedItemForDetails(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* Status & Storage */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium">Status</span>
                  {getStatusBadge(selectedItemForDetails.status)}
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium">Storage Location</span>
                  <span className="font-mono font-bold text-slate-800">
                    {selectedItemForDetails.storageLocation}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium">Room / Area</span>
                  <span className="font-semibold text-slate-800">
                    {selectedItemForDetails.roomNumber}
                  </span>
                </div>
                {selectedItemForDetails.locationDetails && (
                  <div className="text-xs text-slate-500 pt-1 border-t border-slate-200">
                    <span className="font-medium text-slate-600">Location Notes: </span>
                    {selectedItemForDetails.locationDetails}
                  </div>
                )}
              </div>

              {/* Handover Details if returned */}
              {selectedItemForDetails.status === "RETURNED" && (
                <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs space-y-1.5 text-blue-900">
                  <div className="font-bold flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-blue-600" /> Handover Completed
                  </div>
                  <div>
                    Claimed by:{" "}
                    <span className="font-semibold">
                      {selectedItemForDetails.claimedByGuestName}
                    </span>
                  </div>
                  <div>
                    Method:{" "}
                    <span className="font-semibold">{selectedItemForDetails.returnMethod}</span>
                  </div>
                  {selectedItemForDetails.courierTrackingNumber && (
                    <div>
                      Tracking:{" "}
                      <span className="font-mono font-semibold">
                        {selectedItemForDetails.courierTrackingNumber}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Linked Guest Inquiry */}
              {selectedItemForDetails.guestInquiry && (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs space-y-1 text-amber-900">
                  <div className="font-bold flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-amber-600" /> Linked with Guest Inquiry
                  </div>
                  <div>Reference: {selectedItemForDetails.guestInquiry.referenceCode}</div>
                  <div>Guest: {selectedItemForDetails.guestInquiry.guestName}</div>
                  <div>Email: {selectedItemForDetails.guestInquiry.guestEmail}</div>
                </div>
              )}

              {/* Chronological Audit Log History */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-3">
                  <History className="w-3.5 h-3.5 text-slate-400" /> Chain of Custody Audit Log
                </h4>

                {loadingLogs ? (
                  <div className="py-6 text-center text-xs text-slate-400">
                    <Loader2 className="w-4 h-4 animate-spin mx-auto mb-1" />
                    Loading audit trail...
                  </div>
                ) : itemAuditLogs.length === 0 ? (
                  <p className="text-xs text-slate-400">No logs recorded.</p>
                ) : (
                  <div className="space-y-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                    {itemAuditLogs.map((log) => (
                      <div key={log.id} className="relative pl-7 text-xs">
                        <div className="absolute left-2 top-1.5 w-2.5 h-2.5 rounded-full bg-emerald-600 ring-4 ring-white" />
                        <div className="font-semibold text-slate-800">{log.action}</div>
                        <p className="text-slate-600 text-[11px] mt-0.5">{log.details}</p>
                        <div className="text-[10px] text-slate-400 mt-1">
                          By {log.performedByName} •{" "}
                          {format(new Date(log.createdAt), "MMM d, yyyy h:mm a")}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
