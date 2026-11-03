import { getAllProperties } from '@/lib/properties/property';
import React from 'react'

async function page() {
    const result = await getAllProperties();

if (result.success) {
  console.log(result.properties);
}
  return (
    
    <div>
      Debug Page
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </div>
  )
}

export default page
