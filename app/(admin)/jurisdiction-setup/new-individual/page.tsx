"use client";

import React, { useEffect, useState } from "react";
import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";
import { IoIosAddCircleOutline } from "react-icons/io";
import EditIcon from "@/public/icons/EditIcon";
import "./index.css";
import Countries, { Countrie } from "../components/Countries";
import SelectInput from "../components/SelectInput";

function NewIndividual() {
    const [loading, setLoading] = useState(false);
    const [nationality, setNationality] = useState("");


    return (
        <div className="pb-40 px-5">
            <form className="flex flex-col gap-6" onSubmit={(e) => { e.preventDefault(); }}>
                <div className="w-full text-primary-dark  flex justify-between">
                    <h3 className="font-semibold text-xl">Country / Jurisdiction Setup
                        <p className="opacity-50 font-light text-sm mt-2 mb-5">
                            Configure all Jurisdictions for the Company
                        </p>
                    </h3>

                    <div className="">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-primary-green disabled:bg-gray-400 py-3 flex text-white text-sm px-4 hover:opacity-95 items-center gap-2 rounded-xl"
                        >
                            {loading ? (
                                <>
                                    <LoadingIcon />
                                    Saving
                                </>
                            ) : (
                                <>
                                    {" "}
                                    <IoIosAddCircleOutline />Save
                                </>
                            )}
                        </button>
                    </div>
                </div>

                <div className="">
                    <div className="mb-5 relative">
                        <SelectInput
                            listdata={Countries()}
                            label="Country"
                            onChange={(e) => setNationality(e.target.value)}
                            autoComplete="off"
                            PrependIcon={
                                <span className="absolute left-0 top-2 bottom-0 flex items-center pl-2"><img src={Countrie(nationality)?.flags.png} alt={Countrie(nationality)?.name.common} style={{ height: "auto",width:"30px" }} /></span>
                            }
                            style={{ width: '30%' }}
                        />
                    </div>
                </div>
                <div>
                    <label
                        className="block mb-2 text-xs font-bold text-black-400"
                        htmlFor="input"
                    >
                        Sub-levels
                    </label>
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="regions"
                                name="sub-level"
                                value="Regions"
                                className="mr-2 styled-checkbox"
                            />
                            <label htmlFor="regions" className="border-b mb-1 pb-1" style={{ width: '30%' }}>Regions</label>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="cities"
                                name="sub-level"
                                value="Cities"
                                className="mr-2 styled-checkbox"
                            />
                            <label htmlFor="cities" className="border-b mb-1 pb-1" style={{ width: '30%' }}>Cities</label>
                            <EditIcon />
                        </div>
                        <div className="flex items-center mb-4">
                            <input
                                type="checkbox"
                                id="towns"
                                name="sub-level"
                                value="Towns"
                                className="mr-2 styled-checkbox"
                            />
                            <label htmlFor="towns" className="border-b mb-1 pb-1" style={{ width: '30%' }}>Towns</label>
                            <EditIcon />
                        </div>
                    </div>
                    <button
                        type="button"
                        disabled={loading}
                        className="bg-white py-3 text-black text-sm px-4 flex items-center justify-center gap-2 text-center shadow-sm rounded-xl hover:bg-gray-100"
                        style={{ width: '33%' }}
                    >
                        <IoIosAddCircleOutline />
                        Add Sub-level
                    </button>
                </div>
            </form>
        </div>

    );
}

export default NewIndividual;
