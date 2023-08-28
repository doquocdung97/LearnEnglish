
import MainLayout from '../layout/Main';

import Home from '../pages/home'
import Videos from '../pages/video/list';
import DetailVideo from '../pages/video/detail';
import DetailTestVideo from '../pages/video/detailtest';
import MyVideo from '../pages/myvideo';
import DetailDictionary from '../pages/video/detaildictionary';

const Routes = [
	{
		element: (<MainLayout />),
		children: [
			{ path: "/", element: <Home /> },
			{ path: "/myvideo", element: <MyVideo /> },
			{ path: "/videos", element: <Videos /> },
			{ path: "/video/:id", element: <DetailVideo /> },
			{ path: "/video/test/:id/:level", element: <DetailTestVideo /> },
			{ path: "/video/dictionary/:id/", element: <DetailDictionary /> },
			{ path: "/video/dictionary/:id/:level", element: <DetailDictionary /> },
		],
	}
];
export default Routes