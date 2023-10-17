import { useQuery } from 'react-query'
import GraphqlHelper from '../../graphql';
import { GLOBAL_VIDEOS } from "../../graphql/video";
import './style.scss'
import { Videos } from "../../component/Videos";
import NoData from "../../component/no-data";
import { Button } from 'react-bootstrap';
const graphql = new GraphqlHelper()
const Home = (props: any) => {
	const { data, isLoading } = useQuery(['video-main'], () => graphql.query(GLOBAL_VIDEOS).then((data: any) => {
		return data?.videos
	}))
	if ((!data || data.length == 0) && !isLoading) {
		return (
			<>
				<NoData></NoData>
			</>
		)
	}
	return (
		<div className='home'>
			<div className='container'>
				<div className='channel'>
					<label className='txt-title'>DO QUOC DUNG</label>
					<Videos data={data} isLoading={isLoading}></Videos>
					<div className='box-btn'>
						<Button variant="primary">Load more</Button>
					</div>
				</div>
			</div>
		</div>
	)
}
export default Home