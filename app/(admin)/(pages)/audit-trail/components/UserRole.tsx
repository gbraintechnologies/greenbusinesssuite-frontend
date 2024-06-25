import UserBadge from '@/public/icons/UserBadge'
import React from 'react'

const UserRole = ({role}: {role: string}) => {
  return (
    <div className='flex bg-[#FFF7ED] gap-2 px-2 py-1 w-fit'>
      <UserBadge />
      <span className='text-[#F59E0B] text-xs font-medium'>{role}</span>
    </div>
  )
}

export default UserRole