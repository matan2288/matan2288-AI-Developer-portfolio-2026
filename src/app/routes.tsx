import React from 'react';

export const routes = {
  home: '#home',
  about: '#about',
  experience: '#experience',
  testimonials: '#testimonials',
  contact: '#contact',
  certifications: '#certifications',
  blog: '#blog'
};

export const getRouteHash = (route: keyof typeof routes): string => {
  return routes[route];
};
