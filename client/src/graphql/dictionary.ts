
import { request } from '../common/request'
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';
export const CREATE_DICTIONARYVIDEO = gql`
mutation CreateDictionaryByVideo($videoId: String!, $word: String!, $start: Float!, $dur: Float!) {
  createDictionaryByVideo(VideoId: $videoId, word: $word, start: $start, dur: $dur) {
    code
    success
    data {
      id
      level
      word
      start
      dur
    }
  }
}
`;
export const DICTIONARYVIDEOS = gql`
query DictionaryByVideo($videoId: String!, $pagination: PaginationInput) {
  dictionaryByVideo(VideoId: $videoId, pagination: $pagination) {
    pagination {
      pageCount
      total
    }
    data {
      id
      level
      word
      start
      dur
    }
  }
}
`;

export const DELETE_DICTIONARYVIDEO = gql`
mutation DeleteDictionaryByVideo($id: Int!) {
  deleteDictionaryByVideo(id: $id) {
    code
    success
  }
}
`;

export const SEARCH_DICTIONARY = gql`
query SearchDictionary($word: String) {
  searchDictionary(word: $word) {
    pagination {
      pageCount
      total
    }
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