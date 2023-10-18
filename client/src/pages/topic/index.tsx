import './style.scss';
import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { Config } from '../../constants';
import NoData from '../../component/no-data';
import GraphqlHelper from '../../graphql';
import { PLAYLIST_VIDEOS } from '../../graphql/video';
import { Videos } from '../../component/Videos';
import { ButtonText } from '../../component/Button';
import { PlayList } from '../../component/PlayList';
const graphql = new GraphqlHelper()
export default function Topic(props: any) {
	const { id } = useParams();
	const [title, setTitle] = useState(String())
	const [videos, setVideos] = useState<any[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [isLoadMore, setIsLoadMore] = useState(false)
	const [pageToken, setPageToken] = useState(String())
	const [nextPageToken, setNextPageToken] = useState(String())
	const fetch = () => {
		setIsLoadMore(true)
		graphql.query(PLAYLIST_VIDEOS, {
			"playlistId": id,
			"pagination": {
				"pageToken": pageToken,
				"pageSize": Config.PAGINATION_SIZE
			}
		}).then((re: any) => {
			const result = re?.playList?.video
			setTitle(re?.playList?.title)
			if (result) {
				setNextPageToken(result.pagination.nextPageToken)
				const new_data = [...videos, ...result.data]
				setVideos(new_data)
			}
			setIsLoading(false)
			return result
		}).finally(() => {
			setIsLoadMore(false)
		})
	}
	useEffect(() => {
		fetch()
	}, [pageToken]);

	if ((!videos || videos.length === 0) && !isLoading) {
		return (
			<>
				<NoData></NoData>
			</>
		)
	}

	return (
		<>
			<div className='topic'>
				<div className='container'>
					<PlayList
						data={
							{
								title,
								isLoading,
								isLoadMore,
								videos,
								nextPageToken
							}
						}
						onLoadMore={()=>{
							setPageToken(nextPageToken)
						}}
					/>

				</div>
			</div>

		</>
	)
}