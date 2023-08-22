import React, { useState ,useEffect} from "react";
import { useQuery } from 'react-query'
import GraphqlHelper from '../../graphql';
import { GET_MY_VIDEOS } from "../../graphql/video";
import Card from 'react-bootstrap/Card';
import './style.scss'
import { Link } from "react-router-dom";
const graphql = new GraphqlHelper()

export default function MyVideo(props: any) {
	const [data, setData] = useState({data:[]})
	useEffect(() => {
		graphql.query(GET_MY_VIDEOS).then((data: any) => {
			return setData(data.myVideos)
		}).catch(error => {

		})
	}, []);

	return (
		<>
			<div className="list-video">
				{
					data?.data.map((item: any, index: number) => {
						return (

							<Card style={{ width: '18rem' }}>
								<Link key={index} to={`/video/${item.id}`}>
									<Card.Img variant="top" src={item.thumbnails[2].url} />
									<Card.Body>
										<Card.Title>{item.title}</Card.Title>
										{/* <Card.Text>
								Some quick example text to build on the card title and make up the
								bulk of the card's content.
							</Card.Text> */}
										{/* <Button variant="primary">Go somewhere</Button> */}
									</Card.Body>
								</Link>
							</Card>



						)
					})
				}

			</div>
		</>
	)
}