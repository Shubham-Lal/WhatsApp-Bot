const express = require('express');
const app = express();
require('dotenv').config();
const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');
const locateChrome = require('locate-chrome');

try {
    const executablePath = await new Promise(resolve => locateChrome(arg => resolve(arg)));
    const client = new Client({
        authStrategy: new LocalAuth(),
        puppeteer: {
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox'
            ],
            executablePath: executablePath
        }
    });

    client.on('qr', qr => {
        qrcode.generate(qr, { small: true });
    });

    client.on('ready', () => {
        console.log('Client is ready!');
    });

    client.on('message', async message => {
        // if (message.from !== process.env.WHATSAPP_GROUP_ID) return;

        const contact = await message.getContact();
        const name = contact.pushname?.split(" ")[0];

        const msg = message.body.toLowerCase();

        switch (true) {
            case containsGreeting(msg):
                message.reply(`hii ${name}, how was your day?`);
                break;
            default:
                break;
        }
    });

    client.initialize();

    app.get('/', (req, res) => {
        res.send('Online👌');
    })
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

    const containsGreeting = (msg) => {
        return msg.includes("hello") || msg.includes("hi") || msg.includes("hey");
    };
} catch (error) {
    console.log(error);
}