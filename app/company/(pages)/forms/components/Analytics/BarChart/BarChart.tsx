import { BarChart } from '@tremor/react';
import React from 'react'

type Props = {
    item: any;
}
const Barchart = ({item}: Props) => {
  return (
    <div className="col-span-3 m-3 border border-gray-100 rounded-xl p-2">
          <BarChart
            data={item?.data}
            index="name"
            categories={["value"]}
            colors={["green"]}
            // valueFormatter={dataFormatter}
            yAxisWidth={48}
            // onValueChange={(v) => console.log(v)}
          />
        </div>
  )
}

export default Barchart