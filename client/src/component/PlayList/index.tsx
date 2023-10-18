import { Button } from 'react-bootstrap'
import { Videos } from '../Videos'
import './style.scss'
import { Link } from 'react-router-dom'
import { ButtonText } from '../Button'
export function PlayLists(props: any) {
  const { data, isLoading } = props
  return data?.map((item: any, index: number) => {
    return (
      <div className='play-list' key={index}>
        <label className='txt-title'>{item.title}</label>
        <Videos data={item?.video?.data} isLoading={isLoading}></Videos>
        <div className='box-btn'>
          {/* <Button variant="primary">Load more</Button> */}
          <Link className='btn btn-primary' to={`/topic/${item.id}`}>Load more</Link>
        </div>
      </div>
    )
  })
}
export function PlayList(props: any) {
  const { data,onLoadMore} = props
  return (
    <div className='play-list'>
      <label className='txt-title'>{data.title}</label>
      <Videos data={data.videos} isLoading={data.isLoading}></Videos>
      {
        (data.nextPageToken) && (
          <div className='box-btn'>
            <ButtonText loading={data.isLoadMore} onClick={onLoadMore}>Load more</ButtonText>
          </div>
        )
      }
    </div>
  )
}