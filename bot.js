require('dotenv').config();
const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: [
            '--no-sandbox'
        ]
    }
});

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', async message => {
    if (message.from !== process.env.WHATSAPP_GROUP_ID) return;

    const contact = await message.getContact();
    const name = contact.pushname?.split(" ")[0];

    const msg = message.body.toLowerCase();

    switch (true) {
        case containsGreeting(msg):
            message.reply(`hii ${name}`);
            break;
        default:
            break;
    }
});

client.initialize();

const containsGreeting = (msg) => {
    return msg.includes("hello") || msg.includes("hi") || msg.includes("hey");
};