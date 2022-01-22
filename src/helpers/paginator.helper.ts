type PaginationOptions = {
  limit: number;
  skip: number;
  sort: string;
};

export const getPagination = (
  limited?: string,
  skipped?: string,
  sorted?: string
): PaginationOptions => {
  const limit = limited ? Number(limited) : 10;
  const skip = skipped ? Number(skipped) : 0;
  const sort = sorted ? sorted : "-createdAt";
  return { limit, skip, sort };
};
