import "dotenv/config";
import { google } from "googleapis";
import fs from "fs";
import http from "http";
import url from "url";

const SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"];
const TOKEN_PATH = "token.json";

let oAuth2Client = null;

async function authorize() {
	const redirect_uri = "http://localhost:3000";
	oAuth2Client = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, redirect_uri);

	return new Promise((resolve, reject) => {
		// fs.readFile(TOKEN_PATH, (err, token) => {
		// 	if (err) {
		// 		return getNewToken(oAuth2Client)
		// 			.then(() => resolve(oAuth2Client))
		// 			.catch(reject);
		// 	}
		// 	oAuth2Client.setCredentials(JSON.parse(String(token)));
		// 	resolve(oAuth2Client);
		// });
		oAuth2Client.setCredentials(
			JSON.parse(
				String({
					access_token:
						"ya29.a0AeDClZCa8xHlE6wMiGDIvCl48OsX6JEKOzmvrCT1OdjR71klwfEUvAwS-C9h8P90CWvfoY7rt4HP76cics0GEd5c6kzq3ASJ5IO8VcO1nKq_f1WGc3nnNLk9TIR9PXzGZKBcX989Q700UXYO3NchQotmTGmNx8Avgc7a9gxzaCgYKAekSARMSFQHGX2MiZdgvcHeUVE7Kl9vvh6QZww0175",
					refresh_token:
						"1//0h-lD0Tod24bcCgYIARAAGBESNwF-L9IrYWNAxrQwYkQtxL659crdM0JEn9VtI3E7rX2tNcgS_AUjUsZEFQK35899yue9rhl9AfE",
					scope: "https://www.googleapis.com/auth/gmail.readonly",
					token_type: "Bearer",
					expiry_date: 1730464522229,
				}),
			),
		);
		resolve(oAuth2Client);
	});
}

function getNewToken(oAuth2Client) {
	return new Promise((resolve, reject) => {
		const authUrl = oAuth2Client.generateAuthUrl({
			access_type: "offline",
			scope: SCOPES,
		});
		console.log("Authorize this app by visiting this URL:", authUrl);

		const server = http
			.createServer((req, res) => {
				const queryObject = url.parse(req.url, true).query;
				if (queryObject.code) {
					res.end("Authentication successful! You can close this window.");
					server.close();

					oAuth2Client.getToken(queryObject.code, (err, token) => {
						if (err) return reject(`Error retrieving access token: ${err}`);
						oAuth2Client.setCredentials(token);

						fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
							if (err) return reject(err);
							console.log("Token stored to:", TOKEN_PATH);
							resolve(oAuth2Client);
						});
					});
				}
			})
			.listen(3000, () => {
				console.log("Listening on http://localhost:3000 for the OAuth callback");
			});
	});
}

export async function getActivationCodeFromGmail(): Promise<string> {
	if (!oAuth2Client) {
		await authorize();
	}

	const gmail = google.gmail({ version: "v1", auth: oAuth2Client });
	return new Promise((resolve, reject) => {
		gmail.users.messages.list(
			{
				userId: "me",
				q: 'is:unread "Código de ativação:"',
			},
			async (err, res) => {
				if (err) return reject(`The API returned an error: ${err}`);
				const messages = res?.data?.messages;
				if (messages?.length) {
					for (const message of messages) {
						try {
							const activationCode = await getMessage(oAuth2Client, message.id);
							if (activationCode) {
								return resolve(activationCode as string);
							}
						} catch (error) {
							reject(`Error getting activation code: ${err}`);
						}
					}
				} else {
					console.log("No new messages found.");
					resolve(null);
				}
			},
		);
	});
}

async function getMessage(auth, messageId) {
	const gmail = google.gmail({ version: "v1", auth });
	return new Promise((resolve, reject) => {
		gmail.users.messages.get({ userId: "me", id: messageId }, (err, res) => {
			if (err) return reject(`The API returned an error: ${err}`);

			const message = res.data;
			let body;

			if (message.payload?.body?.data) {
				body = message.payload.body.data;
			} else if (message.payload?.parts) {
				const part = message.payload.parts.find((part) => part.mimeType === "text/plain");
				if (part && part.body?.data) {
					body = part.body.data;
				}
			}

			if (body) {
				const decodedBody = Buffer.from(body, "base64").toString("utf8");
				const codeMatch = decodedBody.match(/Código de ativação:\s*(\d{6})/);

				if (codeMatch) {
					const activationCode = codeMatch[1];
					resolve(activationCode);
				} else {
					console.log("No activation code found in this message.");
					resolve(null);
				}
			} else {
				console.log("No readable content found in the message.");
				resolve(null);
			}
		});
	});
}

// (async () => {
//     try {
//         const activationCode = await getActivationCodeFromGmail();
//         console.log('Activation Code: ', activationCode);
//     } catch (error) {
//         console.error('Error:', error);
//     }
// })();
