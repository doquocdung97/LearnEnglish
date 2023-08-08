import {  Outlet } from "react-router-dom";
import Header from "../component/Header";
import Footer from "../component/Footer";
export default function MainLayout() {
	return (
		<>
			<Header/>
			<Outlet />
			<Footer/>
		</>
	);
}