import { sign, verify } from 'jsonwebtoken';
import { Config } from '../config/config';

export interface IGenerateTokenParams {
	email: string;
	id: string;
}

export const generateToken = ({ email, id }: IGenerateTokenParams) =>
	sign({ email, id }, Config.common.JWT_SECRET, {
		expiresIn: '1h',
	});

export const validateToken = (token: string): boolean => {
	try {
		verify(token, Config.common.JWT_SECRET);
		return true;
	} catch (error) {
		console.log('Error while parsing token %s', error.message);
		return false;
	}
};
