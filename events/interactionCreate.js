const cooldown = new Set();

module.exports = {
	name: 'interactionCreate',
	execute(interaction) {

		if(cooldown.has(interaction.member)){
			//interaction.deleteReply();
			interaction.reply(`${interaction.member} you are on cooldown wait 10 seconds until new command`);
			return 
		} else {
			//cooldown.add(interaction.member);
			console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered an interaction.`);
			
			// setTimeout(() => {
			// 	cooldown.delete(interaction.member);
			// }, 5000);
			
		}
		
		cooldown.add(interaction.member);
		
		setTimeout(() => {
			cooldown.delete(interaction.member);
		}, 5000);

	},
};