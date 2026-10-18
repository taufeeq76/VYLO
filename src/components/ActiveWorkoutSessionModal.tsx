import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  X,
  Clock,
  Sparkles,
  Flame,
  ChevronRight,
  Dumbbell,
  Award,
  Zap,
  ShoppingBag,
  ArrowRight
} from 'lucide-react';
import { WorkoutProgram, ExerciseStep } from '../data/worldWorkouts';

interface ActiveWorkoutSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  workout: WorkoutProgram;
  onCompleteWorkout: (earnedXP: number, workoutTitle: string) => void;
  onNavigateToStore?: (searchQuery?: string) => void;
}

export const ActiveWorkoutSessionModal: React.FC<ActiveWorkoutSessionModalProps> = ({
  isOpen,
  onClose,
  workout,
  onCompleteWorkout,
  onNavigateToStore,
}) => {
  const [currentDrillIndex, setCurrentDrillIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [loggedWeight, setLoggedWeight] = useState<number>(75);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  // Rest Timer State
  const [isResting, setIsResting] = useState(false);
  const [restSecondsLeft, setRestSecondsLeft] = useState(60);
  const [totalRestSeconds, setTotalRestSeconds] = useState(60);

  // Micro-interaction notification state
  const [showSetCelebration, setShowSetCelebration] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [accumulatedXP, setAccumulatedXP] = useState(0);

  const currentDrill: ExerciseStep = workout.exercises[currentDrillIndex] || workout.exercises[0];
  const totalSets = currentDrill?.sets || 4;
  const nextDrill = workout.exercises[currentDrillIndex + 1];

  // Workout duration timer
  useEffect(() => {
    if (!isOpen || isFinished || !isTimerRunning) return;
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, isFinished, isTimerRunning]);

  // Rest countdown timer
  useEffect(() => {
    if (!isResting || restSecondsLeft <= 0) {
      if (isResting && restSecondsLeft <= 0) {
        setIsResting(false);
      }
      return;
    }
    const timer = setInterval(() => {
      setRestSecondsLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isResting, restSecondsLeft]);

  if (!isOpen) return null;

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  const handleCompleteSet = () => {
    // Satisfying micro-interaction animation
    setShowSetCelebration(true);
    setAccumulatedXP((prev) => prev + 20);

    setTimeout(() => {
      setShowSetCelebration(false);
    }, 1200);

    if (currentSet < totalSets) {
      // Advance to next set & start rest timer
      setCurrentSet((prev) => prev + 1);
      const restTime = currentDrill.restSec || 60;
      setTotalRestSeconds(restTime);
      setRestSecondsLeft(restTime);
      setIsResting(true);
    } else {
      // Drill complete, check if more drills remain
      if (currentDrillIndex < workout.exercises.length - 1) {
        setCurrentDrillIndex((prev) => prev + 1);
        setCurrentSet(1);
        const restTime = 90;
        setTotalRestSeconds(restTime);
        setRestSecondsLeft(restTime);
        setIsResting(true);
      } else {
        // Entire workout finished!
        setIsFinished(true);
        setIsTimerRunning(false);
        const bonusXP = workout.xpReward;
        onCompleteWorkout(accumulatedXP + bonusXP, workout.title);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-2xl overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0C1017] border border-emerald-500/30 rounded-3xl p-5 sm:p-7 shadow-[0_25px_80px_rgba(0,0,0,0.9)] my-auto max-h-[94vh] flex flex-col">
        {/* Header with Workout Context */}
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-black">
              <Dumbbell size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                  {workout.disciplineLabel}
                </span>
                <span className="text-xs font-mono text-gray-400">
                  ⏱️ {formatTime(elapsedSeconds)}
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-black text-white mt-0.5">{workout.title}</h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 transition-colors"
              title={isTimerRunning ? 'Pause Session' : 'Resume Session'}
            >
              {isTimerRunning ? <Pause size={16} /> : <Play size={16} />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* FINISHED WORKOUT CELEBRATION VIEW */}
        {isFinished ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-6 space-y-6 text-center"
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-300 text-black flex items-center justify-center mx-auto shadow-[0_0_35px_rgba(16,185,129,0.5)]">
              <Award size={40} />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-black uppercase tracking-[0.25em] text-emerald-400">
                PROTOCOL COMPLETED
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white">Ascendance Recorded</h3>
              <p className="text-xs text-gray-400 max-w-md mx-auto">
                Phenomenal effort. Your nervous system adaptation and muscle mechanical tension have been logged to your Hunter profile.
              </p>
            </div>

            {/* Metrics summary */}
            <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
              <div className="bg-[#121824] p-3 rounded-2xl border border-white/5">
                <span className="text-[10px] text-gray-400 font-bold block">XP EARNED</span>
                <span className="text-lg font-black text-emerald-400 mt-0.5 block">
                  +{accumulatedXP + workout.xpReward} XP
                </span>
              </div>
              <div className="bg-[#121824] p-3 rounded-2xl border border-white/5">
                <span className="text-[10px] text-gray-400 font-bold block">ACTIVE TIME</span>
                <span className="text-lg font-black text-white mt-0.5 block">
                  {formatTime(elapsedSeconds)}
                </span>
              </div>
              <div className="bg-[#121824] p-3 rounded-2xl border border-white/5">
                <span className="text-[10px] text-gray-400 font-bold block">CALORIES</span>
                <span className="text-lg font-black text-amber-400 mt-0.5 block">
                  ~{workout.caloriesBurnEstimate} kcal
                </span>
              </div>
            </div>

            {/* Contextual Store Equipment Recommendations */}
            <div className="bg-[#111724] border border-emerald-500/20 rounded-2xl p-4 text-left space-y-2.5 max-w-md mx-auto">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag size={14} className="text-emerald-400" />
                  <span className="text-xs font-black text-white uppercase tracking-wider">
                    Recommended For Your Training Setup
                  </span>
                </div>
                <span className="text-[10px] text-emerald-400 font-bold">Campus Store</span>
              </div>
              <p className="text-[11px] text-gray-400">
                Gear calibrated to optimize mechanical stability and recovery for {workout.disciplineLabel}:
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {['Dumbbells', 'Training Shoes', 'Shaker Bottle', 'Knee Sleeves'].map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      onClose();
                      onNavigateToStore?.(item);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-black/50 border border-white/10 hover:border-emerald-500 text-xs font-bold text-gray-200 hover:text-emerald-400 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>{item}</span>
                    <ArrowRight size={11} />
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full max-w-md mx-auto py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_20px_rgba(16,185,129,0.3)]"
            >
              Return to Dashboard
            </button>
          </motion.div>
        ) : (
          /* ACTIVE EXERCISE VIEW */
          <div className="flex-1 overflow-y-auto py-4 space-y-4">
            {/* CURRENT EXERCISE HERO CARD */}
            <div className="relative bg-gradient-to-br from-[#121A15] via-[#10151E] to-[#0A0E14] border border-emerald-500/40 rounded-3xl p-5 sm:p-6 space-y-4 shadow-2xl overflow-hidden">
              {/* Exercise Index Breadcrumb */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 flex items-center gap-1.5">
                  <Zap size={12} />
                  CURRENT EXERCISE • {currentDrillIndex + 1} OF {workout.exercises.length}
                </span>
                <span className="text-xs font-mono text-emerald-300 font-bold">
                  Set {currentSet} / {totalSets}
                </span>
              </div>

              {/* Title & Target Reps */}
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
                    {currentDrill.name}
                  </h3>
                  <p className="text-xs text-emerald-400/90 font-mono mt-0.5">
                    Target: {currentDrill.reps} • {currentDrill.restSec}s rest
                  </p>
                </div>

                {/* Micro Celebration Overlay on Set Complete */}
                <AnimatePresence>
                  {showSetCelebration && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1.05, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      className="px-3 py-1.5 rounded-full bg-emerald-500 text-black font-black text-xs tracking-wider flex items-center gap-1.5 shadow-[0_0_15px_#10B981]"
                    >
                      <CheckCircle2 size={15} />
                      <span>✓ SET COMPLETE (+20 XP)</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Visual Guidance Animation / Posture Cue */}
              <div className="p-3.5 rounded-2xl bg-black/50 border border-white/5 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-200">
                  <Sparkles size={13} className="text-emerald-400" />
                  <span>Biomechanical Cues:</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {currentDrill.cues.map((cue, cIdx) => (
                    <span
                      key={cIdx}
                      className="text-[11px] bg-white/5 border border-white/5 text-gray-300 px-2 py-0.5 rounded-md"
                    >
                      • {cue}
                    </span>
                  ))}
                </div>
              </div>

              {/* Weight & Previous Performance Benchmarks */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="bg-black/40 p-3 rounded-2xl border border-white/5">
                  <span className="text-[10px] text-gray-400 uppercase font-bold block">
                    Working Weight
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="number"
                      value={loggedWeight}
                      onChange={(e) => setLoggedWeight(Number(e.target.value) || 0)}
                      className="w-16 bg-black/60 border border-emerald-500/30 rounded-lg px-2 py-1 text-sm font-black text-emerald-400 text-center focus:outline-none"
                    />
                    <span className="text-xs text-gray-400 font-bold">kg</span>
                  </div>
                </div>

                <div className="bg-black/40 p-3 rounded-2xl border border-white/5">
                  <span className="text-[10px] text-gray-400 uppercase font-bold block">
                    Previous Performance
                  </span>
                  <span className="text-sm font-black text-white mt-1 block">
                    {loggedWeight > 0 ? `${loggedWeight - 2.5} kg × ${currentDrill.reps}` : 'Personal Best'}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">Progressive overload</span>
                </div>
              </div>

              {/* REST TIMER COMPONENT (Activates between sets) */}
              {isResting && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-2xl bg-[#091018] border border-cyan-500/40 space-y-2 shadow-lg"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-black text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Clock size={14} />
                      REST PERIOD • CATCH YOUR BREATH
                    </span>
                    <button
                      onClick={() => setIsResting(false)}
                      className="text-[11px] text-gray-400 hover:text-white uppercase font-bold cursor-pointer"
                    >
                      Skip Rest →
                    </button>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-3xl font-black text-cyan-300 font-mono">
                      {restSecondsLeft}s
                    </div>
                    <div className="flex-1 bg-black/60 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-cyan-400 h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_#22d3ee]"
                        style={{
                          width: `${Math.max(0, (restSecondsLeft / totalRestSeconds) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Set Complete Action CTA */}
              <button
                type="button"
                onClick={handleCompleteSet}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 hover:opacity-95 text-black font-black text-xs sm:text-sm uppercase tracking-widest transition-all cursor-pointer shadow-[0_0_25px_rgba(16,185,129,0.35)] flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
              >
                <CheckCircle2 size={18} />
                <span>
                  {currentSet < totalSets
                    ? `COMPLETE SET ${currentSet} (+20 XP)`
                    : currentDrillIndex < workout.exercises.length - 1
                    ? 'COMPLETE MOVEMENT & NEXT DRILL (+20 XP)'
                    : 'FINISH FULL WORKOUT (+100 XP BONUS)'}
                </span>
              </button>
            </div>

            {/* Next Exercise Preview */}
            {nextDrill && (
              <div className="p-3.5 rounded-2xl bg-[#121620] border border-white/5 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-bold block">
                    UP NEXT
                  </span>
                  <span className="font-bold text-gray-200">{nextDrill.name}</span>
                </div>
                <span className="text-[11px] text-emerald-400 font-mono">
                  {nextDrill.sets} sets × {nextDrill.reps}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
