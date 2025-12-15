import React, { useState } from 'react';
import { Dumbbell, Clock, Activity, Loader2, Sparkles, ChevronRight } from 'lucide-react';
import { Button } from './Button';
import { generateAIWorkout } from '../services/geminiService';
import { WorkoutPlanResponse, WorkoutPlanRequest } from '../types';

export const AIWorkoutGenerator: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<WorkoutPlanResponse | null>(null);
  const [formData, setFormData] = useState<WorkoutPlanRequest>({
    goal: 'Build muscle and strength',
    level: 'Intermediate',
    equipment: 'Dumbbells only',
    duration: '45'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const plan = await generateAIWorkout(formData);
      setResult(plan);
    } catch (err) {
      alert("Something went wrong with the AI Trainer. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section id="ai-trainer" className="py-24 bg-brand-surface relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          
          {/* Left: Introduction & Form */}
          <div className="lg:w-1/2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-accent/10 border border-brand-accent/20 text-brand-accent text-xs font-bold uppercase tracking-wider mb-6">
              <Sparkles size={14} />
              <span>Powered by Gemini 2.5</span>
            </div>
            
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
              Get a <span className="text-brand-accent">Free</span> AI Workout Plan
            </h2>
            <p className="text-gray-400 mb-8 text-lg leading-relaxed">
              Not ready to commit? Experience the Apex methodology instantly. 
              Tell our AI Trainer what you need, and get a customized session right now.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 bg-brand-dark p-6 rounded-2xl border border-gray-800 shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm font-semibold mb-2">Primary Goal</label>
                  <input 
                    type="text" 
                    name="goal"
                    value={formData.goal}
                    onChange={handleChange}
                    className="w-full bg-brand-surface border border-gray-700 rounded px-4 py-3 text-white focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none transition-colors"
                    placeholder="e.g. Lose belly fat"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm font-semibold mb-2">Duration (mins)</label>
                  <select 
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className="w-full bg-brand-surface border border-gray-700 rounded px-4 py-3 text-white focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none transition-colors"
                  >
                    <option value="15">15 Minutes</option>
                    <option value="30">30 Minutes</option>
                    <option value="45">45 Minutes</option>
                    <option value="60">60 Minutes</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                  <label className="block text-gray-400 text-sm font-semibold mb-2">Equipment</label>
                   <select 
                    name="equipment"
                    value={formData.equipment}
                    onChange={handleChange}
                    className="w-full bg-brand-surface border border-gray-700 rounded px-4 py-3 text-white focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none transition-colors"
                  >
                    <option value="Bodyweight only">Bodyweight Only</option>
                    <option value="Dumbbells only">Dumbbells Only</option>
                    <option value="Full gym">Full Gym Access</option>
                    <option value="Kettlebells">Kettlebells</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 text-sm font-semibold mb-2">Experience</label>
                   <select 
                    name="level"
                    value={formData.level}
                    onChange={handleChange}
                    className="w-full bg-brand-surface border border-gray-700 rounded px-4 py-3 text-white focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none transition-colors"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <Button type="submit" fullWidth disabled={loading}>
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="animate-spin" size={20} /> Generating Plan...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Generate Workout <ChevronRight size={20} />
                  </span>
                )}
              </Button>
            </form>
          </div>

          {/* Right: Results Display */}
          <div className="lg:w-1/2 w-full">
            {result ? (
              <div className="bg-white text-brand-dark rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
                <div className="bg-brand-accent p-6">
                  <h3 className="font-display text-3xl font-bold uppercase">{result.planTitle}</h3>
                  <p className="text-brand-dark/80 mt-2 font-medium">{result.summary}</p>
                </div>
                
                <div className="p-6">
                  <div className="flex gap-4 mb-6 text-sm font-bold text-gray-500 uppercase tracking-wide">
                    <div className="flex items-center gap-1"><Clock size={16} /> {formData.duration} Mins</div>
                    <div className="flex items-center gap-1"><Dumbbell size={16} /> {formData.equipment}</div>
                    <div className="flex items-center gap-1"><Activity size={16} /> {formData.level}</div>
                  </div>

                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {result.exercises.map((exercise, idx) => (
                      <div key={idx} className="flex gap-4 p-4 rounded-lg bg-gray-50 border border-gray-100 hover:border-brand-accent/50 transition-colors">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-dark text-brand-accent flex items-center justify-center font-bold font-display text-xl">
                          {idx + 1}
                        </div>
                        <div>
                          <h4 className="font-bold text-lg leading-none mb-1">{exercise.name}</h4>
                          <div className="text-sm font-mono text-gray-600 mb-2">
                            {exercise.sets} Sets × {exercise.reps}
                          </div>
                          <p className="text-sm text-gray-500 italic">{exercise.notes}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-100">
                     <p className="text-center font-display text-xl text-brand-dark italic">
                      "{result.motivationalQuote}"
                     </p>
                  </div>
                </div>
              </div>
            ) : (
              // Placeholder State
              <div className="h-full min-h-[400px] rounded-2xl border-2 border-dashed border-gray-700 flex flex-col items-center justify-center text-center p-8 text-gray-500 bg-brand-surface/50">
                <Dumbbell size={64} className="mb-6 opacity-20" />
                <h3 className="text-xl font-bold mb-2">Your Plan Awaits</h3>
                <p className="max-w-xs mx-auto">
                  Fill out the form on the left to generate a custom workout plan instantly powered by AI.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
