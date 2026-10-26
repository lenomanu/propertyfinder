'use client'
import React, { useState } from 'react'
import { PropertiesHeader } from './properties-header'
import { PropertiesToolbar } from './properties-toolbar'
import PropertyTableHeader from './properties-table-header'
import PropertiesPagination from './properties-pagination'
import { PaginatedProperties } from '../../properties/property'
import PropertiesManager from './properties-manager'


type PropertiesPageProps = {
  initialData: PaginatedProperties;
  search: string;
};

function PropertiesPage({ initialData, search }: PropertiesPageProps) {

  return (
    <div className='space-y-4'>
      <PropertiesHeader />
      <PropertiesToolbar />
      <PropertiesManager initialData={initialData} />

      <PropertiesPagination
        currentPage={initialData.currentPage}
        totalPages={initialData.totalPages}
      />
    </div>
  )
}

export default PropertiesPage