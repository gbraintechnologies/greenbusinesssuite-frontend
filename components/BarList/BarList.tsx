import { BarList } from '@tremor/react'
import React from 'react'

const BarListChart = ({item}: any) => {
    return (
        <>
          <BarList
            data={item}
          />
        </>
      )
    
}

export default BarListChart