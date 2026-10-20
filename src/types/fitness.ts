export type UnitSystem = 'metric' | 'imperial';

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'very_active' | 'athlete';

export type FitnessGoal = 'fat_loss' | 'lean_muscle' | 'maintenance' | 'endurance' | 'aggressive_cut';

export type Gender = 'male' | 'female';

export interface UserProfile {
  name: string;
  age: number;
  gender: Gender;
  heightCm: number; // Stored in metric, converted in UI
  weightKg: number; // Stored in metric, converted in UI
  unitSystem: UnitSystem;
  activityLevel: ActivityLevel;
  goal: FitnessGoal;
  targetWeightKg?: number;
  waterGlassesDrunk: number;
  lastUpdated: string;
}

export type BMICategory = 
  | 'severe_underweight' 
  | 'underweight' 
  | 'normal' 
  | 'overweight' 
  | 'obese_1' 
  | 'obese_2' 
  | 'obese_3';

export interface MacroTarget {
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatsGrams: number;
  fiberGrams: number;
}

export interface BMIAssessment {
  bmi: number;
  category: BMICategory;
  categoryLabel: string;
  categoryColor: string;
  healthyWeightMinKg: number;
  healthyWeightMaxKg: number;
  weightDifferenceKg: number; // positive = excess, negative = deficit to normal min
  estimatedBodyFat: number; // percentage
  bmr: number; // kcal
  tdee: number; // kcal
  targetMacros: MacroTarget;
  dailyWaterMl: number;
  recommendations: string[];
}

export interface ExerciseSetLog {
  setNumber: number;
  reps: number;
  weightKg: number;
  completed: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  targetMuscles: string[];
  secondaryMuscles: string[];
  equipment: string;
  mechanics: 'Compound' | 'Isolation' | 'Isometric' | 'Cardio';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  defaultSets: number;
  defaultReps: string; // e.g. "8-12" or "45s"
  restSeconds: number;
  formCues: string[];
  breathingTip: string;
  commonMistakes: string[];
  svgIcon: string; // identifier for visual icon/diagram
}

export interface WorkoutRoutine {
  id: string;
  title: string;
  tagline: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  durationMin: number;
  frequencyPerWeek: number;
  estimatedCaloriesBurn: number;
  focusAreas: string[];
  equipmentNeeded: string[];
  exercises: Exercise[];
}

export interface RecipeIngredient {
  name: string;
  amount: string;
  category: 'protein' | 'produce' | 'grains' | 'dairy' | 'healthy_fats' | 'pantry';
}

export interface MealItem {
  id: string;
  name: string;
  mealType: 'breakfast' | 'lunch' | 'snack' | 'dinner';
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  prepTimeMin: number;
  ingredients: RecipeIngredient[];
  cookingSteps: string[];
  chefTip: string;
}

export interface MealPlan {
  id: string;
  title: string;
  goalType: FitnessGoal;
  dietStyle: 'High-Protein' | 'Balanced Whole Foods' | 'Plant-Powered' | 'Keto / Low-Carb' | 'Calorie Shred';
  summary: string;
  targetDailyCalories: number;
  macroRatio: {
    proteinPct: number;
    carbsPct: number;
    fatsPct: number;
  };
  meals: MealItem[];
  hydrationTarget: string;
  keyNutritionPrinciples: string[];
}

export interface WorkoutSessionLog {
  id: string;
  routineId: string;
  routineTitle: string;
  startTime: string;
  durationSeconds: number;
  caloriesBurned: number;
  totalVolumeKg: number;
  setsCompleted: number;
  notes?: string;
}

export interface BodyWeightLog {
  id: string;
  date: string;
  weightKg: number;
  bmi: number;
}
