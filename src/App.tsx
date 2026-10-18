import React, { useState, useEffect } from 'react';
import {
  AppTab,
  UserHealthProfile,
  DailyQuest,
  HunterRank,
  SupportedLanguage,
  CollegeStudentProfile,
  UserAuthSession
} from './types';
import {
  INITIAL_USER_PROFILE,
  INITIAL_STUDENT_PROFILE,
  INITIAL_DIET_PLAN,
  INITIAL_QUESTS,
} from './data/mockData';
import { COUNTRIES, CountryInfo, getCountryByCode } from './data/countries';
import { Logo } from './components/Logo';
import { MealScannerModal } from './components/MealScannerModal';
import { LiveFormCheckModal } from './components/LiveFormCheckModal';
import { AskZyroChatModal } from './components/AskZyroChatModal';
import { StudentAuthModal } from './components/StudentAuthModal';
import { StudentOnboardingModal } from './components/StudentOnboardingModal';
import { FeedbackModal } from './components/FeedbackModal';
import { BottomNav } from './components/BottomNav';
import { ActiveWorkoutSessionModal } from './components/ActiveWorkoutSessionModal';
import { WORLD_WORKOUTS, WorkoutProgram } from './data/worldWorkouts';

// Views
import { HomeView } from './views/HomeView';
import { WorkoutsView } from './views/WorkoutsView';
import { ExploreView } from './views/ExploreView';
import { SquadAscendView } from './views/SquadAscendView';
import { ProfileView } from './views/ProfileView';

import {
  Globe,
  Sparkles,
  MessageSquareHeart,
  Shield,
  School,
  Flame,
  CheckCircle2,
  X,
  Bell
} from 'lucide-react';
import { useLanguage } from './i18n/LanguageContext';

