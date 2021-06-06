const Discord = require('discord.js');
const botclient = new Discord.Client();
const highestcokkarizmatik = require('./ayarlar.json');
const Gamedig = require('gamedig');

botclient.on('ready', () => {
    var interval = setInterval(function() {
        let guild = botclient.guilds.cache.get(highestcokkarizmatik.discord);
        let channel = guild.channels.cache.get(highestcokkarizmatik.channel);
        Gamedig.query({
            type: 'csgo',
            host: highestcokkarizmatik.ipabs,
            port: highestcokkarizmatik.port
        }).then((state) => {
            botclient.user.setActivity(state.players.length + "/" + state.maxplayers);
            channel.setName(state.players.length + " Kişi");
        }).catch((error) => {
            console.log(error);
        });
    }, 1000);
});

botclient.on('message', (message) => {

    if (message.author.bot) return;
    if (message.content.indexOf(highestcokkarizmatik.prefix) !== 0) return;
    const args = message.content.slice(highestcokkarizmatik.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if (command === "oyuncular") {
        Gamedig.query({
            type: 'csgo',
            host: highestcokkarizmatik.ipabs, // Burasının string olması gerekiyor.
            port: highestcokkarizmatik.port
        }).then((state) => {
            message.channel.send(`Toplamda ${state.players.length}/${state.maxplayers} Oyuncu var.`);
        }).catch((error) => {
            message.channel.send(`Bir Sorun Oluştu Lütfen Botun Geliştiricisine Başvurun..`);
        });
    }

    if (command === "istatistik") {

        Gamedig.query({
            type: 'csgo',
            host: highestcokkarizmatik.ipabs, // Burasının string olması gerekiyor.
            port: highestcokkarizmatik.port
        }).then((state) => {
            var players = state.players.map(player => player.name)
            var oyunculistesi = players.join(",\n")
            var kontrol;
            if (oyunculistesi.length <= 0) kontrol = `Sunucuda Kimse Bulunmuyor!`;
            if (oyunculistesi.length > 1) kontrol = oyunculistesi;

            let embed = new Discord.MessageEmbed()
                .setTitle("Sunucu İstatistikleri")
                .addField('❯ Sunucu İsmi', state.name, true)
                .addField('❯ Oynanan Harita', state.map, true)
                .addField('❯ Online Oyuncu', state.players.length, true)
                .addField('❯ Oyuncu Listesi:', kontrol)
                .addField('❯ Max Oyuncu', state.maxplayers, true)


            .setTimestamp()
                .setColor('AQUA')
            message.channel.send(embed)
        }).catch((error) => {
            message.channel.send(`Bir Sorun Oluştu Lütfen Botun Geliştiricisine Başvurun.`);
        });
    }




})





botclient.login(highestcokkarizmatik.token);