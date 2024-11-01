import { google } from 'googleapis';
import fs from 'fs';
import http from 'http';
import url from 'url';

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
const TOKEN_PATH = 'token.json';

fs.readFile('credentials.json', (err, content) => {
    if (err) return console.error('Error loading client secret file:', err);
    authorize(JSON.parse(content), listMessages);
});

function authorize(credentials, callback) {
    const { client_secret, client_id } = credentials.web;
    const redirect_uri = 'http://localhost:3000';
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uri);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) return getNewToken(oAuth2Client, callback);
        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client);
    });
}

function getNewToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this URL:', authUrl);

    // Create a server to listen for the OAuth callback
    const server = http.createServer((req, res) => {
        const queryObject = url.parse(req.url, true).query;
        if (queryObject.code) {
            res.end('Authentication successful! You can close this window.');
            server.close();

            // Use the authorization code to get the token
            oAuth2Client.getToken(queryObject.code, (err, token) => {
                if (err) return console.error('Error retrieving access token', err);
                oAuth2Client.setCredentials(token);

                // Save the token for future use
                fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                    if (err) return console.error(err);
                    console.log('Token stored to', TOKEN_PATH);
                });

                callback(oAuth2Client);
            });
        }
    }).listen(3000, () => {
        console.log('Listening on http://localhost:3000 for the OAuth callback');
    });
}

function listMessages(auth) {
    // console.log('auth do listMessages é -> ', auth)
    const gmail = google.gmail({ version: 'v1', auth });
    gmail.users.messages.list(
        {
            userId: 'me',
            q: 'is:unread "Código de ativação:"',
        },
        (err, res) => {
            if (err) return console.error('The API returned an error:', err);
            const messages = res?.data?.messages;
            if (messages?.length) {
                // console.log('Messages:');
                messages.forEach((message) => {
                    // console.log(`- ${message.id}`);
                    getMessage(auth, message.id);
                });
            } else {
                console.log('No new messages found.');
            }
        }
    );
}

function getMessage(auth, messageId) {
    const gmail = google.gmail({ version: 'v1', auth });
    gmail.users.messages.get({ userId: 'me', id: messageId }, (err, res) => {
        if (err) return console.error('The API returned an error:', err);

        const message = res.data;
        let body;

        // Check if body data is directly available
        if (message.payload?.body?.data) {
            body = message.payload.body.data;
        } else if (message.payload?.parts) {
            // If there are parts, try to find the text/plain part
            const part = message.payload.parts.find(part => part.mimeType === 'text/plain');
            if (part && part.body?.data) {
                body = part.body.data;
            }
        }

        if (body) {
            const decodedBody = Buffer.from(body, 'base64').toString('utf8');

            // Search for "Código de ativação:" and capture the 6-digit code following it
            const codeMatch = decodedBody.match(/Código de ativação:\s*(\d{6})/);

            if (codeMatch) {
                const activationCode = codeMatch[1];
                console.log('LOTERIA CAIXA Código ativação para o BOT Loteria Galhardo:', activationCode);
            } else {
                console.log('No activation code found in this message.');
            }
        } else {
            console.log('No readable content found in the message.');
        }
    });
}

