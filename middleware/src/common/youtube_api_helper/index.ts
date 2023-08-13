import { GraphQLClient } from "graphql-request"
import { LoggerHelper } from "../loggerhelper"
import { Config } from "../../constants"
import axios from 'axios';
export default class YoutubeAPIHelper {
	url = "https://www.googleapis.com/youtube/v3/videos?part=snippet&id=c0S6_6me9r8&key=AIzaSyDyfxniqccoPBPtesCoOVzEVahGHUlN6qQ"
	//https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=500&playlistId=PLOCvbe7RB9fZMMtLM5IP-1oBVxjYownyc&key=AIzaSyDyfxniqccoPBPtesCoOVzEVahGHUlN6qQ
	//https://www.googleapis.com/youtube/v3/playlists?part=snippet&maxResults=50&channelId=UCLsI5-B3rIr27hmKqE8hi4w&key=AIzaSyDyfxniqccoPBPtesCoOVzEVahGHUlN6qQ
	_logger: LoggerHelper
	_setting: any
	_client: GraphQLClient
	constructor() {
		this._logger = new LoggerHelper('CMS')
		this._setting = {
			"ENDPOINT": `${Config.GOOGLE_API_ENDPOINT}/youtube/v3`,
			"KEY": Config.YOUTUBE_KEY
		}

		this._client = new GraphQLClient(this._setting.ENDPOINT);
		this._logger.info(`start CMSHelper hrl: ${this._setting.ENDPOINT}`)
	}
	async fetch_data(url: string, params: any = {}) {
		url = `${this._setting.ENDPOINT}${url}`
		return axios.get(url, {
			params: {
				key:this._setting.KEY,
				...params
			}
		})
			.then(function (response) {
				// handle success
				return response.data
			})
			.catch(function (error) {
				this._logger.error(`url: ${url}\nerror: ${error}`)
			})
	}
}