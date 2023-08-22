
import {  gql } from '@apollo/client';
export const GET_MY_VIDEOS = gql`
query MyVideos {
  myVideos {
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

export const VIDEO_DETAIL = gql`
query video($videoId: String!) {
  video(id: $videoId) {
    subtitles {
      dur
      start
      text
    }
  }
}

`;