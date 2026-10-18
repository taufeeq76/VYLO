export type BodyShape = 'ectomorph' | 'mesomorph' | 'endomorph' | 'not_sure';

export type PrimaryGoal = 
  | 'gain_muscle_posture' 
  | 'lose_weight_fat' 
  | 'general_fitness_active';

export type PreferredTime = 'morning' | 'afternoon' | 'evening' | 'late_night';

export type EquipmentCategory = 
  | 'bodyweight'
  | 'home_basics'
  | 'free_weights'
  | 'machines'
  | 'bodyweight_tools'
  | 'sports_gear'
  | 'gym_access';

export interface EquipmentItem {
  id: string;
  name: string;
  category: EquipmentCategory;
  categoryLabel: string;
}

export interface UserHealthProfile {
  weightKg: number;
  weightUnit: 'kg' | 'lb';
  heightCm: number;
  heightUnit: 'cm' | 'ft-in';
  bodyShape: BodyShape;
  primaryGoal: PrimaryGoal;
  dailyWorkoutMinutes: number;
  preferredTime: PreferredTime;
  routine: {
    classWorkHours: string;
    commuteTime: string;
    sleepSchedule: string;
  };
  ownedEquipment: string[]; // IDs or custom strings
  customEquipment: string[];
}

export interface MacroBreakdown {
  calories: number;
  protein: number; // in grams
  carbs: number; // in grams
  fats: number; // in grams
}

export interface MealItem {
  id: string;
  type: 'breakfast' | 'lunch' | 'snack' | 'dinner';
  title: string;
  description: string;
  macros: MacroBreakdown;
  recommendedTime: string;
  tags: string[];
}

export interface MonthlyDietPlan {
  month: string;
  bmr: number;
  tdee: number;
  targetDailyCalories: number;
  targetMacros: MacroBreakdown;
  updateNotice: {
    title: string;
    reason: string;
    highlights: string[];
  };
  meals: MealItem[];
  adherencePercentage: number;
}

export interface ScannedMealResult {
  imageUrl?: string;
  foodName: string;
  estimatedWeightGrams: number;
  macros: MacroBreakdown;
  fiber?: number;
  sodiumMg?: number;
  identifiedItems?: string[];
  confidence: number;
  healthTip?: string;
  goalVerdict?: string;
  goalExplanation?: string;
  suggestion?: string;
  disclaimer?: string;
  isFallback?: boolean;
}

export interface ActiveWorkoutSession {
  workoutId: string;
  workoutTitle: string;
  exerciseIndex: number;
  currentSet: number;
  totalSets: number;
  repsTarget: string;
  currentWeightKg: number;
  elapsedSeconds: number;
  isResting: boolean;
  restSecondsRemaining: number;
}

export type MascotMoodState = 'happy' | 'motivating' | 'tired' | 'encouraging' | 'competitive';

export interface DailyQuest {
  id: string;
  title: string;
  description: string;
  category: 'workout' | 'nutrition' | 'activity' | 'ai_checkin' | 'hydration';
  xpReward: number;
  completed: boolean;
  progress?: { current: number; target: number; unit: string };
}

export type HunterRank = 'E' | 'D' | 'C' | 'B' | 'A' | 'S';

export interface StoreProduct {
  id: string;
  name: string;
  category: 'nutrition' | 'equipment' | 'apparel' | 'recovery';
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  retailerName: string;
  isVerifiedRetailer: boolean;
  image: string;
  description: string;
  specs: string[];
  recommendedForGoal?: PrimaryGoal[];
  equipmentIdMatch?: string; // links with onboarding equipment
}

export interface UserAuthSession {
  userId: string;
  countryCode: string;
  isLoggedIn: boolean;
  loginTimestamp?: string;
  savedAddress?: string;
}

export interface UserFeedbackItem {
  id: string;
  userId: string;
  category: 'workout' | 'diet' | 'store' | 'map' | 'ai_zyro' | 'general';
  rating: number;
  comment: string;
  submittedAt: string;
  status: 'received' | 'under_review' | 'implemented';
}

export type ZyroAiMode = 'general' | 'research' | 'study' | 'coding' | 'math' | 'creative';
export type ZyroStudyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface ZyroAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  base64?: string;
  content?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'zyro_ai' | 'vylo_ai';
  text: string;
  timestamp: string;
  mode?: ZyroAiMode;
  attachments?: ZyroAttachment[];
  usedWebSearch?: boolean;
  searchSources?: Array<{ title: string; url: string }>;
  searchQueries?: string[];
  generatedImageUrl?: string;
  calculationResult?: { expression: string; result: number | string };
  suggestedAction?: { label: string; action: string };
  categoryTag?: string;
  isError?: boolean;
}

export interface ZyroConversation {
  id: string;
  title: string;
  mode: ZyroAiMode;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
}

export interface ZyroUserPreferences {
  customInstructions: string;
  tone: 'natural' | 'concise' | 'detailed' | 'academic' | 'casual';
  studyLevel: ZyroStudyLevel;
  outputLanguage: string;
  enableSearchGrounding: boolean;
}

