'use client'
import React, { useState, useEffect } from 'react';
import TextInput from '../components/TextInput';
import Link from 'next/link';
import { IoIosAddCircleOutline } from 'react-icons/io';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import services from '@/services';
import { useQuery } from '@tanstack/react-query';
import { createChildEntries } from '@/services/features/jurisdictionsService';

interface Entry {
  id: number;
  name: string;
  parentAddressSchemeEntriesId: number;
}

interface FormData {
  entries: Entry[];
}

const schema = yup.object().shape({
  entries: yup
    .array()
    .of(
      yup.object().shape({
        id: yup.number().required(),
        name: yup.string().required(),
        parentAddressSchemeEntriesId: yup.number().required(),
      })
    )
    .required(),
});

function parentSectorInputs() {
  const searchParams = useSearchParams();
  const Id = searchParams.get('id');
  const router = useRouter();

  const { handleSubmit } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      entries: [],
    },
  });
  useEffect(() => {
    alert(JSON.stringify(Id))
  }, [])

  const onSubmit = async () => {

  };

  return (
    <div className="w-full p-5">
      <div className="w-full">
        <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="w-full text-primary-dark flex justify-between">
            <div>
              <h3 className="font-semibold text-xl">Sector Setup</h3>
              <p className="text-black-400 text-sm">Configure all sectors for the jurisdiction</p>
            </div>
          </div>

          <div className="mt-4">
            <div className="mb-1 relative">
              <TextInput
                type="text"
                autoComplete="off"
                placeholder="Enter comma separated values"
                className="rounded xl"
                style={{ width: '30%', height: '100px' }}
              />
            </div>
          </div>

          <div className="flex justify-end mt-1" style={{ width: '30%' }}>
            <Link href="/sector-setup/add-sector">
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
              <IoIosAddCircleOutline size={20} /> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default parentSectorInputs;
