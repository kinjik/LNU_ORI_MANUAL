import { useEffect, useState } from "react";
import {
  Control,
  FieldErrors,
  useController,
  UseFormClearErrors,
  UseFormRegister,
  UseFormSetError,
  UseFormSetValue,
  useWatch,
} from "react-hook-form";
import { FormData } from "../CreateResearchMonitoringForm";

import { useMutation } from "@tanstack/react-query";
import { CiCircleQuestion } from "react-icons/ci";
import { MdArrowDropDown, MdCheckCircle, MdSync } from "react-icons/md";
import { useAuthContextProvider } from "../../../../hooks/hooks"; // <-- IMPORTED YOUR AUTH HOOK
import api from "../../../api/axios";
import Button from "../../../shared/components/Button";
import Tooltip from "../../../shared/components/Tooltip";
import { coverages, indexes } from "../constants/constant";
import { usePublishedResearchPoints } from "../points/usePoints";
import CoAuthorSelect from "../components/CoAuthorSelect";
import { useFacultyList } from "../../../admin/monitoring-form/hooks/hook";

type ResearchType = { type: string; id: number };
type ResearchField = { field: string; id: number };
type SocioEconomicObjective = { type: string; id: number };

type DataType = {
  research_type: ResearchType[];
  research_field: ResearchField[];
  socio_economic_objective: SocioEconomicObjective[];
};

type PublishedResearchProps = {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  researchDetails: DataType | undefined;
  control: Control<FormData>;
  setValue: UseFormSetValue<FormData>;
  setError: UseFormSetError<FormData>;
  clearError: UseFormClearErrors<FormData>;
};

async function checkScopus(journalName: string, researchTitle: string) {
  const res = await api.post("/api/check-scopus", {
    journal_name: journalName,
    research_title: researchTitle,
  });
  return res.data.data;
}

