const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

let memberID = context.params.event.member.user.id;
let serverID = context.params.event.guild_id;
const token = context.params.event.token;
const role = context.params.event.member.roles;
let options = [];
console.log(role);

let editFollowup = await lib.discord.interactions['@0.0.0'].followups.ephemeral.create({
  token: token,
  content: `We are attempting to flex! Select menu will appear soon!`,
});

let collectionName = await lib.utils.kv.get({
  key: "CollectionName: " + serverID,
});
let roleNeeded = await lib.utils.kv.get({
  key: "OwnerRole: " + serverID,
});
let creatorWallet = await lib.utils.kv.get({
  key: "CreatorWallet0: " + serverID,
});
let creatorWallet2 = await lib.utils.kv.get({
  key: "CreatorWallet1: " + serverID,
});
let creatorWallet3 = await lib.utils.kv.get({
  key: "CreatorWallet2: " + serverID,
});

let result = await lib.airtable.query['@1.0.0'].select({
  table: '926947845767049246', // required
  where: [
    {
      'memberID__is': memberID
    }
  ],
  limit: {
    'count': 1,
    'offset': 0
  }
});
let storedValue = result.rows[0].fields.walletString;
console.log(storedValue);

if (role.includes(roleNeeded) && storedValue != undefined){
    
    let result = await lib.http.request['@1.1.6'].get({
      url: 'https://algoexplorerapi.io/v2/accounts/' + storedValue // required
    });
    
    let assetID = [];
    let nameList = [];
    let ipfsList = [];
    
    for (let i = 0; i < result.data.assets.length; i++) {
      if (result.data.assets[i].creator == creatorWallet && result.data.assets[i].amount > 0 || result.data.assets[i].creator == creatorWallet2 && result.data.assets[i].amount > 0 || result.data.assets[i].creator == creatorWallet3 && result.data.assets[i].amount > 0 ){
        if (assetID.length < 24 ){
           assetID.push(result.data.assets[i]["asset-id"]);
        }
        else {
          break; 
        }
      } 
    }
    console.log(assetID);
    
    if (assetID.length == 0){
      let editFollowup = await lib.discord.interactions['@0.0.0'].followups.ephemeral.create({
        token: token,
        content: `No assets found in registered wallet!`,
      });
    }
    else{
      for (let i = 0; i < assetID.length; i++) {
        let result = await lib.http.request['@1.1.6'].get({
          url: 'https://algoindexer.algoexplorerapi.io/v2/assets/' + assetID[i] // required
        });
        let tempString = result.data.asset.params.url.split("/")[2]
        ipfsList.push("https://ipfsgateway.randgallery.com/ipfs/" + tempString.split("#")[0]);
        nameList.push(result.data.asset.params.name)
      }
      
      await lib.airtable.query['@1.0.0'].update({
          table: '926947845767049246', // required
          where: [
            {
              'memberID__is': memberID
            }
          ],
          limit: {
            'count': 1,
            'offset': 0
          },
          fields: {
            'ipfsList': ipfsList.toString(),
            'nameList': nameList.toString(),
            'assetID': assetID.toString()
          },
          typecast: false
        });
          
      for(let i =0; i < assetID.length; i++){
        options.push({
          "label": nameList[i].toString(),
          "value": i,
          "default": false
        });
      }
      options.push({
        "label": "All Assets, MAX 8",
        "value": "all",
        "default": false
      });
      console.log(options);
      
      await lib.discord.interactions['@0.1.0'].followups.ephemeral.create({
        token: token,
        "content": "Which " + collectionName + " would you like to flex?",
        "tts": false,
        "components": [
          {
            "type": 1,
            "components": [
              {
                "custom_id": `flexselectmenu`,
                "placeholder": `No Selection`,
                "options": options ,
                "min_values": 1,
                "max_values": 1,
                "type": 3
              }
            ]
          },
        ],
      });
    }
  }
  else{
    await lib.discord.interactions['@0.0.0'].followups.ephemeral.create({
      token: token,
      content: `You do not have the proper role to use this command! Try registering with /register!`,
  });
}