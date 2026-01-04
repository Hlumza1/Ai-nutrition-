
export interface NutritionData {
  foodName: string;
  calories: number;
  protein: number;
  fat: number;
  carbohydrates: number;
  fiber: number;
  sugar: number;
  servingSize: string;
  healthScore: number; // 1-100
  summary: string;
  benefits: string[];
}

export interface LogEntry extends NutritionData {
  id: string;
  timestamp: number;
  quantity: number;
}
