import { useQueryClient } from "@tanstack/react-query";
import React, { useRef, useState } from "react";
import { pngwing as pdfThumbnail } from "../../../../assets/images";
import api from "../../../api/axios";
import Badge from "../../../shared/components/Badge";
import Tooltip from "../../../shared/components/Tooltip";
import {
  Researchdocument,
  STATUS_TYPE,
} from "../../../shared/types/types";
import { imageMimeType } from "../../../util/ImageMimeTypes";
import { parseDate } from "../../../util/parseDate";

type GenericResearchDetailsProps = {
  generic: {
    id: number;
    researchmonitoringform_id: number;
    dynamic_data: Record<string, any>;
  };
  formSchema: Array<{ id: string; label: string; type: "text" | "date" | "number" }>;
  status: string;
  coauthors?: any[];
  documents: Researchdocument[];
};

function GenericResearchDetails({
  generic,
  formSchema,
  status,
  documents,
  coauthors,
}: GenericResearchDetailsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const queryClient = useQueryClient();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPendingFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUpdate = async () => {
    if (!pendingFile) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file_path", pendingFile);
      await api.post(
        `/api/research-monitoring-form/${generic.researchmonitoringform_id}/add-document`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      // Invalidate query so both faculty and coordinator see the new document
      await queryClient.invalidateQueries([
        "monitoringForm",
        String(generic.researchmonitoringform_id),
      ]);
      setPendingFile(null);
      setPreviewUrl(null);
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploading(false);
    }
  };

  const formatValue = (val: any, type: string) => {
    if (val === null || val === undefined) return "N/A";
    if (type === "date") return parseDate(val);
    return val.toString();
  };

  return (
    <>
      <div className="flex w-auto flex-col justify-center">
        {/* Render Form Fields dynamically based on Form Schema */}
        {formSchema.map((field) => (
          <div key={field.id} className="flex flex-col mb-4">
            <label className="text-sm font-semibold mb-1">
              {field.label}
            </label>
            <input
              value={formatValue(generic.dynamic_data?.[field.id], field.type)}
              disabled
              className="w-auto text-ellipsis border-b border-b-slate-600 bg-white py-1 ps-1 text-start text-sm capitalize"
            />
          </div>
        ))}

        <div className="flex flex-col mb-4">
          <p className="mb-1 text-sm font-semibold">Author(s) / Collaborators</p>
          <div className="flex flex-wrap gap-2 mt-1">
            {coauthors && coauthors.length > 0 ? (
              coauthors.map((author) => (
                <span
                  key={author.id}
                  className="flex items-center gap-1 rounded-full border border-blue-600 bg-white px-3 py-1 text-sm font-medium text-blue-600 capitalize"
                >
                  {author.fname} {author.lname}
                </span>
              ))
            ) : (
              <span className="text-sm text-gray-500">No other co-authors added.</span>
            )}
          </div>
        </div>

        <h2 className="text-1xl mb-5 mt-5 font-semibold">
          Supporting Document(s)
        </h2>

        <div className="flex flex-wrap items-center justify-start gap-10">
          {documents.map((item) => (
            <React.Fragment key={item.id}>
              <div className="my-4 flex items-center justify-start gap-5">
                {imageMimeType(item.file_path) ? (
                  <a href={item.file_path} target="_blank">
                    <Tooltip text="Click to view document">
                      <img
                        src={item.file_path}
                        alt="document"
                        loading="lazy"
                        className="rounded-md"
                        width={150}
                        height={150}
                      />
                    </Tooltip>
                  </a>
                ) : (
                  <a
                    href={item.file_path}
                    className="text-sm tracking-wide text-blue-500 hover:underline"
                    target="_blank"
                  >
                    <Tooltip text="Click to view document">
                      <img
                        src={pdfThumbnail}
                        width={150}
                        height={150}
                        loading="lazy"
                        alt="document"
                        className="rounded-md border"
                      />
                    </Tooltip>
                  </a>
                )}
                <h3>
                  Status: <Badge type={item.status} />
                </h3>
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* Add Missing Document — only shown when status is resubmission */}
        {status === STATUS_TYPE.RESUBMISSION && (
          <div className="rounded-md border border-orange-200 bg-orange-50 p-4 mt-10">
            <h2 className="mb-3 font-semibold text-orange-800">
              Add Missing Document
            </h2>

            {/* Inline preview of newly selected file */}
            {previewUrl && pendingFile && (
              <div className="mb-4 flex items-center gap-5">
                <div className="relative">
                  <img
                    src={
                      pendingFile.type.startsWith("image/")
                        ? previewUrl
                        : pdfThumbnail
                    }
                    alt="new document preview"
                    width={150}
                    height={150}
                    className="rounded-md border-2 border-orange-400 object-cover"
                  />
                  <span className="absolute -right-2 -top-2 rounded-full bg-orange-500 px-2 py-0.5 text-xs text-white">
                    New
                  </span>
                </div>
                <div className="text-sm text-gray-700">
                  <p className="font-medium">{pendingFile.name}</p>
                  <p className="text-gray-500">
                    {(pendingFile.size / 1024).toFixed(1)} KB
                  </p>
                  <button
                    onClick={() => {
                      setPendingFile(null);
                      setPreviewUrl(null);
                    }}
                    className="mt-1 text-xs text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="rounded-md border border-orange-500 px-4 py-2 text-sm font-semibold text-orange-600 hover:bg-orange-100"
              >
                {pendingFile ? "Change File" : "+ Select File"}
              </button>

              {/* Update — disabled until a file is selected */}
              <button
                onClick={handleUpdate}
                disabled={!pendingFile || uploading}
                className="rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {uploading ? "Uploading..." : "Update"}
              </button>
            </div>
          </div>
        )}

      </div>
    </>
  );
}

export default GenericResearchDetails;
