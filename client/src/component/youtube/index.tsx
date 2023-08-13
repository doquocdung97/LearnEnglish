import React, { useRef, useState } from 'react';
import './style.scss';
// const { getSubtitles } = require('youtube-captions-scraper');
import { Container, Row, Col, Dropdown, Modal, Button } from 'react-bootstrap';
import YouTubeIframe from 'react-youtube';
import axios from 'axios';
import { Icon } from '../icon';
import { Variables } from '../../constants';
import Test from './Test';
import { Subtitle, Subtitles, WordQuestion } from './utils';
import GraphqlHelper from '../../graphql';
import { SEARCH_DICTIONARY } from '../../graphql/dictionary';
// import captions from '../../data/captions.json';
// getSubtitles({
//   videoID: '8jPQjjsBbIc', // youtube video id
//   lang: 'en' // default: `en`
// }).then((captions:any) => {
//   // console.log(captions);
// 	captions.map((item:any)=>{
// 		console.log(`start: '${item.start}', dur: '${item.dur}', text: '${item.text}'`)
// 	})
// });
const graphql = new GraphqlHelper()
function VideoPlayerTools(props: any) {
	const parent: VideoPlayer = props.parent
	const tongePlayVideo = () => {
		if (parent.state?.playVideo) {
			parent.pause()
		} else {
			parent.play()
		}
	}
	const opRepeat = () => {
		if (parent.state?.indexsub) {
			parent.setRepeat(!parent.state?.repeat)
		}

	}
	return (
		<div className='tools'>
			<button className='btn' onClick={tongePlayVideo}><Icon iconName={parent.state?.playVideo ? 'Pause' : 'Play'} ></Icon></button>
			{
				!parent.props.test && (
					<>
						<button className='btn' onClick={parent.backSub.bind(parent)}><Icon iconName='ArrowLeft'></Icon></button>
						<button className='btn' onClick={parent.nextSub.bind(parent)}><Icon iconName='ArrowRight'></Icon></button>
						<button className='btn' onClick={parent.reloadSub.bind(parent)}><Icon iconName='ArrowClockwise'></Icon></button>
						<button className={`btn ${parent.state?.repeat ? 'active' : String()}`} onClick={opRepeat}><Icon iconName='ArrowRepeat'></Icon></button>
					</>
				)
			}


			<Dropdown>
				<Dropdown.Toggle variant="success">
					Speed {parent.state?.playbackSpeed}
				</Dropdown.Toggle>

				<Dropdown.Menu>
					{
						Variables.PLAYBACKSPEEDS.map((speed: number, index: number) => {
							return <Dropdown.Item key={index} onClick={() => { parent.setState({ playbackSpeed: speed }) }}>Speed {speed}</Dropdown.Item>
						})
					}
				</Dropdown.Menu>
			</Dropdown>
		</div>
	)
}
function WordModal(props: any) {
	const { show, handleClose, word } = props
	const [rowdata, setRowdata] = useState<{
		translate: "",
		phonetics: [{
			text: "",
			audio: ""
		}],
		meanings: [
			{
				type: "",
				definitions: [
					{
						definition: "",
						example: ""
					}
				]
			}
		]
	} | null>(null);
	const onHandleShow = () => {
		setRowdata(null)
		graphql.query(SEARCH_DICTIONARY, { word }).then((data: any) => {
			if (data.searchDictionary.total > 0) {
				setRowdata(data.searchDictionary.data[0])
			}

			// console.log("data",data[0])
		}).catch(error => {

		})
	}
	return (
		<Modal show={show} onHide={handleClose} onShow={onHandleShow} size="lg">
			<Modal.Header closeButton>
				<Modal.Title>{word}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				{
					(rowdata) && (
						<div>
							<div>
								<label>Translate: {rowdata.translate}</label>
							</div>
							<div>

								{
									rowdata.phonetics.map(phonetic => {
										if (phonetic) {
											return phonetic.audio && (
												<>
													<p>text: <strong>{phonetic.text}</strong> <Icon iconName='VolumeUpFill' style={{ "cursor": "pointer" }} onClick={() => {
														let audio = new Audio(phonetic.audio)
														audio.play()
													}}></Icon></p>
													{/* <label>audio: {phonetic.audio}</label> */}
												</>
											)
										}

									})
								}
							</div>
							<div>

								{
									rowdata.meanings.map((meaning: any) => {
										if (meaning && meaning.definitions) {
											return (
												<div className='meaning'>
													<p>type: <strong>{meaning.type}</strong></p>
													{
														meaning?.definitions?.map((item: any) => {
															return (
																<>
																	<p>definitions: <strong>{item.definition}</strong></p>
																	<p>example: <strong>{item.example}</strong></p>
																</>
															)
														})
													}

												</div>
											)
										}

									})
								}
							</div>
						</div>
					)
				}

			</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={handleClose}>
					Close
				</Button>
				<Button variant="primary" onClick={handleClose}>
					Save Changes
				</Button>
			</Modal.Footer>
		</Modal>

	);
}
function SubTitleActive(props: any) {
	const { data, setPause, setPlay, playVideo } = props
	const [show, setShow] = useState(false);
	const [word, setWord] = useState(String());
	const [beforePlayVideo, setBeforePlayVideo] = useState(false);
	const handleShow = (text: string) => {
		setBeforePlayVideo(playVideo)
		setShow(true)
		setWord(text)
		setPause()
	};
	const handleClose = () => {
		setShow(false)
		if (beforePlayVideo)
			setPlay()
	};
	return (
		<>
			<div className="subtitle-active hidden-xs">
				<h4 className='txt-subtitle'>{
					data?.texts.map((text: string, index: number) => {
						return <span key={index} onClick={() => handleShow(text)} >{text}</span>
					})
				}</h4>
			</div>
			<WordModal show={show} word={word} handleClose={handleClose}></WordModal>
		</>
	)
}
function SubTitleItem(props: any) {
	const { data, onActive, parentRef, active, index, test } = props
	const elementRef = useRef(null);
	const current: any = elementRef.current
	// var itemScrollPosition = 0
	// if (current) {
	// 	const scrollPosition = parentRef.current.scrollTop;
	// 	const itemRect = current.getBoundingClientRect();
	// 	itemScrollPosition = itemRect.top + scrollPosition;
	// 	console.log(`List Item top: ${itemRect.top}, Scroll Position: ${itemScrollPosition}`);

	// }
	const getscrollTop = () => {
		var itemScrollPosition = 0
		if (current) {
			const scrollPosition = parentRef.current.scrollTop;
			const itemRect = current.getBoundingClientRect();
			const parentRect = parentRef.current.getBoundingClientRect()

			itemScrollPosition = (itemRect.top - parentRect.top) + scrollPosition;

		}
		return itemScrollPosition
	}
	if (active) {
		let top = getscrollTop()
		// console.log(`Row Top: ${top}`)
		parentRef.current.scrollTo(0, (top - parentRef.current.clientHeight / 2))
	}
	let text = (<p>{data.text}</p>);
	if (test && data.exercise) {
		text = (
			data.exercise.Question?.map((item: WordQuestion, i: number) => {
				if (item.hide) {
					// return <div key={i} className={item.error ? "error" : "active"}><p></p></div>
					if (item.reply) {
						return <div key={i} className={item.error ? "error" : "active"}><p>{item.reply}</p></div>
					}
					return <p className='' key={i}>.......</p>
				} else {
					return <p key={i}>{item.text}</p>
				}
			})
		)
	}
	return (
		<div ref={elementRef} className={`subtitle ${active ? 'active' : String()}`} onClick={() => onActive(index)}>
			<div className='txt'>
				{text}
				{/* <p>{getscrollTop()}</p> */}
				{/* <p>{data.repeat ? 'repeat':'NO'}</p> */}
				{/* <p>{itemScrollPosition}</p> */}
			</div>
			<div className='tools'>
				<button className='btn'><Icon iconName='Stopwatch'></Icon></button>
				<button className='btn'><Icon iconName='ArrowRepeat'></Icon></button>
			</div>

		</div>
	)
}
interface VideoPlayerProps {
	videoId: string
	test: boolean
}
interface VideoPlayerState {
	repeat: boolean
	playVideo: boolean
	input: string
	playbackSpeed: number
	option: any
	model: Subtitles | null
	indexsub: number
}
class VideoPlayer extends React.Component<VideoPlayerProps, VideoPlayerState>{
	_onEvent: any = null;
	playerRef: any
	subtitleRef: any
	constructor(props: any) {
		super(props)
		this.playerRef = React.createRef();
		this.subtitleRef = React.createRef();
		this.state = {
			playVideo: false,
			playbackSpeed: 1,
			input: String(),
			repeat: false,
			model: null,
			indexsub: 0,
			option: {
				height: '390',
				width: '640',
				playerVars: {
					// autoplay: playVideo,
					// start: 90,
					controls: 0,
					rel: 0,
					showinfo: 1,
					mute: 1,
					loop: 0
				}
			}
		}
	}
	componentDidMount() {
		// this.updateVideo("c0S6_6me9r8")
		const videoId = this.props.videoId
		const self = this
		axios.get(`http://localhost:3001/subtitle/en/${videoId}`)
			.then(function (response) {
				// self.setState({ rowData: response.data })
				const model = Subtitles.parse(response.data)
				if (self.props.test && model) {
					model.generateExercise()
				}
				self.setState({ model: model })
				// console.log(response)
				// self.setState({ videoId: videoId })
			})
			.catch(function (error) {
				// handle error
				console.log(error);
			})
		window.addEventListener('resize', this.handleResize.bind(this))
		this.handleResize()
	}
	handleResize() {
		const container = document.querySelector(".youtube-container .video")
		let current: any = this.playerRef.current
		if (container && current) {
			this.setState({
				option: {
					height: (container.clientWidth / 16) * 9,
					width: container.clientWidth,
					playerVars: {
						// autoplay: playVideo,
						// start: 90,
						controls: 0,
						rel: 0,
						showinfo: 1,
						// mute: 1,
						loop: 0
					}
				}
			})
			// console.log(container.clientHeight, container.clientWidth)
		}
	}
	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize.bind(this))
	}
	nextSub() {

		this.onActive(this.state.indexsub + 1)
	}
	backSub() {
		this.onActive(this.state.indexsub - 1)
	}
	reloadSub() {
		this.onActive(this.state.indexsub)
	}
	play() {
		let current: any = this.playerRef.current
		if (current) {
			current.internalPlayer.playVideo();
		}
	}
	pause() {
		let current: any = this.playerRef.current
		if (current) {
			current.internalPlayer.pauseVideo();
		}
	}
	setRepeat(status: boolean = true) {
		this.setState({ repeat: status })
	}
	onReady(event: any) {
		// event.target.playVideo();
		// event.target.setOption('captions', 'track', null)
		const playerElement = event.target.getIframe();
		const titleElement = playerElement.parentNode.querySelector('.ytp-title');
		if (titleElement) {
			titleElement.style.display = 'none';
		}
		this.handleStateChange(event)
		console.log("ready...")
	}
	handleStateChange(event: any) {
		if (this._onEvent) {
			clearInterval(this._onEvent);
		}
		let self = this

		// Start the interval to check the timeline in real-time
		this._onEvent = setInterval(() => {
			// Get the current time (timeline) of the video
			if (!this.state.playVideo) {
				return
			}
			const currentTime = event.target.getCurrentTime();
			// console.log('Current time:', currentTime);
			// console.log(this.state.subCurrent)
			let model = this.state.model
			let subCurrent = model?.data[this.state.indexsub]
			if (subCurrent && ((this.props.test && subCurrent.exercise) || this.state.repeat)) {
				// let endtime = parseFloat(this.state.subCurrent.start.toString()) + parseFloat(this.state.subCurrent.dur.toString())
				// let index = this.state.rowData.indexOf(this.state.subCurrent)
				let endtime = 0;
				let nextitem = model?.data[this.state.indexsub + 1]
				if (nextitem) {
					endtime = nextitem.start
				}
				if (currentTime >= endtime) {
					// let current: any = this.playerRef.current
					// if (current) {
					// 	current.internalPlayer.pauseVideo()
					// }
					// console.log('reload')
					self.updateTime(subCurrent);
				}
			} else {
				let index = this.state.model?.data.findIndex((x: Subtitle) => parseInt(x.start.toString()) === parseInt(currentTime))
				if (index && index >= 0) {
					// self.onActive(data);
					this.setState({ indexsub: index })
				}
			}

			// console.log('Current data:', data);
		}, 500); // Check every 1 second
	}
	updateTime(data: Subtitle) {
		let current: any = this.playerRef.current
		if (current) {
			current.internalPlayer.seekTo(parseInt(data.start.toString()));
			// current.internalPlayer.playVideo();
			// this.setActiveSub(data);
		}
	};
	// setActiveSub(data: RowData) {
	// 	let list: RowData[] = []
	// 	for (let index = 0; index < this.state.rowData.length; index++) {
	// 		const item: RowData = this.state.rowData[index];
	// 		item.active = false;
	// 		list.push(item)
	// 	}
	// 	let index = this.state.rowData.indexOf(data)
	// 	list[index].active = true
	// 	this.setState({ rowData: list })
	// 	this.setState({ subCurrent: data })
	// };
	onActive(index: number) {
		let data = this.state.model?.data[index]
		if (data) {
			this.updateTime(data)
		}
		this.setState({ indexsub: index })
	}
	render(): React.ReactNode {
		let current: any = this.playerRef.current
		if (current) {
			current.internalPlayer.setPlaybackRate(this.state?.playbackSpeed);
		}
		let subCurrent = this.state.model?.data[this.state.indexsub]
		return (
			<>
				<Container>
					<Row>
						<Col md={7}>
							<div className="youtube-container">
								<YouTubeIframe
									className='video'
									ref={this.playerRef}
									opts={this.state.option}
									videoId={this.props?.videoId}
									onReady={this.onReady.bind(this)}

									onPlay={() => { this.setState({ playVideo: true }) }}
									onPause={() => { this.setState({ playVideo: false }) }}

								/>
								<VideoPlayerTools parent={this} />
							</div>
							{
								!this.props.test && (<SubTitleActive data={subCurrent} setPause={this.pause.bind(this)} setPlay={this.play.bind(this)} playVideo={this.state.playVideo} />)
							}

						</Col>
						<Col md={5}>
							<div className='subtitles' ref={this.subtitleRef}>
								{
									this.state?.model?.data.map((item: Subtitle, index: number) => {
										return <SubTitleItem data={item} key={index} index={index} active={this.state.indexsub == index} test={this.props.test} onActive={this.onActive.bind(this)} parentRef={this.subtitleRef} />
									})
								}
							</div>
						</Col>
						{
							this.props.test && (<Test level={3} data={subCurrent} subtitles={this.state.model} next={this.nextSub.bind(this)} />)
						}

					</Row>
				</Container>
			</>
		)
	}
}

function Youtube(props: any) {
	console.log('test')
	return (
		<>
			<VideoPlayer {...props}></VideoPlayer>
		</>
	);
}

export default Youtube;
