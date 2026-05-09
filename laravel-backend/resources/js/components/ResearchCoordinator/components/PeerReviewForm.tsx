import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import pdfThumbnail from "../../../assets/images/pngwing.com.png";
import Badge from "../../shared/components/Badge";
import ConfirmationModal from "../../shared/components/ConfirmationModal";
import { useMonitoringFormContext } from "../../shared/hooks/useMonitoringFormContext";
import {
  PeerReviewType,
  STATUS_TYPE,
  type Researchdocument,
} from "../../shared/types/types";
import { imageMimeType } from "../../util/ImageMimeTypes";
import useUpdateMonitoringForm, {
  UpdateMonitoringFormVariables,
} from "../hooks/useUpdateMonitoringForm";

type PeerReviewFormProps = {
  peerreview: PeerReviewType;
  documents: Researchdocument[];
  formStatus: string;
  rejected_message: string | null;
};


const PeerReviewForm = ({
  peerreview,
  documents,
  formStatus,
  rejected_message,
}: PeerReviewFormProps) => {
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

  const handleApprove = async () => {
    setOpenApproveModal(false);
    const variables: UpdateMonitoringFormVariables = {
      id: peerreview.researchmonitoringform_id,
      status: Array(documents.length).fill(STATUS_TYPE.APPROVED),
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
      id: peerreview.researchmonitoringform_id,
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
      id: peerreview.researchmonitoringform_id,
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
      <div className="flex h-screen items-center justify-center font-semibold">
        Oops Error: {fetchError.message}
      </div>
    );



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
        <label htmlFor="journalName" className="text-sm">
          Journal Name
        </label>
        <input
          id="journalName"
          value={peerreview.name}
          disabled
          className="w-auto text-ellipsis border-b border-b-slate-600 bg-white py-1 ps-1 text-start text-sm capitalize"
        />

        <label htmlFor="articleTitle" className="mt-5 text-sm">
          Article Title
        </label>
        <input
          id="articleTitle"
          value={peerreview.article_title}
          disabled
          className="w-auto text-ellipsis border-b border-b-slate-600 bg-white py-1 ps-1 text-start text-sm capitalize"
        />

        <label htmlFor="articleReviewed" className="mt-5 text-sm">
          Number of Articles Reviewed
        </label>
        <input
          id="articleReviewed"
          value={peerreview.article_reviewed}
          disabled
          className="w-auto text-ellipsis border-b border-b-slate-600 bg-white py-1 ps-1 text-start text-sm capitalize"
        />

        <label htmlFor="abstractTitle" className="mt-5 text-sm">
          Abstract Title
        </label>
        <input
          id="abstractTitle"
          value={peerreview.abstract_title}
          disabled
          className="w-auto text-ellipsis border-b border-b-slate-600 bg-white py-1 ps-1 text-start text-sm capitalize"
        />

        <label htmlFor="abstractReviewed" className="mt-5 text-sm">
          Number of Abstracts Reviewed
        </label>
        <input
          id="abstractReviewed"
          value={peerreview.abstract_reviewed}
          disabled
          className="w-auto text-ellipsis border-b border-b-slate-600 bg-white py-1 ps-1 text-start text-sm capitalize"
        />

        <label htmlFor="coverage" className="mt-5 text-sm">
          Coverage
        </label>
        <input
          id="coverage"
          value={peerreview.coverage}
          disabled
          className="w-auto text-ellipsis border-b border-b-slate-600 bg-white py-1 ps-1 text-start text-sm capitalize"
        />

        <label htmlFor="dateReviewed" className="mt-5 text-sm">
          Date Reviewed
        </label>
        <input
          id="dateReviewed"
          value={peerreview.date_reviewed}
          disabled
          className="w-auto text-ellipsis border-b border-b-slate-600 bg-white py-1 ps-1 text-start text-sm capitalize"
        />

        <label htmlFor="organization" className="mt-5 text-sm">
          Organization
        </label>
        <input
          id="organization"
          value={peerreview.organization}
          disabled
          className="w-auto text-ellipsis border-b border-b-slate-600 bg-white py-1 ps-1 text-start text-sm capitalize"
        />

        <h2 className="text-1xl mb-5 mt-5 font-semibold">
          Supporting Document(s)
        </h2>

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
              Approve
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
        message="Are you sure you want to APPROVE this research monitoring form?"
        onCancel={() => setOpenApproveModal(false)}
        onConfirm={handleApprove}
        type="submit"
      />
    </>
  );
};

export default PeerReviewForm;
