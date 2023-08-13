import React, { useState, useEffect, useRef, MutableRefObject } from "react";
import { Stack, Badge, Button } from 'react-bootstrap';
import './style.scss'
import { Exercise, Subtitles, WordOption, WordQuestion } from "../utils";
function Watching(props: any) {
	return (
		<>
			<h2>Watching</h2>
		</>
	)
}

function Level1(props: any) {
	const { data, next } = props
	const Subtitles: Subtitles = props?.subtitles
	const [exercise, setExercise] = useState<Exercise | null>(null)
	const [autoSubmit, setAutoSubmit] = useState(true)
	const [update, setUpdate] = useState(new Date())
	useEffect(() => {
		setExercise(Subtitles?.getExercise(data, 2))
	}, [data]);
	const onSelect = (option: WordOption) => {
		exercise?.addReply(option)
		setUpdate(new Date())
		if (exercise && autoSubmit && exercise.isSend) {
			onCheckAnswer()
		}
	}
	const onRemoveSelect = (data: WordQuestion) => {
		exercise?.removeReply(data)
		setUpdate(new Date())
	}
	const onCheckAnswer = () => {
		setUpdate(new Date())
		if (exercise?.checkAnswer()) {
			next()
		}
	}
	const onSuggest = () => {
		exercise?.suggest()
		setUpdate(new Date())
		if (exercise && autoSubmit && exercise.isSend) {
			onCheckAnswer()
		}
	}
	let issend = exercise?.isSend
	if (data && data.text) {
		// const exercise = new Exercise(data.text)
		return (
			<>
				<div className="objective-test">
					<div className="question">
						{
							exercise?.Question.map((item: WordQuestion, index) => {
								if (item.hide) {
									if (item.reply) {
										return <button key={index} className={item.error ? "error" : "active"} onClick={() => onRemoveSelect(item)}><p>{item.reply}</p></button>
									}
									return <div key={index} className="hide"><p></p></div>

								} else {
									return <p key={index}>{item.text}</p>
								}
							})
						}
					</div>
					<Stack className="answer" direction="horizontal" gap={2}>
						{
							exercise?.Options.map((option, index) => {
								return !option.hide && <Button disabled={issend} key={index} onClick={() => onSelect(option)}>{option.text}</Button>
							})
						}
					</Stack>
					{
						<div className="btn-box" >
							<Stack className="answer" direction="horizontal" gap={2}>
								<Button disabled={issend} onClick={next} variant="danger">Pass</Button>
								<Button disabled={issend} onClick={onSuggest} variant="warning">Suggest</Button>
								{

									!autoSubmit && (
										<Button disabled={!issend} onClick={onCheckAnswer}>Submit</Button>
									)
								}
							</Stack>
						</div>
					}

				</div>
			</>
		)
	}
	return (<>Loading</>)
}

function Level2(props: any) {
	const { data, next } = props
	const Subtitles: Subtitles = props?.subtitles
	const [exercise, setExercise] = useState<Exercise>(data.exercise)
	const [autoSubmit, setAutoSubmit] = useState(true)
	const [update, setUpdate] = useState(new Date())
	// useEffect(() => {
	// 	setExercise(Subtitles?.getExercise(data))
	// }, [data]);
	const onSelect = (option: WordOption) => {
		exercise?.addReply(option)
		setUpdate(new Date())
		if (exercise && autoSubmit && exercise.isSend) {
			onCheckAnswer()
		}
	}
	const onRemoveSelect = (data: WordQuestion) => {
		exercise?.removeReply(data)
		setUpdate(new Date())
	}
	const onCheckAnswer = () => {
		setUpdate(new Date())
		if (exercise?.checkAnswer()) {
			next()
		}
	}
	const onSuggest = () => {
		exercise?.suggest()
		setUpdate(new Date())
		if (exercise && autoSubmit && exercise.isSend) {
			onCheckAnswer()
		}
	}
	let issend = exercise?.isSend
	if (data && data.text) {
		// const exercise = new Exercise(data.text)
		return (
			<>
				<div className="objective-test">
					<div className="question">
						{
							exercise?.Question.map((item: WordQuestion, index) => {
								if (item.hide) {
									if (item.reply) {
										return <button key={index} className={item.error ? "error" : "active"} onClick={() => onRemoveSelect(item)}><p>{item.reply}</p></button>
									}
									return <div key={index} className="hide"><p></p></div>

								} else {
									return <p key={index}>{item.text}</p>
								}
							})
						}
					</div>
					<Stack className="answer" direction="horizontal" gap={2}>
						{
							exercise?.Options.map((option, index) => {
								return !option.hide && <Button disabled={issend} key={index} onClick={() => onSelect(option)}>{option.text}</Button>
							})
						}
					</Stack>
					{
						<div className="btn-box" >
							<Stack className="answer" direction="horizontal" gap={2}>
								<Button disabled={issend} onClick={next} variant="danger">Pass</Button>
								<Button disabled={issend} onClick={onSuggest} variant="warning">Suggest</Button>
								{

									!autoSubmit && (
										<Button disabled={!issend} onClick={onCheckAnswer}>Submit</Button>
									)
								}
							</Stack>
						</div>
					}

				</div>
			</>
		)
	}
	return (<>Loading</>)
}

