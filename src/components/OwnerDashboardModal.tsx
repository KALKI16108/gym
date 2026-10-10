import React, { useState } from 'react';
import { 
  X, 
  Building2, 
  Globe, 
  Mail, 
  Phone, 
  MessageSquare, 
  HelpCircle, 
  Check, 
  ExternalLink, 
  Trash2, 
  PlusCircle, 
  Clock, 
  Calendar,
  CheckCircle2,
  AlertCircle,
  Eye,
  Send
} from 'lucide-react';
import { Gym, Inquiry } from '../types/gym';
import { getAllInquiries, updateInquiryStatus, answerFAQ, deleteGym, registerGym } from '../services/gymStorage';

interface OwnerDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  gyms: Gym[];
  onOpenRegister: () => void;
  onViewGym: (gym: Gym) => void;
  onRefreshGyms: () => void;
}

export const OwnerDashboardModal: React.FC<OwnerDashboardModalProps> = ({
  isOpen,
  onClose,
  gyms,
  onOpenRegister,
  onViewGym,
  onRefreshGyms,
}) => {
  const [selectedGymId, setSelectedGymId] = useState<string>(gyms[0]?.id || '');
  const [activeTab, setActiveTab] = useState<'inquiries' | 'qanda' | 'settings'>('inquiries');

  // Answer question form state
  const [activeFaqId, setActiveFaqId] = useState<string | null>(null);
  const [answerDraft, setAnswerDraft] = useState('');

  // Editing website state
  const [editWebsite, setEditWebsite] = useState('');
  const [editMonthlyPrice, setEditMonthlyPrice] = useState<number>(0);
  const [editSaved, setEditSaved] = useState(false);

  if (!isOpen) return null;

  const currentGym = gyms.find(g => g.id === selectedGymId) || gyms[0];
  const allInquiries = getAllInquiries();
  const currentGymInquiries = allInquiries.filter(i => i.gymId === currentGym?.id);

  const handleUpdateInquiry = (inquiryId: string, status: Inquiry['status']) => {
    updateInquiryStatus(inquiryId, status);
    onRefreshGyms();
  };

  const handlePublishAnswer = (faqId: string) => {
    if (!currentGym || !answerDraft.trim()) return;
    answerFAQ(currentGym.id, faqId, answerDraft.trim());
    setActiveFaqId(null);
    setAnswerDraft('');
    onRefreshGyms();
  };

  const handleSaveWebsiteEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentGym) return;

    registerGym({
      ...currentGym,
      websiteUrl: editWebsite || currentGym.websiteUrl,
      monthlyPrice: editMonthlyPrice || currentGym.monthlyPrice,
    });

    setEditSaved(true);
    setTimeout(() => setEditSaved(false), 4000);
    onRefreshGyms();
  };

  const handleDeleteGym = (gymId: string) => {
    if (window.confirm('Are you sure you want to remove this gym from the directory?')) {
      deleteGym(gymId);
      onRefreshGyms();
      if (gyms.length > 1) {
        setSelectedGymId(gyms.find(g => g.id !== gymId)?.id || '');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#0d121f] border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-4">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md">
              <Building2 className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-['Syne']">
                Gym Owner Management Hub
              </h2>
              <p className="text-xs text-slate-400">
                Manage registered website links, lead inquiries, and Q&A responses
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenRegister();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold hover:bg-emerald-500/30 transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Register Another Gym</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Gym Selector Strip */}
        <div className="px-6 py-3 bg-slate-950/80 border-b border-slate-800/80 flex items-center justify-between overflow-x-auto gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 whitespace-nowrap">
              Active Gym:
            </span>
            <select
              value={selectedGymId}
              onChange={(e) => {
                setSelectedGymId(e.target.value);
                const chosen = gyms.find(g => g.id === e.target.value);
                if (chosen) {
                  setEditWebsite(chosen.websiteUrl);
                  setEditMonthlyPrice(chosen.monthlyPrice);
                }
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-white focus:outline-none focus:border-amber-400"
            >
              {gyms.map(g => (
                <option key={g.id} value={g.id}>
                  {g.name} ({g.city}, {g.state})
                </option>
              ))}
            </select>
          </div>

          {currentGym && (
            <div className="flex items-center gap-3 text-xs">
              <a
                href={currentGym.websiteUrl}
                target="_blank"
                rel="noreferrer"
                className="text-amber-400 hover:underline flex items-center gap-1 font-semibold"
              >
                <Globe className="w-3.5 h-3.5" />
                <span className="max-w-[200px] truncate">{currentGym.websiteUrl}</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <button
                onClick={() => onViewGym(currentGym)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700 flex items-center gap-1"
              >
                <Eye className="w-3 h-3" />
                <span>View Public Profile</span>
              </button>
            </div>
          )}
        </div>

        {/* Dashboard Sub-Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-900/40 px-6">
          <button
            type="button"
            onClick={() => setActiveTab('inquiries')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'inquiries'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Leads & Pass Requests ({currentGymInquiries.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('qanda')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'qanda'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Community Q&A ({currentGym?.faqs.length || 0})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'settings'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Website & Listing Settings</span>
          </button>
        </div>

        {/* Dashboard Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          
          {/* TAB 1: Inquiries */}
          {activeTab === 'inquiries' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Direct Leads for {currentGym?.name}</h3>
                  <p className="text-xs text-slate-400">
                    Seekers who requested a day pass, facility walkthrough, or membership information.
                  </p>
                </div>
              </div>

              {currentGymInquiries.length === 0 ? (
                <div className="p-10 rounded-2xl bg-slate-900/50 border border-slate-800 text-center space-y-2">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 mx-auto">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-white">No Inquiries Yet</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    When visitors on FlexFinder request a day pass or book a tour, their contact details and message will show up right here.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {currentGymInquiries.map(inq => (
                    <div
                      key={inq.id}
                      className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-white">{inq.seekerName}</span>
                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                              inq.status === 'new'
                                ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                                : inq.status === 'contacted'
                                ? 'bg-blue-400/20 text-blue-300 border border-blue-400/30'
                                : 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/30'
                            }`}>
                              {inq.status}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                              {inq.interestType.replace('_', ' ').toUpperCase()}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                            <span className="flex items-center gap-1">
                              <Mail className="w-3 h-3 text-slate-500" />
                              <a href={`mailto:${inq.seekerEmail}`} className="text-amber-400 hover:underline">
                                {inq.seekerEmail}
                              </a>
                            </span>
                            {inq.seekerPhone && (
                              <span className="flex items-center gap-1">
                                <Phone className="w-3 h-3 text-slate-500" />
                                {inq.seekerPhone}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Status switcher */}
                        <div className="flex items-center gap-1.5 self-start sm:self-auto">
                          <button
                            onClick={() => handleUpdateInquiry(inq.id, 'new')}
                            className={`px-2 py-1 rounded text-[11px] font-semibold ${
                              inq.status === 'new' ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400 hover:text-white'
                            }`}
                          >
                            New
                          </button>
                          <button
                            onClick={() => handleUpdateInquiry(inq.id, 'contacted')}
                            className={`px-2 py-1 rounded text-[11px] font-semibold ${
                              inq.status === 'contacted' ? 'bg-blue-500 text-white font-bold' : 'bg-slate-800 text-slate-400 hover:text-white'
                            }`}
                          >
                            Contacted
                          </button>
                          <button
                            onClick={() => handleUpdateInquiry(inq.id, 'resolved')}
                            className={`px-2 py-1 rounded text-[11px] font-semibold ${
                              inq.status === 'resolved' ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400 hover:text-white'
                            }`}
                          >
                            Resolved
                          </button>
                        </div>
                      </div>

                      {/* Message preview */}
                      <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300">
                        <p>{inq.message}</p>
                        {inq.preferredDate && (
                          <div className="flex items-center gap-1 text-[11px] text-amber-400 mt-1">
                            <Calendar className="w-3 h-3" />
                            <span>Requested Date: {inq.preferredDate}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Q&A */}
          {activeTab === 'qanda' && currentGym && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Direct Owner Q&A Management</h3>
                  <p className="text-xs text-slate-400">
                    Answer questions asked by prospective members. Your answers show up with the "Verified Owner" badge.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {currentGym.faqs.map(faq => (
                  <div key={faq.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="flex items-start justify-between">
                      <h4 className="text-xs font-bold text-white">
                        <span className="text-amber-400 mr-1.5">Q:</span>
                        {faq.question}
                      </h4>
                      <span className="text-[10px] text-slate-500">{faq.dateAdded}</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
                      <p>
                        <strong className="text-emerald-400">Owner Answer: </strong>
                        {faq.answer}
                      </p>
                    </div>

                    {activeFaqId === faq.id ? (
                      <div className="pt-2 space-y-2">
                        <textarea
                          rows={2}
                          value={answerDraft}
                          onChange={(e) => setAnswerDraft(e.target.value)}
                          placeholder="Type updated answer here..."
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handlePublishAnswer(faq.id)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs"
                          >
                            Save & Publish
                          </button>
                          <button
                            onClick={() => setActiveFaqId(null)}
                            className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-400 text-xs"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setActiveFaqId(faq.id);
                          setAnswerDraft(faq.answer);
                        }}
                        className="text-[11px] text-amber-400 hover:underline font-semibold"
                      >
                        Edit Answer
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Website & Listing Settings */}
          {activeTab === 'settings' && currentGym && (
            <div className="space-y-6">
              
              {editSaved && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Gym details and website link successfully updated!</span>
                </div>
              )}

              <form onSubmit={handleSaveWebsiteEdit} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-emerald-400" />
                  Registered Website & Pricing
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Official Gym Website URL
                    </label>
                    <input
                      type="text"
                      value={editWebsite || currentGym.websiteUrl}
                      onChange={(e) => setEditWebsite(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Monthly Membership Rate ($)
                    </label>
                    <input
                      type="number"
                      value={editMonthlyPrice || currentGym.monthlyPrice}
                      onChange={(e) => setEditMonthlyPrice(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
                >
                  Save Changes
                </button>
              </form>

              {/* Danger Zone */}
              <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-900/40 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Remove Gym Listing
                </h4>
                <p className="text-xs text-slate-400">
                  Deleting this gym removes it from the public directory and erases associated inquiries.
                </p>
                <button
                  onClick={() => handleDeleteGym(currentGym.id)}
                  className="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete {currentGym.name}</span>
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
