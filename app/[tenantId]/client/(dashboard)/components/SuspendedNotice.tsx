import React from 'react'
import { GoShieldLock } from 'react-icons/go'

const SuspendedNotice = () => {
  return (
    <div className='w-full bg-[#FFEBEC] text-[#B91C1C] flex items-center gap-2 p-5 rounded-md'>
        <GoShieldLock />
        <p>Your account has been suspended. Please contact the logiciel admin at kpmgadmin@kpmgghana.com </p>

    </div>
  )
}

export default SuspendedNotice