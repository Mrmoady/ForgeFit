import { 
  UserProfile, 
  BMIAssessment, 
  BMICategory, 
  MacroTarget, 
  FitnessGoal 
} from '../types/fitness';

export const METRIC_TO_LBS = 2.20462;
export const CM_TO_INCHES = 0.393701;

export function cmToFeetInches(cm: number): { feet: number; inches: number } {
  const totalInches = Math.round(cm * CM_TO_INCHES);
  const feet = Math.floor(totalInches / 12);
  const inches = totalInches % 12;
  return { feet, inches };
}

export function feetInchesToCm(feet: number, inches: number): number {
  return Math.round(((feet * 12) + inches) * 2.54);
}

export function kgToLbs(kg: number): number {
  return Math.round(kg * METRIC_TO_LBS * 10) / 10;
}

export function lbsToKg(lbs: number): number {
  return Math.round((lbs / METRIC_TO_LBS) * 10) / 10;
}

export function calculateBMI(heightCm: number, weightKg: number): number {
  if (heightCm <= 0 || weightKg <= 0) return 0;
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  return Math.round(bmi * 10) / 10;
}

export function getBMICategory(bmi: number): { category: BMICategory; label: string; color: string } {
  if (bmi < 16) {
    return { category: 'severe_underweight', label: 'Severe Underweight', color: 'text-amber-400' };
  }
  if (bmi < 18.5) {
    return { category: 'underweight', label: 'Underweight', color: 'text-amber-400' };
  }
  if (bmi < 25) {
    return { category: 'normal', label: 'Normal Weight (Optimal)', color: 'text-emerald-400' };
  }
  if (bmi < 30) {
    return { category: 'overweight', label: 'Overweight', color: 'text-amber-400' };
  }
  if (bmi < 35) {
    return { category: 'obese_1', label: 'Obesity Class I', color: 'text-rose-400' };
  }
  if (bmi < 40) {
    return { category: 'obese_2', label: 'Obesity Class II', color: 'text-rose-500' };
  }
  return { category: 'obese_3', label: 'Obesity Class III', color: 'text-red-600' };
}

export function calculateBMR(gender: 'male' | 'female', weightKg: number, heightCm: number, age: number): number {
  // Mifflin-St Jeor Equation
  if (gender === 'male') {
    return Math.round(10 * weightKg + 6.25 * heightCm - 5 * age + 5);
  }
  return Math.round(10 * weightKg + 6.25 * heightCm - 5 * age - 161);
}

export function calculateTDEE(bmr: number, activityLevel: UserProfile['activityLevel']): number {
  const multipliers: Record<UserProfile['activityLevel'], number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    very_active: 1.725,
    athlete: 1.9,
  };
  return Math.round(bmr * multipliers[activityLevel]);
}

export function calculateEstimatedBodyFat(bmi: number, age: number, gender: 'male' | 'female'): number {
  // Deurenberg formula
  const genderFactor = gender === 'male' ? 1 : 0;
  const bf = 1.20 * bmi + 0.23 * age - 10.8 * genderFactor - 5.4;
  return Math.max(4, Math.min(65, Math.round(bf * 10) / 10));
}

export function calculateMacros(targetCalories: number, goal: FitnessGoal, weightKg: number): MacroTarget {
  let proteinRatio = 0.30;
  let carbsRatio = 0.45;
  let fatsRatio = 0.25;

  if (goal === 'lean_muscle') {
    proteinRatio = 0.32;
    carbsRatio = 0.48;
    fatsRatio = 0.20;
  } else if (goal === 'fat_loss') {
    proteinRatio = 0.38;
    carbsRatio = 0.35;
    fatsRatio = 0.27;
  } else if (goal === 'aggressive_cut') {
    proteinRatio = 0.42;
    carbsRatio = 0.30;
    fatsRatio = 0.28;
  } else if (goal === 'endurance') {
    proteinRatio = 0.25;
    carbsRatio = 0.55;
    fatsRatio = 0.20;
  }

  const proteinCals = targetCalories * proteinRatio;
  const carbsCals = targetCalories * carbsRatio;
  const fatsCals = targetCalories * fatsRatio;

  const proteinGrams = Math.round(proteinCals / 4);
  const carbsGrams = Math.round(carbsCals / 4);
  const fatsGrams = Math.round(fatsCals / 9);
  const fiberGrams = Math.round((targetCalories / 1000) * 14);

  return {
    calories: targetCalories,
    proteinGrams,
    carbsGrams,
    fatsGrams,
    fiberGrams,
  };
}

