import { useEffect, useState, useMemo } from "react";
import {
  Control,
  FieldErrors,
  useController,
  UseFormClearErrors,
  UseFormRegister,
  UseFormSetError,
  UseFormSetValue,
} from "react-hook-form";
import { FormData } from "../CreateResearchMonitoringForm";
import CoAuthorSelect from "../components/CoAuthorSelect";
import { useFacultyList } from "../../../admin/monitoring-form/hooks/hook";
import useGetResearchInvolvementTypes from "../../hooks/useGetResearchInvolvementTypes";
import api from "../../../api/axios";
import { CiCircleQuestion } from "react-icons/ci";
import Tooltip from "../../../shared/components/Tooltip";

type GenericResearchProps = {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  control: Control<FormData>;
  setValue?: UseFormSetValue<FormData>;
  setError?: UseFormSetError<FormData>;
  clearError?: UseFormClearErrors<FormData>;
  researchDetails?: unknown;
  involvementType?: number;
};

const GenericResearch = ({ register, errors, control, involvementType, setValue }: GenericResearchProps) => {
  const { field: authorIdsField } = useController({
    name: "generic.author_ids",
    control,
  });

  const { field: points } = useController({
    name: "generic.points",
    control,
  });

  const [currentUserId, setCurrentUserId] = useState<number>(0);

  const { data: involvementTypes } = useGetResearchInvolvementTypes();
  const currentType = useMemo(() => 
    involvementTypes?.find((t) => t.id === involvementType),
  [involvementTypes, involvementType]);

  const formSchema = currentType?.form_schema || [];

  useEffect(() => {
    api.get("/api/user").then((res) => {
      setCurrentUserId(res.data.id);
      if (!authorIdsField.value?.includes(res.data.id)) {
        authorIdsField.onChange([...(authorIdsField.value ?? []), res.data.id]);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (currentType?.default_points !== undefined && currentType.default_points !== null) {
      if (setValue) {
        setValue("generic.points", currentType.default_points);
      }
    }
  }, [currentType, setValue]);

  const { data: facultyList = [] } = useFacultyList();

  return (
    <>
      <h1 className="mb-4 text-2xl font-bold text-gray-800 capitalize">
        {currentType ? currentType.research_involvement_type : "Research / Activity Details"}
      </h1>

      <hr className="my-2 w-full border-2 border-gray-700" />

      <div className="mt-10 grid w-full grid-cols-2 gap-5">
        {formSchema.map((field) => (
          <div 
            key={field.id} 
            className={`flex flex-col gap-2 ${field.type === 'text' ? 'col-span-2' : ''}`}
          >
            <label
              className="font-semibold after:ms-1 after:text-red-500 after:content-['*']"
              htmlFor={`dynamic_${field.id}`}
            >
              {field.label}
            </label>
            <input
              id={`dynamic_${field.id}`}
              type={field.type}
              className={`h-9 rounded-md border border-gray-800 p-1 ${field.type === 'text' ? 'capitalize' : ''}`}
              {...register(`generic.dynamic_data.${field.id}`, {
                required: `${field.label} is required`,
                ...(field.type === 'number' && { valueAsNumber: true }),
              })}
            />
            <p className="my-1.5 text-red-500">
              {/* @ts-ignore */} 
              {errors.generic?.dynamic_data?.[field.id]?.message}
            </p>
          </div>
        ))}

        {/* Collaborators / Authors */}
        <div className="col-span-2 flex flex-col gap-2">
          <label className="font-semibold after:ms-1 after:text-red-500 after:content-['*']">
            Collaborators / Authors
          </label>
          <CoAuthorSelect
            options={facultyList}
            value={authorIdsField.value ?? []}
            onChange={authorIdsField.onChange}
            currentUserId={currentUserId}
            label="Collaborators/Authors"
          />
          <p className="my-1.5 text-red-500">
            {errors.generic?.author_ids?.message}
          </p>
        </div>

        {/* Points */}
        <div className="flex flex-col gap-2">
          <label
            className="w-full font-semibold after:ms-1 after:text-red-500 after:content-['*']"
            htmlFor="genericPoints"
          >
            Points
          </label>
          <div className="flex items-center gap-x-2">
            <input
              id="genericPoints"
              type="number"
              min="0"
              className="h-9 flex-1 rounded-md border border-gray-800 p-1 outline-none"
              disabled={currentType?.default_points !== null}
              {...register("generic.points", {
                required: "Points are required",
                valueAsNumber: true,
                min: { value: 0, message: "Points cannot be negative" },
              })}
              onChange={(e) => points.onChange(Number(e.target.value))}
            />
            <Tooltip text={currentType?.default_points !== null ? "Points are fixed for this type." : "Enter the points awarded for this activity."}>
              <CiCircleQuestion className="h-5 w-5" />
            </Tooltip>
          </div>
          <p className="my-1.5 text-red-500">
            {errors.generic?.points?.message}
          </p>
        </div>
      </div>
    </>
  );
};

export default GenericResearch;

