import { LoggerHelper } from "../loggerhelper";
import { Config, Variables } from "../../constants";
import { request, gql, GraphQLClient } from 'graphql-request';
import { GRAPHQL_USER } from "./graphql";


export class CMSHelper {
	_logger: LoggerHelper
	_setting: any
	_client: GraphQLClient
	constructor() {
		this._logger = new LoggerHelper(this.constructor.name)
		this._setting = {
			"ENDPOINT": `${Config.CMS_ENDPOINT}/graphql`,
			"TOKEN": Config.CMS_TOKEN
		}

		this._client = new GraphQLClient(this._setting.ENDPOINT);
		this._logger.info(`start CMSHelper url: ${this._setting.ENDPOINT}`)
	}
	async query(query: any, variables: any = {}) {
		try {
			const client = this._client.setHeader('authorization', this._setting.TOKEN ? `Bearer ${this._setting.TOKEN}` : "")
			const q = await client.request(query, variables)
			return q
		} catch (error) {
			this._logger.error(`error ${error}\n query: ${query}\n variables: ${variables}`)
		}
	}
	async userByToken(token: string) {
		try {
			const query: any = await this._client.setHeader('authorization', token).request(GRAPHQL_USER.ME)
			if (query && query.me) {
				const user = await this.userById(query.me.id)
				return user
			}
		} catch (error) {
			console.log(error)
			this._logger.error(`error ${error}\n query: Me`)
		}
	}
	async userById(id: number) {
		try {
			const user = await this.query(GRAPHQL_USER.PERMISSION, { id: id })
			return user
		} catch (error) {
			this._logger.error(`error ${error}\n query: Me`)
		}
	}
}