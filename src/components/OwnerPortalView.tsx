import React, { useState } from 'react';
import { 
  Building2, 
  Globe, 
  PlusCircle, 
  CheckCircle2, 
  HelpCircle, 
  MessageSquare, 
  Users, 
  ArrowRight, 
  ShieldCheck, 
  TrendingUp, 
  Eye, 
  Trash2,
  Phone,
  Mail,
  ExternalLink
} from 'lucide-react';
import { Gym, Inquiry } from '../types/gym';
import { getAllInquiries, updateInquiryStatus, answerFAQ, deleteGym } from '../services/gymStorage';

interface OwnerPortalViewProps {
  gyms: Gym[];
  onOpenRegister: () => void;
  onSelectGym: (gym: Gym) => void;
  onRefreshGyms: () => void;
  onBackToDirectory: () => void;
}

export const OwnerPortalView: React.FC<OwnerPortalViewProps> = ({
  gyms,
  onOpenRegister,
  onSelectGym,
  onRefreshGyms,
  onBackToDirectory,
}) => {
  const allInquiries = getAllInquiries();
  const [selectedGymId, setSelectedGymId] = useState<string>(gyms[0]?.id || '');
  const [activeTab, setActiveTab] = useState<'gyms' | 'inquiries' | 'qanda'>('gyms');

  // FAQ answer editing state
  const [answeringFaqId, setAnsweringFaqId] = useState<string | null>(null);
  const [faqAnswerText, setFaqAnswerText] = useState('');

  const currentGym = gyms.find(g => g.id === selectedGymId) || gyms[0];
  const gymInquiries = allInquiries.filter(i => i.gymId === currentGym?.id);

  const handleUpdateInquiry = (id: string, status: Inquiry['status']) => {
    updateInquiryStatus(id, status);
    onRefreshGyms();
  };

  const handleSaveFaqAnswer = (faqId: string) => {
    if (!currentGym || !faqAnswerText.trim()) return;
    answerFAQ(currentGym.id, faqId, faqAnswerText.trim());
    setAnsweringFaqId(null);
    setFaqAnswerText('');
    onRefreshGyms();
  };

  const handleDeleteGym = (gymId: string) => {
    if (window.confirm('Are you sure you want to delete this gym and its website listing?')) {
      deleteGym(gymId);
      onRefreshGyms();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-[#111827] via-[#1e1b4b] to-[#111827] border border-slate-700/80 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/10 border border-emerald-400/30 text-emerald-400 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Gym Owner & Operator Portal</span>
            </div>
            <h1 className="text-3xl font-black text-white font-['Syne'] tracking-tight">
              Manage Your Gyms & Connect with Local Lifters
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Register your gym's official website URL, manage equipment listings, respond to prospective members' questions, and track direct trial pass leads.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenRegister}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 font-extrabold text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20 hover:brightness-110 transition-all cursor-pointer"
            >
              <PlusCircle className="w-5 h-5 text-slate-950" />
              <span>Register New Gym Website</span>
            </button>

            <button
              onClick={onBackToDirectory}
              className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold border border-slate-700 transition-colors"
            >
              Browse Public Directory →
            </button>
          </div>
        </div>
      </div>

      {/* Stats Quick Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-400/10 text-amber-400 border border-amber-400/20 flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Registered Facilities</span>
            <h3 className="text-2xl font-black text-white">{gyms.length}</h3>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 flex items-center justify-center">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Inbound Leads & Passes</span>
            <h3 className="text-2xl font-black text-white">{allInquiries.length}</h3>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-400/10 text-cyan-400 border border-cyan-400/20 flex items-center justify-center">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Total Q&A Questions</span>
            <h3 className="text-2xl font-black text-white">
              {gyms.reduce((sum, g) => sum + g.faqs.length, 0)}
            </h3>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-slate-800 gap-4">
        <button
          onClick={() => setActiveTab('gyms')}
          className={`pb-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'gyms'
              ? 'border-emerald-400 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>My Listed Gyms ({gyms.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('inquiries')}
          className={`pb-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'inquiries'
              ? 'border-emerald-400 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Inbound Leads ({allInquiries.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('qanda')}
          className={`pb-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'qanda'
              ? 'border-emerald-400 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Direct Q&A Management</span>
        </button>
      </div>

      {/* TAB 1: Listed Gyms */}
      {activeTab === 'gyms' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {gyms.map(gym => (
              <div
                key={gym.id}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-colors"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={gym.coverImage}
                        alt={gym.name}
                        className="w-14 h-14 rounded-xl object-cover"
                      />
                      <div>
                        <h3 className="font-bold text-base text-white">{gym.name}</h3>
                        <p className="text-xs text-slate-400">{gym.city}, {gym.state}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-lg">
                      ${gym.monthlyPrice}/mo
                    </span>
                  </div>

                  {/* Registered website link */}
                  <div className="mt-3 p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400 flex items-center gap-1.5 truncate">
                      <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <a href={gym.websiteUrl} target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline truncate">
                        {gym.websiteUrl}
                      </a>
                    </span>
                    <a href={gym.websiteUrl} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white shrink-0 ml-2">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectGym(gym)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 font-semibold flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Profile</span>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedGymId(gym.id);
                        setActiveTab('inquiries');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-amber-400/10 text-amber-300 hover:bg-amber-400/20 font-semibold"
                    >
                      Leads ({allInquiries.filter(i => i.gymId === gym.id).length})
                    </button>
                  </div>

                  <button
                    onClick={() => handleDeleteGym(gym.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                    title="Delete gym listing"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Inquiries */}
      {activeTab === 'inquiries' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">All Fitness Seeker Inquiries</h3>
            <span className="text-xs text-slate-400">{allInquiries.length} total messages received</span>
          </div>

          {allInquiries.length === 0 ? (
            <div className="p-12 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-3">
              <MessageSquare className="w-8 h-8 text-slate-500 mx-auto" />
              <h4 className="text-base font-bold text-white">No inquiries yet</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Prospective members can request day passes or tours on any gym profile. Their contacts will populate here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {allInquiries.map(inq => (
                <div key={inq.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">{inq.seekerName}</span>
                        <span className="text-xs text-amber-400 font-semibold">for {inq.gymName}</span>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                          {inq.interestType.replace('_', ' ')}
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

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleUpdateInquiry(inq.id, 'new')}
                        className={`px-2 py-1 rounded text-xs font-semibold ${inq.status === 'new' ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'}`}
                      >
                        New
                      </button>
                      <button
                        onClick={() => handleUpdateInquiry(inq.id, 'contacted')}
                        className={`px-2 py-1 rounded text-xs font-semibold ${inq.status === 'contacted' ? 'bg-blue-500 text-white font-bold' : 'bg-slate-800 text-slate-400'}`}
                      >
                        Contacted
                      </button>
                      <button
                        onClick={() => handleUpdateInquiry(inq.id, 'resolved')}
                        className={`px-2 py-1 rounded text-xs font-semibold ${inq.status === 'resolved' ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'}`}
                      >
                        Resolved
                      </button>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
                    <p>{inq.message}</p>
                    {inq.preferredDate && (
                      <p className="text-[11px] text-amber-400 mt-1 font-semibold">
                        Requested Date: {inq.preferredDate}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Q&A */}
      {activeTab === 'qanda' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Direct Questions & Answers</h3>
            <span className="text-xs text-slate-400">Answered questions publish to your public profile</span>
          </div>

          <div className="space-y-3">
            {gyms.flatMap(g => g.faqs.map(faq => ({ ...faq, gymName: g.name, gymId: g.id }))).map(faq => (
              <div key={faq.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
                      {faq.gymName}
                    </span>
                    <h4 className="text-xs font-bold text-white mt-0.5">
                      <span className="text-amber-400 mr-1.5">Q:</span>
                      {faq.question}
                    </h4>
                  </div>
                  <span className="text-[10px] text-slate-500">{faq.dateAdded}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
                  <p>
                    <strong className="text-emerald-400">Current Answer: </strong>
                    {faq.answer}
                  </p>
                </div>

                {answeringFaqId === faq.id ? (
                  <div className="space-y-2 pt-2">
                    <textarea
                      rows={2}
                      value={faqAnswerText}
                      onChange={(e) => setFaqAnswerText(e.target.value)}
                      placeholder="Type your official owner response..."
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSaveFaqAnswer(faq.id)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs"
                      >
                        Publish Verified Answer
                      </button>
                      <button
                        onClick={() => setAnsweringFaqId(null)}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-400 text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setAnsweringFaqId(faq.id);
                      setFaqAnswerText(faq.answer);
                    }}
                    className="text-xs text-amber-400 font-semibold hover:underline"
                  >
                    Edit / Update Response
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
