import {  Outlet } from "react-router-dom";
import Header from "../../component/Header";
import Footer from "../../component/Footer";
import './style.scss'
export default function Account() {
	return (
		<div className="account">
			<Outlet />
		</div>
	);
}