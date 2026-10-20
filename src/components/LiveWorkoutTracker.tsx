import React, { useState, useEffect, useRef } from 'react';
import { WorkoutRoutine, Exercise, ExerciseSetLog, WorkoutSessionLog, UnitSystem } from '../types/fitness';
import { ExerciseIllustration } from './ExerciseIllustration';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  Trophy, 
  Clock, 
  Flame, 
  Dumbbell, 
  X, 
  Volume2, 
  VolumeX, 
  Plus, 
  Minus 
} from 'lucide-react';

interface LiveWorkoutTrackerProps {
  routine: WorkoutRoutine;
  unitSystem: UnitSystem;
  onFinishWorkout: (log: WorkoutSessionLog) => void;
  onCancelWorkout: () => void;
}

export const LiveWorkoutTracker: React.FC<LiveWorkoutTrackerProps> = ({
  routine,
  unitSystem,
  onFinishWorkout,
  onCancelWorkout,
}) => {
  const [currentExerciseIdx, setCurrentExerciseIdx] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Set logging state keyed by exercise id
  const [setLogs, setSetLogs] = useState<Record<string, ExerciseSetLog[]>>(() => {
    const initial: Record<string, ExerciseSetLog[]> = {};
    routine.exercises.forEach((ex) => {
      initial[ex.id] = Array.from({ length: ex.defaultSets }, (_, i) => ({
        setNumber: i + 1,
        reps: parseInt(ex.defaultReps) || 10,
        weightKg: 20,
        completed: false,
      }));
    });
    return initial;
  });

  // Rest Timer State
  const [isResting, setIsResting] = useState(false);
  const [restSecondsRemaining, setRestSecondsRemaining] = useState(60);
  const [totalRestInitial, setTotalRestInitial] = useState(60);

  // Completed workout celebration modal
  const [isWorkoutCompleted, setIsWorkoutCompleted] = useState(false);
  const [completedSummary, setCompletedSummary] = useState<WorkoutSessionLog | null>(null);

  const currentExercise: Exercise = routine.exercises[currentExerciseIdx];
  const currentSets = setLogs[currentExercise.id] || [];

  // Elapsed Workout Timer Effect
  useEffect(() => {
    if (isPaused || isWorkoutCompleted) return;
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isPaused, isWorkoutCompleted]);

  // Rest Timer Effect
  useEffect(() => {
    if (!isResting || isPaused) return;

    if (restSecondsRemaining <= 0) {
      setIsResting(false);
      if (soundEnabled) sound.playGoBell();
      return;
    }

    if (soundEnabled && restSecondsRemaining <= 3 && restSecondsRemaining > 0) {
      sound.playTick(600 + (3 - restSecondsRemaining) * 80);
    }

    const timer = setTimeout(() => {
      setRestSecondsRemaining((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isResting, restSecondsRemaining, isPaused, soundEnabled]);

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleToggleSetComplete = (setIdx: number) => {
    const updated = [...currentSets];
    const targetSet = updated[setIdx];
    const willBeCompleted = !targetSet.completed;

    targetSet.completed = willBeCompleted;
    setSetLogs((prev) => ({
      ...prev,
      [currentExercise.id]: updated,
    }));

    if (willBeCompleted) {
      if (soundEnabled) sound.playSetComplete();

      // Trigger Rest Timer
      const restDuration = currentExercise.restSeconds || 60;
      setTotalRestInitial(restDuration);
      setRestSecondsRemaining(restDuration);
      setIsResting(true);
    }
  };

  const handleUpdateSetValue = (setIdx: number, field: 'reps' | 'weightKg', val: number) => {
    const updated = [...currentSets];
    updated[setIdx] = {
      ...updated[setIdx],
      [field]: Math.max(0, val),
    };
    setSetLogs((prev) => ({
      ...prev,
      [currentExercise.id]: updated,
    }));
  };

  const handleAddSet = () => {
    const updated = [
      ...currentSets,
      {
        setNumber: currentSets.length + 1,
        reps: currentSets.length > 0 ? currentSets[currentSets.length - 1].reps : 10,
        weightKg: currentSets.length > 0 ? currentSets[currentSets.length - 1].weightKg : 20,
        completed: false,
      },
    ];
    setSetLogs((prev) => ({
      ...prev,
      [currentExercise.id]: updated,
    }));
  };

  const handleNextExercise = () => {
    if (currentExerciseIdx < routine.exercises.length - 1) {
      setCurrentExerciseIdx((prev) => prev + 1);
      setIsResting(false);
    }
  };

  const handlePrevExercise = () => {
    if (currentExerciseIdx > 0) {
      setCurrentExerciseIdx((prev) => prev - 1);
      setIsResting(false);
    }
  };

  const handleCompleteWorkout = () => {
    let totalVolume = 0;
    let totalSetsDone = 0;

    Object.values(setLogs).forEach((sets) => {
      sets.forEach((s) => {
        if (s.completed) {
          totalSetsDone += 1;
          totalVolume += s.weightKg * s.reps;
        }
      });
    });

    const calories = Math.round(
      (routine.estimatedCaloriesBurn * (Math.max(600, elapsedSeconds) / (routine.durationMin * 60)))
    );

    const log: WorkoutSessionLog = {
      id: 'session-' + Date.now(),
      routineId: routine.id,
      routineTitle: routine.title,
      startTime: new Date().toISOString(),
      durationSeconds: elapsedSeconds,
      caloriesBurned: calories,
      totalVolumeKg: Math.round(totalVolume),
      setsCompleted: totalSetsDone,
    };

    setCompletedSummary(log);
    setIsWorkoutCompleted(true);
    setIsResting(false);

    if (soundEnabled) sound.playVictoryFanfare();

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#10B981', '#38BDF8', '#FFFFFF'],
      });
    } catch {
      // ignore
    }
  };

  const handleSaveAndExit = () => {
    if (completedSummary) {
      onFinishWorkout(completedSummary);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Session Control Bar */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 sm:p-5 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
            <Dumbbell className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-semibold block">
              Live Session Active
            </span>
            <h2 className="text-base sm:text-lg font-bold text-neutral-100 truncate max-w-xs sm:max-w-md">
              {routine.title}
            </h2>
          </div>
        </div>

        {/* Elapsed Timer & Controls */}
        <div className="flex items-center gap-3">
          <div className="bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-1.5 flex items-center gap-2 font-mono text-base font-bold text-neutral-100">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>{formatTime(elapsedSeconds)}</span>
          </div>

          <button
            type="button"
            onClick={() => setIsPaused(!isPaused)}
            className="p-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-xl border border-neutral-700 transition-colors"
            title={isPaused ? 'Resume Session' : 'Pause Session'}
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-xl border border-neutral-700 transition-colors"
            title={soundEnabled ? 'Mute Sound Effects' : 'Enable Sound Effects'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-neutral-500" />}
          </button>

          <button
            type="button"
            onClick={onCancelWorkout}
            className="p-2 bg-neutral-800 hover:bg-rose-950 hover:text-rose-400 text-neutral-400 rounded-xl border border-neutral-700 transition-colors"
            title="Exit Workout"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Rest Timer Banner (shows when resting) */}
      {isResting && (
        <div className="bg-gradient-to-r from-amber-500/20 via-neutral-900 to-amber-500/20 border border-amber-500/40 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 animate-pulse-subtle shadow-xl">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-14 h-14 rounded-full bg-neutral-950 border-2 border-amber-400 flex items-center justify-center font-mono text-xl font-black text-amber-400 shadow-inner">
              {restSecondsRemaining}s
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest text-amber-400 font-bold block">
                Rest & Recovery Interval
              </span>
              <p className="text-xs text-neutral-300">
                Deep diaphragmatic breaths to clear lactate before set {currentSets.findIndex((s) => !s.completed) + 1}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setRestSecondsRemaining((prev) => Math.max(5, prev - 15))}
              className="p-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg text-xs font-mono font-bold flex items-center gap-1 border border-neutral-700"
            >
              <Minus className="w-3.5 h-3.5" /> 15s
            </button>
            <button
              type="button"
              onClick={() => setRestSecondsRemaining((prev) => prev + 15)}
              className="p-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg text-xs font-mono font-bold flex items-center gap-1 border border-neutral-700"
            >
              <Plus className="w-3.5 h-3.5" /> 15s
            </button>
            <button
              type="button"
              onClick={() => setIsResting(false)}
              className="py-2 px-3.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold rounded-lg transition-colors"
            >
              Skip Rest
            </button>
          </div>
        </div>
      )}

      {/* Main Active Exercise Card */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
        {/* Exercise Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 shrink-0">
              <ExerciseIllustration type={currentExercise.svgIcon} className="w-14 h-14 text-neutral-200" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
                <span className="text-amber-400 font-bold">Exercise {currentExerciseIdx + 1} of {routine.exercises.length}</span>
                <span>·</span>
                <span>{currentExercise.mechanics}</span>
                <span>·</span>
                <span>{currentExercise.equipment}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-100 tracking-tight mt-0.5">
                {currentExercise.name}
              </h2>
            </div>
          </div>

          <div className="text-right sm:self-center">
            <span className="text-xs text-neutral-400 block">Target Muscles</span>
            <span className="text-sm font-semibold text-neutral-200">
              {currentExercise.targetMuscles.join(', ')}
            </span>
          </div>
        </div>

        {/* Set-by-Set Logging Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-300">
              Recorded Sets & Target Volume
            </h3>
            <button
              type="button"
              onClick={handleAddSet}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Set</span>
            </button>
          </div>

          <div className="space-y-2">
            {currentSets.map((set, setIdx) => (
              <div
                key={setIdx}
                className={`p-3 sm:p-4 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                  set.completed
                    ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
                    : 'bg-neutral-950 border-neutral-800 text-neutral-300'
                }`}
              >
                {/* Set Number */}
                <div className="w-16 font-mono text-sm font-bold flex items-center gap-1.5">
                  <span className="text-neutral-500 text-xs">SET</span>
                  <span className={set.completed ? 'text-emerald-400' : 'text-neutral-200'}>
                    {set.setNumber}
                  </span>
                </div>

                {/* Weight input */}
                <div className="flex items-center gap-1.5 flex-1 max-w-[130px]">
                  <input
                    type="number"
                    step="1"
                    min="0"
                    disabled={set.completed}
                    value={set.weightKg}
                    onChange={(e) =>
                      handleUpdateSetValue(setIdx, 'weightKg', parseFloat(e.target.value) || 0)
                    }
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-sm font-mono text-center text-neutral-100 focus:outline-none focus:border-amber-500 disabled:opacity-70"
                  />
                  <span className="text-xs text-neutral-400 font-mono">
                    {unitSystem === 'metric' ? 'kg' : 'lbs'}
                  </span>
                </div>

                {/* Reps input */}
                <div className="flex items-center gap-1.5 flex-1 max-w-[120px]">
                  <input
                    type="number"
                    step="1"
                    min="1"
                    disabled={set.completed}
                    value={set.reps}
                    onChange={(e) =>
                      handleUpdateSetValue(setIdx, 'reps', parseInt(e.target.value) || 0)
                    }
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-sm font-mono text-center text-neutral-100 focus:outline-none focus:border-amber-500 disabled:opacity-70"
                  />
                  <span className="text-xs text-neutral-400 font-mono">reps</span>
                </div>

                {/* Complete Button */}
                <button
                  type="button"
                  onClick={() => handleToggleSetComplete(setIdx)}
                  className={`py-1.5 px-4 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                    set.completed
                      ? 'bg-emerald-500 text-neutral-950 shadow-sm'
                      : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{set.completed ? 'Done' : 'Check'}</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Form Reminder */}
        <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800/80 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
            Form Execution & Breathing Reminder:
          </span>
          <p className="text-xs text-neutral-300">
            {currentExercise.formCues[0]}
          </p>
          <p className="text-xs text-neutral-400 italic">
            🌬️ {currentExercise.breathingTip}
          </p>
        </div>

        {/* Navigation Between Exercises & Finish */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-neutral-800">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              disabled={currentExerciseIdx === 0}
              onClick={handlePrevExercise}
              className="flex-1 sm:flex-initial py-2.5 px-4 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed text-neutral-200 font-semibold text-xs rounded-xl border border-neutral-700 flex items-center justify-center gap-1 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <button
              type="button"
              disabled={currentExerciseIdx === routine.exercises.length - 1}
              onClick={handleNextExercise}
              className="flex-1 sm:flex-initial py-2.5 px-4 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed text-neutral-200 font-semibold text-xs rounded-xl border border-neutral-700 flex items-center justify-center gap-1 transition-colors"
            >
              <span>Next Movement</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleCompleteWorkout}
            className="w-full sm:w-auto py-2.5 px-6 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-extrabold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10 cursor-pointer"
          >
            <Trophy className="w-4 h-4" />
            <span>Finish & Record Workout</span>
          </button>
        </div>
      </div>

      {/* Workout Completed Victory Modal */}
      {isWorkoutCompleted && completedSummary && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-lg w-full p-8 space-y-6 shadow-2xl text-center relative animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto">
              <Trophy className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold block">
                Session Finished & Conquered
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-100">
                Outstanding Effort!
              </h2>
              <p className="text-sm text-neutral-400">
                You successfully crushed {completedSummary.routineTitle}.
              </p>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 py-2">
              <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800">
                <Clock className="w-4 h-4 text-sky-400 mx-auto mb-1" />
                <span className="text-[10px] text-neutral-500 uppercase block">Duration</span>
                <span className="text-base font-bold text-neutral-100 font-mono">
                  {formatTime(completedSummary.durationSeconds)}
                </span>
              </div>

              <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800">
                <Flame className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                <span className="text-[10px] text-neutral-500 uppercase block">Burned</span>
                <span className="text-base font-bold text-amber-400 font-mono">
                  {completedSummary.caloriesBurned} kcal
                </span>
              </div>

              <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800">
                <Dumbbell className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                <span className="text-[10px] text-neutral-500 uppercase block">Volume</span>
                <span className="text-base font-bold text-emerald-400 font-mono">
                  {completedSummary.totalVolumeKg} {unitSystem === 'metric' ? 'kg' : 'lbs'}
                </span>
              </div>

              <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800">
                <Check className="w-4 h-4 text-purple-400 mx-auto mb-1" />
                <span className="text-[10px] text-neutral-500 uppercase block">Sets Logged</span>
                <span className="text-base font-bold text-purple-400 font-mono">
                  {completedSummary.setsCompleted}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleSaveAndExit}
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-sm rounded-xl transition-colors shadow-lg shadow-amber-500/20 cursor-pointer"
              >
                Save to Workout History & Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
