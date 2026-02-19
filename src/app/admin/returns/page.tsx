"use client";

import { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";
import { RefreshCcw, Loader2, FileVideo, FileImage, ExternalLink, Mail, Phone ,CheckCircle, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminReturnsPage() {
  const [returns, setReturns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  // Fetch Return Requests
  useEffect(() => {
    const fetchReturns = async () => {
      try {
        const query = `*[_type == "returnRequest"] | order(createdAt desc) {
          _id,
          orderNumber,
          productName,
          email,
          phone,
          reason,
          message,
          status,
          createdAt,
          "proofFileUrl": proofFile.asset->url,
          "proofFileMime": proofFile.asset->mimeType
        }`;
        
        const data = await client.fetch(query);
        setReturns(data);
      } catch (error) {
        console.error("Error fetching returns:", error);
        toast.error("Failed to load return requests.");
      } finally {
        setLoading(false);
      }
    };

    fetchReturns();
  }, []);

  // Handle Status Change
  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch("/api/returns/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update");

      showNotification("Status updated!", "success");
      
      // Update local state to reflect change immediately
      setReturns(returns.map(r => r._id === id ? { ...r, status: newStatus } : r));
    } catch (error) {
      showNotification("Error updating status", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved': return 'bg-blue-100 text-blue-700';
      case 'refunded': return 'bg-green-100 text-green-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-yellow-100 text-yellow-700'; // Pending
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="animate-spin text-gray-400 w-8 h-8" />
      </div>
    );
  }

  return (

    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <RefreshCcw className="w-6 h-6" /> Return Requests
          </h1>
          <p className="text-gray-500 text-sm mt-1">Manage customer returns and exchanges.</p>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white transition-all transform duration-300 z-50 flex items-center gap-2 ${notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
            {notification.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            <span className="font-medium text-sm">{notification.message}</span>
        </div>
      )}

      {returns.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <RefreshCcw className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No Return Requests</h3>
          <p className="text-gray-500">You're all caught up! No active return requests.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase tracking-wider text-xs font-semibold">
              <tr>
                <th className="px-6 py-4">Order / Product</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Reason & Message</th>
                <th className="px-6 py-4 text-center">Proof File</th>
                <th className="px-6 py-4 text-right">Status Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {returns.map((req) => (
                <tr key={req._id} className="hover:bg-gray-50 transition-colors">
                  
                  {/* Order Details */}
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900 mb-1">#{req.orderNumber}</div>
                    <div className="text-gray-500 max-w-[200px] truncate">{req.productName}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {new Date(req.createdAt).toLocaleDateString()}
                    </div>
                  </td>

                  {/* Customer Info */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-700 mb-1">
                      <Mail className="w-3 h-3 text-gray-400" /> {req.email}
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 text-xs">
                      <Phone className="w-3 h-3 text-gray-400" /> {req.phone}
                    </div>
                  </td>

                  {/* Reason & Message */}
                  <td className="px-6 py-4">
                    <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium mb-2">
                      {req.reason}
                    </span>
                    <div className="text-gray-500 text-xs whitespace-normal max-w-xs break-words">
                      {req.message || <span className="italic text-gray-400">No additional comments</span>}
                    </div>
                  </td>

                  {/* Proof File (Image/Video) */}
                  <td className="px-6 py-4 text-center">
                    {req.proofFileUrl ? (
                      <a 
                        href={req.proofFileUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex flex-col items-center justify-center gap-1 text-blue-600 hover:text-blue-800 transition-colors p-2 rounded hover:bg-blue-50"
                      >
                        {req.proofFileMime?.includes("video") ? (
                          <FileVideo className="w-6 h-6" />
                        ) : (
                          <FileImage className="w-6 h-6" />
                        )}
                        <span className="text-[10px] font-bold uppercase flex items-center gap-1">
                          View <ExternalLink className="w-3 h-3" />
                        </span>
                      </a>
                    ) : (
                      <span className="text-xs text-gray-400 italic">None Provided</span>
                    )}
                  </td>

                  {/* Status Dropdown */}
                  <td className="px-6 py-4 text-right relative">
                    {updatingId === req._id ? (
                      <div className="flex justify-end pr-4">
                        <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                      </div>
                    ) : (
                      <select
                        value={req.status || 'Pending'}
                        onChange={(e) => handleStatusChange(req._id, e.target.value)}
                        className={`text-xs font-bold uppercase tracking-wider pl-3 pr-8 py-2 rounded-full cursor-pointer appearance-none border-0 ring-1 ring-inset ring-gray-200 hover:ring-gray-300 transition-all ${getStatusColor(req.status)}`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Refunded">Refunded</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    )}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}