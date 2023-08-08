import * as express from "express"
import * as bodyParser from "body-parser"
import { Request, Response } from "express"
import { getSubtitles } from "youtube-captions-scraper"
const cors = require('cors');

const app = express()
app.use(cors());

//static file
// app.use('/static', express.static('static', {
//     maxAge: Config.CACHE_MAXAGE
// }))
app.post('/', function (request, response) {
	response.write(request.body.user);
	response.end();
});
app.get('/subtitle/:lang/:id',async function (req, res) {
	// response.write(request.body.user);
	try {
		const videoID = req.params.id;
	const lang = req.params.lang;
	const data =  await getSubtitles({
		videoID,
		lang
	}).then(function (captions) {
		// console.log(captions);
		return captions
	});
	res.write(JSON.stringify(data));
	res.end();
	} catch (error) {
		console.log(error)
		res.write(JSON.stringify([]));
	res.end();
	}
});
app.listen(3002)
