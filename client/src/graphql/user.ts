
import {request} from '../common/request'
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';
const GET_LOCATIONS = gql`
  query GetLocations {
    locations {
      id
      name
      description
      photo
    }
  }
`;