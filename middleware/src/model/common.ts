enum BaseResultCode {

}
export class PaginationInput {
    pageSize: number = 0
    page: number = 0
    constructor(pageSize: number = 0, page: number = 0) {
        this.pageSize = pageSize
        this.page = page
    }
    static parse(obj: any):PaginationInput|null {
        if (obj) {
            const model = new PaginationInput();
            model.page = obj.page;
            model.pageSize = obj.pageSize;
            return model
        }
    }
}
export class Pagination {
    pageCount: number = 0
    total: number = 0
}
export class PaginationModel<T> {
    pagination: Pagination
    data: T[] = []
    constructor(){
        this.pagination = new Pagination()
    }
}
export class ResultBase {
    code: BaseResultCode
    success: boolean = false
}
export class ResultModelBase<T> extends ResultBase {
    data: T = null
}
export class ResultModelsBase<T> extends ResultBase {
    data: T[] = []
}