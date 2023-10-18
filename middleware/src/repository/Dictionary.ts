import { CMSHelper } from "../common/cmd_helper";
import { GRAPHQL_USER } from "../common/cmd_helper/graphql";
import DictionaryAPIHelper from "../common/dictionary_api_helper";
import TranslateAPIHelper from "../common/google_api_helper/translate";
import { LoggerHelper } from "../common/loggerhelper";
import { randomSort } from "../common/utils";
import { DictionaryModel, MyDictionaryModel } from "../model/Dictionary";
import { UserModel, UserTokenModel } from "../model/User";
import { PaginationInput, PaginationModel } from "../model/common";
import VideoRepository from "./Video";

export default class DictionaryRepository {
	_logger: LoggerHelper
	_dictionaryHelper: DictionaryAPIHelper
	_translateAPIHelper: TranslateAPIHelper
	_cmsHelper: CMSHelper
	_videoRepostory: VideoRepository
	private static instance: DictionaryRepository;
	constructor() {
		const instance = DictionaryRepository.instance;
		if (instance) {
			return instance;
		}
		this._cmsHelper = new CMSHelper()
		this._dictionaryHelper = new DictionaryAPIHelper()
		this._translateAPIHelper = new TranslateAPIHelper()
		this._logger = new LoggerHelper(this.constructor.name)
		this._videoRepostory = new VideoRepository()
		DictionaryRepository.instance = this;
	}
	async getWord(word: string, lang: string = "en"): Promise<DictionaryModel[] | []> {
		const query: any = await this._dictionaryHelper.fetch_data(`/entries/${lang}/${word}`)
		if (query && query.length) {
			const dictionarys = query.map(item => new DictionaryModel(item))
			return dictionarys
		}
		return []
	}
	async getWordByVideo(userId: number, VideoId: string, pagination: PaginationInput, lang: string = "en"): Promise<PaginationModel<MyDictionaryModel>> {
		const query: any = await this._cmsHelper.query(GRAPHQL_USER.DICTIONARYVIDEOS, {
			userId,
			VideoId,
			pagination: pagination
		})
		const model = new PaginationModel<MyDictionaryModel>()
		const result = query?.dictionaryVideos
		if (result && result.data.length > 0) {
			const page = result.meta.pagination
			model.pagination.pageCount = page.pageCount
			model.pagination.total = page.total
			model.data = query.dictionaryVideos.data.map(item => new MyDictionaryModel(item))
		}
		return model
	}
	async leanWordByVideo(userId: number, VideoId: string, random: boolean, size: number, lang: string = "en"): Promise<MyDictionaryModel[]> {
		var models: MyDictionaryModel[] = []
		var _page = 1
		while (true) {
			const query: any = await this._cmsHelper.query(GRAPHQL_USER.DICTIONARYVIDEOS, {
				userId,
				VideoId,
				pagination: {
					pageSize: 10000,
					page: 0
				}
			})

			const result = query?.dictionaryVideos
			const page = result.meta.pagination
			if (size > result.data.length) {
				break
			}
			if (result && result.data.length > 0) {
				const data = query.dictionaryVideos.data.map(item => new MyDictionaryModel(item))
				models.push(...data)
				if (page.pageCount == _page) {
					break
				}
				_page++
			}
		}
		if (random) {
			models = randomSort(models)
		}
		return models.slice(0, size)
	}
	async createWordByVideo(userId: number, videoId: string, start: number, dur: number, word: string, lang: string = "en"): Promise<MyDictionaryModel | null> {
		try {
			const query: any = await this._cmsHelper.query(GRAPHQL_USER.DICTIONARYVIDEO, { userId, VideoId: videoId, word: word })
			if (query && query.dictionaryVideos && query.dictionaryVideos.data.length == 0) {
				let id = await this._videoRepostory.getAndreateMyVideo(userId, videoId)
				if (id != null) {
					const querycreate: any = await this._cmsHelper.query(GRAPHQL_USER.CREATE_DICTIONARYVIDEO, {
						"input": {
							"word": word,
							"user": userId,
							"publishedAt": new Date(),
							"video": id,
							"start": start,
							"dur": dur
						}
					})
					if (querycreate?.createDictionaryVideo && querycreate.createDictionaryVideo.data) {

						return new MyDictionaryModel(querycreate.createDictionaryVideo.data)
					}
				}
			}
		} catch (error) {
			let msg = `error createWordByVideo: ${error}\nuserId: ${userId}\nvideoId: ${videoId}\nword: ${word}`
			this._logger.error(msg)
			throw new Error(msg)
		}
		return null
	}
	async deleteWordByVideo(userId: number, id: number): Promise<boolean> {
		try {
			const checkdata: any = await this._cmsHelper.query(GRAPHQL_USER.CHECK_BEFORE_DELETE_DICTIONARYVIDEO, { userId, id })
			if (checkdata?.dictionaryVideos && checkdata.dictionaryVideos.data.length > 0) {
				const query: any = await this._cmsHelper.query(GRAPHQL_USER.DELETE_DICTIONARYVIDEO, { id })
				if (query && query.deleteDictionaryVideo && query.deleteDictionaryVideo.data) {
					return true
				}
			}

		} catch (error) {
			let msg = `error deleteWordByVideo: ${error} id: ${id}`
			this._logger.error(msg)
			throw new Error(msg)
		}
		return false
	}
}