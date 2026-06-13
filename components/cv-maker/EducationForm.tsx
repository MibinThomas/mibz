import React from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { Plus, Trash2, Calendar, MapPin, GraduationCap } from "lucide-react";
import { CVFormValues } from "../../lib/cvSchema";

export default function EducationForm() {
  const { register, control, formState: { errors } } = useFormContext<CVFormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "education",
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-brand-gray-800 pb-2">
        <h3 className="text-lg font-heading font-semibold text-white flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-brand-emerald" />
          Education
        </h3>
        <button
          type="button"
          onClick={() => append({ id: `edu-${Date.now()}`, institution: "", degree: "", location: "", startDate: "", endDate: "" })}
          className="px-3 py-1.5 rounded-md bg-brand-emerald/10 text-brand-emerald hover:bg-brand-emerald/20 transition-all font-medium text-xs flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Education
        </button>
      </div>

      {fields.length === 0 ? (
        <div className="text-center py-6 border border-dashed border-brand-gray-800 rounded-lg text-brand-gray-500 text-sm">
          No education history added yet. Click &quot;Add Education&quot; to add one.
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
                aria-label="Remove Education"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <h4 className="text-sm font-semibold text-brand-emerald pr-8">
                Education #{index + 1}
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-brand-gray-300 mb-1.5">
                    Institution / School *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Heriot-Watt University Dubai"
                    {...register(`education.${index}.institution`)}
                    className="w-full px-3 py-2 bg-brand-dark border border-brand-gray-800 focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald text-white rounded-md text-sm outline-none transition-all"
                  />
                  {errors.education?.[index]?.institution && (
                    <p className="text-red-500 text-xs mt-1">{errors.education[index]?.institution?.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-gray-300 mb-1.5">
                    Degree / Course / Major *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. BSc in Computer Science"
                    {...register(`education.${index}.degree`)}
                    className="w-full px-3 py-2 bg-brand-dark border border-brand-gray-800 focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald text-white rounded-md text-sm outline-none transition-all"
                  />
                  {errors.education?.[index]?.degree && (
                    <p className="text-red-500 text-xs mt-1">{errors.education[index]?.degree?.message}</p>
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
                    {...register(`education.${index}.location`)}
                    className="w-full px-3 py-2 bg-brand-dark border border-brand-gray-800 focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald text-white rounded-md text-sm outline-none transition-all"
                  />
                  {errors.education?.[index]?.location && (
                    <p className="text-red-500 text-xs mt-1">{errors.education[index]?.location?.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-gray-300 mb-1.5 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Start Year *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 2016"
                    {...register(`education.${index}.startDate`)}
                    className="w-full px-3 py-2 bg-brand-dark border border-brand-gray-800 focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald text-white rounded-md text-sm outline-none transition-all"
                  />
                  {errors.education?.[index]?.startDate && (
                    <p className="text-red-500 text-xs mt-1">{errors.education[index]?.startDate?.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-gray-300 mb-1.5 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> End Year (or Expected) *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 2019"
                    {...register(`education.${index}.endDate`)}
                    className="w-full px-3 py-2 bg-brand-dark border border-brand-gray-800 focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald text-white rounded-md text-sm outline-none transition-all"
                  />
                  {errors.education?.[index]?.endDate && (
                    <p className="text-red-500 text-xs mt-1">{errors.education[index]?.endDate?.message}</p>
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
