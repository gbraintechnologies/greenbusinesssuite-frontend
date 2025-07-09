"use client";
import React, { useEffect, useState } from "react";
import TextInput from "../components/TextInput";
import { IoIosAddCircleOutline } from "react-icons/io";
import SelectInputs from "../components/SelectInputs";
import DeleteIcon from "@/public/icons/DeleteIcon";
import EditIconSetup from "@/public/icons/EditIconSetup";
import Link from "next/link";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import services from "@/services";
import { Countrie } from "../../country-setup/components/Countries";
import { useSearchParams } from "next/navigation";
import { updateCurrency } from "@/services/features/currencyService";
import SelectCountryEdit from "../components/selectCountryEdit";
import { toast } from "sonner";

const schema = yup.object({
  id: yup.number(),
  currency: yup.string().required(),
  symbol: yup.string().required(),
  countryName: yup.string().required(),
  denominations: yup.array().of(
    yup.object({
      id: yup.number().required(),
      amount: yup.string().required(),
      denominationType: yup.string().required(),
    })
  ),
});

interface Denomination {
  id: number;
  amount: string;
  denominationType: string;
}

function EditCurrency() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const Id = searchParams.get("id");
  type typeOfSchema = yup.InferType<typeof schema>;
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [denominationAmount, setDenominationAmount] = useState<string>("");
  const [denominationType, setDenominationType] = useState<string>("");

  const { data } = useQuery({
    queryKey: ["all currenciesByid", Id],
    queryFn: services.getCurrencyByID(Number(Id)),
    enabled: !!Id,
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
    reset,
  } = useForm<typeOfSchema>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      id: 0,
      currency: "",
      symbol: "",
      countryName: "",
      denominations: [],
    },
  });

  useEffect(() => {
    if (data) {
      setValue("id", data.id);
      setValue("currency", data.currency);
      setValue("symbol", data.symbol);
      setValue("countryName", data.countryName);
      setValue("denominations", data.denominations || []);
    }
  }, [data, setValue]);

  const handleDelete = (index: number) => {
    const updatedDenominations = watch("denominations") as Denomination[];
    updatedDenominations.splice(index, 1);
    setValue("denominations", updatedDenominations);
  };

  const handleEdit = (index: number) => {
    const denominations = watch("denominations") as Denomination[];
    const denomination = denominations[index];
    setDenominationAmount(denomination.amount);
    setDenominationType(denomination.denominationType);
    setEditingIndex(index);
  };

  const handleAddOrUpdate = () => {
    const updatedDenominations = [
      ...(watch("denominations") as Denomination[]),
    ];
    if (editingIndex !== null) {
      updatedDenominations[editingIndex] = {
        id: updatedDenominations[editingIndex].id,
        amount: denominationAmount,
        denominationType,
      };
    } else {
      updatedDenominations.push({
        id: Date.now(),
        amount: denominationAmount,
        denominationType,
      });
    }
    setValue("denominations", updatedDenominations);
    setDenominationAmount("");
    setDenominationType("");
    setEditingIndex(null);
  };

  const onSubmit = async (formData: typeOfSchema) => {
    try {
      const currencyPayload = {
        id: formData.id,
        currency: formData.currency,
        symbol: formData.symbol,
        countryName: formData.countryName,
        denominations: formData.denominations,
      };
      // alert(JSON.stringify(currencyPayload))
      await updateCurrency(currencyPayload);

      toast.success("Currency has been updated Successfully", {
        position: "top-center",
        duration: 3000,
      });
      router.push("/currency-setup");
    } catch (error: any) {
      console.error("Error occurred:", error);
      alert(error.message);
    }
  };

  const isAddOrUpdateDisabled = !denominationAmount || !denominationType;
  return (
    <div className="w-full p-5">
      <div className="w-full">
        <form
          className="flex flex-col gap-6"
          onSubmit={handleSubmit(onSubmit)}
          style={{ display: "inline-flex", width: "100%" }}
        >
          <div className="w-full text-primary-dark flex justify-between">
            <div>
              <h3 className="font-semibold text-xl">
                Edit Currency / Denomination
              </h3>
              <p className="text-black-400 text-sm">
                Edit configured denomination of Currencies for the company
              </p>
            </div>
            <div className="flex gap-3 items-center justify-end">
              <Link href="/currency-setup">
                <button
                  type="button"
                  className="button bg-gray-50 border border-gray-200 shadow-sm py-3 px-4 flex text-primary-dark text-sm hover:opacity-95 items-center gap-2 rounded-xl"
                >
                  Cancel
                </button>
              </Link>
              <button
                type="submit"
                className="bg-primary-green disabled:bg-gray-400 py-3 flex text-white text-sm px-4 hover:opacity-95 items-center gap-2 rounded-xl"
              >
                <IoIosAddCircleOutline size={20} />
                Save Changes
              </button>
            </div>
          </div>

          <div className="mb-3 relative">
            <SelectCountryEdit
              label="Country"
              autoComplete="off"
              {...register("countryName")}
              value={watch("countryName")}
              error={errors.countryName?.message}
              options={[data?.countryName || ""]} // Ensure options is an array
              readOnly
              PrependIcon={
                data?.countryName ? (
                  <img
                    src={Countrie(data.countryName)?.flags.png}
                    alt={Countrie(data.countryName)?.name.common}
                    style={{ height: "auto", width: "30px" }}
                  />
                ) : null
              }
              style={{ width: "30%", height: "30%" }}
            />
          </div>

          <div className="mb-1 relative">
            <TextInput
              label="Name of Currency"
              type="text"
              autoComplete="off"
              {...register("currency")}
              error={errors.currency?.message}
              style={{ width: "30%" }}
            />
          </div>
          <div className="mb-5 relative">
            <TextInput
              label="Symbol"
              type="text"
              autoComplete="off"
              {...register("symbol")}
              error={errors.symbol?.message}
              style={{ width: "30%" }}
            />
          </div>

          <div
            className="combined-input-container flex items-center mb-3"
            style={{ width: "30%" }}
          >
            <TextInput
              type="text"
              placeholder="Enter Denomination"
              autoComplete="off"
              className="rounded-xl"
              value={denominationAmount}
              onChange={(e) => setDenominationAmount(e.target.value)}
              style={{ width: "100%" }}
            />
            &nbsp;&nbsp;
            <SelectInputs
              placeholder=""
              autoComplete="off"
              value={denominationType}
              onChange={(e) => setDenominationType(e.target.value)}
              style={{ width: "70%" }}
            >
              <option value="">Select</option>
              <option value="Note">Note</option>
              <option value="Coin">Coin</option>
            </SelectInputs>
            <button
              type="button"
              onClick={handleAddOrUpdate}
              disabled={isAddOrUpdateDisabled}
              className={`bg-white py-3 text-black text-sm px-4 flex items-center justify-center gap-2 text-center shadow-sm rounded-xl hover:bg-gray-100 ${
                isAddOrUpdateDisabled ? "cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              {editingIndex !== null ? "Update" : "Add"}
            </button>
          </div>

          <div>
            <h2 className="bg-gray-100 mb-5" style={{ width: "30%" }}>
              Denominations
            </h2>
            <div style={{ width: "30%" }}>
              {watch("denominations")?.map((denomination, index) => (
                <div
                  key={index}
                  className="combined-input-container flex items-center justify-between border-b mb-1 pb-1"
                  style={{ width: "100%" }}
                >
                  <span>
                    {denomination.amount} &nbsp;{denomination.denominationType}
                  </span>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => handleEdit(index)}
                      className=" text-white rounded-xl"
                    >
                      <EditIconSetup />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(index)}
                      className=" text-white rounded-xl"
                    >
                      <DeleteIcon />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditCurrency;
