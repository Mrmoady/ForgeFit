import React, { useState } from 'react';
import { 
  UserProfile, 
  BMIAssessment, 
  UnitSystem, 
  ActivityLevel, 
  FitnessGoal, 
  Gender 
} from '../types/fitness';
import { 
  cmToFeetInches, 
  feetInchesToCm, 
  kgToLbs, 
  lbsToKg 
} from '../utils/calculations';
import { 
  Activity, 
  Flame, 
  Droplet, 
  Check, 
  HeartPulse, 
  Scale, 
  TrendingDown, 
  TrendingUp, 
  Target,
  Sparkles
} from 'lucide-react';

interface BMICalculatorProps {
  profile: UserProfile;
  assessment: BMIAssessment;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onLogWeight: (weightKg: number) => void;
  onNavigateToWorkouts?: () => void;
  onNavigateToMeals?: () => void;
}

export const BMICalculator: React.FC<BMICalculatorProps> = ({
  profile,
  assessment,
  onUpdateProfile,
  onLogWeight,
  onNavigateToWorkouts,
  onNavigateToMeals,
}) => {
  const [syncedSuccess, setSyncedSuccess] = useState(false);
  const [weightLoggedSuccess, setWeightLoggedSuccess] = useState(false);

  // Local imperial states for smooth inputs
  const feetInches = cmToFeetInches(profile.heightCm);
  const [feet, setFeet] = useState(feetInches.feet);
  const [inches, setInches] = useState(feetInches.inches);

  const displayWeight = profile.unitSystem === 'metric' 
    ? profile.weightKg 
    : kgToLbs(profile.weightKg);

  const displayTargetWeight = profile.targetWeightKg 
    ? (profile.unitSystem === 'metric' ? profile.targetWeightKg : kgToLbs(profile.targetWeightKg))
    : '';

  const handleUnitToggle = (newUnit: UnitSystem) => {
    onUpdateProfile({ unitSystem: newUnit });
  };

  const handleHeightCmChange = (cm: number) => {
    onUpdateProfile({ heightCm: Math.max(120, Math.min(230, cm)) });
    const converted = cmToFeetInches(cm);
    setFeet(converted.feet);
    setInches(converted.inches);
  };

  const handleFeetInchesChange = (newFeet: number, newInches: number) => {
    setFeet(newFeet);
    setInches(newInches);
    const cm = feetInchesToCm(newFeet, newInches);
    onUpdateProfile({ heightCm: cm });
  };

  const handleWeightChange = (val: number) => {
    if (profile.unitSystem === 'metric') {
      onUpdateProfile({ weightKg: Math.max(30, Math.min(250, val)) });
    } else {
      onUpdateProfile({ weightKg: lbsToKg(Math.max(66, Math.min(550, val))) });
    }
  };

  const handleTargetWeightChange = (val: number) => {
    if (!val || isNaN(val)) {
      onUpdateProfile({ targetWeightKg: undefined });
      return;
    }
    if (profile.unitSystem === 'metric') {
      onUpdateProfile({ targetWeightKg: Math.max(30, Math.min(250, val)) });
    } else {
      onUpdateProfile({ targetWeightKg: lbsToKg(val) });
    }
  };

  const handleSyncToPlan = () => {
    setSyncedSuccess(true);
    setTimeout(() => setSyncedSuccess(false), 3000);
  };

  const handleQuickLogWeight = () => {
    onLogWeight(profile.weightKg);
    setWeightLoggedSuccess(true);
    setTimeout(() => setWeightLoggedSuccess(false), 3000);
  };

  // BMI indicator position on meter (range 14 to 42 mapped to 0% to 100%)
  const clampedBMI = Math.max(14, Math.min(40, assessment.bmi));
  const meterPercent = ((clampedBMI - 14) / (40 - 14)) * 100;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header section with clean typography */}
      <div>
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-amber-400 font-semibold mb-1">
          <Scale className="w-4 h-4" />
          <span>Biometric Diagnostic & Composition Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-100 tracking-tight">
          BMI Calculator & Metabolic Profile
        </h1>
        <p className="mt-2 text-sm sm:text-base text-neutral-400 max-w-2xl">
          Accurate body mass index, basal metabolic rate (BMR), and total daily energy expenditure (TDEE) based on your real physique data.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left column: Input controls card */}
        <div className="lg:col-span-5 bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
            <h2 className="text-lg font-bold text-neutral-100 flex items-center gap-2">
              <span>Your Body Specs</span>
            </h2>
            
            {/* Unit System Selector */}
            <div className="inline-flex p-1 bg-neutral-950 rounded-lg border border-neutral-800 text-xs font-semibold">
              <button
                type="button"
                onClick={() => handleUnitToggle('metric')}
                className={`px-3 py-1 rounded transition-colors ${
                  profile.unitSystem === 'metric'
                    ? 'bg-amber-500 text-neutral-950 font-bold shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                Metric (kg/cm)
              </button>
              <button
                type="button"
                onClick={() => handleUnitToggle('imperial')}
                className={`px-3 py-1 rounded transition-colors ${
                  profile.unitSystem === 'imperial'
                    ? 'bg-amber-500 text-neutral-950 font-bold shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                Imperial (lbs/ft)
              </button>
            </div>
          </div>

          {/* Gender & Age */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                Biological Sex
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onUpdateProfile({ gender: 'male' })}
                  className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all ${
                    profile.gender === 'male'
                      ? 'bg-neutral-800 border-amber-500 text-amber-400'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  Male
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateProfile({ gender: 'female' })}
                  className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all ${
                    profile.gender === 'female'
                      ? 'bg-neutral-800 border-amber-500 text-amber-400'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  Female
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                Age: <span className="text-neutral-100 font-bold">{profile.age} yrs</span>
              </label>
              <input
                type="number"
                min="14"
                max="95"
                value={profile.age}
                onChange={(e) => onUpdateProfile({ age: parseInt(e.target.value) || 25 })}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-neutral-100 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>
          </div>

          {/* Height Input */}
          <div>
            <div className="flex items-center justify-between text-xs font-medium text-neutral-400 mb-1.5">
              <span>Height</span>
              <span className="text-neutral-100 font-bold">
                {profile.unitSystem === 'metric'
                  ? `${profile.heightCm} cm`
                  : `${feet}' ${inches}" (${profile.heightCm} cm)`}
              </span>
            </div>

            {profile.unitSystem === 'metric' ? (
              <div className="space-y-2">
                <input
                  type="range"
                  min="130"
                  max="220"
                  value={profile.heightCm}
                  onChange={(e) => handleHeightCmChange(parseInt(e.target.value))}
                  className="w-full accent-amber-500 bg-neutral-950 cursor-pointer h-2 rounded-lg"
                />
                <input
                  type="number"
                  min="120"
                  max="230"
                  value={profile.heightCm}
                  onChange={(e) => handleHeightCmChange(parseInt(e.target.value) || 170)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-neutral-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-neutral-500 mb-1">Feet</label>
                  <select
                    value={feet}
                    onChange={(e) => handleFeetInchesChange(parseInt(e.target.value), inches)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-neutral-100 focus:outline-none focus:border-amber-500"
                  >
                    {[4, 5, 6, 7].map((f) => (
                      <option key={f} value={f}>
                        {f} ft
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-neutral-500 mb-1">Inches</label>
                  <select
                    value={inches}
                    onChange={(e) => handleFeetInchesChange(feet, parseInt(e.target.value))}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-neutral-100 focus:outline-none focus:border-amber-500"
                  >
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
                      <option key={i} value={i}>
                        {i} in
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Current Weight Input */}
          <div>
            <div className="flex items-center justify-between text-xs font-medium text-neutral-400 mb-1.5">
              <span>Current Weight</span>
              <span className="text-neutral-100 font-bold">
                {displayWeight} {profile.unitSystem === 'metric' ? 'kg' : 'lbs'}
              </span>
            </div>
            <div className="space-y-2">
              <input
                type="range"
                min={profile.unitSystem === 'metric' ? 40 : 88}
                max={profile.unitSystem === 'metric' ? 160 : 350}
                value={displayWeight}
                onChange={(e) => handleWeightChange(parseFloat(e.target.value))}
                className="w-full accent-amber-500 bg-neutral-950 cursor-pointer h-2 rounded-lg"
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  step="0.5"
                  value={displayWeight}
                  onChange={(e) => handleWeightChange(parseFloat(e.target.value) || 70)}
                  className="flex-1 bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-neutral-100 focus:outline-none focus:border-amber-500"
                />
                <button
                  type="button"
                  onClick={handleQuickLogWeight}
                  className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium rounded-lg border border-neutral-700 flex items-center gap-1.5 transition-colors"
                  title="Record today's weight to history"
                >
                  {weightLoggedSuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Logged!</span>
                    </>
                  ) : (
                    <>
                      <Scale className="w-3.5 h-3.5" />
                      <span>Log Weight</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Target Weight (Optional) */}
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1.5">
              Goal Weight (Optional)
            </label>
            <input
              type="number"
              step="0.5"
              placeholder={`e.g. ${profile.unitSystem === 'metric' ? '72 kg' : '160 lbs'}`}
              value={displayTargetWeight}
              onChange={(e) => handleTargetWeightChange(parseFloat(e.target.value))}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-neutral-100 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Activity Level */}
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1.5">
              Physical Activity Level
            </label>
            <select
              value={profile.activityLevel}
              onChange={(e) => onUpdateProfile({ activityLevel: e.target.value as ActivityLevel })}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-neutral-100 focus:outline-none focus:border-amber-500"
            >
              <option value="sedentary">Sedentary (Desk job, little to no exercise)</option>
              <option value="light">Lightly Active (Workouts 1-2 days/week)</option>
              <option value="moderate">Moderately Active (Workouts 3-4 days/week)</option>
              <option value="very_active">Very Active (Hard training 5-6 days/week)</option>
              <option value="athlete">Athlete / Extreme (Physical job + 2x daily training)</option>
            </select>
          </div>

          {/* Fitness Goal */}
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1.5">
              Primary Goal
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'fat_loss', label: 'Fat Shred (-500 kcal)' },
                { id: 'lean_muscle', label: 'Lean Bulk (+350 kcal)' },
                { id: 'maintenance', label: 'Maintenance' },
                { id: 'aggressive_cut', label: 'Rapid Cut (-750 kcal)' },
              ].map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => onUpdateProfile({ goal: g.id as FitnessGoal })}
                  className={`p-2 text-left text-xs rounded-lg border transition-all ${
                    profile.goal === g.id
                      ? 'bg-amber-500/10 border-amber-500 text-amber-300 font-semibold'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: BMI Diagnostic Results, Gauge, BMR/TDEE & Action Card */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main BMI Score Display Card */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold tracking-wider uppercase text-neutral-400">
                  Calculated BMI Index
                </span>
                <div className="flex items-baseline gap-3 mt-1">
                  <span className="text-5xl sm:text-6xl font-black text-white tracking-tight font-mono">
                    {assessment.bmi.toFixed(1)}
                  </span>
                  <div>
                    <span className={`text-base sm:text-lg font-bold block ${assessment.categoryColor}`}>
                      {assessment.categoryLabel}
                    </span>
                    <span className="text-xs text-neutral-400">
                      Standard WHO Range: 18.5 – 24.9
                    </span>
                  </div>
                </div>
              </div>

              {/* Body Fat Estimation Tag */}
              <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-right">
                <span className="text-[11px] uppercase text-neutral-400 font-semibold block">
                  Est. Body Fat
                </span>
                <span className="text-2xl font-bold text-amber-400 font-mono">
                  {assessment.estimatedBodyFat}%
                </span>
                <span className="text-[10px] text-neutral-500 block">Deurenberg formula</span>
              </div>
            </div>

            {/* Custom Interactive Visual BMI Gauge */}
            <div className="mt-8">
              <div className="relative pt-6 pb-2">
                {/* Pointer Marker */}
                <div 
                  className="absolute top-0 transition-all duration-300 transform -translate-x-1/2 flex flex-col items-center"
                  style={{ left: `${meterPercent}%` }}
                >
                  <span className="text-[10px] font-mono font-bold bg-white text-neutral-950 px-1.5 py-0.5 rounded shadow">
                    {assessment.bmi.toFixed(1)}
                  </span>
                  <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-white"></div>
                </div>

                {/* Gradient Track */}
                <div className="h-3 w-full rounded-full bg-neutral-950 flex overflow-hidden border border-neutral-800">
                  <div className="w-[17%] bg-sky-500" title="Underweight (<18.5)" />
                  <div className="w-[24%] bg-emerald-500" title="Normal (18.5 - 24.9)" />
                  <div className="w-[19%] bg-amber-400" title="Overweight (25 - 29.9)" />
                  <div className="w-[19%] bg-rose-500" title="Obese I (30 - 34.9)" />
                  <div className="w-[21%] bg-red-600" title="Obese II+ (35+)" />
                </div>
              </div>

              {/* Labels below track */}
              <div className="flex justify-between text-[11px] text-neutral-500 font-mono mt-1 px-1">
                <span>&lt;18.5 Under</span>
                <span>18.5 – 24.9 Normal</span>
                <span>25.0 – 29.9 Over</span>
                <span>30.0+ Obese</span>
              </div>
            </div>

            {/* Weight vs Healthy Range Delta */}
            <div className="mt-6 pt-5 border-t border-neutral-800/80 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-300">
                  <Target className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <span className="text-xs text-neutral-400 block">Healthy Weight Bracket</span>
                  <span className="text-sm font-semibold text-neutral-100 font-mono">
                    {profile.unitSystem === 'metric'
                      ? `${assessment.healthyWeightMinKg} – ${assessment.healthyWeightMaxKg} kg`
                      : `${kgToLbs(assessment.healthyWeightMinKg)} – ${kgToLbs(assessment.healthyWeightMaxKg)} lbs`}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-300">
                  {assessment.weightDifferenceKg === 0 ? (
                    <Check className="w-5 h-5 text-emerald-400" />
                  ) : assessment.weightDifferenceKg > 0 ? (
                    <TrendingDown className="w-5 h-5 text-amber-400" />
                  ) : (
                    <TrendingUp className="w-5 h-5 text-sky-400" />
                  )}
                </div>
                <div>
                  <span className="text-xs text-neutral-400 block">Status vs Normal</span>
                  <span className="text-sm font-semibold text-neutral-100">
                    {assessment.weightDifferenceKg === 0 ? (
                      <span className="text-emerald-400">Within optimal range</span>
                    ) : assessment.weightDifferenceKg > 0 ? (
                      <span className="text-amber-400">
                        +{profile.unitSystem === 'metric' 
                          ? `${assessment.weightDifferenceKg} kg` 
                          : `${kgToLbs(assessment.weightDifferenceKg)} lbs`} above normal upper bound
                      </span>
                    ) : (
                      <span className="text-sky-400">
                        {profile.unitSystem === 'metric' 
                          ? `${Math.abs(assessment.weightDifferenceKg)} kg` 
                          : `${kgToLbs(Math.abs(assessment.weightDifferenceKg))} lbs`} below normal lower bound
                      </span>
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Metabolic & Energy Matrix (BMR, TDEE, Target Calorie Target, Daily Water) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
              <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-medium mb-1">
                <HeartPulse className="w-3.5 h-3.5 text-rose-400" />
                <span>BMR</span>
              </div>
              <div className="text-xl font-black text-neutral-100 font-mono">
                {assessment.bmr}
              </div>
              <span className="text-[10px] text-neutral-500">kcal at total rest</span>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
              <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-medium mb-1">
                <Activity className="w-3.5 h-3.5 text-sky-400" />
                <span>TDEE</span>
              </div>
              <div className="text-xl font-black text-neutral-100 font-mono">
                {assessment.tdee}
              </div>
              <span className="text-[10px] text-neutral-500">burn with movement</span>
            </div>

            <div className="bg-neutral-900 border border-amber-500/30 rounded-xl p-4 bg-amber-500/5">
              <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold mb-1">
                <Flame className="w-3.5 h-3.5" />
                <span>Target Intake</span>
              </div>
              <div className="text-xl font-black text-amber-400 font-mono">
                {assessment.targetMacros.calories}
              </div>
              <span className="text-[10px] text-amber-300/70">kcal / day for goal</span>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
              <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-medium mb-1">
                <Droplet className="w-3.5 h-3.5 text-sky-400" />
                <span>Hydration</span>
              </div>
              <div className="text-xl font-black text-sky-300 font-mono">
                {(assessment.dailyWaterMl / 1000).toFixed(1)}L
              </div>
              <span className="text-[10px] text-neutral-500">~{Math.round(assessment.dailyWaterMl / 250)} glasses/day</span>
            </div>
          </div>

          {/* Daily Recommended Macro Target Card */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-300 mb-4 flex items-center justify-between">
              <span>Goal-Optimized Macronutrient Blueprint</span>
              <span className="text-xs text-amber-400 font-mono">
                Total: {assessment.targetMacros.calories} kcal
              </span>
            </h3>

            <div className="grid grid-cols-4 gap-3 text-center">
              <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800">
                <span className="text-[11px] text-neutral-400 block font-medium">Protein</span>
                <span className="text-lg font-bold text-emerald-400 font-mono">
                  {assessment.targetMacros.proteinGrams}g
                </span>
                <span className="text-[10px] text-neutral-500 block">Muscle synthesis</span>
              </div>

              <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800">
                <span className="text-[11px] text-neutral-400 block font-medium">Carbs</span>
                <span className="text-lg font-bold text-amber-400 font-mono">
                  {assessment.targetMacros.carbsGrams}g
                </span>
                <span className="text-[10px] text-neutral-500 block">Training fuel</span>
              </div>

              <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800">
                <span className="text-[11px] text-neutral-400 block font-medium">Fats</span>
                <span className="text-lg font-bold text-rose-400 font-mono">
                  {assessment.targetMacros.fatsGrams}g
                </span>
                <span className="text-[10px] text-neutral-500 block">Hormonal balance</span>
              </div>

              <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800">
                <span className="text-[11px] text-neutral-400 block font-medium">Fiber</span>
                <span className="text-lg font-bold text-sky-400 font-mono">
                  {assessment.targetMacros.fiberGrams}g
                </span>
                <span className="text-[10px] text-neutral-500 block">Gut & satiety</span>
              </div>
            </div>

            {/* Recommendations Bullets */}
            <div className="mt-5 space-y-2 pt-4 border-t border-neutral-800/80">
              <span className="text-xs font-semibold text-neutral-300 block">
                Evidence-Based Recommendations for Your Profile:
              </span>
              {assessment.recommendations.map((rec, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-neutral-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  <span>{rec}</span>
                </div>
              ))}
            </div>

            {/* Quick Action Navigation Buttons */}
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleSyncToPlan}
                className="flex-1 min-w-[200px] py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10"
              >
                {syncedSuccess ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Applied to Meal & Workout Plans!</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Apply Specs to Routines & Meals</span>
                  </>
                )}
              </button>

              {onNavigateToWorkouts && (
                <button
                  type="button"
                  onClick={onNavigateToWorkouts}
                  className="py-2.5 px-4 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold text-sm rounded-xl border border-neutral-700 transition-colors"
                >
                  View Full Body Workouts
                </button>
              )}

              {onNavigateToMeals && (
                <button
                  type="button"
                  onClick={onNavigateToMeals}
                  className="py-2.5 px-4 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold text-sm rounded-xl border border-neutral-700 transition-colors"
                >
                  View Suitable Meal Plans
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
