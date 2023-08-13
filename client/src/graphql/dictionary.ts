
import { request } from '../common/request'
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
export const SEARCH_DICTIONARY = gql`
query SearchDictionary($word: String) {
  searchDictionary(word: $word) {
    total
    data {
      word
      translate
      phonetics {
        text
        audio
      }
      meanings{
        type
        definitions {
          definition
          example
        }
      }
    }
  }
}
`;