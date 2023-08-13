import { gql } from 'graphql-request';
export class GRAPHQL_USER {
  static readonly LOGIN = gql`
  mutation login($password: String!, $identifier: String!){
    login(input:{password: $password, identifier: $identifier}){
      jwt
      user{
        id
        username
      }
    }
  }
  `
  static readonly ME = gql`
  query{
    me{
      id
      username
      email
      role{
        id
        name
      }
      confirmed
      blocked
    }
  }
  `
  static readonly PERMISSION = gql`
  query user($id: ID){
    usersPermissionsUser(id:$id){
      data{
        id
        attributes{
          name
          email
          username
        }
      }
    }
  }
  `
  static readonly VIDEO = gql`
  query videos($videoId:String,$userId:ID){
    videos(filters:{VideoId:{eq:$videoId}, user:{id:{eq:$userId}}}){
      data{
        id
        attributes{
          VideoId
          publishedAt
        }
      }
    }
  }
  `
  static readonly VIDEOS = gql`
  query videos($userId:ID){
    videos(filters:{user:{id:{eq:$userId}}}){
      data{
        attributes{
          VideoId
          level
        }
      }
    }
  }
  `
  static readonly CREATE_VIDEO = gql`
  mutation createVideo($videoid:String,$publishedAt:DateTime, $userid:ID){
    createVideo(data:{
      VideoId:$videoid,
      publishedAt:$publishedAt,
      user:$userid
    }){
      data{
        id
        attributes{
          VideoId
          level
        }
      }
    }
  }
  `
  static readonly DELETE_VIDEO = gql`
mutation deleteVideo($id:ID!){
  deleteVideo(id:$id){
    data{
      id
    }
  }
}
  `
}
export class GRAPHQL_VIDEO {
  static readonly LOGIN = gql`
query videos($id:ID){
  videos(filters:{user:{id:{eq:$id}}}){
    data{
      attributes{
        VideoId
      }
    }
  }
}
  `
}