export const App: React.FC = () => {
  const { currentLanguage, setLanguage, t, supportedLanguages, isRtl } = useLanguage();
  const [activeTab, setActiveTab] = useState<AppTab>('home');
  const [userProfile, setUserProfile] = useState<UserHealthProfile>(INITIAL_USER_PROFILE);
  const [studentProfile, setStudentProfile] = useState<CollegeStudentProfile>(() => {
    try {
      const saved = localStorage.getItem('vylo_student_profile');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return INITIAL_STUDENT_PROFILE;
  });

  const [dietPlan, setDietPlan] = useState(INITIAL_DIET_PLAN);
  const [quests, setQuests] = useState<DailyQuest[]>(INITIAL_QUESTS);
  const [streakDays, setStreakDays] = useState<number>(14);
  const [streakFreezeAvailable, setStreakFreezeAvailable] = useState<number>(2);
  const [userXP, setUserXP] = useState<number>(1820);
  const [hunterRank, setHunterRank] = useState<HunterRank>('C');
  const [hydrationLiters, setHydrationLiters] = useState<number>(1.75);
  const [waterGlasses, setWaterGlasses] = useState<number>(5);
  const [sleepHours, setSleepHours] = useState<number>(7.33);

  // Student Daily Metrics
  const [stepsCount, setStepsCount] = useState<number>(6420);
  const [stepTarget, setStepTarget] = useState<number>(6000);
  const [activeMinutes, setActiveMinutes] = useState<number>(42);
  const [fitScore, setFitScore] = useState<number>(78);

  // Auth & Onboarding Modals
  const [isStudentAuthOpen, setIsStudentAuthOpen] = useState(false);
  const [isStudentOnboardingOpen, setIsStudentOnboardingOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  // Modals state
  const [isMealScannerOpen, setIsMealScannerOpen] = useState(false);
  const [isFormCheckOpen, setIsFormCheckOpen] = useState(false);
  const [formCheckWorkoutTitle, setFormCheckWorkoutTitle] = useState('Dorm Squat & Posture Circuit');
  const [isAskAiOpen, setIsAskAiOpen] = useState(false);
  const [aiInitialPrompt, setAiInitialPrompt] = useState<string | undefined>(undefined);

  // Dynamic Connected Nutrition State
  const [consumedCalories, setConsumedCalories] = useState<number>(1740);
  const [consumedProtein, setConsumedProtein] = useState<number>(108);
  const [consumedCarbs, setConsumedCarbs] = useState<number>(184);
  const [consumedFats, setConsumedFats] = useState<number>(52);

  // In-App Toast Encouragement
  const [toastNotification, setToastNotification] = useState<{ title: string; message: string } | null>(null);

  // Immersive Active Workout State
  const [hasTrainedToday, setHasTrainedToday] = useState<boolean>(true);
  const [activeWorkoutProgram, setActiveWorkoutProgram] = useState<WorkoutProgram | null>(null);

  const showToast = (title: string, message: string) => {
    setToastNotification({ title, message });
    setTimeout(() => {
      setToastNotification(null);
    }, 4500);
  };

  const handleStartWorkoutSession = (workoutTitle: string) => {
    const found =
      WORLD_WORKOUTS.find(
        (w) =>
          w.title.toLowerCase().includes(workoutTitle.toLowerCase()) ||
          workoutTitle.toLowerCase().includes(w.title.toLowerCase())
      ) || WORLD_WORKOUTS[0];
    setActiveWorkoutProgram(found);
  };

  const handleCompleteActiveWorkout = (earnedXP: number, workoutTitle: string) => {
    setUserXP((prev) => prev + earnedXP);
    setHasTrainedToday(true);
    setFitScore((prev) => Math.min(100, prev + 4));
    setQuests((prev) =>
      prev.map((q) => (q.category === 'workout' || q.id === 'quest-1' ? { ...q, completed: true } : q))
    );
    showToast('Ascendance Recorded! 🔥', `You completed "${workoutTitle}" and earned +${earnedXP} XP! Fit score surged to ${Math.min(100, fitScore + 4)}.`);
  };

  const handleToggleQuest = (id: string) => {
    setQuests((prev) =>
      prev.map((q) => {
        if (q.id === id) {
          const nextState = !q.completed;
          if (nextState) {
            setUserXP((xp) => xp + q.xpReward);
            showToast('Mission Complete! 🎯', `+${q.xpReward} XP earned toward your collegiate rank.`);
          }
          return { ...q, completed: nextState };
        }
        return q;
      })
    );
  };

  const handleAddWaterGlass = () => {
    setWaterGlasses((prev) => {
      const next = prev + 1;
      setHydrationLiters((l) => +(l + 0.25).toFixed(2));
      if (next === 8) {
        showToast('Hydration Goal Reached! 💧', 'You drank 8 glasses of water today. Excellent focus!');
      }
      return next;
    });
  };

  const handleUseStreakFreeze = () => {
    if (streakFreezeAvailable > 0) {
      setStreakFreezeAvailable((prev) => prev - 1);
      showToast('Streak Protected! 🛡️', 'Exam study freeze applied. Your streak remains intact.');
    }
  };

  const handleLaunchFormCheck = (workoutTitle?: string) => {
    if (workoutTitle) setFormCheckWorkoutTitle(workoutTitle);
    setIsFormCheckOpen(true);
  };

  const handleOpenAiWithPrompt = (prompt?: string) => {
    setAiInitialPrompt(prompt);
    setIsAskAiOpen(true);
  };

  const handleLoginSuccess = (profile: CollegeStudentProfile) => {
    setStudentProfile(profile);
    setIsStudentAuthOpen(false);
    try {
      localStorage.setItem('vylo_student_profile', JSON.stringify(profile));
    } catch (e) {
      // ignore
    }
    showToast('Welcome to VYLO!', `Authenticated as ${profile.name} (${profile.collegeName}).`);
  };

  const handleSaveOnboarding = (profile: CollegeStudentProfile) => {
    setStudentProfile(profile);
    setIsStudentOnboardingOpen(false);
    try {
      localStorage.setItem('vylo_student_profile', JSON.stringify(profile));
    } catch (e) {
      // ignore
    }
    showToast('Calibrated Successfully!', 'Your academic schedule & workout time budget are locked in.');
  };

  const handleResetDemoState = () => {
    setStudentProfile(INITIAL_STUDENT_PROFILE);
    setFitScore(78);
    setStepsCount(6420);
    setStreakDays(14);
    setWaterGlasses(5);
    setHasTrainedToday(true);
    showToast('Demo State Reset', 'Restored presentation demo state (Arjun, Stanford, 78 Fit Score).');
  };

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="min-h-screen bg-[#070908] text-white flex flex-col font-sans selection:bg-emerald-500 selection:text-black"
    >
      {/* In-App Toast Notification */}
      {toastNotification && (
        <div className="fixed top-4 right-4 z-50 max-w-sm bg-[#121a14] border border-emerald-500/50 rounded-2xl p-4 shadow-[0_10px_35px_rgba(0,0,0,0.8)] animate-in fade-in slide-in-from-top duration-300">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Bell size={16} />
              </div>
              <div>
                <h4 className="text-xs font-black text-white">{toastNotification.title}</h4>
                <p className="text-[11px] text-gray-300 mt-0.5 leading-snug">{toastNotification.message}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setToastNotification(null)}
              className="text-gray-400 hover:text-white cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Top Brand Header */}
      <header className="sticky top-0 z-30 border-b border-emerald-950/40 bg-gradient-to-b from-[#0e1611] via-[#070908]/95 to-[#070908]/90 backdrop-blur-xl px-4 sm:px-8 py-3 sm:py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo & Tagline Badge */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="cursor-pointer" onClick={() => setActiveTab('home')}>
              <Logo showTagline={false} size="md" />
            </div>

            <div className="hidden lg:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest">
              <Sparkles size={12} />
              <span>Collegiate AI OS • {studentProfile.collegeName}</span>
            </div>
          </div>

          {/* Right Controls: Student Account + Streak + Language + Feedback */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Student Switcher / Auth Button */}
            <button
              type="button"
              onClick={() => setIsStudentAuthOpen(true)}
              className="flex items-center gap-1.5 bg-[#121914] hover:bg-emerald-950/40 border border-emerald-500/30 hover:border-emerald-500 text-white px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
              title="Student Login / Switch Account"
            >
              <School size={14} className="text-emerald-400" />
              <span className="text-[11px] text-white font-bold truncate max-w-[90px]">
                {studentProfile.name.split(' ')[0]}
              </span>
              <span className="hidden sm:inline text-[10px] text-emerald-400 font-mono">
                ({fitScore} FS)
              </span>
            </button>

            {/* Streak Badge */}
            <div
              onClick={() => setActiveTab('home')}
              className="flex items-center gap-1 cursor-pointer bg-amber-500/10 border border-amber-500/30 px-2 py-1 rounded-xl text-amber-400 hover:opacity-90 transition-opacity"
            >
              <Flame size={14} className="fill-amber-400" />
              <span className="font-black text-xs tracking-tight whitespace-nowrap uppercase">
                {streakDays}D
              </span>
            </div>

            {/* Language Selector */}
            <div className="relative hidden sm:flex items-center gap-1 bg-[#121914] border border-emerald-950/40 rounded-xl px-2 py-1 text-xs text-slate-300">
              <Globe size={13} className="text-emerald-400" />
              <select
                value={currentLanguage}
                onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
                className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer"
                title={t('languageSelector', 'Choose Language')}
              >
                {supportedLanguages.map((lang) => (
                  <option key={lang.code} value={lang.code} className="bg-[#121914] text-white">
                    {lang.flag} {lang.nativeName}
                  </option>
                ))}
              </select>
            </div>

            {/* Feedback Button */}
            <button
              type="button"
              onClick={() => setIsFeedbackModalOpen(true)}
              className="flex items-center gap-1.5 bg-[#121914] hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white px-2.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              title="Community Feedback"
            >
              <MessageSquareHeart size={14} className="text-emerald-400" />
              <span className="hidden md:inline text-[11px]">Feedback</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 pt-4 sm:pt-6">
        {activeTab === 'home' && (
          <HomeView
            userProfile={userProfile}
            studentProfile={studentProfile}
            userName={studentProfile.name}
            quests={quests}
            onToggleQuest={handleToggleQuest}
            streakDays={streakDays}
            streakFreezeAvailable={streakFreezeAvailable}
            onUseStreakFreeze={handleUseStreakFreeze}
            userXP={userXP}
            hunterRank={hunterRank}
            hydrationLiters={hydrationLiters}
            waterGlasses={waterGlasses}
            onAddWaterGlass={handleAddWaterGlass}
            sleepHours={sleepHours}
            dietPlan={dietPlan}
            consumedCalories={consumedCalories}
            consumedProtein={consumedProtein}
            consumedCarbs={consumedCarbs}
            consumedFats={consumedFats}
            hasTrainedToday={hasTrainedToday}
            stepsCount={stepsCount}
            stepTarget={stepTarget}
            activeMinutes={activeMinutes}
            fitScore={fitScore}
            onNavigateTab={(tab) => setActiveTab(tab as AppTab)}
            onOpenLiveFormCheck={handleLaunchFormCheck}
            onStartActiveWorkout={handleStartWorkoutSession}
            onOpenMealScanner={() => setIsMealScannerOpen(true)}
            onOpenAskAi={(prompt) => handleOpenAiWithPrompt(prompt)}
            onOpenBodyProfile={() => setIsStudentOnboardingOpen(true)}
            onLaunchDemo={handleResetDemoState}
          />
        )}

        {activeTab === 'explore' && (
          <ExploreView
            onAddSteps={(steps) => {
              setStepsCount((prev) => prev + steps);
              showToast('Steps Added 🗺️', `+${steps.toLocaleString()} steps added to your daily tally.`);
            }}
            onShowInAppNotification={showToast}
          />
        )}

        {activeTab === 'workouts' && (
          <WorkoutsView
            userProfile={userProfile}
            onOpenLiveFormCheck={handleLaunchFormCheck}
            onStartActiveWorkout={handleStartWorkoutSession}
            onOpenZyroChat={handleOpenAiWithPrompt}
          />
        )}

        {activeTab === 'squad' && (
          <SquadAscendView
            currentUserSteps={stepsCount}
            onShowInAppNotification={showToast}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileView
            studentProfile={studentProfile}
            fitScore={fitScore}
            streakDays={streakDays}
            onEditProfile={() => setIsStudentOnboardingOpen(true)}
            onLogout={() => setIsStudentAuthOpen(true)}
            onResetDemo={handleResetDemoState}
          />
        )}
      </main>

      {/* Persistent Bottom Navigation (5 Primary Tabs: Home, Explore, Workout, Squad, Profile) */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenAskAi={() => handleOpenAiWithPrompt()}
      />

      {/* Collegiate Student Auth Modal */}
      <StudentAuthModal
        isOpen={isStudentAuthOpen}
        onClose={() => setIsStudentAuthOpen(false)}
        onSuccess={(student) =>
          handleLoginSuccess({
            ...studentProfile,
            name: student.name,
            collegeEmail: student.collegeEmail,
            collegeName: student.collegeName,
          })
        }
        onLaunchDemo={handleResetDemoState}
      />

      {/* Collegiate Student Onboarding Modal */}
      <StudentOnboardingModal
        isOpen={isStudentOnboardingOpen}
        onClose={() => setIsStudentOnboardingOpen(false)}
        onSave={handleSaveOnboarding}
        initialProfile={studentProfile}
      />

      {/* User Feedback & Community Notes Modal */}
      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        userId={studentProfile.name}
      />

      {/* Meal Scanner Modal */}
      <MealScannerModal
        isOpen={isMealScannerOpen}
        onClose={() => setIsMealScannerOpen(false)}
        userProfile={userProfile}
        userWeightKg={userProfile.weightKg}
        remainingCalories={Math.max(0, (dietPlan.targetDailyCalories || 2400) - consumedCalories)}
        onAddMealToLog={(scanned) => {
          setConsumedCalories((prev) => prev + scanned.macros.calories);
          setConsumedProtein((prev) => prev + scanned.macros.protein);
          setConsumedCarbs((prev) => prev + scanned.macros.carbs);
          setConsumedFats((prev) => prev + scanned.macros.fats);
          setQuests((prev) =>
            prev.map((q) => (q.category === 'nutrition' || q.id === 'quest-2' ? { ...q, completed: true } : q))
          );
          showToast(
            'Meal Logged! 🥗',
            `Analyzed ${scanned.foodName}: +${scanned.macros.calories} kcal, +${scanned.macros.protein}g protein recorded.`
          );
        }}
      />

      {/* Camera Live Form Check AI Modal */}
      <LiveFormCheckModal
        isOpen={isFormCheckOpen}
        onClose={() => setIsFormCheckOpen(false)}
        workoutTitle={formCheckWorkoutTitle}
        onCompleteWorkout={(earnedXP) => {
          setUserXP((prev) => prev + earnedXP);
          setHasTrainedToday(true);
          showToast('Form Check Passed! 🎥', `+${earnedXP} XP awarded for clean joint posture & biomechanics.`);
        }}
      />

      {/* Ask VYLO AI Assistant Modal */}
      <AskZyroChatModal
        isOpen={isAskAiOpen}
        onClose={() => setIsAskAiOpen(false)}
        initialPrompt={aiInitialPrompt}
        userName={studentProfile.name}
        countryName={studentProfile.collegeName}
      />

      {/* Active Workout Session Modal */}
      {activeWorkoutProgram && (
        <ActiveWorkoutSessionModal
          isOpen={true}
          workout={activeWorkoutProgram}
          onClose={() => setActiveWorkoutProgram(null)}
          onCompleteWorkout={(earnedXP, title) => {
            handleCompleteActiveWorkout(earnedXP, title);
            setActiveWorkoutProgram(null);
          }}
        />
      )}
    </div>
  );
};

export default App;
