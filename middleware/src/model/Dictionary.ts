class DefinitionModel {
	definition: string
	example: string
}
class MeaningModel {
	type: string
	definitions: DefinitionModel[] = []
}

class PhoneticModel {
	text: string
	audio: string
}
export class DictionaryModel {
	id: number
	word: string
	translate: string
	phonetic: PhoneticModel
	examples: string[]
	meanings: MeaningModel[] = []
	constructor(obj: any) {
		this.word = obj.word
		this.phonetic = obj.phonetics?.find(n=>n.audio?.search("-us.mp3") >= 0)
		obj.meanings?.map(item => {
			const meaning = new MeaningModel()
			meaning.type = item.partOfSpeech
			item.definitions?.map(definition => {
				if (definition.example) {
					let d = new DefinitionModel()
					d.definition = definition.definition
					d.example = definition.example
					meaning.definitions.push(d)
				}
			})
			if(meaning.definitions.length > 0){
				this.meanings.push(meaning)
			}
		})
	}
}

export class MyDictionaryModel {
	id: number
	level: number
	word: string
	start: number
	dur: number
	constructor(obj: any) {
		this.id = obj.id
		if (obj.attributes) {
			this.word = obj.attributes.word
			this.level = obj.attributes.level
			this.start = obj.attributes.start
			this.dur = obj.attributes.dur
		}
	}
}