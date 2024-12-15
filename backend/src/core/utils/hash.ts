import * as bcrypt from 'bcrypt';

export const hashCreate = (value: string): Promise<string> => {
  return bcrypt.hash(value, 10);
};

export const hashCheck = (
  value: string,
  hashedValue: string,
): Promise<boolean> => {
  return bcrypt.compare(value, hashedValue);
};
