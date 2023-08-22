import React from "react";
import Youtube from "../../component/youtube";
import { useParams } from 'react-router-dom';
import GraphqlHelper from "../../graphql";
import { DICTIONARYVIDEOS } from "../../graphql/dictionary";

const graphql = new GraphqlHelper()
function DetailDictionary(props:any){
	const { id } = useParams();
	return (<Youtube videoId={id} test={true} onReady={async (model)=>{
        const query: any = await graphql.query(DICTIONARYVIDEOS, {
            videoId: id,
            pagination: {
                page: 1,
                pageSize: 1000
            }
        })
        const result = query?.dictionaryByVideo
        if (result?.data.length > 0) {
            model?.generateExerciseDictionary(result.data)
        }
    }}/>)
}
export default DetailDictionary