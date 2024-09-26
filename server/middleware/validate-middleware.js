const schemaMiddleware = (schema) => async (req, res, next) => {
  const data = req.body;
  try {
    const parsedData = await schema.parseAsync(data);
    req.body = parsedData;
    next();
  } catch (error) {
    const err = {
      status: 422,
      msg: "Validation Error",
      extraD: error.errors[0].message,
    };
    next(err);  // Pass the error to the next middleware
  }
};

module.exports = schemaMiddleware;
