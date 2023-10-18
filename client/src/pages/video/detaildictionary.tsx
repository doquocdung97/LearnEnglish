import React, { useState, useEffect } from "react"
import { useParams } from 'react-router-dom';
import GraphqlHelper from "../../graphql";
import { Levels } from "../../component/dictionary/Test";

const graphql = new GraphqlHelper()
function DetailDictionary(props: any) {
	const { id, level } = useParams();
	const levelnew = level ? parseInt(level) : 1
	var TextLevel = Levels[0]
	if (Levels[levelnew-1]) {
		TextLevel = Levels[levelnew-1]
	}
	return (
		<>
			<div className="container">
				<TextLevel {...props} id={id}></TextLevel>
			</div>
		</>
	)
}
export default DetailDictionary