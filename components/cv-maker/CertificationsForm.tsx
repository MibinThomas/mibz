import React from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { Plus, Trash2, Award, Link } from "lucide-react";
import { CVFormValues } from "../../lib/cvSchema";

export default function CertificationsForm() {
  const { register, control, formState: { errors } } = useFormContext<CVFormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "certifications",
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-brand-gray-800 pb-2">
        <h3 className="text-lg font-heading font-semibold text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-brand-emerald" />
          Certifications
        </h3>
        <button
          type="button"
          onClick={() => append({ id: `cert-${Date.now()}`, name: "", issuer: "", year: "", url: "" })}
          className="px-3 py-1.5 rounded-md bg-brand-emerald/10 text-brand-emerald hover:bg-brand-emerald/20 transition-all font-medium text-xs flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Certification
        </button>
      </div>

      {fields.length === 0 ? (
        <div className="text-center py-6 border border-dashed border-brand-gray-800 rounded-lg text-brand-gray-500 text-sm">
          No certifications added yet. Click &quot;Add Certification&quot; to add one.
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
                aria-label="Remove Certification"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <h4 className="text-sm font-semibold text-brand-emerald pr-8">
                Certification #{index + 1}
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-brand-gray-300 mb-1.5">
                    Certification Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Meta Certified Media Buying Professional"
                    {...register(`certifications.${index}.name`)}
                    className="w-full px-3 py-2 bg-brand-dark border border-brand-gray-800 focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald text-white rounded-md text-sm outline-none transition-all"
                  />
                  {errors.certifications?.[index]?.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.certifications[index]?.name?.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-gray-300 mb-1.5">
                    Issuing Organization *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Meta / Google / AWS"
                    {...register(`certifications.${index}.issuer`)}
                    className="w-full px-3 py-2 bg-brand-dark border border-brand-gray-800 focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald text-white rounded-md text-sm outline-none transition-all"
                  />
                  {errors.certifications?.[index]?.issuer && (
                    <p className="text-red-500 text-xs mt-1">{errors.certifications[index]?.issuer?.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-brand-gray-300 mb-1.5">
                    Year *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 2024"
                    {...register(`certifications.${index}.year`)}
                    className="w-full px-3 py-2 bg-brand-dark border border-brand-gray-800 focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald text-white rounded-md text-sm outline-none transition-all"
                  />
                  {errors.certifications?.[index]?.year && (
                    <p className="text-red-500 text-xs mt-1">{errors.certifications[index]?.year?.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-gray-300 mb-1.5 flex items-center gap-1">
                    <Link className="w-3.5 h-3.5" /> Certificate URL (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. https://credential.url"
                    {...register(`certifications.${index}.url`)}
                    className="w-full px-3 py-2 bg-brand-dark border border-brand-gray-800 focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald text-white rounded-md text-sm outline-none transition-all"
                  />
                  {errors.certifications?.[index]?.url && (
                    <p className="text-red-500 text-xs mt-1">{errors.certifications[index]?.url?.message}</p>
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
