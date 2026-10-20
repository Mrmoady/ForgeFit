import React from 'react';

interface ExerciseIllustrationProps {
  type: string;
  className?: string;
}

export const ExerciseIllustration: React.FC<ExerciseIllustrationProps> = ({ type, className = 'w-16 h-16' }) => {
  switch (type) {
    case 'squat':
      return (
        <svg viewBox="0 0 80 80" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          {/* Head */}
          <circle cx="36" cy="22" r="7" className="stroke-amber-400" />
          {/* Torso */}
          <path d="M36 29 L38 48" className="stroke-neutral-200" />
          {/* Hips & Thigh (squat angle) */}
          <path d="M38 48 L22 52 L26 72" className="stroke-amber-400" />
          <path d="M38 48 L46 54 L44 72" className="stroke-neutral-300" />
          {/* Arms holding goblet dumbbell */}
          <path d="M36 33 L45 36 L43 44" className="stroke-neutral-400" />
          {/* Dumbbell / weight */}
          <rect x="42" y="36" width="6" height="12" rx="2" className="fill-amber-400/20 stroke-amber-400" />
          {/* Ground */}
          <line x1="16" y1="72" x2="64" y2="72" className="stroke-neutral-600 stroke-[1.5]" />
        </svg>
      );
    case 'deadlift':
      return (
        <svg viewBox="0 0 80 80" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          {/* Head */}
          <circle cx="30" cy="24" r="7" className="stroke-amber-400" />
          {/* Hinged Spine */}
          <path d="M30 31 L44 42" className="stroke-neutral-200" />
          {/* Legs */}
          <path d="M44 42 L42 56 L44 72" className="stroke-amber-400" />
          <path d="M44 42 L52 56 L52 72" className="stroke-neutral-400" />
          {/* Arms hanging */}
          <path d="M34 34 L32 58" className="stroke-neutral-300" />
          {/* Dumbbells / Barbell */}
          <circle cx="32" cy="60" r="5" className="fill-amber-400/20 stroke-amber-400" />
          {/* Ground */}
          <line x1="16" y1="72" x2="64" y2="72" className="stroke-neutral-600 stroke-[1.5]" />
        </svg>
      );
    case 'press':
      return (
        <svg viewBox="0 0 80 80" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          {/* Bench */}
          <line x1="16" y1="56" x2="64" y2="56" className="stroke-neutral-600 stroke-[3]" />
          <line x1="24" y1="56" x2="24" y2="72" className="stroke-neutral-700 stroke-[2]" />
          <line x1="56" y1="56" x2="56" y2="72" className="stroke-neutral-700 stroke-[2]" />
          {/* Head */}
          <circle cx="26" cy="46" r="6" className="stroke-amber-400" />
          {/* Torso on bench */}
          <line x1="32" y1="52" x2="52" y2="52" className="stroke-neutral-200" />
          {/* Legs down */}
          <path d="M52 52 L58 58 L58 72" className="stroke-neutral-400" />
          {/* Arms pressing up */}
          <path d="M38 52 L36 32 L40 22" className="stroke-amber-400" />
          {/* Dumbbell */}
          <rect x="34" y="19" width="12" height="5" rx="1.5" className="fill-amber-400/20 stroke-amber-400" />
        </svg>
      );
    case 'row':
      return (
        <svg viewBox="0 0 80 80" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          {/* Head */}
          <circle cx="28" cy="28" r="6" className="stroke-amber-400" />
          {/* Flat spine */}
          <path d="M32 32 L54 36" className="stroke-neutral-200" />
          {/* Stance Legs */}
          <path d="M54 36 L58 54 L60 72" className="stroke-neutral-400" />
          <path d="M54 36 L48 54 L46 72" className="stroke-neutral-300" />
          {/* Row Arm pulled up */}
          <path d="M36 33 L44 26 L42 42" className="stroke-amber-400" />
          {/* Dumbbell */}
          <circle cx="42" cy="44" r="5" className="fill-amber-400/20 stroke-amber-400" />
          {/* Ground */}
          <line x1="16" y1="72" x2="68" y2="72" className="stroke-neutral-600 stroke-[1.5]" />
        </svg>
      );
    case 'overhead':
      return (
        <svg viewBox="0 0 80 80" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          {/* Head */}
          <circle cx="40" cy="30" r="6" className="stroke-amber-400" />
          {/* Torso */}
          <line x1="40" y1="36" x2="40" y2="54" className="stroke-neutral-200" />
          {/* Legs */}
          <path d="M40 54 L34 72" className="stroke-neutral-300" />
          <path d="M40 54 L46 72" className="stroke-neutral-300" />
          {/* Arms overhead */}
          <path d="M40 38 L30 26 L30 14" className="stroke-amber-400" />
          <path d="M40 38 L50 26 L50 14" className="stroke-amber-400" />
          {/* Dumbbells overhead */}
          <rect x="25" y="11" width="10" height="4" rx="1.5" className="fill-amber-400/20 stroke-amber-400" />
          <rect x="45" y="11" width="10" height="4" rx="1.5" className="fill-amber-400/20 stroke-amber-400" />
        </svg>
      );
    case 'core':
      return (
        <svg viewBox="0 0 80 80" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          {/* Floor */}
          <line x1="14" y1="62" x2="66" y2="62" className="stroke-neutral-600 stroke-[1.5]" />
          {/* Forearms/Hands */}
          <line x1="22" y1="62" x2="26" y2="52" className="stroke-neutral-300" />
          {/* Head */}
          <circle cx="20" cy="46" r="6" className="stroke-amber-400" />
          {/* Straight Plank Torso */}
          <line x1="26" y1="50" x2="56" y2="56" className="stroke-amber-400 stroke-[3]" />
          {/* Feet/Toes */}
          <line x1="56" y1="56" x2="62" y2="62" className="stroke-neutral-400" />
        </svg>
      );
    case 'pushup':
      return (
        <svg viewBox="0 0 80 80" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="64" x2="68" y2="64" className="stroke-neutral-600 stroke-[1.5]" />
          <circle cx="18" cy="42" r="6" className="stroke-amber-400" />
          <line x1="22" y1="48" x2="58" y2="58" className="stroke-amber-400 stroke-[2.5]" />
          <path d="M26 48 L22 56 L24 64" className="stroke-neutral-300" />
          <line x1="58" y1="58" x2="64" y2="64" className="stroke-neutral-400" />
        </svg>
      );
    case 'swing':
    case 'thruster':
      return (
        <svg viewBox="0 0 80 80" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="36" cy="22" r="7" className="stroke-amber-400" />
          <path d="M36 29 L38 48" className="stroke-neutral-200" />
          <path d="M38 48 L26 72" className="stroke-neutral-300" />
          <path d="M38 48 L48 72" className="stroke-neutral-300" />
          <path d="M36 33 L52 24" className="stroke-amber-400" />
          <circle cx="56" cy="22" r="6" className="fill-amber-400/30 stroke-amber-400" />
          <line x1="18" y1="72" x2="62" y2="72" className="stroke-neutral-600 stroke-[1.5]" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 80 80" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="40" cy="26" r="8" className="stroke-amber-400" />
          <line x1="40" y1="34" x2="40" y2="52" className="stroke-neutral-200" />
          <path d="M40 52 L32 72" className="stroke-neutral-300" />
          <path d="M40 52 L48 72" className="stroke-neutral-300" />
          <path d="M30 40 L40 38 L50 40" className="stroke-amber-400" />
        </svg>
      );
  }
};
