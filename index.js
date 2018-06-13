const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token, historique_id, rappels_id, delay} = require('./config.json')

const archis = fs.readFileSync('./data/Monsters_Database.txt').toString().split('\n')
const archis_1 = fs.readFileSync('./data/Monsters_Database_original.txt').toString().split('\n')

for (var i = 0; i < 286; i++) {
	archis[i] = archis[i].split(' || ')
	archis_1[i] = archis_1[i].split(' || ')[0]
}

const client = new Discord.Client()

client.login(process.env.TOKEN)

client.on("ready", () => {
	client.channels.get(456551886720466954).send('Logged in')
})
	
	
client.on('message', message =>{
	if (message.author.bot) return
	
	content = message.content
	index = content.indexOf(':')
	if (index >= 0) {

		hour_str = content.slice(index-1, index)
		if (index > 1 && content.charAt(index-2) in '123456789'.split('')){
		hour_str = content.slice(index-2, index)
		}
		hour = (Number(hour_str) + 12) % 24 
		min_str = content.slice(index+1, index+3)
		min = Number(min_str)
	archi = content.slice(index+3,).toLowerCase()
	while ('abcdefghijklmnopqrstuvwxyz'.split('').indexOf(archi[0]) === -1){
		archi = archi.slice(1,)
	}
	var occurences = 0
	var archi_index = -1
	for (var i = 0; i < 286; i++){
		if (archis[i][0].toLowerCase().match(archi)){
			occurences += 1
			archi_index = i
		}
	}
	if			(occurences == 0){
		message.channel.send('Aucun archimonstre correspondant.')
	} else if	(occurences >  1){
		message.channel.send("Plusieurs correspondances. Préciser le nom de l'archimonstre.")
	} else if 	(occurences == 1){
		console.log(archi_index)
		archi_name = archis_1[archi_index]
		console.log(archi_name)
		
		archi_pic  = archis[archi_index][1].slice(0,42)+archis[archi_index][1].slice(64,)
		message.react('👌')
		client.channels.get(historique_id).send(`**${archi_name}** va repop à **${hour}:${min_str}**`, {files: [archi_pic]})
		
		var now = new Date()
		var leftMillis = new Date(now.getFullYear(), now.getMonth(), now.getDate(), (hour-2) % 24, min, 0, 0) - now - delay*60*1000
		if (leftMillis < 0) {
			leftMillis += 86400000
		}

		(function(archi_name, archi_pic, hour, min_str){
			setTimeout(function() {
				client.channels.get(rappels_id).send(`**${archi_name}** va repop dans **${delay}mn** **(${hour}:${min_str})** @everyone`, {files: [archi_pic]})
			}, leftMillis)
		})(archi_name, archi_pic, hour, min_str);
	}
	}
})
