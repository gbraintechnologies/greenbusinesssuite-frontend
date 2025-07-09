import React from 'react'
import LoadingIcon from '../LoadingIcon/LoadingIcon'

const Loader = ({text}: {text?: string}) => {
  return (
    <div className="h-[20rem] flex items-center justify-center">
        <div>
          <LoadingIcon />
          {text && <p className="mt-2 text-xs text-gray-500">{text}</p>}
        </div>
      </div>
  )
}

export default Loader