import { CMSHelper } from "../common/cmd_helper";
import { GRAPHQL_USER } from "../common/cmd_helper/graphql";
import { LoggerHelper } from "../common/loggerhelper";
import { UserModel, UserTokenModel } from "../model/User";

export default class UserRepository {
	_logger: LoggerHelper
	_cmsHelper: CMSHelper
	private static instance: UserRepository;
	constructor() {
		const instance = UserRepository.instance;
    if (instance) {
      return instance;
    }
		this._cmsHelper = new CMSHelper()
		this._logger = new LoggerHelper(this.constructor.name)
		UserRepository.instance = this;
	}
	async getUserByToken(token: string): Promise<UserModel | null> {
		const query: any = await this._cmsHelper.userByToken(token)
		if (query && query.usersPermissionsUser){
			const data = query.usersPermissionsUser.data
			const model = new UserModel()
			model.id = data.id
			model.name = data.attributes?.name
			model.email = data.attributes?.email
			model.phone = data.attributes?.phome
			return model
		}
		return null
	}
	async login(identifier,password): Promise<UserTokenModel | null> {
		const query: any = await this._cmsHelper.query(GRAPHQL_USER.LOGIN, {
				identifier,
				password
			})
		if (query && query.login){
			const login = query.login
			const model = new UserTokenModel()
			
			model.token = login?.jwt
			const user:any = await this._cmsHelper.userById(login.user.id)
			const data = user?.usersPermissionsUser.data

			const usermodel = new UserModel()
			usermodel.id = data.id
			usermodel.name = data.attributes?.name
			usermodel.email = data.attributes?.email
			usermodel.phone = data.attributes?.phome
			model.user = usermodel
			return model
		}
		return null
	}
}