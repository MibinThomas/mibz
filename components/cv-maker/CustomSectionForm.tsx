import React from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { Plus, Trash2, FileText } from "lucide-react";
import { CVFormValues } from "../../lib/cvSchema";

export default function CustomSectionForm() {
  const { register, control, formState: { errors } } = useFormContext<CVFormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "customSections",
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-brand-gray-800 pb-2">
        <h3 className="text-lg font-heading font-semibold text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-brand-emerald" />
          Custom Sections
        </h3>
        <button
          type="button"
          onClick={() => append({ id: `cust-${Date.now()}`, title: "", content: "" })}
          className="px-3 py-1.5 rounded-md bg-brand-emerald/10 text-brand-emerald hover:bg-brand-emerald/20 transition-all font-medium text-xs flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Custom Section
        </button>
      </div>

      <p className="text-xs text-brand-gray-400">
        Use custom sections to add **Awards, Volunteer Work, Publications, Associations, or Training** detail boxes.
      </p>

      {fields.length === 0 ? (
        <div className="text-center py-6 border border-dashed border-brand-gray-800 rounded-lg text-brand-gray-500 text-sm">
          No custom sections added yet. Click &quot;Add Custom Section&quot; to create one.
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
                aria-label="Remove Custom Section"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <h4 className="text-sm font-semibold text-brand-emerald pr-8">
                Custom Section #{index + 1}
              </h4>

              <div>
                <label className="block text-xs font-semibold text-brand-gray-300 mb-1.5">
                  Section Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Volunteer Work, Awards & Honors, Publications"
                  {...register(`customSections.${index}.title`)}
                  className="w-full px-3 py-2 bg-brand-dark border border-brand-gray-800 focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald text-white rounded-md text-sm outline-none transition-all"
                />
                {errors.customSections?.[index]?.title && (
                  <p className="text-red-500 text-xs mt-1">{errors.customSections[index]?.title?.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-gray-300 mb-1.5">
                  Section Content / Achievements *
                </label>
                <textarea
                  rows={4}
                  placeholder="- Spearheaded organic community cleanups with 200+ volunteers&#10;- Published article on Next.js hydration optimization in WebDev Weekly"
                  {...register(`customSections.${index}.content`)}
                  className="w-full px-3 py-2 bg-brand-dark border border-brand-gray-800 focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald text-white rounded-md text-sm outline-none transition-all font-mono placeholder:font-sans leading-relaxed"
                />
                {errors.customSections?.[index]?.content && (
                  <p className="text-red-500 text-xs mt-1">{errors.customSections[index]?.content?.message}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
