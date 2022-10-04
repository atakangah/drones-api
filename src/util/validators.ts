export const medicationNameValid = (name: string): boolean => {
  return name.match(/^[a-zA-Z0-9_-]+$/) ? true : false;
};

export const medicationCodeValid = (code: string): boolean => {
  return code.match(/^[A-Z0-9_]+$/) ? true : false;
};
