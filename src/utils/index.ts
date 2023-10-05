const bcrypt = require("bcrypt");

export const hashString = async (str: string) => {
  const hash = await bcrypt.hash(str, 10);
  return hash;
};
