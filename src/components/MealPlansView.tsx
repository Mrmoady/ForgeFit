import React, { useState } from 'react';
import { MealPlan, FitnessGoal, MealItem, RecipeIngredient, BMIAssessment } from '../types/fitness';
import { MEAL_PLANS } from '../data/mealPlans';
import { 
  Utensils, 
  Flame, 
  Droplet, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  Copy, 
  Sparkles, 
  ShoppingCart, 
  Scale, 
  ChefHat, 
  Sliders 
} from 'lucide-react';

interface MealPlansViewProps {
  userGoal: FitnessGoal;
  assessment: BMIAssessment;
  waterGlassesDrunk: number;
  onUpdateWaterGlasses: (count: number) => void;
}

export const MealPlansView: React.FC<MealPlansViewProps> = ({
  userGoal,
  assessment,
  waterGlassesDrunk,
  onUpdateWaterGlasses,
}) => {
  // Default selected plan matching user goal
  const defaultPlan = MEAL_PLANS.find((p) => p.goalType === userGoal) || MEAL_PLANS[0];
  const [activePlanId, setActivePlanId] = useState<string>(defaultPlan.id);
  const [scaleToUserCalories, setScaleToUserCalories] = useState<boolean>(true);
  const [expandedMealId, setExpandedMealId] = useState<string | null>(null);
  const [checkedGroceryItems, setCheckedGroceryItems] = useState<Record<string, boolean>>({});
  const [copiedGrocery, setCopiedGrocery] = useState(false);
  const [activeTab, setActiveTab] = useState<'meals' | 'grocery' | 'hydration'>('meals');

  const activePlan = MEAL_PLANS.find((p) => p.id === activePlanId) || MEAL_PLANS[0];

  // Calorie scaling factor
  const scalingRatio = scaleToUserCalories
    ? assessment.targetMacros.calories / activePlan.targetDailyCalories
    : 1;

  const scaledCalories = Math.round(activePlan.targetDailyCalories * scalingRatio);
  const scaledProtein = Math.round(
    ((scaledCalories * (activePlan.macroRatio.proteinPct / 100)) / 4)
  );
  const scaledCarbs = Math.round(
    ((scaledCalories * (activePlan.macroRatio.carbsPct / 100)) / 4)
  );
  const scaledFats = Math.round(
    ((scaledCalories * (activePlan.macroRatio.fatsPct / 100)) / 9)
  );

  // Group all ingredients from active plan for grocery checklist
  const groceryByCategory: Record<string, RecipeIngredient[]> = {};
  activePlan.meals.forEach((meal) => {
    meal.ingredients.forEach((ing) => {
      if (!groceryByCategory[ing.category]) {
        groceryByCategory[ing.category] = [];
      }
      if (!groceryByCategory[ing.category].some((x) => x.name === ing.name)) {
        groceryByCategory[ing.category].push(ing);
      }
    });
  });

  const toggleGroceryItem = (name: string) => {
    setCheckedGroceryItems((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const handleCopyGroceryList = () => {
    let text = `🛒 ForgeFit Grocery List - ${activePlan.title} (${scaledCalories} kcal/day)\n\n`;
    Object.entries(groceryByCategory).forEach(([category, items]) => {
      text += `--- ${category.toUpperCase()} ---\n`;
      items.forEach((item) => {
        text += `[ ] ${item.name} (${item.amount})\n`;
      });
      text += '\n';
    });

    navigator.clipboard.writeText(text);
    setCopiedGrocery(true);
    setTimeout(() => setCopiedGrocery(false), 2500);
  };

  const totalTargetGlasses = Math.max(6, Math.round(assessment.dailyWaterMl / 250));

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header section */}
      <div>
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-amber-400 font-semibold mb-1">
          <Utensils className="w-4 h-4" />
          <span>Science-Based Precision Nutrition</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-100 tracking-tight">
          Suitable Nutrition & Meal Plans
        </h1>
        <p className="mt-2 text-sm sm:text-base text-neutral-400 max-w-2xl">
          Complete daily meal structures with exact macro breakdowns, rapid prep instructions, and automated grocery lists tailored to your metabolic requirements.
        </p>
      </div>

      {/* Plan Selector Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {MEAL_PLANS.map((plan) => {
          const isSelected = plan.id === activePlanId;
          const isRecommended = plan.goalType === userGoal;

          return (
            <button
              key={plan.id}
              type="button"
              onClick={() => setActivePlanId(plan.id)}
              className={`p-3 text-left rounded-xl border transition-all cursor-pointer relative ${
                isSelected
                  ? 'bg-amber-500/10 border-amber-500 text-neutral-100 shadow-md shadow-amber-500/5'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'
              }`}
            >
              {isRecommended && (
                <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider block mb-1">
                  ★ Goal Match
                </span>
              )}
              <div className="text-xs font-bold truncate text-neutral-100">
                {plan.title}
              </div>
              <div className="text-[11px] text-neutral-500 mt-1">
                {plan.dietStyle} · {plan.targetDailyCalories} kcal
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Plan Overview Card */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-neutral-400 font-medium">
              <span className="text-amber-400 font-semibold">{activePlan.dietStyle}</span>
              <span aria-hidden="true">·</span>
              <span>{activePlan.meals.length} Structured Meals</span>
              <span aria-hidden="true">·</span>
              <span className="text-sky-400">{activePlan.hydrationTarget}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-100">
              {activePlan.title}
            </h2>
            <p className="text-sm text-neutral-300 max-w-2xl">
              {activePlan.summary}
            </p>
          </div>

          {/* Calorie scaling toggle based on BMI & TDEE */}
          <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-3.5 space-y-2 shrink-0">
            <div className="flex items-center justify-between gap-3 text-xs">
              <span className="text-neutral-400 font-medium flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-amber-400" />
                <span>Scale to your BMI/TDEE Goal</span>
              </span>
              <button
                type="button"
                onClick={() => setScaleToUserCalories(!scaleToUserCalories)}
                className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                  scaleToUserCalories ? 'bg-amber-500' : 'bg-neutral-800'
                }`}
              >
                <div
                  className={`w-3.5 h-3.5 rounded-full bg-neutral-950 absolute top-0.5 transition-transform ${
                    scaleToUserCalories ? 'translate-x-4' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <div className="text-[11px] text-neutral-500 font-mono">
              {scaleToUserCalories ? (
                <span className="text-amber-300">
                  Scaled to your target: <strong>{assessment.targetMacros.calories} kcal/day</strong>
                </span>
              ) : (
                <span>Standard baseline plan calories</span>
              )}
            </div>
          </div>
        </div>

        {/* Daily Macronutrient Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800">
            <span className="text-xs text-neutral-400 block font-medium">Daily Energy</span>
            <span className="text-2xl font-black text-amber-400 font-mono mt-0.5 block">
              {scaledCalories}
            </span>
            <span className="text-[10px] text-neutral-500 font-mono">kcal total</span>
          </div>

          <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800">
            <span className="text-xs text-neutral-400 block font-medium">Protein ({activePlan.macroRatio.proteinPct}%)</span>
            <span className="text-2xl font-black text-emerald-400 font-mono mt-0.5 block">
              {scaledProtein}g
            </span>
            <span className="text-[10px] text-neutral-500 font-mono">~{(scaledProtein * 4)} kcal</span>
          </div>

          <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800">
            <span className="text-xs text-neutral-400 block font-medium">Carbohydrates ({activePlan.macroRatio.carbsPct}%)</span>
            <span className="text-2xl font-black text-sky-400 font-mono mt-0.5 block">
              {scaledCarbs}g
            </span>
            <span className="text-[10px] text-neutral-500 font-mono">~{(scaledCarbs * 4)} kcal</span>
          </div>

          <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800">
            <span className="text-xs text-neutral-400 block font-medium">Healthy Fats ({activePlan.macroRatio.fatsPct}%)</span>
            <span className="text-2xl font-black text-rose-400 font-mono mt-0.5 block">
              {scaledFats}g
            </span>
            <span className="text-[10px] text-neutral-500 font-mono">~{(scaledFats * 9)} kcal</span>
          </div>
        </div>

        {/* Nutrition Principles */}
        <div className="bg-neutral-950/80 p-4 rounded-xl border border-neutral-800/80 space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-300 block">
            Core Nutritional Strategy:
          </span>
          {activePlan.keyNutritionPrinciples.map((principle, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-neutral-400">
              <span className="text-amber-400 font-bold">•</span>
              <span>{principle}</span>
            </div>
          ))}
        </div>

        {/* View Switcher Tabs (Meals vs Grocery Checklist vs Hydration) */}
        <div className="flex items-center gap-2 border-b border-neutral-800 pt-2">
          <button
            type="button"
            onClick={() => setActiveTab('meals')}
            className={`pb-3 px-2 text-sm font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'meals'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Daily Meals & Recipes ({activePlan.meals.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('grocery')}
            className={`pb-3 px-2 text-sm font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'grocery'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Interactive Grocery List</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('hydration')}
            className={`pb-3 px-2 text-sm font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'hydration'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Droplet className="w-4 h-4" />
            <span>Daily Hydration Tracker</span>
          </button>
        </div>

        {/* TAB 1: MEALS & RECIPES */}
        {activeTab === 'meals' && (
          <div className="space-y-4">
            {activePlan.meals.map((meal) => {
              const isExpanded = expandedMealId === meal.id;
              const mealCalories = Math.round(meal.calories * scalingRatio);
              const mealProtein = Math.round(meal.protein * scalingRatio);
              const mealCarbs = Math.round(meal.carbs * scalingRatio);
              const mealFats = Math.round(meal.fats * scalingRatio);
              const mealFiber = Math.round(meal.fiber * scalingRatio);

              return (
                <div
                  key={meal.id}
                  className="bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden transition-all"
                >
                  <div
                    onClick={() => setExpandedMealId(isExpanded ? null : meal.id)}
                    className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-neutral-900/50 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs font-mono">
                        <span className="text-amber-400 uppercase font-bold tracking-wider">
                          {meal.mealType}
                        </span>
                        <span className="text-neutral-600">·</span>
                        <span className="text-neutral-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {meal.prepTimeMin} mins prep
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-neutral-100">
                        {meal.name}
                      </h3>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-4">
                      {/* Macro chips */}
                      <div className="flex items-center gap-2 text-xs font-mono">
                        <span className="text-neutral-200 font-bold bg-neutral-900 px-2 py-1 rounded border border-neutral-800">
                          {mealCalories} kcal
                        </span>
                        <span className="text-emerald-400 bg-neutral-900 px-2 py-1 rounded border border-neutral-800">
                          {mealProtein}g P
                        </span>
                        <span className="text-sky-400 bg-neutral-900 px-2 py-1 rounded border border-neutral-800">
                          {mealCarbs}g C
                        </span>
                        <span className="text-rose-400 bg-neutral-900 px-2 py-1 rounded border border-neutral-800">
                          {mealFats}g F
                        </span>
                      </div>

                      <div className="text-neutral-400 p-1">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded recipe and ingredients */}
                  {isExpanded && (
                    <div className="p-5 border-t border-neutral-800/80 bg-neutral-900/30 space-y-5 text-xs">
                      {/* Ingredients List */}
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-neutral-300 block mb-2">
                          Ingredients & Measurements
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                          {meal.ingredients.map((ing, i) => (
                            <div
                              key={i}
                              className="bg-neutral-950 p-2.5 rounded-lg border border-neutral-800 flex items-center justify-between"
                            >
                              <span className="text-neutral-200 font-medium">{ing.name}</span>
                              <span className="text-amber-400 font-mono">{ing.amount}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Preparation Steps */}
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-neutral-300 block mb-2">
                          Step-by-Step Cooking Method
                        </span>
                        <div className="space-y-2">
                          {meal.cookingSteps.map((step, i) => (
                            <div key={i} className="flex items-start gap-2.5 text-neutral-300">
                              <span className="w-5 h-5 rounded-full bg-neutral-900 border border-neutral-800 text-amber-400 flex items-center justify-center font-mono font-bold shrink-0 text-[10px]">
                                {i + 1}
                              </span>
                              <span className="pt-0.5 leading-relaxed">{step}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Chef's Nutrition Tip */}
                      <div className="bg-neutral-950 p-3 rounded-lg border border-neutral-800 flex items-start gap-2.5 text-neutral-400">
                        <ChefHat className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-neutral-200 font-semibold">Chef's Pro Tip: </strong>
                          <span>{meal.chefTip}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 2: GROCERY CHECKLIST */}
        {activeTab === 'grocery' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-neutral-950 p-4 rounded-xl border border-neutral-800">
              <div>
                <h3 className="text-sm font-bold text-neutral-100 flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-amber-400" />
                  <span>Automated Weekly Grocery Shopping List</span>
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Extracted from all ingredients in {activePlan.title}. Tap items as you add them to your cart.
                </p>
              </div>

              <button
                type="button"
                onClick={handleCopyGroceryList}
                className="py-2 px-4 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold rounded-lg border border-neutral-700 flex items-center gap-2 transition-colors cursor-pointer self-start sm:self-auto"
              >
                {copiedGrocery ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-bold">Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Full Checklist</span>
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(groceryByCategory).map(([category, items]) => (
                <div key={category} className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block border-b border-neutral-800/80 pb-2">
                    {category.replace('_', ' ')}
                  </span>
                  <div className="space-y-2">
                    {items.map((item) => {
                      const isChecked = !!checkedGroceryItems[item.name];
                      return (
                        <div
                          key={item.name}
                          onClick={() => toggleGroceryItem(item.name)}
                          className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors text-xs ${
                            isChecked
                              ? 'bg-neutral-900/40 text-neutral-500 line-through'
                              : 'bg-neutral-900 text-neutral-200 hover:bg-neutral-850'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div
                              className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                                isChecked
                                  ? 'bg-emerald-500 border-emerald-500 text-neutral-950'
                                  : 'border-neutral-700 bg-neutral-950'
                              }`}
                            >
                              {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                            <span className="truncate">{item.name}</span>
                          </div>
                          <span className="font-mono text-[11px] text-neutral-400 shrink-0 ml-2">
                            {item.amount}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: HYDRATION TRACKER */}
        {activeTab === 'hydration' && (
          <div className="bg-neutral-950 p-6 rounded-xl border border-neutral-800 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-sky-400 flex items-center gap-1.5 mb-1">
                  <Droplet className="w-4 h-4" />
                  <span>Fluid & Electrolyte Balance</span>
                </span>
                <h3 className="text-xl font-bold text-neutral-100">
                  Daily Water Target: {(assessment.dailyWaterMl / 1000).toFixed(1)}L
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Drink {totalTargetGlasses} glasses (250ml each) spread evenly across morning, workout window, and evening.
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs text-neutral-400 block">Today's Total</span>
                <span className="text-3xl font-black text-sky-400 font-mono">
                  {(waterGlassesDrunk * 250) / 1000}L
                </span>
                <span className="text-xs text-neutral-500 block">
                  {waterGlassesDrunk} of {totalTargetGlasses} glasses
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="h-3 w-full bg-neutral-900 rounded-full overflow-hidden border border-neutral-800">
                <div
                  className="h-full bg-gradient-to-r from-sky-500 to-cyan-400 transition-all duration-300 rounded-full"
                  style={{
                    width: `${Math.min(100, Math.round((waterGlassesDrunk / totalTargetGlasses) * 100))}%`,
                  }}
                />
              </div>
              <div className="flex justify-between text-[11px] font-mono text-neutral-500">
                <span>0 ml</span>
                <span>{Math.min(100, Math.round((waterGlassesDrunk / totalTargetGlasses) * 100))}% Hydrated</span>
                <span>{assessment.dailyWaterMl} ml</span>
              </div>
            </div>

            {/* Interactive Glasses Grid */}
            <div className="space-y-3">
              <span className="text-xs font-semibold text-neutral-300 block">
                Tap glass to log +250ml:
              </span>
              <div className="flex flex-wrap gap-2.5">
                {Array.from({ length: totalTargetGlasses }, (_, i) => {
                  const isDrunk = i < waterGlassesDrunk;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => onUpdateWaterGlasses(isDrunk ? i : i + 1)}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        isDrunk
                          ? 'bg-sky-500/20 border-sky-400 text-sky-300 shadow-sm'
                          : 'bg-neutral-900 border-neutral-800 text-neutral-600 hover:border-neutral-700 hover:text-neutral-400'
                      }`}
                      title={`Glass #${i + 1} (250ml)`}
                    >
                      <Droplet className={`w-5 h-5 mx-auto ${isDrunk ? 'fill-sky-400 text-sky-400' : ''}`} />
                      <span className="text-[10px] font-mono block mt-1"># {i + 1}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => onUpdateWaterGlasses(waterGlassesDrunk + 1)}
                  className="py-1.5 px-3 bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 rounded-lg text-xs font-semibold border border-sky-500/30"
                >
                  + Add 1 Glass (250ml)
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateWaterGlasses(Math.max(0, waterGlassesDrunk - 1))}
                  className="py-1.5 px-3 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 rounded-lg text-xs font-semibold border border-neutral-800"
                >
                  - Remove Glass
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateWaterGlasses(0)}
                  className="py-1.5 px-3 bg-neutral-900 hover:bg-neutral-800 text-neutral-500 rounded-lg text-xs font-semibold border border-neutral-800"
                >
                  Reset Today
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
