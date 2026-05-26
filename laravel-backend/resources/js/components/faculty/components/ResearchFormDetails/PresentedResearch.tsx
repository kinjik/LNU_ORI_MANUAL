import React, { useRef, useState } from "react";
import {
  Presentedresearchprod,
  Researchdocument,
  STATUS_TYPE,
} from "../../../shared/types/types";
import { imageMimeType } from "../../../util/ImageMimeTypes";
import { pngwing as pdfThumbnail } from "../../../../assets/images";
import Tooltip from "../../../shared/components/Tooltip";
import Badge from "../../../shared/components/Badge";
import { parseDate } from "../../../util/parseDate";
import api from "../../../api/axios";
import { useQueryClient } from "@tanstack/react-query";

type PresentedResearchFormProps = {
  presented: Presentedresearchprod;
  documents: Researchdocument[];
  status: string;
  coauthors?: any[];
  externalAuthors?: string[] | null;
  formStatus?: string;
  points?: number;
};

function PresentedResearch({
  presented,
  documents,
  status,
  coauthors,
  externalAuthors,
}: PresentedResearchFormProps) {
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
        `/api/research-monitoring-form/${presented.researchmonitoringform_id}/add-document`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      // Invalidate query so both faculty and coordinator see the new document
      await queryClient.invalidateQueries([
        "monitoringForm",
        String(presented.researchmonitoringform_id),
      ]);
      setPendingFile(null);
      setPreviewUrl(null);
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <div className="space-y-5">
        <div>
          <h2 className="font-semibold">Presenter(s):</h2>
          <div className="flex flex-wrap gap-2 mt-1 pl-5">
            {(coauthors?.length || 0) > 0 || (externalAuthors?.length || 0) > 0 ? (
              <>
                {coauthors?.map((author) => (
                  <span
                    key={author.id}
                    className="flex items-center gap-1 rounded-full border border-blue-600 bg-white px-3 py-1 text-sm font-medium text-blue-600 capitalize"
                  >
                    {author.fname} {author.lname}
                  </span>
                ))}
                {externalAuthors?.map((author, idx) => (
                  <span
                    key={`ext-${idx}`}
                    className="flex items-center gap-1 rounded-full border border-blue-600 bg-white px-3 py-1 text-sm font-medium text-blue-600 capitalize"
                  >
                    {author}
                  </span>
                ))}
              </>
            ) : (
              <span className="text-sm tracking-wide capitalize underline">
                {presented.presenter_name}
              </span>
            )}
          </div>
        </div>

        <div>
          <h2 className="font-semibold">Title:</h2>
          <p className="pl-5 capitalize underline">
            {presented.presentation_title}
          </p>
        </div>

        <div>
          <h2 className="font-semibold">Activity Name:</h2>
          <p className="pl-5 capitalize underline">
            {presented.conference_name}
          </p>
        </div>

        <div>
          <h2 className="font-semibold">Conference Organization:</h2>
          <p className="pl-5 capitalize underline">
            {presented?.conference_organization}
          </p>
        </div>

        <div>
          <h2 className="font-semibold">Presented at:</h2>
          <p className="pl-5 capitalize underline">
            {presented?.conference_place} -{" "}
            {parseDate(presented.date_presented)}
          </p>
        </div>

        {/* Existing Documents */}
        <div>
          <h2 className="mb-2 font-semibold">Document(s):</h2>
          {documents.map((item) => (
            <React.Fragment key={item.id}>
              <div className="my-4 flex items-center justify-start gap-5">
                <a
                  href={item.file_path}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Tooltip text="Click to open document.">
                    <img
                      src={
                        imageMimeType(item.file_path)
                          ? item.file_path
                          : pdfThumbnail
                      }
                      alt="document"
                      loading="lazy"
                      className="rounded-md border"
                      width={150}
                      height={150}
                    />
                  </Tooltip>
                </a>
                <h3>
                  Status: <Badge type={item.status} />
                </h3>
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* Add Missing Document — only shown when status is resubmission */}
        {status === STATUS_TYPE.RESUBMISSION && (
          <div className="rounded-md border border-orange-200 bg-orange-50 p-4">
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

export default PresentedResearch;


