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

function RegionInput() {
  const searchParams = useSearchParams();
  const parentId = searchParams.get('id');
  const router = useRouter();
  const { data: initialEntries, isLoading } = useQuery<Entry[]>({
    queryKey: ['all Parent entries'],
    queryFn: services.getParentEntriesById(parseInt(parentId || '', 10)),
    enabled: !!parentId,
  });

  const [formEntries, setFormEntries] = useState<string[]>([]);

  useEffect(() => {
    if (initialEntries) {
      setFormEntries(initialEntries.map(() => ''));
    }
  }, [initialEntries]);

  const { handleSubmit } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      entries: [],
    },
  });

  const handleChange = (index: number, value: string) => {
    const updatedEntries = [...formEntries];
    updatedEntries[index] = value;
    setFormEntries(updatedEntries);
  };

  const processEntries = () => {
    if (!initialEntries) {
      return [];
    }

    return initialEntries.flatMap((entry, index) => {
      const names = formEntries[index].split(',').map(name => name.trim());
      return names.map(name => ({
        id: 0,
        name,
        parentAddressSchemeEntriesId: entry.id,
      }));
    });
  };

  const onSubmit = async () => {
    try {
      const payload = { entries: processEntries() };

      await createChildEntries(payload);

      toast.success('Jurisdiction created Successfully', {
        position: 'top-center',
        duration: 3000,
        style: {
          color: 'green',
        },
      });

     router.push('/country-setup');
    } catch (error: any) {
      console.error('Error occurred:', error);
      if (error.response && error.response.data) {
        console.error('Response data:', error.response.data);
        alert(`Error: ${error.response.data.message || error.message}`);
      } else {
        alert(`Error: ${error.message}`);
      }
    }
  };

  return (
    <div className="w-full p-5">
      <div className="w-full">
        <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="w-full text-primary-dark flex justify-between">
            <div>
              <h3 className="font-semibold text-xl">Country / Jurisdiction Setup</h3>
              <p className="text-black-400 text-sm">Configure all jurisdictions for the company</p>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-black-400">Individual dropdown options</h4>
            <p className="text-black-400 text-sm">Setup all Parent and Child sub-levels for the Country</p>
          </div>

          <div className="mt-4">
            {initialEntries && initialEntries.map((entry, index) => (
              <div key={entry.id} className="mb-1 relative">
                <TextInput
                  type="text"
                  autoComplete="off"
                  label={entry.name} 
                  placeholder="Enter comma separated values"
                  className="rounded xl"
                  style={{ width: '30%', height: '100px' }}
                  value={formEntries[index]}
                  onChange={(e) => handleChange(index, e.target.value)}
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end mt-1" style={{ width: '30%' }}>
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
              <IoIosAddCircleOutline size={20} /> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegionInput;
