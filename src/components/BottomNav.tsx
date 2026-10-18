import React from 'react';
import { motion } from 'motion/react';
import {
  Home,
  Compass,
  Dumbbell,
  Users,
  User,
  MessageSquare,
  Sparkles,
  Utensils,
  ShoppingBag,
  TrendingUp
} from 'lucide-react';
import { AppTab } from '../types';

interface BottomNavProps {
  activeTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
  onOpenAskAi: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenAskAi,
}) => {
  // Primary 5 Navigation Tabs (Prompt Section 22)
  const primaryTabs = [
    { id: 'home' as AppTab, label: 'Home', icon: Home },
    { id: 'explore' as AppTab, label: 'Explore', icon: Compass },
    { id: 'workouts' as AppTab, label: 'Workout', icon: Dumbbell },
    { id: 'squad' as AppTab, label: 'Squad', icon: Users },
    { id: 'profile' as AppTab, label: 'Profile', icon: User },
  ];

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 px-2 sm:px-6 pb-3 pt-1 pointer-events-none">
      <div className="max-w-xl mx-auto flex items-center justify-between gap-2.5 pointer-events-auto">
        {/* Main Dock Container */}
        <div className="flex-1 bg-[#0e1410]/95 backdrop-blur-2xl border border-emerald-500/30 rounded-2xl sm:rounded-3xl p-1.5 shadow-[0_10px_35px_rgba(0,0,0,0.9)] flex items-center justify-around">
          {primaryTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onSelectTab(tab.id)}
                className={`relative py-1.5 px-3 sm:px-4 rounded-xl flex flex-col items-center gap-0.5 transition-all cursor-pointer ${
                  isActive
                    ? 'text-emerald-400 font-black scale-105'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabGlow"
                    className="absolute inset-0 bg-emerald-500/15 border border-emerald-500/40 rounded-xl"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
                <div className="relative">
                  <Icon size={18} className={isActive ? 'text-emerald-400 drop-shadow-[0_0_8px_#10B981]' : ''} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-tight whitespace-nowrap">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Floating Ask VYLO AI Button */}
        <button
          type="button"
          onClick={onOpenAskAi}
          title="Ask VYLO AI Student Fitness Scientist"
          className="relative shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-black flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.5)] hover:scale-105 active:scale-95 transition-all cursor-pointer group"
        >
          <motion.div
            animate={{ rotate: [0, 8, -8, 0] }}
            transition={{ repeat: Infinity, duration: 4, repeatDelay: 2 }}
          >
            <MessageSquare size={19} className="fill-black" />
          </motion.div>
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400 border border-black"></span>
          </span>
        </button>
      </div>
    </div>
  );
};
