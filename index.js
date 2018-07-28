// PRODUCTION by FrelonMCR2#4988
// 2018

const Discord = require("discord.js");
const bot = new Discord.Client();
const fs = require("fs");
var currentGame = 0;
var random = 0;
var pinMessage = false;
var usersChannelsId = ["465154316639010856", "468689435928690688", "469413510518931456", "469413529552683008", "469413544690057227", "469413561001705475", "469413576839528458", "469413592467505173", "469413606685933578", "469413620237729794"];

function admin(member) {
	if (member.roles.find("name", "Administrateur") || member.roles.find("name", "Modérateur")) {
		return true;
	}
	else {
		return false;
	}
};

function log(type, member, message) {
	let lineLog = JSON.stringify(new Date()).split('"')[1];
	let date = lineLog.split("T")[0];
	lineLog = lineLog.split("T")[1].split("Z")[0]
	lineLog = "\n[" + lineLog + "] ";
	switch (type) {
		case "message":
			lineLog += "MESSAGE " + message.id + " by " + member + "/" + message.author.username + "/" + member.displayName + ' in channel "' + message.channel.name + '" : ' + message;
			break;
		case "messageUpdate":
			if (member !== undefined && member !== null) {
				lineLog += "MESSAGE UPDATE " + message.id + " by " + member + "/" + message.author.username + "/" + member.displayName + " : " + message;
			}
			break;
		case "messageDelete":
			if (member !== undefined && member !== null) {
				lineLog += "DELETED MESSAGE " + message.id + " by " + member + "/" + message.author.username + "/" + member.displayName + " : " + message;
			}
			break;
		case "newMember":
			lineLog += "NEW MEMBER " + " : " + member + "/" + member.user.username + "/" + member.displayName;
			break;
		case "guildMemberRemove":
			lineLog += "MEMBER LEFT " + " : " + member + "/" + member.user.username + "/" + member.displayName;
			break;
		case "voiceStateUpdate":
			lineLog += "VOICE STATE UPDATE " + " by " + member + "/" + member.user.username + "/" + member.displayName + " : ";
			if (member.voiceChannel === undefined) {
				lineLog += "disconnection" ;
			}
			else if (member.mute) {
				lineLog += "muted in channel " + member.voiceChannel.name;
			}
			else {
				lineLog += "unmuted in channel " + member.voiceChannel.name;
			} 
			break;
		case "botMessage":
			lineLog += "BOT MESSAGE : " + message.id;
			if (message.mentions.users.size > 0) {
				lineLog += " mentioning " + message.mentions.users.first().id;
			}
			break;
	}
	let channelLogs = bot.guilds.find('id', "398872980404437013").channels.get("465499769020874753");
	channelLogs.fetchMessage(channelLogs.lastMessageID).then(function(logs) {
		let dateLogs = JSON.stringify(logs.createdAt).split('"')[1].split("T")[0];
		if (dateLogs !== date) {
			let channelWarns = bot.guilds.find('id', "398872980404437013").channels.get("465153382231834625");
			channelWarns.fetchMessage(channelWarns.lastMessageID).then(function(Warns) {
				Warns = JSON.parse(Warns);
				for (let i = 0; i < Warns.length; i++) {
					if (Warns[i].type === "banTemp") {
						let date = new Date();
						let day = date.getDate();
						if (day > 7) {
							date = (day - 7) + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
						}
						else {
							let month = date.getMonth();
							let year = date.getFullYear();
							day = day - 7;
							switch (date.getMonth()) {
								case 0:
									year = date.getFullYear() - 1;
									month = 12
									day = 31 + day;
									break;
								case 2:
									if (date.getFullYear() % 4 === 0) {
										day = 29 + day;
									}
									else {
										day = 28 + day;
									}
									break;
								case 1:
								case 3:
								case 5:
								case 7:
								case 8:
								case 10:
									day = 31 + day;
									break;
								case 4:
								case 6:
								case 9:
								case 11:
									day = 30 + day;
							}
							date = day + "/" + month + "/" + year;
						}
						if (date === Warns[i].date.split(" ")[0]) {
							bot.fetchUser(Warns[i].id).then(function(user) {
								user.createDM().then(function (channel) {
					    			message.guild.channels.get("398877931587239936").createInvite({maxUses:1, unique: true, reason:"Débannissement"}).then(function (invite) {
					    				return channel.send("L'accès au serveur Boaki & Wiloki | www.boakiactu.fr t'es réouvert dans la journée.\n\nCette fois ci, essayes de mieux respecter les règles :wink:\n\n" + invite.url)
					    			});
					    		});
							});
						}
					}
				}	
			});
		}
	});
	channelLogs.send(lineLog);
};

