"use client";
import React, { ChangeEvent, useState, useEffect } from "react";
import TextInput from "../components/TextInput";
import { IoIosAddCircleOutline } from "react-icons/io";
import SelectInputs from "../components/SelectInputs";
import DeleteIcon from "@/public/icons/DeleteIcon";
import EditIconSetup from "@/public/icons/EditIconSetup";
import Link from "next/link";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import services from "@/services";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Countrieses } from "../components/Countries";
import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import { createCurrency } from "@/services/features/currencyService";

const schema = yup.object({
  id: yup.number(),
  currency: yup.string().required(),
  symbol: yup.string().required(),
  countryName: yup.string().required(),
  denominations: yup.array().of(
    yup.object({
      id: yup.number().required(),
      amount: yup.string().required(),
      name: yup.string(),
      denominationType: yup.string(),
    })
  ),
});

interface Denomination {
  id: number;
  amount: string;
  name: string;
  denominationType: string;
}

type Key = any;

function AddCurrency() {
  const [denominations, setDenominations] = useState<Denomination[]>([]);
  const [countries, setCountries] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [denomination, setDenomination] = useState<Denomination>({
    id: 0,
    amount: "",
    name: "",
    denominationType: "",
  });
  type typeOfSchema = yup.InferType<typeof schema>;
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    getValues,
    setValue,
    trigger,
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

  const { data: countriesData } = useQuery({
    queryKey: ["all_countries"],
    queryFn: services.allcountries(),
  });

  useEffect(() => {
    if (countriesData && Array.isArray(countriesData)) {
      setCountries(countriesData);
    } else {
      setCountries([]);
    }
  }, [countriesData]);

  const handleAddLevel = () => {
    if (
      denomination.amount.trim() === "" ||
      denomination.denominationType.trim() === ""
    ) {
      return;
    }

    const existingIndex = denominations.findIndex(
      (denom) => denom.id === denomination.id
    );

    if (existingIndex !== -1) {
      // Update the existing denomination
      const updatedDenominations = [...denominations];
      updatedDenominations[existingIndex] = denomination;
      setDenominations(updatedDenominations);
    } else {
      // Add a new denomination
      const newId =
        denominations.length > 0
          ? denominations[denominations.length - 1].id + 1
          : 1;
      const newDenomination = {
        ...denomination,
        id: newId,
      };
      setDenominations([...denominations, newDenomination]);
    }

    // Reset the denomination input fields
    setDenomination({ id: 0, name: "", amount: "", denominationType: "" });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDenomination((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDenomination((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleEdit = (id: number) => {
    const selectedDenomination = denominations.find((d) => d.id === id);
    if (selectedDenomination) {
      setDenomination(selectedDenomination);
    }
  };

  const handleDelete = (index: number) => {
    setDenominations((prevDenominations) => {
      const updatedDenominations = [...prevDenominations];
      updatedDenominations.splice(index, 1);
      return updatedDenominations;
    });
  };

  const onSubmit = async (data: typeOfSchema) => {
    try {
      const currencyPayload = {
        id: data.id,
        currency: data.currency,
        symbol: data.symbol,
        countryName: data.countryName,
        denominations: denominations,
      };

      // API call to create a currency
      await createCurrency(currencyPayload);

      toast.success("Currency has been added successfully", {
        position: "top-center",
        duration: 3000,
      });

      router.push("/currency-setup");
    } catch (error: any) {
      if (error.response?.status === 404) {
        toast.error("Currency already exists", {
          position: "top-center",
          duration: 3000,
        });
      } else {
        console.error("Error occurred:", error);
        toast.error("An unexpected error occurred", {
          position: "top-center",
          duration: 3000,
        });
      }
    }
  };

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
                Currency / Denomination Setup
              </h3>
              <p className="text-black-400 text-sm">
                configure all jurisdiction for the company
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
                disabled={isSubmitting}
                onClick={handleSubmit(onSubmit)}
                className="bg-primary-green disabled:bg-gray-400 py-3 flex text-white text-sm px-4 hover:opacity-95 items-center gap-2 rounded-xl"
              >
                <IoIosAddCircleOutline size={20} />
                Save
              </button>
            </div>
          </div>

          <div>
            <div className="new-input half hide-input-borders">
              <label className="text-sm">Country</label>
              <div
                className="mt-1 flex w-full bg-slate-50 h-auto rounded-lg border border-[#E2E8F0]"
                style={{ width: "30%" }}
              >
                <Autocomplete
                  variant="bordered"
                  className="w-full "
                  placeholder={"Select country"}
                  selectedKey={selectedCountry}
                  scrollShadowProps={{
                    isEnabled: false,
                  }}
                  popoverProps={{
                    offset: 10,
                    classNames: {
                      content:
                        "shadow-md bg-white border border-[#F1F5F9] p-0 rounded-lg min-w-72 flex flex-col gap-3",
                    },
                  }}
                  onSelectionChange={(key: Key | null) => {
                    const keyString = key ? String(key) : null;
                    setSelectedCountry(keyString);
                    setValue("countryName", keyString || "");
                    trigger("countryName");
                  }}
                  aria-labelledby="Country"
                >
                  {countriesData?.map((country: any) => (
                    <AutocompleteItem
                      key={country}
                      // value={country}
                      className="items-center w-full p-3 rounded-md text-sm text-[#334155] hover:bg-[rgb(241,245,249)]"
                      startContent={
                        <img
                          src={Countrieses(country)?.flags.png}
                          alt={Countrieses(country)?.name.common}
                          style={{
                            height: "24px",
                            width: "24px",
                            borderRadius: "50%",
                          }}
                        />
                      }
                    >
                      {country}
                    </AutocompleteItem>
                  ))}
                </Autocomplete>
              </div>
            </div>
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
            className="combined-input-container flex items-center"
            style={{ width: "30%" }}
          >
            <TextInput
              type="text"
              placeholder="Enter Denomination"
              autoComplete="off"
              className="rounded-xl"
              style={{ width: "100%" }}
              value={denomination.amount}
              onChange={handleChange}
              name="amount"
            />
            &nbsp;&nbsp;
            <SelectInputs
              placeholder=""
              autoComplete="off"
              style={{ width: "70%" }}
              value={denomination.denominationType}
              onChange={handleSelectChange}
              name="denominationType"
            >
              <option value="">Select</option>
              <option value="Note">Note</option>
              <option value="Coin">Coin</option>
            </SelectInputs>
            <button
              type="button"
              onClick={handleAddLevel}
              disabled={
                denomination.amount.trim() === "" ||
                denomination.denominationType.trim() === ""
              }
              className={`bg-white py-3 text-black text-sm px-4 flex items-center justify-center gap-2 text-center shadow-sm rounded-xl hover:bg-gray-100 ${
                denomination.amount.trim() === "" ||
                denomination.denominationType.trim() === ""
                  ? "cursor-not-allowed opacity-50"
                  : ""
              }`}
            >
              Add
            </button>
          </div>
          <div>
            <h2 className="bg-gray-100 mb-5" style={{ width: "30%" }}>
              Denominations
            </h2>
            <div style={{ width: "30%" }}>
              {denominations.map((denom, index) => (
                <div
                  key={denom.id}
                  className="combined-input-container flex items-center justify-between border-b mb-1 pb-1"
                  style={{ width: "100%" }}
                >
                  <span>
                    {denom.amount} &nbsp;{denom.denominationType}
                  </span>
                  <div className="flex gap-1">
                    {/* <p>ID: {denom.id}</p> */}
                    <button
                      type="button"
                      onClick={() => handleEdit(denom.id)}
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

export default AddCurrency;
