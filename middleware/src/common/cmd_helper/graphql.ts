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
  static readonly VIDEOS_BY_USER = gql`
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
  static readonly GLOBAL_VIDEOS= gql`
  query videos{
    videos(filters:{user:{id:{eq:null}}}){
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
  //query dictionary

  static readonly CREATE_DICTIONARYVIDEO = gql`
  mutation ($input:DictionaryVideoInput!){
    createDictionaryVideo(data:$input){
      data{
        id
        attributes{
          word
          level
          start
          dur
        }
      }
    }
  }
  `

  /**
   *{
   *  "id": ID!,
   *  "level": Int!
   *}
   */
  static readonly UPDATE_LEVEL_DICTIONARYVIDEO = gql`
  mutation updateDictionaryVideo($id:ID!,$level:Int){
    updateDictionaryVideo(id:$id,data:{level:$level}){
      data{
         id
        attributes{
          word
          level
          start
          dur
        }
      }
    }
  }
  `
  static readonly CHECK_BEFORE_DELETE_DICTIONARYVIDEO = gql`
  query($userId:ID!,$id:ID!){
    dictionaryVideos(filters:{user:{id:{eq:$userId}},id:{eq:$id}}){
      data{
        id
      }
    }
  }
  `
  static readonly DELETE_DICTIONARYVIDEO = gql`
  mutation deleteDictionaryVideo($id:ID!){
    deleteDictionaryVideo(id:$id){
      data{
        id
      }
    }
  }
  `
  static readonly DICTIONARYVIDEOS = gql`
  query DictionaryVideos($VideoId:String,$userId:ID!,$sort: [String], $pagination: PaginationArg) {
    dictionaryVideos(sort: $sort, pagination: $pagination,filters:{user:{id:{eq:$userId}}, video:{VideoId:{eq:$VideoId}}}) {
      meta {
        pagination {
          page
          pageCount
          pageSize
          total
        }
      }
      data {
        id
        attributes {
          word
          level
          dur
          start
        }
      }
    }
  }
  `
  static readonly DICTIONARYVIDEO = gql`
  query($VideoId:String,$word:String,$userId:ID!){
    dictionaryVideos(filters:{user:{id:{eq:$userId}},video:{VideoId:{eq:$VideoId}},word:{eq:$word}}){
      data{
        id
        attributes{
          word
          level
          start
          dur
        }
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
  static readonly PLAYLIST = gql`
  {
    playLists{
      data{
        id
        attributes{
          Title
          playListId
        }
      }
    }
  }
  `
}