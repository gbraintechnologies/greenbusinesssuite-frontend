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
import { updateJurisdictionByID } from "@/services/features/jurisdictionsService";


const schema = yup.object().shape({
    id: yup.number().required(),
    name: yup.string().required(),
    jurisdiction: yup.object().shape({
        id: yup.number().required(),
        countryId: yup.number().required(),
        name: yup.string().required(),
    }),
    inputType: yup.string().required(),
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

    //   useEffect(() => {
    //     alert(JSON.stringify(data))
    //   }, [data]);

    const { register, handleSubmit, setValue, formState: { errors }, getValues } = useForm<typeOfSchema>({
        resolver: yupResolver(schema),
        mode: "onChange",
        defaultValues: {
            id: 0,
            name: '',
            jurisdiction: {
                id: 0,
                countryId: 0,
                name: 'Ghana'
            },
            inputType: 'free-input'
        },

    });

    useEffect(() => {
        //alert(JSON.stringify(Id))
    }, []);

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
                    <div className='mb-5'>

                    </div>
                    <div className='mt-3'>
                        <h4 className="font-bold text-black-400">Addressing Scheme</h4>
                        <p className="text-black-400 text-sm">Setup all Parent and Child sub-levels for the Country</p>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditJurisdiction;