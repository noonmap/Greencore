import axios from 'axios';
import * as cookies from './cookies';

const serverUrl = process.env.NODE_ENV == 'production' ? process.env.APP_SERVER_URL : 'http://localhost:3000';

export default axios.create({
	baseURL: serverUrl + '/api',

	headers: {
		'Content-Type': 'application/json',
		'x-refresh-token': cookies.getCookieToken() ? cookies.getCookieToken() : '',
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Credentials': true,
		'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
		'Access-Control-Allow-Headers':
			'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
	},

	withCredentials: true
});
