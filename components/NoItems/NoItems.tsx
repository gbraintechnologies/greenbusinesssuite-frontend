import React from 'react'
import { PiEmpty } from 'react-icons/pi'

const NoItems = ({headerText, subtext}: {headerText?: string, subtext?:string}) => {
  return (
    <div className="w-full h-auto py-10 flex justify-center items-center flex-col">
        <div >
        <PiEmpty size={30}/>
        </div>
                <h1 className="text-lg font-medium">{headerText ?? "No items"}</h1>
                <p className="text-sm text-[#667085]">
                  {subtext ?? "There are no items"}
                </p>
              </div>
  )
}

export default NoItems