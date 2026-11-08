import { defineConfig } from 'tinacms';

// TinaCMS Schema Configuration for Portfolio Static Site
export default defineConfig({
  branch: 'main',
  clientId: process.env.TINA_CLIENT_ID || '',
  token: process.env.TINA_TOKEN || '',

  build: {
    outputFolder: 'admin',
    publicFolder: 'public',
  },
  media: {
    tina: {
      mediaRoot: 'uploads',
      publicFolder: 'public',
    },
  },
  schema: {
    collections: [
      {
        name: 'portfolio',
        label: 'General Portfolio',
        path: 'content/portfolio',
        format: 'json',
        fields: [
          { type: 'string', name: 'developerName', label: 'Developer Name' },
          { type: 'string', name: 'title', label: 'Primary Title' },
          { type: 'string', name: 'location', label: 'Location & Working Mode' },
          { type: 'string', name: 'avatarUrl', label: 'Avatar / Photo URL' },
          { type: 'string', name: 'heroBio', label: 'Hero Short Bio', ui: { component: 'textarea' } },
          { type: 'string', name: 'aboutTitle', label: 'About Section Title' },
          { type: 'string', name: 'aboutBio1', label: 'About Paragraph 1', ui: { component: 'textarea' } },
          { type: 'string', name: 'aboutBio2', label: 'About Paragraph 2' },
          { type: 'string', name: 'contactEmail', label: 'Contact Email' },
          { type: 'string', name: 'linkedInUrl', label: 'LinkedIn Profile URL' },
          {
            type: 'object',
            name: 'stats',
            label: 'Quantitative Highlights',
            list: true,
            fields: [
              { type: 'string', name: 'value', label: 'Stat Value' },
              { type: 'string', name: 'label', label: 'Stat Label' }
            ]
          }
        ],
      },
      {
        name: 'pillars',
        label: 'Engineering Pillars',
        path: 'content/pillars',
        format: 'json',
        fields: [
          { type: 'string', name: 'id', label: 'Pillar ID' },
          { type: 'string', name: 'num', label: 'Number Identifier' },
          { type: 'string', name: 'title', label: 'Pillar Title' },
          { type: 'string', name: 'subtitle', label: 'Subtitle' },
          { type: 'string', name: 'desc', label: 'Description', ui: { component: 'textarea' } },
        ],
      },
      {
        name: 'experiences',
        label: 'Work Experiences',
        path: 'content/experiences',
        format: 'json',
        fields: [
          { type: 'string', name: 'id', label: 'Experience ID' },
          { type: 'string', name: 'company', label: 'Company Name' },
          { type: 'string', name: 'role', label: 'Role Title' },
          { type: 'string', name: 'location', label: 'Location' },
          { type: 'string', name: 'period', label: 'Period' },
          { type: 'boolean', name: 'isLatest', label: 'Is Current / Latest Position' },
          { type: 'string', name: 'bullets', label: 'Achievement Bullets', list: true },
          { type: 'string', name: 'skills', label: 'Key Skills Tagged', list: true },
        ],
      },
      {
        name: 'skills',
        label: 'Skill Categories',
        path: 'content/skills',
        format: 'json',
        fields: [
          { type: 'string', name: 'title', label: 'Category Title' },
          { type: 'string', name: 'items', label: 'Skill Items', list: true },
        ],
      },
      {
        name: 'recommendations',
        label: 'Testimonials & Endorsements',
        path: 'content/recommendations',
        format: 'json',
        fields: [
          { type: 'string', name: 'quote', label: 'Testimonial Quote', ui: { component: 'textarea' } },
          { type: 'string', name: 'author', label: 'Author Name' },
          { type: 'string', name: 'role', label: 'Author Role' },
          { type: 'string', name: 'company', label: 'Company / Project' },
        ],
      }
    ],
  },
});
