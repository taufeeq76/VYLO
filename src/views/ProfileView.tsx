import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User,
  School,
  Mail,
  Award,
  Flame,
  CalendarCheck,
  ShieldCheck,
  Settings,
  LogOut,
  Sparkles,
  Edit3,
  Clock,
  Dumbbell,
  Target,
  Trophy,
  CheckCircle2,
  Lock,
  ChevronRight
} from 'lucide-react';
import { CollegeStudentProfile } from '../types';

interface ProfileViewProps {
  studentProfile: CollegeStudentProfile;
  fitScore?: number;
  streakDays?: number;
  onEditProfile: () => void;
  onLogout: () => void;
  onResetDemo: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  studentProfile,
  fitScore = 78,
  streakDays = 14,
  onEditProfile,
  onLogout,
  onResetDemo,
}) => {
  const achievements = [
    { id: 'a1', title: 'First Workout Complete', desc: 'Logged initial dorm movement session', icon: '🎯', unlocked: true, date: 'Day 1' },
    { id: 'a2', title: '7-Day Ascend Streak', desc: 'Consistent activity across 7 straight days', icon: '🔥', unlocked: true, date: 'Day 7' },
    { id: 'a3', title: '14-Day Consistency Master', desc: 'Protected streak through exam week', icon: '⚡', unlocked: true, date: 'Today' },
    { id: 'a4', title: '10 Workouts Complete', desc: 'Hit 10 structured movement sessions', icon: '💪', unlocked: true, date: 'Day 11' },
    { id: 'a5', title: '100,000 Campus Steps', desc: 'Commuted across academic buildings', icon: '👟', unlocked: true, date: 'Yesterday' },
    { id: 'a6', title: 'Squad Challenge Winner', desc: 'Led engineering squad to podium finish', icon: '🏆', unlocked: false, date: 'Locked' },
    { id: 'a7', title: '30-Day Legend Streak', desc: 'Sustained fitness for an entire month', icon: '👑', unlocked: false, date: 'Locked' },
  ];

  return (
    <div className="space-y-6 pb-24 max-w-4xl mx-auto">
      {/* Profile Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#162119] via-[#111713] to-[#0a0d0c] border border-emerald-500/30 space-y-6 shadow-[0_15px_50px_rgba(0,0,0,0.6)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                <div className="w-full h-full rounded-2xl bg-[#0e1410] flex items-center justify-center text-emerald-400 font-brand font-black text-2xl">
                  {studentProfile.name.charAt(0) || 'A'}
                </div>
              </div>
              <div className="absolute -bottom-1.5 -right-1.5 px-1.5 py-0.5 rounded-md bg-emerald-500 text-black text-[9px] font-black uppercase">
                {studentProfile.fitnessLevel}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black font-brand text-white">{studentProfile.name}</h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                  Active Student
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                <School size={13} className="text-emerald-400" />
                <span>{studentProfile.collegeName}</span>
              </div>
              <div className="text-[11px] text-gray-500 font-mono mt-0.5">
                {studentProfile.collegeEmail}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onEditProfile}
              className="py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-gray-200 text-xs font-bold border border-white/10 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Edit3 size={14} />
              <span>Edit Calibration</span>
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="py-2.5 px-4 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-bold border border-rose-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <LogOut size={14} />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* High-level Student Fitness Vitals */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-2xl bg-black/40 border border-white/5 text-center">
            <span className="text-[10px] text-gray-400 font-bold uppercase block">Current Fit Score</span>
            <span className="text-2xl font-black text-emerald-400 font-brand">{fitScore}</span>
            <span className="text-[10px] text-gray-500 block">Top 15% on campus</span>
          </div>

          <div className="p-3 rounded-2xl bg-black/40 border border-white/5 text-center">
            <span className="text-[10px] text-gray-400 font-bold uppercase block">Active Streak</span>
            <span className="text-2xl font-black text-amber-400 font-brand">{streakDays} Days</span>
            <span className="text-[10px] text-gray-500 block">Personal Best</span>
          </div>

          <div className="p-3 rounded-2xl bg-black/40 border border-white/5 text-center">
            <span className="text-[10px] text-gray-400 font-bold uppercase block">Daily Time Budget</span>
            <span className="text-2xl font-black text-teal-300 font-brand">{studentProfile.dailyAvailableMinutes}m</span>
            <span className="text-[10px] text-gray-500 block">Adaptive schedule</span>
          </div>

          <div className="p-3 rounded-2xl bg-black/40 border border-white/5 text-center">
            <span className="text-[10px] text-gray-400 font-bold uppercase block">Primary Goal</span>
            <span className="text-sm font-black text-white font-brand mt-1 truncate block px-1">
              {studentProfile.fitnessGoal}
            </span>
            <span className="text-[10px] text-emerald-400 block">Calibrated</span>
          </div>
        </div>
      </div>

      {/* Gamification Badges & Achievements (Prompt Section 15) */}
      <div className="p-6 rounded-3xl bg-[#141b16] border border-emerald-500/20 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy size={18} className="text-amber-400" />
            <h3 className="text-base font-bold text-white uppercase tracking-wider">
              Badges & Milestones
            </h3>
          </div>
          <span className="text-xs text-emerald-400 font-mono font-bold">
            5 of 7 Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-3.5 rounded-2xl border flex items-start gap-3 transition-all ${
                ach.unlocked
                  ? 'bg-[#18231c] border-emerald-500/40 text-white'
                  : 'bg-black/30 border-white/5 opacity-50 text-gray-500'
              }`}
            >
              <div className="text-2xl p-2 rounded-xl bg-black/40 shrink-0">
                {ach.icon}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-black">{ach.title}</h4>
                  {ach.unlocked && <CheckCircle2 size={12} className="text-emerald-400" />}
                </div>
                <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">{ach.desc}</p>
                <span className="text-[9px] font-mono text-emerald-400 mt-1 block">
                  {ach.unlocked ? `Unlocked: ${ach.date}` : 'In progress'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Student Body & Preference Details */}
      <div className="p-6 rounded-3xl bg-[#141b16] border border-emerald-500/20 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Target size={16} className="text-emerald-400" />
          <span>Biometric & Collegiate Configuration</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-black/30 border border-white/5">
            <span className="text-[10px] text-gray-400 uppercase font-bold block">Height & Weight</span>
            <span className="text-sm font-bold text-white mt-0.5 block">
              {studentProfile.heightCm} cm • {studentProfile.weightKg} kg
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-black/30 border border-white/5">
            <span className="text-[10px] text-gray-400 uppercase font-bold block">Preferred Style</span>
            <span className="text-sm font-bold text-emerald-400 mt-0.5 block truncate">
              {studentProfile.preferredWorkoutType}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-black/30 border border-white/5">
            <span className="text-[10px] text-gray-400 uppercase font-bold block">Routine Style</span>
            <span className="text-sm font-bold text-white mt-0.5 block">
              {studentProfile.typicalActivityLevel}
            </span>
          </div>
        </div>
      </div>

      {/* Presentation Demo Mode Reset */}
      <div className="p-4 rounded-2xl bg-black/30 border border-white/5 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-white block">Presentation Demo Controller</span>
          <span className="text-[11px] text-gray-400">Reset state to Arjun (Fit Score 78, Stanford, 6,420 steps)</span>
        </div>
        <button
          type="button"
          onClick={onResetDemo}
          className="py-2 px-3.5 rounded-xl bg-white/10 hover:bg-emerald-500 hover:text-black text-gray-300 text-xs font-bold transition-all cursor-pointer"
        >
          Reset Demo State
        </button>
      </div>
    </div>
  );
};
