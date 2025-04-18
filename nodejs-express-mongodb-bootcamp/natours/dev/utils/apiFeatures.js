class APIFeature {
  constructor(model, queryString, initialFilter = {}) {
    this.query = model.find(initialFilter);
    this.model = model;
    this.queryString = queryString;
  }
  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);

    queryStr = queryStr.replace(
      /\b(gte|gt|lte|lt|regex)\b/g,
      (match) => `$${match}`,
    );
    console.log(queryStr);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }
  sort() {
    if (this.queryString.sort) {
      this.query = this.query.sort(this.queryString.sort.split(',').join(' '));
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }
  limitFields() {
    if (this.queryString.fields) {
      this.query = this.query.select(
        this.queryString.fields.split(',').join(' '),
      );
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }
  async paginate() {
    const limit = this.queryString.limit * 1 || 100;
    const total = await this.model.countDocuments();
    const totalPage = Math.ceil(total / limit);
    let page = this.queryString.page * 1 || 1;
    if (page > totalPage) page = totalPage;
    if (page < 1) page = 1;
    const skip = (page - 1) * limit;

    const items = await this.query.skip(skip).limit(limit);

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPage,
      },
    };
  }
}
module.exports = APIFeature;
