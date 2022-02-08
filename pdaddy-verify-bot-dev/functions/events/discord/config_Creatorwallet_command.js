const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

let walletStrings = context.params.event.data.options;
let serverID = context.params.event.guild_id;
let userRoles = context.params.event.member.roles;
let roleName = '';
let adminRole = '';
const token = context.params.event.token;
console.log(walletStrings[0].value);
let roles = await lib.discord.guilds['@0.0.6'].roles.list({
  guild_id: serverID,
});

for (let i = 0; i < roles.length; i++){
  if (roles[i].name == 'Admin'){
    adminRole = roles[i].id;
  }
}

if (userRoles.includes(adminRole)){
  console.log("HERE");
  for(let i = 0; i < walletStrings.length; i++)
  await lib.utils.kv['@0.1.16'].set({
    key: "CreatorWallet" + i.toString() + ": " + serverID,
    value: walletStrings[i].value
  });
  let result = await lib.utils.kv['@0.1.16'].entries();
  console.log(result);
  let followup = await lib.discord.interactions['@0.1.0'].followups.ephemeral.create({
    token: `${context.params.event.token}`,
    content: `Creator Wallets has been set to ` + '**' + walletStrings[0].value + '** and others if entered!',
  });
}
else {
  let followup = await lib.discord.interactions['@0.1.0'].followups.ephemeral.create({
    token: `${context.params.event.token}`,
    content: 'You do not have permissions to use this command!',
  });
}