import * as React from "react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import pdfThumbnail from "../../../assets/images/pngwing.com.png";
import RejectedModalMessage from "../../admin/monitoring-form/monitoring-forms/RejectedModalMessage";
import ConfirmationModal from "../../shared/components/ConfirmationModal";
import { useMonitoringFormContext } from "../../shared/hooks/useMonitoringFormContext";
import {
  Researchdocument,
  STATUS_TYPE,
  type Completedresearchprod,
} from "../../shared/types/types";
import { imageMimeType } from "../../util/ImageMimeTypes";
import { parseDate } from "../../util/parseDate";
import useUpdateMonitoringForm, {
  UpdateMonitoringFormVariables,
} from "../hooks/useUpdateMonitoringForm";

type CompletedResearchFormProps = {
  completed: Completedresearchprod;
  documents: Researchdocument[];
  formStatus: string;
  rejected_message: string | null;
};

const CompletedResearchForm = ({
  completed,
  documents,
  formStatus,
  rejected_message,
}: CompletedResearchFormProps) => {
  const status = useRef<string[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [openRejectedModal, setOpenRejectedModal] = useState(false);
  const [message, setMessage] = useState("");
  const [openResubmissionModal, setOpenResubmissionModal] = useState(false);
  const [resubmissionMessage, setResubmissionMessage] = useState("");
  const navigate = useNavigate();

  const { refetchData } = useMonitoringFormContext();
  const {
    error,
    isLoading: loading,
    mutate: updateMonitoringForm,
  } = useUpdateMonitoringForm();

  const handleClick = async () => {
    setOpenModal(false);
    setOpenRejectedModal(false);

    const variables: UpdateMonitoringFormVariables = {
      id: completed.researchmonitoringform_id,
      status: status.current,
      isAdmin: false,
      rejected_message: message,
    };
    await updateMonitoringForm(variables);
    refetchData();
    navigate("/coordinator-dashboard");
  };

  const handleResubmission = async () => {
    setOpenResubmissionModal(false);
    const variables: UpdateMonitoringFormVariables = {
      id: completed.researchmonitoringform_id,
      status: [STATUS_TYPE.RESUBMISSION],
      isAdmin: false,
      rejected_message: resubmissionMessage,
    };
    await updateMonitoringForm(variables);
    refetchData();
    navigate("/coordinator-dashboard");
  };

  if (error)
    return (
      <div className="item-center text-1xl flex h-screen justify-center font-semibold">
        Oops Error: {error.message}
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
        <label htmlFor="datePresented" className="text-sm">
          Research Date Completed
        </label>
        <input
          id="datePresented"
          value={parseDate(completed.date_completed)}
          disabled
          className="w-auto text-ellipsis border-b border-b-slate-600 bg-white py-1 ps-1 text-start text-sm capitalize"
        />
        <label htmlFor="fundSource" className="mt-5 text-sm">
          Research Fund Source
        </label>
        <input
          id="fundSource"
          value={completed.nature_fund_source}
          disabled
          className="w-auto text-ellipsis border-b border-b-slate-600 bg-white py-1 ps-1 text-start text-sm capitalize"
        />
        {completed.target_date_publication && (
          <>
            <label htmlFor="datePublication" className="mt-5 text-sm">
              Target Date Publication
            </label>
            <input
              id="datePublication"
              value={parseDate(completed.target_date_publication)}
              disabled
              className="w-auto text-ellipsis border-b border-b-slate-600 bg-white py-1 ps-1 text-start text-sm capitalize"
            />
          </>
        )}
        <h2 className="text-1xl mt-10 font-semibold">Attached Research</h2>
        <label htmlFor="researchTitle" className="mt-5 text-sm">
          Research Title
        </label>
        <input
          id="researchTitle"
          value={completed.research.title}
          disabled
          className="w-auto text-ellipsis border-b border-b-slate-600 bg-white py-1 ps-1 text-start text-sm capitalize"
        />
        <p className="mb-1 mt-5 text-sm">Author(s)</p>
        <span className="text-sm tracking-wide">
          {completed.research.authors}
        </span>

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
            </React.Fragment>
          ))}
        </div>

        {(formStatus === STATUS_TYPE.PENDING || formStatus === STATUS_TYPE.RESUBMISSION) && (
          <div className="flex gap-3 place-self-end mb-5">
            <button
              className="rounded-md bg-blue-600 px-5 py-2 font-semibold text-white hover:bg-blue-800 disabled:opacity-50"
              onClick={() => {
                status.current = [STATUS_TYPE.APPROVED];
                setOpenModal(true);
              }}
              disabled={loading}
            >
              Approve
            </button>
            <button
              className="rounded-md bg-red-600 px-5 py-2 font-semibold text-white hover:bg-red-800 disabled:opacity-50"
              onClick={() => setOpenRejectedModal(true)}
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
      <ConfirmationModal
        isOpen={openModal}
        type="submit"
        message={`Are you sure you want ${status.current[0] === STATUS_TYPE.APPROVED ? "approve" : "reject"} this research monitoring form?`}
        onCancel={() => setOpenModal(false)}
        onConfirm={handleClick}
      />
      <RejectedModalMessage
        isOpen={openRejectedModal}
        message={message}
        setMessage={setMessage}
        onCancel={() => setOpenRejectedModal(false)}
        onConfirm={handleClick}
      />

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
    </>
  );
};

export default CompletedResearchForm;
