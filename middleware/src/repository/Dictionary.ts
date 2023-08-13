import { CMSHelper } from "../common/cmd_helper";
import { GRAPHQL_USER } from "../common/cmd_helper/graphql";
import DictionaryAPIHelper from "../common/dictionary_api_helper";
import TranslateAPIHelper from "../common/google_api_helper/translate";
import { LoggerHelper } from "../common/loggerhelper";
import { DictionaryModel } from "../model/Dictionary";
import { UserModel, UserTokenModel } from "../model/User";

export default class DictionaryRepository {
	_logger: LoggerHelper
	_dictionaryHelper: DictionaryAPIHelper
	_translateAPIHelper: TranslateAPIHelper
	private static instance: DictionaryRepository;
	constructor() {
		const instance = DictionaryRepository.instance;
    if (instance) {
      return instance;
    }
		this._dictionaryHelper = new DictionaryAPIHelper()
		this._translateAPIHelper = new TranslateAPIHelper()
		this._logger = new LoggerHelper(this.constructor.name)
		DictionaryRepository.instance = this;
	}
	async getWord(word:string,lang:string="en"): Promise<DictionaryModel[] | []> {
		const query: any = await this._dictionaryHelper.fetch_data(`/entries/${lang}/${word}`)
		if (query && query.length){
			const dictionarys = query.map(item=>new DictionaryModel(item))
			return dictionarys
		}
		return []
	}
}