const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});


let memberID = context.params.event.member.user.id;
let serverID = context.params.event.guild_id;
let storedValue = context.params.event.data.options[0].value;
let creatorAssets = [];
const token = context.params.event.token;
const role = context.params.event.member.roles;
console.log(role);

let creatorWallet = await lib.utils.kv.get({
  key: "CreatorWallet0: " + serverID,
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
  let assetResult = await lib.http.request['@1.1.6'].get({
    url: 'https://algoexplorerapi.io/v2/accounts/' + creatorWallet // required
  });
  for (let i =0; i < assetResult.data.assets.length; i++){
    creatorAssets.push(assetResult.data.assets[i]['asset-id'])
  }
  
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
    if (creatorAssets.includes(result.data.assets[i]['asset-id']) && result.data.assets[i].amount > 0 ){
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