import * as bcrypt from 'bcrypt';

export const secureHash = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 10);
}

export const checkPassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
}
