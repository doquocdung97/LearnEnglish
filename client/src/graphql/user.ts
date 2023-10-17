
import { gql } from '@apollo/client';
export const MUTATION_LOGIN = gql`
  mutation Login($identifier: String!, $password: String!) {
    login(identifier: $identifier, password: $password) {
      token
      user {
        id
        name
        email
        phone
      }
    }
  }
`;
export const QUERY_USER = gql`
  query User {
    user {
      id
      name
      email
      phone
    }
  }
`;