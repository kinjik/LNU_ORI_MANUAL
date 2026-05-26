import { useQueryClient } from "@tanstack/react-query";
import React, { useRef, useState } from "react";
import { pngwing as pdfThumbnail } from "../../../../assets/images";
import api from "../../../api/axios";
import Badge from "../../../shared/components/Badge";
import Tooltip from "../../../shared/components/Tooltip";
import {
  IntellectualPropertyType,
  Researchdocument,
  STATUS_TYPE,
} from "../../../shared/types/types";
import { imageMimeType } from "../../../util/ImageMimeTypes";
import { parseDate } from "../../../util/parseDate";

type IntellectualPropertyDetailsType = {
  intellectualproperty: IntellectualPropertyType;
  documents: Researchdocument[];
  status: string;
  coauthors?: any[];
  externalAuthors?: string[] | null;
};
const IntellectualPropertyDetails = ({
  intellectualproperty,
  documents,
  status,
  coauthors,
  externalAuthors,
}: IntellectualPropertyDetailsType) => {
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
        `/api/research-monitoring-form/${intellectualproperty.researchmonitoringform_id}/add-document`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      // Invalidate query so both faculty and coordinator see the new document
      await queryClient.invalidateQueries([
        "monitoringForm",
        String(intellectualproperty.researchmonitoringform_id),
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
      <div className="flex w-auto flex-col justify-center">
        <label
          htmlFor="datePresented"
          className="text-sm font-semibold capitalize"
        >
          {intellectualproperty.property_type} Details
        </label>
        <input
          id="datePresented"
          value={intellectualproperty.title}
          disabled
          className="w-auto text-ellipsis border-b border-b-slate-600 bg-white py-1 ps-1 text-start text-sm capitalize"
        />
        <label htmlFor="fundSource" className="mt-5 text-sm font-semibold">
          Inventor/Creator Name(s):
        </label>
        <div className="flex flex-wrap gap-2 mt-1">
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
            <span className="text-sm tracking-wide capitalize">
              {intellectualproperty.owner_name}
            </span>
          )}
        </div>
        <label htmlFor="datePublication" className="mt-5 text-sm font-semibold">
          Registration Date
        </label>
        <input
          id="datePublication"
          value={parseDate(intellectualproperty.registration_date)}
          disabled
          className="w-auto text-ellipsis border-b border-b-slate-600 bg-white py-1 ps-1 text-start text-sm capitalize"
        />
        <label htmlFor="datePublication" className="mt-5 text-sm font-semibold">
          Name of the Processor
        </label>
        <input
          id="datePublication"
          value={intellectualproperty.processor_name}
          disabled
          className="w-auto text-ellipsis border-b border-b-slate-600 bg-white py-1 ps-1 text-start text-sm capitalize"
        />
        {intellectualproperty.publication_date && (
          <>
            <label
              htmlFor="datePublication"
              className="mt-5 text-sm font-semibold"
            >
              Publication Date
            </label>
            <input
              id="datePublication"
              value={intellectualproperty.publication_date}
              disabled
              className="w-auto text-ellipsis border-b border-b-slate-600 bg-white py-1 ps-1 text-start text-sm capitalize"
            />
          </>
        )}
        {intellectualproperty.grant_date && (
          <>
            <label
              htmlFor="datePublication"
              className="mt-5 text-sm font-semibold"
            >
              Date Granted
            </label>
            <input
              id="datePublication"
              value={intellectualproperty.publication_date}
              disabled
              className="w-auto text-ellipsis border-b border-b-slate-600 bg-white py-1 ps-1 text-start text-sm capitalize"
            />
          </>
        )}
        {intellectualproperty.acceptance_date && (
          <>
            <label
              htmlFor="datePublication"
              className="mt-5 text-sm font-semibold"
            >
              Date Accepted
            </label>
            <input
              id="datePublication"
              value={intellectualproperty.acceptance_date}
              disabled
              className="w-auto text-ellipsis border-b border-b-slate-600 bg-white py-1 ps-1 text-start text-sm capitalize"
            />
          </>
        )}

        <div>
          <h2 className="mb-2 mt-10 font-semibold">Document(s):</h2>
          {documents.map((item) => (
            <React.Fragment key={item.id}>
              {imageMimeType(item.file_path) ? (
                <div className="flex items-center gap-x-10">
                  <a
                    href={item.file_path}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Tooltip text="Click to open document.">
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
                  <div className="flex flex-col gap-y-2">
                    <p className="text-sm font-semibold">Status:</p>
                    <Badge type={item.status} />
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-x-10">
                  <a
                    href={item.file_path}
                    className="text-sm tracking-wide text-blue-500 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Tooltip text="Click to open document.">
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
                  <div className="flex flex-col gap-y-2">
                    <p className="text-sm font-semibold">Status:</p>
                    <Badge type={item.status} />
                  </div>
                </div>
              )}
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
};

export default IntellectualPropertyDetails;

