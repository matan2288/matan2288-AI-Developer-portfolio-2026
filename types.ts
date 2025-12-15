export interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  image: string;
}

export interface ServicePlan {
  id: number;
  title: string;
  price: string;
  features: string[];
  recommended?: boolean;
}

export interface WorkoutPlanRequest {
  goal: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  equipment: string;
  duration: string;
}

export interface WorkoutPlanResponse {
  planTitle: string;
  summary: string;
  exercises: {
    name: string;
    sets: string;
    reps: string;
    notes: string;
  }[];
  motivationalQuote: string;
}
