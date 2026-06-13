import React from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { Plus, Trash2, Link, Code, FolderGit } from "lucide-react";
import { CVFormValues } from "../../lib/cvSchema";

export default function ProjectsForm() {
  const { register, control, watch, setValue, formState: { errors } } = useFormContext<CVFormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "projects",
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-brand-gray-800 pb-2">
        <h3 className="text-lg font-heading font-semibold text-white flex items-center gap-2">
          <FolderGit className="w-5 h-5 text-brand-emerald" />
          Projects
        </h3>
        <button
          type="button"
          onClick={() => append({ id: `proj-${Date.now()}`, name: "", url: "", techStack: "", description: "", features: "" })}
          className="px-3 py-1.5 rounded-md bg-brand-emerald/10 text-brand-emerald hover:bg-brand-emerald/20 transition-all font-medium text-xs flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Project
        </button>
      </div>

      {fields.length === 0 ? (
        <div className="text-center py-6 border border-dashed border-brand-gray-800 rounded-lg text-brand-gray-500 text-sm">
          No projects added yet. Click &quot;Add Project&quot; to showcase your work.
        </div>
      ) : (
        <div className="space-y-6">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="p-4 border border-brand-gray-800 bg-brand-card/30 rounded-lg space-y-4 relative group"
            >
              <button
                type="button"
                onClick={() => remove(index)}
                className="absolute top-4 right-4 text-brand-gray-500 hover:text-red-500 transition-colors p-1.5 rounded bg-brand-dark/50"
                aria-label="Remove Project"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <h4 className="text-sm font-semibold text-brand-emerald pr-8">
                Project #{index + 1}
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-brand-gray-300 mb-1.5">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. GCC Attribution Tracker"
                    {...register(`projects.${index}.name`)}
                    className="w-full px-3 py-2 bg-brand-dark border border-brand-gray-800 focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald text-white rounded-md text-sm outline-none transition-all"
                  />
                  {errors.projects?.[index]?.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.projects[index]?.name?.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-gray-300 mb-1.5 flex items-center gap-1">
                    <Link className="w-3 h-3" /> Project URL
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. https://github.com/username/project"
                    {...register(`projects.${index}.url`)}
                    className="w-full px-3 py-2 bg-brand-dark border border-brand-gray-800 focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald text-white rounded-md text-sm outline-none transition-all"
                  />
                  {errors.projects?.[index]?.url && (
                    <p className="text-red-500 text-xs mt-1">{errors.projects[index]?.url?.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-brand-gray-300 mb-1.5 flex items-center gap-1">
                    <Code className="w-3.5 h-3.5" /> Tech Stack / Tools *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. React, Node.js, AWS, Tailwind CSS"
                    {...register(`projects.${index}.techStack`)}
                    className="w-full px-3 py-2 bg-brand-dark border border-brand-gray-800 focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald text-white rounded-md text-sm outline-none transition-all"
                  />
                  {errors.projects?.[index]?.techStack && (
                    <p className="text-red-500 text-xs mt-1">{errors.projects[index]?.techStack?.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-gray-300 mb-1.5">
                    Short Description *
                  </label>
                  <input
                    type="text"
                    placeholder="Briefly explain the purpose of this project..."
                    {...register(`projects.${index}.description`)}
                    className="w-full px-3 py-2 bg-brand-dark border border-brand-gray-800 focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald text-white rounded-md text-sm outline-none transition-all"
                  />
                  {errors.projects?.[index]?.description && (
                    <p className="text-red-500 text-xs mt-1">{errors.projects[index]?.description?.message}</p>
                  )}
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-semibold text-brand-gray-300">
                      Key Features, Achievements or Metrics (Optional)
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const text = watch(`projects.${index}.features`) || "";
                        const lines = text.split("\n").map(l => {
                          const trimmed = l.trim();
                          if (!trimmed) return "";
                          if (/^[•\-\*▪\+]/.test(trimmed)) return trimmed;
                          return `- ${trimmed}`;
                        }).filter(Boolean).join("\n");
                        setValue(`projects.${index}.features`, lines);
                      }}
                      className="text-[10px] font-semibold text-brand-blue hover:text-brand-emerald hover:underline cursor-pointer transition-colors"
                      title="Add bullet points format automatically"
                    >
                      ✨ Convert to bullets
                    </button>
                  </div>
                  <textarea
                    rows={3}
                    placeholder="- Reduced server latency by 40% through Redis caching&#10;- Integrated server-side conversions API to capture user sessions"
                    {...register(`projects.${index}.features`)}
                    className="w-full px-3 py-2 bg-brand-dark border border-brand-gray-800 focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald text-white rounded-md text-sm outline-none transition-all font-mono placeholder:font-sans leading-relaxed"
                  />
                  {errors.projects?.[index]?.features && (
                    <p className="text-red-500 text-xs mt-1">{errors.projects[index]?.features?.message}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
