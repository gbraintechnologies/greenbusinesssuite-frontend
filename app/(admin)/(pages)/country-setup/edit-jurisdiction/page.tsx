'use client'
import React, { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { IoIosAddCircleOutline } from 'react-icons/io';
import Link from 'next/link';
import services from "@/services";
import { useQuery } from "@tanstack/react-query";
import { Countrie } from "../components/Countries";
import DeleteIcon from "@/public/icons/DeleteIcon";
import EditIconSetup from "@/public/icons/EditIconSetup";
import { updateJurisdictionByID } from "@/services/features/jurisdictionsService";
import SelectCountryEdit from '../components/selectCountryEdit';
import { BsDot } from "react-icons/bs";


const schema = yup.object().shape({
    id: yup.number().required(),
    countryId: yup.number().required(),
    name: yup.string().required(),
});

function EditJurisdiction() {
    type typeOfSchema = yup.InferType<typeof schema>;
    const searchParams = useSearchParams();
    const Id = searchParams.get('id');

    const { data, isLoading } = useQuery({
        queryKey: ["all jurisdictionByID", Id],
        queryFn: services.getJurisdictionById(Number(Id)),
        enabled: !!Id,
    });

    const { register, handleSubmit, setValue, formState: { errors }, watch } = useForm<typeOfSchema>({
        resolver: yupResolver(schema),
        mode: "onChange",
        defaultValues: {
            id: 0,
            countryId: 0,
            name: ''
        },

    });

    useEffect(() => {
        if (data) {
            setValue("id", data.id);
            setValue("name", data.name);
        }
    }, [data, setValue]);

    const onSubmit = async (data: typeOfSchema) => {

    };

    return (
        <div className="w-full p-5">
            <div className="w-full">
                <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)} style={{ display: "inline-flex", width: "100%" }}>
                    <div className="w-full text-primary-dark flex justify-between">
                        <div>
                            <h3 className="font-semibold text-xl">Country / Jurisdiction Setup</h3>
                            <p className="text-black-400 text-sm">configure all jurisdiction for the company</p>
                        </div>
                        <div className="flex gap-3 items-center justify-end">
                            <Link href="/country-setup">
                                <button
                                    type="button"
                                    className="button bg-gray-50 border border-gray-200 shadow-sm py-3 px-4 flex text-primary-dark text-sm hover:opacity-95 items-center gap-2 rounded-xl"
                                >
                                    Cancel
                                </button>
                            </Link>
                            <button
                                type="submit"
                                onClick={handleSubmit(onSubmit)}
                                className="bg-primary-green disabled:bg-gray-400 py-3 flex text-white text-sm px-4 hover:opacity-95 items-center gap-2 rounded-xl"
                            >
                                <IoIosAddCircleOutline size={20} />Save
                            </button>
                        </div>

                    </div>
                    <div>
                        <div className="mb-3 relative">
                            <SelectCountryEdit
                                label="Country"
                                autoComplete="off"
                                {...register("name")}
                                value={watch("name")}
                                error={errors.name?.message}
                                options={[data?.name || ""]} // Ensure options is an array
                                readOnly
                                PrependIcon={
                                    data?.name ? (
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <img
                                                src={Countrie(data.name)?.flags.png}
                                                alt={Countrie(data.name)?.name.common}
                                                style={{ height: 'auto', width: '30px', marginRight: '10px' }}
                                            />
                                        </div>
                                    ) : null
                                }
                                style={{ width: "30%", height: "30%" }}
                            />
                        </div>
                    </div>
                    <div>
                        <h4 className="font-bold text-black-400">Addressing Scheme</h4>
                        <p className="text-black-400 text-sm">Setup all Parent and Child sub-levels for the Country</p>
                    </div>
                    <div className="flex items-center justify-between"  style={{ width: '30%' }}>
                        <div>
                            <h4 className="font-bold text-black-400">Regions</h4>
                            <span style={{ fontSize: '0.875rem', display: 'flex', alignItems: 'center' }}>
                                <p style={{ margin: 0, marginRight: '10px' }}>Dropdown</p>
                                <BsDot size={30} />
                                <p style={{ margin: 0 }}>Sub-Level</p>
                            </span>
                        </div>
                        <div className="flex items-center justify-end" style={{ width: '30%' }}>
                            <button type="button" className="rounded-full relative" style={{ right: '-10px' }}>
                                <EditIconSetup />
                            </button>
                            <button type="button" className="rounded-full ml-2 relative" style={{ right: '-10px' }}>
                                <DeleteIcon />
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditJurisdiction;