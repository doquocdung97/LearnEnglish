import * as express from "express"
import * as bodyParser from "body-parser"
import { Request, Response } from "express"
import { getSubtitles } from "youtube-captions-scraper"
import apolloServer from "./graphql"
import { Config } from "./constants"
const cors = require('cors');
const gTTS = require('gtts');
const app = express()
import { join } from 'path';
app.use(cors());

//static file
app.use('/static', express.static('static', {
	maxAge: Config.CACHE_MAXAGE
}))
app.post('/', function (request, response) {
	response.write(request.body.user);
	response.end();
});
app.get('/subtitle/:lang/:id', async function (req, res) {
	// response.write(request.body.user);
	try {
		const videoID = req.params.id;
		const lang = req.params.lang;
		const data = await getSubtitles({
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
app.get('/translate/:text.mp3', async function (req, res) {
	try {
		const text = req.params.text;
		const gtts = new gTTS(text, "en");
		gtts.stream().pipe(res);
		res.writeHead(200, "OK", {"Content-Type": "audio/mp3"});
	} catch (error) {
		console.log(error)
		res.write(JSON.stringify([]));
		res.end();
	}
});

apolloServer(app)
app.listen(Config.PORT)
console.log(`Start App http://localhost:${Config.PORT}/`)
