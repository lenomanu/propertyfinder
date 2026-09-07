import React, { Suspense } from 'react'
import { UsersPage } from '../components/user-page'
import { DashboardSkeleton } from '@/components/dashboard-skeleton'

function Users() {
  return (
   <Suspense fallback={<DashboardSkeleton />}>
        <UsersPage />
      </Suspense>)
}

export default Users