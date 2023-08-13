import {
	GraphQLBoolean,
	GraphQLObjectType,
	GraphQLEnumType,
	GraphQLInt,
	GraphQLList,
	GraphQLString,
	GraphQLInputObjectType
} from "graphql";
export const BaseObjectType = {
	id: {
		type: GraphQLString
	},
}
export const BaseResultCode = new GraphQLEnumType({
	name: "BaseResultCode",
	values: {
		B000: {
			value: 0
		},
		B001: {
			value: 1
		},
		B002: {
			value: 2
		}
	},
})
export const ResultBase = new GraphQLObjectType({
	name: `ResultBase`,
	fields: {
		code: {
			type: BaseResultCode
		},
		success: {
			type: GraphQLBoolean
		}
	}
})
export function createResultModel(name: string, model: GraphQLObjectType): GraphQLObjectType {
	return new GraphQLObjectType({
		name: `${name}Result`,
		fields: {
			code: {
				type: BaseResultCode
			},
			success: {
				type: GraphQLBoolean
			},
			data: {
				type: model
			}
		}
	})
}
export function createResultPagination(name: string, model: GraphQLObjectType): GraphQLObjectType {
	return new GraphQLObjectType({
		name: `Pagination${name}Result`,
		fields: {
			total: {
				type: GraphQLInt
			},
			// page: {
			// 	type: GraphQLInt
			// },
			// show: {
			// 	type: GraphQLInt
			// },
			data: {
				type: new GraphQLList(model)
			}
		}
	})
}