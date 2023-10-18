import React, { useState, useEffect } from "react"
import Youtube from "../../component/youtube";
import { useParams } from 'react-router-dom';
import GraphqlHelper from "../../graphql";
import { DICTIONARYVIDEOS, DICTIONARYVIDEOS_DETAIL } from "../../graphql/dictionary";
import { Levels } from "../../component/dictionary/Test";
import { NotifyContext } from "../../component/Notify";

const graphql = new GraphqlHelper()
function DetailDictionary(props: any) {
	const { id, level } = useParams();
	const levelnew = level ? parseInt(level) : 1
	var TextLevel = Levels[0]
	if (Levels[levelnew-1]) {
		TextLevel = Levels[levelnew-1]
	}
	const value = React.useContext(NotifyContext)
	return (
		<>
			<div className="container">
				<TextLevel {...props} id={id}></TextLevel>
			</div>
		</>
	)
}
export default DetailDictionary