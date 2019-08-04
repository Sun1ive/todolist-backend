import { gql } from 'apollo-server';

export const typeDef = gql`
	type User {
		id: String!
		username: String
		email: String!
	}
`;
