
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
    pagination {
      total
      pageCount
    }
  }
}
`;

export const GLOBAL_VIDEOS = gql`
query videos {
  videos {
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
    favorite
    subtitles {
      dur
      start
      text
    }
  }
}
`;

export const MUTATION_CREATE_MY_VIDEO = gql`
mutation CreateMyVideo($videoId: String) {
  createMyVideo(videoId: $videoId) {
    code
    success
  }
}
`;

export const MUTATION_DELETE_MY_VIDEO = gql`
mutation DeleteMyVideo($videoId: String) {
  deleteMyVideo(videoId: $videoId) {
    code
    success
  }
}
`;