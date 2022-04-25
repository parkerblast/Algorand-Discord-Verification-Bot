const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

let collectionName = context.params.event.data.options[0].value;
let serverID = context.params.event.guild_id;
let userRoles = context.params.event.member.roles;
let roleName = '';
let adminRole = '';
const token = context.params.event.token;

console.log(collectionName)
let roles = await lib.discord.guilds['@0.0.6'].roles.list({
  guild_id: serverID,
});

for (let i = 0; i < roles.length; i++){
  if (roles[i].name == 'Admin'){
    adminRole = roles[i].id;
  }
}

if (userRoles.includes(adminRole)){
  
  await lib.utils.kv['@0.1.16'].set({
    key: "CollectionName: " + serverID,
    value: collectionName,
  });

  let followup = await lib.discord.interactions['@1.0.0'].responses.ephemeral.create({
    token: `${context.params.event.token}`,
    content: `Collection Name has been set to ` + '**' + collectionName + '**',
  });
}
else {
  let followup = await lib.discord.interactions['@1.0.0'].followups.responses.create({
    token: `${context.params.event.token}`,
    content: 'You do not have permissions to use this command!',
  });
}