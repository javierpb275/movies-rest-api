export const validateBodyProperties = (
  body: any,
  allowedProperties: string[]
): boolean => {
  const bodyProperties: string[] = Object.keys(body);
  const isValidOperation: boolean = bodyProperties.every((property) =>
    allowedProperties.includes(property)
  );
  return isValidOperation;
};
