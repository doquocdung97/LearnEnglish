import { CMSHelper } from "../common/cmd_helper";
import { GRAPHQL_USER } from "../common/cmd_helper/graphql";
import DictionaryAPIHelper from "../common/dictionary_api_helper";
import TranslateAPIHelper from "../common/google_api_helper/translate";
import { LoggerHelper } from "../common/loggerhelper";
import { DictionaryModel } from "../model/Dictionary";
import { TranslateModel } from "../model/Translate";
import { UserModel, UserTokenModel } from "../model/User";

export default class TranslateRepository {
	_logger: LoggerHelper
	_dictionaryHelper: DictionaryAPIHelper
	_translateAPIHelper: TranslateAPIHelper
	private static instance: TranslateRepository;
	constructor() {
		const instance = TranslateRepository.instance;
		if (instance) {
			return instance;
		}
		this._translateAPIHelper = new TranslateAPIHelper()
		this._logger = new LoggerHelper(this.constructor.name)
		TranslateRepository.instance = this;
	}
	async handle(word: string, lang: string = "vi"): Promise<string|null> {
		try {
			const response = await this._translateAPIHelper.fetch_data(word, lang)
			return response[0][0][0];
		} catch (error) {
			this._logger.error(`error: ${error}\nerror can't translate word: ${word} to language: ${lang}`)
		}
	}
	async audioAndText(word: string, lang: string = "vi"):Promise<TranslateModel|null>{
		const text = await this.handle(word,lang)
		const model = new TranslateModel()
		model.text = text
		model.audio = `/translate/${encodeURIComponent(word)}.mp3` 
		return model
	}
}