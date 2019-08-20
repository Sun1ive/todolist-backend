import { sign, verify, decode } from 'jsonwebtoken';
import { Config } from '../config/config';

/**
 * @export
 * @interface IGenerateTokenParams
 */
export interface IGenerateTokenParams {
	email: string;
	id: string;
}

export type IDecodedResult = string | { [key: string]: any } | null;

/**
 * @param {IGenerateTokenParams} { email, id }
 */
export const generateToken = ({ email, id }: IGenerateTokenParams) =>
	sign({ email, id }, Config.common.JWT_SECRET, {
		expiresIn: '1h',
	});

/**
 * @param {string} token
 * @returns {boolean}
 */
export const validateToken = (token: string): boolean => {
	try {
		verify(token, Config.common.JWT_SECRET);
		return true;
	} catch (error) {
		console.log('Error while parsing token %s', error.message);
		return false;
	}
};

/**
 * @param {string} token
 * @returns {IDecodedResult}
 */
export const decodeToken = (token: string): IDecodedResult => {
	try {
		const decoded = decode(token, {
			json: true,
		});

		return decoded;
	} catch (error) {
		console.log('Error in decoding token %s', error.message);
		return null;
	}
};
