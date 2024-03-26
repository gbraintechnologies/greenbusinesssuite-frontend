'use client'
import React, { useState } from "react";
import JurisdictionSetupForm from "../components/jurisdictionForm";
import CurrencySetupForm from "../components/CurrencyForm";

function NewIndividual({ isTabButtonDisabled }: any) {
    const [page, setPage] = useState("jurisdictionform");

    return (
        <div className="px-5">
            <div className="flex justify-between mt-5 items-center px-5">
                <div className="bg-[#F1F5F9] flex items-center gap-2 rounded-xl my-1 p-1 bg-opacity-50">
                    <button
                        onClick={() => setPage("jurisdictionform")}
                        className={`${page === "jurisdictionform"
                            ? "bg-white font-medium shadow-sm"
                            : "text-[#64748B] font-light "
                            } p-1 rounded-lg px-7`}
                    >
                        JurisdictionSetup
                    </button>
                    <button
                        onClick={() => setPage("currency")}
                        disabled={!isTabButtonDisabled}
                        className={`${page === "currency"
                            ? "bg-white font-medium shadow-sm"
                            : " text-[#64748B] font-light"
                            } p-1 rounded-lg px-7`}
                    >
                        CurrencySetup
                    </button>
                </div>
            </div>

            {page === "jurisdictionform" && <JurisdictionSetupForm setPage={setPage} />}
            {page === "currency" && (
                <div className="px-5 mt-5">
                    <CurrencySetupForm setPage={setPage} />
                </div>
            )}
        </div>

    );
}

export default NewIndividual;