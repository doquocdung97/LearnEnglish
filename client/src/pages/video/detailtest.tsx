import React from "react";
import Youtube from "../../component/youtube";
import { useParams } from 'react-router-dom';

function DetailTestVideo(props: any) {
	const { id, level } = useParams();
	const levelnew = level ? parseInt(level) : 1
	return (<Youtube videoId={id} level={levelnew} test={1} />)
}
export default DetailTestVideo