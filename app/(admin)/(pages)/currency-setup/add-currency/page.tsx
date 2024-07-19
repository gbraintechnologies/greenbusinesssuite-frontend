'use client'
import React, { ChangeEvent, useState, useEffect } from 'react';
import TextInput from '../components/TextInput';
import { IoIosAddCircleOutline } from 'react-icons/io';
import SelectInputs from '../components/SelectInputs';
import DeleteIcon from "@/public/icons/DeleteIcon";
import EditIconSetup from "@/public/icons/EditIconSetup";
import Link from 'next/link';
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import services from "@/services";
import SelectCountryInput from "../components/selectCountryInput";
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Countrie, Countrieses } from "../components/Countries";
import { createCurrency } from '@/services/features/currencyService';

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
            denominationType: yup.string()
        })
    )
});

interface Denomination {
    id: number,
    amount: string,
    name: string,
    denominationType: string
}

interface Country {
    id: number;
    name: string;
}

function AddCurrency() {
    const [denominations, setDenominations] = useState<Denomination[]>([]);
    const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
    const [denomination, setDenomination] = useState({ id: 0, amount: "", name: "", denominationType: "" });
    type typeOfSchema = yup.InferType<typeof schema>;
    const router = useRouter();
    const { data: countriesData } = useQuery<Country[], Error>({
        queryKey: ["all_countries"],
        queryFn: services.allJurisdictions(),
    });


    const handleAddLevel = () => {
        if (denomination.amount.trim() === "" || denomination.denominationType.trim() === "") {
            return;
        }
        setDenominations([...denominations, denomination]);
        setDenomination({ id: 0, name: "", amount: "", denominationType: "" });
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setDenomination(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setDenomination(prevState => ({ ...prevState, [name]: value }));
    };

    const handleEdit = (id: string) => {
        const selectedDenomination = denominations.find(d => d.id.toString() === id);
        if (selectedDenomination) {
            setDenomination(selectedDenomination);
            handleDelete(parseInt(id, 10));
        }
    };

    const handleDelete = (index: number) => {
        setDenominations(prevDenominations => {
            const updatedDenominations = [...prevDenominations];
            updatedDenominations.splice(index, 1);
            return updatedDenominations;
        });
    };

    const { register, handleSubmit, formState: { isSubmitting, errors }, getValues } = useForm<typeOfSchema>({
        resolver: yupResolver(schema),
        mode: "onChange",
        defaultValues: {
            id: 0,
            currency: "",
            symbol: "",
            countryName: "",
            denominations: []
        },
    });

    useEffect(() => {
        const countryName = getValues("countryName");
        console.log("Country name from form:", countryName);

        if (countryName) {
            const country = Countrieses(countryName);
            console.log("Matching country found:", country);
            if (country) {
                setSelectedCountry(country.cca2);
            }
        }
    }, [getValues("countryName"), countriesData]);


    const onSubmit = async (data: typeOfSchema) => {
        try {
            const currencyPayload = {
                id: data.id,
                currency: data.currency,
                symbol: data.symbol,
                countryName: data.countryName,
                denominations: denominations,
            };
            //alert(JSON.stringify(currencyPayload));
            await createCurrency(currencyPayload);

            toast.success("Currency has been added Successfully", {
                position: "top-center",
                duration: 3000,
                style: {
                    color: 'green'
                }
            });
            router.push("/currency-setup");
        } catch (error: any) {
            console.error('Error occurred:', error);
            alert(error.message);
        }
    }


    return (
        <div className="w-full p-5">
            <div className="w-full">
                <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)} style={{ display: "inline-flex", width: "100%" }}>
                    <div className="w-full text-primary-dark flex justify-between">
                        <div>
                            <h3 className="font-semibold text-xl">Currency / Denomination Setup</h3>
                            <p className="text-black-400 text-sm">configure all jurisdiction for the company</p>
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
                                <IoIosAddCircleOutline size={20} />Save
                            </button>
                        </div>
                    </div>

                    <div>

                        <div className="mb-3 relative">
                            <SelectCountryInput
                                key={selectedCountry}
                                listdata={countriesData ?? []}
                                label="Country"
                                autoComplete="off"
                                {...register("countryName")}
                                error={errors.countryName?.message}
                                PrependIcon={
                                    selectedCountry ? (
                                        <span className="absolute left-0 top-2 bottom-0 flex items-center pl-2">
                                            <img
                                                src={selectedCountry ? Countrie(selectedCountry)?.flags.png : ''}
                                                alt={selectedCountry ? Countrie(selectedCountry)?.name.common : ''}
                                                style={{ height: "auto", width: "30px" }}
                                            />
                                        </span>
                                    ) : null 
                                }
                                style={{ width: "30%", height: "30%" }}
                            />
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

                    <div className="combined-input-container flex items-center" style={{ width: "30%" }}>
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
                            disabled={denomination.amount.trim() === "" || denomination.denominationType.trim() === ""}
                            className={`bg-white py-3 text-black text-sm px-4 flex items-center justify-center gap-2 text-center shadow-sm rounded-xl hover:bg-gray-100 ${denomination.amount.trim() === "" || denomination.denominationType.trim() === "" ? 'cursor-not-allowed opacity-50' : ''}`}
                        >
                            Add
                        </button>
                    </div>
                    <div>
                        <h2 className='bg-gray-100 mb-5' style={{ width: "30%" }}>Denominations</h2>
                        <div style={{ width: "30%" }}>
                            {denominations.map((denomination, index) => (
                                <div key={denomination.id} className="combined-input-container flex items-center justify-between border-b mb-1 pb-1" style={{ width: "100%" }}>
                                    <span>{denomination.amount} &nbsp;{denomination.denominationType}</span>
                                    <div className="flex gap-1">
                                        <button
                                            type="button"
                                            onClick={() => handleEdit(denomination.id.toString())}
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
    )
}

export default AddCurrency;