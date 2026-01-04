
import React, { useState, useEffect } from 'react';
import { getNutritionInfo } from './services/gemini';
import { NutritionData, LogEntry } from './types';
import NutritionCard from './components/NutritionCard';

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentResult, setCurrentResult] = useState<NutritionData | null>(null);
  const [dailyLog, setDailyLog] = useState<LogEntry[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Load log from localStorage on mount
  useEffect(() => {
    try {
      const savedLog = localStorage.getItem('nutritrack_log');
      if (savedLog) {
        setDailyLog(JSON.parse(savedLog));
      }
    } catch (e) {
      console.error("Failed to load local storage", e);
    }
  }, []);

  // Save log to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('nutritrack_log', JSON.stringify(dailyLog));
  }, [dailyLog]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const data = await getNutritionInfo(query);
      setCurrentResult(data);
    } catch (err) {
      console.error(err);
      setError('Could not fetch nutrition data. Please check your connection and API key.');
    } finally {
      setLoading(false);
    }
  };

  const addToLog = () => {
    if (!currentResult) return;
    const newEntry: LogEntry = {
      ...currentResult,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      quantity: 1
    };
    setDailyLog(prev => [newEntry, ...prev]);
    setCurrentResult(null);
    setQuery('');
    // Auto-open sidebar on mobile when adding first item
    if (dailyLog.length === 0 && window.innerWidth < 768) {
      setIsSidebarOpen(true);
    }
  };

  const removeFromLog = (id: string) => {
    setDailyLog(prev => prev.filter(item => item.id !== id));
  };

  const totalCalories = dailyLog.reduce((sum, item) => sum + item.calories, 0);
  const totalProtein = dailyLog.reduce((sum, item) => sum + (item.protein || 0), 0);
  const totalCarbs = dailyLog.reduce((sum, item) => sum + (item.carbohydrates || 0), 0);
  const totalFat = dailyLog.reduce((sum, item) => sum + (item.fat || 0), 0);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#FBFBFE]">
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 bg-white border-b sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900">NutriTrack</h1>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 relative">
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          {dailyLog.length > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></span>
          )}
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 lg:p-12 overflow-y-auto">
        <div className="max-w-3xl mx-auto flex flex-col min-h-full">
          <div className="hidden md:flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center shadow-lg shadow-gray-200">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">AI Food Tracker</h1>
          </div>

          <div className="mb-12">
            <form onSubmit={handleSearch} className="relative group">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="What did you eat? (e.g., '2 boiled eggs', 'medium pepperoni pizza')"
                className="w-full bg-white border border-gray-200 focus:border-black rounded-2xl py-5 px-6 pr-36 shadow-xl shadow-gray-200/40 text-lg transition-all outline-none"
              />
              <button
                type="submit"
                disabled={loading}
                className="absolute right-3 top-3 bottom-3 bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white font-bold px-6 rounded-xl transition-all active:scale-95 flex items-center justify-center min-w-[100px]"
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  'Analyze'
                )}
              </button>
            </form>
            <div className="mt-4 flex flex-wrap gap-2 px-2">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Suggestions:</span>
              {['1 large apple', 'cobb salad', 'grilled salmon 200g'].map(s => (
                <button 
                  key={s} 
                  onClick={() => setQuery(s)}
                  className="text-xs text-gray-500 hover:text-black hover:underline"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium animate-in fade-in zoom-in duration-300 flex items-center gap-3">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <div className="flex-1">
            {currentResult ? (
              <NutritionCard data={currentResult} onAdd={addToLog} />
            ) : !loading && (
              <div className="text-center py-24 px-6 border-2 border-dashed border-gray-100 rounded-3xl opacity-60">
                <div className="mb-6 flex justify-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.246.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.246.477-4.5 1.253" />
                    </svg>
                  </div>
                </div>
                <h2 className="text-xl font-bold text-gray-600 mb-2">Ready to track?</h2>
                <p className="text-sm text-gray-400 max-w-xs mx-auto">Enter any food item above to get instant nutritional breakdown powered by Gemini AI.</p>
              </div>
            )}
          </div>

          <footer className="mt-12 py-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-400 font-medium tracking-wide uppercase">
              Powered by Google Gemini 3
            </p>
            <div className="flex gap-4">
              <a href="https://vercel.com" target="_blank" rel="noreferrer" className="text-xs text-gray-400 hover:text-black transition-colors">Deployed on Vercel</a>
              <span className="text-gray-200">|</span>
              <button onClick={() => setDailyLog([])} className="text-xs text-gray-400 hover:text-red-500 transition-colors">Reset Session</button>
            </div>
          </footer>
        </div>
      </main>

      {/* Sidebar for Daily Log */}
      <aside className={`fixed inset-y-0 right-0 w-full sm:w-80 md:w-96 bg-white border-l shadow-2xl transition-transform duration-300 z-30 transform ${isSidebarOpen || window.innerWidth >= 768 ? 'translate-x-0' : 'translate-x-full'} md:relative md:translate-x-0`}>
        <div className="h-full flex flex-col p-6 overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-black text-gray-900">Daily Intake</h2>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-tighter">Current Statistics</p>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Daily Totals Widget */}
          <div className="bg-black rounded-3xl p-6 text-white mb-8 shadow-2xl shadow-gray-200 relative overflow-hidden group">
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors"></div>
            <div className="mb-6 text-center relative z-10">
              <span className="text-5xl font-black text-white">{totalCalories}</span>
              <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-black mt-2">Total Calories</p>
            </div>
            <div className="grid grid-cols-3 gap-2 border-t border-white/10 pt-6 relative z-10">
              <div className="text-center">
                <span className="block text-sm font-bold text-blue-400">{totalProtein.toFixed(0)}g</span>
                <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">Protein</span>
              </div>
              <div className="text-center border-x border-white/10">
                <span className="block text-sm font-bold text-emerald-400">{totalCarbs.toFixed(0)}g</span>
                <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">Carbs</span>
              </div>
              <div className="text-center">
                <span className="block text-sm font-bold text-red-400">{totalFat.toFixed(0)}g</span>
                <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">Fat</span>
              </div>
            </div>
          </div>

          {/* Log List */}
          <div className="flex-1 overflow-y-auto -mx-4 px-4 scrollbar-hide">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Meal History</h3>
            {dailyLog.length === 0 ? (
              <div className="text-center py-12 px-6 border border-dashed border-gray-100 rounded-2xl opacity-40">
                <p className="text-sm font-medium text-gray-400 italic">No items logged today</p>
              </div>
            ) : (
              <div className="space-y-3">
                {dailyLog.map((item) => (
                  <div key={item.id} className="group relative bg-white border border-gray-100 hover:border-black/10 rounded-2xl p-4 shadow-sm transition-all duration-300 hover:shadow-lg">
                    <div className="flex justify-between items-center">
                      <div className="pr-8 overflow-hidden">
                        <h4 className="font-bold text-gray-900 truncate capitalize leading-tight">{item.foodName}</h4>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight mt-0.5">{item.calories} kcal • {item.servingSize}</p>
                      </div>
                      <button 
                        onClick={() => removeFromLog(item.id)}
                        className="p-1.5 rounded-lg text-gray-200 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                        title="Remove entry"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="mt-auto pt-6 border-t border-gray-50">
            <p className="text-[10px] text-center text-gray-300 font-medium">Auto-saves to your local browser storage</p>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-20 md:hidden animate-in fade-in duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
