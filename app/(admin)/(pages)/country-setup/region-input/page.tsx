'use client'
import React, { useState, useEffect } from 'react';
import TextInput from '../components/TextInput';
import Link from 'next/link';
import { IoIosAddCircleOutline } from "react-icons/io";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useSearchParams } from 'next/navigation';

const schema = yup.object({
  jurisdictions_id: yup
    .number(),
  jurisdiction_name: yup
    .string(),
  jurisdiction_symbol: yup
    .string(),
  name_of_currency: yup
    .string(),
  currency_code: yup
    .string()
});

function RegionInput() {
  const searchParams = useSearchParams();
  const [labels, setLabels] = useState<string[]>([]);

  useEffect(() => {
    const labelsParam = searchParams.get('labels');
    if (labelsParam) {
      const labelArray = labelsParam.split(',');
      setLabels(labelArray);
      //console.log('Labels from URL:', labelArray); // Log to verify the labels
    } else {
      //console.log('No labels parameter found in the URL'); // Log if no labels found
    }
  }, [searchParams]);

  return (
    <div className='w-full p-5'>
      <div className="w-full">
        <form className="flex flex-col gap-6">
          <div className="w-full text-primary-dark flex justify-between">
            <div>
              <h3 className="font-semibold text-xl">Country / Jurisdiction Setup</h3>
              <p className="text-black-400 text-sm">configure all jurisdiction for the company</p>
            </div>
          </div>
          <div>

          </div>
          <div>
            <h4 className="font-bold text-black-400">Individual dropdown options</h4>
            <p className="text-black-400 text-sm">Setup all Parent and Child sub-levels for the Country</p>
          </div>


          <div className="mt-4">
          {labels.length === 0 ? (
              <p className='font-bold'>No labels to display</p>
            ) : (
              labels.map((label, index) => (
                <div className="mb-1 relative" key={index}>
                  <TextInput
                    type="text"
                    autoComplete="off"
                    label={label}
                    placeholder='Enter comma seperated values'
                    className="rounded xl"
                    style={{ width: '30%', height: '100px' }}
                  />
                </div>
              ))
            )}
          </div>
          <div className="flex justify-end mt-1" style={{ width: "30%" }}>
            <Link href="/country-setup/new-individual">
              <button
                type="button"
                className="button bg-gray-50 border border-gray-200 shadow-sm py-3 px-4 flex text-primary-dark text-sm hover:opacity-95 items-center gap-2 rounded-xl mr-3"
              >
                Cancel
              </button>
            </Link>
            <button
              type="submit"
              className="bg-primary-green disabled:bg-gray-400 py-3 flex text-white text-sm px-4 hover:opacity-95 items-center gap-2 rounded-xl"
            >
              <IoIosAddCircleOutline size={20} />Save Changes
            </button>
          </div>
        </form>

      </div>
    </div>
  )
}

export default RegionInput