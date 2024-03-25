"use client";
import React, { useState } from "react";
import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";
import { IoIosAddCircleOutline } from "react-icons/io";
import EditIcon from "@/public/icons/EditIcon";
import "./index.css";
import Countries, { Countrie } from "../components/Countries";
import SelectInput from "../components/SelectInput";
import TextInput from "../components/TextInput";

function NewIndividual() {
  const [filters, setFilters] = useState([
    { id: 1, name: "Jurisdiction Setup", value: "jurisdiction" },
    { id: 2, name: "Currency Setup", value: "currency" },
  ]);

  const [activeFilter, setActiveFilter] = useState(filters[0]);
  const [loading, setLoading] = useState(false);
  const [nationality, setNationality] = useState("");
  const [showTextInput, setShowTextInput] = useState(false);

  const toggleTextInput = () => {
    setShowTextInput((prevState) => !prevState);
  };

  return (
    <div className="px-5">
      <div className="mb-10">
        <div className="flex">
          <div className="bg-gray-100 rounded-lg p-1">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter)}
                className={`px-5 py-1 ${
                  activeFilter.id === filter.id
                    ? "bg-white rounded-lg text-black"
                    : "text-gray-500 font-light"
                }`}
              >
                {filter.name}
              </button>
            ))}
          </div>
        </div>
      </div>
      <form
        className="flex flex-col gap-6"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="w-full text-primary-dark flex justify-between">
          <h3 className="font-semibold text-xl">
            Country / Jurisdiction Setup
          </h3>
          <div>
            <button
              type="submit"
              disabled={loading}
              className="bg-primary-green disabled:bg-gray-400 py-3 flex text-white text-sm px-4 hover:opacity-95 items-center gap-2 rounded-xl mt-[-10px]"
            >
              {loading ? (
                <>
                  <LoadingIcon />
                  Saving
                </>
              ) : (
                <>
                  <IoIosAddCircleOutline />
                  Save
                </>
              )}
            </button>
          </div>
        </div>
        <div>
          <div className="mb-3 relative">
            <SelectInput
              listdata={Countries()}
              label="Country"
              onChange={(e) => setNationality(e.target.value)}
              autoComplete="off"
              PrependIcon={
                <span className="absolute left-0 top-2 bottom-0 flex items-center pl-2">
                  <img
                    src={Countrie(nationality)?.flags.png}
                    alt={Countrie(nationality)?.name.common}
                    style={{ height: "auto", width: "30px" }}
                  />
                </span>
              }
              style={{ width: "30%", height: "30%" }}
            />
          </div>
        </div>
        <div>
          <h4 className="font-bold text-black-400">Addressing Scheme</h4>
          <p className="text-black-400 text-sm">
            Setup administrator of this company
          </p>
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
              <label
                htmlFor="regions"
                className="border-b mb-1 pb-1"
                style={{ width: "30%" }}
              >
                Regions
              </label>
              <EditIcon />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="cities"
                name="sub-level"
                value="Cities"
                className="mr-2 styled-checkbox"
              />
              <label
                htmlFor="cities"
                className="border-b mb-1 pb-1"
                style={{ width: "30%" }}
              >
                Cities
              </label>
              <EditIcon />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="towns"
                name="sub-level"
                value="Towns"
                className="mr-2 styled-checkbox"
              />
              <label
                htmlFor="towns"
                className="border-b mb-1 pb-1"
                style={{ width: "30%" }}
              >
                Towns
              </label>
              <EditIcon />
            </div>
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="streets"
                name="sub-level"
                value="Streets"
                className="mr-2 styled-checkbox"
              />
              <label
                htmlFor="streets"
                className="border-b mb-1 pb-1"
                style={{ width: "30%" }}
              >
                Streets
              </label>
              <EditIcon />
            </div>
          </div>
          {showTextInput && (
            <div className="mb-3 relative">
              <TextInput
                type="text"
                placeholder=""
                autoComplete="off"
                className="rounded xl"
                style={{ width: "33%" }}
              />
            </div>
          )}
          <button
            type="button"
            onClick={toggleTextInput}
            className="bg-white py-3 text-black text-sm px-4 flex items-center justify-center gap-2 text-center shadow-sm rounded-xl hover:bg-gray-100"
            style={{ width: "33%" }}
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
