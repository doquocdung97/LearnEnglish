import React, { useEffect, useState } from "react";
import './style.scss'
import { useLocation, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import GraphqlHelper from "../../graphql";
import { SEARCH_VIDEOS } from "../../graphql/video";
import { Videos } from "../../component/Videos";
import { Button } from "react-bootstrap";
import NoData from "../../component/no-data";
import { Config } from "../../constants";
import { ButtonText } from "../../component/Button";
import { PlayList } from "../../component/PlayList";
const graphql = new GraphqlHelper()
export default function SearchPage(props: any) {
	const location = useLocation();
	const query = new URLSearchParams(location.search);
	const q = query.get('q')
	// const pageToken = query.get('pageToken')
	const [data, setData] = useState<any[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [nextPageToken, setNextPageToken] = useState(String())
	const [isLoadMore, setIsLoadMore] = useState(false)
	const fetch = (pageToken:string = String()) => {
		setIsLoadMore(true)
		graphql.query(SEARCH_VIDEOS, {
			"text": query.get('q'),
			"pagination": {
				"pageToken": pageToken,
				"pageSize": Config.PAGINATION_SIZE
			}
		}).then((re: any) => {
			const result = re?.search
			if (result) {
				setNextPageToken(result.pagination.nextPageToken)
				var new_data = result.data
				if(pageToken){
					new_data = [...data, ...result.data]
				}
				setData(new_data)
			}
			setIsLoading(false)
			return result
		}).finally(() => {
			setIsLoadMore(false)
		})
	}
	useEffect(() => {
		fetch()
	}, [location]);
	if ((!data || data.length == 0) && !isLoading) {
		return (
			<>
				<NoData></NoData>
			</>
		)
	}
	return (
		<div className='home'>
			<div className='container'>
				<PlayList
					data={
						{
							title:q,
							isLoading,
							isLoadMore,
							videos:data,
							nextPageToken
						}
					}
					onLoadMore={()=>{
						fetch(nextPageToken)
					}}
				/>
			</div>
		</div>
	)
}