import React, { useState, useEffect, useRef } from "react"
import './style.scss';
import Youtube from "../../youtube";
import { useParams } from 'react-router-dom';
import GraphqlHelper from "../../../graphql";
import { DICTIONARYVIDEOS, LEAN_DICTIONARYVIDEOS } from "../../../graphql/dictionary";

import ProgressBar from 'react-bootstrap/ProgressBar';
import { DictionaryModel } from "../utils";
import { Button } from "react-bootstrap";
import { Icon } from "../../icon";
import { getRandom, getRandomNumber, randomSort } from "../../../common/utils";
import Translate from "../../Translate";
import { useHotkeys } from 'react-hotkeys-hook';


class HandleExersiceDictionary {
	rowDatas: Dictionary[]
	words: string[] = []
	constructor() {
		this.rowDatas = []
	}
	static parse(obj: any) {
		const model = new HandleExersiceDictionary()
		model.rowDatas = obj
		model.rowDatas.map(item => {
			let exercise = new ExersiceDictionaryTranslate()
			exercise.question = item.detail?.translate
			exercise.answer = item.detail?.word
			const words = model.rowDatas.map(x => x.detail?.word)
			const options: OptionDictionary[] = []
			const option = new OptionDictionary()
			option.text = item.detail?.word
			options.push(option)
			if (model.rowDatas.length >= 4) {
				while (options.length < 4) {
					let random = getRandomNumber(0, words.length - 1)
					let word = words[random]
					if ((options.find(x => x.text != word)) && word) {
						const option = new OptionDictionary()
						option.text = word
						options.push(option)
					}
				}
			}
			exercise.options = randomSort(options)
			item.exersice = exercise
			// if(item.level ==0){

			// }
		})
		return model
	}
	random() {
		this.rowDatas = randomSort(this.rowDatas)
	}
}
export class OptionDictionary {
	text: string = String()
	error: boolean = false;

}
class ExersiceDictionary {
	question: string = String()
	options: OptionDictionary[] = []
	answer: string = String()
	countError: number = 0
}
class ExersiceDictionaryWrite extends ExersiceDictionary {
}
class ExersiceDictionaryTranslate extends ExersiceDictionary {
}
class ExersiceDictionaryListening extends ExersiceDictionary {
}

