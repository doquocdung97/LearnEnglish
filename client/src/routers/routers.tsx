
import MainLayout from '../layout/Main';

import Home from '../pages/home'
import Videos from '../pages/video/list';
import DetailVideo from '../pages/video/detail';
import DetailTestVideo from '../pages/video/detailtest';
import MyVideo from '../pages/myvideo';
import DetailDictionary from '../pages/video/detaildictionary';
import LoginPage from '../pages/login';
import Account from '../layout/Account';
import Topic from '../pages/topic';
import SearchPage from '../pages/search';

const Routes = [
	{
		element: (<MainLayout />),
		children: [
			{ path: "/", element: <Home /> },
			{ path: "/search", element: <SearchPage /> },
			{ path: "/topic/:id", element: <Topic /> },
			{ path: "/myvideo", element: <MyVideo /> },
			{ path: "/videos", element: <Videos /> },
			{ path: "/video/:id", element: <DetailVideo /> },
			{ path: "/video/test/:id", element: <DetailTestVideo /> },
			{ path: "/video/test/:id/:level", element: <DetailTestVideo /> },
			{ path: "/video/dictionary/:id/", element: <DetailDictionary /> },
			{ path: "/video/dictionary/:id/:level", element: <DetailDictionary /> },
		],
	},
	{
		path: "/account",
		element: (<Account />),
		children: [
			{
				path: "/account/login",
				element: <LoginPage />
			}
		]
	},
];
export default Routes