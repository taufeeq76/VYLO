import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Smile,
  Zap,
  Clock,
  ArrowRight,
  Flame,
  CheckCircle2,
  Brain,
  Play,
  RotateCcw,
  Info
} from 'lucide-react';
import { MoodToMoveInput, MoodToMoveRecommendation } from '../../types';

interface MoodToMoveCardProps {
  onStartRecommendedWorkout?: (activity: MoodToMoveRecommendation) => void;
}

export const MoodToMoveCard: React.FC<MoodToMoveCardProps> = ({
  onStartRecommendedWorkout,
}) => {
  const [energy, setEnergy] = useState<'Low' | 'Medium' | 'High'>('Low');
  const [mood, setMood] = useState<MoodToMoveInput['mood']>('Stressed');
  const [stressLevel, setStressLevel] = useState<'Low' | 'Medium' | 'High'>('High');
  const [availableMinutes, setAvailableMinutes] = useState<number>(10);

  const [isLoading, setIsLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<MoodToMoveRecommendation | null>(null);

  const moodsList: { id: MoodToMoveInput['mood']; emoji: string; label: string }[] = [
    { id: 'Stressed', emoji: '😣', label: 'Stressed' },
    { id: 'Tired', emoji: '🥱', label: 'Tired' },
    { id: 'Neutral', emoji: '😐', label: 'Neutral' },
    { id: 'Energetic', emoji: '⚡', label: 'Energetic' },
    { id: 'Anxious', emoji: '😰', label: 'Anxious' },
    { id: 'Motivated', emoji: '🔥', label: 'Motivated' },
  ];

  const handleGenerateRecommendation = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/ai/mood-to-move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          energy,
          mood,
          stressLevel,
          availableMinutes,
        }),
      });
      const data = await res.json();
      setRecommendation(data);
    } catch {
      // Fallback
      setRecommendation({
        activityTitle: `${availableMinutes}-Minute Desk Relief & Breathing`,
        durationMinutes: availableMinutes,
        intensity: 'Gentle',
        whySelected: `Reduces physical tension caused by prolonged studying without draining your remaining energy reserves.`,
        targetFocus: 'Spine decompression, neck mobility, mental calm',
        studentContextNote: 'Zero equipment needed. Fits between study sessions.',
        exercises: [
          { name: 'Doorframe Chest & Shoulder Opener', durationOrReps: '60 sec', guidance: 'Counters laptop hunching' },
          { name: 'Chair Cat-Cow Spinal Wave', durationOrReps: '60 sec', guidance: 'Restores spinal fluid flow' },
          { name: 'Diaphragmatic Box Breathing 4-4-4-4', durationOrReps: '90 sec', guidance: 'Downregulates exam cortisol' },
        ],
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#151d18] via-[#101512] to-[#0a0d0c] border border-emerald-500/30 p-5 sm:p-6 shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
      {/* Background Accent Glow */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Brain size={18} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">
                Adaptive Biometrics
              </span>
              <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-[9px] font-black text-emerald-300">
                AI Powered
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black font-brand text-white">
              Mood-to-Move AI
            </h3>
          </div>
        </div>

        {recommendation && (
          <button
            type="button"
            onClick={() => setRecommendation(null)}
            className="text-xs text-gray-400 hover:text-emerald-400 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <RotateCcw size={13} />
            <span>Reset Input</span>
          </button>
        )}
      </div>

      <p className="text-xs text-gray-300 mb-4 leading-relaxed">
        Fluctuating exam stress, late lectures, or low energy? Let AI calibrate the exact workout duration and intensity so you stay consistent without burning out.
      </p>

      {/* When NO recommendation has been generated yet */}
      {!recommendation ? (
        <div className="space-y-4">
          {/* Energy Selector */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-gray-300 mb-1.5">
              <span className="flex items-center gap-1">
                <Zap size={13} className="text-emerald-400" />
                <span>Current Physical Energy</span>
              </span>
              <span className="text-emerald-400 font-mono text-[11px]">{energy} Energy</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(['Low', 'Medium', 'High'] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setEnergy(lvl)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    energy === lvl
                      ? 'bg-emerald-500 text-black font-black shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Mood Selector */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-gray-300 mb-1.5">
              <span className="flex items-center gap-1">
                <Smile size={13} className="text-emerald-400" />
                <span>Current Mental State</span>
              </span>
              <span className="text-emerald-400 font-mono text-[11px]">{mood}</span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
              {moodsList.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMood(m.id)}
                  className={`py-2 px-1 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-0.5 cursor-pointer ${
                    mood === m.id
                      ? 'bg-emerald-500/20 border border-emerald-400 text-white shadow-sm'
                      : 'bg-white/5 border border-transparent text-gray-400 hover:text-white'
                  }`}
                >
                  <span className="text-base">{m.emoji}</span>
                  <span className="text-[10px]">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Stress Level Selector */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-gray-300 mb-1.5">
              <span className="flex items-center gap-1">
                <Flame size={13} className="text-amber-400" />
                <span>Academic & Exam Stress Level</span>
              </span>
              <span className="text-amber-400 font-mono text-[11px]">{stressLevel} Stress</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(['Low', 'Medium', 'High'] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setStressLevel(lvl)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    stressLevel === lvl
                      ? 'bg-amber-500 text-black font-black shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Available Minutes Selector */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-gray-300 mb-1.5">
              <span className="flex items-center gap-1">
                <Clock size={13} className="text-emerald-400" />
                <span>Time Available Right Now</span>
              </span>
              <span className="text-emerald-400 font-mono text-[11px] font-bold">{availableMinutes} Minutes</span>
            </div>
            <div className="grid grid-cols-6 gap-1.5">
              {[5, 10, 15, 20, 30, 45].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setAvailableMinutes(mins)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    availableMinutes === mins
                      ? 'bg-emerald-500 text-black font-black shadow-[0_0_10px_#10B981]'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  {mins}m
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            type="button"
            onClick={handleGenerateRecommendation}
            disabled={isLoading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-black text-xs uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <Sparkles size={16} />
            <span>{isLoading ? 'Calibrating Biometrics with AI...' : 'Match My Mood to Move'}</span>
          </button>
        </div>
      ) : (
        /* RECOMMENDATION RESULT VIEW (Prompt Section 8) */
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Result Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#19221c] border border-emerald-500/40 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase tracking-wider">
                {recommendation.intensity} Intensity
              </span>
              <span className="text-xs font-mono font-bold text-gray-400 flex items-center gap-1">
                <Clock size={12} className="text-emerald-400" />
                {recommendation.durationMinutes} Minutes Session
              </span>
            </div>

            <h4 className="text-lg font-black font-brand text-white">
              {recommendation.activityTitle}
            </h4>

            {/* Crucial: Why this was selected */}
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/20 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-black text-emerald-400 uppercase tracking-wider">
                <Info size={13} />
                <span>Why This Was Selected</span>
              </div>
              <p className="text-xs text-emerald-100 leading-relaxed">
                {recommendation.whySelected}
              </p>
            </div>

            {recommendation.targetFocus && (
              <div className="text-xs text-gray-300 flex items-center gap-1.5">
                <strong className="text-emerald-400 font-bold">Target Focus:</strong>
                <span>{recommendation.targetFocus}</span>
              </div>
            )}

            {/* Recommended exercises */}
            {recommendation.exercises && recommendation.exercises.length > 0 && (
              <div className="space-y-2 pt-1 border-t border-white/5">
                <div className="text-[11px] font-black uppercase tracking-wider text-gray-400">
                  Recommended Sequence
                </div>
                <div className="space-y-1.5">
                  {recommendation.exercises.map((ex, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-black/30 border border-white/5 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-lg bg-emerald-500/20 text-emerald-400 text-[10px] font-black flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <div>
                          <div className="font-bold text-white">{ex.name}</div>
                          {ex.guidance && <div className="text-[10px] text-gray-400">{ex.guidance}</div>}
                        </div>
                      </div>
                      <span className="font-mono text-emerald-400 text-xs font-bold shrink-0">
                        {ex.durationOrReps}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Button */}
          <button
            type="button"
            onClick={() => onStartRecommendedWorkout && onStartRecommendedWorkout(recommendation)}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-black text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <Play size={16} fill="black" />
            <span>Launch This Workout Now ({recommendation.durationMinutes}m)</span>
          </button>
        </motion.div>
      )}
    </div>
  );
};
