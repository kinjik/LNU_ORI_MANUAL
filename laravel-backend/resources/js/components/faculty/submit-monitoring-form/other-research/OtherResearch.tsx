import React, { useEffect, useState } from "react";
import {
  Control,
  FieldErrors,
  useController,
  UseFormRegister,
  useWatch,
} from "react-hook-form";
import { FormData } from "../CreateResearchMonitoringForm";
import { CiCircleQuestion } from "react-icons/ci";
import Tooltip from "../../../shared/components/Tooltip";
import { useGetOtherResearchPoints } from "../points/usePoints";
import { FundSourceNatureEnum } from "../../../shared/types/types";

type OtherResearchProps = {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  control: Control<FormData>;
};

const OtherResearch = ({ register, errors, control }: OtherResearchProps) => {
  const [isFundedResearch, setIsFundedResearch] = useState(false);

  const { field: points } = useController({
    name: "otherresearch.points",
    control,
  });

  const { field: fundSourceNature } = useController({
    name: "otherresearch.fund_source_nature",
    control,
    defaultValue: "",
  });

  const { field: researchInvolvement } = useController({
    name: "otherresearch.research_involvement",
    control,
    defaultValue: "",
  });

  const [schoolLevel, setSchoolLevel] = useState<string>("undergraduate_points");

  // Options
  const fundedRoles = [
    "statistician", "panel", "program", "project leader", "member", 
    "data gatherer", "enumerator", "editor", "data encoder", 
    "tabulator", "compiler", "binder", "collator"
  ];

  const studentThesisRoles = [
    "adviser", "statistician", "panel", "editor"
  ];

  const currentRoles = isFundedResearch ? fundedRoles : studentThesisRoles;

  // Reset dependent fields when toggle changes
  useEffect(() => {
    researchInvolvement.onChange("");
    if (!isFundedResearch) {
      fundSourceNature.onChange("personal");
    } else {
      fundSourceNature.onChange("");
    }
  }, [isFundedResearch]);

  const { points: calculatedPoints } = useGetOtherResearchPoints({
    school_level: schoolLevel,
    research_involvement: researchInvolvement.value,
    funded_research: isFundedResearch,
  });

  useEffect(() => {
    points.onChange(calculatedPoints);
  }, [calculatedPoints, points]);

  return (
    <>
      <h1 className="mb-4 text-2xl font-bold text-gray-800">
        Other Research Involvement Details
      </h1>

      <hr className="my-2 w-full border-2 border-gray-700" />

      <div className="mt-10 grid w-full grid-cols-2 gap-5">
        
        {/* Toggle between Student Thesis and Funded Research */}
        <div className="flex flex-col gap-2 col-span-2">
          <label className="font-semibold">Context of Involvement</label>
          <div className="flex items-center gap-5">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={!isFundedResearch}
                onChange={() => setIsFundedResearch(false)}
                className="cursor-pointer"
              />
              Student Thesis
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={isFundedResearch}
                onChange={() => setIsFundedResearch(true)}
                className="cursor-pointer"
              />
              Internal/External Funded Research
            </label>
          </div>
        </div>

        {/* Role/Involvement Selection */}
        <div className="flex flex-col gap-2">
          <label
            className="font-semibold after:ms-1 after:text-red-500 after:content-['*']"
            htmlFor="involvement"
          >
            Role / Involvement Type
          </label>
          <select
            id="involvement"
            className="h-9 cursor-pointer rounded-md border border-gray-800 p-1 capitalize"
            {...register("otherresearch.research_involvement", {
              required: "This field is required",
            })}
          >
            <option value="" disabled>Select Role</option>
            {currentRoles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
          <p className="my-1.5 text-red-500">
            {errors.otherresearch?.research_involvement?.message}
          </p>
        </div>

        {/* School Level (only for student thesis) */}
        {!isFundedResearch && (
          <div className="flex flex-col gap-2">
            <label
              className="font-semibold after:ms-1 after:text-red-500 after:content-['*']"
              htmlFor="schoolLevel"
            >
              School Level
            </label>
            <select
              id="schoolLevel"
              className="h-9 cursor-pointer rounded-md border border-gray-800 p-1"
              value={schoolLevel}
              onChange={(e) => setSchoolLevel(e.target.value)}
            >
              <option value="undergraduate_points">Undergraduate</option>
              <option value="graduate_points">Graduate</option>
              <option value="dissertation">Dissertation</option>
            </select>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <label
            className="font-semibold after:ms-1 after:text-red-500 after:content-['*']"
            htmlFor="researchTitle"
          >
            Research Title
          </label>
          <input
            id="researchTitle"
            className="h-9 rounded-md border border-gray-800 p-1"
            {...register("otherresearch.research_title", {
              required: "This field is required",
            })}
          />
          <p className="my-1.5 text-red-500">
            {errors.otherresearch?.research_title?.message}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <label
            className="font-semibold after:ms-1 after:text-red-500 after:content-['*']"
            htmlFor="date"
          >
            Date
          </label>
          <input
            id="date"
            type="date"
            className="h-9 rounded-md border border-gray-800 p-1"
            {...register("otherresearch.date", {
              required: "This field is required",
            })}
          />
          <p className="my-1.5 text-red-500">
            {errors.otherresearch?.date?.message}
          </p>
        </div>

        {isFundedResearch ? (
          <div className="flex flex-col gap-2">
            <label
              className="font-semibold after:ms-1 after:text-red-500 after:content-['*']"
              htmlFor="fundSource"
            >
              Fund Source Nature
            </label>
            <select
              id="fundSource"
              className="h-9 cursor-pointer rounded-md border border-gray-800 p-1 capitalize"
              {...register("otherresearch.fund_source_nature", {
                required: "This field is required",
              })}
            >
              <option value="" disabled>Select Fund Source</option>
              <option value={FundSourceNatureEnum.LNU_FUNDED_INITIATED}>Internal Funded</option>
              <option value={FundSourceNatureEnum.EXTERNALLY_FUNDED}>External Funded</option>
              <option value={FundSourceNatureEnum.PERSONAL}>Personal</option>
            </select>
            <p className="my-1.5 text-red-500">
              {errors.otherresearch?.fund_source_nature?.message}
            </p>
          </div>
        ) : (
          <input type="hidden" value="personal" {...register("otherresearch.fund_source_nature")} />
        )}

        <div className="flex flex-col gap-2">
          <label
            className="w-full font-semibold after:ms-1 after:text-red-500 after:content-['*']"
            htmlFor="points"
          >
            Points
          </label>
          <div className="flex items-center justify-between gap-x-2">
            <div
              id="points"
              className="h-9 flex-1 rounded-md border border-green-500 p-1 outline-none"
            >
              {points.value}
            </div>
            <Tooltip
              text={`Points are calculated automatically based on your role and context.`}
            >
              <CiCircleQuestion className="h-5 w-5" />
            </Tooltip>
          </div>
        </div>

      </div>
    </>
  );
};

export default OtherResearch;
