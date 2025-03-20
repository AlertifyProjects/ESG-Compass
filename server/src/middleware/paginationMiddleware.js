const paginate = (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  
  // Calculate skip value for pagination
  const skip = (page - 1) * limit;
  
  // Add pagination data to request object
  req.pagination = {
    page,
    limit,
    skip
  };
  
  next();
};

module.exports = { paginate };