const PublishedResearch = ({
  register,
  researchDetails,
  errors,
  control,
  setValue,
  setError,
  clearError,
}: PublishedResearchProps) => {
  const { field: points } = useController({
    name: "published.points",
    control,
  });

  const [selectOpen, setSelectOpen] = useState(false);
  const { user } = useAuthContextProvider(); // <-- GRAB THE USER HERE

  const journalName = useWatch({ name: "published.journal_name", control });
  const coverage = useWatch({ name: "published.coverage", control });
  const title = useWatch({ name: "published.title", control });
  const scopusLink = useWatch({ name: "published.scopus_link", control });
  const selectedIndex = useWatch({ name: "published.indexing", control }) || "";
  const { field: authorIdsField } = useController({
    name: "published.author_ids",
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

  const { points: publishedPoints, total } = usePublishedResearchPoints(
    coverage,
    selectedAuthorCount,
    selectedIndex.includes("Scopus")
  );

  const scopusMutation = useMutation({
    mutationFn: ({
      journalName,
      researchTitle,
    }: {
      journalName: string;
      researchTitle: string;
    }) => checkScopus(journalName, researchTitle),
    onSuccess: (data) => {
      if (data.exists) {
        setValue(
          "published.scopus_link",
          data.data[0].link[2]["@href"] as string,
        );
        clearError("published.indexing");
      } else {
        setError("published.indexing", {
          type: "required",
          message: "Journal is not indexed in Scopus",
        });
      }
    },
  });



  useEffect(() => {
    points.onChange(publishedPoints);
  }, [publishedPoints, points]);

  const handleCheckboxChange = (value: string) => {
    let newValues = selectedIndex ? selectedIndex.split(", ") : [];

    newValues.includes(value)
      ? (newValues = newValues.filter((v) => v !== value))
      : newValues.push(value);

    setValue("published.indexing", newValues.join(", "), {
      shouldValidate: true,
      shouldDirty: true,
    });

    if (value === "Scopus") {
      scopusMutation.mutate({
        journalName: journalName,
        researchTitle: title,
      });
    }

    if (!newValues.includes("Scopus")) {
      clearError("published.indexing");
    }
  };

  return (
    <>
      <h1 className="mb-4 text-2xl font-bold text-gray-800">
        Published Research Details
      </h1>

      <hr className="my-2 w-full border-2 border-gray-700" />

      <div className="mt-10 grid w-full grid-cols-2 gap-5">
        <div className="flex flex-col gap-2">
          <label
            className="font-semibold after:ms-1 after:text-red-500 after:content-['*']"
            htmlFor="researchTitle"
          >
            Research Title
          </label>
          <input
            id="researchTitle"
            className="h-9 rounded-md border border-gray-800 p-1 capitalize"
            {...register("published.title", {
              required: "Research Title is required",
              max: 100,
              min: 10,
            })}
          />
          <p className="my-1.5 text-red-500">
            {errors.published?.title?.message}
          </p>
        </div>
        
        <div className="flex flex-col gap-2">
          <label
            className="font-semibold after:ms-1 after:text-red-500 after:content-['*']"
            htmlFor="authors"
          >
            Author(s) / Co-Author(s)
          </label>
          <CoAuthorSelect
            options={facultyList}
            value={authorIdsField.value ?? []}
            onChange={authorIdsField.onChange}
            currentUserId={currentUserId}
            label="Author(s) / Co-Author(s)"
          />
          <p className="my-1.5 text-red-500">
            {errors.published?.author_ids?.message}
          </p>
        </div>

        {/* MISSING DATE FIELD ADDED HERE */}
        <div className="flex flex-col gap-2">
          <label
            className="font-semibold after:ms-1 after:text-red-500 after:content-['*']"
            htmlFor="datePublished"
          >
            Date Published
          </label>
          <input
            id="datePublished"
            type="date"
            className="h-9 rounded-md border border-gray-800 p-1"
            {...register("published.date", {
              required: "This field is required",
            })}
          />
          <p className="my-1.5 text-red-500">
            {errors.published?.date?.message}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <label
            className="font-semibold after:ms-1 after:text-red-500 after:content-['*']"
            htmlFor="authorship"
          >
            Authorship Nature
          </label>
          <select
            id="authorship"
            className="h-9 cursor-pointer rounded-md border border-gray-800 p-1 capitalize"
            {...register("published.authorship_nature", {
              required: "This field is required",
            })}
          >
            <option disabled selected>
              Select the nature of your authorship
            </option>
            <option value="sole author">Sole Author</option>
            <option value="collaborative local">
              Collaborative Local (Within LNU from the same academic unit)
            </option>
            <option value="collaborative">
              Collaborative (Within LNU form different academic unit)
            </option>
            <option value="collaborative outside">
              Collaborative with outside LNU authors
            </option>
          </select>
          <p className="my-1.5 text-red-500">
            {errors.published?.authorship_nature?.message}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <label
            className="font-semibold after:ms-1 after:text-red-500 after:content-['*']"
            htmlFor="fieldResearch"
          >
            Field of Research
          </label>
          <select
            id="fieldResearch"
            className="h-9 cursor-pointer rounded-md border border-gray-800 p-1 capitalize"
            {...register("published.research_field_id", {
              required: "This field is required",
            })}
          >
            <option disabled selected>
              Select your field of research
            </option>
            {researchDetails?.research_field.map((field) => (
              <option key={field.id} value={field.id}>
                {field.field}
              </option>
            ))}
          </select>
          <p className="my-1.5 text-red-500">
            {errors.published?.research_field_id?.message}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <label
            className="font-semibold after:ms-1 after:text-red-500 after:content-['*']"
            htmlFor="researchType"
          >
            Type of Research
          </label>
          <select
            id="researchType"
            className="h-9 cursor-pointer rounded-md border border-gray-800 p-1 capitalize"
            {...register("published.research_type_id", {
              required: "This field is required",
              valueAsNumber: true,
            })}
          >
            <option disabled selected>
              Select your type of research
            </option>
            {researchDetails?.research_type.map((type) => (
              <option key={type.id} value={type.id}>
                {type.type}
              </option>
            ))}
          </select>
          <p className="my-1.5 text-red-500">
            {errors.published?.research_type_id?.message}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <label
            className="font-semibold after:ms-1 after:text-red-500 after:content-['*']"
            htmlFor="socioEconomicObjective"
          >
            Socio-Economic Objective
          </label>
          <select
            id="socioEconomicObjective"
            className="h-9 cursor-pointer rounded-md border border-gray-800 p-1 capitalize"
            {...register("published.socio_economic_objective_id", {
              required: "This field is required",
              valueAsNumber: true,
            })}
          >
            <option disabled selected>
              Select the socio economic objective of your research
            </option>
            {researchDetails?.socio_economic_objective.map((objective) => (
              <option key={objective.id} value={objective.id}>
                {objective.type}
              </option>
            ))}
          </select>
          <p className="my-1.5 text-red-500">
            {errors.published?.socio_economic_objective_id?.message}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <label
            className="font-semibold after:ms-1 after:text-red-500 after:content-['*']"
            htmlFor="journalName"
          >
            Journal Name
          </label>
          <input
            id="journalName"
            className="h-9 rounded-md border border-gray-800 p-1 capitalize"
            {...register("published.journal_name", {
              required: "This field is required",
            })}
          />
          <p className="my-1.5 text-red-500">
            {errors.published?.journal_name?.message}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <label
            className="font-semibold after:ms-1 after:text-red-500 after:content-['*']"
            htmlFor="editor"
          >
            Editor/Publisher of Journal
          </label>
          <input
            id="editor"
            className="h-9 rounded-md border border-gray-800 p-1 capitalize"
            {...register("published.editor_publisher", {
              required: "This field is required",
            })}
          />
          <p className="my-1.5 text-red-500">
            {errors.published?.editor_publisher?.message}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <label
            className="font-semibold after:ms-1 after:text-red-500 after:content-['*']"
            htmlFor="numCitations"
          >
            Number of Citations to Date
          </label>
          <input
            id="numCitations"
            className="h-9 rounded-md border border-gray-800 p-1 capitalize"
            {...register("published.num_citations_date", {
              required: "This field is required",
              valueAsNumber: true,
            })}
          />
          <p className="my-1.5 text-red-500">
            {errors.published?.num_citations_date?.message}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <label
            className="font-semibold after:ms-1 after:text-red-500 after:content-['*']"
            htmlFor="coverage"
          >
            Coverage of Journal
          </label>
          <select
            id="coverage"
            className="h-9 cursor-pointer rounded-md border border-gray-800 p-1 capitalize"
            {...register("published.coverage", {
              required: "This field is required",
            })}
          >
            <option selected disabled>
              Select the coverage of the journal
            </option>
            {coverages.map((item) => (
              <option key={item.id} value={item.coverage}>
                {item.coverage}
              </option>
            ))}
          </select>
          <p className="my-1.5 text-red-500">
            {errors.published?.coverage?.message}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <label
            className="font-semibold after:ms-1 after:text-red-500 after:content-['*']"
            htmlFor="articleLink"
          >
            Research Article Link
          </label>
          <input
            id="articleLink"
            className="h-9 rounded-md border border-gray-800 p-1"
            type="url"
            {...register("published.article_link", {
              required: "This field is required",
            })}
          />
          <p className="my-1.5 text-red-500">
            {errors.published?.article_link?.message}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <label
            className="font-semibold after:ms-1 after:text-red-500 after:content-['*']"
            htmlFor="issno"
          >
            IssNo. Volume. Pages
          </label>
          <input
            id="issno"
            className="h-9 rounded-md border border-gray-800 p-1"
            type="url"
            {...register("published.issno_vol_pages", {
              required: "This field is required",
            })}
          />
          <p className="my-1.5 text-red-500">
            {errors.published?.issno_vol_pages?.message}
          </p>
        </div>
        <div className="relative flex flex-col gap-2">
          <label
            className="font-semibold after:ms-1 after:text-red-500 after:content-['*']"
            htmlFor="indexing"
          >
            Indexing
          </label>
          <Button
            className="flex min-h-[2.30rem] w-full items-center justify-between rounded-md border border-gray-800 bg-white p-1 text-start"
            type="button"
            onClick={() => setSelectOpen(!selectOpen)}
          >
            <span className="text-sm">
              {selectedIndex.length > 0
                ? selectedIndex
                : "Select journal index"}
            </span>
            <MdArrowDropDown className="size-6" />
          </Button>

          {/* Dropdown */}
          {selectOpen && (
            <div className="absolute left-0 top-full z-50 max-h-48 w-full overflow-y-auto rounded-md border border-gray-800 bg-white p-2 shadow-lg">
              {indexes.map((index) => (
                <label
                  key={index.id}
                  className={`flex cursor-pointer items-center gap-2 rounded-md p-2 hover:bg-gray-300 ${
                    selectedIndex.includes(index.index) &&
                    "bg-blue-500 text-white hover:bg-gray-800"
                  }`}
                >
                  <input
                    type="checkbox"
                    value={index.index}
                    checked={selectedIndex.includes(index.index)}
                    onChange={() => handleCheckboxChange(index.index)}
                    className="hidden"
                  />
                  <span>{index.index}</span>
                </label>
              ))}
            </div>
          )}
          <p className="my-1.5 text-red-500">
            {errors.published?.indexing?.message}
          </p>

          {/* Verification Status */}
          {selectedIndex.includes("Scopus") && (
            <div className="mt-2 flex items-center gap-2">
              {scopusMutation.isLoading && (
                <MdSync className="size-5 animate-spin text-yellow-500" />
              )}
              {scopusMutation.isSuccess && scopusMutation.data.exists && (
                <MdCheckCircle className="size-5 text-green-500" />
              )}
              <p className="text-sm">
                {scopusMutation.isLoading
                  ? "Verifying..."
                  : scopusMutation.isSuccess && scopusMutation.data.exists
                    ? "Journal is indexed in Scopus!"
                    : ""}
              </p>
            </div>
          )}
        </div>
        {scopusMutation.isSuccess && scopusMutation.data.exists && (
          <div className="mt-3">
            <label className="text-sm font-medium">Scopus Link:</label>
            <a href={scopusLink} target="_blank">
              <input
                type="url"
                value={scopusLink || ""}
                readOnly
                className="mt-1 w-full rounded-md border p-2 text-gray-700"
              />
            </a>
          </div>
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
              text={`${coverage === "international" ? "international journal" : coverage}  earns a total of ${total} points. For collaborative research, the points are equally divided among the number of authors.`}
            >
              <CiCircleQuestion className="h-5 w-5" />
            </Tooltip>
          </div>
        </div>
        <p className="my-1.5 text-red-500">
          {errors.published?.points?.message}
        </p>
      </div>
    </>
  );
};

export default PublishedResearch;