/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  UserProfile, 
  WorkoutRoutine, 
  WorkoutSessionLog, 
  BodyWeightLog 
} from './types/fitness';
import { assessBMIAndMetabolism, calculateBMI } from './utils/calculations';
import { WORKOUT_ROUTINES } from './data/workouts';
import { BMICalculator } from './components/BMICalculator';
import { WorkoutRoutines } from './components/WorkoutRoutines';
import { LiveWorkoutTracker } from './components/LiveWorkoutTracker';
import { MealPlansView } from './components/MealPlansView';
import { ProgressHistory } from './components/ProgressHistory';
import { 
  Dumbbell, 
  Scale, 
  Utensils, 
  TrendingUp, 
  Play, 
  Flame, 
  CheckCircle,
  Activity,
  Layers
} from 'lucide-react';

const STORAGE_KEYS = {
  PROFILE: 'forgefit_profile_v1',
  WEIGHT_LOGS: 'forgefit_weight_logs_v1',
  WORKOUT_LOGS: 'forgefit_workout_logs_v1',
};

const DEFAULT_PROFILE: UserProfile = {
  name: 'Athlete',
  age: 26,
  gender: 'male',
  heightCm: 178,
  weightKg: 76.5,
  unitSystem: 'metric',
  activityLevel: 'moderate',
  goal: 'lean_muscle',
  targetWeightKg: 78,
  waterGlassesDrunk: 4,
  lastUpdated: new Date().toISOString(),
};

const INITIAL_WEIGHT_LOGS: BodyWeightLog[] = [
  { id: 'w-1', date: '2026-10-01', weightKg: 78.4, bmi: 24.7 },
  { id: 'w-2', date: '2026-10-08', weightKg: 77.8, bmi: 24.5 },
  { id: 'w-3', date: '2026-10-15', weightKg: 77.1, bmi: 24.3 },
  { id: 'w-4', date: '2026-10-20', weightKg: 76.5, bmi: 24.1 },
];

const INITIAL_WORKOUT_LOGS: WorkoutSessionLog[] = [
  {
    id: 'w-log-1',
    routineId: 'fullbody-foundation',
    routineTitle: 'Full Body Foundation & Strength',
    startTime: '2026-10-18T09:30:00.000Z',
    durationSeconds: 2700,
    caloriesBurned: 350,
    totalVolumeKg: 2840,
    setsCompleted: 18,
  },
  {
    id: 'w-log-2',
    routineId: 'metabolic-shred-hiit',
    routineTitle: 'High-Octane Metabolic Burn & Conditioning',
    startTime: '2026-10-20T08:15:00.000Z',
    durationSeconds: 2100,
    caloriesBurned: 420,
    totalVolumeKg: 2150,
    setsCompleted: 17,
  }
];

