import React from "react";
import Youtube from "../../component/youtube";
import { useParams } from 'react-router-dom';

function DetailTestVideo(props:any){
	const { id } = useParams();
	return (<Youtube videoId={id} test={true}/>)
}
export default DetailTestVideo