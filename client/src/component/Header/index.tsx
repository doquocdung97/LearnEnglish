import { Link } from "react-router-dom";
function Header(props:any) {
	return (
		<>
		<nav className="nav-bar">
				<ul>
					<li>
						<Link to="/"> Home</Link>
					</li>
					<li>
						<Link to="/myvideo">My Video</Link>
					</li>
					<li>
						<Link to="/mydictionary">My Dictionary</Link>
					</li>
					<li>
						<Link to="signup"> Sign Up</Link>
					</li>
				</ul>
			</nav>
		</>
	);
}

export default Header;