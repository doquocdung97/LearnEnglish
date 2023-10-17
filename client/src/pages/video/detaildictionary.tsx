import React, { useState, useEffect } from "react"
import Youtube from "../../component/youtube";
import { useParams } from 'react-router-dom';
import GraphqlHelper from "../../graphql";
import { DICTIONARYVIDEOS, DICTIONARYVIDEOS_DETAIL } from "../../graphql/dictionary";
import { Levels } from "../../component/dictionary/Test";
import { NotifyContext } from "../../component/Notify";

const graphql = new GraphqlHelper()
function DetailDictionary(props:any){
	const { id, level } = useParams();
    const levelnew = level ? parseInt(level) : 0
	var TextLevel = Levels[0]
	if (Levels[levelnew]) {
		TextLevel = Levels[levelnew]
	}
	const value  = React.useContext(NotifyContext)
	return (<TextLevel {...props} id={id}></TextLevel>)
}
export default DetailDictionary