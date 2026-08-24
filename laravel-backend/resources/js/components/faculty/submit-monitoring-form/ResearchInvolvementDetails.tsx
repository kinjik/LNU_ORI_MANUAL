import CompletedResearch from "./completed-research/CompletedResearch";
import {
  Control,
  FieldErrors,
  UseFormClearErrors,
  UseFormRegister,
  UseFormSetError,
  UseFormSetValue,
} from "react-hook-form";
import { FormData } from "./CreateResearchMonitoringForm";
import useFetchResearchDetails, {
  DataType,
} from "../hooks/useFetchResearchDetails";
import PresentedResearch from "./presented-research/PresentedResearch";
import PublishedResearch from "./published-research/PublishedResearch";
import Citations from "./citations/Citations";
import ParticipationResearch from "./participation-research/ParticipationResearch";
import IntellectualProperty from "./intellectual-property/IntellectualProperty";
import PeerReview from "./peer-review/PeerReview";
import OtherResearch from "./other-research/OtherResearch";
import GenericResearch from "./generic-research/GenericResearch";

type ResearchInvolvementDetailsProps = {
  involvementType: number;
  errors: FieldErrors<FormData>;
  register: UseFormRegister<FormData>;
  control: Control<FormData>;
  setValue: UseFormSetValue<FormData>;
  setError: UseFormSetError<FormData>;
  clearError: UseFormClearErrors<FormData>;
};

const ResearchInvolvementDetails = ({
  setValue,
  involvementType,
  errors,
  register,
  control,
  setError,
  clearError,
}: ResearchInvolvementDetailsProps) => {
  const { data: researchDetails } = useFetchResearchDetails();

  const researchComponents: Record<
    number,
    React.FC<{
      control: Control<FormData>;
      researchDetails: DataType | undefined;
      errors: FieldErrors<FormData>;
      register: UseFormRegister<FormData>;
      setValue: UseFormSetValue<FormData>;
      setError: UseFormSetError<FormData>;
      clearError: UseFormClearErrors<FormData>;
    }>
  > = {
    1: CompletedResearch,
    2: PresentedResearch,
    3: PublishedResearch,
    4: Citations,
    5: ParticipationResearch,
    6: IntellectualProperty,
    7: PeerReview,
    8: OtherResearch,
  };

  const SelectedComponent = researchComponents[involvementType];

  // const renderDetails = () => {
  //   switch (involvementType) {
  //     case 1:
  //       //completed resesarch
  //       return (
  //         <CompletedResearch
  //           control={control}
  //           researchDetails={researchDetails}
  //           errors={errors}
  //           register={register}
  //         />
  //       );
  //     case 2:
  //       return <h1>Case 2</h1>;
  //   }
  // };
  return (
    <section className="mb-5 w-full">
      {SelectedComponent ? (
        <SelectedComponent
          clearError={clearError}
          setError={setError}
          setValue={setValue}
          control={control}
          researchDetails={researchDetails}
          errors={errors}
          register={register}
        />
      ) : (
        // Fallback for any custom/admin-created type
        <GenericResearch
          clearError={clearError}
          setError={setError}
          setValue={setValue}
          control={control}
          researchDetails={researchDetails}
          errors={errors}
          register={register}
          involvementType={involvementType}
        />
      )}
    </section>
  );
};

export default ResearchInvolvementDetails;
