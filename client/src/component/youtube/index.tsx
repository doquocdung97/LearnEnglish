import React, { useRef } from 'react';
import './style.scss';
// const { getSubtitles } = require('youtube-captions-scraper');
import { Container, Row, Col, Dropdown } from 'react-bootstrap';
import YouTubeIframe from 'react-youtube';
import axios from 'axios';
import { Icon } from '../icon';
import { Variables } from '../../constants';
import Test from './Test';
import { Subtitles } from './utils';
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
class RowData {
	public start: number = 0;
	public dur: number = 0;
	public text: string = String();
	public active: boolean = false;
	// public reload: boolean = false;
	public repeat: boolean = false;
	// constructor() {
	// 	this.start = 0
	// 	this.dur = 0
	// 	this.text = String()
	// 	this.active = false
	// 	this.reload = false
	// }
}
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
		if (parent.state?.subCurrent){
			parent.setRepeat(parent.state?.subCurrent)
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
						<button className={`btn ${parent.state?.subCurrent?.repeat ? 'active' : String()}`} onClick={opRepeat}><Icon iconName='ArrowRepeat'></Icon></button>
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
function SubTitleActive(props: any) {
	const { data } = props
	return (
		<div className="hidden-xs">
			<h3>{data?.text}</h3>
		</div>
	)
}
function SubTitleItem(props: any) {
	const { data, updateTime, parentRef } = props
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
	if (data.active) {
		let top = getscrollTop()
		// console.log(`Row Top: ${top}`)
		parentRef.current.scrollTo(0, (top - parentRef.current.clientHeight / 2))
	}
	// const onClick = (data: RowData) => {

	// 	updateTime(data)
	// }
	return (
		<div ref={elementRef} className={`subtitle ${data.active ? 'active' : String()}`} onClick={() => updateTime(data)}>
			<div className='txt'>
				<p>{data.text}</p>
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
	subCurrent: RowData | null
	// videoId: string
	rowData: RowData[]
	playVideo: boolean
	input: string
	playbackSpeed: number
	option: any
	model: Subtitles | null

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
			subCurrent: null, rowData: [], playVideo: false, playbackSpeed: 1, input: String(),
			model: null,
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
		axios.get(`http://localhost:3002/subtitle/en/${videoId}`)
			.then(function (response) {
				self.setState({ rowData: response.data })
				const model = Subtitles.parse(response.data)
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

		if (this.state.subCurrent) {
			let index = this.state.rowData.indexOf(this.state.subCurrent)
			this.updateTime(this.state.rowData[index + 1])
		}
	}
	backSub() {
		if (this.state.subCurrent) {
			let index = this.state.rowData.indexOf(this.state.subCurrent)
			if (index > 0) {
				this.updateTime(this.state.rowData[index - 1])
			}

		}
	}
	reloadSub() {
		if (this.state.subCurrent) {
			let index = this.state.rowData.indexOf(this.state.subCurrent)
			if (index > 0) {
				this.updateTime(this.state.rowData[index])
			}

		}
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
	setRepeat(data: RowData) {
		let repeat = data?.repeat
		// console.log(data)
		let list: RowData[] = []
		for (let index = 0; index < this.state.rowData.length; index++) {
			const item: RowData = this.state.rowData[index];
			item.repeat = false;
			list.push(item)
		}
		let index = this.state.rowData.indexOf(data)
		let current = list[index]
		current.repeat = !repeat
		this.setState({ rowData: list })
		this.setState({ subCurrent: current })
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
			if (this.state?.subCurrent && (this.state?.subCurrent.repeat || this.props.test)) {
				// let endtime = parseFloat(this.state.subCurrent.start.toString()) + parseFloat(this.state.subCurrent.dur.toString())
				let index = this.state.rowData.indexOf(this.state.subCurrent)
				let endtime = 0;
				let nextitem = this.state.rowData[index + 1]
				if (nextitem) {
					endtime = nextitem.start
				}
				if (currentTime >= endtime) {
					// let current: any = this.playerRef.current
					// if (current) {
					// 	current.internalPlayer.pauseVideo()
					// }
					// console.log('reload')
					self.updateTime(this.state?.subCurrent);
				}
			} else {
				let data = this.state.rowData.find((x: RowData) => parseInt(x.start.toString()) === parseInt(currentTime))
				if (data) {
					self.setActiveSub(data);
				}
			}

			// console.log('Current data:', data);
		}, 500); // Check every 1 second
	}
	updateTime(data: RowData) {
		let current: any = this.playerRef.current
		if (current) {
			current.internalPlayer.seekTo(parseInt(data.start.toString()));
			current.internalPlayer.playVideo();
			this.setActiveSub(data);
		}
	};
	setActiveSub(data: RowData) {
		let list: RowData[] = []
		for (let index = 0; index < this.state.rowData.length; index++) {
			const item: RowData = this.state.rowData[index];
			item.active = false;
			list.push(item)
		}
		let index = this.state.rowData.indexOf(data)
		list[index].active = true
		this.setState({ rowData: list })
		this.setState({ subCurrent: data })
	};

	render(): React.ReactNode {
		let current: any = this.playerRef.current
		if (current) {
			current.internalPlayer.setPlaybackRate(this.state?.playbackSpeed);
		}
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
								!this.props.test && (<SubTitleActive data={this.state?.subCurrent} />)
							}

						</Col>
						<Col md={5}>
							<div className='subtitles' ref={this.subtitleRef}>
								{
									this.state?.rowData.map((item: RowData, index: number) => {
										return <SubTitleItem data={item} key={index} updateTime={this.updateTime.bind(this)} parentRef={this.subtitleRef} />
									})
								}
							</div>
						</Col>
						{
							this.props.test && (<Test level={2} data={this.state.subCurrent} subtitles={this.state.model} next={this.nextSub.bind(this)} />)
						}

					</Row>
				</Container>
			</>
		)
	}
}

function Youtube(props: any) {
	return (
		<>
			<VideoPlayer {...props}></VideoPlayer>
		</>
	);
}

export default Youtube;
