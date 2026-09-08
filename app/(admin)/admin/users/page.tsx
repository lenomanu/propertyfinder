import React, { Suspense } from 'react'

import { DashboardSkeleton } from '@/components/dashboard-skeleton'
import { UsersPage } from '../components/user/user-page'

function Users() {
  return (
   <Suspense fallback={<DashboardSkeleton />}>
        <UsersPage />
      </Suspense>)
}

export default Users