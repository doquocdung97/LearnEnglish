import React, { useState, useEffect } from "react";
import { useQuery } from 'react-query'
import GraphqlHelper from '../../graphql';
import { GET_MY_VIDEOS } from "../../graphql/video";
import { Card, Col } from 'react-bootstrap';
import './style.scss'
import { Link } from "react-router-dom";
import { Videos } from "../../component/Videos";
const graphql = new GraphqlHelper()

export default function MyVideo(props: any) {
	const { data, isLoading } = useQuery(['myvideo'], () => graphql.query(GET_MY_VIDEOS).then((data: any) => {
		return data?.myVideos
	}))
	return (
		<>
		<div className='my-video'>
			<div className='container'>
			<Videos data={data?.data} isLoading={isLoading}></Videos>
			</div>
		</div>
		</>
	)
}