class Phonetic {
    audio: string = String()
    text: string = String()
}
class Definition {
    definition: string = String()
    example: string = String()
}
class Meaning {
    type: string = String()
    definitions: Definition[] = []
}
class DictionaryDetailModel {
    word: string = String()
    translate: string = String()
    phonetic: Phonetic
    meanings: Meaning[] = []
    constructor(){
        this.phonetic = new Phonetic()
    }
}

export class DictionaryModel {
    id: number = 0
    start: number = 0
    dur: number = 0
    word: string = String()
    level: number = 0
    detail: DictionaryDetailModel 
    constructor() {
        this.detail = new DictionaryDetailModel()
    }
}