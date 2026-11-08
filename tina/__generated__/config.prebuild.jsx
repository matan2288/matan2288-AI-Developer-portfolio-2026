// tina/config.ts
import { defineConfig } from "tinacms";
var config_default = defineConfig({
  branch: process.env.GITHUB_BRANCH || process.env.VITE_GITHUB_BRANCH || "main",
  build: {
    outputFolder: "admin",
    publicFolder: "public"
  },
  media: {
    tina: {
      mediaRoot: "uploads",
      publicFolder: "public"
    }
  },
  schema: {
    collections: [
      {
        name: "portfolio",
        label: "General Portfolio",
        path: "content/portfolio",
        format: "json",
        fields: [
          { type: "string", name: "developerName", label: "Developer Name" },
          { type: "string", name: "title", label: "Primary Title" },
          { type: "string", name: "location", label: "Location & Working Mode" },
          { type: "string", name: "avatarUrl", label: "Avatar / Photo URL" },
          { type: "string", name: "heroBio", label: "Hero Short Bio", ui: { component: "textarea" } },
          { type: "string", name: "aboutTitle", label: "About Section Title" },
          { type: "string", name: "aboutBio1", label: "About Paragraph 1", ui: { component: "textarea" } },
          { type: "string", name: "aboutBio2", label: "About Paragraph 2" },
          { type: "string", name: "contactEmail", label: "Contact Email" },
          { type: "string", name: "linkedInUrl", label: "LinkedIn Profile URL" },
          { type: "string", name: "blogUrl", label: "Blog iFrame URL" },
          { type: "boolean", name: "showBlogTab", label: "Show Blog Tab in Navigation" },
          {
            type: "object",
            name: "stats",
            label: "Quantitative Highlights",
            list: true,
            fields: [
              { type: "string", name: "value", label: "Stat Value" },
              { type: "string", name: "label", label: "Stat Label" }
            ]
          }
        ]
      },
      {
        name: "pillars",
        label: "Engineering Pillars",
        path: "content/pillars",
        format: "json",
        fields: [
          { type: "string", name: "num", label: "Number Identifier" },
          { type: "string", name: "title", label: "Pillar Title" },
          { type: "string", name: "subtitle", label: "Subtitle" },
          { type: "string", name: "desc", label: "Description", ui: { component: "textarea" } }
        ]
      },
      {
        name: "experiences",
        label: "Work Experiences",
        path: "content/experiences",
        format: "json",
        fields: [
          { type: "string", name: "company", label: "Company Name" },
          { type: "string", name: "role", label: "Role Title" },
          { type: "string", name: "location", label: "Location" },
          { type: "string", name: "period", label: "Period" },
          { type: "boolean", name: "isLatest", label: "Is Current / Latest Position" },
          { type: "string", name: "bullets", label: "Achievement Bullets", list: true },
          { type: "string", name: "skills", label: "Key Skills Tagged", list: true }
        ]
      },
      {
        name: "skills",
        label: "Skill Categories",
        path: "content/skills",
        format: "json",
        fields: [
          { type: "string", name: "title", label: "Category Title" },
          { type: "string", name: "items", label: "Skill Items", list: true }
        ]
      },
      {
        name: "recommendations",
        label: "Testimonials & Endorsements",
        path: "content/recommendations",
        format: "json",
        fields: [
          { type: "string", name: "quote", label: "Testimonial Quote", ui: { component: "textarea" } },
          { type: "string", name: "author", label: "Author Name" },
          { type: "string", name: "role", label: "Author Role" },
          { type: "string", name: "company", label: "Company / Project" },
          { type: "string", name: "avatarUrl", label: "Author Avatar URL" },
          { type: "string", name: "linkedInUrl", label: "LinkedIn Profile URL" }
        ]
      },
      {
        name: "certifications",
        label: "Certifications",
        path: "content/certifications",
        format: "json",
        fields: [
          {
            type: "object",
            name: "certifications",
            label: "Certifications List",
            list: true,
            ui: {
              itemProps: (item) => ({ label: item?.title || "Certification" })
            },
            fields: [
              { type: "string", name: "id", label: "Identifier" },
              { type: "string", name: "title", label: "Certification Title" },
              { type: "string", name: "category", label: "Category Badge" },
              { type: "string", name: "topic", label: "Topic Focus" },
              { type: "string", name: "issuer", label: "Issuer Organization" },
              { type: "string", name: "issueDate", label: "Issue Date" },
              { type: "string", name: "credentialId", label: "Credential ID" },
              { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
              { type: "string", name: "skills", label: "Skills Tagged", list: true },
              { type: "string", name: "driveUrl", label: "Document / PDF URL" },
              { type: "string", name: "verificationUrl", label: "Verification URL" }
            ]
          }
        ]
      }
    ]
  }
});
export {
  config_default as default
};
