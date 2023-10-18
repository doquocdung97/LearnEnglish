import { useQuery } from 'react-query'
import GraphqlHelper from '../../graphql';
import { PLAYLISTS_VIDEOS } from "../../graphql/video";
import './style.scss'
import NoData from "../../component/no-data";
import {PlayLists} from '../../component/PlayList';
import { Config, Variables } from '../../constants';
const graphql = new GraphqlHelper()
const Home = (props: any) => {
	const { data, isLoading } = useQuery(['play-list-video'], () => graphql.query(PLAYLISTS_VIDEOS,{
		"pagination": {
			"pageSize": Config.PAGINATION_SIZE
		}
	}).then((data: any) => {
		return data?.playLists
	}))
	if ((!data || data.length === 0) && !isLoading) {
		return (
			<>
				<NoData></NoData>
			</>
		)
	}
	return (
		<div className='home'>
			<div className='container'>
				<PlayLists data={data} isLoading={isLoading} />
			</div>
		</div>
	)
}
export default Home