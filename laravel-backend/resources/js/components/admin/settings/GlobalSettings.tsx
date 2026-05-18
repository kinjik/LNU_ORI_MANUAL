import { useEffect, useState } from "react";
import api from "../../api/axios";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { toast } from "react-toastify";

// Icons (inline SVG to avoid extra deps)
const PenIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 012.828 2.828L11.828 15.828a2 2 0 01-.828.485l-3.536.707.707-3.536a2 2 0 01.485-.828z" />
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const BadgeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
  </svg>
);

export default function GlobalSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    signatory_executive_director: "",
    signatory_vice_president: "",
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.get("/api/admin/system-settings");
      if (response.data.data) {
        setSettings((prev) => ({ ...prev, ...response.data.data }));
      }
    } catch (error) {
      console.error("Failed to fetch settings", error);
      toast.error("Failed to load settings.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSaved(false);
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put("/api/admin/system-settings", { settings });
      setSaved(true);
      toast.success("Signatories saved successfully!");
    } catch (error) {
      console.error("Failed to save settings", error);
      toast.error("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-52 items-center justify-center">
        <AiOutlineLoading3Quarters className="size-8 animate-spin text-blue-500" />
      </div>
    );
  }

  const fields: { label: string; name: keyof typeof settings; subtitle: string; placeholder: string }[] = [
    {
      label: "Executive Director",
      name: "signatory_executive_director",
      subtitle: "Office of Research and Innovation",
      placeholder: "e.g. Dr. Maria Santos",
    },
    {
      label: "Vice President",
      name: "signatory_vice_president",
      subtitle: "Office of Research, Innovation and Extension",
      placeholder: "e.g. Dr. Juan dela Cruz",
    },
  ];

  return (
    <div className="max-w-3xl space-y-6">
      {/* Header Card */}
      <div className="rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
            <PenIcon />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Report Signatories</h2>
            <p className="mt-0.5 text-sm text-gray-500">
              These names appear on the signature lines of the Faculty Performance Evaluation Report (FPES) PDF. Keep them up to date whenever there are personnel changes.
            </p>
          </div>
        </div>
      </div>

      {/* Fields */}
      <div className="space-y-4">
        {fields.map((field) => (
          <div key={field.name} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="mb-4 flex items-center gap-2">
              <span className="flex items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-600">
                <BadgeIcon />
                Signatory
              </span>
            </div>

            <label className="mb-1 block text-base font-bold text-gray-800">
              {field.label}
            </label>
            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-gray-400">
              {field.subtitle}
            </p>

            <div className="relative">
              <input
                type="text"
                name={field.name}
                value={settings[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                className="w-full rounded-lg border-2 border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-800 placeholder-gray-400 transition-all focus:border-blue-500 focus:bg-white focus:outline-none"
              />
            </div>

            <p className="mt-2 flex items-center gap-1.5 text-xs text-gray-400">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Displayed on the FPES PDF signature block. Leave blank to show a line placeholder.
            </p>
          </div>
        ))}
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <p className="text-sm text-gray-500">
          Changes take effect on the next report generated.
        </p>
        <button
          onClick={handleSave}
          disabled={saving}
          className={`flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all disabled:cursor-not-allowed disabled:opacity-60 ${
            saved
              ? "bg-green-500 hover:bg-green-600"
              : "bg-blue-600 hover:bg-blue-700 active:scale-95"
          }`}
        >
          {saving ? (
            <>
              <AiOutlineLoading3Quarters className="animate-spin" />
              Saving…
            </>
          ) : saved ? (
            <>
              <CheckIcon />
              Saved!
            </>
          ) : (
            "Save Signatories"
          )}
        </button>
      </div>
    </div>
  );
}
