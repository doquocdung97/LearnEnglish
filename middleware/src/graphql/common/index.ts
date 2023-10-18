import {
	GraphQLBoolean,
	GraphQLObjectType,
	GraphQLEnumType,
	GraphQLInt,
	GraphQLList,
	GraphQLString,
	GraphQLInputObjectType,
	GraphQLNonNull
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
		},
		B003: {
			value: 3,
			description:"No user found."
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
			pagination: {
				type: PaginationSchema
			},
			data: {
				type: new GraphQLList(model)
			}
		}
	})
}
export function createResultPaginationToken(name: string, model: GraphQLObjectType,fields:any = {}): GraphQLObjectType {
	return new GraphQLObjectType({
		name: `PaginationToken${name}Result`,
		fields: {
			pagination: {
				type: PaginationTokenSchema
			},
			data: {
				type: new GraphQLList(model)
			},
			...fields
		}
	})
}
export const PaginationSchema = new GraphQLObjectType({
	name: `Pagination`,
	fields: {
		total: {
			type: GraphQLInt
		},
		pageCount: {
			type: GraphQLInt
		},
		nextPageToken: {
			type: GraphQLString
		},
		prevPageToken: {
			type: GraphQLString
		},
	}
})
export const PaginationTokenSchema = new GraphQLObjectType({
	name: `PaginationToken`,
	fields: {
		total: {
			type: GraphQLInt
		},
		nextPageToken: {
			type: GraphQLString
		},
		prevPageToken: {
			type: GraphQLString
		},
	}
})
export const PaginationInputSchema = new GraphQLInputObjectType({
	name: `PaginationInput`,
	fields: {
		page: {
			type: GraphQLInt
		},
		pageSize: {
			type: new GraphQLNonNull(GraphQLInt)
		}
	}
})
export const PaginationTokenInputSchema = new GraphQLInputObjectType({
	name: `PaginationTokenInput`,
	fields: {
		pageSize: {
			type: GraphQLInt
		},
		pageToken: {
			type: GraphQLString
		}
	}
})