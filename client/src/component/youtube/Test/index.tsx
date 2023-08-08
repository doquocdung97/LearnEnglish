import React, { useState, useEffect } from "react";
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

function ObjectiveTest(props: any) {
	const { data, next } = props
	const Subtitles: Subtitles = props?.subtitles
	const [exercise, setExercise] = useState<Exercise | null>(null)
	const [autoSubmit, setAutoSubmit] = useState(true)
	const [update, setUpdate] = useState(new Date())
	useEffect(() => {
		setExercise(Subtitles?.getExercise(data,2))
	}, [data]);
	const onSelect = (option: WordOption) => {
		exercise?.addReply(option)
		setUpdate(new Date())
		if(exercise && autoSubmit && exercise.isSend){
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
		if(exercise && autoSubmit && exercise.isSend){
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

function SubjectiveTest(props: any) {
	const { data, next } = props
	const Subtitles: Subtitles = props?.subtitles
	const [exercise, setExercise] = useState<Exercise | null>(null)
	const [autoSubmit, setAutoSubmit] = useState(true)
	const [update, setUpdate] = useState(new Date())
	useEffect(() => {
		setExercise(Subtitles?.getExercise(data))
	}, [data]);
	const onSelect = (option: WordOption) => {
		exercise?.addReply(option)
		setUpdate(new Date())
		if(exercise && autoSubmit && exercise.isSend){
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
		if(exercise && autoSubmit && exercise.isSend){
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

function ListeningTest(props: any) {
	const { data } = props
	return (
		<>
			<h2>ListeningTest</h2>
		</>
	)
}
const Level = [
	Watching,
	ObjectiveTest,
	SubjectiveTest,
	ListeningTest
]
export default function Test(props: any) {
	const { data, level } = props
	var TextLevel = Watching
	if (Level[level]) {
		TextLevel = Level[level]
	}
	return (
		<>
		<h1>{level}</h1>
			<TextLevel {...props}></TextLevel>
		</>
	)
}