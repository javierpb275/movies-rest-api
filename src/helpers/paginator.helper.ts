type PaginationOptions = {
  limit: number;
  skip: number;
  sort: string;
};

export const getPaginationOptions = (
  limited?: string,
  skipped?: string,
  sorted?: string
): PaginationOptions => {
  const limit = limited ? Number(limited) : 10;
  const skip = skipped ? Number(skipped) : 0;
  const sort = sorted ? sorted : "-createdAt";
  return { limit, skip, sort };
};

export const getMatch = (query: any): any => {
  const match: any = {};
  const keys: string[] = Object.keys(query);
  const filteredKeys: string[] = keys.filter((key) => {
    return key !== "sort" && key !== "skip" && key !== "limit";
  });
  filteredKeys.forEach((key) => {
    if (!isNaN(Number(query[key]))) {
      query[key] = Number(query[key]);
    } else if (query[key] === "true" || query[key] === "false") {
      if (query[key] === "true") {
        query[key] = true;
      } else {
        query[key] = false;
      }
    }
    return (match[key] = query[key]);
  });
  return match;
};

export const getMovieFilter = (query: any): any => {
  const filter: any = {};
  if (query.title) {
    filter.title = query.title;
  }
  if (query.year) {
    filter.year = Number(query.year);
  }
  if (query.genre) {
    filter.genres = query.genre;
  }
  return filter;
};
