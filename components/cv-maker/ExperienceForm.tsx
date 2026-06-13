import React from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { Plus, Trash2, Calendar, MapPin, Briefcase } from "lucide-react";
import { CVFormValues } from "../../lib/cvSchema";

export default function ExperienceForm() {
  const { register, control, watch, setValue, formState: { errors } } = useFormContext<CVFormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "experience",
  });

  const watchExperience = watch("experience") || [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-brand-gray-800 pb-2">
        <h3 className="text-lg font-heading font-semibold text-white flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-brand-emerald" />
          Work Experience
        </h3>
        <button
          type="button"
          onClick={() => append({ id: `exp-${Date.now()}`, company: "", position: "", location: "", startDate: "", endDate: "", current: false, description: "" })}
          className="px-3 py-1.5 rounded-md bg-brand-emerald/10 text-brand-emerald hover:bg-brand-emerald/20 transition-all font-medium text-xs flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Work
        </button>
      </div>

      <p className="text-xs text-brand-gray-400">
        💡 **Tip**: Describe your achievements with action verbs (e.g. *Spearheaded, Optimized, Managed, Built*) and use metrics where possible.
      </p>

      {fields.length === 0 ? (
        <div className="text-center py-6 border border-dashed border-brand-gray-800 rounded-lg text-brand-gray-500 text-sm">
          No work experience added yet. Click &quot;Add Work&quot; to add one.
        </div>
      ) : (
        <div className="space-y-6">
          {fields.map((field, index) => {
            const isCurrent = watchExperience[index]?.current;
            return (
              <div
                key={field.id}
                className="p-4 border border-brand-gray-800 bg-brand-card/30 rounded-lg space-y-4 relative group"
              >
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="absolute top-4 right-4 text-brand-gray-500 hover:text-red-500 transition-colors p-1.5 rounded bg-brand-dark/50"
                  aria-label="Remove Experience"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <h4 className="text-sm font-semibold text-brand-emerald pr-8">
                  Experience #{index + 1}
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-brand-gray-300 mb-1.5">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Google"
                      {...register(`experience.${index}.company`)}
                      className="w-full px-3 py-2 bg-brand-dark border border-brand-gray-800 focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald text-white rounded-md text-sm outline-none transition-all"
                    />
                    {errors.experience?.[index]?.company && (
                      <p className="text-red-500 text-xs mt-1">{errors.experience[index]?.company?.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-brand-gray-300 mb-1.5">
                      Job Title / Position *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Senior Software Engineer"
                      {...register(`experience.${index}.position`)}
                      className="w-full px-3 py-2 bg-brand-dark border border-brand-gray-800 focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald text-white rounded-md text-sm outline-none transition-all"
                    />
                    {errors.experience?.[index]?.position && (
                      <p className="text-red-500 text-xs mt-1">{errors.experience[index]?.position?.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-brand-gray-300 mb-1.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> Location *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Dubai, UAE"
                      {...register(`experience.${index}.location`)}
                      className="w-full px-3 py-2 bg-brand-dark border border-brand-gray-800 focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald text-white rounded-md text-sm outline-none transition-all"
                    />
                    {errors.experience?.[index]?.location && (
                      <p className="text-red-500 text-xs mt-1">{errors.experience[index]?.location?.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-brand-gray-300 mb-1.5 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Start Date *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Jan 2022 or 2022-03"
                      {...register(`experience.${index}.startDate`)}
                      className="w-full px-3 py-2 bg-brand-dark border border-brand-gray-800 focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald text-white rounded-md text-sm outline-none transition-all"
                    />
                    {errors.experience?.[index]?.startDate && (
                      <p className="text-red-500 text-xs mt-1">{errors.experience[index]?.startDate?.message}</p>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-brand-gray-300 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> End Date *
                      </label>
                      <label className="flex items-center gap-1 text-[10px] text-brand-emerald cursor-pointer font-medium select-none">
                        <input
                          type="checkbox"
                          {...register(`experience.${index}.current`)}
                          onChange={(e) => {
                            const val = e.target.checked;
                            setValue(`experience.${index}.current`, val);
                            if (val) {
                              setValue(`experience.${index}.endDate`, "Present");
                            } else {
                              setValue(`experience.${index}.endDate`, "");
                            }
                          }}
                          className="rounded border-brand-gray-800 bg-brand-dark text-brand-emerald focus:ring-brand-emerald focus:ring-offset-brand-dark w-3 h-3"
                        />
                        Present
                      </label>
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. Present or Dec 2025"
                      disabled={isCurrent}
                      {...register(`experience.${index}.endDate`)}
                      className="w-full px-3 py-2 bg-brand-dark border border-brand-gray-800 focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald text-white rounded-md text-sm outline-none transition-all disabled:opacity-50"
                    />
                    {errors.experience?.[index]?.endDate && (
                      <p className="text-red-500 text-xs mt-1">{errors.experience[index]?.endDate?.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-semibold text-brand-gray-300">
                      Roles, Achievements & Responsibilities *
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const text = watch(`experience.${index}.description`) || "";
                        const lines = text.split("\n").map(l => {
                          const trimmed = l.trim();
                          if (!trimmed) return "";
                          if (/^[•\-\*▪\+]/.test(trimmed)) return trimmed;
                          return `- ${trimmed}`;
                        }).filter(Boolean).join("\n");
                        setValue(`experience.${index}.description`, lines);
                      }}
                      className="text-[10px] font-semibold text-brand-blue hover:text-brand-emerald hover:underline cursor-pointer transition-colors"
                      title="Add bullet points format automatically"
                    >
                      ✨ Convert to bullets
                    </button>
                  </div>
                  <textarea
                    rows={4}
                    placeholder="- Spearheaded design and integration of backend modules, boosting load times by 20%&#10;- Managed high-traffic APIs serving 150k+ daily users"
                    {...register(`experience.${index}.description`)}
                    className="w-full px-3 py-2 bg-brand-dark border border-brand-gray-800 focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald text-white rounded-md text-sm outline-none transition-all font-mono placeholder:font-sans leading-relaxed"
                  />
                  {errors.experience?.[index]?.description && (
                    <p className="text-red-500 text-xs mt-1">{errors.experience[index]?.description?.message}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