class Dictionary extends DictionaryModel {
	complete: boolean = false
	exersice: ExersiceDictionaryTranslate | ExersiceDictionaryListening | ExersiceDictionaryWrite | null = null
	// constructor() {
	//     super()
	//     this.exersice = new ExersiceDictionary()
	// }
}
const graphql = new GraphqlHelper()
function Level1(props: any) {
	const { id } = props
	const [indexCurrent, setIndexCurrent] = useState(0)
	const [selectOption, setSelectOption] = useState(0)
	const [hasReply, setHasReply] = useState(false)
	const [answerError, setAnswerError] = useState(false)
	const [model, setModel] = useState<HandleExersiceDictionary>()
	var option = {
		pageCount: 10
	}
	useHotkeys('1,2,3,4', (e) => {
		const index = parseInt(e.key)
		if (index >= 0 && index <= 4) {
			onSelectOption(index)
		}
	})


	const fetch = async (page: number = 1) => {
		if (page > 1 && page >= option.pageCount) {
			return
		}
		const query: any = await graphql.query(LEAN_DICTIONARYVIDEOS, {
			videoId: id,
			size: 10,
			random: true
		})
		const result = query?.LeanDictionaryByVideo
		if (result?.length > 0) {
			// console.log(result?.data)
			const model = HandleExersiceDictionary.parse(result)
			setModel(model)
			// const pagination = Object.assign({}, this.state.pagination)
			// pagination.page = page
			// pagination.pageCount = result.pagination.pageCount
			// this.setState({ rowDatas: [...this.state ? this.state.rowDatas : [], ...result.data], pagination: pagination })
		}
	}
	const next = async () => {
		var index = indexCurrent
		const rowDatas = model?.rowDatas
		if (rowDatas) {
			var count = rowDatas.length
			while (count > 0) {
				index++
				if (index >= rowDatas.length) {
					index = 0
				}
				if (!rowDatas[index]?.complete) {
					break
				}
				count--
			}
			setIndexCurrent(index)
			setSelectOption(0)
			setHasReply(false)
			setAnswerError(false)
		}
	}
	const onSelectOption = async (index: number) => {
		if (hasReply) {
			return
		}
		setSelectOption(index)
	}
	const forgot = async () => {
		relay()
	}
	const relay = async () => {
		const rowDatas = model?.rowDatas
		if (hasReply) {
			if (rowDatas && rowDatas[indexCurrent].exersice) {
				const exersice = rowDatas[indexCurrent].exersice
				exersice?.options.map(option => {
					option.error = false
				})
			}
			next()
			return
		}

		if (rowDatas && rowDatas[indexCurrent].exersice) {
			const exersice = rowDatas[indexCurrent].exersice
			const answer = exersice?.options[selectOption - 1]
			const phonetic = rowDatas[indexCurrent].detail.phonetic
			if (phonetic) {
				const audio = new Audio(phonetic.audio)
				audio.play()
			}
			if (answer?.text === exersice?.answer) {
				rowDatas[indexCurrent].complete = true
			} else {
				if (answer) {
					answer.error = true
				}
				if (exersice) {
					const option = exersice.options.find(x => x.text === exersice?.answer)
					if (option) {
						const index = exersice?.options.indexOf(option)
						if (index != undefined) {
							onSelectOption(index + 1)
						}

					}
					exersice.countError++;
				}
				setAnswerError(true)
			}
		}
		setHasReply(true)
	}
	const learnAgain = () => {
		const rowDatas = model?.rowDatas
		if (rowDatas) {
			rowDatas.map(item => {
				item.complete = false
			})
		}
		model?.random()
		setIndexCurrent(0)
		setHasReply(false)
		setAnswerError(false)
		setSelectOption(0)
	}
	const learnMore = () => {
		fetch()
		setIndexCurrent(0)
		setHasReply(false)
		setAnswerError(false)
		setSelectOption(0)
	}
	useEffect(() => {
		fetch()
	}, [id]);
	var rowDatas: Dictionary[] = []
	if (model?.rowDatas) {
		rowDatas = model?.rowDatas
	}
	const rowData = rowDatas ? rowDatas[indexCurrent] : null
	const percent_complete = rowDatas ? ((rowDatas.length - rowDatas.filter(x => !x.complete).length) / rowDatas.length) * 100 : 0

	useHotkeys('Enter', (e) => {
		if (percent_complete >= 100) {
			learnMore()
			return
		}
		if (selectOption > 0) {
			relay()
		}
	})
	if (rowData) {
		const phonetic = rowData.detail?.phonetic
		return (
			<>

				<div className="dictionary-exercise">
					<ProgressBar now={percent_complete} label={`${(percent_complete)}%`} />
					{

						rowData.exersice && (
							<>
								<div className="question">{rowData.exersice.question}</div>
								<div className="answer-vs-options">
									{
										!hasReply && (
											<div className="options">
												{
													rowData.exersice.options.map((option, index: number) => {
														let status = String()
														if (option.error) {
															status = "error"
														} else if ((index + 1) === selectOption) {
															status = "active"
														}
														return <Button onClick={() => onSelectOption(index + 1)} variant="secondary" className={status}>{option.text}</Button>
													})
												}
											</div>
										)
									}
									{
										hasReply && (
											<>
												<div className={`answer ${answerError ? "error" : String()}`}>
													<div className="word">Word: {rowData.detail?.word}</div>
													{
														phonetic && phonetic.audio && (
															<>
																<div className="spelling">
																	Spelling:
																	<strong>{phonetic.text}</strong>
																	<Icon iconName='VolumeUpFill' style={{ "cursor": "pointer" }} onClick={() => {
																		let audio = new Audio(phonetic.audio)
																		audio.play()
																	}}></Icon>
																</div>
															</>
														)
													}
													<div className="traslate">Traslate: {rowData.detail?.translate}</div>
													<div className="meanings">
														{
															rowData.detail?.meanings.map(item => {
																return (
																	<>
																		<div className="list">
																			{item.definitions.map(j => {
																				return (
																					<div className="definitions">
																						<div className="definition">definition: <Translate text={j.definition}></Translate></div>
																						<div className="example">example: <Translate text={j.example}></Translate></div>
																					</div>
																				)
																			})}
																		</div>
																	</>)
															})
														}

													</div>
												</div>
											</>
										)
									}
								</div>

							</>
						)
					}

					<div className="tools">
						<div className="container">
							{
								(percent_complete >= 100) && <>
									<Button variant="warning" onClick={learnAgain}>Learn again</Button>
									<Button variant="success" onClick={learnMore}>Learn more</Button>
								</>
							}
							{
								(percent_complete < 100) && <>
									<Button variant="warning" disabled={hasReply} onClick={forgot}>forgot the answer</Button>
									<Button variant="success" disabled={selectOption === 0} onClick={relay}>{`${hasReply ? "Continue" : "Reply"}`}</Button>

								</>
							}
						</div>
					</div>
				</div>
			</>
		)
	}
	return (<>Loading...</>)
}
function Level2(props: any) {
	const { id } = props
	const [indexCurrent, setIndexCurrent] = useState(0)
	const [inputValue, setInputValue] = useState(String())
	const [hasReply, setHasReply] = useState(false)
	const [answerError, setAnswerError] = useState(false)
	const [model, setModel] = useState<HandleExersiceDictionary>()
	const inputRef = useRef(null);
	const buttonRef = useRef(null);
	var option = {
		pageCount: 10
	}
	const fetch = async (page: number = 1) => {
		if (page > 1 && page >= option.pageCount) {
			return
		}
		const query: any = await graphql.query(LEAN_DICTIONARYVIDEOS, {
			videoId: id,
			size: 10,
			random: true
		})
		const result = query?.LeanDictionaryByVideo
		if (result?.length > 0) {
			// console.log(result?.data)
			const model = HandleExersiceDictionary.parse(result)
			setModel(model)
			// const pagination = Object.assign({}, this.state.pagination)
			// pagination.page = page
			// pagination.pageCount = result.pagination.pageCount
			// this.setState({ rowDatas: [...this.state ? this.state.rowDatas : [], ...result.data], pagination: pagination })
		}
	}

	const next = async () => {
		var index = indexCurrent
		const rowDatas = model?.rowDatas
		if (rowDatas) {
			var count = rowDatas.length
			while (count > 0) {
				index++
				if (index >= rowDatas.length) {
					index = 0
				}
				if (!rowDatas[index]?.complete) {
					break
				}
				count--
			}
			setIndexCurrent(index)
			setHasReply(false)
		}
		setInputValue(String())
		setAnswerError(false)
	}
	const forgot = async () => {
		relay()
	}
	useHotkeys('Enter', (e) => {
		relay()
	})
	const onhandleKeyDown = async (event: any) => {
		if (event.keyCode === 13) {
			relay()
		}
	}
	const relay = async () => {
		const rowDatas = model?.rowDatas
		if (hasReply) {
			if (rowDatas && rowDatas[indexCurrent].exersice) {
				const exersice = rowDatas[indexCurrent].exersice
				exersice?.options.map(option => {
					option.error = false
				})
			}
			next()
			return
		}

		if (rowDatas && rowDatas[indexCurrent].exersice) {
			const phonetic = rowDatas[indexCurrent].detail.phonetic
			if (phonetic) {
				const audio = new Audio(phonetic.audio)
				audio.play()
			}
			const exersice = rowDatas[indexCurrent].exersice
			if (inputValue === exersice?.answer) {
				rowDatas[indexCurrent].complete = true

			} else {
				setAnswerError(true)
				if (exersice) {
					exersice.countError++;
				}
			}
			// console.log(buttonRef.current)
			// const current:any = buttonRef.current
			// if (current){
			//     current.focus()
			// }

		}
		setHasReply(true)
	}
	const learnAgain = () => {
		const rowDatas = model?.rowDatas
		if (rowDatas) {
			rowDatas.map(item => {
				item.complete = false
			})
		}
		model?.random()
		setIndexCurrent(0)
		setHasReply(false)
		setInputValue(String())
		setAnswerError(false)
	}
	const learnMore = () => {
		fetch()
		setIndexCurrent(0)
		setHasReply(false)
		setInputValue(String())
		setAnswerError(false)
	}
	useEffect(() => {
		fetch()
		// const onEnterNext = (event: any) => {
		//     if (event.keyCode === 13 && document.querySelector('.dictionary-exercise .answer')) {
		//         next()
		//     }
		// }
		// document.addEventListener('keydown',function(event){
		//         if (event.keyCode === 13 && document.querySelector('.dictionary-exercise .answer')) {
		//             next()
		//         }
		// })
		// return document.removeEventListener('keydown',onEnterNext)
	}, [id]);
	var rowDatas: Dictionary[] = []
	if (model?.rowDatas) {
		rowDatas = model?.rowDatas
	}
	const rowData = rowDatas ? rowDatas[indexCurrent] : null
	if (rowData) {
		const percent_complete = ((rowDatas.length - rowDatas.filter(x => !x.complete).length) / rowDatas.length) * 100
		const phonetic = rowData.detail?.phonetic
		// var data:string[] = []
		// if(rowData.exersice){
		//     data = [...rowData.exersice.answer]
		// }

		return (
			<>
				<div className="dictionary-exercise">
				<ProgressBar now={percent_complete} label={`${(percent_complete)}%`} />
					{
						rowData.exersice && (
							<>
								<div className="question">{rowData.exersice.question}

									{
										phonetic && phonetic.audio && (
											<>
												<div className="spelling">
													<strong>{phonetic.text}</strong>
													<Icon iconName='VolumeUpFill' style={{ "cursor": "pointer" }} onClick={() => {
														let audio = new Audio(phonetic.audio)
														audio.play()
													}}></Icon>
												</div>
											</>
										)
									}
								</div>
								<div className="answer-vs-input-answer">
									{
										!hasReply && (
											<div className="input-answer">
												<input ref={inputRef} onKeyDown={onhandleKeyDown} onChange={(e) => setInputValue(e.target.value)} autoFocus={true} />
											</div>
										)
									}
									{
										hasReply && (
											<>
												<div className={`answer ${answerError ? "error" : String()}`}>
													<div className="word">Word: {rowData.detail?.word}</div>
													{
														phonetic && phonetic.audio && (
															<>
																<div className="spelling">
																	Spelling:
																	<strong>{phonetic.text}</strong>
																	<Icon iconName='VolumeUpFill' style={{ "cursor": "pointer" }} onClick={() => {
																		let audio = new Audio(phonetic.audio)
																		audio.play()
																	}}></Icon>
																</div>
															</>
														)
													}
													<div className="traslate">Traslate: {rowData.detail?.translate}</div>
													<div className="meanings">
														{
															rowData.detail?.meanings.map(item => {
																return (
																	<>
																		<div className="list">
																			{item.definitions.map((j, index) => {
																				return (
																					<div key={index} className="definitions">
																						<div className="definition">definition: <Translate text={j.definition}></Translate></div>
																						<div className="example">example: <Translate text={j.example}></Translate></div>
																					</div>
																				)
																			})}
																		</div>
																	</>)
															})
														}

													</div>
												</div>
											</>
										)
									}
								</div>

							</>
						)
					}

					<div className="tools">
						<div className="container">
							{
								(percent_complete >= 100) && <>
									<Button variant="warning" onClick={learnAgain}>Learn again</Button>
									<Button variant="success" onClick={learnMore}>Learn more</Button>
								</>
							}
							{
								(percent_complete < 100) && <>
									<Button variant="warning" disabled={hasReply} onClick={forgot}>forgot the answer</Button>
									<Button ref={buttonRef} variant="success" onClick={relay}>{`${hasReply ? "Continue" : "Reply"}`}</Button>

								</>
							}

						</div>
					</div>
				</div>
			</>
		)
	}
	return (<>Loading...</>)
}
function Level3(props: any) {
	const { id } = props
	return (<Youtube videoId={id} test={2} level={1} onReady={async (model) => {
		const query: any = await graphql.query(DICTIONARYVIDEOS, {
			videoId: id,
			pagination: {
				page: 1,
				pageSize: 1000
			}
		})
		const result = query?.dictionaryByVideo
		if (result?.data.length > 0) {
			model?.generateExerciseDictionary(result.data)
		}
	}} />)
}
export const Levels = [
	Level1,
	Level2,
	Level3
]