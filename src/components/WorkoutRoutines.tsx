import React, { useState } from 'react';
import { WorkoutRoutine, Exercise, FitnessGoal } from '../types/fitness';
import { WORKOUT_ROUTINES } from '../data/workouts';
import { ExerciseIllustration } from './ExerciseIllustration';
import { 
  Dumbbell, 
  Clock, 
  Flame, 
  Calendar, 
  Play, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  AlertCircle, 
  Wind,
  Info
} from 'lucide-react';

interface WorkoutRoutinesProps {
  userGoal: FitnessGoal;
  onStartWorkout: (routine: WorkoutRoutine) => void;
}

export const WorkoutRoutines: React.FC<WorkoutRoutinesProps> = ({
  userGoal,
  onStartWorkout,
}) => {
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [expandedRoutineId, setExpandedRoutineId] = useState<string | null>(WORKOUT_ROUTINES[0].id);
  const [selectedExerciseModal, setSelectedExerciseModal] = useState<Exercise | null>(null);

  const filteredRoutines = WORKOUT_ROUTINES.filter((routine) => {
    if (selectedLevel === 'All') return true;
    return routine.level === selectedLevel;
  });

  const getGoalMatch = (routineId: string) => {
    if (userGoal === 'fat_loss' || userGoal === 'aggressive_cut') {
      return routineId === 'metabolic-shred-hiit';
    }
    if (userGoal === 'lean_muscle') {
      return routineId === 'hypertrophy-iron-power';
    }
    if (userGoal === 'endurance') {
      return routineId === 'calisthenics-zero-gear';
    }
    return routineId === 'fullbody-foundation';
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-amber-400 font-semibold mb-1">
            <Dumbbell className="w-4 h-4" />
            <span>Complete Kinetic Chain Activation</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-100 tracking-tight">
            Full Body Workout Programs
          </h1>
          <p className="mt-2 text-sm sm:text-base text-neutral-400 max-w-2xl">
            Compound multi-joint routines designed for maximum metabolic output, muscle symmetry, and progressive overload.
          </p>
        </div>

        {/* Level filter tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-neutral-900 border border-neutral-800 rounded-xl text-xs font-semibold self-start md:self-auto">
          {['All', 'Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
            <button
              key={lvl}
              type="button"
              onClick={() => setSelectedLevel(lvl)}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                selectedLevel === lvl
                  ? 'bg-amber-500 text-neutral-950 font-bold shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Routine Cards Grid */}
      <div className="space-y-6">
        {filteredRoutines.map((routine) => {
          const isExpanded = expandedRoutineId === routine.id;
          const isRecommended = getGoalMatch(routine.id);

          return (
            <div
              key={routine.id}
              className={`bg-neutral-900 border rounded-2xl overflow-hidden transition-all duration-200 ${
                isRecommended
                  ? 'border-amber-500/50 shadow-lg shadow-amber-500/5'
                  : 'border-neutral-800 hover:border-neutral-700'
              }`}
            >
              {/* Routine Card Header */}
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-2">
                    {/* Unboxed clean metadata (zero-pill rule) */}
                    <div className="flex items-center gap-2 text-xs text-neutral-400 font-medium">
                      <span className="text-amber-400 font-semibold">{routine.level}</span>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {routine.durationMin} mins
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {routine.frequencyPerWeek}x / week
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1 text-emerald-400">
                        <Flame className="w-3.5 h-3.5" />
                        ~{routine.estimatedCaloriesBurn} kcal
                      </span>
                      {isRecommended && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-amber-400 font-bold uppercase tracking-wider text-[11px]">
                            Recommended for your Goal
                          </span>
                        </>
                      )}
                    </div>

                    <h2 className="text-2xl font-bold text-neutral-100 tracking-tight">
                      {routine.title}
                    </h2>
                    <p className="text-sm text-neutral-300">
                      {routine.tagline}
                    </p>
                    <p className="text-xs text-neutral-400 max-w-3xl">
                      {routine.description}
                    </p>

                    {/* Equipment & Focus areas */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-400 pt-1">
                      <div>
                        <span className="text-neutral-500">Equipment: </span>
                        <span className="text-neutral-300">{routine.equipmentNeeded.join(', ')}</span>
                      </div>
                      <span aria-hidden="true" className="hidden sm:inline">·</span>
                      <div>
                        <span className="text-neutral-500">Focus: </span>
                        <span className="text-neutral-300">{routine.focusAreas.join(', ')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 shrink-0 pt-2 lg:pt-0">
                    <button
                      type="button"
                      onClick={() => onStartWorkout(routine)}
                      className="py-2.5 px-5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-sm rounded-xl transition-colors flex items-center gap-2 shadow-md shadow-amber-500/10 cursor-pointer"
                    >
                      <Play className="w-4 h-4 fill-neutral-950" />
                      <span>Start Workout</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setExpandedRoutineId(isExpanded ? null : routine.id)}
                      className="py-2.5 px-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-sm font-semibold rounded-xl border border-neutral-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                      title={isExpanded ? 'Collapse exercises' : 'View exercises'}
                    >
                      <span>{routine.exercises.length} Exercises</span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Expandable Exercise Breakdown */}
              {isExpanded && (
                <div className="border-t border-neutral-800/80 bg-neutral-950/60 p-6 space-y-4">
                  <div className="flex items-center justify-between text-xs text-neutral-400 font-semibold uppercase tracking-wider pb-2">
                    <span>Exercise Sequence ({routine.exercises.length} Movements)</span>
                    <span>Click any exercise for form cues & breathing tips</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {routine.exercises.map((exercise, idx) => (
                      <div
                        key={exercise.id}
                        onClick={() => setSelectedExerciseModal(exercise)}
                        className="p-4 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-xl cursor-pointer transition-all hover:bg-neutral-850 flex items-start gap-4 group"
                      >
                        {/* Illustration Icon */}
                        <div className="p-2 bg-neutral-950 rounded-lg border border-neutral-800 shrink-0 group-hover:border-amber-500/50 transition-colors">
                          <ExerciseIllustration type={exercise.svgIcon} className="w-12 h-12 text-neutral-400" />
                        </div>

                        {/* Exercise Details */}
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-mono text-amber-400 font-semibold">
                              #{idx + 1} · {exercise.mechanics}
                            </span>
                            <span className="text-xs font-mono text-neutral-300 font-bold bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800">
                              {exercise.defaultSets} sets × {exercise.defaultReps}
                            </span>
                          </div>

                          <h3 className="text-base font-bold text-neutral-100 group-hover:text-amber-400 transition-colors truncate">
                            {exercise.name}
                          </h3>

                          <div className="text-xs text-neutral-400 flex items-center gap-2">
                            <span>Target: <strong className="text-neutral-300 font-medium">{exercise.targetMuscles.join(', ')}</strong></span>
                          </div>

                          <div className="text-[11px] text-neutral-500 flex items-center gap-3 pt-1">
                            <span>Rest: {exercise.restSeconds}s</span>
                            <span>·</span>
                            <span>Gear: {exercise.equipment}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Exercise Detail Modal with Form Cues & Mistakes */}
      {selectedExerciseModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-xl w-full p-6 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-neutral-950 rounded-xl border border-neutral-800">
                  <ExerciseIllustration type={selectedExerciseModal.svgIcon} className="w-12 h-12 text-neutral-300" />
                </div>
                <div>
                  <span className="text-xs font-mono text-amber-400 uppercase tracking-widest font-semibold">
                    {selectedExerciseModal.difficulty} · {selectedExerciseModal.mechanics}
                  </span>
                  <h3 className="text-xl font-extrabold text-neutral-100">
                    {selectedExerciseModal.name}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedExerciseModal(null)}
                className="text-neutral-400 hover:text-neutral-100 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-neutral-950 p-2.5 rounded-lg border border-neutral-800">
                <span className="text-neutral-500 block">Sets × Reps</span>
                <span className="font-bold text-neutral-200 font-mono mt-0.5 block">
                  {selectedExerciseModal.defaultSets} × {selectedExerciseModal.defaultReps}
                </span>
              </div>
              <div className="bg-neutral-950 p-2.5 rounded-lg border border-neutral-800">
                <span className="text-neutral-500 block">Rest Period</span>
                <span className="font-bold text-neutral-200 font-mono mt-0.5 block">
                  {selectedExerciseModal.restSeconds} seconds
                </span>
              </div>
              <div className="bg-neutral-950 p-2.5 rounded-lg border border-neutral-800">
                <span className="text-neutral-500 block">Equipment</span>
                <span className="font-bold text-neutral-200 truncate mt-0.5 block">
                  {selectedExerciseModal.equipment}
                </span>
              </div>
            </div>

            {/* Target Muscles */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-neutral-300 block">Anatomical Targets</span>
              <p className="text-xs text-neutral-400">
                Primary: <strong className="text-neutral-200">{selectedExerciseModal.targetMuscles.join(', ')}</strong>
                {selectedExerciseModal.secondaryMuscles.length > 0 && (
                  <> · Secondary: <span className="text-neutral-300">{selectedExerciseModal.secondaryMuscles.join(', ')}</span></>
                )}
              </p>
            </div>

            {/* Form Execution Cues */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Flawless Form Execution</span>
              </span>
              <ul className="space-y-1.5">
                {selectedExerciseModal.formCues.map((cue, i) => (
                  <li key={i} className="text-xs text-neutral-300 flex items-start gap-2">
                    <span className="text-amber-400 font-mono font-bold">{i + 1}.</span>
                    <span>{cue}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Breathing Pattern */}
            <div className="bg-neutral-950 p-3.5 rounded-xl border border-neutral-800 flex items-start gap-3">
              <Wind className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-neutral-200 block">Breathing & Intra-Abdominal Pressure</span>
                <p className="text-xs text-neutral-400 mt-0.5">
                  {selectedExerciseModal.breathingTip}
                </p>
              </div>
            </div>

            {/* Common Mistakes */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-rose-400" />
                <span>Common Form Faults to Avoid</span>
              </span>
              <ul className="space-y-1">
                {selectedExerciseModal.commonMistakes.map((mistake, i) => (
                  <li key={i} className="text-xs text-neutral-400 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                    <span>{mistake}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setSelectedExerciseModal(null)}
                className="w-full py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold text-xs rounded-xl border border-neutral-700 transition-colors"
              >
                Close Exercise Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
