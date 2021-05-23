const Discord = require("discord.js");
var moment = require('moment-timezone');
moment().tz("America/Los_Angeles").format();

const TOKEN = process.env.TOKEN;
const client = new Discord.Client();
const timezones = ["America/Los_Angeles", "America/New_York", "America/Danmarkshavn"];
var timer;

client.login(TOKEN);

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);

    timer = setInterval(updateClocks, 300 * 1000);
});

client.on("error", () => {
    if (timer) {
        clearInterval(timer);
    }
});


function updateClocks() {
    client.guilds.cache.each(guild => {
        guild.channels.cache.each(async (channel) => {
            if (channel.type === "category" && channel.name.toLocaleLowerCase().includes("clock")) {
                const now = Date.now();
                var clockNumber = 0;

                while (channel.children.size < timezones.length) {
                    await guild.channels.create("new", {
                        type: "voice",
                        parent: channel,
                        permissionOverwrites: [
                            {
                                id: guild.roles.everyone,
                                allow: ["VIEW_CHANNEL"],
                                deny: ["CONNECT"]
                            },
                            {
                                id: client.user,
                                allow: ["CONNECT"]
                            }
                        ]
                    });
                }

                channel.children.each(async (clockChannel) => {
                    if (clockNumber >= timezones.length) {
                        return await clockChannel.delete();
                    }


                    clockChannel.setName(`${moment.tz(now, timezones[clockNumber]).format("z | HH:mm | MMMM Do")}`);

                    clockNumber++;
                });
            }
        })
    });
}
