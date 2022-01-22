type Pagination = {
  limit: number;
  offset: number;
};

export const getPagination = (page: string, size: string): Pagination => {
  const limit = size ? +Number(size) : 3;
  const offset = page ? Number(page) * limit : 0;
  return { limit, offset };
};
