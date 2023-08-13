
import MainLayout from '../layout/Main';

import Home from '../pages/home'
import Videos from '../pages/video/list';
import DetailVideo from '../pages/video/detail';
import DetailTestVideo from '../pages/video/detailtest';
import MyVideo from '../pages/myvideo';

const Routes = [
	{
		element: (<MainLayout />),
		children: [
			{ path: "/", element: <Home /> },
			{ path: "/myvideo", element: <MyVideo /> },
			{ path: "/videos", element: <Videos /> },
			{ path: "/video/:id", element: <DetailVideo /> },
			{ path: "/video/test/:id", element: <DetailTestVideo /> },
		],
	}
];
export default Routes