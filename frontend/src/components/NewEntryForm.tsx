import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";
import React from "react";

export type ExpenseFormData = {
  type: string;
  amount: number;
  date: Date;
  message: string;
};

type SetIsNewEntryFunction = (newValue: boolean) => void;

interface NewEntryFormProps {
  setIsNewEntry: SetIsNewEntryFunction;
}

const NewEntryForm: React.FC<NewEntryFormProps> = ({setIsNewEntry}) => {
  const { showToast } = useAppContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ExpenseFormData>();

  const mutation = useMutation(apiClient.addExpense, {
    onSuccess: async () => {
      showToast({ message: "Added successfully", type: "SUCCESS" });
      setIsNewEntry(false);
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "ERROR" });
    },
  });

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data);
  });

  return (
    <form className="flex flex-col gap-5" onSubmit={onSubmit}>
      <label className="text-gray-700 text-sm font-bold flex-1">
        Type
        <input
          type="text"
          className="border rounded w-full py-1 px-2 font-normal"
          {...register("type", { required: "This field is required" })}
        />
        {errors.type && (
          <span className="text-red-500">{errors.type.message}</span>
        )}
      </label>
      <label className="text-gray-700 text-sm font-bold flex-1">
        Amount
        <input
          type="number"
          className="border rounded w-full py-1 px-2 font-normal"
          {...register("amount", { required: "This field is required" })}
        />
        {errors.amount && (
          <span className="text-red-500">{errors.amount.message}</span>
        )}
      </label>
      <label className="text-gray-700 text-sm font-bold flex-1">
        Date
        <input
          type="datetime-local"
          className="border rounded w-full py-1 px-2 font-normal"
          {...register("date", { required: "This field is required" })}
        />
        {errors.date && (
          <span className="text-red-500">{errors.date.message}</span>
        )}
      </label>
      <label className="text-gray-700 text-sm font-bold flex-1">
        Note
        <input
          type="text"
          className="border rounded w-full py-1 px-2 font-normal"
          {...register("message")}
        />
        {errors.message && (
          <span className="text-red-500">{errors.message.message}</span>
        )}
      </label>
      <span className="flex flex-col">
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl self-end"
        >
          Add Entry
        </button>
      </span>
    </form>
  );
};

export default NewEntryForm;
