import { CMSHelper } from "../common/cmd_helper";
import { GRAPHQL_USER, GRAPHQL_VIDEO } from "../common/cmd_helper/graphql";
import { LoggerHelper } from "../common/loggerhelper";
import YoutubeAPIHelper from "../common/youtube_api_helper";
import { UserModel, UserTokenModel } from "../model/User";
import { PlayListModel, SubtitleModel, Thumbnail, VideoModel } from "../model/Video";
// import { getSubtitles } from "youtube-captions-scraper"
import { getSubtitles } from 'youtube-caption-extractor';
import { Pagination, PaginationInput, PaginationModel } from "../model/common";
import { Variables } from "../constants";

export default class VideoRepository {
	_logger: LoggerHelper
	_cmsHelper: CMSHelper
	_youtubeHelper: YoutubeAPIHelper
	private static instance: VideoRepository;
	constructor() {
		const instance = VideoRepository.instance;
		if (instance) {
			return instance;
		}
		this._cmsHelper = new CMSHelper()
		this._youtubeHelper = new YoutubeAPIHelper()
		this._logger = new LoggerHelper(this.constructor.name)
		VideoRepository.instance = this;
	}
	// async get(lang:string): Promise<VideoModel[] | null>;
	async get(userId: string, id: string, lang: string = 'en'): Promise<VideoModel | null> {

		try {
			let request = await this._youtubeHelper.fetch_data('/videos', {
				part: "snippet",
				id
			})
			if (request && request.items) {
				const model = new VideoModel(request.items[0])
				if (userId) {
					const variables = {
						"videoId": id,
						"userId": userId
					}
					const query: any = await this._cmsHelper.query(GRAPHQL_USER.VIDEO, variables)
					if (query && query.videos?.data && query.videos?.data.length > 0) {
						model.favorite = true
					}
				}
				// model.subtitles = subtitles
				return model
			}
			return null
		} catch (error) {
			let msg = `error get: ${error}\nuserId: ${userId} videoId: ${id}`
			this._logger.error(msg)
			throw new Error(msg)
		}
	}
	async getSubTitle(id: string, lang: string = "en") {
		return await getSubtitles({
			videoID: id,
			lang: lang
		}).then(function (captions) {
			return captions
		}).catch(error => {
			this._logger.error(`error: ${error}`)
		});
	}
	async myVideos(userId: number): Promise<VideoModel[]> {
		const models = []
		const query: any = await this._cmsHelper.query(GRAPHQL_USER.VIDEOS_BY_USER, { userId: userId })
		if (query && query.videos) {
			let videoids = []
			let data = query.videos.data
			data.map((item: any) => {
				let attr = item.attributes
				if (attr?.VideoId) {
					videoids.push(attr.VideoId)
				}
			})
			let request = await this._youtubeHelper.fetch_data('/videos', {
				part: "snippet",
				id: videoids.toString()
			})
			if (request && request.items) {
				request.items.map((item: any) => {
					const model = new VideoModel(item)
					models.push(model)
				})
			}
			return models
		}
		return []
	}
	async globleVideos(): Promise<VideoModel[]> {
		const models = []
		const query: any = await this._cmsHelper.query(GRAPHQL_USER.GLOBAL_VIDEOS)
		if (query && query.videos) {
			let videoids = []
			let data = query.videos.data
			data.map((item: any) => {
				let attr = item.attributes
				if (attr?.VideoId) {
					videoids.push(attr.VideoId)
				}
			})
			let request = await this._youtubeHelper.fetch_data('/videos', {
				part: "snippet",
				id: videoids.toString()
			})
			if (request && request.items) {
				request.items.map((item: any) => {
					const model = new VideoModel(item)
					models.push(model)
				})
			}
			return models
		}
		return []
	}
	async createMyVideo(userId: number, videoId: string): Promise<boolean> {
		const variables = {
			"videoid": videoId,
			"publishedAt": new Date(),
			"userid": userId
		}
		try {
			const query: any = await this._cmsHelper.query(GRAPHQL_USER.VIDEOS_BY_USER, { userId: userId })
			if (query && query.videos) {
				let checkdataintable = query.videos.data.find(n => n.attributes?.VideoId == videoId)
				if (!checkdataintable) {
					const querycreate: any = await this._cmsHelper.query(GRAPHQL_USER.CREATE_VIDEO, variables)
					if (querycreate) {
						return true
					}
				}
			}
		} catch (error) {
			let msg = `error createMyVideo: ${error}\nuserId: ${userId} videoId: ${videoId}`
			this._logger.error(msg)
			throw new Error(msg)
		}
		return false
	}
	async getAndreateMyVideo(userId: number, videoId: string): Promise<number | null> {
		try {
			const variables = {
				"videoId": videoId,
				"userId": userId
			}
			try {
				const query: any = await this._cmsHelper.query(GRAPHQL_USER.VIDEO, variables)

				if (query && query.videos?.data && query.videos?.data.length == 1) {
					return query.videos?.data[0].id
				}

				const querycreate: any = await this._cmsHelper.query(GRAPHQL_USER.CREATE_VIDEO, {
					"videoid": videoId,
					"publishedAt": new Date(),
					"userid": userId
				})
				if (querycreate) {
					return querycreate.createVideo?.data.id
				}
			} catch (error) {
				let msg = `error getAndreateMyVideo: ${error}\nuserId: ${userId} videoId: ${videoId}`
				this._logger.error(msg)
				throw new Error(msg)
			}

		} catch (error) {
			let msg = `error createMyVideo: ${error}\nuserId: ${userId} videoId: ${videoId}`
			this._logger.error(msg)
			throw new Error(msg)
		}
		return null
	}
	async deleteMyVideo(userId: number, videoId: string): Promise<boolean> {
		const variables = {
			"videoId": videoId,
			"userId": userId
		}
		try {
			const query: any = await this._cmsHelper.query(GRAPHQL_USER.VIDEO, variables)
			if (query && query.videos?.data && query.videos?.data.length == 1) {

				const querydelete: any = await this._cmsHelper.query(GRAPHQL_USER.DELETE_VIDEO, {
					"id": query.videos?.data[0].id
				})
				if (querydelete) {
					return true
				}
			}
		} catch (error) {
			let msg = `error deleteMyVideo: ${error}\nuserId: ${userId} videoId: ${videoId}`
			this._logger.error(msg)
			throw new Error(msg)
		}
		return false
	}
	async search(text: string, pagination: PaginationInput): Promise<PaginationModel<VideoModel> | null> {
		var data: any = {
			q: text,
			pageToken: null
		}
		if (pagination) {
			data.maxResults = pagination.pageSize
			data.pageToken = pagination.pageToken
		}
		return this._fetch_data(data)
	}
	async videoByChannel(channelId: string, pagination: PaginationInput): Promise<PaginationModel<VideoModel>> {
		var data: any = {
			channelId: channelId,
			pageToken: null
		}
		if (pagination) {
			data.maxResults = pagination.pageSize
			data.pageToken = pagination.pageToken
		}
		return this._fetch_data(data)
	}
	async videoByPlayList(playlistId: string, pagination: PaginationInput): Promise<PaginationModel<VideoModel>> {
		var data: any = {
			playlistId: playlistId,
			pageToken: null
		}
		if (pagination) {
			data.maxResults = pagination.pageSize
			data.pageToken = pagination.pageToken
		}
		return this._fetch_data(data)
	}
	private async _fetch_data(data: any): Promise<PaginationModel<VideoModel>> {
		if (!data.maxResults || data.maxResults < 1) {
			data.maxResults = Variables.YOUTUBE_MAX_RESULTS
		}
		const model = new PaginationModel<VideoModel>()
		var result = await this._youtubeHelper.listVideo(data)
		if (result) {
			var items = []
			for (let index = 0; index < result.items.length; index++) {
				const element = VideoModel.parseByYoutube(result.items[index]);
				if (element) {
					items.push(element)
				}
			}
			model.data = items
			model.pagination.total = result.pageInfo.totalResults
			model.pagination.nextPageToken = result.nextPageToken
			model.pagination.prevPageToken = result.prevPageToken
		}
		return model
	}
	async playList(): Promise<PlayListModel[]  | null>
	async playList(id:string): Promise<PlayListModel | null>
	async playList(id:string = null): Promise<PlayListModel | PlayListModel[] |null> {
		if(id){
			const playlists = await this._youtubeHelper.playlists([id])
			if(playlists.items && playlists.items.length){
				return new PlayListModel(playlists.items[0])
			}
		}
		const query: any = await this._cmsHelper.query(GRAPHQL_VIDEO.PLAYLIST)
		const result = query?.playLists
		if (result && result.data && result.data.length) {
			const playlists = await this._youtubeHelper.playlists(result.data.map(item => item.attributes.playListId))
			return playlists.items?.map(n=>new PlayListModel(n))
		}
		return null
	}
}