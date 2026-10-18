import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  UserHealthProfile,
  DailyQuest,
  HunterRank,
  MascotMoodState,
  MonthlyDietPlan,
  CollegeStudentProfile,
  MoodToMoveRecommendation
} from '../types';
import { Mascot } from '../components/Mascot';
import { useLanguage } from '../i18n/LanguageContext';
import {
  Flame,
  Zap,
  Droplets,
  Moon,
  Camera,
  Dumbbell,
  Sparkles,
  Award,
  ArrowRight,
  Clock,
  Heart,
  Target,
  Footprints,
  Compass,
  Users,
  Play,
  CheckCircle2,
  Sliders,
  TrendingUp,
  School
} from 'lucide-react';
import { MoodToMoveCard } from '../components/home/MoodToMoveCard';
import { FitScoreCard } from '../components/home/FitScoreCard';
import { YourDayPlanCard } from '../components/home/YourDayPlanCard';
import { AskZyroEntryCard } from '../components/home/AskZyroEntryCard';
import { NutritionIntelligenceCard } from '../components/home/NutritionIntelligenceCard';
import { AliveProgressRankCard } from '../components/home/AliveProgressRankCard';

interface HomeViewProps {
  userProfile: UserHealthProfile;
  studentProfile: CollegeStudentProfile;
  userName?: string;
  quests: DailyQuest[];
  onToggleQuest: (id: string) => void;
  streakDays: number;
  streakFreezeAvailable: number;
  onUseStreakFreeze: () => void;
  userXP: number;
  hunterRank: HunterRank;
  hydrationLiters: number;
  waterGlasses: number;
  onAddWaterGlass: () => void;
  sleepHours: number;
  dietPlan: MonthlyDietPlan;
  consumedCalories?: number;
  consumedProtein?: number;
  consumedCarbs?: number;
  consumedFats?: number;
  hasTrainedToday?: boolean;
  stepsCount: number;
  stepTarget: number;
  activeMinutes: number;
  fitScore: number;
  onNavigateTab: (tab: any) => void;
  onOpenLiveFormCheck: (workoutTitle?: string) => void;
  onStartActiveWorkout?: (workoutTitle: string) => void;
  onOpenMealScanner: () => void;
  onOpenAskAi: (prompt?: string) => void;
  onOpenBodyProfile: () => void;
  onLaunchDemo?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  userProfile,
  studentProfile,
  userName = 'Arjun',
  quests,
  onToggleQuest,
  streakDays = 14,
  streakFreezeAvailable,
  onUseStreakFreeze,
  userXP,
  hunterRank,
  hydrationLiters,
  waterGlasses = 5,
  onAddWaterGlass,
  sleepHours = 7.33,
  dietPlan,
  consumedCalories = 1740,
  consumedProtein = 108,
  consumedCarbs = 184,
  consumedFats = 52,
  hasTrainedToday = false,
  stepsCount = 6420,
  stepTarget = 6000,
  activeMinutes = 42,
  fitScore = 78,
  onNavigateTab,
  onOpenLiveFormCheck,
  onStartActiveWorkout,
  onOpenMealScanner,
  onOpenAskAi,
  onOpenBodyProfile,
  onLaunchDemo,
}) => {
  const { t } = useLanguage();

  // Dynamic Time of Day Greeting
  const greetingText = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  }, []);

  const handleStartWorkoutFlow = (title: string) => {
    if (onStartActiveWorkout) {
      onStartActiveWorkout(title);
    } else {
      onOpenLiveFormCheck(title);
    }
  };

  const handleStartMoodRecommendation = (activity: MoodToMoveRecommendation) => {
    handleStartWorkoutFlow(activity.activityTitle);
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-28">
      {/* 1. TOP GREETING & STUDENT IDENTITY BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-400">
              VYLO • THRIVE. ASCEND. EVOLVE.
            </span>
            <span className="text-gray-600">•</span>
            <div className="flex items-center gap-1 text-[11px] font-bold text-gray-400">
              <School size={12} className="text-emerald-400" />
              <span>{studentProfile.collegeName}</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight font-brand">
            👋 {greetingText}, {studentProfile.name || userName}
          </h1>

          <p className="text-xs sm:text-sm text-gray-300 font-medium">
            Goal: <strong className="text-emerald-400">{studentProfile.fitnessGoal}</strong> • {studentProfile.fitnessLevel} • {studentProfile.dailyAvailableMinutes} min/day time budget
          </p>
        </div>

        {/* Top Badges / Demo Action */}
        <div className="flex items-center gap-2">
          {onLaunchDemo && (
            <button
              type="button"
              onClick={onLaunchDemo}
              className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Sparkles size={13} className="text-emerald-400" />
              <span>Demo Mode</span>
            </button>
          )}

          <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold flex items-center gap-1">
            <Flame size={14} className="fill-amber-400" />
            <span>{streakDays} Day Streak</span>
          </div>
        </div>
      </div>

      {/* 2. TODAY AT A GLANCE (Prompt Section 5) */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-[#16221a] via-[#111713] to-[#0a0d0c] border border-emerald-500/30 space-y-4 shadow-[0_15px_50px_rgba(0,0,0,0.6)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-wider text-emerald-300 font-mono">
              Today at a Glance
            </span>
          </div>
          <span className="text-xs font-mono text-gray-400">
            {new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
          </span>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Steps */}
          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
            <div className="flex items-center justify-between text-[11px] text-gray-400 font-bold uppercase">
              <span className="flex items-center gap-1">
                <Footprints size={13} className="text-emerald-400" />
                <span>Campus Steps</span>
              </span>
              <span className="text-emerald-400 font-mono">
                {Math.round((stepsCount / stepTarget) * 100)}%
              </span>
            </div>
            <div className="text-2xl font-black font-brand text-white">
              {stepsCount.toLocaleString()}
            </div>
            <div className="text-[10px] text-gray-400">Target: {stepTarget.toLocaleString()} steps</div>
          </div>

          {/* Active Minutes */}
          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
            <div className="flex items-center justify-between text-[11px] text-gray-400 font-bold uppercase">
              <span className="flex items-center gap-1">
                <Clock size={13} className="text-teal-400" />
                <span>Active Time</span>
              </span>
              <span className="text-teal-400 font-mono font-bold">Target Met</span>
            </div>
            <div className="text-2xl font-black font-brand text-teal-300">
              {activeMinutes}m
            </div>
            <div className="text-[10px] text-gray-400">Lectures, walking & workouts</div>
          </div>

          {/* Hydration */}
          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
            <div className="flex items-center justify-between text-[11px] text-gray-400 font-bold uppercase">
              <span className="flex items-center gap-1">
                <Droplets size={13} className="text-cyan-400" />
                <span>Hydration</span>
              </span>
              <button
                type="button"
                onClick={onAddWaterGlass}
                className="text-[10px] font-bold text-cyan-400 hover:underline cursor-pointer"
              >
                +1 Glass
              </button>
            </div>
            <div className="text-2xl font-black font-brand text-cyan-300">
              {waterGlasses} / 8
            </div>
            <div className="text-[10px] text-gray-400">Glasses of water</div>
          </div>

          {/* Sleep Recovery */}
          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
            <div className="flex items-center justify-between text-[11px] text-gray-400 font-bold uppercase">
              <span className="flex items-center gap-1">
                <Moon size={13} className="text-indigo-400" />
                <span>Sleep Log</span>
              </span>
              <span className="text-indigo-400 font-mono">Restored</span>
            </div>
            <div className="text-2xl font-black font-brand text-indigo-300">
              7h 20m
            </div>
            <div className="text-[10px] text-gray-400">Optimal deep CNS sleep</div>
          </div>
        </div>

        {/* Today's Recommendation Banner (Prompt Section 5 & 25) */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/70 to-teal-950/60 border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-black text-emerald-300 uppercase tracking-wider">
              <Sparkles size={14} className="text-emerald-400" />
              <span>Today's Adaptive Recommendation</span>
            </div>
            <h4 className="text-lg font-black font-brand text-white">
              12-Minute Full Body Hostel / Dorm Quick Circuit
            </h4>
            <p className="text-xs text-gray-300">
              Zero equipment needed • Calibrated for limited dorm space beside your study desk.
            </p>
          </div>

          <button
            type="button"
            onClick={() => handleStartWorkoutFlow('12-Minute Full Body Hostel / Dorm Quick Circuit')}
            className="py-3 px-5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2 cursor-pointer transition-all shrink-0"
          >
            <Play size={14} fill="currentColor" />
            <span>Start Session (12m)</span>
          </button>
        </div>

        {/* Squad Status Snippet */}
        <div
          onClick={() => onNavigateTab('squad')}
          className="p-3 rounded-2xl bg-black/30 border border-white/5 flex items-center justify-between text-xs cursor-pointer hover:border-emerald-500/30 transition-all"
        >
          <div className="flex items-center gap-2 text-gray-300">
            <Users size={14} className="text-emerald-400" />
            <span>Squad Ascend: <strong>Engineering Ascendants</strong> (Rank #2 on campus)</span>
          </div>
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <span>View Squad Goal</span>
            <ArrowRight size={13} />
          </span>
        </div>
      </div>

      {/* 3. FIT SCORE COMPONENT (Prompt Section 14) */}
      <FitScoreCard
        score={fitScore}
        steps={stepsCount}
        stepTarget={stepTarget}
        workoutCompleted={hasTrainedToday}
        waterGlasses={waterGlasses}
        waterTargetGlasses={8}
        sleepHours={sleepHours}
        streakDays={streakDays}
        onOpenHydrationModal={onAddWaterGlass}
        onOpenWorkoutModal={() => onNavigateTab('workouts')}
      />

      {/* 4. MOOD-TO-MOVE AI (Prompt Section 8) */}
      <MoodToMoveCard onStartRecommendedWorkout={handleStartMoodRecommendation} />

      {/* 5. QUICK ACTIONS FOR BUSY STUDENTS */}
      <div className="space-y-3">
        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">
          Student Quick Actions
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            type="button"
            onClick={() => onOpenLiveFormCheck('Hostel Squat Calibration')}
            className="p-3.5 rounded-2xl bg-[#141b16] hover:bg-[#18221b] border border-emerald-500/20 hover:border-emerald-500/40 text-left transition-all cursor-pointer space-y-1.5"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Camera size={16} />
            </div>
            <div className="text-xs font-bold text-white">Live Form Check</div>
            <div className="text-[10px] text-gray-400 leading-tight">Camera AI joint tracking</div>
          </button>

          <button
            type="button"
            onClick={onOpenMealScanner}
            className="p-3.5 rounded-2xl bg-[#141b16] hover:bg-[#18221b] border border-emerald-500/20 hover:border-emerald-500/40 text-left transition-all cursor-pointer space-y-1.5"
          >
            <div className="w-8 h-8 rounded-xl bg-teal-500/20 flex items-center justify-center text-teal-400">
              <Sparkles size={16} />
            </div>
            <div className="text-xs font-bold text-white">Meal Macro Scanner</div>
            <div className="text-[10px] text-gray-400 leading-tight">AI dining hall photo analysis</div>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('explore')}
            className="p-3.5 rounded-2xl bg-[#141b16] hover:bg-[#18221b] border border-emerald-500/20 hover:border-emerald-500/40 text-left transition-all cursor-pointer space-y-1.5"
          >
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Compass size={16} />
            </div>
            <div className="text-xs font-bold text-white">Campus Routes</div>
            <div className="text-[10px] text-gray-400 leading-tight">Interactive walking maps</div>
          </button>

          <button
            type="button"
            onClick={() => onOpenAskAi('How can I fit high-protein dining hall meals into my budget?')}
            className="p-3.5 rounded-2xl bg-[#141b16] hover:bg-[#18221b] border border-emerald-500/20 hover:border-emerald-500/40 text-left transition-all cursor-pointer space-y-1.5"
          >
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
              <Zap size={16} />
            </div>
            <div className="text-xs font-bold text-white">Ask VYLO AI</div>
            <div className="text-[10px] text-gray-400 leading-tight">Instant student fitness advice</div>
          </button>
        </div>
      </div>

      {/* 6. DAILY QUESTS SECTION */}
      <YourDayPlanCard
        quests={quests}
        onToggleQuest={onToggleQuest}
        onStartWorkout={handleStartWorkoutFlow}
        onOpenMealScanner={onOpenMealScanner}
        onAddHydration={onAddWaterGlass}
        onOpenSleepLog={() => onNavigateTab('diet')}
      />

      {/* 7. NUTRITION INTELLIGENCE (Campus Dining Hall Friendly) */}
      <NutritionIntelligenceCard
        targetCalories={dietPlan.targetDailyCalories || 2400}
        consumedCalories={consumedCalories}
        targetProtein={dietPlan.targetMacros.protein || 140}
        consumedProtein={consumedProtein}
        consumedCarbs={consumedCarbs}
        consumedFats={consumedFats}
        onOpenMealScanner={onOpenMealScanner}
        onNavigateToDiet={() => onNavigateTab('diet')}
      />
    </div>
  );
};
