const parsePagination = (req) => {
  const page = Number.isNaN(parseInt(req.query.page, 10)) ? 1 : parseInt(req.query.page, 10);
  const limit = Number.isNaN(parseInt(req.query.limit, 10)) ? 10 : parseInt(req.query.limit, 10);
  const safePage = page >= 1 ? page : 1;
  const safeLimit = limit >= 1 && limit <= 100 ? limit : 10;
  const offset = (safePage - 1) * safeLimit;

  return {
    page: safePage,
    limit: safeLimit,
    offset,
  };
};

const buildPagination = (page, limit, total) => ({
  page,
  limit,
  total,
  totalPages: Math.max(1, Math.ceil(total / limit)),
});

module.exports = {
  parsePagination,
  buildPagination,
};
