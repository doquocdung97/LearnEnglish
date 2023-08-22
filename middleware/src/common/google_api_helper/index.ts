import { GraphQLClient } from "graphql-request"
import { LoggerHelper } from "../loggerhelper"
import { Config } from "../../constants"
import axios from 'axios';
import { google } from 'googleapis'
export default class GoogleAPIHelper {

	_logger: LoggerHelper
	_setting: any
	constructor() {
		this._logger = new LoggerHelper(this.constructor.name)
		this._setting = {
			"YOUR_CLIENT_ID": "",
			"YOUR_CLIENT_SECRET": "",
			"YOUR_REDIRECT_URI": "",
			"YOUR_ACCESS_TOKEN": "",
		}
		this._logger.info(`start GoogleAPIHelper`)
		const OAuth2Client = google.auth.OAuth2;

		// Replace with your OAuth client ID and client secret
		const clientId = 'YOUR_CLIENT_ID';
		const clientSecret = 'YOUR_CLIENT_SECRET';
		const redirectUri = 'YOUR_REDIRECT_URI';

		const oauth2Client = new OAuth2Client(clientId, clientSecret, redirectUri);

		// Set the access token received after successful OAuth2.0 authentication
		const accessToken = 'YOUR_ACCESS_TOKEN';
		oauth2Client.setCredentials({ access_token: accessToken });

		// Create the YouTube Data API client
		const youtube = google.youtube({
			version: 'v3',
			auth: oauth2Client,
		});

		// Fetch liked playlists using the YouTube Data API
		youtube.playlists.list({
			part: ['snippet'],
			mine: true,
		})
			.then(response => {
				const playlists = response.data.items;
				console.log(playlists);
			})
			.catch(error => {
				console.error('Error fetching liked playlists:', error.message);
			});
	}
}