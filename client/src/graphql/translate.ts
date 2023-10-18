import { gql } from '@apollo/client';

export const GET_TRANSLATE = gql`
query Translate( $text: String) {
    translate(text: $text) {
      audio
      text
    }
  }
`;