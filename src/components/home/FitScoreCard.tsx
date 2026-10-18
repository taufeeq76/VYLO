import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  TrendingUp,
  CheckCircle2,
  MinusCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Award,
  Flame,
  Droplets,
  Moon,
  Activity,
  CalendarCheck
} from 'lucide-react';

interface FitScoreCardProps {
  score?: number;
  steps?: number;
  stepTarget?: number;
  workoutCompleted?: boolean;
  waterGlasses?: number;
  waterTargetGlasses?: number;
  sleepHours?: number;
  streakDays?: number;
  onOpenHydrationModal?: () => void;
  onOpenWorkoutModal?: () => void;
}

export const FitScoreCard: React.FC<FitScoreCardProps> = ({
  score = 78,
  steps = 6420,
  stepTarget = 6000,
  workoutCompleted = false,
  waterGlasses = 5,
  waterTargetGlasses = 8,
  sleepHours = 7.33,
  streakDays = 14,
  onOpenHydrationModal,
  onOpenWorkoutModal,
}) => {
  const [showImprovementTips, setShowImprovementTips] = useState(false);

  // Derive status
  const activityAchieved = steps >= stepTarget;
  const hydrationAchieved = waterGlasses >= waterTargetGlasses;
  const sleepAchieved = sleepHours >= 7;
  const consistencyAchieved = streakDays >= 3;

  // Personalized tips based on missing factors
  const tips: string[] = [];
  if (!workoutCompleted) {
    tips.push('Complete a 10–12 minute dorm bodyweight routine today to add +12 points.');
  }
  if (!hydrationAchieved) {
    tips.push(`Drink ${waterTargetGlasses - waterGlasses} more glasses of water before 9 PM to add +6 points.`);
  }
  if (!activityAchieved) {
    tips.push(`Walk ${stepTarget - steps} more steps (e.g. scenic campus walking route) to add +8 points.`);
  }
  if (!sleepAchieved) {
    tips.push('Aim for at least 7.5 hours of sleep tonight for central nervous system recovery (+6 points).');
  }
  if (tips.length === 0) {
    tips.push('Outstanding job! You have satisfied all 5 daily health pillars today.');
  }

  // Get score color
  const getScoreColor = (s: number) => {
    if (s >= 80) return 'text-emerald-400 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]';
    if (s >= 65) return 'text-teal-400 border-teal-500 shadow-[0_0_15px_rgba(20,184,166,0.3)]';
    return 'text-amber-400 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]';
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#151c17] via-[#101512] to-[#0b0e0c] border border-emerald-500/30 p-5 sm:p-6 shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Award size={18} />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 block">
              Daily Holistic Metric
            </span>
            <h3 className="text-base sm:text-lg font-black font-brand text-white">
              Fit Score
            </h3>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-gray-400 block">Status:</span>
          <span className="text-xs font-bold text-emerald-400">
            {score >= 80 ? 'Optimal Zone' : score >= 65 ? 'Thriving' : 'Ascending'}
          </span>
        </div>
      </div>

      {/* Main Score Hero Block */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-[#18211a] border border-emerald-500/20 mb-4">
        <div className="space-y-1">
          <div className="text-[11px] font-bold text-gray-300 uppercase tracking-wider">
            Overall Fit Score
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-4xl sm:text-5xl font-black font-brand tracking-tight text-white">
              {score}
            </span>
            <span className="text-gray-400 text-sm font-bold">/ 100</span>
          </div>
          <p className="text-[11px] text-gray-400">
            Based on student lifestyle behavioral balance
          </p>
        </div>

        {/* Circular Dial / Badge */}
        <div className={`w-20 h-20 rounded-full border-4 flex flex-col items-center justify-center bg-black/40 ${getScoreColor(score)}`}>
          <TrendingUp size={22} />
          <span className="text-[10px] font-black uppercase tracking-wider mt-0.5">Top 15%</span>
        </div>
      </div>

      {/* 5 Factors Breakdown (Prompt Section 14) */}
      <div className="space-y-2 mb-4">
        <div className="text-[11px] font-black uppercase tracking-wider text-gray-400">
          Core Pillars Breakdown
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {/* 1. Activity */}
          <div className={`p-2.5 rounded-2xl border flex items-center justify-between ${
            activityAchieved ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200' : 'bg-black/30 border-white/5 text-gray-400'
          }`}>
            <div className="flex items-center gap-1.5">
              <Activity size={13} className={activityAchieved ? 'text-emerald-400' : 'text-gray-500'} />
              <span className="text-xs font-bold">Activity</span>
            </div>
            {activityAchieved ? (
              <CheckCircle2 size={15} className="text-emerald-400" />
            ) : (
              <MinusCircle size={15} className="text-gray-500" />
            )}
          </div>

          {/* 2. Workout */}
          <div
            onClick={onOpenWorkoutModal}
            className={`p-2.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
              workoutCompleted ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200' : 'bg-black/30 border-white/5 text-gray-400 hover:border-emerald-500/30'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <Flame size={13} className={workoutCompleted ? 'text-emerald-400' : 'text-gray-500'} />
              <span className="text-xs font-bold">Workout</span>
            </div>
            {workoutCompleted ? (
              <CheckCircle2 size={15} className="text-emerald-400" />
            ) : (
              <MinusCircle size={15} className="text-gray-500" />
            )}
          </div>

          {/* 3. Hydration */}
          <div
            onClick={onOpenHydrationModal}
            className={`p-2.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
              hydrationAchieved ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200' : 'bg-black/30 border-white/5 text-gray-400 hover:border-emerald-500/30'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <Droplets size={13} className={hydrationAchieved ? 'text-teal-400' : 'text-gray-500'} />
              <span className="text-xs font-bold">Hydration</span>
            </div>
            {hydrationAchieved ? (
              <CheckCircle2 size={15} className="text-teal-400" />
            ) : (
              <MinusCircle size={15} className="text-gray-500" />
            )}
          </div>

          {/* 4. Sleep */}
          <div className={`p-2.5 rounded-2xl border flex items-center justify-between ${
            sleepAchieved ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200' : 'bg-black/30 border-white/5 text-gray-400'
          }`}>
            <div className="flex items-center gap-1.5">
              <Moon size={13} className={sleepAchieved ? 'text-indigo-400' : 'text-gray-500'} />
              <span className="text-xs font-bold">Sleep</span>
            </div>
            {sleepAchieved ? (
              <CheckCircle2 size={15} className="text-emerald-400" />
            ) : (
              <span className="text-xs text-gray-500 font-bold">—</span>
            )}
          </div>

          {/* 5. Consistency */}
          <div className={`p-2.5 rounded-2xl border flex items-center justify-between ${
            consistencyAchieved ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200' : 'bg-black/30 border-white/5 text-gray-400'
          }`}>
            <div className="flex items-center gap-1.5">
              <CalendarCheck size={13} className={consistencyAchieved ? 'text-emerald-400' : 'text-gray-500'} />
              <span className="text-xs font-bold">Streak</span>
            </div>
            {consistencyAchieved ? (
              <CheckCircle2 size={15} className="text-emerald-400" />
            ) : (
              <MinusCircle size={15} className="text-gray-500" />
            )}
          </div>
        </div>
      </div>

      {/* Expandable: "How can I improve my score?" (Prompt Section 14) */}
      <div className="pt-2 border-t border-white/5">
        <button
          type="button"
          onClick={() => setShowImprovementTips(!showImprovementTips)}
          className="w-full flex items-center justify-between text-xs font-bold text-emerald-400 hover:text-emerald-300 py-1 cursor-pointer transition-colors"
        >
          <span className="flex items-center gap-1.5">
            <HelpCircle size={14} />
            <span>How can I improve my score?</span>
          </span>
          {showImprovementTips ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </button>

        <AnimatePresence>
          {showImprovementTips && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-3 space-y-2 overflow-hidden"
            >
              {tips.map((tip, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-black/40 border border-emerald-500/20 text-xs text-gray-200 flex items-start gap-2.5"
                >
                  <Sparkles size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{tip}</span>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
