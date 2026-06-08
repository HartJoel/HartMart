export default class QueryBuilder {
  constructor(model, query) {
    this.model = model;
    this.query = query;

    this.where = { deletedAt: null };
    this.orderBy = {};
    this.skip = 0;
    this.take = 10;

    this.page = 1;
    this.limit = 10;

    this.total = 0;
  }

  search(fields) {
    if (this.query.search) {
      this.where.OR = fields.map((field) => ({
        [field]: {
          contains: this.query.search,
          mode: "insensitive",
        },
      }));
    }
    return this;
  }

  filter() {
    const excluded = ["search", "page", "limit", "sort"];
    const filteredQuery = { ...this.query };

    excluded.forEach((key) => delete filteredQuery[key]);

    this.where = {
      ...this.where,
      ...filteredQuery,
    };

    return this;
  }

  sort() {
    if (this.query.sort) {
      const sortBy = this.query.sort;

      if (sortBy.startsWith("-")) {
        this.orderBy = { [sortBy.slice(1)]: "desc" };
      } else {
        this.orderBy = { [sortBy]: "asc" };
      }
    } else {
      this.orderBy = { createdAt: "desc" };
    }

    return this;
  }

  paginate() {
    this.page = Number(this.query.page) || 1;
    this.limit = Number(this.query.limit) || 20;

    this.skip = (this.page - 1) * this.limit;
    this.take = this.limit;

    return this;
  }

  async exec() {
    // 🔥 count first for pagination metadata
    this.total = await this.model.count({
      where: this.where,
    });

    const data = await this.model.findMany({
      where: this.where,
      orderBy: this.orderBy,
      skip: this.skip,
      take: this.take,
    });

    const pages = Math.ceil(this.total / this.limit);

    return {
      data,
      pagination: {
        page: this.page,
        limit: this.limit,
        total: this.total,
        pages,
      },
    };
  }
}

// module.exports = QueryBuilder;