function Level3(props: any) {
	const { data, next } = props
	const Subtitles: Subtitles = props?.subtitles
	// const [exercise, setExercise] = useState<Exercise | null>(null)
	const [autoSubmit, setAutoSubmit] = useState(true)
	const [update, setUpdate] = useState(new Date())
	const inputRef = useRef();
	const inputRefs: MutableRefObject<HTMLInputElement[]> = useRef([]); // Initialize with an empty array
	let exercise = data?.exercise
	const onCheckAnswer = () => {
		setUpdate(new Date())
		if (exercise?.checkAnswer()) {
			next()
		}
	}
	const onSuggest = () => {
		exercise?.suggest()
		setUpdate(new Date())
		if (exercise && autoSubmit && exercise.isSend) {
			onCheckAnswer()
		}
	}
	const handleKeyDown = (event:any) => {
		if (event.key === 'Enter' || event.key === ' ') {
			let target: HTMLInputElement = event.target as HTMLInputElement
			let index = target.getAttribute('data-index')
			if (index != null) {
				let i = parseInt(index)
				if ((exercise.Answer.length - 1) > i) {
					inputRefs.current[i + 1].focus()
				} else {
					onCheckAnswer()
				}
			}

		}else if(event.key==="Backspace"){
			let target: HTMLInputElement = event.target as HTMLInputElement
			let index = target.getAttribute('data-index')
			if (index != null && target.value.length <=0) {
				let i = parseInt(index)
				let inputforware = inputRefs.current[i - 1]
				if (i > 0 && inputforware) {
					inputforware.focus()
				}
			}
		}

  };

	useEffect(() => {
		inputRefs.current = []
	}, [data]);
	let issend = exercise?.isSend
	if (data && data.text) {
		// const exercise = new Exercise(data.text)
		let tabindex = 0
		return (
			<>
				<div className="objective-test">
					<div className="question">
						{
							exercise?.Question.map((item: WordQuestion, index: number) => {
								if (item.hide) {
									let html = <input ref={el => {
										let index = el?.getAttribute('data-index')
										if (el && index != null) {
											let isnew = true
											if (inputRefs.current[parseInt(index)]) {
												isnew = false
											}
											inputRefs.current[parseInt(index)] = el
											if (isnew && parseInt(index)) {
												inputRefs.current[0].focus()
											}
										}

									}}
										onKeyDown={handleKeyDown}
										onChange={e => {
											item.reply = e.target.value
											setUpdate(new Date())
										}}
										value={item.reply != null ? item.reply.trim() : String()}
										key={index}
										data-index={tabindex}
										type="text"
										className={item.error ? "error" : String()} />
									tabindex++;
									// console.log(tabindex, inputRefs)
									return html
								} else {
									return <p key={index}>{item.text}</p>
								}
							})
						}
					</div>
					{
						<div className="btn-box" >
							<Stack className="answer" direction="horizontal" gap={2}>
								<Button disabled={issend} onClick={next} variant="danger">Pass</Button>
								<Button disabled={issend} onClick={onSuggest} variant="warning">Suggest</Button>
								{

									!autoSubmit && (
										<Button disabled={!issend} onClick={onCheckAnswer}>Submit</Button>
									)
								}
							</Stack>
						</div>
					}

				</div>
			</>
		)
	}
	return (<>Loading</>)
}
const Level = [
	Watching,
	Level1,
	Level2,
	Level3
]
export default function Test(props: any) {
	const { data, level } = props
	var TextLevel = Watching
	if (Level[level]) {
		TextLevel = Level[level]
	}
	return (
		<>
			{/* <h1>{level}</h1> */}
			<TextLevel {...props}></TextLevel>
		</>
	)
}