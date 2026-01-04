
import React from 'react';
import { NutritionData } from '../types';
import NutritionChart from './NutritionChart';

interface NutritionCardProps {
  data: NutritionData;
  onAdd: () => void;
}

const NutritionCard: React.FC<NutritionCardProps> = ({ data, onAdd }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 50) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 capitalize">{data.foodName}</h2>
            <p className="text-sm text-gray-500">Standard Serving: {data.servingSize}</p>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getScoreColor(data.healthScore)}`}>
            Health Score: {data.healthScore}/100
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="flex items-center justify-center bg-gray-50 rounded-xl py-6 mb-6">
              <div className="text-center">
                <span className="block text-4xl font-black text-gray-900">{data.calories}</span>
                <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Calories</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="bg-blue-50 p-3 rounded-lg text-center border border-blue-100">
                <span className="block text-lg font-bold text-blue-700">{data.protein}g</span>
                <span className="text-xs text-blue-600 uppercase font-semibold">Protein</span>
              </div>
              <div className="bg-emerald-50 p-3 rounded-lg text-center border border-emerald-100">
                <span className="block text-lg font-bold text-emerald-700">{data.carbohydrates}g</span>
                <span className="text-xs text-emerald-600 uppercase font-semibold">Carbs</span>
              </div>
              <div className="bg-red-50 p-3 rounded-lg text-center border border-red-100">
                <span className="block text-lg font-bold text-red-700">{data.fat}g</span>
                <span className="text-xs text-red-600 uppercase font-semibold">Fat</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-2">Macro Distribution</h3>
            <NutritionChart data={data} />
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <div className="bg-gray-50 p-4 rounded-xl">
            <h4 className="font-semibold text-gray-900 mb-1">Health Summary</h4>
            <p className="text-gray-600 text-sm leading-relaxed">{data.summary}</p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Key Benefits</h4>
            <ul className="flex flex-wrap gap-2">
              {data.benefits.map((benefit, i) => (
                <li key={i} className="bg-white border border-gray-200 px-3 py-1 rounded-lg text-xs text-gray-700 shadow-sm">
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <button 
          onClick={onAdd}
          className="w-full mt-8 bg-black hover:bg-gray-800 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Add to Daily Intake
        </button>
      </div>
    </div>
  );
};

export default NutritionCard;
