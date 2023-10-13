import { getRandomNumber, getRandomNumbers, randomSort, separateWords } from "../../common/utils";
import { DictionaryModel } from "../dictionary/utils";

export class Subtitle {
	start: number = 0
	dur: number = 0
	text: string = String()
	texts: string[] = []
	exercise: Exercise | null = null
}
export class Subtitles {
	private _data: Subtitle[] = []
	private words: string[] = []
	constructor() {
	}
	get data(): Subtitle[] {
		return this._data
	}
	static parse(objs: any): Subtitles | null {
		try {
			let model = new Subtitles()
			if (objs instanceof Array) {
				objs.map((item: any) => {
					if (!item.text?.includes("[Music]")) {
						let data = new Subtitle();
						data.start = item.start;
						data.dur = item.dur;
						data.text = item.text;
						data.texts = separateWords(item.text)
						model.words.push(...data.texts)
						model._data.push(data)
					}
				})
			}
			return model
		} catch (error) {

		}
		return null
	}
	get Words() {
		return this.words
	}
	getSubtitleActive() {

	}
	generateExercise(numberword:number) {
		this._data.map((item: Subtitle) => {
			if (item.texts.length > 1)
				item.exercise = new Exercise(item, this, numberword);
		})
	}
	generateExerciseDictionary(dictionarys: DictionaryModel[]) {
		const dictionarys_temp = dictionarys.map(n => n.word)
		this._data.map((item: Subtitle) => {
			const texts = []
			for (let index = 0; index < item.texts.length; index++) {
				const text = item.texts[index];
				
				if (dictionarys_temp.filter(n => n.toLowerCase().trim().replace(/[!.,?]/g, String()) == text.toLowerCase().trim().replace(/[!.,?]/g, String())).length > 0) {
					texts.push(text)
				}
				// console.log(texts)
			}
			if (texts.length > 0) {
				item.exercise = new Exercise(item, this, texts.length,texts);
			}
			// if (item.texts.length > 1)
			// 	item.exercise = new Exercise(item, this, 2);
		})
	}
	getExercise(item: Subtitle, numberword: number = 0) {
		let data = new Exercise(item, this, numberword)
		return data
	}
}
export class WordQuestion {
	text: string = String()
	reply: string | null = null
	suggest: string = String()
	hide: boolean = false;
	error: boolean = false;
	check(): boolean {
		return (this.text.trim().toLowerCase() === this.reply?.trim().toLowerCase())
	}
}
export class WordOption {
	text: string = String()
	hide: boolean = false;
	constructor(text: string = String(), hide: boolean = false) {
		this.text = text
		this.hide = hide
	}
}
export class Exercise {
	private _subtitle: Subtitle
	private _subtitles: Subtitles
	private _numberword: number
	private _question: WordQuestion[] = []
	private _options: WordOption[] = []
	private _answer: string[] = []
	private _words: string[] = []
	private _replycount: number = 0
	private _optionsNumber: number = 5
	constructor(subtitle: Subtitle, subtitles: Subtitles, numberword: number, words: string[] = []) {
		this._subtitle = subtitle
		this._subtitles = subtitles
		this._numberword = numberword
		this._words = words
		this.init()
	}
	init() {
		var separate = separateWords(this._subtitle.text)
		var randoms: number[] = []
		if (separate.length > 1 && this._words.length == 0) {
			randoms = getRandomNumbers(0, separate.length - 1, this._numberword)
		}
		separate.map((text: string, index: number) => {
			var hide = true
			if(this._numberword != 0){
				if (this._numberword != 0 && this._words.length == 0) {
					hide = randoms.find(x => x === index) != undefined
				}else if(this._words.length == 0 || this._words.filter(x=>x.replace(/[!.,?]/g, String()) == text.replace(/[!.,?]/g, String())).length == 0){
					hide = false
				}
			}
			if (hide) {
				this._answer.push(text)
			}
			const word = new WordQuestion()
			word.text = text;
			word.hide = hide
			this._question.push(word)
		})

		//handle option
		let words = this._subtitles.Words
		let options: WordOption[] = []
		this._answer.map(word => {
			options.push(new WordOption(word))
		})


		if (options.length <= this._optionsNumber && words.length >= this._optionsNumber) {
			// let length = this._optionsNumber - options.length
			while (options.length < this._optionsNumber) {
				let random = getRandomNumber(0, words.length - 1)
				let word = words[random]
				if (options.length <= 0 || options.find(x => x.text != word)) {
					options.push(new WordOption(word))
				}
			}
		}
		this._options = randomSort(options)
	}
	addReply(data: WordOption) {
		for (let index = 0; index < this._question.length; index++) {
			const word = this._question[index];
			if (word.hide && !word.reply) {
				word.reply = data.text
				word.error = false
				data.hide = true
				this._replycount++;
				return
			}
		}
		// this._replys.push(text)
	}
	removeReply(word: WordQuestion) {
		const option = this._options.find(x => x.text == word.reply && x.hide)
		if (option) {
			option.hide = false
			word.reply = null
			this._replycount--;
		}
	}
	checkAnswer(): boolean {
		let status = true
		for (let index = 0; index < this._question.length; index++) {
			const question = this._question[index];
			if (question.hide && !question.check()) {
				question.error = true
				status = false
			}
		}
		return status;
	}
	suggest() {
		for (let index = 0; index < this._question.length; index++) {
			const word = this._question[index];
			if (word.hide && !word.reply) {
				word.reply = word.text
				word.error = false
				this._replycount++;
				let option = this._options.find(x => x.text == word.text)
				if (option) {
					option.hide = true
				}
				return
			}
		}
	}
	suggestnew() {
		for (let index = 0; index < this._question.length; index++) {
			const word = this._question[index];
			if (word.hide && (!word.suggest)) {
				// word.reply = word.text
				word.reply = String()
				word.suggest = word.text
				word.error = false
				// this._replycount++;
				let option = this._options.find(x => x.text == word.text)
				if (option) {
					option.hide = true
				}
				return
			}
		}
	}
	get isSend(): boolean {
		return this._replycount == this._answer.length
	}
	get Question() {
		return this._question
	}
	get Answer(): string[] {
		return this._answer
	}
	get Options(): WordOption[] {
		return this._options
	}
}