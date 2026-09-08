import { DashboardSkeleton } from '@/components/dashboard-skeleton'
import React, { Suspense } from 'react'
import { AgenciesPage } from '../components/agency/agency-page'

function Agents() {
  return (
       <Suspense fallback={<DashboardSkeleton />}>
            <AgenciesPage />
          </Suspense>
  )
}

export default Agents