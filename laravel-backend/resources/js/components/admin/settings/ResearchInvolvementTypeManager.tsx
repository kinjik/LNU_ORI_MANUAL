import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../api/axios";
import { ResearchInvolvementType, FormSchemaField } from "../../shared/types/types";

// ─── API helpers ────────────────────────────────────────────────────────────
const fetchTypes = async (): Promise<ResearchInvolvementType[]> => {
  const res = await api.get("/api/admin/research-involvement-types");
  return res.data.data;
};
const createType = (data: { research_involvement_type: string; default_points: number | null; form_schema: FormSchemaField[] }) =>
  api.post("/api/admin/research-involvement-types", data);
const updateType = (id: number, data: { research_involvement_type: string; enable: boolean; default_points: number | null; form_schema: FormSchemaField[] }) =>
  api.put(`/api/admin/research-involvement-types/${id}`, data);
const deleteType = (id: number) =>
  api.delete(`/api/admin/research-involvement-types/${id}`);

// ─── Component ───────────────────────────────────────────────────────────────
export default function ResearchInvolvementTypeManager() {
  const qc = useQueryClient();
  const { data: types = [], isLoading } = useQuery({
    queryKey: ["researchInvolvementTypes"],
    queryFn: fetchTypes,
  });

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<ResearchInvolvementType | null>(null);
  const [formName, setFormName] = useState("");
  const [formEnabled, setFormEnabled] = useState(true);
  const [defaultPoints, setDefaultPoints] = useState<number | "">("");
  const [formSchema, setFormSchema] = useState<FormSchemaField[]>([]);
  const [error, setError] = useState("");

  const invalidate = () => qc.invalidateQueries(["researchInvolvementTypes"]);

  const createMutation = useMutation({
    mutationFn: () => createType({
      research_involvement_type: formName,
      default_points: defaultPoints === "" ? null : Number(defaultPoints),
      form_schema: formSchema,
    }),
    onSuccess: () => { invalidate(); closeModal(); },
    onError: () => setError("Failed to create type. Please try again."),
  });

  const updateMutation = useMutation({
    mutationFn: () =>
      updateType(editing!.id, {
        research_involvement_type: formName,
        enable: formEnabled,
        default_points: defaultPoints === "" ? null : Number(defaultPoints),
        form_schema: formSchema,
      }),
    onSuccess: () => { invalidate(); closeModal(); },
    onError: () => setError("Failed to update type. Please try again."),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteType(id),
    onSuccess: () => invalidate(),
    onError: () => alert("Cannot delete a built-in type."),
  });

  const openCreate = () => {
    setEditing(null);
    setFormName("");
    setFormEnabled(true);
    setDefaultPoints("");
    setFormSchema([]);
    setError("");
    setShowModal(true);
  };

  const openEdit = (type: ResearchInvolvementType) => {
    setEditing(type);
    setFormName(type.research_involvement_type);
    setFormEnabled(type.enable);
    setDefaultPoints(type.default_points ?? "");
    setFormSchema(type.form_schema || []);
    setError("");
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const handleSave = () => {
    if (!formName.trim()) {
      setError("Name is required.");
      return;
    }
    // Validate form schema fields
    if (formSchema.some(f => !f.label.trim())) {
      setError("All fields must have a label.");
      return;
    }
    if (editing) updateMutation.mutate();
    else createMutation.mutate();
  };

  const addField = () => {
    setFormSchema([
      ...formSchema,
      { id: Date.now().toString(), label: "", type: "text" },
    ]);
  };

  const updateField = (id: string, updates: Partial<FormSchemaField>) => {
    setFormSchema(
      formSchema.map((field) =>
        field.id === id ? { ...field, ...updates } : field
      )
    );
  };

  const removeField = (id: string) => {
    setFormSchema(formSchema.filter((field) => field.id !== id));
  };

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Research Involvement Types</h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage the types faculty can submit. Built-in types cannot be edited or deleted.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700"
        >
          + Add Custom Type
        </button>
      </div>

      {isLoading ? (
        <p className="text-sm text-gray-400 italic">Loading types…</p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Type Name</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {types.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-400">{t.id}</td>
                  <td className="px-6 py-4 font-medium text-gray-800 capitalize">
                    {t.research_involvement_type}
                    {!t.is_custom && (
                      <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700">
                        Built-in
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {t.is_custom ? (
                      <>
                        <button
                          onClick={() => openEdit(t)}
                          className="mr-3 text-blue-600 hover:underline text-xs font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete "${t.research_involvement_type}"?`)) {
                              deleteMutation.mutate(t.id);
                            }
                          }}
                          className="text-red-500 hover:underline text-xs font-medium"
                        >
                          Delete
                        </button>
                      </>
                    ) : (
                      <span className="text-xs text-gray-400 italic">Cannot modify</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm overflow-y-auto py-10">
          <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl my-auto">
            <h3 className="mb-5 text-lg font-bold text-gray-800">
              {editing ? "Edit Type" : "Add Custom Type"}
            </h3>

            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700 after:ms-1 after:text-red-500 after:content-['*']">
                  Type Name
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="h-10 rounded-lg border border-gray-300 px-3 text-sm focus:border-blue-500 focus:outline-none"
                  placeholder="e.g. Book Chapter Writing"
                />
              </div>

              {editing && (
                <div className="flex items-center gap-3">
                  <input
                    id="enableToggle"
                    type="checkbox"
                    checked={formEnabled}
                    onChange={(e) => setFormEnabled(e.target.checked)}
                    className="h-4 w-4 cursor-pointer rounded accent-blue-600"
                  />
                  <label htmlFor="enableToggle" className="text-sm font-medium text-gray-700 cursor-pointer">
                    Enabled (visible to faculty)
                  </label>
                </div>
              )}

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">
                  Default Points
                </label>
                <input
                  type="number"
                  min="0"
                  value={defaultPoints}
                  onChange={(e) => setDefaultPoints(e.target.value ? Number(e.target.value) : "")}
                  className="h-10 rounded-lg border border-gray-300 px-3 text-sm focus:border-blue-500 focus:outline-none"
                  placeholder="Leave empty if points are variable"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-semibold text-gray-700">Form Fields</label>
                  <button
                    onClick={addField}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                  >
                    + Add Field
                  </button>
                </div>
                
                {formSchema.length === 0 ? (
                  <p className="text-xs text-gray-400 italic bg-gray-50 p-3 rounded-lg text-center border border-dashed border-gray-300">
                    No custom fields. The Co-Authors field is always included by default.
                  </p>
                ) : (
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                    {formSchema.map((field, index) => (
                      <div key={field.id} className="flex gap-2 items-start bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <div className="flex-1 space-y-2">
                          <input
                            type="text"
                            value={field.label}
                            onChange={(e) => updateField(field.id, { label: e.target.value })}
                            className="w-full h-8 rounded border border-gray-300 px-2 text-sm focus:border-blue-500 focus:outline-none"
                            placeholder="Field Label (e.g. Sponsor Name)"
                          />
                          <select
                            value={field.type}
                            onChange={(e) => updateField(field.id, { type: e.target.value as any })}
                            className="w-full h-8 rounded border border-gray-300 px-2 text-sm focus:border-blue-500 focus:outline-none bg-white"
                          >
                            <option value="text">Text Input</option>
                            <option value="number">Number Input</option>
                            <option value="date">Date Picker</option>
                          </select>
                        </div>
                        <button
                          onClick={() => removeField(field.id)}
                          className="mt-1 text-red-500 hover:text-red-700 p-1"
                          title="Remove Field"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={createMutation.isLoading || updateMutation.isLoading}
                className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {createMutation.isLoading || updateMutation.isLoading
                  ? "Saving…"
                  : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
