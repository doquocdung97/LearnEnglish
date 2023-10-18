import { Outlet } from "react-router-dom";
import Header from "../../component/Header";
import Footer from "../../component/Footer";
import './style.scss';
import Notify from "../../component/Notify";
export default function MainLayout() {
	
	return (
		<main>
			<Notify>
				<Header />
				<div className="content">
					<Outlet />
				</div>
				<Footer />
			</Notify>
		</main>
	);
}