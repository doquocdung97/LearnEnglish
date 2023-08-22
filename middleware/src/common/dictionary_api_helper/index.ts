import { GraphQLClient } from "graphql-request"
import { LoggerHelper } from "../loggerhelper"
import { Config } from "../../constants"
import httpClient from "../request"
export default class DictionaryAPIHelper {
	_logger: LoggerHelper
	_setting: any
	constructor() {
		this._logger = new LoggerHelper(this.constructor.name)
		this._setting = {
			"ENDPOINT": `${Config.DICTIONARY_API_ENDPOINT}/api/v2`
		}

		this._logger.info(`start CMSHelper hrl: ${this._setting.ENDPOINT}`)
	}
	async fetch_data(url: string) {
		url = `${this._setting.ENDPOINT}${url}`
		var self = this
		return httpClient.get(url)
			.then(function (response) {
				// handle success
				// console.log(url,response.headers['request-duration'])
				return response.data
			})
			.catch(function (error) {
				self._logger.error(`url: ${url}\nerror: ${error}`)
			})
	}
}