import { hash, compare } from 'bcrypt';

export const hashPassword = (password: string): Promise<string> => hash(password, 10);

export const comparePasswords = async (password: string, hashed: string): Promise<boolean> => {
	try {
		if (compare(password, hashed)) {
			return true;
		} else {
			return false;
		}
	} catch (error) {
		console.log('error in hash %s', error.message);
		return false;
	}
};
