import { Variables } from "../constants"
import { UserModel } from "./User"
import { Pagination, PaginationModel } from "./common"

export class SubtitleModel {
	start: number
	dur: number
	text: string
}

export class Thumbnail {
	url: string
	width: number
	height: number
}

export class VideoModel {
	id: number
	title: string
	favorite: boolean = false
	videoId: string
	thumbnails: Thumbnail[] = []
	publishedAt: Date
	subtitles: SubtitleModel[] = []
	user: UserModel
	constructor(obj: any) {
		this.id = obj.id
		if (obj.snippet?.thumbnails) {
			for (var name in obj.snippet.thumbnails) {
				const thumbnail = obj.snippet.thumbnails[name]
				const thumbnailmodel = new Thumbnail()
				thumbnailmodel.url = thumbnail?.url
				thumbnailmodel.width = thumbnail?.width
				thumbnailmodel.height = thumbnail?.height
				this.thumbnails.push(thumbnailmodel)
			}
		}
		this.title = obj.snippet?.title
		this.publishedAt = obj.snippet?.publishedAt
	}
	static parseByYoutube(obj) {
		const model = new VideoModel(obj)
		if (obj.id.kind == Variables.YOUTUBE_KIND_VIDEO) {
			model.id = obj.id.videoId
			return model
		} else if (obj.kind == Variables.YOUTUBE_KIND_PLAYLISH && (obj.snippet.thumbnails != Object())) {
			model.id = obj.snippet.resourceId.videoId
			return model
		}

	}
}
export class PlayListModel {
	id: string
	video: PaginationModel<VideoModel>[] = []
	title: string = String()
	thumbnails: Thumbnail[] = []
	constructor(obj:any) {
		this.id = obj.id
		if (obj.snippet?.thumbnails) {
			for (var name in obj.snippet.thumbnails) {
				const thumbnail = obj.snippet.thumbnails[name]
				const thumbnailmodel = new Thumbnail()
				thumbnailmodel.url = thumbnail?.url
				thumbnailmodel.width = thumbnail?.width
				thumbnailmodel.height = thumbnail?.height
				this.thumbnails.push(thumbnailmodel)
			}
		}
		this.title = obj.snippet?.title
	}
}