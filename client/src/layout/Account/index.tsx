import {  Outlet } from "react-router-dom";
import './style.scss'
export default function Account() {
	return (
		<div className="account">
			<Outlet />
		</div>
	);
}