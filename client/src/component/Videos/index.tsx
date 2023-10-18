import { Card, Col, Row } from 'react-bootstrap';
import './style.scss';
import { Link } from 'react-router-dom';
import { Icon } from '../icon';
export function Videos(props: any) {
	const { data, isLoading } = props
	const data_example = [1,2,3,4,5,6].map(e=>{return {id:e}})
	const rowdatas = isLoading ? data_example : data
	return (
		<>
			<Row className="list-video">
				{
					rowdatas?.map((item: any, index: number) => {
						return (
							<Col xs={6} md={4} key={index}>
								{
									!isLoading ? (
										<Card className="video">
											<Link key={index} to={`/video/${item.id}`}>
												<Card.Img variant="top" src={item.thumbnails[2].url} />
												<Card.Body>
													<Card.Title className="title">{item.title}</Card.Title>
												</Card.Body>
											</Link>
										</Card>
									) : (
										<Card className="video placeholder-glow">

											<div className='card-img loading'>
												<img className="card-img-top placeholder" src="/assets/image/video-card.png" alt='' />
												<div className='icon'>
													<Icon iconName='PlayBtn' size={50}></Icon>
												</div>
											</div>
											{/* <div className='card-img-top placeholder' style={{height:360}}></div> */}
											<Card.Body>
												<Card.Title className="title">
													<label className="placeholder title-1"></label>
													<label className="placeholder title-2"></label>
												</Card.Title>
												{/* <Placeholder as={Card.Title} animation="glow">
												<Placeholder xs={12} />
													<Placeholder xs={6} />
												</Placeholder> */}
											</Card.Body>
											{/* <Placeholder as={Card.Text} animation="glow">
											<Placeholder xs={7} /> <Placeholder xs={4} /> <Placeholder xs={4} />{' '}
											<Placeholder xs={6} /> <Placeholder xs={8} />
										</Placeholder> */}
										</Card>
									)
								}
							</Col>
						)
					})
				}

			</Row>
		</>
	)
}