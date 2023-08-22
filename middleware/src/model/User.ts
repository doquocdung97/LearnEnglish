export class UserModel{
	id:number
	name:string
	email:string
	phone:string
}
export class UserTokenModel{
	token:string
	user:UserModel
}