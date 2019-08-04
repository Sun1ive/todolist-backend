import { gql } from 'apollo-server';

export const RootQuery = gql`
	type Query {
		getTodos: [Todo]!
		getUser(id: ID!): User
	}
`;