export type NotificationTone = 'missed_app' | 'no_tasks' | 'task_started' | 'task_completed' | 'multi_completed';

export interface MotivationalNotification {
  id: string;
  emoji: string;
  title: string;
  message: string;
  tone: NotificationTone;
  timestamp: string;
  questId?: string;
  actionLabel?: string;
}

export type AppTab = 'home' | 'explore' | 'workouts' | 'squad' | 'profile' | 'diet' | 'campus' | 'store' | 'progress';

export interface CollegeStudentProfile {
  name: string;
  collegeEmail: string;
  collegeName: string;
  age: number;
  gender?: 'female' | 'male' | 'non-binary' | 'prefer-not-to-say';
  heightCm: number;
  weightKg: number;
  fitnessLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  fitnessGoal: 'General fitness' | 'Weight management' | 'Strength' | 'Endurance' | 'Flexibility' | 'Daily activity' | 'Healthy lifestyle';
  dailyAvailableMinutes: number; // 5, 10, 15, 20, 30, 45+
  preferredWorkoutType: 'Bodyweight' | 'HIIT & Cardio' | 'Dorm Quick Circuit' | 'Mobility & Stretch' | 'Strength & Weights';
  typicalActivityLevel: 'Sedentary' | 'Lightly Active' | 'Moderately Active' | 'Very Active';
}

export interface FitScoreFactor {
  name: string;
  category: 'activity' | 'workout' | 'hydration' | 'sleep' | 'consistency';
  status: boolean;
  value: string;
  target: string;
  pointsContribution: number;
  tip: string;
}

export interface FitScoreModel {
  score: number; // 0 - 100
  factors: FitScoreFactor[];
  summaryVerdict: string;
  personalizedImprovementPlan: string[];
}

export interface MoodToMoveInput {
  energy: 'Low' | 'Medium' | 'High';
  mood: 'Stressed' | 'Tired' | 'Neutral' | 'Energetic' | 'Anxious' | 'Motivated';
  stressLevel: 'Low' | 'Medium' | 'High';
  availableMinutes: number;
}

export interface MoodToMoveRecommendation {
  activityTitle: string;
  durationMinutes: number;
  intensity: 'Gentle' | 'Moderate' | 'Vigorous';
  whySelected: string;
  targetFocus: string;
  studentContextNote: string;
  exercises: { name: string; durationOrReps: string; guidance: string }[];
}

export interface CampusWalkingRoute {
  id: string;
  name: string;
  fromLocation: string;
  toLocation: string;
  distanceMiles: number;
  estimatedWalkingMinutes: number;
  estimatedSteps: number;
  caloriesEstimate: number;
  scenicHighlights: string[];
  category: 'Class Commute' | 'Scenic Greenway' | 'Stair Climber' | 'Night Safety Trail';
}

export interface SquadMember {
  id: string;
  name: string;
  stepsToday: number;
  streakDays: number;
  rank: HunterRank;
  isCurrentUser?: boolean;
}

export interface SquadData {
  id: string;
  name: string;
  code: string;
  motto: string;
  collegeName: string;
  memberCount: number;
  collectiveSteps: number;
  goalSteps: number;
  rank: number;
  activeChallenge: string;
  members: SquadMember[];
  recentCheers: { sender: string; cheer: string; timestamp: string }[];
}

export interface AntiCheatRecord {
  isFlagged: boolean;
  status: 'verified' | 'flagged_review' | 'clean';
  flagReason?: string;
  confidenceScore: number;
  velocityStepsPerMin: number;
  lastChecked: string;
}

export interface SmartReminderSetting {
  id: string;
  title: string;
  type: 'workout' | 'water' | 'movement' | 'sleep' | 'daily_goal' | 'streak';
  time: string;
  enabled: boolean;
  description: string;
}

export type SupportedLanguage = 'en' | 'es' | 'hi' | 'fr' | 'de' | 'pt' | 'ja' | 'zh' | string;

export interface StoreCartItem {
  cartItemId?: string;
  productId: string;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  selectedFlavor?: string;
}

export interface StoreShippingAddress {
  fullName: string;
  phone: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export type StoreOrderStatus = 'Order Placed' | 'Packed' | 'Shipped' | 'Out for Delivery' | 'Delivered';

export interface StoreOrder {
  orderId: string;
  date: string;
  items: {
    productId: string;
    productName: string;
    productImage: string;
    category: string;
    priceUSD: number;
    quantity: number;
    selectedSize?: string;
    selectedColor?: string;
    selectedFlavor?: string;
  }[];
  subtotalUSD: number;
  discountUSD: number;
  deliveryUSD: number;
  totalUSD: number;
  couponCode?: string;
  shippingAddress: StoreShippingAddress;
  paymentMethod: string;
  status: StoreOrderStatus;
  estimatedDelivery: string;
  trackingCode: string;
}

