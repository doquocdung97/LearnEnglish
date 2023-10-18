import { Link } from "react-router-dom";
import './style.scss';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { useState } from "react";
import { Col, Row } from "react-bootstrap";
import GraphqlHelper from "../../graphql";
import { QUERY_USER } from "../../graphql/user";
import { useQuery } from 'react-query'
import { useNavigate } from "react-router-dom";
import { removeAccessToken } from "../../helpers";

const graphql_helpper = new GraphqlHelper()
function MenuFull(props: any) {
	const { data, isLoading } = useQuery(['user'], () => graphql_helpper.query(QUERY_USER).then((data: any) => { return data?.user }))
	// const navigate = useNavigate();
	const logout = () => {
		removeAccessToken()
		// navigate("/");
	}
	const onHide = () => {
		if (props.onHide)
			props.onHide()
	}
	return (
		<>
			<Offcanvas className="menu-full" {...props} onHide={onHide}>
				<div className="menu-header">
					<div className="container ">
						<Offcanvas.Header closeButton>
							<Offcanvas.Title>
								<a href="/" className="logo">
									<img src="/assets/logo.png"></img>
								</a>
							</Offcanvas.Title>
						</Offcanvas.Header>
					</div>
				</div>

				<Offcanvas.Body>
					<div className="container body">
						<Row>
							<Col sm={6} className={`${(!isLoading && data) ? 'col-left' : String()}`}>
								<Row>
									<div className="group menu">
										<div className="txt-title">Menu</div>
										<ul>
											<li>
												<Link to="/" onClick={onHide}>Home</Link>
											</li>
											{/* <li>
												<Link to="/topic" onClick={onHide}>Topic</Link>
											</li> */}
											{
												(!isLoading && !data) && (
													<li>
														<Link to="/account/login">Login</Link>
													</li>
												)
											}
										</ul>
									</div>
								</Row>
								<Row >
									<div className="group tools">
										<div className="txt-title">Tools</div>
										<div className="list">
											<a href="https://www.facebook.com/dqd.vn" className="item" target="_blank">
												<div className="image">
													<img src="/assets/icon/facebook.png"></img>
												</div>
												<samp>Facebook</samp>
											</a>
											<a href="https://www.youtube.com/@oQuocDung" className="item" target="_blank">
												<div className="image">
													<img src="/assets/icon/youtube.png"></img>
												</div>
												<samp>Youtube</samp>
											</a>
										</div>
									</div>
								</Row>
							</Col>
							<Col sm={6}>
								<Row >

									{
										(!isLoading && data) && (
											<>
												<div className="group box-user">
													<div className="txt-title">Account</div>
													<div className="user">
														<div className="image">
															<img src="/assets/user-avatars.png" />
														</div>
														<div className="txt">
															<div className="txt-name"><strong>{data.name}</strong></div>
															<div className="txt-email">{data.email}</div>
														</div>
													</div>
													<ul>
														{/* <li>
															<Link to="/profile" onClick={onHide}>Profile</Link>
														</li> */}
														<li>
															<Link to="/myvideo" onClick={onHide}>My Video</Link>
														</li>
														{/* <li>
															<Link to="/mydictionary" onClick={onHide}>My Dictionary</Link>
														</li> */}
														<li>
															<a href="/" style={{ "cursor": "pointer" }} onClick={logout}>Log out</a>
														</li>
													</ul>
												</div>
											</>
										)
									}

								</Row>
							</Col>
						</Row>
					</div>
				</Offcanvas.Body>
			</Offcanvas>
		</>

	);
}

export default MenuFull;