export type PropertyQuery = {
  search: string;
  page: number;
};

export function parsePropertyQuery(
  searchParams: Record<string, string | undefined>,
): PropertyQuery {
  const search = searchParams.search?.trim() ?? "";

  const parsedPage = Number(searchParams.page);

  const page =
    Number.isInteger(parsedPage) && parsedPage > 0
      ? parsedPage
      : 1;

  return {
    search,
    page,
  };
}