import React, { useRef, useState } from 'react';
import { 
  BodyWeightLog, 
  WorkoutSessionLog, 
  UnitSystem, 
  UserProfile 
} from '../types/fitness';
import { kgToLbs } from '../utils/calculations';
import { 
  TrendingUp, 
  Calendar, 
  Trophy, 
  Dumbbell, 
  Clock, 
  Flame, 
  Download, 
  Upload, 
  Trash2, 
  Check, 
  ArrowUpRight, 
  ArrowDownRight,
  Scale
} from 'lucide-react';

interface ProgressHistoryProps {
  weightLogs: BodyWeightLog[];
  workoutLogs: WorkoutSessionLog[];
  unitSystem: UnitSystem;
  onClearHistory: () => void;
  onImportData: (data: { weightLogs: BodyWeightLog[]; workoutLogs: WorkoutSessionLog[] }) => void;
}

export const ProgressHistory: React.FC<ProgressHistoryProps> = ({
  weightLogs,
  workoutLogs,
  unitSystem,
  onClearHistory,
  onImportData,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importNotice, setImportNotice] = useState<string | null>(null);

  // Aggregated Stats
  const totalWorkouts = workoutLogs.length;
  const totalVolume = workoutLogs.reduce((acc, log) => acc + (log.totalVolumeKg || 0), 0);
  const totalCalories = workoutLogs.reduce((acc, log) => acc + (log.caloriesBurned || 0), 0);
  const totalMinutes = Math.round(
    workoutLogs.reduce((acc, log) => acc + (log.durationSeconds || 0), 0) / 60
  );

  // Export JSON
  const handleExportJSON = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      weightLogs,
      workoutLogs,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `forgefit-progress-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.weightLogs || parsed.workoutLogs) {
          onImportData({
            weightLogs: parsed.weightLogs || [],
            workoutLogs: parsed.workoutLogs || [],
          });
          setImportNotice('Data imported successfully!');
          setTimeout(() => setImportNotice(null), 3000);
        } else {
          setImportNotice('Invalid backup file structure.');
          setTimeout(() => setImportNotice(null), 3000);
        }
      } catch {
        setImportNotice('Failed to parse JSON file.');
        setTimeout(() => setImportNotice(null), 3000);
      }
    };
    reader.readAsText(file);
  };

  // Sparkline calculation for weight history
  const sortedWeights = [...weightLogs].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const minWeight = sortedWeights.length > 0 ? Math.min(...sortedWeights.map((w) => w.weightKg)) : 60;
  const maxWeight = sortedWeights.length > 0 ? Math.max(...sortedWeights.map((w) => w.weightKg)) : 80;
  const weightRange = Math.max(1, maxWeight - minWeight);

  const formatSecs = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-amber-400 font-semibold mb-1">
            <TrendingUp className="w-4 h-4" />
            <span>Progressive Overload & Body Metamorphosis</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-100 tracking-tight">
            Activity History & Analytics
          </h1>
          <p className="mt-2 text-sm sm:text-base text-neutral-400 max-w-2xl">
            Audit your training volume, body composition trajectories, and lifetime workout consistency.
          </p>
        </div>

        {/* Data export / import */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportJSON}
            accept=".json"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="py-2 px-3 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs font-semibold rounded-xl border border-neutral-800 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Import Backup JSON"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import</span>
          </button>
          <button
            type="button"
            onClick={handleExportJSON}
            className="py-2 px-3 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs font-semibold rounded-xl border border-neutral-800 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Export Backup JSON"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {importNotice && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-500/50 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{importNotice}</span>
        </div>
      )}

      {/* Aggregate Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
          <div className="flex items-center gap-2 text-xs text-neutral-400 mb-1">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Workouts Done</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-neutral-100 font-mono">
            {totalWorkouts}
          </div>
          <span className="text-[10px] text-neutral-500">Recorded sessions</span>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
          <div className="flex items-center gap-2 text-xs text-neutral-400 mb-1">
            <Flame className="w-4 h-4 text-rose-400" />
            <span>Energy Burned</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-400 font-mono">
            {totalCalories.toLocaleString()}
          </div>
          <span className="text-[10px] text-neutral-500">kcal cumulative</span>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
          <div className="flex items-center gap-2 text-xs text-neutral-400 mb-1">
            <Dumbbell className="w-4 h-4 text-emerald-400" />
            <span>Total Volume</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
            {totalVolume.toLocaleString()}
          </div>
          <span className="text-[10px] text-neutral-500">{unitSystem === 'metric' ? 'kg' : 'lbs'} lifted</span>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
          <div className="flex items-center gap-2 text-xs text-neutral-400 mb-1">
            <Clock className="w-4 h-4 text-sky-400" />
            <span>Training Time</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-sky-400 font-mono">
            {totalMinutes}
          </div>
          <span className="text-[10px] text-neutral-500">total minutes</span>
        </div>
      </div>

      {/* Body Weight & BMI Trajectory Chart Card */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-neutral-100 flex items-center gap-2">
              <Scale className="w-5 h-5 text-amber-400" />
              <span>Weight & BMI Trajectory</span>
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Consistent weigh-ins under identical conditions (morning fasting) provide the cleanest signal.
            </p>
          </div>

          {sortedWeights.length >= 2 && (
            <div className="flex items-center gap-2 text-xs font-mono">
              {sortedWeights[sortedWeights.length - 1].weightKg < sortedWeights[0].weightKg ? (
                <div className="text-emerald-400 flex items-center gap-1 font-bold">
                  <ArrowDownRight className="w-4 h-4" />
                  <span>
                    -{(sortedWeights[0].weightKg - sortedWeights[sortedWeights.length - 1].weightKg).toFixed(1)} kg delta
                  </span>
                </div>
              ) : (
                <div className="text-amber-400 flex items-center gap-1 font-bold">
                  <ArrowUpRight className="w-4 h-4" />
                  <span>
                    +{(sortedWeights[sortedWeights.length - 1].weightKg - sortedWeights[0].weightKg).toFixed(1)} kg delta
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Visual Trend Line Graph */}
        {sortedWeights.length > 1 ? (
          <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-2">
            <div className="h-40 w-full relative flex items-end">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 400 100">
                {/* Reference Grid lines */}
                <line x1="0" y1="20" x2="400" y2="20" stroke="#262626" strokeDasharray="3 3" />
                <line x1="0" y1="50" x2="400" y2="50" stroke="#262626" strokeDasharray="3 3" />
                <line x1="0" y1="80" x2="400" y2="80" stroke="#262626" strokeDasharray="3 3" />

                {/* Polyline */}
                {(() => {
                  const points = sortedWeights
                    .map((item, idx) => {
                      const x = (idx / (sortedWeights.length - 1)) * 390 + 5;
                      const normalizedY = 1 - (item.weightKg - minWeight) / weightRange;
                      const y = Math.max(10, Math.min(90, normalizedY * 80 + 10));
                      return `${x},${y}`;
                    })
                    .join(' ');

                  return (
                    <>
                      <polyline
                        fill="none"
                        stroke="#F59E0B"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        points={points}
                      />
                      {sortedWeights.map((item, idx) => {
                        const x = (idx / (sortedWeights.length - 1)) * 390 + 5;
                        const normalizedY = 1 - (item.weightKg - minWeight) / weightRange;
                        const y = Math.max(10, Math.min(90, normalizedY * 80 + 10));
                        return (
                          <g key={item.id}>
                            <circle cx={x} cy={y} r="4" fill="#0A0A0A" stroke="#F59E0B" strokeWidth="2.5" />
                          </g>
                        );
                      })}
                    </>
                  );
                })()}
              </svg>
            </div>

            <div className="flex justify-between text-[11px] font-mono text-neutral-500 pt-1 border-t border-neutral-900">
              <span>{sortedWeights[0].date}</span>
              <span>
                Min: {unitSystem === 'metric' ? `${minWeight}kg` : `${kgToLbs(minWeight)}lbs`} · Max: {unitSystem === 'metric' ? `${maxWeight}kg` : `${kgToLbs(maxWeight)}lbs`}
              </span>
              <span>{sortedWeights[sortedWeights.length - 1].date}</span>
            </div>
          </div>
        ) : (
          <div className="bg-neutral-950 p-6 rounded-xl border border-neutral-800 text-center text-xs text-neutral-500">
            Log at least 2 weight entries in the BMI tab to view your progress trend graph.
          </div>
        )}

        {/* Weight logs table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-800 text-neutral-400 font-mono uppercase tracking-wider">
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Recorded Weight</th>
                <th className="py-2.5 px-3">Calculated BMI</th>
                <th className="py-2.5 px-3">Category</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 font-mono">
              {[...sortedWeights].reverse().map((entry) => (
                <tr key={entry.id} className="hover:bg-neutral-850/50 transition-colors">
                  <td className="py-2.5 px-3 text-neutral-300">{entry.date}</td>
                  <td className="py-2.5 px-3 text-neutral-100 font-bold">
                    {unitSystem === 'metric' ? `${entry.weightKg} kg` : `${kgToLbs(entry.weightKg)} lbs`}
                  </td>
                  <td className="py-2.5 px-3 text-amber-400 font-bold">{entry.bmi}</td>
                  <td className="py-2.5 px-3 text-neutral-400">
                    {entry.bmi < 18.5
                      ? 'Underweight'
                      : entry.bmi < 25
                      ? 'Normal'
                      : entry.bmi < 30
                      ? 'Overweight'
                      : 'Obese'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Completed Workouts Log Card */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
          <h2 className="text-lg font-bold text-neutral-100 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <span>Completed Workout Sessions ({workoutLogs.length})</span>
          </h2>

          {workoutLogs.length > 0 && (
            <button
              type="button"
              onClick={onClearHistory}
              className="text-neutral-500 hover:text-rose-400 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          )}
        </div>

        {workoutLogs.length === 0 ? (
          <div className="bg-neutral-950 p-8 rounded-xl border border-neutral-800 text-center space-y-3">
            <Dumbbell className="w-8 h-8 text-neutral-600 mx-auto" />
            <h3 className="text-sm font-bold text-neutral-300">No Workout Sessions Logged Yet</h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              Select any routine from the Full Body Workouts tab and tap "Start Workout" to launch the active live player.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {workoutLogs.map((log) => (
              <div
                key={log.id}
                className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-mono text-neutral-500">
                    <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{new Date(log.startTime).toLocaleDateString()}</span>
                    <span>·</span>
                    <span>{new Date(log.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <h3 className="text-base font-bold text-neutral-100">
                    {log.routineTitle}
                  </h3>
                </div>

                <div className="flex items-center gap-3 text-xs font-mono">
                  <div className="bg-neutral-900 px-3 py-1.5 rounded-lg border border-neutral-800 text-neutral-300 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-sky-400" />
                    <span>{formatSecs(log.durationSeconds)}</span>
                  </div>

                  <div className="bg-neutral-900 px-3 py-1.5 rounded-lg border border-neutral-800 text-amber-400 font-bold flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5" />
                    <span>{log.caloriesBurned} kcal</span>
                  </div>

                  <div className="bg-neutral-900 px-3 py-1.5 rounded-lg border border-neutral-800 text-emerald-400 flex items-center gap-1.5">
                    <Dumbbell className="w-3.5 h-3.5" />
                    <span>{log.totalVolumeKg} {unitSystem === 'metric' ? 'kg' : 'lbs'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
