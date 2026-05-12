import { useEffect } from "react";
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
import { useGetPeerReviewPoints } from "../points/usePoints";
import CoAuthorSelect from "../components/CoAuthorSelect";
import { useFacultyList } from "../../../admin/monitoring-form/hooks/hook";
import { useState } from "react";
import api from "../../../api/axios";

type PeerReviewProps = {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  control: Control<FormData>;
};

const PeerReview = ({ register, errors, control }: PeerReviewProps) => {
  const { field: points } = useController({
    name: "peerjournal.points",
    control,
  });

  const { field: authorIdsField } = useController({
    name: "peerjournal.author_ids",
    control,
  });

  const [currentUserId, setCurrentUserId] = useState<number>(0);
  useEffect(() => {
    api.get("/api/user").then((res) => {
      setCurrentUserId(res.data.id);
      if (!authorIdsField.value?.includes(res.data.id)) {
        authorIdsField.onChange([...(authorIdsField.value ?? []), res.data.id]);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { data: facultyList = [] } = useFacultyList();
  const selectedAuthorCount = (authorIdsField.value?.length ?? 1) || 1;

  const coverage = useWatch({ name: "peerjournal.coverage", control });
  const article = useWatch({ name: "peerjournal.article_reviewed", control });
  const abstract = useWatch({ name: "peerjournal.abstract_reviewed", control });

  // Math Hook: We wrap article and abstract in Number() so the math works, 
  // even though the form sends them as strings to satisfy Laravel!
  const { points: totalPoints } = useGetPeerReviewPoints(
    coverage?.toLowerCase(),
    Number(article) || 0,
    Number(abstract) || 0,
    selectedAuthorCount,
  );

  useEffect(() => {
    points.onChange(totalPoints);
  }, [totalPoints, points]);

  return (
    <>
      <h1 className="mb-4 text-2xl font-bold text-gray-800">
        Peer Review Journal Details
      </h1>

      <hr className="my-2 w-full border-2 border-gray-700" />

      <div className="mt-10 grid w-full grid-cols-2 gap-5">
        <div className="flex flex-col gap-2">
          <label
            className="font-semibold after:ms-1 after:text-red-500 after:content-['*']"
            htmlFor="journalName"
          >
            Journal Name
          </label>
          <input
            id="journalName"
            className="h-9 rounded-md border border-gray-800 p-1"
            {...register("peerjournal.name", {
              required: "This field is required",
            })}
          />
          <p className="my-1.5 text-red-500">
            {errors.peerjournal?.name?.message}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <label
            className="font-semibold after:ms-1 after:text-red-500 after:content-['*']"
            htmlFor="reviewerName"
          >
            Referee/Reviewer Name(s)
          </label>
          <CoAuthorSelect
            options={facultyList}
            value={authorIdsField.value ?? []}
            onChange={authorIdsField.onChange}
            currentUserId={currentUserId}
            label="Referee/Reviewer Name(s)"
          />
          <p className="my-1.5 text-red-500">
            {errors.peerjournal?.author_ids?.message}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <label
            className="font-semibold after:ms-1 after:text-red-500 after:content-['*']"
            htmlFor="articleTitle"
          >
            Article Title Reviewed
          </label>
          <input
            id="articleTitle"
            className="h-9 rounded-md border border-gray-800 p-1"
            {...register("peerjournal.article_title")}
          />
          <p className="my-1.5 text-red-500">
            {errors.peerjournal?.article_title?.message}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <label
            className="font-semibold after:ms-1 after:text-red-500 after:content-['*']"
            htmlFor="articleReviewed"
          >
            Number of Articles Reviewed
          </label>
          <input
            id="articleReviewed"
            type="number"
            min="0"
            className="h-9 rounded-md border border-gray-800 p-1"
            {...register("peerjournal.article_reviewed")}
          />
          <p className="my-1.5 text-red-500">
            {errors.peerjournal?.article_reviewed?.message}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <label
            className="font-semibold after:ms-1 after:text-red-500 after:content-['*']"
            htmlFor="abstractTitle"
          >
            Abstract Title Reviewed
          </label>
          <input
            id="abstractTitle"
            className="h-9 rounded-md border border-gray-800 p-1"
            {...register("peerjournal.abstract_title")}
          />
          <p className="my-1.5 text-red-500">
            {errors.peerjournal?.abstract_title?.message}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <label
            className="font-semibold after:ms-1 after:text-red-500 after:content-['*']"
            htmlFor="abstractNumber"
          >
            Number of Abstracts Reviewed
          </label>
          <input
            id="abstractNumber"
            type="number"
            min="0"
            className="h-9 rounded-md border border-gray-800 p-1"
            {...register("peerjournal.abstract_reviewed")}
          />
          <p className="my-1.5 text-red-500">
            {errors.peerjournal?.abstract_reviewed?.message}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <label
            className="font-semibold after:ms-1 after:text-red-500 after:content-['*']"
            htmlFor="dateReviewed"
          >
            Date Reviewed
          </label>
          <input
            id="dateReviewed"
            type="date"
            className="h-9 rounded-md border border-gray-800 p-1"
            {...register("peerjournal.date_reviewed", {
              valueAsDate: true,
            })}
          />
          <p className="my-1.5 text-red-500">
            {errors.peerjournal?.date_reviewed?.message}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <label
            className="font-semibold after:ms-1 after:text-red-500 after:content-['*']"
            htmlFor="coverage"
          >
            Coverage of the Journal
          </label>
          <select
            id="coverage"
            className="h-9 cursor-pointer rounded-md border border-gray-800 p-1 capitalize"
            {...register("peerjournal.coverage", {
              required: "This field is required",
            })}
          >
            <option value="" disabled selected>Select Coverage</option>
            {/* FIX: Updated to strictly match the 4 values in your Tinker output! */}
            <option value="lnu">LNU</option>
            <option value="local">Local</option>
            <option value="international">International</option>
            <option value="isi">ISI</option>
          </select>
          <p className="my-1.5 text-red-500">
            {errors.peerjournal?.coverage?.message}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <label
            className="font-semibold after:ms-1 after:text-red-500 after:content-['*']"
            htmlFor="org"
          >
            Organization
          </label>
          <input
            id="org"
            className="h-9 cursor-pointer rounded-md border border-gray-800 p-1"
            {...register("peerjournal.organization", {
              required: "This field is required",
            })}
          />
          <p className="my-1.5 text-red-500">
            {errors.peerjournal?.organization?.message}
          </p>
        </div>

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
              text={`Total base points for ${coverage || "this coverage"} is ${totalPoints}. Your total calculated points is ${points.value || 0}.`}
            >
              <CiCircleQuestion className="h-5 w-5" />
            </Tooltip>
          </div>
        </div>
        <p className="my-1.5 text-red-500">
          {errors.peerjournal?.points?.message}
        </p>
      </div>
    </>
  );
};

export default PeerReview;