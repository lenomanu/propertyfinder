export const instant = false;

import { Suspense } from "react";
import { connection } from "next/server";
import { getAllProperties } from '@/lib/properties/property';

async function DebugResults() {
    await connection();
    const result = await getAllProperties();

  return (
    <div>
      Debug Page
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </div>
  )
}

function DebugLoading() {
  return <div>Loading property debug data…</div>;
}

export default function DebugPage() {
  return (
    <Suspense fallback={<DebugLoading />}>
      <DebugResults />
    </Suspense>
  );
}
