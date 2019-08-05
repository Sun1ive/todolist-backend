import { gql } from 'apollo-server';

export const RootQuery = gql`
	type Query {
		getTodos: [Todo]!
		getUser(id: ID!): User
	}

	type Mutation {
		signUp(email: String!, password: String!, username: String): User!
		signIn(email: String!, password: String!): User!
	}
`;