function setGame() {
	let channelSetgame = bot.guilds.find('id', "398872980404437013").channels.get("464047656013135882");
	channelSetgame.fetchMessage(channelSetgame.lastMessageID).then(function(gamePlayed) {
		gamePlayed = JSON.parse(gamePlayed);
		if (gamePlayed.random) {
			let currentRandom = random;
			random = Math.floor(Math.random() * Math.floor(gamePlayed.games.length));
			if (random !== currentRandom) {
				bot.user.setActivity(gamePlayed.games[random], { type: gamePlayed.gamesType[random]});
			}
			else {
			}
		}
		else {
			if (currentGame === gamePlayed.games.length - 1) {
				currentGame = 0;
			}
			else {
				currentGame++;
			}
			bot.user.setActivity(gamePlayed.games[currentGame], { type: gamePlayed.gamesType[currentGame]});
		}
	});	
};

bot.on('ready', function () {
	let channelSetgame = bot.guilds.find('id', "398872980404437013").channels.get("464047656013135882");
	channelSetgame.fetchMessage(channelSetgame.lastMessageID).then(function(gamePlayed) {
		gamePlayed = JSON.parse(gamePlayed);
		var gameTimer = setInterval(setGame, (gamePlayed.seconds * 1000));
		if (gamePlayed.random) {
			bot.user.setActivity(gamePlayed.games[random], { type: gamePlayed.gamesType[random]});
		}
		else {
			bot.user.setActivity(gamePlayed.games[currentGame], { type: gamePlayed.gamesType[currentGame]});
		}
	});	
});

bot.on("guildMemberAdd", function (member) {
	for (let i = 0; i < usersChannelsId.length; i++) {
		let channelUsers = bot.guilds.find('id', "398872980404437013").channels.get(usersChannelsId[i]);
		channelUsers.fetchMessage(channelUsers.lastMessageID).then(function(Users) {
			let UsersString = Users;
			Users = JSON.parse(Users);
			let edit = false;
			for (let i = 0; i < Users.length; i++) {
				if (Users[i].id === member.id) {
					edit = true;
					log("newMember", member);
					i = 150;
				}
			}
			if (edit !== true) {
				if (UsersString.content.length < 1600) {
					member.createDM().then(function (channel) {
						return channel.send("Bienvenue " + member.displayName + " sur le discord officiel de Boaki Actu !\n\n\nRégles du serveur :\n\n:small_blue_diamond:  Nous tenons à une ambiance de paix au sein de cette communauté. Pour cela, il est interdit de critiquer ou d'insulter une personne pour sa nationalité, ses origines, sa religion, son orientation sexuelle, son genre, ses choix de vie, sa classe sociale, ses opinions politiques, ses goûts personnels, son poids, sa taille ou sa santé (physique ou mentale). Les provocations, diffamations, moqueries et harcèlements sont interdits.\n\n:small_orange_diamond:  Le respect est l'une des valeurs principales de cette communautée. Veuillez donc respecter autruis, que ce soit membre ou staff.\n:small_orange_diamond: Pas de spam, pas d'abus de majuscules. Essayez d'écrire sans faire trop de fautes d'orthographe.\n:small_orange_diamond: Les images pornographiques et violentes sont interdites.\n\n:large_blue_diamond:  Rôle de la modération :\n:one:  Accueillir les nouvelles et les nouveaux à l'arrivée.\n:two:  Sanctionner les personnes qui ne respectent pas le règlement\n:three:  Transmettre à @FrelonMCR2 (alias Pokebal) les suggestions des membres.\n:four:  Assister @FrelonMCR2 dans certaines décisions.\n:arrow_right:  D'autres responsabilités qu'il n'est pas nécessaire de citer.\n\n:small_orange_diamond: Merci d'éviter de couper la parole aux autres dans les salons vocaux. Mis à part les salons #fun et Salon du fun (Vocal), le sujet des autres salons doit être basé autour des différents univers développés par Gibcom Multimedia.\n\n:small_blue_diamond:  Evidemment, le non-respect des règles entrainera des sanctions.");
					});
					var profile = {
						id: member.id,
						boaki: "undefined",
						wiloki: "undefined",
						boakiActu: "undefined",
						mentionWiloki: 0,
						mentionDiscord: 0,
						warn: 0,
						kick: 0,
						ban: 0
					};
					Users.push(profile);
					jsonUsers = JSON.stringify(Users, null, 4);
					channelUsers.send(jsonUsers);
					log("newMember", member);
				}
			}
		});
		let channelLog = bot.guilds.find('id', "398872980404437013").channels.get("465499769020874753");
		if (channelLog.fetchMessage(channelLog.lastMessageID).then(function(msg) {
			if (msg.content.split("] ")[1].split(" :")[0] === "NEW MEMBER") {
				i = 150;
				return true
			}
		})) {
			i = 150;
		}
	}
});

