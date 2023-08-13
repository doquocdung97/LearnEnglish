class DefinitionModel{
	definition: string
	example: string
}
class MeaningModel{
	type:string
	definitions: DefinitionModel[] = []
}

class PhoneticModel{
	text: string
	audio: string
}
export class DictionaryModel {
	id: number
	word: string
	translate: string
	phonetics:PhoneticModel[] = []
	examples: string[]
	meanings:MeaningModel[]=[]
	constructor(obj:any){
		// obj.phonetics?.map(item=>{
		// 	const phonetic = new PhoneticModel()
		// 	phonetic.text = item.text
		// 	phonetic.audio = item.audio
		// })
		this.word = obj.word
		this.phonetics = obj.phonetics
		obj.meanings?.map(item=>{
			const meaning = new MeaningModel()
			meaning.type = item.partOfSpeech
			item.definitions?.map(definition=>{
				if(definition.example){
					let d = new DefinitionModel()
					d.definition = definition.definition
					d.example = definition.example
					meaning.definitions.push(d)
				}
			})
			this.meanings.push(meaning)
		})
	}
}