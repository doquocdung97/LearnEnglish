import { Link } from "react-router-dom";
import GraphqlHelper from "../../graphql";
import { QUERY_USER } from "../../graphql/user";
import { useQuery } from 'react-query'
import './style.scss';
import { ButtonIcon } from "../Button";
import { Icon } from "../icon";
import Offcanvas from 'react-bootstrap/Offcanvas';
import { useState } from "react";
import MenuFull from "../menu-full";
import { InputSearch } from "../input";
import { useNavigate } from "react-router-dom";

const graphql_helpper = new GraphqlHelper()
function Header(props: any) {
	const navigate = useNavigate();
	// const { data, isLoading } = useQuery(['user'], () => graphql_helpper.query(QUERY_USER).then((data: any) => { return data?.user }))
	const [show, setShow] = useState(false);

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	return (
		<>
			<div className="header">
				<div className="container">
					<a href="/" className="logo">
						<img src="/assets/logo.png"></img>
					</a>
					<div className="search-header">
						<InputSearch onSubmit={(value:string)=>{
							navigate(`/search?q=${value}`);
						}}/>
					</div>
					<ButtonIcon className="btn-menu" size={50} iconName="List" onClick={handleShow}></ButtonIcon>
					{/* {
					(!isLoading && data) && (
						<>
							<div className="user">
								<div className="image">
									<img src="/assets/user-avatars.png" />
								</div>
								<div className="txt-name">{data.name}</div>
							</div>
						</>
					)
				} */}
				</div>
			</div>
			<MenuFull show={show} onHide={handleClose} ></MenuFull>
		</>

	);
}

export default Header;