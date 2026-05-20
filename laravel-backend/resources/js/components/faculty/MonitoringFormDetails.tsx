import { useParams } from "react-router-dom";
import useGetMonitoringForm from "../shared/hooks/useGetMonitoringForm";
import { STATUS_TYPE } from "../shared/types/types";
import Badge from "../shared/components/Badge";
import PresentedResearch from "./components/ResearchFormDetails/PresentedResearch";
import CompletedResearch from "./components/ResearchFormDetails/CompletedResearch";
import AttendanceToResearch from "./components/ResearchFormDetails/AttendanceToResearch";
import IntellectualPropertyDetails from "./components/ResearchFormDetails/IntellectualPropertyDetails";
import CitationsDetails from "./components/ResearchFormDetails/CitationsDetails";
import PublishedResearchDetails from "./components/ResearchFormDetails/PublishedResesarchDetails";
import PeerReviewForm from "./components/ResearchFormDetails/PeerReviewForm";
import GenericResearchDetails from "./components/ResearchFormDetails/GenericResearchDetails";
import { AiOutlineLoading3Quarters } from "react-icons/ai";



const MonitoringFormDetails = () => {
  const { id } = useParams();

  const { data, isLoading: loading } = useGetMonitoringForm(id as string);

  const fullName = `${data?.users.fname} ${data?.users.mi ? data?.users.mi + ". " : ""}${data?.users.lname} ${data?.users.suffix ? data?.users.suffix : ""}`;

  if (loading)
    return <AiOutlineLoading3Quarters className="size-6 animate-spin" />;

  return (
    <section>
      <div className="rounded-md bg-white p-10 shadow-custom">
        {/* Start user data */}
        {data && (
          <div className="flex items-center gap-x-5">
            {data?.users.image_path ? (
              <div className="h-20 w-20 overflow-hidden rounded-full ring-4 ring-blue-500">
                <img
                  src={data?.users.image_path}
                  alt="Profile Image"
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <span
                className={`grid h-20 w-20 place-content-center rounded-full bg-blue-800 text-3xl font-semibold text-white`}
              >
                {data?.users.fname.charAt(0)}
              </span>
            )}

            <div className="flex flex-1 justify-between">
              <div>
                <h2 className="text-2xl font-semibold">{fullName}</h2>
                <p className="inline text-sm text-gray-800">
                  {data?.users.email} - {data?.users.unit}
                </p>
              </div>
              <h2
                className={`text-3xl font-bold ${
                  data?.status === STATUS_TYPE.PENDING
                    ? "text-yellow-800"
                    : data?.status === STATUS_TYPE.APPROVED
                      ? "text-blue-800"
                      : data?.status === STATUS_TYPE.EVALUATED
                        ? "text-green-800"
                        : STATUS_TYPE.REJECT && "text-red-800"
                }`}
              >
                {data?.points.points}
              </h2>
            </div>
          </div>
        )}

        {/* End user data */}

        <hr className="my-5 self-center border bg-gray-900 px-80" />

        {/* Research Content */}

        <div className="mb-5 flex justify-between">
          <h2 className="text-xl font-semibold capitalize">
            {data?.researchinvolvement.research_involvement_type} Details
          </h2>

          <Badge type={data?.status} />
        </div>
        {data?.rejected_message && (data.status === STATUS_TYPE.REJECT || data.status === STATUS_TYPE.RESUBMISSION) && (
          <div className={`mb-6 rounded-md border-l-4 p-4 w-full ${data.status === 'resubmission' ? 'border-orange-500 bg-orange-50' : 'border-red-500 bg-red-50'}`}>
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className={`h-5 w-5 ${data.status === 'resubmission' ? 'text-orange-500' : 'text-red-500'}`} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className={`text-sm font-semibold ${data.status === 'resubmission' ? 'text-orange-800' : 'text-red-800'}`}>
                  {data.status === 'resubmission' ? 'Coordinator Remarks / Lacking Requirements' : 'Rejection Reason'}
                </h3>
                <p className={`mt-2 text-sm ${data.status === 'resubmission' ? 'text-orange-700' : 'text-red-700'}`}>
                  {data.rejected_message}
                </p>
              </div>
            </div>
          </div>
        )}
        {data?.attendancetoresearch && (
          <AttendanceToResearch
            attendance={data.attendancetoresearch}
            documents={data.researchdocuments}
            status={data.status}
            coauthors={data?.coauthors}
          />
        )}
        {data?.presentedresearchprod && (
          <PresentedResearch
            status={data.status}
            presented={data.presentedresearchprod}
            documents={data.researchdocuments}
            coauthors={data?.coauthors}
          />
        )}

        {data?.completedresearchprod && (
          <CompletedResearch
            status={data.status}
            documents={data.researchdocuments}
            completed={data.completedresearchprod}
            coauthors={data?.coauthors}
          />
        )}
        {data?.citations && (
          <CitationsDetails 
            status={data.status}
            citations={data.citations}
            documents={data.researchdocuments}
            coauthors={data?.coauthors}
          />
        )}
        {data?.intellectualproperty && (
          <IntellectualPropertyDetails
            documents={data.researchdocuments}
            status={data.status}
            intellectualproperty={data.intellectualproperty}
            coauthors={data?.coauthors}
          />
        )}
        {data?.peerreview && (
          <PeerReviewForm
            documents={data.researchdocuments}
            peerreview={data.peerreview}
            status={data.status}
            coauthors={data?.coauthors}
          />
        )}
        {data?.publishedresearchprod && (
          <PublishedResearchDetails
            documents={data.researchdocuments}
            status={data.status}
            published={data.publishedresearchprod}
            coauthors={data?.coauthors}
          />
        )}
        {data?.genericresearchprod && (
          <GenericResearchDetails
            status={data.status}
            documents={data.researchdocuments}
            generic={data.genericresearchprod}
            formSchema={data.researchinvolvement.form_schema || []}
            coauthors={data?.coauthors}
          />
        )}
      </div>
    </section>
  );
};

export default MonitoringFormDetails;
