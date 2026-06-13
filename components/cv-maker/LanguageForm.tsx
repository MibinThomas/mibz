import React from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { Plus, Trash2, Languages } from "lucide-react";
import { CVFormValues } from "../../lib/cvSchema";

export default function LanguageForm() {
  const { register, control, formState: { errors } } = useFormContext<CVFormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "languages",
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-brand-gray-800 pb-2">
        <h3 className="text-lg font-heading font-semibold text-white flex items-center gap-2">
          <Languages className="w-5 h-5 text-brand-emerald" />
          Languages
        </h3>
        <button
          type="button"
          onClick={() => append({ id: `lang-${Date.now()}`, name: "", proficiency: "Native" })}
          className="px-3 py-1.5 rounded-md bg-brand-emerald/10 text-brand-emerald hover:bg-brand-emerald/20 transition-all font-medium text-xs flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Language
        </button>
      </div>

      {fields.length === 0 ? (
        <div className="text-center py-6 border border-dashed border-brand-gray-800 rounded-lg text-brand-gray-500 text-sm">
          No languages added yet. Click &quot;Add Language&quot; to add one.
        </div>
      ) : (
        <div className="space-y-4">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="p-4 border border-brand-gray-800 bg-brand-card/30 rounded-lg flex flex-col md:flex-row gap-4 items-end relative group"
            >
              <button
                type="button"
                onClick={() => remove(index)}
                className="absolute top-4 right-4 md:static md:mb-1.5 text-brand-gray-500 hover:text-red-500 transition-colors p-1.5 rounded bg-brand-dark/50"
                aria-label="Remove Language"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <div className="flex-grow">
                <label className="block text-xs font-semibold text-brand-gray-300 mb-1.5">
                  Language *
                </label>
                <input
                  type="text"
                  placeholder="e.g. English, Arabic, German"
                  {...register(`languages.${index}.name`)}
                  className="w-full px-3 py-2 bg-brand-dark border border-brand-gray-800 focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald text-white rounded-md text-sm outline-none transition-all"
                />
                {errors.languages?.[index]?.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.languages[index]?.name?.message}</p>
                )}
              </div>

              <div className="w-full md:w-64">
                <label className="block text-xs font-semibold text-brand-gray-300 mb-1.5">
                  Proficiency Level *
                </label>
                <select
                  {...register(`languages.${index}.proficiency`)}
                  className="w-full px-3 py-2 bg-brand-dark border border-brand-gray-800 focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald text-white rounded-md text-sm outline-none transition-all"
                >
                  <option value="Native">Native / Bilingual</option>
                  <option value="Fluent">Fluent / Professional</option>
                  <option value="Full Professional">Full Professional</option>
                  <option value="Professional Working">Professional Working</option>
                  <option value="Limited Working">Limited Working</option>
                  <option value="Elementary">Elementary</option>
                </select>
                {errors.languages?.[index]?.proficiency && (
                  <p className="text-red-500 text-xs mt-1">{errors.languages[index]?.proficiency?.message}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
