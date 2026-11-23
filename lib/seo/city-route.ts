import { redirect } from "next/navigation";

import {
  cityPathSegmentFromRouteParam,
  fullyDecodeCityRouteParam,
} from "@/lib/seo/urls";

export function redirectToCanonicalCityRoute(
  basePath: string,
  city: string
): void {
  const canonical = cityPathSegmentFromRouteParam(city);
  const decoded = fullyDecodeCityRouteParam(city);
  if (canonical !== city && canonical !== decoded) {
    redirect(`${basePath}/${canonical}`);
  }
}