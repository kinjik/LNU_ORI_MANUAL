import { useParams } from "react-router-dom";
import useGetMonitoringForm from "../shared/hooks/useGetMonitoringForm";
import PresentedResearchForm from "./components/PresentedResearchForm";
import Badge from "../shared/components/Badge";
import CompletedResearchForm from "./components/CompletedResearchForm";
import AttendanceToResearch from "./components/AttendanceToResearch";
import { STATUS_TYPE } from "../shared/types/types";
import IntellectualPropertyForm from "./components/IntellectualPropertyForm";
import PeerReviewForm from "./components/PeerReviewForm";
import PublishedResearchForm from "./components/PublishedResearchForm";
import CitationsForm from "./components/CitationsForm";
import OtherResearchForm from "./components/OtherResearchForm";
import GenericResearchForm from "./components/GenericResearchForm";
import { getImageUrl } from "../../utils/imageUrl";


const MonitoringForm = () => {
  const { id } = useParams();

  const { data, isLoading: loading } = useGetMonitoringForm(id as string);

  const fullName = `${data?.users.fname} ${data?.users.mi ? data?.users.mi + ". " : ""}${data?.users.lname} ${data?.users.suffix ? data?.users.suffix : ""}`;

  if (loading)
    return (
      <div className="flex h-screen animate-bounce items-center justify-center font-semibold">
        Loading...
      </div>
    );

  return (
    <>
      <section>
        <div className="mx-auto mt-5 flex h-auto w-2/3 flex-col items-start justify-start bg-white shadow-lg">
          {data && (
            <div className="mt-5 flex w-full items-center justify-start space-x-5 px-10">
              {data?.users.image_path ? (
                <div className="h-20 w-20 overflow-hidden rounded-full ring-4 ring-blue-500">
                  <img
                    src={getImageUrl(data?.users.image_path, "https://via.placeholder.com/150")}
                    alt="Profile Image"
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div
                  className={`grid h-20 w-20 place-items-center rounded-full bg-blue-800 text-3xl font-semibold text-white`}
                >
                  {data?.users.fname.charAt(0)}
                </div>
              )}
              <div className="inline-block">
                <h2 className="text-2xl font-semibold">{fullName}</h2>
                <p className="inline text-sm text-gray-800">
                  {data?.users.email} - {data?.users.unit}
                </p>
              </div>
              <h2
                className={`flex-1 text-right text-3xl font-bold ${
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
          )}
          <hr className="mt-6 self-center border bg-gray-900 px-80" />
          <div className="mt-5 flex w-full items-center justify-around px-5">
            <h2 className="text-xl font-semibold capitalize">
              {data?.researchinvolvement.research_involvement_type}
            </h2>

            <Badge type={data?.status} />
          </div>
          <div className="mx-auto mt-5 w-2/3 flex-col items-center justify-center px-7 pb-10">
            {data?.presentedresearchprod && (
              <PresentedResearchForm
                presented={data.presentedresearchprod}
                formStatus={data.status}
                documents={data.researchdocuments}
                rejected_message={data.rejected_message ?? null}  
              />
            )}
            {data?.completedresearchprod && (
              <CompletedResearchForm
                completed={data.completedresearchprod}
                documents={data.researchdocuments}
                formStatus={data.status}
                rejected_message={data.rejected_message ?? null}
              />
            )}
            {data?.attendancetoresearch && (
              <AttendanceToResearch
                attendancetoresearch={data.attendancetoresearch}
                documents={data.researchdocuments}
                formStatus={data.status}
                rejected_message={data.rejected_message ?? null}
              />
            )}
            {data?.intellectualproperty && (
              <IntellectualPropertyForm
                intellectualproperty={data.intellectualproperty}
                documents={data.researchdocuments}
                formStatus={data.status}
                rejected_message={data.rejected_message ?? null}
              />
            )}
            {data?.peerreview && (
              <PeerReviewForm
                documents={data.researchdocuments}
                peerreview={data.peerreview}
                formStatus={data.status}
                rejected_message={data.rejected_message ?? null}
              />
            )}

            {data?.publishedresearchprod && (
              <PublishedResearchForm
                documents={data.researchdocuments}
                formStatus={data.status}
                published={data.publishedresearchprod}
                rejected_message={data.rejected_message ?? null}
              />
            )}

            {data?.citations && (
              <CitationsForm
                formStatus={data.status}
                citations={data.citations}
                documents={data.researchdocuments}
                rejected_message={data.rejected_message ?? null}
              />
            )}

            {data?.otherresearch && (
              <OtherResearchForm
                documents={data.researchdocuments}
                formStatus={data.status}
                otherresearch={data.otherresearch}
              />
            )}

            {data?.genericresearchprod && (
              <GenericResearchForm
                generic={data.genericresearchprod}
                formSchema={data.researchinvolvement.form_schema || []}
                documents={data.researchdocuments}
                formStatus={data.status}
                rejected_message={data.rejected_message ?? null}
                coauthors={data.coauthors}
              />
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default MonitoringForm;
