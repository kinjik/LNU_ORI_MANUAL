import { useEffect, useRef, useState } from "react";
import api from "../../api/axios";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { toast } from "react-toastify";
import ConfirmationModal from "../../shared/components/ConfirmationModal";

// ── Inline SVG Icons ──────────────────────────────────────────────────────────
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
const UploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
  </svg>
);

export default function GlobalSettings() {
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [saved, setSaved]       = useState(false);
  const [uploading, setUploading] = useState(false);
  const [reverting, setReverting] = useState(false);
  const [openRevertModal, setOpenRevertModal] = useState(false);

  const [settings, setSettings] = useState({
    signatory_executive_director: "",
    signatory_vice_president: "",
  });

  // Header image state
  const [currentHeaderUrl, setCurrentHeaderUrl] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl]             = useState<string | null>(null);
  const [selectedFile, setSelectedFile]         = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.get("/api/admin/system-settings");
      if (response.data.data) {
        const d = response.data.data;
        setSettings((prev) => ({
          ...prev,
          signatory_executive_director: d.signatory_executive_director ?? "",
          signatory_vice_president:     d.signatory_vice_president     ?? "",
        }));
        if (d.report_header_image) {
          setCurrentHeaderUrl(d.report_header_image);
        }
      }
    } catch (error) {
      console.error("Failed to fetch settings", error);
      toast.error("Failed to load settings.");
    } finally {
      setLoading(false);
    }
  };

  // ── Signatories ─────────────────────────────────────────────────────────────
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
    } catch {
      toast.error("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  // ── Header Image ─────────────────────────────────────────────────────────────
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleImageUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("report_header_image", selectedFile);
    try {
      const res = await api.post("/api/admin/system-settings/upload-header-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const uploadedUrl = res.data.url;
      setCurrentHeaderUrl(uploadedUrl);
      setPreviewUrl(null);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      toast.success("Header image updated successfully!");
    } catch {
      toast.error("Failed to upload image. Ensure it is a valid image file (max 4 MB).");
    } finally {
      setUploading(false);
    }
  };

  const handleRevertClick = () => {
    setOpenRevertModal(true);
  };

  const handleConfirmRevert = async () => {
    setOpenRevertModal(false);
    setReverting(true);
    try {
      await api.delete("/api/admin/system-settings/header-image");
      setCurrentHeaderUrl(null);
      setPreviewUrl(null);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      toast.success("Header reverted to default.");
    } catch {
      toast.error("Failed to revert header image.");
    } finally {
      setReverting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-52 items-center justify-center">
        <AiOutlineLoading3Quarters className="size-8 animate-spin text-blue-500" />
      </div>
    );
  }

  const signatoryFields: {
    label: string;
    name: keyof typeof settings;
    subtitle: string;
    placeholder: string;
  }[] = [
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

      {/* ── Header Card ─────────────────────────────────────────────────── */}
      <div className="rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
            <PenIcon />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Report Settings</h2>
            <p className="mt-0.5 text-sm text-gray-500">
              Manage the header image and signatory names that appear on the Faculty Performance Evaluation Report (FPES) PDF.
            </p>
          </div>
        </div>
      </div>

      {/* ── Report Header Image ──────────────────────────────────────────── */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
        <div className="mb-4 flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full bg-purple-50 px-2.5 py-1 text-xs font-semibold text-purple-600">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            Header Image
          </span>
        </div>
        <label className="mb-1 block text-base font-bold text-gray-800">Report Header Image</label>
        <p className="mb-4 text-xs font-medium text-gray-400">
          This replaces the banner at the top of the FPES PDF (university + ORI logos). Accepted: JPEG, PNG, SVG — max 4 MB.
        </p>

        {/* Current / Preview */}
        <div className="mb-4 overflow-hidden rounded-lg border border-dashed border-gray-300 bg-gray-50">
          {previewUrl ? (
            <div>
              <p className="px-4 pt-3 text-xs font-semibold text-amber-600">Preview (not yet saved)</p>
              <img src={previewUrl} alt="Header preview" className="w-full object-contain p-3" style={{ maxHeight: 120 }} />
            </div>
          ) : currentHeaderUrl ? (
            <div>
              <p className="px-4 pt-3 text-xs font-semibold text-green-600">Current header image</p>
              <img src={currentHeaderUrl} alt="Current header" className="w-full object-contain p-3" style={{ maxHeight: 120 }} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <UploadIcon />
              <p className="mt-2 text-sm text-gray-500">No header image set — the default static image will be used.</p>
            </div>
          )}
        </div>

        {/* File Picker */}
        <div className="flex flex-wrap items-center gap-3">
          <label
            htmlFor="header-image-input"
            className="cursor-pointer rounded-lg border-2 border-dashed border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 transition hover:border-blue-400 hover:text-blue-600"
          >
            {selectedFile ? `✔ ${selectedFile.name}` : "Choose image…"}
          </label>
          <input
            id="header-image-input"
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/jpg,image/gif,image/svg+xml"
            onChange={handleFileSelect}
            className="hidden"
          />
          {selectedFile && (
            <button
              onClick={handleImageUpload}
              disabled={uploading}
              className="flex items-center gap-2 rounded-lg bg-purple-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-purple-700 disabled:opacity-50"
            >
              {uploading ? (
                <><AiOutlineLoading3Quarters className="animate-spin" /> Uploading…</>
              ) : (
                "Upload & Save"
              )}
            </button>
          )}
          {/* Show revert only when a custom image is saved in the DB */}
          {currentHeaderUrl && !selectedFile && (
            <button
              onClick={handleRevertClick}
              disabled={reverting}
              className="flex items-center gap-2 rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
            >
              {reverting ? (
                <><AiOutlineLoading3Quarters className="animate-spin" /> Reverting…</>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Revert to Default
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* ── Signatory Fields ─────────────────────────────────────────────── */}
      <div className="space-y-4">
        {signatoryFields.map((field) => (
          <div key={field.name} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="mb-4 flex items-center gap-2">
              <span className="flex items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-600">
                <BadgeIcon />
                Signatory
              </span>
            </div>
            <label className="mb-1 block text-base font-bold text-gray-800">{field.label}</label>
            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-gray-400">{field.subtitle}</p>
            <input
              type="text"
              name={field.name}
              value={settings[field.name]}
              onChange={handleChange}
              placeholder={field.placeholder}
              className="w-full rounded-lg border-2 border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-800 placeholder-gray-400 transition-all focus:border-blue-500 focus:bg-white focus:outline-none"
            />
            <p className="mt-2 flex items-center gap-1.5 text-xs text-gray-400">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Displayed on the FPES PDF signature block. Leave blank to show a placeholder line.
            </p>
          </div>
        ))}
      </div>

      {/* ── Save Signatories Button ──────────────────────────────────────── */}
      <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <p className="text-sm text-gray-500">Changes take effect on the next report generated.</p>
        <button
          onClick={handleSave}
          disabled={saving}
          className={`flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all disabled:cursor-not-allowed disabled:opacity-60 ${
            saved ? "bg-green-500 hover:bg-green-600" : "bg-blue-600 hover:bg-blue-700 active:scale-95"
          }`}
        >
          {saving ? (
            <><AiOutlineLoading3Quarters className="animate-spin" /> Saving…</>
          ) : saved ? (
            <><CheckIcon /> Saved!</>
          ) : (
            "Save Signatories"
          )}
        </button>
      </div>

      {/* Confirmation Modal for Reverting */}
      <ConfirmationModal
        isOpen={openRevertModal}
        title="Revert Header Image"
        message="Are you sure you want to revert to the default header image? This will delete the current custom image."
        onConfirm={handleConfirmRevert}
        onCancel={() => setOpenRevertModal(false)}
        type="warning"
        confirmLabel="Revert"
        cancelLabel="Cancel"
      />
    </div>
  );
}
