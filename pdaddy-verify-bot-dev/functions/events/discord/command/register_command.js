const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

let walletString = context.params.event.data.options[0].value;
let memberID = context.params.event.member.user.id;
let serverID = context.params.event.guild_id;
const token = context.params.event.token;
console.log(walletString);

await lib.discord.interactions['@1.0.0'].responses.ephemeral.create({
  token: token,
  content: `<@!${context.params.event.member.user.id}> we are attempting to register your **wallet:** ` + walletString + ` **!**`,
  response_type: 'CHANNEL_MESSAGE_WITH_SOURCE'
});

let OwnerroleID = await lib.utils.kv.get({
  key: "OwnerRole: " + serverID,
});
let NonOwnerroleID = await lib.utils.kv.get({
  key: "NonOwnerRole: " + serverID,
});
let creatorWallet = await lib.utils.kv.get({
  key: "CreatorWallet0: " + serverID,
});
let logChannel = await lib.utils.kv.get({
  key: "logChannel: " + serverID,
})

let message = await lib.discord.channels['@0.2.0'].messages.create({
  "channel_id": logChannel,
  content: `<@!${context.params.event.member.user.id}> attempted to register this **wallet:** ` + walletString + ` **!**`,
});

let memberresult = await lib.airtable.query['@1.0.0'].distinct({
  table: '926947845767049246', // required
  where: [
    {
      'memberID__not_null': true
    }
  ],
  limit: {
    'count': 0,
    'offset': 0
  },
  field: 'memberID'
});
console.log(memberresult);

if (memberresult.distinct.values.includes(memberID)){
  let result = await lib.airtable.query['@1.0.0'].update({
    table: '926947845767049246', // required
    where: [
      {
        'memberID__is': memberID
      }
    ],
    limit: {
      'count': 0,
      'offset': 0
    },
    fields: {
      'memberID': memberID,
      'walletString': walletString,
    },
    typecast: false
  });
}
else{
  let result = await lib.airtable.query['@1.0.0'].insert({
    table: '926947845767049246',
    fieldsets: [
      {
        'memberID': memberID,
        'walletString': walletString
      }
    ],
    typecast: false
  });
}

const currentTime = new Date();
mathTime = new Date(currentTime - 300000);
finalTime = mathTime.toISOString();
console.log(finalTime);

let result2 = await lib.http.request['@1.1.6'].get({
  url: 'https://algoindexer.algoexplorerapi.io/v2/accounts/' + walletString + '/transactions?tx-type=axfer&after-time=' + finalTime // required
});

verifOpt = false
for (let i = 0; i < result2.data.transactions.length; i++) {
  if (result2.data.transactions[i]['asset-transfer-transaction']['asset-id'] == '562604242' ){
    verifOpt = true;
    break;
  } 
}

if (verifOpt == true) {
  let creatorAssets = [];
  
  let assetResult = await lib.http.request['@1.1.6'].get({
    url: 'https://algoindexer.algoexplorerapi.io/v2/accounts/' + creatorWallet + '/created-assets?limit=1000'// required
  });
  for (let i =0; i < assetResult.data.assets.length; i++){
    creatorAssets.push(assetResult.data.assets[i].index)
  }
  let result = await lib.http.request['@1.1.6'].get({
    url: 'https://algoindexer.algoexplorerapi.io/v2/accounts/' + walletString + '/assets' // required
  });
  
  verifOwn = false;
  for (let i = 0; i < result.data.assets.length; i++) {
    if ( creatorAssets.includes(result.data.assets[i]['asset-id']) && result.data.assets[i].amount > 0 ){
      verifOwn = true;
      break;
    } 
  }
  
  if (verifOwn == true){

    let editFollowup = await lib.discord.interactions['@1.0.0'].responses.update({
      token: token,
      content: `Succesfully verified! Elephalgo Owner role given! **Welcome the Herd!**`,
    });
    await lib.discord.guilds['@0.1.0'].members.roles.update({
      role_id: OwnerroleID, // Put the ID of your member role here!
      user_id: `${context.params.event.member.user.id}`,
      guild_id: `${context.params.event.guild_id}`,
    });
    await lib.discord.guilds['@0.1.0'].members.roles.destroy({
      role_id: NonOwnerroleID,
      user_id: `${context.params.event.member.user.id}`,
      guild_id: `${context.params.event.guild_id}`
    });
  } 
  else {
    let editFollowup = await lib.discord.interactions['@1.0.0'].responses.update({
      token: token,
      content: `No Elephalgos found in wallet given! Check out the weekly drop to get one!`,
    });
  }
}
else {
  let editFollowup = await lib.discord.interactions['@1.0.0'].responses.update({
    token: token,
    "content": "Not opted-in to proper asset or 3 minute time limit has expired. Try again after opting-in using the button below. It may take a few seconds for the block chain to verify your opt-in",
      "tts": false,
      "components": [
        {
          "type": 1,
          "components": [
            {
              "style": 5,
              "label": `Opt-In Here!`,
              "url": `https://www.randgallery.com/algo-collection/?address=562604242`,
              "disabled": false,
              "type": 2
            },
            {
              "style": 1,
              "label": `I have opted-in!`,
              "custom_id": `row_0_button_1`,
              "disabled": false,
              "type": 2
            }
          ]
        }
      ],
      "embeds": [
        {
          "type": "rich",
          "title": `Opt-In Asset`,
          "description": `Opt-In to the asset on rand gallery using the **\"Add Asset-ID\"** button. Come back and click **\"I have opted-in\"** button!`,
          "color": 0xffffff
        }
      ]
    });
  }