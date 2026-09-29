export const validateRequest = (schema, source = "body") => {
  return (req, res, next) => {
    const result = schema.safeParse(req[source] ?? {});

    if (!result.success) {
      const formatted = result.error.format();

      const flatErrors = Object.values(formatted)
        .flat()
        .filter(Boolean)
        .map((err) => err._errors)
        .flat();

      return res.status(400).json({ message: flatErrors.join(", ") });
    }

    if (source === "body") {
      req.body = result.data;
    } else if (source === "params") {
      req.params = result.data;
    } else {
      req.validatedQuery = result.data;
    }
    next();
  };
};
