
import {  gql } from '@apollo/client';
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
export const DICTIONARYVIDEOS_DETAIL = gql`
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
      detail {
        word
        translate
        phonetic {
          audio
          text
        }
        meanings {
          definitions {
            definition
            example
          }
          type
        }
      }
    }
  }
}
`;
export const LEAN_DICTIONARYVIDEOS = gql`
query LeanDictionaryByVideo($videoId: String!, $size: Int, $random: Boolean) {
  LeanDictionaryByVideo(VideoId: $videoId, size: $size, random: $random) {
    id
      level
      word
      start
      dur
      detail {
        word
        translate
        phonetic {
          audio
          text
        }
        meanings {
          definitions {
            definition
            example
            exercise
          }
          type
        }
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
query SearchDictionary($word: String!) {
  searchDictionary(word: $word) {
    pagination {
      pageCount
      total
    }
    data {
      word
      translate
      phonetic {
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