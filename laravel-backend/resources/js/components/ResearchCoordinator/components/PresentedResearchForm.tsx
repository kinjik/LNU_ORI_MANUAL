import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import pdfThumbnail from "../../../assets/images/pngwing.com.png";
import Badge from "../../shared/components/Badge";
import ConfirmationModal from "../../shared/components/ConfirmationModal";
import { useMonitoringFormContext } from "../../shared/hooks/useMonitoringFormContext";
import {
  type Presentedresearchprod,
  Researchdocument,
  STATUS_TYPE,
} from "../../shared/types/types";
import { imageMimeType } from "../../util/ImageMimeTypes";
import useUpdateMonitoringForm, {
  UpdateMonitoringFormVariables,
} from "../hooks/useUpdateMonitoringForm";

type PresentedResearchFormProps = {
  presented: Presentedresearchprod;
  documents: Researchdocument[];
  formStatus: string;
  rejected_message: string | null;
  coauthors?: any[];
  externalAuthors?: string[] | null;
  points?: number;
};

type statusType = {
  [key: number]: string;
};

const PresentedResearchForm = ({
  presented,
  documents,
  formStatus,
  rejected_message,
  coauthors,
  externalAuthors,
}: PresentedResearchFormProps) => {
const [openApproveModal, setOpenApproveModal] = useState(false);
  const [openRejectModal, setOpenRejectModal] = useState(false);
  const [rejectMessage, setRejectMessage] = useState("");
  const [openResubmissionModal, setOpenResubmissionModal] = useState(false);
  const [resubmissionMessage, setResubmissionMessage] = useState("");
  const navigate = useNavigate();

  const { refetchData } = useMonitoringFormContext();

  const {
    isLoading: loading,
    error: fetchError,
    mutate: updateMonitoringForm,
  } = useUpdateMonitoringForm();

  if (fetchError)
    return (
      <div className="flex h-screen items-center justify-center">
        <span className="text-md">{fetchError.message}</span>
      </div>
    );

  const handleApprove = async () => {
    setOpenApproveModal(false);
    const variables: UpdateMonitoringFormVariables = {
      id: presented.researchmonitoringform_id,
      status: Array(documents.length).fill(STATUS_TYPE.EVALUATED),
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
      id: presented.researchmonitoringform_id,
      status: Array(documents.length).fill(STATUS_TYPE.REJECT),
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
      id: presented.researchmonitoringform_id,
      status: [STATUS_TYPE.RESUBMISSION], // ← backend checks status[0] for this value
      isAdmin: false,
      rejected_message: resubmissionMessage,
    };
    await updateMonitoringForm(variables);
    refetchData();
    navigate("/coordinator-dashboard");
  };




  return (
    <>
      <div className="flex w-auto flex-col justify-center">
        {(formStatus === STATUS_TYPE.RESUBMISSION || formStatus === STATUS_TYPE.REJECT) && rejected_message && (
          <div className={`mb-6 rounded-md border-l-4 p-4 w-full ${formStatus === STATUS_TYPE.RESUBMISSION ? 'border-orange-500 bg-orange-50' : 'border-red-500 bg-red-50'}`}>
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className={`h-5 w-5 ${formStatus === STATUS_TYPE.RESUBMISSION ? 'text-orange-500' : 'text-red-500'}`} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className={`text-sm font-semibold ${formStatus === STATUS_TYPE.RESUBMISSION ? 'text-orange-800' : 'text-red-800'}`}>
                  {formStatus === STATUS_TYPE.RESUBMISSION ? "Coordinator Remarks / Lacking Requirements" : "Rejection Reason"}
                </h3>
                <div className={`mt-2 text-sm ${formStatus === STATUS_TYPE.RESUBMISSION ? 'text-orange-700' : 'text-red-700'}`}>
                  <p>{rejected_message}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        <label htmlFor="presenters" className="text-sm">
          Presenter(s)
        </label>
        <div className="flex flex-wrap gap-2 mt-1 mb-5">
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
            <input
              id="presenters"
              value={presented.presenter_name}
              disabled
              className="w-auto text-ellipsis border-b border-b-slate-600 bg-white py-1 ps-1 text-start text-sm capitalize"
            />
          )}
        </div>
        <label htmlFor="presentedResearch" className="text-sm">
          Presented Research
        </label>
        <input
          id="presentedResearch"
          value={presented.presentation_title}
          disabled
          className="w-auto text-ellipsis border-b border-b-slate-600 bg-white py-1 ps-1 text-start text-sm capitalize"
        />
        <label htmlFor="activityName" className="mt-5 text-sm">
          Activity Name
        </label>
        <input
          id="activityName"
          value={presented.conference_name}
          disabled
          className="w-auto text-ellipsis border-b border-b-slate-600 bg-white py-1 ps-1 text-start text-sm capitalize"
        />
        <label htmlFor="conferenceOrg" className="mt-5 text-sm">
          Conference Org
        </label>
        <input
          id="conferenceOrg"
          value={presented.conference_organization}
          disabled
          className="w-auto text-ellipsis border-b border-b-slate-600 bg-white py-1 ps-1 text-start text-sm capitalize"
        />

        <label htmlFor="presentedAt" className="mt-5 text-sm">
          Presented at
        </label>
        <input
          id="presentedAt"
          value={presented.conference_place + " - " + presented.date_presented}
          disabled
          className="w-auto text-ellipsis border-b border-b-slate-600 bg-white py-1 ps-1 text-start font-sans text-sm capitalize"
        />
        <h2 className="text-1xl mb-5 mt-5 font-semibold">Documents</h2>

        <div className="flex flex-wrap items-center justify-start gap-10">
          {documents.map((item) => (
            <React.Fragment key={item.id}>
              {imageMimeType(item.file_path) ? (
                <a href={item.file_path} target="_blank">
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
          ))}
        </div>
          {(formStatus === STATUS_TYPE.PENDING || formStatus === STATUS_TYPE.RESUBMISSION) && (
          <div className="flex gap-3 place-self-end mb-5">
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

export default PresentedResearchForm;


