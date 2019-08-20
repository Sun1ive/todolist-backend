import { hash, compare } from 'bcrypt';

/**
 * @param {string} password
 * @returns {Promise<string>}
 */
export const hashPassword = (password: string): Promise<string> => hash(password, 10);

/**
 * @param {string} password
 * @param {string} hashed
 * @returns {Promise<boolean>}
 */
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
