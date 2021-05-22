const convertDate = (date?: string | null) => {
  if (date) {
    return new Date(date);
  }
  return undefined;
};

export default convertDate;
