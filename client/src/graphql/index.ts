import { ApolloClient, InMemoryCache, NormalizedCacheObject } from "@apollo/client";
import { GraphQLClient } from "graphql-request";

export default class GraphqlHelper {
	_setting: any
	_client: GraphQLClient
	constructor() {
		this._setting = {
			"ENDPOINT": `http://localhost:3001/v1/graphql`,
		}

		this._client = new GraphQLClient(this._setting.ENDPOINT);
	}
	getToken(){
		return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNjkxNTYzNjQ3LCJleHAiOjE2OTQxNTU2NDd9.XVJQzmd38_QLgrSITKcxMSlX0ZhVAWrM0Metxs3D6jQ"
	}
	async query(query: any, variables: any = {}) {
		try {
			const token = this.getToken()
			const client = this._client.setHeader('authorization', token ? `Bearer ${token}` : "")
			const q = await client.request(query, variables).then()
			return q
		} catch (error) {
			// this._logger.error(`error ${error}\n query: ${query}\n variables: ${variables}`)
		}
	}
}