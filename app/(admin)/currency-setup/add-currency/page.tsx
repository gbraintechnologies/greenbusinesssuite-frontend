'use client'
import React, { ChangeEvent, useEffect, useState } from 'react'
import TextInput from '../components/TextInput';
import { IoIosAddCircleOutline } from 'react-icons/io';
import SelectInputs from '../components/SelectInputs';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { FiEdit2 } from 'react-icons/fi';
import Link from 'next/link';
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import services from "@/services";
import Countries, { Countrie } from "../components/Countries";
import SelectCountryInput from "../components/selectCountryInput";
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import { createCurrency } from '@/services/features/jurisdictionsService';

const schema = yup.object({
    jurisdiction_id: yup
        .number(),
    currency_name: yup
        .string(),
    currency_symbol: yup
        .string(),
    currency_code: yup
        .string()
});

interface Denomination {
    currency_id: string,
    denomination_amount: string,
    currency: string
}


interface Country {
    id: number;
    jurisdiction_name: string;
}

function AddCurrency() {
    const [loading, setLoading] = useState(false);
    const [denominations, setDenominations] = useState<Denomination[]>([]);
    const [denomination, setDenomination] = useState({ "currency_id": "", "denomination_amount": "", 'currency': "" });
    type typeOfSchema = yup.InferType<typeof schema>;

    const { data: countriesData, isLoading: countriesLoading } = useQuery<Country[], Error>({
        queryKey: ["all_countries"],
        queryFn: services.allJurisdictions(),
    });

    const handleAddLevel = () => {
        setDenominations([...denominations, denomination]);
        setDenomination({
            currency_id: "", denomination_amount: "", currency: ""
        });
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setDenomination(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setDenomination(prevState => ({ ...prevState, [name]: value }));
    };

    const handleEdit = (currency_id: string) => {
        const selectedDenomination = denominations.find(d => d.currency_id === currency_id);
        if (selectedDenomination) {
            setDenomination(selectedDenomination);
            handleDelete(parseInt(currency_id, 10))
        }
    };

    const handleDelete = (index: number) => {
        setDenominations(prevDenominations => {
            const updatedDenominations = [...prevDenominations];
            updatedDenominations.splice(index, 1);
            return updatedDenominations;
        });
    };


    const { register, handleSubmit, formState: { isSubmitting, errors, dirtyFields }, getValues } = useForm<typeOfSchema>({
        resolver: yupResolver(schema),
        mode: "onChange",
        defaultValues: {
            jurisdiction_id: 0,
            currency_code: "",
            currency_name: "",
            currency_symbol: ""
        },
    });

    const onSubmit = async (data: typeOfSchema) => {
        try {
            const currencyPayload = {
                jurisdiction_id: data.jurisdiction_id,
                currency_code: data.currency_code,
                currency_name: data.currency_name,
                currency_symbol: data.currency_symbol
            };
            // alert(JSON.stringify(currencyPayload))
            await createCurrency(currencyPayload);

            // const denominationPayload = {

            // };
            // // await updateUser(denominationPayload);

            // Display success message
            toast.success("Currency added Successfully", {
                position: "top-center",
                duration: 3000,
            });
            // router.push("/currency-setup");
        } catch (error: any) {
            console.error('Error occurred:', error);
            alert(error.message);
        }
    };

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
                                disabled={isSubmitting || !dirtyFields.jurisdiction_id}
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
                                listdata={countriesData ?? []}
                                label="Country"
                                autoComplete="off"
                                {...register("jurisdiction_id")}
                                error={errors.jurisdiction_id?.message}
                                PrependIcon={
                                    <span className="absolute left-0 top-2 bottom-0 flex items-center pl-2">
                                        <img
                                            src={Countrie((countriesData?.find(country => country.id === getValues("jurisdiction_id"))?.jurisdiction_name) ?? '')?.flags.png}
                                            alt={Countrie((countriesData?.find(country => country.id === getValues("jurisdiction_id"))?.jurisdiction_name) ?? '')?.name.common}
                                            style={{ height: "auto", width: "30px" }}
                                        />
                                    </span>
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
                            {...register("currency_name")}
                            error={errors.currency_name?.message}
                            style={{ width: "30%" }}
                        />
                    </div>
                    <div className="mb-5 relative">
                        <TextInput
                            label="Symbol"
                            type="text"
                            autoComplete="off"
                            {...register("currency_symbol")}
                            error={errors.currency_symbol?.message}
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
                            value={denomination.denomination_amount}
                            onChange={handleChange}
                            name="denomination_amount"
                        />
                        &nbsp;&nbsp;
                        <SelectInputs
                            placeholder=""
                            autoComplete="off"
                            style={{ width: "70%" }}
                            value={denomination.currency}
                            onChange={handleSelectChange}
                            name="currency"
                        >
                            <option value="">Select</option>
                            <option value="Note">Note</option>
                            <option value="Coin">Coin</option>
                        </SelectInputs>
                        <button
                            type="button"
                            onClick={handleAddLevel}
                            className="bg-white py-3 text-black text-sm px-4 flex items-center justify-center gap-2 text-center shadow-sm rounded-xl hover:bg-gray-100"
                        >
                            Add
                        </button>
                    </div>
                    <div>
                        <h2 className='bg-gray-100 mb-5' style={{ width: "30%" }}>Denominations</h2>
                        <div style={{ width: "30%" }}>
                            {denominations.map((denomination, index) => (
                                <div key={denomination.currency_id} className="combined-input-container flex items-center justify-between border-b mb-1 pb-1" style={{ width: "100%" }}>
                                    <span>{denomination.denomination_amount} &nbsp;{denomination.currency}</span>
                                    <div style={{ display: "inline-flex", width: "30%", justifyContent: "flex-end" }}>
                                        <FiEdit2 size={20} onClick={() => handleEdit(denomination.currency_id)} /> &nbsp;
                                        <RiDeleteBin5Line size={20} onClick={() => handleDelete(index)} />
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