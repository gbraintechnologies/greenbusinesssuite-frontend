import React from 'react'

type Props = {
    item: any
}
const Single = ({item}: Props) => {
  return (
    <div className="col-span-1 py-7 border border-gray-100 px-5 flex items-center justify-center">
          <div>
            {item?.data?.map((single: any) => {
              return (
                <div className="">
                  <p>
                    {item?.function} of {item?.name}
                  </p>
                  <h3 className="text-7xl my-2 font-bold">{single?.value}</h3>

                  <p>{single?.name}</p>
                </div>
              );
            })}
          </div>
        </div>
  )
}

export default Single