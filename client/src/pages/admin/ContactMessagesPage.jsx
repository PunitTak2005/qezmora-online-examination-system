import React, { useState, useEffect } from 'react';
import { 
  Mail, Search, Trash2, CheckCircle, MessageSquare, Clock, RefreshCcw, 
  ChevronLeft, ChevronRight, Eye, ArrowLeft, Archive, MailOpen, Send, 
  ChevronDown, CheckCircle2, User, CornerUpLeft
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import PageTransition from '../../components/PageTransition';
import StatCard from '../../components/StatCard';

const ContactMessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [stats, setStats] = useState({ total: 0, unread: 0, read: 0, replied: 0, archived: 0 });
  const [loading, setLoading] = useState(true);

  // Filters & Pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  // Selected message for Gmail-style email reading view
  const [selectedMessage, setSelectedMessage] = useState(null);

  const fetchMessagesAndStats = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit,
        status: statusFilter !== 'All' ? statusFilter : undefined,
        search: searchTerm || undefined
      };
      
      const [msgRes, statsRes] = await Promise.all([
        api.get('/contact', { params }),
        api.get('/contact/stats')
      ]);

      if (msgRes.data.success) {
        setMessages(msgRes.data.data);
        setTotalPages(msgRes.data.pages || 1);
      }

      if (statsRes.data.success) {
        setStats(statsRes.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch contact messages', err);
      toast.error('Failed to load contact messages.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessagesAndStats();
  }, [page, statusFilter, searchTerm]);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const res = await api.patch(`/contact/${id}`, { status: newStatus });
      if (res.data.success) {
        toast.success(`Message marked as ${newStatus}`);
        setMessages(prev => prev.map(m => m._id === id ? { ...m, status: newStatus } : m));
        if (selectedMessage && selectedMessage._id === id) {
          setSelectedMessage(prev => ({ ...prev, status: newStatus }));
        }
        // Refresh stats
        const statsRes = await api.get('/contact/stats');
        if (statsRes.data.success) setStats(statsRes.data.data);
      }
    } catch (err) {
      toast.error('Failed to update status.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    try {
      const res = await api.delete(`/contact/${id}`);
      if (res.data.success) {
        toast.success('Message deleted successfully.');
        setMessages(prev => prev.filter(m => m._id !== id));
        if (selectedMessage && selectedMessage._id === id) {
          setSelectedMessage(null);
        }
        // Refresh stats
        const statsRes = await api.get('/contact/stats');
        if (statsRes.data.success) setStats(statsRes.data.data);
      }
    } catch (err) {
      toast.error('Failed to delete message.');
    }
  };

  const getInitials = (name) => {
    if (!name) return 'Q';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'Unread':
        return {
          pill: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-700',
          dot: 'bg-amber-500'
        };
      case 'Read':
        return {
          pill: 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-300 dark:border-blue-700',
          dot: 'bg-blue-500'
        };
      case 'Replied':
        return {
          pill: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700',
          dot: 'bg-emerald-500'
        };
      case 'Archived':
      default:
        return {
          pill: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-300 dark:border-gray-700',
          dot: 'bg-gray-400'
        };
    }
  };

  return (
    <PageTransition>
      <div className="space-y-6 max-w-7xl mx-auto font-sans">
        
        {/* Detail View: Gmail-Style Reading Experience */}
        {selectedMessage ? (
          <div className="space-y-6 max-w-4xl mx-auto">
            
            {/* Sticky Gmail Top Toolbar */}
            <div className="sticky top-4 z-30 bg-white/90 dark:bg-[#162032]/90 backdrop-blur-md p-3 px-6 rounded-2xl border border-gray-200 dark:border-[#2A3441] shadow-lg flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-all hover:scale-105"
                  title="Back to Messages"
                >
                  <ArrowLeft className="w-5 h-5 text-primary dark:text-gold" />
                </button>
                <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1"></div>
                <button
                  onClick={() => handleUpdateStatus(selectedMessage._id, 'Archived')}
                  className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-all hover:text-amber-600"
                  title="Archive Message"
                >
                  <Archive className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedMessage._id, 'Read')}
                  className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-all hover:text-blue-600"
                  title="Mark as Read"
                >
                  <MailOpen className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedMessage._id, 'Replied')}
                  className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-all hover:text-emerald-600"
                  title="Mark as Replied"
                >
                  <CheckCircle className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(selectedMessage._id)}
                  className="p-2.5 rounded-full hover:bg-red-50 dark:hover:bg-red-950 text-red-600 dark:text-red-400 transition-all"
                  title="Delete Message"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              {/* Email Reply Header Action */}
              <a
                href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject)}`}
                className="btn bg-primary hover:bg-primary-dark text-white font-bold text-xs px-4 py-2 rounded-full gap-2 shadow-md flex items-center transition-all"
              >
                <Send className="w-3.5 h-3.5" /> Reply
              </a>
            </div>

            {/* Main Reading Pane Card */}
            <div className="bg-white dark:bg-[#162032] p-8 md:p-12 rounded-3xl border border-gray-100 dark:border-[#2A3441] shadow-xl space-y-8">
              
              {/* Subject Heading */}
              <div>
                <h1 className="text-3xl font-black text-gray-900 dark:text-[#F8FAFC] tracking-tight leading-snug">
                  {selectedMessage.subject}
                </h1>
              </div>

              {/* Compact Sender Info Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-[#2A3441] pb-6">
                <div className="flex items-center gap-4">
                  {/* Initials Avatar */}
                  <div className="w-12 h-12 rounded-full bg-primary text-white font-black text-base flex items-center justify-center shrink-0 border-2 border-primary/20 shadow-inner">
                    {getInitials(selectedMessage.name)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-bold text-lg text-gray-900 dark:text-white">{selectedMessage.name}</h2>
                      <span className="text-xs text-gray-400">&lt;{selectedMessage.email}&gt;</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {new Date(selectedMessage.createdAt).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })} • {new Date(selectedMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>

                {/* Interactive Status Dropdown Pill */}
                <div className="relative">
                  <select
                    value={selectedMessage.status}
                    onChange={(e) => handleUpdateStatus(selectedMessage._id, e.target.value)}
                    className={`appearance-none cursor-pointer pl-4 pr-10 py-2 rounded-full text-xs font-bold border transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                      getStatusBadgeStyle(selectedMessage.status).pill
                    }`}
                  >
                    <option value="Unread">🟡 Unread</option>
                    <option value="Read">🔵 Read</option>
                    <option value="Replied">🟢 Replied</option>
                    <option value="Archived">⚪ Archived</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
                </div>
              </div>

              {/* Message Payload Body (Clean Email View) */}
              <div className="prose dark:prose-invert max-w-none text-gray-800 dark:text-[#F8FAFC] text-base leading-relaxed whitespace-pre-wrap font-sans">
                {selectedMessage.message}
              </div>

              {/* Clean Bottom Reply CTA Section */}
              <div className="pt-8 border-t border-gray-100 dark:border-[#2A3441] flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="text-xs text-gray-400 font-medium">
                  Sent via Qezmora Public Contact Form
                </p>
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject)}`}
                  className="btn bg-primary hover:bg-primary-dark text-white font-bold py-3.5 px-8 rounded-full shadow-lg shadow-primary/20 gap-2 flex items-center transition-all w-full sm:w-auto justify-center"
                >
                  <Send className="w-4 h-4" /> Reply via Email
                </a>
              </div>

            </div>

          </div>
        ) : (
          /* List View */
          <>
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between md:items-end gap-4 bg-gradient-to-r from-primary/10 to-transparent p-6 rounded-3xl border border-primary/10">
              <div>
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Contact Messages</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1 font-medium">Manage user inquiries inside a Gmail-style reading environment.</p>
              </div>
              <button onClick={fetchMessagesAndStats} className="btn bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 gap-2 text-xs py-2.5 px-4">
                <RefreshCcw className="w-4 h-4" /> Refresh
              </button>
            </header>

            {/* Stats Row */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard title="Total Messages" value={stats.total} icon={Mail} colorClass="bg-primary/10 text-primary" />
              <StatCard title="Unread Inquiries" value={stats.unread} icon={Clock} colorClass="bg-amber-100 text-amber-600 dark:bg-amber-900/20" delay={0.1} />
              <StatCard title="Read Messages" value={stats.read} icon={Eye} colorClass="bg-blue-100 text-blue-600 dark:bg-blue-900/20" delay={0.2} />
              <StatCard title="Replied Messages" value={stats.replied} icon={CheckCircle2} colorClass="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20" delay={0.3} />
            </section>

            {/* Search and Filters */}
            <div className="bg-white dark:bg-[#162032] p-6 rounded-3xl border border-gray-100 dark:border-[#2A3441] shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
              <div className="relative w-full md:w-96">
                <input
                  type="text"
                  placeholder="Search by name, email, or subject..."
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-[#2A3441] focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-950 dark:text-white text-sm font-medium"
                />
                <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>

              <div className="flex flex-wrap gap-2 w-full md:w-auto">
                {['All', 'Unread', 'Read', 'Replied', 'Archived'].map(status => (
                  <button
                    key={status}
                    onClick={() => { setStatusFilter(status); setPage(1); }}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                      statusFilter === status 
                        ? 'bg-primary text-white shadow-md' 
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Messages Table / List View */}
            <div className="bg-white dark:bg-[#162032] rounded-3xl border border-gray-100 dark:border-[#2A3441] shadow-sm overflow-hidden">
              {loading ? (
                <div className="p-12 text-center text-gray-500 animate-pulse">Loading contact messages...</div>
              ) : messages.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 dark:border-[#2A3441] bg-gray-50/50 dark:bg-gray-800/50 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-bold">
                        <th className="p-5">Sender</th>
                        <th className="p-5">Subject</th>
                        <th className="p-5">Status</th>
                        <th className="p-5">Date</th>
                        <th className="p-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                      {messages.map((msg) => {
                        const badgeStyle = getStatusBadgeStyle(msg.status);
                        return (
                          <tr key={msg._id} className="hover:bg-cream/40 dark:hover:bg-gray-800/30 transition-colors group">
                            <td className="p-5">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                                  {getInitials(msg.name)}
                                </div>
                                <div>
                                  <div className="font-bold text-gray-900 dark:text-white">{msg.name}</div>
                                  <a href={`mailto:${msg.email}`} className="text-xs text-primary hover:underline">{msg.email}</a>
                                </div>
                              </div>
                            </td>
                            <td className="p-5 max-w-xs cursor-pointer" onClick={() => setSelectedMessage(msg)}>
                              <div className="font-bold text-gray-800 dark:text-gray-200 truncate group-hover:text-primary transition-colors">{msg.subject}</div>
                              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{msg.message}</p>
                            </td>
                            <td className="p-5">
                              <span className={`px-3 py-1 text-xs font-bold rounded-full border inline-flex items-center gap-1.5 ${badgeStyle.pill}`}>
                                <span className={`w-2 h-2 rounded-full ${badgeStyle.dot}`}></span>
                                {msg.status}
                              </span>
                            </td>
                            <td className="p-5 text-xs text-gray-500 dark:text-gray-400 font-medium">
                              {new Date(msg.createdAt).toLocaleDateString()} {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </td>
                            <td className="p-5 text-right space-x-2">
                              <button
                                onClick={() => {
                                  setSelectedMessage(msg);
                                  if (msg.status === 'Unread') handleUpdateStatus(msg._id, 'Read');
                                }}
                                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-primary hover:text-white transition-colors"
                                title="Read Email Message"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              
                              <button
                                onClick={() => handleDelete(msg._id)}
                                className="p-2 rounded-lg bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 hover:bg-red-600 hover:text-white transition-colors"
                                title="Delete Message"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-16 text-center text-gray-500">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">No contact messages found</h3>
                  <p className="text-sm text-gray-500">Submissions from the Contact page will appear here automatically.</p>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="p-4 border-t border-gray-100 dark:border-[#2A3441] flex justify-between items-center">
                  <span className="text-xs text-gray-500 font-bold">Page {page} of {totalPages}</span>
                  <div className="flex gap-2">
                    <button
                      disabled={page === 1}
                      onClick={() => setPage(p => p - 1)}
                      className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-50"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      disabled={page === totalPages}
                      onClick={() => setPage(p => p + 1)}
                      className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-50"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

      </div>
    </PageTransition>
  );
};

export default ContactMessagesPage;
