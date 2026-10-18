import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users,
  Trophy,
  Flame,
  Send,
  Plus,
  UserPlus,
  ShieldCheck,
  CheckCircle2,
  Share2,
  Sparkles,
  ArrowRight,
  Heart,
  Crown
} from 'lucide-react';
import { INITIAL_SQUAD_DATA } from '../data/mockData';
import { SquadData } from '../types';

interface SquadAscendViewProps {
  currentUserSteps?: number;
  onShowInAppNotification?: (title: string, message: string) => void;
}

export const SquadAscendView: React.FC<SquadAscendViewProps> = ({
  currentUserSteps = 6420,
  onShowInAppNotification,
}) => {
  const [squad, setSquad] = useState<SquadData>(INITIAL_SQUAD_DATA as any);
  const [cheerInput, setCheerInput] = useState('');
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newSquadName, setNewSquadName] = useState('');
  const [newSquadMotto, setNewSquadMotto] = useState('');

  const handleSendCheer = (preset?: string) => {
    const text = preset || cheerInput.trim();
    if (!text) return;

    const newCheer = {
      sender: 'Arjun (You)',
      cheer: text,
      timestamp: 'Just now',
    };

    setSquad((prev) => ({
      ...prev,
      recentCheers: [newCheer, ...prev.recentCheers],
    }));

    setCheerInput('');

    if (onShowInAppNotification) {
      onShowInAppNotification('Cheer Sent! 🚀', `Your encouragement was posted to ${squad.name}.`);
    }
  };

  const handleJoinSquad = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode) return;
    setShowJoinModal(false);
    if (onShowInAppNotification) {
      onShowInAppNotification('Squad Joined!', `You successfully linked with squad ${joinCode}.`);
    }
  };

  const handleCreateSquad = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSquadName) return;

    setSquad({
      id: `squad_${Date.now()}`,
      name: newSquadName,
      code: `VYLO-${Math.floor(100 + Math.random() * 900)}`,
      motto: newSquadMotto || 'Push together. Ascend together.',
      collegeName: 'Stanford Engineering Quad',
      memberCount: 1,
      collectiveSteps: currentUserSteps,
      goalSteps: 100000,
      rank: 1,
      activeChallenge: '50,000 Step Freshman Kickoff',
      members: [
        { id: 'm1', name: 'Arjun (You)', stepsToday: currentUserSteps, streakDays: 14, rank: 'C', isCurrentUser: true },
      ],
      recentCheers: [
        { sender: 'Arjun (You)', cheer: 'Created the new squad! Let’s crush this challenge! 🔥', timestamp: 'Just now' },
      ],
    });

    setShowCreateModal(false);
    if (onShowInAppNotification) {
      onShowInAppNotification('Squad Created!', `Formed squad "${newSquadName}"! Invite your dorm mates.`);
    }
  };

  const progressPercent = Math.min(100, Math.round((squad.collectiveSteps / squad.goalSteps) * 100));

  return (
    <div className="space-y-6 pb-24">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-400 block">
            Collegiate Micro-Communities
          </span>
          <h1 className="text-2xl sm:text-3xl font-black font-brand text-white tracking-tight">
            Squad Ascend
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowJoinModal(true)}
            className="py-2 px-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold border border-white/10 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <UserPlus size={14} />
            <span>Join with Code</span>
          </button>
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="py-2 px-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_12px_#10B981] transition-all cursor-pointer"
          >
            <Plus size={14} />
            <span>Create Squad</span>
          </button>
        </div>
      </div>

      {/* Squad Main Hero Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#162119] via-[#111713] to-[#0a0d0c] border border-emerald-500/30 space-y-4 shadow-[0_15px_50px_rgba(0,0,0,0.6)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 text-xl font-black">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black font-brand text-white">{squad.name}</h3>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
                  Code: {squad.code}
                </span>
              </div>
              <p className="text-xs text-emerald-400 font-medium italic">“{squad.motto}”</p>
              <span className="text-[11px] text-gray-400">{squad.collegeName} • {squad.memberCount} Students Active</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-black/40 border border-white/5 text-center">
              <span className="text-[10px] text-gray-400 font-bold uppercase block">Campus Rank</span>
              <span className="text-xl font-black text-amber-400 font-brand">#{squad.rank}</span>
            </div>
            <div className="p-3 rounded-2xl bg-black/40 border border-white/5 text-center">
              <span className="text-[10px] text-gray-400 font-bold uppercase block">Integrity</span>
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 mt-1">
                <ShieldCheck size={14} />
                <span>Verified</span>
              </span>
            </div>
          </div>
        </div>

        {/* Collective Challenge Progress Bar */}
        <div className="p-4 rounded-2xl bg-[#0f1411] border border-emerald-500/20 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-white font-bold">
              <Trophy size={14} className="text-amber-400" />
              <span>Active Challenge: {squad.activeChallenge}</span>
            </div>
            <span className="text-emerald-400 font-mono font-bold">{progressPercent}% Achieved</span>
          </div>

          <div className="h-3 rounded-full bg-white/5 overflow-hidden p-0.5 border border-white/5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 shadow-[0_0_12px_#10B981]"
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-gray-400 font-mono">
            <span>{squad.collectiveSteps.toLocaleString()} collective steps</span>
            <span>Target: {squad.goalSteps.toLocaleString()} steps</span>
          </div>
        </div>

        {/* Individual Student Contribution */}
        <div className="p-3 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between text-xs">
          <span className="text-gray-300">
            Your Contribution: <strong className="text-white">{currentUserSteps.toLocaleString()} steps today</strong>
          </span>
          <span className="text-emerald-400 font-bold">
            {Math.round((currentUserSteps / squad.collectiveSteps) * 100)}% of squad output
          </span>
        </div>
      </div>

      {/* Grid: Squad Members vs Live Cheers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Squad Members Leaderboard */}
        <div className="p-5 rounded-3xl bg-[#141b16] border border-emerald-500/20 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Users size={16} className="text-emerald-400" />
              <span>Squad Roster & Output</span>
            </h4>
            <span className="text-xs text-gray-400 font-mono">Non-Punitive Fair Play</span>
          </div>

          <div className="space-y-2">
            {squad.members.map((m, idx) => (
              <div
                key={m.id}
                className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                  m.isCurrentUser
                    ? 'bg-emerald-500/10 border-emerald-500/40'
                    : 'bg-[#18211b] border-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 text-center font-brand font-black text-sm text-gray-400">
                    {idx === 0 ? <Crown size={18} className="text-amber-400 inline" /> : `#${idx + 1}`}
                  </span>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>{m.name}</span>
                      {m.isCurrentUser && (
                        <span className="px-1.5 py-0.2 rounded bg-emerald-500 text-black text-[9px] font-black uppercase">
                          YOU
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-gray-400 mt-0.5">
                      {m.streakDays} Day Streak • Hunter Rank {m.rank}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono text-xs font-black text-emerald-400">
                    {m.stepsToday.toLocaleString()}
                  </div>
                  <div className="text-[9px] text-gray-400 uppercase">Steps Today</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Positive Reinforcement & Cheers Feed (Prompt Section 12) */}
        <div className="p-5 rounded-3xl bg-[#141b16] border border-emerald-500/20 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Heart size={16} className="text-rose-400" />
                <span>Squad Cheers & Motivation</span>
              </h4>
              <span className="text-xs text-gray-400">Positive Reinforcement</span>
            </div>

            {/* Quick Cheer Presets */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {['Crushed my dorm workout! 🔥', 'Hit 6,000 campus steps! 👟', 'Keep grinding team! 🚀', 'Hydration checked! 💧'].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handleSendCheer(preset)}
                  className="px-2.5 py-1 rounded-xl bg-white/5 hover:bg-emerald-500/20 hover:border-emerald-500/40 text-[11px] text-gray-300 hover:text-white border border-white/5 transition-all cursor-pointer"
                >
                  {preset}
                </button>
              ))}
            </div>

            {/* Recent Cheers List */}
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {squad.recentCheers.map((c, i) => (
                <div key={i} className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <strong className="text-emerald-400">{c.sender}</strong>
                    <span className="text-gray-500">{c.timestamp}</span>
                  </div>
                  <p className="text-xs text-gray-200">{c.cheer}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Cheer Input Bar */}
          <div className="pt-3 border-t border-white/5 flex gap-2">
            <input
              type="text"
              value={cheerInput}
              onChange={(e) => setCheerInput(e.target.value)}
              placeholder="Drop a cheer for your squad..."
              onKeyDown={(e) => e.key === 'Enter' && handleSendCheer()}
              className="flex-1 bg-black/50 border border-emerald-900/40 rounded-2xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="button"
              onClick={() => handleSendCheer()}
              className="py-2.5 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase cursor-pointer transition-all shrink-0"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Join Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-sm bg-[#151c17] border border-emerald-500/30 rounded-3xl p-6 space-y-4">
            <h3 className="text-lg font-black font-brand text-white">Join Squad with Code</h3>
            <p className="text-xs text-gray-400">Enter the unique code shared by your classmates or dorm floor.</p>
            <input
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              placeholder="e.g. VYLO-CAMPUS-77"
              className="w-full bg-black/50 border border-emerald-500/40 rounded-xl p-3 text-sm text-center font-mono font-bold text-emerald-400 uppercase"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowJoinModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-white/5 text-gray-300 text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleJoinSquad}
                className="flex-1 py-2.5 rounded-xl bg-emerald-500 text-black font-black text-xs uppercase cursor-pointer"
              >
                Join Squad
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#151c17] border border-emerald-500/30 rounded-3xl p-6 space-y-4">
            <h3 className="text-lg font-black font-brand text-white">Create New Student Squad</h3>
            <p className="text-xs text-gray-400">
              Rally your department, dorm hallway, or intramural club to ascend together.
            </p>
            <div className="space-y-3">
              <input
                type="text"
                value={newSquadName}
                onChange={(e) => setNewSquadName(e.target.value)}
                placeholder="Squad Name (e.g. CS Sophomore Ascendants)"
                className="w-full bg-black/50 border border-emerald-500/40 rounded-xl p-3 text-xs text-white"
              />
              <input
                type="text"
                value={newSquadMotto}
                onChange={(e) => setNewSquadMotto(e.target.value)}
                placeholder="Squad Motto (e.g. Never skip leg day during midterms)"
                className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-xs text-white"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-white/5 text-gray-300 text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateSquad}
                className="flex-1 py-2.5 rounded-xl bg-emerald-500 text-black font-black text-xs uppercase cursor-pointer"
              >
                Launch Squad
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
