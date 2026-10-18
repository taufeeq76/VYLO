import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MapPin,
  Footprints,
  Compass,
  Clock,
  Flame,
  Play,
  Square,
  ShieldCheck,
  Bell,
  Lock,
  Download,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Sparkles,
  Sliders,
  Eye,
  Activity
} from 'lucide-react';
import { CAMPUS_WALKING_ROUTES, DEFAULT_SMART_REMINDERS } from '../data/mockData';
import { CampusWalkingRoute, SmartReminderSetting } from '../types';

interface ExploreViewProps {
  onAddSteps?: (steps: number) => void;
  onShowInAppNotification?: (title: string, message: string) => void;
}

export const ExploreView: React.FC<ExploreViewProps> = ({
  onAddSteps,
  onShowInAppNotification,
}) => {
  const [activeTab, setActiveTab] = useState<'map' | 'reminders' | 'anticheat' | 'privacy'>('map');

  // Walking mode state
  const [activeRoute, setActiveRoute] = useState<CampusWalkingRoute | null>(null);
  const [isWalking, setIsWalking] = useState(false);
  const [walkSeconds, setWalkSeconds] = useState(0);
  const [liveStepsWalked, setLiveStepsWalked] = useState(0);

  // Reminders state
  const [reminders, setReminders] = useState<SmartReminderSetting[]>(DEFAULT_SMART_REMINDERS);

  // Privacy toggles
  const [cameraConsent, setCameraConsent] = useState(true);
  const [sensorConsent, setSensorConsent] = useState(true);
  const [locationConsent, setLocationConsent] = useState(true);
  const [privacySuccessMsg, setPrivacySuccessMsg] = useState('');

  // Anti-cheat mock state
  const [antiCheatStatus, setAntiCheatStatus] = useState<'clean' | 'flagged' | 'appealed'>('clean');
  const [showAppealModal, setShowAppealModal] = useState(false);
  const [appealReason, setAppealReason] = useState('');

  // Live walking timer
  useEffect(() => {
    let interval: any = null;
    if (isWalking) {
      interval = setInterval(() => {
        setWalkSeconds((prev) => prev + 1);
        setLiveStepsWalked((prev) => {
          const next = prev + 2; // ~120 steps/min cadence
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isWalking]);

  const handleStartRoute = (route: CampusWalkingRoute) => {
    setActiveRoute(route);
    setIsWalking(true);
    setWalkSeconds(0);
    setLiveStepsWalked(0);
  };

  const handleFinishRoute = () => {
    setIsWalking(false);
    if (liveStepsWalked > 0 && onAddSteps) {
      onAddSteps(liveStepsWalked);
    }
    if (onShowInAppNotification) {
      onShowInAppNotification(
        'Campus Walk Completed! 👟',
        `Logged ${liveStepsWalked} steps on the ${activeRoute?.name || 'Campus Route'}. Added to your Fit Score & Squad total!`
      );
    }
  };

  const handleToggleReminder = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const handleTestReminderNotification = (reminder: SmartReminderSetting) => {
    if (onShowInAppNotification) {
      onShowInAppNotification(
        `VYLO Reminder: ${reminder.title}`,
        reminder.description
      );
    }
  };

  const handleExportData = () => {
    const backup = {
      app: 'VYLO Personal Intelligent Fitness OS',
      exportedAt: new Date().toISOString(),
      studentProfile: localStorage.getItem('vylo_student_profile') || 'Demo Profile (Arjun)',
      reminders,
      privacySettings: { cameraConsent, sensorConsent, locationConsent },
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vylo_student_data_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setPrivacySuccessMsg('Your personal data archive was exported successfully.');
    setTimeout(() => setPrivacySuccessMsg(''), 4000);
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-400 block">
            Collegiate Exploration
          </span>
          <h1 className="text-2xl sm:text-3xl font-black font-brand text-white tracking-tight">
            Explore & Campus Hub
          </h1>
        </div>

        {/* Sub Navigation Bar */}
        <div className="flex bg-[#131a15] p-1 rounded-2xl border border-white/5 text-xs font-bold gap-1 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('map')}
            className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'map' ? 'bg-emerald-500 text-black font-black' : 'text-gray-400 hover:text-white'
            }`}
          >
            Campus Walking Map
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('reminders')}
            className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'reminders' ? 'bg-emerald-500 text-black font-black' : 'text-gray-400 hover:text-white'
            }`}
          >
            Smart Reminders
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('anticheat')}
            className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'anticheat' ? 'bg-emerald-500 text-black font-black' : 'text-gray-400 hover:text-white'
            }`}
          >
            Anti-Cheat System
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('privacy')}
            className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'privacy' ? 'bg-emerald-500 text-black font-black' : 'text-gray-400 hover:text-white'
            }`}
          >
            Privacy & Consent
          </button>
        </div>
      </div>

      {/* TAB 1: CAMPUS WALKING MAP (Prompt Section 11) */}
      {activeTab === 'map' && (
        <div className="space-y-6">
          {/* Walking Tracker Overlay (when active) */}
          {isWalking && activeRoute && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-emerald-950 via-[#131d16] to-[#0d130f] border-2 border-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.3)] space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">
                    Live Campus Walking Session Active
                  </span>
                </div>
                <span className="font-mono text-emerald-300 text-sm font-bold">
                  {Math.floor(walkSeconds / 60)}:{(walkSeconds % 60).toString().padStart(2, '0')}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-2xl bg-black/40 border border-white/5">
                  <div className="text-[10px] text-gray-400 font-bold uppercase">Steps Counted</div>
                  <div className="text-2xl font-black font-mono text-white mt-0.5">
                    {liveStepsWalked.toLocaleString()}
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-black/40 border border-white/5">
                  <div className="text-[10px] text-gray-400 font-bold uppercase">Est. Calories</div>
                  <div className="text-2xl font-black font-mono text-amber-400 mt-0.5">
                    {Math.round(liveStepsWalked * 0.045)}
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-black/40 border border-white/5">
                  <div className="text-[10px] text-gray-400 font-bold uppercase">Distance</div>
                  <div className="text-2xl font-black font-mono text-teal-400 mt-0.5">
                    {(liveStepsWalked * 0.00045).toFixed(2)} mi
                  </div>
                </div>
              </div>

              <div className="text-xs text-gray-300">
                Tracking on route: <strong className="text-white">{activeRoute.name}</strong> ({activeRoute.fromLocation} → {activeRoute.toLocation})
              </div>

              <button
                type="button"
                onClick={handleFinishRoute}
                className="w-full py-3 rounded-2xl bg-rose-500 hover:bg-rose-400 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Square size={14} fill="currentColor" />
                <span>Complete Route & Add {liveStepsWalked} Steps to Daily Total</span>
              </button>
            </motion.div>
          )}

          {/* Campus Map Graphic Banner */}
          <div className="relative h-48 sm:h-56 rounded-3xl overflow-hidden border border-emerald-500/30 bg-[#0e1410] flex flex-col justify-end p-5">
            <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
            <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold">
              <MapPin size={13} />
              <span>Stanford University Campus Perimeter</span>
            </div>

            <div className="relative z-10 space-y-1">
              <h3 className="text-xl font-black font-brand text-white">
                Turn Campus Commutes Into Workouts
              </h3>
              <p className="text-xs text-gray-300 max-w-xl">
                Walking to lectures, dining halls, and libraries instead of taking shuttle buses easily satisfies your 6,000 daily steps goal.
              </p>
            </div>
          </div>

          {/* Walking Routes Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-wider">
              <span>Curated Student Walking Routes</span>
              <span>{CAMPUS_WALKING_ROUTES.length} Verified Paths</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {CAMPUS_WALKING_ROUTES.map((route) => (
                <div
                  key={route.id}
                  className="p-5 rounded-3xl bg-[#141b16] border border-emerald-500/20 hover:border-emerald-500/50 transition-all space-y-3 shadow-md"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-wider">
                        {route.category}
                      </span>
                      <h4 className="text-base font-bold text-white mt-1">{route.name}</h4>
                      <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                        <span>{route.fromLocation}</span>
                        <span>→</span>
                        <span className="text-gray-300">{route.toLocation}</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-sm font-black text-emerald-400 font-mono">
                        +{route.estimatedSteps}
                      </div>
                      <div className="text-[10px] text-gray-400 uppercase">Steps</div>
                    </div>
                  </div>

                  {/* Route specs */}
                  <div className="grid grid-cols-3 gap-2 py-2 px-3 rounded-2xl bg-black/30 text-center text-xs">
                    <div>
                      <span className="text-gray-400 block text-[10px]">Time</span>
                      <span className="font-bold text-white">{route.estimatedWalkingMinutes} mins</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px]">Distance</span>
                      <span className="font-bold text-white">{route.distanceMiles} mi</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px]">Burn</span>
                      <span className="font-bold text-amber-400">{route.caloriesEstimate} kcal</span>
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="flex flex-wrap gap-1.5">
                    {route.scenicHighlights.map((h, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded-lg bg-white/5 text-gray-300">
                        • {h}
                      </span>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleStartRoute(route)}
                    className="w-full py-2.5 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-black font-black text-xs uppercase tracking-wider border border-emerald-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Play size={13} fill="currentColor" />
                    <span>Start Walking This Route</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SMART REMINDERS (Prompt Section 16) */}
      {activeTab === 'reminders' && (
        <div className="space-y-4 max-w-2xl">
          <div className="p-4 rounded-2xl bg-[#141b16] border border-emerald-500/20 text-xs text-gray-300">
            Smart reminders fit your student lifestyle without spamming. Set gentle notifications for hydration between classes, post-study posture resets, and daily streak protection.
          </div>

          <div className="space-y-3">
            {reminders.map((rem) => (
              <div
                key={rem.id}
                className={`p-4 rounded-2xl border transition-all ${
                  rem.enabled ? 'bg-[#151d18] border-emerald-500/30' : 'bg-[#111412] border-white/5 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                      <Bell size={18} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white">{rem.title}</h4>
                        <span className="font-mono text-xs px-2 py-0.5 rounded-lg bg-black/40 text-emerald-400 font-bold">
                          {rem.time}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">{rem.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleTestReminderNotification(rem)}
                      className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-[11px] text-gray-300 font-bold transition-all cursor-pointer"
                      title="Test preview notification"
                    >
                      Test Alert
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleReminder(rem.id)}
                      className={`w-12 h-6 rounded-full p-0.5 transition-all cursor-pointer ${
                        rem.enabled ? 'bg-emerald-500' : 'bg-gray-700'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white transition-all ${
                          rem.enabled ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: ANTI-CHEAT INTEGRITY SYSTEM (Prompt Section 19) */}
      {activeTab === 'anticheat' && (
        <div className="space-y-6 max-w-2xl">
          <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-[#131d16] to-[#0e1410] border border-emerald-500/30 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <ShieldCheck size={22} />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 block">
                  Campus Integrity Engine
                </span>
                <h3 className="text-lg font-black font-brand text-white">
                  AI-Assisted Fair Play & Anti-Cheat
                </h3>
              </div>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">
              VYLO detects suspicious activity patterns (such as phone shaking or impossible step spikes exceeding 300 steps/minute). In keeping with our collegiate ethos,
              <strong> flagging is non-punitive</strong> and gives students a transparent review and appeal pathway.
            </p>

            {/* Current Status Badge */}
            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-gray-400 block uppercase font-bold">Account Integrity Status</span>
                <span className="text-sm font-black text-emerald-400 flex items-center gap-1.5 mt-0.5">
                  <CheckCircle2 size={16} />
                  <span>Verified Clean • Human Physiological Cadence</span>
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-gray-400 block uppercase font-bold">Current Velocity</span>
                <span className="text-xs font-mono font-bold text-white">96 steps / min</span>
              </div>
            </div>
          </div>

          {/* Transparent Appeal Demo */}
          <div className="p-5 rounded-3xl bg-[#141b16] border border-white/10 space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <AlertTriangle size={15} className="text-amber-400" />
              <span>Non-Punitive Review Protocol & Appeal Flow</span>
            </h4>
            <p className="text-xs text-gray-400">
              If phone tracking misinterprets sudden sprints, sports drills, or treadmill runs as a spike, you can instantly submit a 1-tap review to maintain your squad contributions and streak.
            </p>
            <button
              type="button"
              onClick={() => setShowAppealModal(true)}
              className="py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-gray-200 border border-white/10 transition-all cursor-pointer"
            >
              Simulate / Review Activity Appeal
            </button>
          </div>

          {/* Appeal Dialog */}
          {showAppealModal && (
            <div className="p-4 rounded-2xl bg-black/60 border border-emerald-500/40 space-y-3">
              <div className="text-xs font-bold text-emerald-300">Submit Activity Verification Explanation</div>
              <textarea
                value={appealReason}
                onChange={(e) => setAppealReason(e.target.value)}
                placeholder="e.g. Played a 40-min 5v5 soccer match at the campus turf rec center..."
                rows={3}
                className="w-full bg-[#171d18] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowAppealModal(false)}
                  className="py-1.5 px-3 rounded-lg bg-white/5 text-gray-300 text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAppealModal(false);
                    if (onShowInAppNotification) {
                      onShowInAppNotification('Appeal Approved', 'Your sports activity log was verified.');
                    }
                  }}
                  className="py-1.5 px-4 rounded-lg bg-emerald-500 text-black font-black text-xs cursor-pointer"
                >
                  Submit Appeal
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: PRIVACY & CONSENT (Prompt Section 18) */}
      {activeTab === 'privacy' && (
        <div className="space-y-6 max-w-2xl">
          <div className="p-5 rounded-3xl bg-[#141b16] border border-emerald-500/30 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Lock size={20} />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 block">
                  User Sovereignty
                </span>
                <h3 className="text-lg font-black font-brand text-white">
                  Privacy & Data Governance
                </h3>
              </div>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">
              VYLO adheres to a strict <strong>minimal data collection policy</strong>. Your biometric and motion tracking remains entirely on-device, and your data is never sold to advertisers.
            </p>
          </div>

          {privacySuccessMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500 text-emerald-300 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 size={16} />
              <span>{privacySuccessMsg}</span>
            </div>
          )}

          {/* Consent Toggles */}
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-[#151d18] border border-white/5 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">Camera AI Form Checking</div>
                <div className="text-[11px] text-gray-400">Processed locally in browser memory; no video saved.</div>
              </div>
              <button
                type="button"
                onClick={() => setCameraConsent(!cameraConsent)}
                className={`w-12 h-6 rounded-full p-0.5 transition-all cursor-pointer ${
                  cameraConsent ? 'bg-emerald-500' : 'bg-gray-700'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-all ${cameraConsent ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-[#151d18] border border-white/5 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">Motion & Accelerometer Sensors</div>
                <div className="text-[11px] text-gray-400">Counts steps and analyzes rep movement cadence.</div>
              </div>
              <button
                type="button"
                onClick={() => setSensorConsent(!sensorConsent)}
                className={`w-12 h-6 rounded-full p-0.5 transition-all cursor-pointer ${
                  sensorConsent ? 'bg-emerald-500' : 'bg-gray-700'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-all ${sensorConsent ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-[#151d18] border border-white/5 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">Campus Location Guidance</div>
                <div className="text-[11px] text-gray-400">Used strictly for walking route mapping during active walks.</div>
              </div>
              <button
                type="button"
                onClick={() => setLocationConsent(!locationConsent)}
                className={`w-12 h-6 rounded-full p-0.5 transition-all cursor-pointer ${
                  locationConsent ? 'bg-emerald-500' : 'bg-gray-700'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-all ${locationConsent ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>

          {/* Export & Reset Actions */}
          <div className="pt-2 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleExportData}
              className="py-3 px-5 rounded-2xl bg-white/5 hover:bg-white/10 text-xs font-bold text-gray-200 border border-white/10 flex items-center gap-2 cursor-pointer transition-all"
            >
              <Download size={14} />
              <span>Export My Data (JSON)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
