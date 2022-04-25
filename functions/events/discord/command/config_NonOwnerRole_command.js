const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

let roleID = context.params.event.data.options[0].value;
let serverID = context.params.event.guild_id;
let userRoles = context.params.event.member.roles;
let roleName = '';
let adminRole = '';
const token = context.params.event.token;

let roles = await lib.discord.guilds['@0.0.6'].roles.list({
  guild_id: serverID,
});
console.log(serverID, roleID);
for (let i = 0; i < roles.length; i++){
  if (roles[i].name == 'Admin'){
    adminRole = roles[i].id;
  }
}

if (userRoles.includes(adminRole)){
  await lib.utils.kv['@0.1.16'].set({
    key: "NonOwnerRole: " + serverID,
    value: roleID
  });
  console.log("HERE");
  for (let i = 0; i < roles.length; i++){
    if(roles[i].id == roleID){
      roleName = roles[i].name
    }
  }
  console.log("name found here");
  
  let followup = await lib.discord.interactions['@1.0.0'].responses.ephemeral.create({
    token: `${context.params.event.token}`,
    content: `Non Owner Role has been set to ` + '**' + roleName + '**',
  });
}
else {
  let followup = await lib.discord.interactions['@1.0.0'].responses.ephemeral.create({
    token: `${context.params.event.token}`,
    content: 'You do not have permissions to use this command!',
  });
}
  

