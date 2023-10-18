// import { ApolloClient, InMemoryCache, NormalizedCacheObject } from "@apollo/client";
import { GraphQLClient } from "graphql-request";
import { getAccessTokenFromStorage } from "../helpers";
import { Config } from "../constants";

export default class GraphqlHelper {
	_setting: any
	_client: GraphQLClient
	constructor() {
		this._setting = {
			"ENDPOINT": `${Config.MIDDLEWARE_ENDPOINT}/v1/graphql`,
		}

		this._client = new GraphQLClient(this._setting.ENDPOINT);
	}
	getToken(){
		const data = getAccessTokenFromStorage()
		return data?.accessToken
	}
	async query(query: any, variables: any = {}) {
		try {
			const token = this.getToken()
			const client = this._client.setHeader('authorization', token ? `Bearer ${token}` : "")
			const q = await client.request(query, variables).then()
			return q
		} catch (error) {
			console.error(`error ${error}\n query: ${query}\n variables: ${variables}`)
		}
	}
}