bot.on("guildMemberRemove", function (member) {
	log("guildMemberRemove", member)
});

bot.on("messageDelete", function (message) {
	log("messageDelete", message.member, message)
});

bot.on("voiceStateUpdate", function (oldMember, newMember) {
	log("voiceStateUpdate", newMember);
});

bot.on("messageUpdate", function (oldMessage, newMessage) {
	log("messageUpdate", newMessage.member, newMessage)
});

bot.on("message", function (message) {
	if (message.guild !== null) {
		let devBot = message.guild.channels.get("399534429577543680");
		if (message.author.id === "399489474205319179") {
			if (message.channel.id !== "465499769020874753" && message.channel.id !== "465154316639010856" && message.channel.id !== "465153382231834625" && message.channel.id !== "464047656013135882" && message.channel.id !== "468689435928690688" && message.channel.id !== "469413510518931456" && message.channel.id !== "469413529552683008" && message.channel.id !== "469413544690057227" && message.channel.id !== "469413561001705475" && message.channel.id !== "469413576839528458" && message.channel.id !== "469413592467505173" && message.channel.id !== "469413606685933578" && message.channel.id !== "469413620237729794") {
				log("botMessage", message.member, message);
				if (pinMessage) {
					message.pin();
					pinMessage = false;
				}
			}
		}
		else {
			if (message.channel.id !== "465499769020874753" && message.channel.id !== "465154316639010856" && message.channel.id !== "465153382231834625" && message.channel.id !== "464047656013135882" && message.channel.id !== "468689435928690688" && message.channel.id !== "469413510518931456" && message.channel.id !== "469413529552683008" && message.channel.id !== "469413544690057227" && message.channel.id !== "469413561001705475" && message.channel.id !== "469413576839528458" && message.channel.id !== "469413592467505173" && message.channel.id !== "469413606685933578" && message.channel.id !== "469413620237729794") {
				log("message", message.member, message);
			}			
		}	
		if (message.content.startsWith("!cmd") || message.content.startsWith("!help") || message.content.startsWith("!aide")) {
			message.delete();
			let cmds = "Le bot " + bot.user + " appartient et est entiérement développé par Boaki Actu | www.boakiactu.fr\nLa documentation est disponible avec la commande !doc.";
			let args = message.content.split(" ");
			if (args[1] == "admin" && admin(message.member)) {
				cmds += "\n\nListe des commandes : \n\n:small_blue_diamond: !aide [prm]\n:small_blue_diamond: !report <arg-1> <arg-2>\n:small_blue_diamond: !ping\n:small_orange_diamond: !setgame [<prm> <arg-1> [<arg-2>]]\n:small_orange_diamond: !say [prm] <arg>\n:small_orange_diamond: !file [prm] <arg>\n:small_orange_diamond: !ver [prm] <arg-2> <arg-3>\n:small_orange_diamond: !profil <arg-1> [<prm> <arg-2>]\n:small_orange_diamond: !documentation\n:small_orange_diamond: !log <arg>\n:small_orange_diamond: !warn <arg-1> <arg-2>\n:small_orange_diamond: !article [prm] <arg-1> <arg-2>\n:small_orange_diamond: !sanction <arg>\n:small_orange_diamond: !mentionWiloki [<prm> <arg>]\n:small_orange_diamond: !purge <arg-1> [arg-2]";
				devBot.send(message.author + ", " + cmds);
			}
			else {
				message.member.createDM().then(function (channel) {
					bot.fetchUser("178165057102938112").then(function(user) {
		    			cmds += "\nPour plus d'informations concernant son développement, contacter " + user + ".\n\n:small_blue_diamond:Profils :\n\n	Il est possible de voir le profil d'un membre avec la commande '!profil @membre'.\n	Il est possible de compléter ton profil avec ton pseudo Boaki, Wiloki, et Boaki Actu.\n	Par exemple, si tu veux ajouter ton pseudo Wiloki, utilise la commande '!profil edit Wiloki pseudo'\n\n:small_blue_diamond: Si tu vois un membre qui ne respectes pas les règles, tu peux également le signaler avec la commande '!report pseudo raison'.\n\n\nCe bot facilite également la gestion du discord et la modération.";
		    			return channel.send(cmds);
		    		});
				});
			}
		}
		else if (message.content === "!ping") {
			message.delete();
			message.reply("Pong !");
		}
		else if (message.content.startsWith("!log") && admin(message.member)) {
			message.delete();
			let args = message.content.split(" ");
			args.shift();
			if (args[0] === "true") {
				message.guild.channels.get("465499769020874753").overwritePermissions(message.author, {
					VIEW_CHANNEL: true
				});
			}
			else if (args[0] === "false") {
				message.guild.channels.get("465499769020874753").overwritePermissions(message.author, {
					VIEW_CHANNEL: false
				});
			}
			else {
				devBot.send(message.author + ", Synthaxe : !log <arg>");
			}
		}
		else if (message.content.startsWith("!say") && admin(message.member)) {
			message.delete();
			let args = message.content.split(" ");
			args.shift();
			if (args[0] === "pin") {
				args.shift();
				pinMessage = true;
			}
			args = args.join(" ");
			if (args !== "") {
				message.channel.send(args);
			}
			else {
				devBot.send(message.author + ", Synthaxe : !say [prm] <arg>");
			}
		}
		else if (message.content.startsWith("!file") && admin(message.member)) {
			message.delete();
			let args = message.content.split(" ");
			args.shift();
			if (args[0] === "pin") {
				args.shift();
				pinMessage = true;
			}
			args = args.join(" ");
			if (args !== "") {
				message.channel.send({files:[args]});
			}
			else {
				devBot.send(message.author + ", Synthaxe : !file [prm] <arg>");
			}
		}
		else if (message.content.startsWith("!ver") && admin(message.member)) {
			message.delete();
			let args = message.content.split(" ");
			args.shift();
			let embedVer = new Discord.RichEmbed();
			if (args.length > 0) {
				switch (args[0].toLowerCase()) {
					case "bleu":
						embedVer.color = 0x1150B9;
						args.shift();
						break;
					case "vert":
						embedVer.color = 0x00FF00;
						args.shift();
						break;
					case "orange":
						embedVer.color = 0xFF4300;
						args.shift();
						break;
					case "rouge":
						embedVer.color = 0xFF0000;
						args.shift();
						break;
					case "violet":
						embedVer.color = 0x9900FF;
						args.shift();
						break;
				}
				embedVer.title = "Discord version " + args[0];
				args.shift();
				if (args.length > 0) {
					args = args.join(" ");
					args = args.split("|");
					embedVer.description = "";
					for (let i = 0; i < args.length; i++) {
						embedVer.description += "\n:small_blue_diamond: " + args[i];
					}
					embedVer.description += "\n\nwww.boakiactu.fr";
					message.channel.send({embed: embedVer})
				}
				else {
					devBot.send(message.author + ", !ver [prm] <arg-2> <arg-3>");
				}
			}
			else {
				devBot.send(message.author + ", !ver [prm] <arg-2> <arg-3>");
			}
		}
		else if (message.content.startsWith("!setGame") && admin(message.member)) {
			message.delete();
			let args = message.content.split(" ");
			args.shift();
			let channelSetgame = message.guild.channels.get("464047656013135882");
			channelSetgame.fetchMessage(channelSetgame.lastMessageID).then(function(gamePlayed) {
				gamePlayed = JSON.parse(gamePlayed);
				let jsonGamePlayed = "";
				switch (args[0]) {
					case "seconds":
						if (Number(args[1]) >= 10) {
							gamePlayed.seconds = Number(args[1]);
							devBot.send(message.author + ", Le délai de changement de jeu a été défini sur " + args[1]);
						}
						else if (Number(args[1]) > 1) {
							gamePlayed.seconds = Number(args[1]);
							devBot.send(message.author + ", ATTENTION : Risque de changement innapliqué croissant en diminuant le délai en dessous de 10 secondes. Délai défini sur " + args[1]);
						}
						else {
							devBot.send(message.author + ", ATTENTION : Risque de changement innapliqué croissant en diminuant le délai en dessous de 10 secondes. Le délai n'a pas été défini.");
						}
						jsonGamePlayed = JSON.stringify(gamePlayed, null, 4);
						channelSetgame.send(jsonGamePlayed);
						clearInterval(gameTimer);
						gameTimer = setInterval(setGame, (gamePlayed.seconds * 1000));
						break;
					case "random":
						switch (args[1]) {
							case "true":
								devBot.send(message.author + ", L'aléatoire a bien été activé.");
								gamePlayed.random = true;
								break;
							case "false":
								devBot.send(message.author + ", L'aléatoire a bien été désactivé");
								gamePlayed.random = false;
								break;
							default:
								devBot.send(message.author + ", Synthaxe : !setgame [<prm> <arg-1> [<arg-2]]");
								break;
						}
						jsonGamePlayed = JSON.stringify(gamePlayed, null, 4);
						channelSetgame.send(jsonGamePlayed);
						break;
					case "game":
						if (Number(args[1]) > 0 && Number(args[1]) < 11) {
							if (args[2] === "none") {
								gamePlayed.games.splice((Number(args[1]) - 1), 1);
								devBot.send(message.author + ", Le jeu numéro" + args[1] + " a bien été retiré");
							}
							else if (args[2] !== undefined) {
								let nbGame = args[1];
								args.shift();
								args.shift();
								args = args.join(" ");
								gamePlayed.games[(Number(nbGame) - 1)] = args;
								devBot.send(message.author + ", Le jeu " + nbGame + " a bien été défini sur " + args);
							}
							else {
								devBot.send(message.author + ", Nombre maximum de 10 jeux.");
							}
							jsonGamePlayed = JSON.stringify(gamePlayed, null, 4);
							channelSetgame.send(jsonGamePlayed);
						}
						else {
							devBot.send(message.author + ", Synthaxe : !setgame [<prm> <arg-1> [<arg-2]]");
						}
						break;
					case "type":
						if (Number(args[1]) > 0 && Number(args[1]) < 11) {
							if (args[2].toLowerCase() === "playing" || args[2].toLowerCase() === "streaming" || args[2].toLowerCase() === "listening" || args[2].toLowerCase() === "watching") {
								gamePlayed.gamesType[(Number(args[1]) - 1)] = args[2].toUpperCase();
								devBot.send(message.author + ", Le type du jeu " + args[1] + " a bien été défini sur " + args[2]);
							}
							else {
								devBot.send(message.author + ", Synthaxe : !setgame [<prm> <arg-1> [<arg-2]]");
							}
							jsonGamePlayed = JSON.stringify(gamePlayed, null, 4);
							channelSetgame.send(jsonGamePlayed);
						}
						else {
							devBot.send(message.author + ", Synthaxe : !setgame [<prm> <arg-1> [<arg-2]]");
						}
						break;
					default:
						let embedGamePlayed = new Discord.RichEmbed();
						embedGamePlayed.color = 0x1150B9;
						embedGamePlayed.title = "Admin ==> Configuration des jeux du bot";
						embedGamePlayed.description = ":small_blue_diamond: Changement de jeu : " + gamePlayed.seconds + " secondes\n:small_blue_diamond: Aléatoire : " + gamePlayed.random;
						for (let i = 0;i < gamePlayed.games.length; i++) {
							embedGamePlayed.description = embedGamePlayed.description + "\n:small_blue_diamond: Jeu " + (i + 1) + ' : "' + gamePlayed.games[i] + '" de type ' + gamePlayed.gamesType[i];
						}
						devBot.send({embed: embedGamePlayed});
						break;
				}
			});
		}
		else if (message.content.startsWith("!warn") && admin(message.member)) {
			message.delete();
			args = message.content.split(" ");
			args.shift();
			args.shift();
			args = args.join(" ");
			if (args !== "") {
				if (message.mentions.users.size > 0) {
					let idMention = message.mentions.users.first().id;
					let channelWarns = message.guild.channels.get("465153382231834625");
					channelWarns.fetchMessage(channelWarns.lastMessageID).then(function(Warns) {
						Warns = JSON.parse(Warns);
						for (let i = 0; i < usersChannelsId.length; i++) {
							let channelUsers = bot.guilds.find('id', "398872980404437013").channels.get(usersChannelsId[i]);
							channelUsers.fetchMessage(channelUsers.lastMessageID).then(function(Users) {
								Users = JSON.parse(Users);
								let nbUser = -1;
								for (let i = 0; i < Users.length; i++) {
									if (Users[i].id === idMention) {
										Users[i].warn += 1;
										nbUser = i;
									}
								}
								if (nbUser !== -1) {
									let type = "warn";
									if (Users[nbUser].warn === 3 || Users[nbUser].warn === 6 || Users[nbUser].warn === 9) {
										type = "kick";
										Users[nbUser].kick += 1;
										if (Users[nbUser].kick === 3 || Users[nbUser].kick === 6) {
											type = "banTemp";
											Users[nbUser].ban += 1;
											if (Users[nbUser].ban === 2) {
												type = "banDef";
												Users[nbUser].ban = "Définitif";
											}
										}
									}
									let date = new Date;
									date = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " à " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
									var warn = {
										id: idMention,
										date: date,
										reason: args,
										author: message.author.id,
										type: type
									};
									Warns.push(warn);
									Users = JSON.stringify(Users, null, 4);
									channelUsers.send(Users);
									Warns = JSON.stringify(Warns, null, 4);
									channelWarns.send(Warns);
									bot.fetchUser(warn.id).then(function(targetUser) {
									    message.guild.fetchMember(targetUser).then( function(targetMember) {
									    	let embedWarn = new Discord.RichEmbed();
									    	embedWarn.description = "\nMembre : " + targetMember.displayName + "\nSanction : ";
											embedWarn.color = 0xFF0000;
											embedWarn.title = ":small_red_triangle: SANCTION";
											embedWarn.setThumbnail(url=targetUser.avatarURL);
											switch (type) {
												case "warn":
													embedWarn.description += "Avertissement";
													break;
												case "kick":
													embedWarn.description += "Exclusion";
													break;
												case "banTemp":
													embedWarn.description += "Bannissement temporaire (1 semaine)";
													break;
												case "banDef":
													embedWarn.description += "Bannissement définitif";
													break;
											}
											bot.fetchUser(warn.author).then(function(authorUser) {
									    		message.guild.fetchMember(authorUser).then( function(authorMember) {
													embedWarn.description += "\nDate : " + warn.date + "\nRaison : " + warn.reason + "\nAuteur : " + authorMember.displayName;
													message.channel.send({embed: embedWarn});
													targetMember.createDM().then(function (channel) {
														return channel.send({embed: embedWarn});
													}).then(function() {
														switch (type) {
														case "kick":
															targetMember.kick(warn.reason);
															break;
														case "banTemp":
															targetMember.ban({days: 7, reason: warn.reason});
															break;
														case "banDef":
															targetMember.ban(warn.reason);
															break;
														}
													});
												});
											});
									    });
									});
								}
							});
						}
					});				
				}
				else {
					devBot.send(message.author + ", Le membre ciblé doit être mentionné");
				}
			}
			else {
				devBot.send(message.author + ", Synthaxe : !warn <arg-1> <arg-2>");
			}
		}
		else if (message.content.startsWith("!profil")) {
			message.delete();
			let args = message.content.split(" ");
			args.shift();
			let user = message.author.id;
			if (message.mentions.users.size > 0) {
				user = message.mentions.users.first().id;
			}
			let embedUser = new Discord.RichEmbed();
			let pass = false;
			if (args[0] === "edit") {
				pass = true;
			}
			args2 = args;
			args2.shift();
			for (let i = 0; i < usersChannelsId.length; i++) {
				let channelUsers = bot.guilds.find('id', "398872980404437013").channels.get(usersChannelsId[i]);
				channelUsers.fetchMessage(channelUsers.lastMessageID).then(function(Users) {
					Users = JSON.parse(Users);
					if (pass == true) {
						pass = true;
						let check = false;
						for (let i = 0;i < Users.length; i++) {
							if (Users[i].id === message.member.id) {
								check = true;
								switch (args[0].toLowerCase()) {
									case "boaki":
										args2.shift();
										args2 = args2.join(" ");
										Users[i].boaki = args2;
										message.reply("Ton pseudo Boaki a été modifié vers : " + Users[i].boaki)
										break;
									case "wiloki":
										args2.shift();
										args2 = args2.join(" ");
										Users[i].wiloki = args2;
										message.reply("Ton pseudo Wiloki a été modifié vers : " + Users[i].wiloki)
										break;
									case "boakiactu":
										args2.shift();
										args2 = args2.join(" ");
										Users[i].boakiActu = args2;
										message.reply("Ton pseudo Boaki Actu a été modifié vers : " + Users[i].boakiActu + "\nUn lien est désormais disponible vers votre ton Boaki Actu. Si le lien est incorrect, vérifie que le pseudo saisi est bien identique à celui de ton profil Boaki Actu.");
										break;
									default:
										message.reply("Les informations modifiables sont : boaki, wiloki et boakiActu");
										break;
								}
								i = 150;
							}
						}
						if (check === true) {
							jsonUsers = JSON.stringify(Users, null, 4);
							channelUsers.send(jsonUsers);
						}						
					}
					else {
						for (let i = 0;i < Users.length; i++) {
							if (Users[i].id === user) {
								embedUser.color = 0xFF4300;
								bot.fetchUser(Users[i].id).then(function(user) {
									message.guild.fetchMember(user).then( function(member) {
										let avatarURL = user.avatarURL;
										if (avatarURL === null) {
											avatarURL = "https://static.blog4ever.com/2010/07/424747/img" + (Math.floor(Math.random() * Math.floor(6)) + 1) + ".png";
										}
										embedUser.setThumbnail(url=avatarURL);
										embedUser.title = "Utilisateur - " + member.displayName;
										let date = member.joinedAt;
										date = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " à " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
										embedUser.description = ":small_blue_diamond: Arrivée : " + date;
										if (Users[i].boaki !== "undefined") {
											embedUser.description += "\n:small_blue_diamond: Pseudo Boaki : " + Users[i].boaki;
										}
										if (Users[i].wiloki !== "undefined") {
											embedUser.description += "\n:small_blue_diamond: Pseudo Wiloki : " + Users[i].wiloki;
										}
										if (Users[i].boakiActu !== "undefined") {
											embedUser.description += "\n:small_blue_diamond: Pseudo Boaki Actu : " + Users[i].boakiActu;
											embedUser.url = "http://www.boakiactu.fr/membres/" + Users[i].boakiActu;
										}
										if (Users[i].warn > 0) {
											embedUser.description += "\n:small_red_triangle: Avertissement : " + Users[i].warn;
										}
										if (Users[i].kick > 0) {
											embedUser.description += "\n:small_red_triangle: Exclusion : " + Users[i].kick;
										}
										if (Users[i].ban > 0 || Users[i].ban === "Définitif") {
											embedUser.description += "\n:small_red_triangle: Bannissement : " + Users[i].ban;
										}
										switch (Users[i].mentionWiloki) {
											case 1:
												embedUser.description += "\n:small_orange_diamond: Top #1 Wiloki !";
												break;
											case 2:
												embedUser.description += "\n:small_orange_diamond: Top #5 Wiloki !";
												break;
											case 3:
												embedUser.description += "\n:small_orange_diamond: Top #10 Wiloki !";
												break;
											case 4:
												embedUser.description += "\n:small_orange_diamond: Top #25 Wiloki !";
												break;
											case 5:
												embedUser.description += "\n:small_orange_diamond: Top #50 Wiloki !";
												break;
											case 6:
												embedUser.description += "\n:small_orange_diamond: Top #100 Wiloki !";
												break;
										}
										switch (Users[i].mentionDiscord) {
											case 1:
												embedUser.description += "\n:small_orange_diamond: Administrateur discord !";
												break;
											case 2:
												embedUser.description += "\n:small_orange_diamond: Modérateur discord !";
												break;
										}
										message.channel.send({embed: embedUser});
									});
								});
							}
						}
					}
				});
			}		
		}
		else if ((message.content === "!documentation" || message.content === "!doc") && admin(message.member)) {
			message.delete();
			devBot.send("Documentation du bot :", {files:[{attachment:"documentation.pdf"}]});
		}
		else if (message.content.startsWith("!purge") && admin(message.member)) {
			message.delete();
			let args = message.content.split(" ");
			let user;
			if (message.mentions.users.size > 0) {
				user = message.mentions.users.first();
				args.shift();
			}
			args.shift();
			if (args.length !== 0 && Number(args.join(" ")) < 500) {
				args = Number(args.join(" "));
				message.channel.fetchMessages({limit: args + 1}).then(function(messages) {
		            messages.forEach(function(m) {
		            	if (user !== undefined) {;
		            		if (m.author.id === user.id) {
		            			m.delete();
		            		}
		            	}
		            	else {
		            		m.delete()
		            	}
		            });
		        });
			}
			else {
				devBot.send(message.author + ", Synthaxe : !purge <arg-1> [arg-2]");
			}
			
	    }
		else if (message.content.startsWith("!report")) {
			message.delete();
			let args = message.content.split(" ");
			args.shift();
			args.shift();
			if (message.mentions.users.size > 0) {
				if (args.length > 0) {
					let date = new Date;
					date = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " à " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
					let embedReport = new Discord.RichEmbed();
					embedReport.title = ":small_red_triangle: REPORT";
					embedReport.color = 0xFF0000;
					embedReport.setThumbnail(url=message.mentions.users.first().avatarURL);
					embedReport.description = "Membre : " + message.mentions.members.first() + "\nDate : " + date + "\nRaison : " + args.join(" ") + "\nAuteur : " + message.member;
					devBot.send(message.guild.roles.get("398874109930635297"), {embed: embedReport});
					message.member.createDM().then(function (channel) {
		    			let msg = "Ton report à bien été envoyé, merci !";
		    			return channel.send(msg);
		    		});
				}
				else {
					message.member.createDM().then(function (channel) {
						return channel.send("Synthaxe : !report @membre raison");
					});
				}
			}
			else {
				message.member.createDM().then(function (channel) {
					return channel.send("Dans un report, le joueur ciblé doit être mentionné !");
				});
			}
		}
		else if (message.content.startsWith("!article") && admin(message.member)) {
			message.delete();
			let args = message.content.split(" ");
			args.shift();
			let embedArticle = new Discord.RichEmbed();
			if (args.length > 0) {
				embedArticle.setThumbnail(url="https://static.blog4ever.com/2010/07/424747/logoDiscord_7613619.png");
				switch (args[0].toLowerCase()) {
					case "boaki":
						embedArticle.setThumbnail(url="https://static.blog4ever.com/2010/07/424747/logoBoaki.gif");
						args.shift();
						break;
					case "wiloki":
						embedArticle.setThumbnail(url="https://static.blog4ever.com/2010/07/424747/logoWiloki_7613624.png");
						args.shift();
						break;
				}
				embedArticle.title = bot.emojis.get("419819468961742848") + " Nouvel article Boaki Actu !";
				if (args.length > 0) {
					embedArticle.url = args[0];
					args.shift();
					if (args.length > 0) {
						args = args.join(" ");
						embedArticle.description = args + "\n\nwww.boakiactu.fr";
						embedArticle.color = 0xFF4300;
						message.channel.send(message.guild.roles.get("398872980404437013"), {embed: embedArticle})
					}
					else {
						devBot.send(message.author + ", !article [prm] <arg-1> <arg-2>");
					}
				}
				else {
					devBot.send(message.author + ", !article [prm] <arg-1> <arg-2>");
				}
			}
			else {
				devBot.send(message.author + ", !article [prm] <arg-1> <arg-2>");
			}
		}
		else if (message.content.startsWith("!sanction")) {
			message.delete();
			if (message.mentions.users.size > 0) {
				let user = message.mentions.members.first()
				let embedSanction = new Discord.RichEmbed();
				embedSanction.title = "Sanctions reçus par " + user.displayName;
				embedSanction.color = 0xFF0000;
				embedSanction.setThumbnail(url=message.mentions.users.first().avatarURL);
				let channelWarns = message.guild.channels.get("465153382231834625");
				channelWarns.fetchMessage(channelWarns.lastMessageID).then(function(Warns) {
					Warns = JSON.parse(Warns);
					let author = "";
					embedSanction.description = "";
					for (let i = 0;i < Warns.length; i++) {
						if (user.id === Warns[i].id) {
							switch (Warns[i].author) {
								case "178165057102938112":
									author = "Pokebal";
									break;
								case "238969660765241355":
									author = "Wawaque";
									break;
								case "288336619147231233":
									author = "Nowa";
									break;
							}
							embedSanction.description += ":small_orange_diamond: " + Warns[i].type + " donné par " + author + " le " + Warns[i].date + " pour : " + Warns[i].reason + "\n";
						}
					}
					if (embedSanction.description === "") {
						embedSanction.description = "Aucune";
					}
					devBot.send({embed: embedSanction});
				});				
			}
			else {
				devBot.send(message.author, + ", le membre ciblé doit être mentionné !");
			}
		}
		else if (message.content.startsWith("!mentionWiloki") && admin(message.member)) {
			message.delete();
			let args = message.content;
			args = args.split(" ");
			args.shift();
			if (args.length > 0) {
				if (message.mentions.users.size > 0) {
					let user = message.mentions.members.first();
					args.shift();
					if (args[0] >= 0 && args[0] < 7) {
						for (let i = 0; i < usersChannelsId.length; i++) {
							let channelUsers = bot.guilds.find('id', "398872980404437013").channels.get(usersChannelsId[i]);
							channelUsers.fetchMessage(channelUsers.lastMessageID).then(function(Users) {
								Users = JSON.parse(Users);
								for (let i = 0; i < Users.length; i++) {
									if (Users[i].id === user.id) {
										Users[i].mentionWiloki = Number(args[0]);
										jsonUsers = JSON.stringify(Users, null, 4);
										channelUsers.send(jsonUsers);
										devBot.send(message.author + ", la mention Wiloki de " + user + " a bien été défini sur " + args[0]);
									}
								}	
							});
						}
					}
					else {
						devBot.send(message.author + ", Synthaxe : !mentionWiloki [<prm> <arg>]");
					}
				}
				else {
					devBot.send(message.author + ", le membre ciblé doit être mentionné !");
				}
			}
			else {
				devBot.send(message.author + ", Synthaxe : !mentionWiloki [<prm> <arg>]\nValeurs possibles :\n1 : Top #1 Wiloki\n2 : Top #5 Wiloki\n3 : Top #10 Wiloki\n4 : Top #25 Wiloki\n5 : Top #50 Wiloki\n6 : Top #100 Wiloki");
			}
		}
	}
});

bot.login(process.env.TOKEN);
