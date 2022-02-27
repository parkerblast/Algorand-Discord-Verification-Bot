const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});


let memberID = context.params.event.member.user.id;
let serverID = context.params.event.guild_id;
let storedValue = context.params.event.data.options[0].value;
const token = context.params.event.token;
const role = context.params.event.member.roles;
console.log(role);

let creatorWallet = await lib.utils.kv.get({
  key: "CreatorWallet0: " + serverID,
});
let creatorWallet2 = await lib.utils.kv.get({
  key: "CreatorWallet1: " + serverID,
});
let creatorWallet3 = await lib.utils.kv.get({
  key: "CreatorWallet2: " + serverID,
});
let roles = await lib.discord.guilds['@0.0.6'].roles.list({
  guild_id: serverID,
});

for (let i = 0; i < roles.length; i++){
  if (roles[i].name == 'Admin'){
    adminRole = roles[i].id;
  }
}

if (role.includes(adminRole) && storedValue != undefined){
  let result = await lib.http.request['@1.1.6'].get({
    url: 'https://algoexplorerapi.io/v2/accounts/' + storedValue // required
  });
  
  await lib.discord.channels['@0.2.0'].messages.create({
  "channel_id": `${context.params.event.channel_id}`,
  "content": `List of assets in **` + storedValue + "**!",
  });
  
  let assetID = [];
  let nameList = [];
  let ipfsList = [];
  let content = [];
  
  for (let i = 0; i < result.data.assets.length; i++) {
    if (result.data.assets[i].creator == creatorWallet && result.data.assets[i].amount > 0 || result.data.assets[i].creator == creatorWallet2 && result.data.assets[i].amount > 0 || result.data.assets[i].creator == creatorWallet3 && result.data.assets[i].amount > 0 ){
      if (assetID.length < 15 ){
         assetID.push(result.data.assets[i]["asset-id"]);
      }
      else {
        break;
      }
    } 
  }
  for (let i = 0; i < assetID.length; i++) {
    let result = await lib.http.request['@1.1.6'].get({
      url: 'https://algoindexer.algoexplorerapi.io/v2/assets/' + assetID[i] // required
    });
    ipfsList.push("https://ipfsgateway.randgallery.com/ipfs/" + result.data.asset.params.url.split("/")[2]);
    nameList.push(result.data.asset.params.name)
  }
  console.log(ipfsList);
  for (let i = 0; i < assetID.length; i++){
    content.push("Name: " + nameList[i] + " NFT Explorer: <https://www.nftexplorer.app/asset/" + assetID[i] + '> \n');
  }
  await lib.discord.channels['@0.2.0'].messages.create({
    "channel_id": `${context.params.event.channel_id}`,
    "content": content.join(' '),
    "tts": false,
  });
}