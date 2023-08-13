
import {  gql } from '@apollo/client';
export const GET_MY_VIDEOS = gql`
query MyVideos {
  myVideos {
    total
    data {
      id
      title
      publishedAt
      thumbnails {
        url
        height
        width
      }
    }
  }
}
`;