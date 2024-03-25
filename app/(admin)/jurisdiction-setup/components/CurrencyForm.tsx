'use client'
import React, { useState } from 'react'
import TextInput from './TextInput';
import { IoIosAddCircleOutline } from 'react-icons/io';
import SelectInputs from './SelectInputs';

function CurrencySetupForm({ setPage }: any) {
    const [loading, setLoading] = useState(false);

    return (
        <div>
            <div className="mt-10 w-full">
                <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()} style={{ display: "inline-flex", width: "100%" }}>
                    <div className="w-full text-primary-dark flex justify-between">
                        <div>
                            <h3 className="font-semibold text-xl">Currency / Denomination Setup</h3>
                            <p className="text-black-400 text-sm">configure all jurisdiction for the company</p>
                        </div>
                        <div className="flex gap-3 items-center justify-end"> {/* Added justify-end to align the buttons to the right */}
                            <button
                                type="button"
                                onClick={() => setPage("jurisdictionform")}
                                className="bg-gray-50 border border-gray-200 shadow-sm py-3 flex text-primary-dark text-sm px-4 hover:opacity-95 items-center gap-2 rounded-xl"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-primary-green disabled:bg-gray-400 py-3 flex text-white text-sm px-4 hover:opacity-95 items-center gap-2 rounded-xl"
                            >
                                <IoIosAddCircleOutline size={20} />Save
                            </button>
                        </div>
                    </div>
                    <div className="mb-1 relative">
                        <TextInput
                            label="Name of Currency"
                            type="text"
                            autoComplete="off"
                            PrependIcon={
                                <span className="absolute left-0 top-0 bottom-0 flex items-center pl-5 font-semibold">
                                    <p>GHC</p>
                                </span>
                            }
                            style={{ paddingLeft: "6.0rem", width: "30%" }}
                        />
                    </div>
                    <div className="mb-5 relative">
                        <TextInput
                            label="Symbol"
                            type="text"
                            autoComplete="off"
                            PrependIcon={
                                <span className="absolute left-0 top-0 bottom-0 flex items-center pl-2 font-semibold">
                                    <span>&#8373;</span>
                                </span>
                            }
                            style={{ paddingLeft: "6.0rem", width: "30%" }}
                        />
                    </div>

                    <div className="combined-input-container flex items-center" style={{ width: "30%" }}>
                        <TextInput
                            type="text"
                            placeholder="Enter Denomination"
                            autoComplete="off"
                            className="rounded-xl"
                            style={{ width: "100%" }}
                        />
                        &nbsp;&nbsp;
                        <SelectInputs
                            placeholder=""
                            autoComplete="off"
                            style={{ width: "70%" }}
                        >
                            <option value="option1">Note</option>
                            <option value="option2">Coin</option>
                        </SelectInputs>
                        <button
                            type="button"
                            className="bg-white py-3 text-black text-sm px-4 flex items-center justify-center gap-2 text-center shadow-sm rounded-xl hover:bg-gray-100"
                        >
                            Add
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CurrencySetupForm;