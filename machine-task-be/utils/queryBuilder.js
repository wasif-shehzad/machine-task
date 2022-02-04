class QueryBuilder {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
    this.rawQuery = query;
    this.total = 0;
    this.totalNumberOfPages = 0;
  }

  filter() {
    console.log("queryString: ", this.queryString);
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    // Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    console.log("queryStr: ", queryStr);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }

    return this;
  }

  raw() {
    const qc = this.query.toConstructor();
    this.rawQuery = new qc();

    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }

  populate(...args) {
    // console.log("args: ", args);

    args.forEach((arg) => {
      if (!Array.isArray(arg)) {
        this.query = this.query.populate(arg);
      }
    });

    return this;
  }

  finish() {
    this.rawQuery.countDocuments((err, count) => {
      this.total = count;
      this.totalNumberOfPages = Math.ceil(
        count / (this.queryString.limit || 100)
      );
    });

    return this;
  }
}

module.exports = QueryBuilder;
