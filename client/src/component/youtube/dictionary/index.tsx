import React, { useState, useEffect } from "react"
import { DELETE_DICTIONARYVIDEO, DICTIONARYVIDEOS } from "../../../graphql/dictionary"
import GraphqlHelper from "../../../graphql"
import { DictionaryModel, Subtitles as SubtitlesModel } from "../utils"
import './style.scss';
import { Icon } from "../../icon";
import { ButtonIcon } from "../../Button";
import { Link } from "react-router-dom";

class Pagination {
    pageSize: number = 0
    page: number = 0
    pageCount: number = 0
}

interface DictionaryState {
    rowDatas: DictionaryModel[]
    pagination: Pagination
}
interface DictionaryProps {
    model: SubtitlesModel | null
    videoId: string| undefined
}
const graphql = new GraphqlHelper()


function DictionaryItem(props: any) {
    const [isLoadingDelete, setIsLoadingDelete] = useState(false)
    const { data, onDelete } = props
    const onHandleDelete = async (data: DictionaryModel) => {
        setIsLoadingDelete(true)
        let status = await onDelete(data)
        if (status) {
            setIsLoadingDelete(false)
        }
    }
    return (
        <div className="dictionary">
            <div className="txt">
                <p className="txt-title">{data.word}</p>
                <p className="txt-sub">Level: {data.level}</p>
            </div>

            <div className='tools'>
                <button className='btn-icon-sm'><Icon iconName='InfoLg'></Icon></button>
                <ButtonIcon onClick={() => onHandleDelete(data)} loading={isLoadingDelete} iconName='XLg'></ButtonIcon>
            </div>
        </div>
    )
}
export class Dictionary extends React.Component<DictionaryProps, DictionaryState>{
    // const {data} = props
    // const oncheck=()=>{
    //     
    // }
    elemRef: any
    constructor(props: any) {
        super(props)
        this.elemRef = React.createRef();
        this.state = {
            pagination: {
                page: 1,
                pageSize: 10,
                pageCount: 0
            },
            rowDatas: []
        }
    }
    create(item: DictionaryModel) {
        var dictionarys = this.state && this.state.rowDatas ? this.state.rowDatas : []
        dictionarys.push(item)
        this.setState({ rowDatas: dictionarys })
    }
    private async fetch(page: number = 1) {
        if (page > 1 && page >= this.state.pagination.pageCount) {
            return
        }
        const query: any = await graphql.query(DICTIONARYVIDEOS, {
            videoId: this.props.videoId,
            pagination: {
                page: page,
                pageSize: this.state.pagination.pageSize
            }
        })
        const result = query?.dictionaryByVideo
        if (result?.data.length > 0) {
            const pagination = Object.assign({}, this.state.pagination)
            pagination.page = page
            pagination.pageCount = result.pagination.pageCount
            this.setState({ rowDatas: [...this.state ? this.state.rowDatas : [], ...result.data], pagination: pagination })
        }
    }
    componentDidMount() {
        this.fetch()
        const current = this.elemRef.current
        if (current) {
            current.addEventListener('scroll', this.handleScroll.bind(this));
        }
    }
    componentDidUpdate() {
        const current = this.elemRef.current
        if (current) {
            current.removeEventListener('scroll', this.handleScroll.bind(this));
        }
    }
    handleScroll(event: any) {
        // if (event.innerHeight + event.documentElement.scrollTop !== event.documentElement.offsetHeight) return;
        if ((event.target.scrollTop + event.target.offsetHeight) >= event.target.scrollHeight) {
            let page = this.state.pagination.page + 1
            this.fetch(page)
        }
    }

    private async onDelete(item: any) {
        const query: any = await graphql.query(DELETE_DICTIONARYVIDEO, { id: item.id })
        const result = query?.deleteDictionaryByVideo
        if (result?.success) {
            const rowdatas = this.state.rowDatas
            let data = rowdatas.find(x => x.id == item.id)
            if (data) {
                const index = rowdatas.indexOf(data)
                rowdatas.splice(index, 1)
                this.setState({ rowDatas: rowdatas })
                return true
            }
        }
        return false
    }
    render() {
        return (
            <div className="dictionarys">
                <div className="tools">
                    <Link to={`/video/dictionary/${this.props.videoId}`}>go test</Link>
                </div>
                <div ref={this.elemRef} className="list">
                    {
                        this.state?.rowDatas?.map((item: any) => {
                            return (<DictionaryItem data={item} onDelete={this.onDelete.bind(this)} />)
                        })
                    }
                </div>
            </div>
        )
    }
}