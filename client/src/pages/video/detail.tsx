import React from "react";
import Youtube from "../../component/youtube";
import { useParams } from 'react-router-dom';

function DetailVideo(props:any){
	const { id } = useParams();
	return (<Youtube videoId={id}/>)
}
export default DetailVideo