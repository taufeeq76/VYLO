import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User,
  School,
  Activity,
  Target,
  Clock,
  Dumbbell,
  ArrowRight,
  ArrowLeft,
  Check,
  Sparkles,
  Flame,
  Zap,
  ShieldCheck
} from 'lucide-react';
import { CollegeStudentProfile } from '../types';

interface StudentOnboardingModalProps {
  isOpen: boolean;
  initialProfile?: Partial<CollegeStudentProfile>;
  onSave: (profile: CollegeStudentProfile) => void;
  onClose?: () => void;
}

export const StudentOnboardingModal: React.FC<StudentOnboardingModalProps> = ({
  isOpen,
  initialProfile,
  onSave,
  onClose,
}) => {
  const [step, setStep] = useState(1);

  const [name, setName] = useState(initialProfile?.name || 'Arjun');
  const [collegeEmail, setCollegeEmail] = useState(initialProfile?.collegeEmail || 'arjun.patel@stanford.edu');
  const [collegeName, setCollegeName] = useState(initialProfile?.collegeName || 'Stanford University');
  const [age, setAge] = useState(initialProfile?.age || 20);
  const [gender, setGender] = useState<'female' | 'male' | 'non-binary' | 'prefer-not-to-say'>(
    initialProfile?.gender || 'male'
  );
  const [heightCm, setHeightCm] = useState(initialProfile?.heightCm || 175);
  const [weightKg, setWeightKg] = useState(initialProfile?.weightKg || 70);

  // Step 2: Fitness Level, Goal, Time
  const [fitnessLevel, setFitnessLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>(
    initialProfile?.fitnessLevel || 'Beginner'
  );
  const [fitnessGoal, setFitnessGoal] = useState<CollegeStudentProfile['fitnessGoal']>(
    initialProfile?.fitnessGoal || 'General fitness'
  );
  const [dailyAvailableMinutes, setDailyAvailableMinutes] = useState<number>(
    initialProfile?.dailyAvailableMinutes || 15
  );

  // Step 3: Preferred workout & Typical activity
  const [preferredWorkoutType, setPreferredWorkoutType] = useState<CollegeStudentProfile['preferredWorkoutType']>(
    initialProfile?.preferredWorkoutType || 'Dorm Quick Circuit'
  );
  const [typicalActivityLevel, setTypicalActivityLevel] = useState<CollegeStudentProfile['typicalActivityLevel']>(
    initialProfile?.typicalActivityLevel || 'Sedentary'
  );

  if (!isOpen) return null;

  const handleFinish = () => {
    const fullProfile: CollegeStudentProfile = {
      name: name.trim() || 'Student Athlete',
      collegeEmail: collegeEmail.trim() || 'student@university.edu',
      collegeName: collegeName.trim() || 'Collegiate Institute',
      age: Number(age) || 20,
      gender,
      heightCm: Number(heightCm) || 175,
      weightKg: Number(weightKg) || 70,
      fitnessLevel,
      fitnessGoal,
      dailyAvailableMinutes,
      preferredWorkoutType,
      typicalActivityLevel,
    };
    onSave(fullProfile);
  };

  const goalsList: { id: CollegeStudentProfile['fitnessGoal']; title: string; desc: string; icon: string }[] = [
    { id: 'General fitness', title: 'General Fitness', desc: 'Stay healthy & alert between intense study schedules', icon: '⚡' },
    { id: 'Weight management', title: 'Weight Management', desc: 'Burn dining hall calories & maintain optimal composition', icon: '⚖️' },
    { id: 'Strength', title: 'Strength & Power', desc: 'Build lean muscle with bodyweight & progressive overload', icon: '💪' },
    { id: 'Endurance', title: 'Cardio & Stamina', desc: 'Boost VO2 max, sprint between lectures & sports', icon: '🏃' },
    { id: 'Flexibility', title: 'Flexibility & Posture', desc: 'Counteract chair hunching with spine & hip mobility', icon: '🧘' },
    { id: 'Daily activity', title: 'Daily Activity & Steps', desc: 'Consistent 6,000–10,000 campus walking habit', icon: '👟' },
    { id: 'Healthy lifestyle', title: 'Healthy Lifestyle', desc: 'Consistent sleep, hydration, and mental calm', icon: '🌱' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-xl overflow-y-auto">
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 15 }}
        className="relative w-full max-w-xl bg-gradient-to-b from-[#141b16] via-[#101412] to-[#0a0d0b] border border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.9)]"
      >
        {/* Progress Bar & Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-400 block">
              Step {step} of 3 • Student Calibration
            </span>
            <h2 className="text-xl sm:text-2xl font-black font-brand text-white tracking-tight">
              {step === 1 && 'Collegiate Identity & Body'}
              {step === 2 && 'Goals & Daily Time Budget'}
              {step === 3 && 'Workout Style & Campus Routine'}
            </h2>
          </div>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all ${
                  i === step ? 'w-7 bg-emerald-400 shadow-[0_0_8px_#10B981]' : i < step ? 'w-4 bg-emerald-600' : 'w-4 bg-white/10'
                }`}
              />
            ))}
          </div>
        </div>

        {/* STEP 1: Academic & Body Info */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-300 flex items-center gap-1">
                  <User size={13} className="text-emerald-400" />
                  <span>Student Name</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Arjun Patel"
                  className="w-full bg-[#181f1a] border border-emerald-900/60 focus:border-emerald-500 rounded-2xl px-3.5 py-2.5 text-sm text-white font-medium focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-300 flex items-center gap-1">
                  <School size={13} className="text-emerald-400" />
                  <span>College / Institution</span>
                </label>
                <input
                  type="text"
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                  placeholder="e.g. Stanford University"
                  className="w-full bg-[#181f1a] border border-emerald-900/60 focus:border-emerald-500 rounded-2xl px-3.5 py-2.5 text-sm text-white font-medium focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-300">College Email Address</label>
              <input
                type="email"
                value={collegeEmail}
                onChange={(e) => setCollegeEmail(e.target.value)}
                placeholder="e.g. arjun@university.edu"
                className="w-full bg-[#181f1a] border border-emerald-900/60 focus:border-emerald-500 rounded-2xl px-3.5 py-2.5 text-sm text-white font-medium focus:outline-none"
              />
            </div>

            {/* Age & Gender Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-300">Age</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  min={16}
                  max={35}
                  className="w-full bg-[#181f1a] border border-emerald-900/60 focus:border-emerald-500 rounded-2xl px-3.5 py-2 text-sm text-white font-bold text-center focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-300">Gender (Optional)</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full bg-[#181f1a] border border-emerald-900/60 focus:border-emerald-500 rounded-2xl px-2 py-2 text-xs text-white font-bold focus:outline-none cursor-pointer"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="non-binary">Non-Binary</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-300">Height (cm)</label>
                <input
                  type="number"
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  min={120}
                  max={230}
                  className="w-full bg-[#181f1a] border border-emerald-900/60 focus:border-emerald-500 rounded-2xl px-3.5 py-2 text-sm text-white font-bold text-center focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-300">Weight (kg)</label>
                <input
                  type="number"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  min={35}
                  max={180}
                  className="w-full bg-[#181f1a] border border-emerald-900/60 focus:border-emerald-500 rounded-2xl px-3.5 py-2 text-sm text-white font-bold text-center focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="py-3 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-[0_0_20px_rgba(16,185,129,0.3)]"
              >
                <span>Continue</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Fitness Level, Goal, Time Budget */}
        {step === 2 && (
          <div className="space-y-4">
            {/* Fitness Level */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                <Activity size={13} className="text-emerald-400" />
                <span>Current Fitness Level</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { level: 'Beginner', desc: 'New to exercise or getting back into it' },
                  { level: 'Intermediate', desc: 'Workout 2–3x/week consistently' },
                  { level: 'Advanced', desc: 'Collegiate athlete or seasoned lifter' },
                ].map((item) => (
                  <button
                    key={item.level}
                    type="button"
                    onClick={() => setFitnessLevel(item.level as any)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      fitnessLevel === item.level
                        ? 'bg-emerald-500/20 border-emerald-500 text-white shadow-sm'
                        : 'bg-[#151b17] border-white/5 text-gray-400 hover:text-white'
                    }`}
                  >
                    <div className="text-xs font-black text-emerald-400">{item.level}</div>
                    <div className="text-[10px] text-gray-300 mt-1 line-clamp-2">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Daily Available Time (Prompt Requirement) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Clock size={13} className="text-emerald-400" />
                  <span>Daily Available Time</span>
                </span>
                <span className="text-emerald-400 font-mono font-bold text-xs">{dailyAvailableMinutes} min/day</span>
              </label>
              <div className="grid grid-cols-6 gap-1.5">
                {[5, 10, 15, 20, 30, 45].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setDailyAvailableMinutes(mins)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      dailyAvailableMinutes === mins
                        ? 'bg-emerald-500 text-black font-black shadow-[0_0_10px_#10B981]'
                        : 'bg-white/5 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-gray-500 italic">
                “Don't force students to change their entire lifestyle. Fit fitness into your existing student schedule.”
              </p>
            </div>

            {/* Primary Goal */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                <Target size={13} className="text-emerald-400" />
                <span>Primary Student Goal</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                {goalsList.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setFitnessGoal(g.id)}
                    className={`p-2.5 rounded-2xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                      fitnessGoal === g.id
                        ? 'bg-emerald-500/20 border-emerald-500 text-white'
                        : 'bg-[#151b17] border-white/5 text-gray-400 hover:text-white'
                    }`}
                  >
                    <span className="text-base">{g.icon}</span>
                    <div>
                      <div className="text-xs font-bold text-white">{g.title}</div>
                      <div className="text-[10px] text-gray-400 leading-snug">{g.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="py-3 px-5 rounded-2xl bg-white/5 text-gray-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="py-3 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-[0_0_20px_rgba(16,185,129,0.3)]"
              >
                <span>Continue</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Preferred workout & Typical activity */}
        {step === 3 && (
          <div className="space-y-4">
            {/* Preferred Workout Style */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                <Dumbbell size={13} className="text-emerald-400" />
                <span>Preferred Workout Environment / Type</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { id: 'Dorm Quick Circuit', title: 'Hostel / Dorm Quick Circuit', desc: 'Zero equipment in small bedroom spaces' },
                  { id: 'Bodyweight', title: 'Bodyweight & Calisthenics', desc: 'Push-ups, squats, lunges & core' },
                  { id: 'HIIT & Cardio', title: 'HIIT & Campus Cardio', desc: 'Short explosive metabolic bursts' },
                  { id: 'Mobility & Stretch', title: 'Desk Relief & Mobility', desc: 'Gentle spinal decompression & breathing' },
                  { id: 'Strength & Weights', title: 'Campus Gym / Dumbbells', desc: 'Access to university recreation center' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPreferredWorkoutType(item.id as any)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      preferredWorkoutType === item.id
                        ? 'bg-emerald-500/20 border-emerald-500 text-white'
                        : 'bg-[#151b17] border-white/5 text-gray-400 hover:text-white'
                    }`}
                  >
                    <div className="text-xs font-bold text-emerald-400">{item.title}</div>
                    <div className="text-[10px] text-gray-400 mt-0.5">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Typical Activity Level */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-300">Typical Daily Student Routine</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'Sedentary', title: 'Study Desk Heavy', desc: '6+ hrs sitting in lectures and library' },
                  { id: 'Lightly Active', title: 'Light Commuter', desc: 'Some walking between campus buildings' },
                  { id: 'Moderately Active', title: 'Active Walker', desc: 'Frequent campus steps and bike rides' },
                  { id: 'Very Active', title: 'Collegiate Athlete', desc: 'Daily sports or varsity conditioning' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTypicalActivityLevel(item.id as any)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      typicalActivityLevel === item.id
                        ? 'bg-emerald-500/20 border-emerald-500 text-white'
                        : 'bg-[#151b17] border-white/5 text-gray-400 hover:text-white'
                    }`}
                  >
                    <div className="text-xs font-bold text-white">{item.title}</div>
                    <div className="text-[10px] text-gray-400 mt-0.5">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Summary Nudge */}
            <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-3">
              <ShieldCheck size={20} className="text-emerald-400 shrink-0" />
              <p className="text-xs text-emerald-200 leading-snug">
                Your daily goal will be calibrated to <strong>{dailyAvailableMinutes} minutes/day</strong> with adaptive difficulty learning from your consistency.
              </p>
            </div>

            <div className="pt-2 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="py-3 px-5 rounded-2xl bg-white/5 text-gray-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={handleFinish}
                className="py-3.5 px-8 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black font-black text-xs uppercase tracking-widest shadow-[0_0_25px_rgba(16,185,129,0.4)] hover:opacity-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Launch VYLO Dashboard</span>
                <Sparkles size={15} />
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
