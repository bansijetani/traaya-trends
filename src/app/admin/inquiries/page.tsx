"use client";

import { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";
import { Loader2, Mail, Trash2, Reply, Inbox, CheckCircle, Clock, Send, X, CornerDownRight } from "lucide-react";
import toast from "react-hot-toast";

interface Inquiry {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  _createdAt: string;
  // 👇 New fields
  replyMessage?: string;
  repliedAt?: string;
}

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [selectedInquiryId, setSelectedInquiryId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Reply State
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);

  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [inquiryToDelete, setInquiryToDelete] = useState<string | null>(null);

  const selectedInquiry = inquiries.find((i) => i._id === selectedInquiryId);

  // 1. Fetch Inquiries
  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const data = await client.fetch(
          `*[_type == "contact"] | order(_createdAt desc)`
        );
        setInquiries(data);
        if (data.length > 0) setSelectedInquiryId(data[0]._id);
      } catch (error) {
        console.error("Failed to fetch inquiries:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInquiries();
  }, []);

  // 2. Handle Message Selection
  const handleSelectMessage = async (inquiry: Inquiry) => {
    setSelectedInquiryId(inquiry._id);
    setIsReplying(false); 
    setReplyText(""); 

    if (inquiry.status === 'new') {
        setInquiries((prev) => 
            prev.map((i) => i._id === inquiry._id ? { ...i, status: 'read' } : i)
        );
        try {
            await fetch(`/api/inquiries/${inquiry._id}`, {
                method: "PATCH",
                body: JSON.stringify({ status: 'read' })
            });
        } catch (error) { console.error(error); }
    }
  };

  // 3. Send Reply Logic
  const handleSendReply = async () => {
    if (!selectedInquiry || !replyText.trim()) return;
    
    setSendingReply(true);

    try {
        const res = await fetch(`/api/inquiries/${selectedInquiry._id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: selectedInquiry.email,
                subject: selectedInquiry.subject,
                replyMessage: replyText
            })
        });

        if (res.ok) {
            toast.success("Reply Sent!");
            setIsReplying(false);
            
            // Update local state with the new reply
            setInquiries(prev => prev.map(i => 
                i._id === selectedInquiry._id ? { 
                    ...i, 
                    status: 'replied',
                    replyMessage: replyText,
                    repliedAt: new Date().toISOString()
                } : i
            ));
            
            setReplyText("");
        } else {
            throw new Error("Failed to send");
        }
    } catch (error) {
        toast.error("Failed to send reply. Check console.");
        console.error(error);
    } finally {
        setSendingReply(false);
    }
  };

  // 4. Delete Logic
  const openDeleteModal = (id: string) => {
    setInquiryToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!inquiryToDelete) return;
    const id = inquiryToDelete;
    
    if (selectedInquiryId === id) setSelectedInquiryId(null);
    setInquiries((prev) => prev.filter((item) => item._id !== id));
    toast.success("Message deleted");
    setIsDeleteModalOpen(false);

    try {
      await fetch(`/api/inquiries/${id}`, { method: "DELETE" });
    } catch (error) { toast.error("Failed to delete"); }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)] text-gray-500">
        <Loader2 size={32} className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-50 font-sans">
      
      {/* ================= LEFT: INBOX LIST ================= */}
      <div className="w-full md:w-[350px] lg:w-[400px] border-r border-gray-200 bg-white flex flex-col">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
            <h2 className="font-bold text-lg text-[#1A1A1A] flex items-center gap-2">
                <Inbox size={20} /> Inbox
            </h2>
            <span className="text-xs font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                {inquiries.length}
            </span>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
            {inquiries.length === 0 ? (
                <div className="p-8 text-center text-gray-400 text-sm">No messages found.</div>
            ) : (
                inquiries.map((inquiry) => (
                    <div 
                        key={inquiry._id}
                        onClick={() => handleSelectMessage(inquiry)}
                        className={`p-4 border-b border-gray-50 cursor-pointer transition-colors hover:bg-gray-50 ${
                            selectedInquiryId === inquiry._id ? 'bg-blue-50/50 border-l-4 border-l-[#B87E58]' : 'border-l-4 border-l-transparent'
                        }`}
                    >
                        <div className="flex justify-between items-start mb-1">
                            <h4 className={`text-sm truncate pr-2 ${inquiry.status === 'new' ? 'font-bold text-black' : 'font-medium text-gray-700'}`}>
                                {inquiry.name}
                            </h4>
                            <span className="text-[10px] text-gray-400 whitespace-nowrap">
                                {new Date(inquiry._createdAt).toLocaleDateString()}
                            </span>
                        </div>
                        <p className={`text-xs mb-1 truncate ${inquiry.status === 'new' ? 'font-bold text-[#1A1A1A]' : 'text-gray-600'}`}>
                            {inquiry.status === 'new' && <span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-2"></span>}
                             {inquiry.status === 'replied' && <span className="inline-block mr-1 text-green-600">↩️</span>}
                            {inquiry.subject}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                            {inquiry.replyMessage ? `You: ${inquiry.replyMessage}` : inquiry.message}
                        </p>
                    </div>
                ))
            )}
        </div>
      </div>

      {/* ================= RIGHT: CONTENT & REPLY ================= */}
      <div className="flex-1 bg-white flex flex-col h-full overflow-hidden relative">
        {selectedInquiry ? (
            <>
                {/* Toolbar */}
                <div className="h-16 border-b border-gray-100 flex items-center justify-between px-6 bg-white shrink-0">
                    <div className="flex gap-2">
                         {/* Hide Reply button if already replied (Optional: remove !selectedInquiry.replyMessage if you want to allow multi-reply) */}
                         {!selectedInquiry.replyMessage && (
                            <button 
                                onClick={() => setIsReplying(!isReplying)}
                                className={`cursor-pointer flex items-center gap-2 px-3 py-1.5 text-xs font-bold uppercase tracking-wider border rounded transition-colors ${
                                    isReplying ? 'bg-black text-white border-black' : 'border-gray-200 hover:bg-black hover:text-white'
                                }`}
                            >
                                {isReplying ? <X size={14} /> : <Reply size={14} />} 
                                {isReplying ? "Cancel" : "Reply"}
                            </button>
                         )}
                        
                        <button 
                             onClick={() => openDeleteModal(selectedInquiry._id)}
                             className="cursor-pointer flex items-center gap-2 px-3 py-1.5 text-xs font-bold uppercase tracking-wider border border-gray-200 rounded text-red-600 hover:bg-red-50 hover:border-red-100 transition-colors"
                        >
                            <Trash2 size={14} /> Delete
                        </button>
                    </div>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock size={12} /> {new Date(selectedInquiry._createdAt).toLocaleString()}
                    </span>
                </div>

                {/* Scrollable Message Content */}
                <div className="flex-1 overflow-y-auto p-8 pb-32">
                    <h1 className="text-2xl font-serif text-[#1A1A1A] mb-6">{selectedInquiry.subject}</h1>
                    
                    {/* Customer Message */}
                    <div className="flex gap-4 mb-8">
                        <div className="w-10 h-10 rounded-full bg-[#B87E58] text-white flex items-center justify-center font-bold text-lg shrink-0">
                            {selectedInquiry.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-baseline gap-2 mb-1">
                                <p className="text-sm font-bold text-[#1A1A1A]">{selectedInquiry.name}</p>
                                <p className="text-xs text-gray-500">&lt;{selectedInquiry.email}&gt;</p>
                            </div>
                             <div className="prose max-w-none text-gray-600 leading-relaxed whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded-lg rounded-tl-none">
                                {selectedInquiry.message}
                            </div>
                        </div>
                    </div>

                    {/* 👇 DISPLAY PAST REPLY IF EXISTS */}
                    {selectedInquiry.replyMessage && (
                        <div className="flex gap-4 mb-8 ml-10">
                            <div className="flex-1 flex flex-col items-end">
                                <div className="flex items-baseline gap-2 mb-1">
                                    <p className="text-xs text-gray-400">
                                        Replied on {selectedInquiry.repliedAt && new Date(selectedInquiry.repliedAt).toLocaleDateString()}
                                    </p>
                                    <p className="text-sm font-bold text-[#1A1A1A]">You</p>
                                </div>
                                <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap text-sm bg-blue-50/50 border border-blue-100 p-4 rounded-lg rounded-tr-none w-full relative">
                                    <CornerDownRight size={16} className="absolute -left-6 top-4 text-gray-300" />
                                    {selectedInquiry.replyMessage}
                                </div>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center font-bold text-xs shrink-0">
                                YOU
                            </div>
                        </div>
                    )}

                    {/* REPLY BOX */}
                    {isReplying && !selectedInquiry.replyMessage && (
                        <div className="mt-10 border border-gray-300 rounded-lg shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 text-xs text-gray-500 flex justify-between">
                                <span>Replying to <strong>{selectedInquiry.email}</strong></span>
                            </div>
                            <textarea 
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                className="w-full p-4 h-40 outline-none text-sm text-gray-700 resize-none bg-white rounded-b-lg"
                                placeholder="Write your reply here..."
                                autoFocus
                            />
                            <div className="p-3 bg-white border-t border-gray-100 flex justify-end gap-3 rounded-b-lg">
                                <button 
                                    onClick={() => setIsReplying(false)}
                                    className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-black transition-colors"
                                >
                                    Discard
                                </button>
                                <button 
                                    onClick={handleSendReply}
                                    disabled={sendingReply || !replyText.trim()}
                                    className="cursor-pointer px-6 py-2 bg-[#1A1A1A] text-white text-xs font-bold uppercase tracking-wider rounded hover:bg-[#B87E58] transition-colors disabled:opacity-50 flex items-center gap-2"
                                >
                                    {sendingReply ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                                    Send Reply
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </>
        ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-300">
                <Mail size={48} className="mb-4 opacity-20" />
                <p>Select a message to read</p>
            </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm mx-4">
                <div className="text-center mb-6">
                    <h3 className="text-lg font-bold text-[#1A1A1A]">Delete Message?</h3>
                    <p className="text-xs text-gray-500 mt-1">This cannot be undone.</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => setIsDeleteModalOpen(false)} className="cursor-pointer flex-1 py-2.5 border rounded-md text-xs font-bold text-gray-600">Cancel</button>
                    <button onClick={confirmDelete} className="cursor-pointer flex-1 py-2.5 bg-red-600 text-white rounded-md text-xs font-bold">Delete</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}