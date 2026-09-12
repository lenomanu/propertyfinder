import React from 'react'
import { PropertiesHeader } from './properties-header'
import { PropertiesToolbar } from './properties-toolbar'

function PropertiePage() {
  return (
    <div className='space-y-4'>
        <PropertiesHeader/>
        <PropertiesToolbar/>
    </div>
  )
}

export default PropertiePage