export default function App() {
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return stored ? JSON.parse(stored) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  const [weightLogs, setWeightLogs] = useState<BodyWeightLog[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.WEIGHT_LOGS);
      return stored ? JSON.parse(stored) : INITIAL_WEIGHT_LOGS;
    } catch {
      return INITIAL_WEIGHT_LOGS;
    }
  });

  const [workoutLogs, setWorkoutLogs] = useState<WorkoutSessionLog[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.WORKOUT_LOGS);
      return stored ? JSON.parse(stored) : INITIAL_WORKOUT_LOGS;
    } catch {
      return INITIAL_WORKOUT_LOGS;
    }
  });

  const [activeTab, setActiveTab] = useState<'bmi' | 'workouts' | 'meals' | 'progress'>('bmi');
  const [activeWorkoutRoutine, setActiveWorkoutRoutine] = useState<WorkoutRoutine | null>(null);

  // Synchronize with LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } catch {
      // ignore
    }
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.WEIGHT_LOGS, JSON.stringify(weightLogs));
    } catch {
      // ignore
    }
  }, [weightLogs]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.WORKOUT_LOGS, JSON.stringify(workoutLogs));
    } catch {
      // ignore
    }
  }, [workoutLogs]);

  const assessment = assessBMIAndMetabolism(profile);

  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    setProfile((prev) => ({
      ...prev,
      ...updated,
      lastUpdated: new Date().toISOString(),
    }));
  };

  const handleLogWeight = (weightKg: number) => {
    const today = new Date().toISOString().slice(0, 10);
    const bmi = calculateBMI(profile.heightCm, weightKg);

    setWeightLogs((prev) => {
      // Update or add today's entry
      const existingIdx = prev.findIndex((entry) => entry.date === today);
      if (existingIdx >= 0) {
        const copy = [...prev];
        copy[existingIdx] = { ...copy[existingIdx], weightKg, bmi };
        return copy;
      }
      return [...prev, { id: 'w-' + Date.now(), date: today, weightKg, bmi }];
    });
  };

  const handleStartWorkout = (routine: WorkoutRoutine) => {
    setActiveWorkoutRoutine(routine);
  };

  const handleFinishWorkout = (log: WorkoutSessionLog) => {
    setWorkoutLogs((prev) => [log, ...prev]);
    setActiveWorkoutRoutine(null);
    setActiveTab('progress');
  };

  const handleCancelWorkout = () => {
    if (window.confirm('Do you want to discard this active workout session?')) {
      setActiveWorkoutRoutine(null);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear your workout log history?')) {
      setWorkoutLogs([]);
    }
  };

  const handleImportData = (data: { weightLogs: BodyWeightLog[]; workoutLogs: WorkoutSessionLog[] }) => {
    if (data.weightLogs) setWeightLogs(data.weightLogs);
    if (data.workoutLogs) setWorkoutLogs(data.workoutLogs);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-amber-500 selection:text-neutral-950">
      {/* Top Main Navigation Header */}
      <header className="sticky top-0 z-40 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Brand */}
          <div 
            onClick={() => {
              if (!activeWorkoutRoutine) setActiveTab('bmi');
            }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-neutral-950 font-black shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Flame className="w-6 h-6 fill-neutral-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-neutral-100">
                  FORGE<span className="text-amber-400">FIT</span>
                </span>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-500 border border-neutral-800 px-1.5 py-0.5 rounded">
                  PRO
                </span>
              </div>
              <span className="text-[11px] text-neutral-400 hidden sm:block">
                Full Body Workouts · Meal Plans · BMI System
              </span>
            </div>
          </div>

          {/* Segmented Navigation Bar (Buttons conforming to anti-slop / zero-pill guidelines) */}
          <nav className="hidden md:flex items-center gap-1 p-1 bg-neutral-900 border border-neutral-800 rounded-xl">
            <button
              type="button"
              onClick={() => {
                if (activeWorkoutRoutine) {
                  if (window.confirm('Leave active workout?')) {
                    setActiveWorkoutRoutine(null);
                    setActiveTab('bmi');
                  }
                } else {
                  setActiveTab('bmi');
                }
              }}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 cursor-pointer ${
                activeTab === 'bmi' && !activeWorkoutRoutine
                  ? 'bg-amber-500 text-neutral-950 font-bold shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>BMI & Profile</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (activeWorkoutRoutine) {
                  if (window.confirm('Leave active workout?')) {
                    setActiveWorkoutRoutine(null);
                    setActiveTab('workouts');
                  }
                } else {
                  setActiveTab('workouts');
                }
              }}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 cursor-pointer ${
                activeTab === 'workouts' || activeWorkoutRoutine
                  ? 'bg-amber-500 text-neutral-950 font-bold shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Dumbbell className="w-3.5 h-3.5" />
              <span>Full Body Routines</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (activeWorkoutRoutine) {
                  if (window.confirm('Leave active workout?')) {
                    setActiveWorkoutRoutine(null);
                    setActiveTab('meals');
                  }
                } else {
                  setActiveTab('meals');
                }
              }}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 cursor-pointer ${
                activeTab === 'meals' && !activeWorkoutRoutine
                  ? 'bg-amber-500 text-neutral-950 font-bold shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Utensils className="w-3.5 h-3.5" />
              <span>Meal Plans & Diet</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (activeWorkoutRoutine) {
                  if (window.confirm('Leave active workout?')) {
                    setActiveWorkoutRoutine(null);
                    setActiveTab('progress');
                  }
                } else {
                  setActiveTab('progress');
                }
              }}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 cursor-pointer ${
                activeTab === 'progress' && !activeWorkoutRoutine
                  ? 'bg-amber-500 text-neutral-950 font-bold shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Progress Logs</span>
            </button>
          </nav>

          {/* Quick Stat Pill */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-neutral-400 bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-xl">
              <span className="text-neutral-500">BMI:</span>
              <span className="text-amber-400 font-bold">{assessment.bmi.toFixed(1)}</span>
              <span className="text-neutral-600">·</span>
              <span className="text-neutral-500">TDEE:</span>
              <span className="text-neutral-200 font-bold">{assessment.tdee}</span>
            </div>

            {!activeWorkoutRoutine && (
              <button
                type="button"
                onClick={() => handleStartWorkout(WORKOUT_ROUTINES[0])}
                className="py-1.5 px-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow-md shadow-amber-500/10 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-neutral-950" />
                <span className="hidden sm:inline">Quick Start</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="md:hidden border-t border-neutral-800/80 bg-neutral-950 px-2 py-1.5 flex items-center justify-around">
          <button
            type="button"
            onClick={() => {
              if (!activeWorkoutRoutine) setActiveTab('bmi');
            }}
            className={`p-2 text-xs font-semibold rounded-lg flex flex-col items-center gap-1 ${
              activeTab === 'bmi' && !activeWorkoutRoutine ? 'text-amber-400' : 'text-neutral-400'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>BMI</span>
          </button>
          <button
            type="button"
            onClick={() => {
              if (!activeWorkoutRoutine) setActiveTab('workouts');
            }}
            className={`p-2 text-xs font-semibold rounded-lg flex flex-col items-center gap-1 ${
              activeTab === 'workouts' || activeWorkoutRoutine ? 'text-amber-400' : 'text-neutral-400'
            }`}
          >
            <Dumbbell className="w-4 h-4" />
            <span>Workouts</span>
          </button>
          <button
            type="button"
            onClick={() => {
              if (!activeWorkoutRoutine) setActiveTab('meals');
            }}
            className={`p-2 text-xs font-semibold rounded-lg flex flex-col items-center gap-1 ${
              activeTab === 'meals' && !activeWorkoutRoutine ? 'text-amber-400' : 'text-neutral-400'
            }`}
          >
            <Utensils className="w-4 h-4" />
            <span>Meals</span>
          </button>
          <button
            type="button"
            onClick={() => {
              if (!activeWorkoutRoutine) setActiveTab('progress');
            }}
            className={`p-2 text-xs font-semibold rounded-lg flex flex-col items-center gap-1 ${
              activeTab === 'progress' && !activeWorkoutRoutine ? 'text-amber-400' : 'text-neutral-400'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Logs</span>
          </button>
        </div>
      </header>

      {/* Main Content View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeWorkoutRoutine ? (
          <LiveWorkoutTracker
            routine={activeWorkoutRoutine}
            unitSystem={profile.unitSystem}
            onFinishWorkout={handleFinishWorkout}
            onCancelWorkout={handleCancelWorkout}
          />
        ) : (
          <>
            {activeTab === 'bmi' && (
              <BMICalculator
                profile={profile}
                assessment={assessment}
                onUpdateProfile={handleUpdateProfile}
                onLogWeight={handleLogWeight}
                onNavigateToWorkouts={() => setActiveTab('workouts')}
                onNavigateToMeals={() => setActiveTab('meals')}
              />
            )}

            {activeTab === 'workouts' && (
              <WorkoutRoutines
                userGoal={profile.goal}
                onStartWorkout={handleStartWorkout}
              />
            )}

            {activeTab === 'meals' && (
              <MealPlansView
                userGoal={profile.goal}
                assessment={assessment}
                waterGlassesDrunk={profile.waterGlassesDrunk}
                onUpdateWaterGlasses={(count) => handleUpdateProfile({ waterGlassesDrunk: count })}
              />
            )}

            {activeTab === 'progress' && (
              <ProgressHistory
                weightLogs={weightLogs}
                workoutLogs={workoutLogs}
                unitSystem={profile.unitSystem}
                onClearHistory={handleClearHistory}
                onImportData={handleImportData}
              />
            )}
          </>
        )}
      </main>

      {/* Subtle Footer */}
      <footer className="border-t border-neutral-900 bg-neutral-950 py-6 mt-12 text-center text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-neutral-300">ForgeFit</span>
            <span>·</span>
            <span>Full Body Training, Dynamic Nutrition & Biometric Engine</span>
          </div>
          <div className="text-[11px] text-neutral-600">
            Formulas: WHO BMI Standards · Mifflin-St Jeor BMR · Deurenberg Body Fat Equation
          </div>
        </div>
      </footer>
    </div>
  );
}
