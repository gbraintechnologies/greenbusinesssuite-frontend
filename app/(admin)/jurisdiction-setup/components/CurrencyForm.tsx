'use client'
import React, { ChangeEvent, useState } from 'react'
import TextInput from './TextInput';
import { IoIosAddCircleOutline } from 'react-icons/io';
import SelectInputs from './SelectInputs';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { FiEdit2 } from 'react-icons/fi';


interface Denomination {
    currency_id: string,
    denomination_amount: string,
    currency: string
}
function CurrencySetupForm({ setPage }: any) {
    const [loading, setLoading] = useState(false);
    const [denominations, setDenominations] = useState<Denomination[]>([]);
    const [denomination, setDenomination] = useState({ "currency_id": "", "denomination_amount": "", 'currency': "Note" });


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
            handleDelete(currency_id);
        }
    };

    const handleDelete = (currency_id: string) => {
        const updatedDenominations = denominations.filter(d => d.currency_id !== currency_id);
        setDenominations(updatedDenominations);
    };



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
                            {denominations.map((denomination) => (
                                <div key={denomination.currency_id} className="combined-input-container flex items-center justify-between border-b mb-1 pb-1" style={{ width: "100%" }}>
                                    <span>{denomination.denomination_amount} &nbsp;{denomination.currency}</span>
                                    <div style={{ display: "inline-flex", width: "30%", justifyContent: "flex-end" }}>
                                        <FiEdit2 size={20} onClick={() => handleEdit(denomination.currency_id)}/>
                                        <RiDeleteBin5Line size={20} onClick={() => handleDelete(denomination.currency_id)} />
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

export default CurrencySetupForm;