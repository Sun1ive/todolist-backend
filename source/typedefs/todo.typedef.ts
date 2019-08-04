import { gql } from 'apollo-server';

export const typeDef = gql`
	type Todo {
		id: String!
		completed: Boolean!
		title: String!
		user: User
	}
`;
