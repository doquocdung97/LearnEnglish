import { GraphQLClient } from "graphql-request"
import { LoggerHelper } from "../loggerhelper"
import { Config } from "../../constants"
import axios from 'axios';
import { google } from "googleapis";
export default class YoutubeAPIHelper {
	url = "https://www.googleapis.com/youtube/v3/videos?part=snippet&id=c0S6_6me9r8&key=AIzaSyDyfxniqccoPBPtesCoOVzEVahGHUlN6qQ"
	//https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=500&playlistId=PLOCvbe7RB9fZMMtLM5IP-1oBVxjYownyc&key=AIzaSyDyfxniqccoPBPtesCoOVzEVahGHUlN6qQ
	//https://www.googleapis.com/youtube/v3/playlists?part=snippet&maxResults=50&channelId=UCLsI5-B3rIr27hmKqE8hi4w&key=AIzaSyDyfxniqccoPBPtesCoOVzEVahGHUlN6qQ
	_logger: LoggerHelper
	_setting: any
	_client: GraphQLClient
	private _service
	constructor() {
		this._logger = new LoggerHelper(this.constructor.name)
		this._setting = {
			"ENDPOINT": `${Config.GOOGLE_API_ENDPOINT}/youtube/v3`,
			"KEY": Config.YOUTUBE_KEY
		}

		this._client = new GraphQLClient(this._setting.ENDPOINT);
		this._logger.info(`start CMSHelper url: ${this._setting.ENDPOINT}`)
		this._service = google.youtube('v3');
	}
	async fetch_data(url: string, params: any = {}) {
		url = `${this._setting.ENDPOINT}${url}`
		return axios.get(url, {
			params: {
				key: this._setting.KEY,
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
	async listVideo(data: any) {
		var fucn = this._service.search
		if (data.playlistId) {
			fucn = this._service.playlistItems
			const playlist = await this._service.playlists.list({
				auth: this._setting.KEY,
				part: 'id,snippet',
				id: data.playlistId
			}).then(result => {
				if (result.data.items.length > 0) {
					return result.data.items[0].snippet
				}
				return {}
			})
			const result = await fucn.list({
				auth: this._setting.KEY,
				part: 'id,snippet',
				...data
			})
				.then(response => {
					return response.data
				})
			return Object.assign(playlist,result)
		}
		return fucn.list({
			auth: this._setting.KEY,
			part: 'id,snippet',
			...data
		})
			.then(response => {
				return response.data
			})
	}
	detail(videoId: string) {

	}
}