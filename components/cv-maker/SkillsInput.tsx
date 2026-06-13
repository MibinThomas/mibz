import React, { useState } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { Plus, X, Tag, Lightbulb } from "lucide-react";
import { CVFormValues } from "../../lib/cvSchema";

const categoryLabels: Record<string, string> = {
  technical: "Technical Skills",
  marketing: "Marketing Tools",
  development: "Development Tools",
  soft: "Soft Skills"
};

const suggestedSkills = [
  { name: "Next.js", category: "technical" },
  { name: "React", category: "technical" },
  { name: "TypeScript", category: "technical" },
  { name: "Meta Ads", category: "marketing" },
  { name: "Google Ads", category: "marketing" },
  { name: "Google Analytics (GA4)", category: "marketing" },
  { name: "TikTok Ads", category: "marketing" },
  { name: "SEO Optimization", category: "marketing" },
  { name: "Tailwind CSS", category: "development" },
  { name: "Git & GitHub", category: "development" },
  { name: "A/B Testing", category: "soft" },
  { name: "Conversion Rate Optimization (CRO)", category: "soft" },
  { name: "Data Attribution", category: "soft" },
  { name: "Public Speaking", category: "soft" }
];

export default function SkillsInput() {
  const { control, formState: { errors } } = useFormContext<CVFormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "skills",
  });

  const [newSkillName, setNewSkillName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("technical");

  const handleAddSkill = (name: string, category: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;

    // Check for duplicates
    const isDuplicate = fields.some(
      (field) => field.name.toLowerCase() === trimmed.toLowerCase()
    );

    if (!isDuplicate) {
      append({
        id: `sk-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: trimmed,
        category,
      });
    }
    setNewSkillName("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill(newSkillName, selectedCategory);
    }
  };

  // Group fields by category
  const categories = ["technical", "marketing", "development", "soft"];

  return (
    <div className="space-y-4">
      <div className="border-b border-brand-gray-800 pb-2">
        <h3 className="text-lg font-heading font-semibold text-white flex items-center gap-2">
          <Tag className="w-5 h-5 text-brand-emerald" />
          Skills *
        </h3>
      </div>

      <p className="text-xs text-brand-gray-400">
        Add at least 5 skills. A recruiter-friendly resume must demonstrate clear core competencies.
      </p>

      {/* Input controls */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-grow">
          <input
            type="text"
            value={newSkillName}
            onChange={(e) => setNewSkillName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g. Google Tag Manager (Press Enter to add)"
            className="w-full h-10 px-3 bg-brand-dark border border-brand-gray-800 focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald text-white rounded-md text-sm outline-none transition-all"
          />
        </div>
        <div className="w-full sm:w-48">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full h-10 px-3 bg-brand-dark border border-brand-gray-800 focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald text-white rounded-md text-sm outline-none transition-all"
          >
            <option value="technical">Technical Skills</option>
            <option value="marketing">Marketing Tools</option>
            <option value="development">Development Tools</option>
            <option value="soft">Soft Skills</option>
          </select>
        </div>
        <button
          type="button"
          onClick={() => handleAddSkill(newSkillName, selectedCategory)}
          className="h-10 px-4 rounded-md bg-brand-emerald text-brand-dark hover:opacity-90 transition-opacity font-semibold text-sm flex items-center justify-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Add
        </button>
      </div>

      {errors.skills && (
        <p className="text-red-500 text-xs">{errors.skills.message}</p>
      )}

      {/* Quick suggestions */}
      <div className="p-3 bg-brand-card/30 border border-brand-gray-800 rounded-lg">
        <div className="flex items-center gap-1.5 text-xs text-brand-emerald font-semibold mb-2">
          <Lightbulb className="w-3.5 h-3.5" />
          Quick Add Suggestions
        </div>
        <div className="flex flex-wrap gap-1.5">
          {suggestedSkills.map((suggest) => {
            const alreadyAdded = fields.some(
              (f) => f.name.toLowerCase() === suggest.name.toLowerCase()
            );
            if (alreadyAdded) return null;

            return (
              <button
                key={suggest.name}
                type="button"
                onClick={() => handleAddSkill(suggest.name, suggest.category)}
                className="px-2.5 py-1 rounded bg-brand-dark border border-brand-gray-800 hover:border-brand-emerald/50 hover:text-brand-emerald text-brand-gray-400 text-xs transition-colors duration-150"
              >
                + {suggest.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Display categorized lists */}
      <div className="grid grid-cols-1 gap-4 pt-2">
        {categories.map((cat) => {
          const catSkills = fields.filter((f) => f.category === cat);
          if (catSkills.length === 0) return null;

          return (
            <div key={cat} className="space-y-2">
              <h4 className="text-xs font-semibold text-brand-gray-400 tracking-wider uppercase">
                {categoryLabels[cat]}
              </h4>
              <div className="flex flex-wrap gap-2">
                {catSkills.map((field) => {
                  // Find index in main list to remove
                  const originalIndex = fields.findIndex((f) => f.id === field.id);
                  return (
                    <span
                      key={field.id}
                      className="px-2.5 py-1 bg-brand-emerald/10 text-brand-emerald border border-brand-emerald/20 rounded-full text-xs font-medium flex items-center gap-1.5"
                    >
                      {field.name}
                      <button
                        type="button"
                        onClick={() => remove(originalIndex)}
                        className="hover:text-red-400 transition-colors p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Display uncategorized skills if any exist */}
        {(() => {
          const uncategorizedSkills = fields.filter((f) => !categories.includes(f.category || ""));
          if (uncategorizedSkills.length === 0) return null;
          return (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-brand-gray-400 tracking-wider uppercase">
                Other Skills
              </h4>
              <div className="flex flex-wrap gap-2">
                {uncategorizedSkills.map((field) => {
                  const originalIndex = fields.findIndex((f) => f.id === field.id);
                  return (
                    <span
                      key={field.id}
                      className="px-2.5 py-1 bg-brand-gray-800 text-brand-gray-300 border border-brand-gray-700 rounded-full text-xs font-medium flex items-center gap-1.5"
                    >
                      {field.name}
                      <button
                        type="button"
                        onClick={() => remove(originalIndex)}
                        className="hover:text-red-400 transition-colors p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
