import { MealPlan } from '../types/fitness';

export const MEAL_PLANS: MealPlan[] = [
  {
    id: 'high-protein-muscle',
    title: 'High-Protein Muscle Builder',
    goalType: 'lean_muscle',
    dietStyle: 'High-Protein',
    summary: 'Optimized for muscle protein synthesis, clean hypertrophic surplus, and sustained glycogen replenishment.',
    targetDailyCalories: 2650,
    macroRatio: {
      proteinPct: 32,
      carbsPct: 48,
      fatsPct: 20
    },
    hydrationTarget: '3.2 - 3.8 Liters per day',
    keyNutritionPrinciples: [
      'Even distribution of 35-45g high-quality protein every 3-4 hours',
      'Complex carbohydrates timed around workout window for muscle glycogen storage',
      'Leucine-rich sources (eggs, chicken, greek yogurt, whey/casein) for anabolic signaling'
    ],
    meals: [
      {
        id: 'hp-breakfast',
        name: 'Power Protein Oats & Scrambled Eggs',
        mealType: 'breakfast',
        calories: 620,
        protein: 48,
        carbs: 65,
        fats: 18,
        fiber: 9,
        prepTimeMin: 12,
        ingredients: [
          { name: 'Rolled Oats', amount: '80g', category: 'grains' },
          { name: 'Eggs (Whole + Whites)', amount: '3 whole + 2 whites', category: 'protein' },
          { name: 'Whey Protein Powder', amount: '1 scoop (30g)', category: 'protein' },
          { name: 'Fresh Blueberries', amount: '80g', category: 'produce' },
          { name: 'Chia Seeds', amount: '1 tbsp (12g)', category: 'healthy_fats' },
          { name: 'Almond Milk (Unsweetened)', amount: '200ml', category: 'dairy' }
        ],
        cookingSteps: [
          'Simmer oats in almond milk for 4-5 minutes, remove from heat, then whisk in protein powder and chia seeds.',
          'Top warm oatmeal bowl with fresh antioxidant-rich blueberries.',
          'Scramble eggs softly in a non-stick pan over medium-low heat with a pinch of sea salt and black pepper.'
        ],
        chefTip: 'Never boil whey powder directly on high heat; let oatmeal cool for 60 seconds before stirring it in to preserve silky texture.'
      },
      {
        id: 'hp-lunch',
        name: 'Grilled Citrus Chicken & Sweet Potato Quinoa Bowl',
        mealType: 'lunch',
        calories: 710,
        protein: 56,
        carbs: 78,
        fats: 16,
        fiber: 11,
        prepTimeMin: 20,
        ingredients: [
          { name: 'Chicken Breast (Raw weight)', amount: '220g', category: 'protein' },
          { name: 'Roasted Sweet Potato', amount: '200g diced', category: 'produce' },
          { name: 'Cooked Quinoa', amount: '120g', category: 'grains' },
          { name: 'Baby Spinach & Kale', amount: '75g', category: 'produce' },
          { name: 'Extra Virgin Olive Oil', amount: '1 tsp (5ml)', category: 'healthy_fats' },
          { name: 'Lemon Juice & Herbs', amount: '2 tbsp', category: 'pantry' }
        ],
        cookingSteps: [
          'Season chicken breast with smoked paprika, garlic powder, cumin, salt, and lemon juice.',
          'Sear in a hot skillet for 6 minutes per side until internal temperature reaches 74°C (165°F).',
          'Toss warm sweet potato cubes and quinoa together over fresh spinach leaves.',
          'Slice chicken into strips, lay atop quinoa, and drizzle with fresh lemon-herb dressing.'
        ],
        chefTip: 'Batch-roast 1kg of sweet potatoes on Sunday for instant 15-minute weekday assembly.'
      },
      {
        id: 'hp-snack',
        name: 'Greek Yogurt Crunch & Banana Fuel',
        mealType: 'snack',
        calories: 420,
        protein: 34,
        carbs: 52,
        fats: 8,
        fiber: 5,
        prepTimeMin: 5,
        ingredients: [
          { name: 'Non-Fat Greek Yogurt (0%)', amount: '250g', category: 'dairy' },
          { name: 'Sliced Banana', amount: '1 medium (115g)', category: 'produce' },
          { name: 'Pure Honey or Maple', amount: '1 tsp (7g)', category: 'pantry' },
          { name: 'Crushed Walnuts or Almonds', amount: '15g', category: 'healthy_fats' }
        ],
        cookingSteps: [
          'Scoop cold Greek yogurt into a bowl.',
          'Layer freshly sliced banana and sprinkle crushed raw walnuts on top.',
          'Drizzle lightly with pure honey for rapid workout energy glycogen top-off.'
        ],
        chefTip: 'Consume this snack 60–90 minutes before your workout session for stable sustained energy without bloating.'
      },
      {
        id: 'hp-dinner',
        name: 'Pan-Seared Atlantic Salmon with Jasmine Rice & Asparagus',
        mealType: 'dinner',
        calories: 780,
        protein: 52,
        carbs: 72,
        fats: 28,
        fiber: 7,
        prepTimeMin: 22,
        ingredients: [
          { name: 'Atlantic Salmon Fillet', amount: '200g', category: 'protein' },
          { name: 'Steamed Jasmine Rice', amount: '180g cooked', category: 'grains' },
          { name: 'Tender Asparagus Spears', amount: '150g', category: 'produce' },
          { name: 'Garlic & Soy Glaze', amount: '1 tbsp', category: 'pantry' },
          { name: 'Sesame Seeds', amount: '1 tsp', category: 'healthy_fats' }
        ],
        cookingSteps: [
          'Season salmon with coarse sea salt and cracked black pepper.',
          'Sear skin-side down in a medium-hot skillet for 4 minutes until crisp, flip for 3 minutes.',
          'Toss asparagus in pan alongside garlic glaze for 3 minutes until vibrant and tender-crisp.',
          'Serve beside fragrant jasmine rice, garnished with toasted sesame seeds.'
        ],
        chefTip: 'Omega-3 fatty acids in wild salmon drastically reduce post-workout muscle soreness and systemic inflammation.'
      }
    ]
  },
  {
    id: 'metabolic-shred-deficit',
    title: 'Metabolic Shred & Fat Deficit Plan',
    goalType: 'fat_loss',
    dietStyle: 'Calorie Shred',
    summary: 'High satiety, massive nutrient volume, elevated protein floor, and caloric precision to shred body fat while preserving lean tissue.',
    targetDailyCalories: 1750,
    macroRatio: {
      proteinPct: 38,
      carbsPct: 35,
      fatsPct: 27
    },
    hydrationTarget: '3.0 - 3.5 Liters per day',
    keyNutritionPrinciples: [
      'High protein (2.0g+ per kg) to preserve skeletal muscle in a deficit',
      'Volumetric eating: high water content and high fiber vegetables to maintain fullness',
      'Zero liquid calories—stick strictly to water, black coffee, and green tea'
    ],
    meals: [
      {
        id: 'shred-breakfast',
        name: 'Fluffy Spinach & Feta Egg White Omelette with Berries',
        mealType: 'breakfast',
        calories: 360,
        protein: 38,
        carbs: 26,
        fats: 10,
        fiber: 6,
        prepTimeMin: 10,
        ingredients: [
          { name: 'Liquid Egg Whites', amount: '200ml (approx 6 whites)', category: 'protein' },
          { name: 'Whole Egg', amount: '1 large', category: 'protein' },
          { name: 'Baby Spinach', amount: '60g', category: 'produce' },
          { name: 'Crumbled Light Feta', amount: '30g', category: 'dairy' },
          { name: 'Fresh Strawberries', amount: '120g', category: 'produce' },
          { name: 'Olive Oil Cooking Spray', amount: '2 sprays', category: 'pantry' }
        ],
        cookingSteps: [
          'Mist a skillet with olive oil spray and wilt baby spinach for 60 seconds.',
          'Pour in whisked egg whites and whole egg, cook gently lifting edges.',
          'Sprinkle light feta cheese, fold omelette in half and plate.',
          'Serve with a side of cold, freshly sliced sweet strawberries.'
        ],
        chefTip: 'Strawberries have one of the lowest calorie densities of all fruits (only 32 kcal per 100g)!'
      },
      {
        id: 'shred-lunch',
        name: 'Zesty Lime Turkey Taco Bowl with Cauliflower Rice',
        mealType: 'lunch',
        calories: 490,
        protein: 48,
        carbs: 38,
        fats: 14,
        fiber: 10,
        prepTimeMin: 15,
        ingredients: [
          { name: 'Lean Ground Turkey (93/7)', amount: '200g', category: 'protein' },
          { name: 'Riced Cauliflower', amount: '150g', category: 'produce' },
          { name: 'Black Beans (Rinsed)', amount: '60g', category: 'grains' },
          { name: 'Avocado', amount: '40g (1/4 avocado)', category: 'healthy_fats' },
          { name: 'Fresh Tomato Salsa', amount: '4 tbsp (60g)', category: 'produce' },
          { name: 'Crisp Romaine Lettuce', amount: '80g shredded', category: 'produce' }
        ],
        cookingSteps: [
          'Brown ground turkey in a skillet with cumin, chili powder, and garlic until fully cooked.',
          'Steam or sauté riced cauliflower with lime juice and chopped cilantro.',
          'Assemble bowl: layer shredded romaine, cauliflower rice, turkey, black beans, salsa, and avocado.'
        ],
        chefTip: 'Blending cauliflower rice 50/50 with regular rice cuts carb calories in half while keeping the bowl huge and satisfying.'
      },
      {
        id: 'shred-snack',
        name: 'Whey Protein Sludge Pudding & Crisp Apple',
        mealType: 'snack',
        calories: 270,
        protein: 30,
        carbs: 28,
        fats: 3,
        fiber: 5,
        prepTimeMin: 4,
        ingredients: [
          { name: 'Chocolate Whey/Casein Powder', amount: '1 scoop (32g)', category: 'protein' },
          { name: 'Almond Milk (Unsweetened)', amount: '50ml (just enough to make pudding)', category: 'dairy' },
          { name: 'Crisp Honeycrisp Apple', amount: '1 medium (130g)', category: 'produce' }
        ],
        cookingSteps: [
          'Stir protein powder with just 3-4 tablespoons of cold almond milk until thick pudding consistency is achieved.',
          'Slice apple into wedges and dip into protein pudding.'
        ],
        chefTip: 'Casein or blended protein thickens into decadent chocolate mousse when mixed with very minimal liquid.'
      },
      {
        id: 'shred-dinner',
        name: 'Herb-Crusted Cod Fillet with Roasted Broccolini & Parmesan',
        mealType: 'dinner',
        calories: 520,
        protein: 48,
        carbs: 28,
        fats: 16,
        fiber: 8,
        prepTimeMin: 18,
        ingredients: [
          { name: 'Wild Cod or Whitefish Fillet', amount: '240g', category: 'protein' },
          { name: 'Broccolini or Broccoli florets', amount: '220g', category: 'produce' },
          { name: 'Grated Parmesan', amount: '15g', category: 'dairy' },
          { name: 'Olive Oil', amount: '1.5 tsp (7ml)', category: 'healthy_fats' },
          { name: 'Baby Red Potatoes', amount: '130g boiled & smashed', category: 'produce' }
        ],
        cookingSteps: [
          'Season cod with sea salt, lemon zest, and dried oregano. Bake at 200°C (400°F) for 12 minutes.',
          'Roast broccolini on a baking tray with olive oil, finishing with a dusting of freshly grated Parmesan.',
          'Serve with crispy smashed baby potatoes for clean post-workout carbohydrate recovery.'
        ],
        chefTip: 'Cod is virtually pure lean protein with 0g fat and 0g carbs, making it the supreme cut-phase protein source.'
      }
    ]
  },
  {
    id: 'mediterranean-balanced',
    title: 'Mediterranean Vitality & Balance',
    goalType: 'maintenance',
    dietStyle: 'Balanced Whole Foods',
    summary: 'Heart-healthy fats, unrefined ancient grains, colorful polyphenols, and clean energy balance for longevity.',
    targetDailyCalories: 2150,
    macroRatio: {
      proteinPct: 28,
      carbsPct: 44,
      fatsPct: 28
    },
    hydrationTarget: '2.5 - 3.0 Liters per day',
    keyNutritionPrinciples: [
      'Monounsaturated fats from extra virgin olive oil and nuts support hormonal health',
      'Diverse gut microbiome support via fermented foods and colorful plant fibers',
      'Sustainable eating pattern designed for permanent lifestyle adherence'
    ],
    meals: [
      {
        id: 'med-breakfast',
        name: 'Artisan Sourdough with Poached Eggs & Avocado Smash',
        mealType: 'breakfast',
        calories: 490,
        protein: 26,
        carbs: 46,
        fats: 22,
        fiber: 7,
        prepTimeMin: 12,
        ingredients: [
          { name: 'Whole Grain Sourdough Bread', amount: '2 slices (70g)', category: 'grains' },
          { name: 'Free-Range Eggs', amount: '2 large', category: 'protein' },
          { name: 'Ripe Avocado', amount: '50g mashed', category: 'healthy_fats' },
          { name: 'Cherry Tomatoes', amount: '60g halved', category: 'produce' },
          { name: 'Everything Bagel Seasoning & Chili Flakes', amount: '1 tsp', category: 'pantry' }
        ],
        cookingSteps: [
          'Toast sourdough slices until golden and sturdy.',
          'Poach or soft-boil eggs in simmering water for 3.5 minutes.',
          'Spread mashed avocado onto toast, top with warm runny poached eggs and blistered tomatoes.',
          'Dust with seasoning flakes.'
        ],
        chefTip: 'Natural fermentation in sourdough breaks down phytates, making minerals easier for the body to absorb.'
      },
      {
        id: 'med-lunch',
        name: 'Greek Lemon Herb Chicken Souvlaki Salad',
        mealType: 'lunch',
        calories: 580,
        protein: 48,
        carbs: 42,
        fats: 22,
        fiber: 8,
        prepTimeMin: 15,
        ingredients: [
          { name: 'Chicken Breast Skewers', amount: '200g', category: 'protein' },
          { name: 'Cucumbers & Red Onions', amount: '120g chopped', category: 'produce' },
          { name: 'Kalamata Olives', amount: '30g (approx 8 olives)', category: 'healthy_fats' },
          { name: 'Whole Wheat Pita Pocket', amount: '1 pocket (60g)', category: 'grains' },
          { name: 'Tzatziki Sauce (Greek Yogurt based)', amount: '3 tbsp (45g)', category: 'dairy' }
        ],
        cookingSteps: [
          'Grill marinated oregano chicken strips in a skillet until golden.',
          'Toss diced cucumber, tomatoes, red onions, and olives with a dash of red wine vinegar.',
          'Stuff whole wheat pita with chicken and fresh salad, topped with cooling Greek yogurt tzatziki.'
        ],
        chefTip: 'Tzatziki provides probiotic active cultures while containing just a fraction of the calories found in mayonnaise.'
      },
      {
        id: 'med-snack',
        name: 'Handful of Mediterranean Almonds & Fresh Fig/Apple',
        mealType: 'snack',
        calories: 280,
        protein: 9,
        carbs: 28,
        fats: 16,
        fiber: 5,
        prepTimeMin: 2,
        ingredients: [
          { name: 'Raw Roasted Almonds', amount: '25g', category: 'healthy_fats' },
          { name: 'Fresh Crisp Apple or Fresh Figs', amount: '1 piece', category: 'produce' },
          { name: 'String Cheese or Edamame', amount: '1 stick (28g)', category: 'dairy' }
        ],
        cookingSteps: [
          'Enjoy simple whole-food pairing without cooking.',
          'Sip a cup of iced herbal mint tea alongside.'
        ],
        chefTip: 'Almonds deliver high Vitamin E, an essential antioxidant for reducing cellular oxidative stress.'
      },
      {
        id: 'med-dinner',
        name: 'Baked Sea Bass with Lemon, Capers, Couscous & Roasted Veggies',
        mealType: 'dinner',
        calories: 680,
        protein: 50,
        carbs: 64,
        fats: 22,
        fiber: 9,
        prepTimeMin: 25,
        ingredients: [
          { name: 'Sea Bass or Halibut Fillet', amount: '220g', category: 'protein' },
          { name: 'Pearl Couscous / Farro', amount: '70g dry (cooked)', category: 'grains' },
          { name: 'Zucchini & Bell Peppers', amount: '160g sliced', category: 'produce' },
          { name: 'Capers & Extra Virgin Olive Oil', amount: '1 tbsp each', category: 'healthy_fats' }
        ],
        cookingSteps: [
          'Bake sea bass in parchment paper with lemon wheels, capers, and olive oil at 190°C for 15 minutes.',
          'Roast zucchini and colorful bell peppers until edges caramelize.',
          'Fluff pearl couscous with fresh parsley and serve beneath the tender fish.'
        ],
        chefTip: 'Cooking fish en papillote (in parchment packet) locks in natural juices and eliminates the need for excess cooking fat.'
      }
    ]
  },
  {
    id: 'plant-powered-athlete',
    title: 'Plant-Powered Athletic Fuel',
    goalType: 'endurance',
    dietStyle: 'Plant-Powered',
    summary: '100% plant-based formulation combining complementary amino acids, iron-rich greens, and high-octane complex carbs.',
    targetDailyCalories: 2250,
    macroRatio: {
      proteinPct: 26,
      carbsPct: 54,
      fatsPct: 20
    },
    hydrationTarget: '3.0 - 3.5 Liters per day',
    keyNutritionPrinciples: [
      'Combine legumes and whole grains (e.g., lentils + rice) to achieve full essential amino acid profiles',
      'Pair plant non-heme iron sources with Vitamin C (lemon, citrus, peppers) for 3x iron absorption',
      'Incorporate nutritional yeast and spirulina for B-vitamins and trace mineral density'
    ],
    meals: [
      {
        id: 'plant-breakfast',
        name: 'Spiced Tofu Scramble with Turmeric & Roasted Hash Browns',
        mealType: 'breakfast',
        calories: 480,
        protein: 34,
        carbs: 48,
        fats: 16,
        fiber: 8,
        prepTimeMin: 15,
        ingredients: [
          { name: 'Extra Firm Tofu', amount: '200g crumbled', category: 'protein' },
          { name: 'Nutritional Yeast', amount: '2 tbsp (15g)', category: 'pantry' },
          { name: 'Baby Spinach', amount: '60g', category: 'produce' },
          { name: 'Ground Turmeric & Black Pepper', amount: '1/2 tsp', category: 'pantry' },
          { name: 'Baby Yukon Potatoes', amount: '150g diced', category: 'produce' }
        ],
        cookingSteps: [
          'Air-fry or roast diced potatoes until crispy with garlic salt.',
          'Crumble firm tofu into a hot skillet with olive oil spray.',
          'Sprinkle turmeric, black pepper, and nutritional yeast, cooking for 5 minutes until golden.',
          'Fold in baby spinach until wilted and serve with the crispy roasted potatoes.'
        ],
        chefTip: 'Nutritional yeast gives a rich cheesy umami flavor while supplying Vitamin B12 and complete protein.'
      },
      {
        id: 'plant-lunch',
        name: 'Hearty Lentil & Quinoa Power Bowl with Tahini Drizzle',
        mealType: 'lunch',
        calories: 640,
        protein: 36,
        carbs: 85,
        fats: 16,
        fiber: 18,
        prepTimeMin: 18,
        ingredients: [
          { name: 'Cooked Brown Lentils', amount: '180g', category: 'protein' },
          { name: 'Cooked Quinoa', amount: '140g', category: 'grains' },
          { name: 'Edamame (Shelled)', amount: '80g', category: 'protein' },
          { name: 'Shredded Red Cabbage & Carrots', amount: '100g', category: 'produce' },
          { name: 'Creamy Tahini Dressing', amount: '1.5 tbsp (22g)', category: 'healthy_fats' },
          { name: 'Hemp Hearts', amount: '1 tbsp (10g)', category: 'healthy_fats' }
        ],
        cookingSteps: [
          'Warm lentils and quinoa with a touch of cumin and garlic.',
          'Assemble bowl with steamed edamame, crisp red cabbage, and shredded carrots.',
          'Whisk tahini with lemon juice and warm water until velvety; drizzle over bowl.',
          'Garnish with nutrient-dense hemp seeds.'
        ],
        chefTip: 'Hemp seeds provide an ideal 3:1 ratio of Omega-6 to Omega-3 essential fatty acids.'
      },
      {
        id: 'plant-snack',
        name: 'Green Superfood Smoothie with Pea Protein',
        mealType: 'snack',
        calories: 340,
        protein: 30,
        carbs: 38,
        fats: 6,
        fiber: 7,
        prepTimeMin: 5,
        ingredients: [
          { name: 'Organic Pea & Rice Protein Blend', amount: '1 scoop (32g)', category: 'protein' },
          { name: 'Frozen Banana', amount: '1 medium', category: 'produce' },
          { name: 'Fresh Baby Spinach', amount: '50g', category: 'produce' },
          { name: 'Chia Seeds', amount: '1 tbsp (12g)', category: 'healthy_fats' },
          { name: 'Oat Milk (Unsweetened)', amount: '250ml', category: 'dairy' }
        ],
        cookingSteps: [
          'Add oat milk, protein powder, spinach, frozen banana, and chia seeds to high-speed blender.',
          'Blend on high for 60 seconds until creamy and vibrant green.'
        ],
        chefTip: 'Combining pea and rice protein provides a complete amino acid score that rivals whey protein.'
      },
      {
        id: 'plant-dinner',
        name: 'Crispy Air-Fried Tempeh Teriyaki with Brown Rice & Broccoli',
        mealType: 'dinner',
        calories: 680,
        protein: 44,
        carbs: 76,
        fats: 18,
        fiber: 14,
        prepTimeMin: 20,
        ingredients: [
          { name: 'Organic Tempeh', amount: '180g cubed', category: 'protein' },
          { name: 'Steamed Brown Basmati Rice', amount: '160g', category: 'grains' },
          { name: 'Broccoli Crowns', amount: '180g steamed', category: 'produce' },
          { name: 'Teriyaki Glaze (Low Sodium)', amount: '2 tbsp', category: 'pantry' },
          { name: 'Sesame Oil', amount: '1 tsp', category: 'healthy_fats' }
        ],
        cookingSteps: [
          'Steam tempeh cubes for 5 minutes (removes any slight bitterness), then toss in teriyaki glaze.',
          'Air-fry at 195°C (385°F) for 10-12 minutes until deeply caramelized and crispy.',
          'Serve hot over steamed brown basmati rice with tender broccoli crowns.'
        ],
        chefTip: 'Tempeh is fermented whole soybeans, containing more fiber, protein, and prebiotics than standard tofu.'
      }
    ]
  },
  {
    id: 'keto-metabolic-reset',
    title: 'Keto Metabolic Reset & Focus',
    goalType: 'aggressive_cut',
    dietStyle: 'Keto / Low-Carb',
    summary: 'Ultra-low carbohydrate, high healthy fat, moderate protein strategy designed for steady insulin levels and fat adaptation.',
    targetDailyCalories: 1950,
    macroRatio: {
      proteinPct: 26,
      carbsPct: 6,
      fatsPct: 68
    },
    hydrationTarget: '3.5 - 4.0 Liters per day + Electrolytes',
    keyNutritionPrinciples: [
      'Maintain net carbohydrates strictly under 30g daily to preserve ketosis',
      'Supplement sodium (3000-5000mg), potassium, and magnesium to prevent keto flu',
      'Utilize avocado, olive oil, grass-fed butter, and wild fatty fish for anti-inflammatory lipids'
    ],
    meals: [
      {
        id: 'keto-breakfast',
        name: 'Avocado & Smoked Salmon Scramble with Ghee',
        mealType: 'breakfast',
        calories: 520,
        protein: 36,
        carbs: 4,
        fats: 40,
        fiber: 3,
        prepTimeMin: 10,
        ingredients: [
          { name: 'Pasture-Raised Whole Eggs', amount: '3 large', category: 'protein' },
          { name: 'Wild Smoked Salmon', amount: '80g', category: 'protein' },
          { name: 'Avocado', amount: '60g', category: 'healthy_fats' },
          { name: 'Grass-Fed Butter or Ghee', amount: '1 tbsp (14g)', category: 'healthy_fats' },
          { name: 'Fresh Chives & Sea Salt', amount: '1 tbsp', category: 'produce' }
        ],
        cookingSteps: [
          'Melt ghee in a skillet over low heat and gently scramble eggs until silky curds form.',
          'Remove from heat, fold in delicate ribbon slices of smoked salmon.',
          'Plate with sliced avocado and freshly snipped chives.'
        ],
        chefTip: 'Smoked salmon cooks in the residual heat of the eggs, keeping it buttery soft.'
      },
      {
        id: 'keto-lunch',
        name: 'Crispy Bacon & Cobb Salad with Blue Cheese Dressing',
        mealType: 'lunch',
        calories: 590,
        protein: 42,
        carbs: 6,
        fats: 44,
        fiber: 4,
        prepTimeMin: 12,
        ingredients: [
          { name: 'Grilled Chicken Breast', amount: '160g', category: 'protein' },
          { name: 'Uncured Bacon Strips', amount: '2 strips crispy', category: 'protein' },
          { name: 'Hard Boiled Egg', amount: '1 egg sliced', category: 'protein' },
          { name: 'Avocado', amount: '50g diced', category: 'healthy_fats' },
          { name: 'Crisp Romaine Lettuce', amount: '100g chopped', category: 'produce' },
          { name: 'Blue Cheese or Ranch Dressing', amount: '2 tbsp (30g)', category: 'dairy' }
        ],
        cookingSteps: [
          'Chop chilled grilled chicken, bacon, and hard-boiled egg.',
          'Layer across a bed of cold crunchy romaine lettuce.',
          'Add diced avocado and dress generously with artisan blue cheese dressing.'
        ],
        chefTip: 'High fat dressings on keto slow digestion, eliminating hunger cravings throughout the afternoon.'
      },
      {
        id: 'keto-snack',
        name: 'Macadamia Nut Crunch & Dark Chocolate (90%)',
        mealType: 'snack',
        calories: 270,
        protein: 4,
        carbs: 3,
        fats: 26,
        fiber: 3,
        prepTimeMin: 2,
        ingredients: [
          { name: 'Roasted Salted Macadamia Nuts', amount: '30g', category: 'healthy_fats' },
          { name: 'Dark Chocolate (90% Cacao)', amount: '15g (2 squares)', category: 'pantry' }
        ],
        cookingSteps: [
          'Pair rich macadamias with high percentage cacao squares for immediate fat energy.'
        ],
        chefTip: 'Macadamias boast the lowest carbohydrate and highest monounsaturated fat ratio of all tree nuts.'
      },
      {
        id: 'keto-dinner',
        name: 'Cast-Iron Ribeye Steak with Garlic Herb Butter & Asparagus',
        mealType: 'dinner',
        calories: 690,
        protein: 52,
        carbs: 5,
        fats: 50,
        fiber: 3,
        prepTimeMin: 18,
        ingredients: [
          { name: 'Grass-Fed Ribeye Steak', amount: '230g', category: 'protein' },
          { name: 'Compound Garlic Herb Butter', amount: '1.5 tbsp (20g)', category: 'dairy' },
          { name: 'Asparagus Spears', amount: '150g', category: 'produce' },
          { name: 'Coarse Flaky Sea Salt', amount: '1 tsp', category: 'pantry' }
        ],
        cookingSteps: [
          'Pat steak thoroughly dry and season heavily with coarse sea salt and cracked pepper.',
          'Sear in a smoking-hot cast iron skillet for 3 minutes per side until rich crust develops.',
          'Add garlic butter to skillet and baste over the steak for 60 seconds. Rest 5 minutes.',
          'Flash sauté asparagus in the remaining skillet pan drippings.'
        ],
        chefTip: 'Resting the steak for 5 minutes allows muscle fibers to relax, redistributing succulent juices.'
      }
    ]
  }
];