export function assessBMIAndMetabolism(profile: UserProfile): BMIAssessment {
  const { heightCm, weightKg, age, gender, activityLevel, goal } = profile;
  const bmi = calculateBMI(heightCm, weightKg);
  const { category, label, color } = getBMICategory(bmi);

  const heightM = heightCm / 100;
  const healthyWeightMinKg = Math.round(18.5 * (heightM * heightM) * 10) / 10;
  const healthyWeightMaxKg = Math.round(24.9 * (heightM * heightM) * 10) / 10;

  let weightDifferenceKg = 0;
  if (weightKg < healthyWeightMinKg) {
    weightDifferenceKg = Math.round((weightKg - healthyWeightMinKg) * 10) / 10; // negative
  } else if (weightKg > healthyWeightMaxKg) {
    weightDifferenceKg = Math.round((weightKg - healthyWeightMaxKg) * 10) / 10; // positive
  }

  const bmr = calculateBMR(gender, weightKg, heightCm, age);
  const tdee = calculateTDEE(bmr, activityLevel);
  const estimatedBodyFat = calculateEstimatedBodyFat(bmi, age, gender);

  let targetCalories = tdee;
  if (goal === 'fat_loss') {
    targetCalories = Math.max(1200, tdee - 500);
  } else if (goal === 'aggressive_cut') {
    targetCalories = Math.max(1200, tdee - 750);
  } else if (goal === 'lean_muscle') {
    targetCalories = tdee + 350;
  } else if (goal === 'endurance') {
    targetCalories = tdee + 150;
  }

  const targetMacros = calculateMacros(targetCalories, goal, weightKg);

  // Daily water recommendation in ml
  const baseWater = weightKg * 35;
  const activitySurplus = activityLevel === 'sedentary' ? 0 : activityLevel === 'light' ? 350 : 700;
  const dailyWaterMl = Math.round((baseWater + activitySurplus) / 100) * 100;

  const recommendations: string[] = [];

  if (category === 'underweight' || category === 'severe_underweight') {
    recommendations.push('Prioritize a slight caloric surplus (+300 to +500 kcal/day) with nutrient-dense meals.');
    recommendations.push('Emphasize compound progressive resistance training (3x/week) to build lean muscle mass.');
    recommendations.push('Include high-density energy foods like nuts, avocados, oats, and quality animal/plant protein.');
  } else if (category === 'normal') {
    recommendations.push('Your BMI is in the optimal healthy bracket. Focus on body recomposition or athletic performance.');
    recommendations.push('Maintain a balanced macro distribution with 1.6–2.0g of protein per kg of body weight.');
    recommendations.push('Follow a structured full body split 3 to 4 days weekly to optimize functional strength and mobility.');
  } else if (category === 'overweight') {
    recommendations.push('A moderate deficit of 400–500 kcal/day will promote steady 0.5kg/week fat reduction while retaining muscle.');
    recommendations.push('Combine full-body compound workouts with 8,000–10,000 daily steps for sustainable caloric expenditure.');
    recommendations.push('Prioritize high satiety foods: lean proteins (chicken, fish, tofu) and fibrous greens.');
  } else {
    recommendations.push('Focus on sustainable, gradual fat loss with metabolic full-body circuits and joint-friendly movements.');
    recommendations.push('Target high-protein intake (at least 30-35% of total intake) to preserve lean tissue and curb hunger.');
    recommendations.push('Track hydration consistently: aim for at least 2.5–3.2L of water daily to support metabolic function.');
  }

  return {
    bmi,
    category,
    categoryLabel: label,
    categoryColor: color,
    healthyWeightMinKg,
    healthyWeightMaxKg,
    weightDifferenceKg,
    estimatedBodyFat,
    bmr,
    tdee,
    targetMacros,
    dailyWaterMl,
    recommendations,
  };
}
