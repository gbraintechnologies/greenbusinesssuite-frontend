"use client"
import useCompany from '@/hooks/useCompany';
import Image from 'next/image';
import React from 'react'

type MediaCardProps = {
    showDate?: boolean
    }
const MediaCard: React.FC<MediaCardProps> = ({showDate=false}) => {
    const {companyBranding: company} = useCompany();
  return (
    <div className='border border-[#F1F5F9] shadow-sm rounded-lg p-3 cursor-pointer'>
        <div><Image src={company?.logo} width={200} height={130} alt='blog picture' className='w-full rounded-lg'/></div>
        <h1 className='my-2 text-sm text-[#334155] font-medium'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Saepe temporibus, cumque dolores eum nam ipsa magni illum cum fugiat rerum.</h1>
        {showDate && <p className='text-[#94A3B8] font-medium text-xs'>January 1, 2000</p>}
    </div>
  )
}

export default MediaCard