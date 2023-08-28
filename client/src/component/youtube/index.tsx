import React, { useRef, useState } from 'react';
import './style.scss';
// const { getSubtitles } = require('youtube-captions-scraper');
import { Container, Row, Col, Dropdown, Modal, Button, Tab, Tabs } from 'react-bootstrap';
// import Tab from 'react-bootstrap/Tab';
// import Tabs from 'react-bootstrap/Tabs';
import YouTubeIframe from 'react-youtube';
import axios from 'axios';
import { Icon } from '../icon';
import { Variables } from '../../constants';
import Test from './Test';
import { Subtitle, Subtitles as SubtitlesModel, WordQuestion } from './utils';
import GraphqlHelper from '../../graphql';
import { DICTIONARYVIDEOS, CREATE_DICTIONARYVIDEO, SEARCH_DICTIONARY } from '../../graphql/dictionary';
import { Dictionary } from '../dictionary';
import { Subtitles } from './Subtitle';
import { VIDEO_DETAIL } from '../../graphql/video';
import { DictionaryModel } from '../dictionary/utils';
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
	const { show, handleClose, word, onHandleSave } = props
	const [rowdata, setRowdata] = useState<{
		translate: "",
		phonetic: {
			text: "",
			audio: ""
		},
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
			if (data.searchDictionary.data.length > 0) {
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
									(rowdata.phonetic && rowdata.phonetic.audio) && (
										<>
											<p>text: <strong>{rowdata.phonetic.text}</strong> <Icon iconName='VolumeUpFill' style={{ "cursor": "pointer" }} onClick={() => {
												let audio = new Audio(rowdata.phonetic.audio)
												audio.play()
											}}></Icon></p>
											{/* <label>audio: {phonetic.audio}</label> */}
										</>
									)
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
				<Button variant="primary" onClick={onHandleSave}>
					Save Changes
				</Button>
			</Modal.Footer>
		</Modal>

	);
}
function SubTitleActive(props: any) {
	const { data, setPause, setPlay, playVideo, videoId, dictionaryRef } = props
	const [show, setShow] = useState(false);
	const [word, setWord] = useState(String());
	const [beforePlayVideo, setBeforePlayVideo] = useState(false);
	const handleShow = (text: string) => {
		setBeforePlayVideo(playVideo)
		setShow(true)
		let wordrepeat = text
		wordrepeat = wordrepeat.replace(/[!.,?]/g, String())
		setWord(wordrepeat)
		setPause()
	};
	const handleClose = () => {
		setShow(false)
		if (beforePlayVideo)
			setPlay()
	};
	const onHandleSave = () => {
		graphql.query(CREATE_DICTIONARYVIDEO, {
			"videoId": videoId,
			"word": word,
			"start": parseFloat(data.start),
			"dur": parseFloat(data.dur)
		}).then((data: any) => {
			let result = data?.createDictionaryByVideo
			if (result && result.success) {
				handleClose()
				var dictionary = new DictionaryModel()
				dictionary.id = result.data.id
				dictionary.level = result.data.level
				dictionary.word = result.data.word
				dictionary.start = result.data.start
				dictionary.dur = result.data.dur
				dictionaryRef.current?.create(dictionary)
			}

		})
	}
	return (
		<>
			<div className="subtitle-active hidden-xs">
				<h4 className='txt-subtitle'>{
					data?.texts.map((text: string, index: number) => {
						return <span key={index} onClick={() => handleShow(text)} >{text}</span>
					})
				}</h4>
			</div>
			<WordModal show={show} word={word} handleClose={handleClose} onHandleSave={onHandleSave}></WordModal>
		</>
	)
}
interface VideoPlayerProps {
	videoId: string | undefined
	test?: boolean
	level?: number 
	onReady?: (event: SubtitlesModel) => void;
}
interface VideoPlayerState {
	repeat: boolean
	playVideo: boolean
	input: string
	playbackSpeed: number
	option: any
	model: SubtitlesModel | null
	indexsub: number
}

class VideoPlayer extends React.Component<VideoPlayerProps, VideoPlayerState>{
	_onEvent: any = null;
	playerRef: any
	subtitleRef: any
	dictionaryRef: any
	constructor(props: any) {
		super(props)
		this.playerRef = React.createRef();
		this.subtitleRef = React.createRef();
		this.dictionaryRef = React.createRef();
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
		this.fetch()
		window.addEventListener('resize', this.handleResize.bind(this))
		this.handleResize()
	}
	async fetch() {
		const videoId = this.props.videoId
		const self = this
		graphql.query(VIDEO_DETAIL, { videoId: videoId }).then(async (data: any) => {
			const result = data?.video
			if (result) {
				const model = SubtitlesModel.parse(result.subtitles)
				// if (self.props.test && model) {
				// 	model.generateExercise()
				// }

				if (self.props.onReady && model) {
					await self.props.onReady(model)
				} else if (self.props.test && model) {
					var worknumber = 0
					if(this.props.level == 1){
						worknumber = 2
					}else if(this.props.level == 3){
						worknumber = 2
					}
					model.generateExercise(worknumber)
				}
				self.setState({ model: model })
			}

		}).catch(function (error) {
			// handle error
			console.log(error);
		})
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
								!this.props.test && (<SubTitleActive dictionaryRef={this.dictionaryRef} data={subCurrent} setPause={this.pause.bind(this)} setPlay={this.play.bind(this)} playVideo={this.state.playVideo} videoId={this.props.videoId} />)
							}

						</Col>
						<Col md={5}>
							<Tabs
								defaultActiveKey="dictionary"
							>
								<Tab eventKey="subtitle" title="Subtitle">
									<Subtitles data={this.state.model?.data} indexsub={this.state.indexsub} test={this.props.test} onActive={this.onActive.bind(this)}></Subtitles>
								</Tab>
								<Tab eventKey="dictionary" title="Dictionary">
									<Dictionary ref={this.dictionaryRef} videoId={this.props.videoId} model={this.state.model}></Dictionary>
								</Tab>
							</Tabs>

						</Col>
						{
							this.props.test && (<Test level={this.props.level} data={subCurrent} subtitles={this.state.model} next={this.nextSub.bind(this)} />)
						}

					</Row>
				</Container>
			</>
		)
	}
}

// function Youtube(props: any) {
// 	return (<VideoPlayer {...props}></VideoPlayer>);
// }

export default VideoPlayer;
