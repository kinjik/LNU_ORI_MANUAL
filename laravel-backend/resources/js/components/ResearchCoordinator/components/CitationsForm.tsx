import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "../../shared/components/ConfirmationModal";
import { useMonitoringFormContext } from "../../shared/hooks/useMonitoringFormContext";
import { CitationsType, STATUS_TYPE, type Researchdocument } from "../../shared/types/types";
import { parseDate } from "../../util/parseDate";
import useUpdateMonitoringForm, {
  UpdateMonitoringFormVariables,
} from "../hooks/useUpdateMonitoringForm";

// Imports needed for rendering documents
import pdfThumbnail from "../../../assets/images/pngwing.com.png";
import Badge from "../../shared/components/Badge";
import { imageMimeType } from "../../util/ImageMimeTypes";

type CitationsFormProps = {
  citations: CitationsType;
  documents: Researchdocument[];
  formStatus: string;
  rejected_message: string | null;
};

const CitationsForm = ({ citations, documents, formStatus, rejected_message }: CitationsFormProps) => {
  const [openApproveModal, setOpenApproveModal] = useState(false);
  const [openRejectModal, setOpenRejectModal] = useState(false);
  const [rejectMessage, setRejectMessage] = useState("");
  const [openResubmissionModal, setOpenResubmissionModal] = useState(false);
  const [resubmissionMessage, setResubmissionMessage] = useState("");
  const navigate = useNavigate();

  const { refetchData } = useMonitoringFormContext();
  const {
    error: fetchError,
    isLoading: loading,
    mutate: updateMonitoringForm,
  } = useUpdateMonitoringForm();

  const handleApprove = async () => {
    setOpenApproveModal(false);
    const variables: UpdateMonitoringFormVariables = {
      id: citations.researchmonitoringform_id,
      status: Array(documents.length).fill(STATUS_TYPE.EVALUATED), // <-- Updated to map all docs
      isAdmin: false,
      rejected_message: "",
    };
    await updateMonitoringForm(variables);
    refetchData();
    navigate("/coordinator-dashboard");
  };

  const handleReject = async () => {
    setOpenRejectModal(false);
    const variables: UpdateMonitoringFormVariables = {
      id: citations.researchmonitoringform_id,
      status: Array(documents.length).fill(STATUS_TYPE.REJECT), // <-- Updated to map all docs
      isAdmin: false,
      rejected_message: rejectMessage,
    };
    await updateMonitoringForm(variables);
    refetchData();
    navigate("/coordinator-dashboard");
  };

  const handleResubmission = async () => {
    setOpenResubmissionModal(false);
    const variables: UpdateMonitoringFormVariables = {
      id: citations.researchmonitoringform_id,
      status: [STATUS_TYPE.RESUBMISSION],
      isAdmin: false,
      rejected_message: resubmissionMessage,
    };
    await updateMonitoringForm(variables);
    refetchData();
    navigate("/coordinator-dashboard");
  };

  if (fetchError)
    return (
      <div className="flex h-screen items-center justify-center">
        <span className="text-md">{fetchError.message}</span>
      </div>
    );

  return (
    <>
      <div className="flex w-full flex-col justify-center overflow-hidden">
        {(formStatus === STATUS_TYPE.RESUBMISSION || formStatus === STATUS_TYPE.REJECT || (formStatus === STATUS_TYPE.PENDING && rejected_message)) && rejected_message && (
          <div className={`mb-6 rounded-md border-l-4 p-4 w-full ${formStatus === STATUS_TYPE.REJECT ? 'border-red-500 bg-red-50' : 'border-orange-500 bg-orange-50'}`}>
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className={`h-5 w-5 ${formStatus === STATUS_TYPE.REJECT ? 'text-red-500' : 'text-orange-500'}`} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className={`text-sm font-semibold ${formStatus === STATUS_TYPE.REJECT ? 'text-red-800' : 'text-orange-800'}`}>
                  {formStatus === STATUS_TYPE.REJECT ? "Rejection Reason" : "Coordinator Remarks / Lacking Requirements"}
                </h3>
                <div className={`mt-2 text-sm ${formStatus === STATUS_TYPE.REJECT ? 'text-red-700' : 'text-orange-700'}`}>
                  <p>{rejected_message}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        <label htmlFor="title" className="text-sm">
          Research Title
        </label>
        <input
          id="title"
          value={citations.research_title}
          disabled
          className="w-full text-ellipsis overflow-hidden whitespace-nowrap border-b border-b-slate-600 bg-white py-1 ps-1 text-start text-sm capitalize"
        />
        <label htmlFor="authors" className="mt-5 text-sm">
          Authors
        </label>
        <input
          id="authors"
          value={citations.authors}
          disabled
          className="w-full text-ellipsis overflow-hidden whitespace-nowrap border-b border-b-slate-600 bg-white py-1 ps-1 text-start text-sm capitalize"
        />

        <label htmlFor="datePublished" className="mt-5 text-sm">
          Date Publication
        </label>
        <input
          id="datePublished"
          value={parseDate(citations.date)}
          disabled
          className="w-full text-ellipsis overflow-hidden whitespace-nowrap border-b border-b-slate-600 bg-white py-1 ps-1 text-start text-sm capitalize"
        />
        <label htmlFor="journalName" className="mt-5 text-sm">
          Journal Name
        </label>
        <input
          id="journalName"
          value={citations.journal_title}
          disabled
          className="w-full text-ellipsis overflow-hidden whitespace-nowrap border-b border-b-slate-600 bg-white py-1 ps-1 text-start text-sm capitalize"
        />
        <label htmlFor="publisher" className="mt-5 text-sm">
          Publisher
        </label>
        <input
          id="publisher"
          value={citations.publisher_name}
          disabled
          className="w-full text-ellipsis overflow-hidden whitespace-nowrap border-b border-b-slate-600 bg-white py-1 ps-1 text-start text-sm capitalize"
        />
        <label htmlFor="url" className="mt-5 text-sm">
          Article URL Link
        </label>
        <a
          id="url"
          href={citations.url_link}
          target="_blank"
          className="w-full block break-all border-b border-b-slate-600 py-1 ps-1 text-start text-sm text-blue-600 hover:underline"
        >
          {citations.url_link}
        </a>
        <h2 className="text-1xl mt-10 font-semibold">Citations Details</h2>
        <hr className="my-2 bg-gray-700" />
        <label htmlFor="citedResearch" className="mt-5 text-sm">
          Research Title that cited your work
        </label>
        <input
          id="citedResearch"
          value={citations.cited_article_title}
          disabled
          className="w-full text-ellipsis overflow-hidden whitespace-nowrap border-b border-b-slate-600 bg-white py-1 ps-1 text-start text-sm capitalize"
        />
        <label htmlFor="citedAuthors" className="mt-5 text-sm">
          Authors of the research that cited your work
        </label>
        <input
          id="citedAuthors"
          value={citations.cited_authors}
          disabled
          className="w-full text-ellipsis overflow-hidden whitespace-nowrap border-b border-b-slate-600 bg-white py-1 ps-1 text-start text-sm capitalize"
        />
        {citations.scopus_link && (
          <>
            <label htmlFor="scopusUrl" className="mt-5 text-sm">
              Scopus Link
            </label>
            <a
              id="scopusUrl"
              href={citations.scopus_link}
              target="_blank"
              className="w-full block break-all border-b border-b-slate-600 py-1 ps-1 text-start text-sm text-blue-600 hover:underline"
            >
              {citations.scopus_link}
            </a>
          </>
        )}

        {/* --- ADDED DOCUMENTS SECTION --- */}
        <h2 className="text-1xl mb-5 mt-10 font-semibold">
          Supporting Document(s)
        </h2>

        <div className="flex flex-wrap items-center justify-start gap-10">
          {documents && documents.length > 0 ? (
            documents.map((item) => (
              <React.Fragment key={item.id}>
                {imageMimeType(item.file_path) ? (
                  <a href={item.file_path} target="_blank" rel="noreferrer">
                    <img
                      src={item.file_path}
                      alt="document"
                      loading="lazy"
                      className="rounded-md"
                      width={150}
                      height={150}
                    />
                  </a>
                ) : (
                  <a
                    href={item.file_path}
                    className="text-sm tracking-wide text-blue-500 hover:underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img
                      src={pdfThumbnail}
                      width={150}
                      height={150}
                      loading="lazy"
                      alt="document"
                      className="rounded-md border"
                    />
                  </a>
                )}
                <div className="w-2/5 space-y-1 place-self-start">
                  <p className="text-sm font-semibold text-gray-900">Current Status</p>
                  <div className="flex items-center justify-start space-x-2">
                    <Badge type={item.status} />
                  </div>
                </div>
              </React.Fragment>
            ))
          ) : (
            <p className="text-sm italic text-gray-500">No documents attached.</p>
          )}
        </div>
        {/* ----------------------------- */}

        {(formStatus === STATUS_TYPE.PENDING || formStatus === STATUS_TYPE.RESUBMISSION) && (
          <div className="flex gap-3 place-self-end mt-5 mb-5">
            <button
              className="rounded-md bg-blue-600 px-5 py-2 font-semibold text-white hover:bg-blue-800 disabled:opacity-50"
              onClick={() => setOpenApproveModal(true)}
              disabled={loading}
            >
              Evaluate
            </button>
            <button
              className="rounded-md bg-red-600 px-5 py-2 font-semibold text-white hover:bg-red-800 disabled:opacity-50"
              onClick={() => setOpenRejectModal(true)}
              disabled={loading}
            >
              Reject
            </button>
            <button
              className="rounded-md bg-orange-500 px-5 py-2 font-semibold text-white hover:bg-orange-700 disabled:opacity-50"
              onClick={() => setOpenResubmissionModal(true)}
              disabled={loading}
            >
              Resubmission
            </button>
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {openRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="rounded bg-white p-6 shadow-lg">
            <h2 className="text-md mb-4 text-center font-semibold text-red-600">Rejection Reason</h2>
            <textarea
              placeholder="Explain why this is being rejected..."
              value={rejectMessage}
              autoFocus
              onChange={(e) => setRejectMessage(e.target.value)}
              className="mb-4 w-64 rounded border border-gray-300 p-2 text-sm"
              rows={4}
            />
            <div className="flex justify-end space-x-4">
              <button className="rounded bg-gray-200 px-3 py-2 text-sm font-semibold" onClick={() => setOpenRejectModal(false)}>Cancel</button>
              <button className="rounded bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700" onClick={handleReject} disabled={!rejectMessage.trim()}>Confirm Reject</button>
            </div>
          </div>
        </div>
      )}
      
      {/* Resubmission Modal */}
      {openResubmissionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="rounded bg-white p-6 shadow-lg">
            <h2 className="text-md mb-4 text-center font-semibold text-orange-600">Lacking Requirements</h2>
            <textarea
              placeholder="Enter lacking requirements..."
              value={resubmissionMessage}
              autoFocus
              onChange={(e) => setResubmissionMessage(e.target.value)}
              className="mb-4 w-64 rounded border border-gray-300 p-2 text-sm"
              rows={4}
            />
            <div className="flex justify-end space-x-4">
              <button className="rounded bg-gray-200 px-3 py-2 text-sm font-semibold" onClick={() => setOpenResubmissionModal(false)}>Cancel</button>
              <button className="rounded bg-orange-500 px-3 py-2 text-sm font-semibold text-white hover:bg-orange-600" onClick={handleResubmission} disabled={!resubmissionMessage.trim()}>Confirm Resubmit</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={openApproveModal}
        message="Are you sure you want to EVALUATE this research monitoring form?"
        onCancel={() => setOpenApproveModal(false)}
        onConfirm={handleApprove}
        type="submit"
      />
    </>
  );
};

export default CitationsForm;