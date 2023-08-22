import { GraphQLClient } from "graphql-request"
import { LoggerHelper } from "../loggerhelper"
import { Config } from "../../constants"
import axios from 'axios';
export default class TranslateAPIHelper {
	_logger: LoggerHelper
	_setting: any
	constructor() {
		this._logger = new LoggerHelper(this.constructor.name)
		this._setting = {
			"ENDPOINT": `${Config.TRANSLATE_GOOGLE_API_ENDPOINT}/translate_a/single`
		}
		this._logger.info(`start up`)
	}
	async fetch_data(word: string, lang: string) {
		const params = {
			client: "gtx",
			sl: "auto",
			tl: lang,
			dt: "t",
			q: word,
		}
		let url = `${this._setting.ENDPOINT}`
		var self = this
		return axios.get(url, { params: params })
			.then(function (response) {
				// handle success
				return response.data
			})
			.catch(function (error) {
				self._logger.error(`url: ${url}\nerror: ${error}`)
			})
	}
}