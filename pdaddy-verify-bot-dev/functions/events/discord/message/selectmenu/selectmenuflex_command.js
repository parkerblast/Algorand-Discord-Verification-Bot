const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const token = context.params.event.token;
const followupID = context.params.event.message.id;

await lib.discord.interactions['@1.0.0'].responses.update({
  token: token,
  message_id: followupID, //paste followup messageID
  content: 'Flexing your choice!',
});

let memberID = context.params.event.member.user.id;
let serverID = context.params.event.guild_id;
const selection = context.params.event.data.values[0];
let collectionName = await lib.utils.kv.get({
  key: "CollectionName: " + serverID,
});
console.log(selection);

await lib.discord.channels['@0.2.0'].messages.create({
  "channel_id": `${context.params.event.channel_id}`,
  "content": `<@!${context.params.event.member.user.id}> is **FLEXING** their ` + collectionName + "!",
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
  table: `926947845767049246`,
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

splitIpfs = result.rows[0].fields.ipfsList.split(",");
console.log(splitIpfs[0]);

let assetID = result.rows[0].fields.assetID.split(",");
let nameList = result.rows[0].fields.nameList.split(",");
let ipfsList = result.rows[0].fields.ipfsList.split(",");

if(selection == 'all'){
  if(assetID.length < 8){
   for (let i = 0; i < assetID.length; i++) { 
    
      let fileExt = '';   
      let fileResponse = await lib.http.request['@1.1.6']({
        method: 'GET',
        url: ipfsList[i],
        });
      
      console.log(fileResponse.headers['content-type'])
      let fileData = fileResponse.body;
      if (fileResponse.headers['content-type'] == 'image/jpeg'){
        fileExt = ".jpg";
      }
      if (fileResponse.headers['content-type'] == 'image/gif'){
        fileExt = '.gif';
      }
      if (fileResponse.headers['content-type'] == 'image/png'){
        fileExt = '.png';
      }
      if (fileResponse.headers['content-type'] == 'video/webm'){
        fileExt = '.webm';
      }
      console.log(fileExt);
      
      await lib.discord.channels['@0.2.0'].messages.create({
        "channel_id": `${context.params.event.channel_id}`,
        "tts": false,
        "content": '',
        "file": fileData,
        "filename": fileResponse.headers.etag.split('"')[1] + fileExt,
        "components": [
          {
            "type": 1,
            "components": [
              {
                "style": 5,
                "label": `NFT Explorer `,
                "url": `https://www.nftexplorer.app/asset/` + assetID[i],
                "disabled": false,
                "type": 2
              },
              {
                "style": 5,
                "label": `Rand Gallery`,
                "url": `https://www.randgallery.com/algo-collection/?address=` + assetID[i],
                "disabled": false,
                "type": 2
              }
            ]
          }
        ],
        "embeds": [
          {
            "type": "rich",
            "title": '**' + nameList[i] + '**',
            "description": "",
            "color": 0x0a0a0a
          }
        ]
      });
    } 
  }
  else {
    for (let i = 0; i < 8; i++) { 
    
      let fileExt = '';   
      let fileResponse = await lib.http.request['@1.1.6']({
        method: 'GET',
        url: ipfsList[i],
        });
      
      console.log(fileResponse.headers['content-type'])
      let fileData = fileResponse.body;
      if (fileResponse.headers['content-type'] == 'image/jpeg'){
        fileExt = ".jpg";
      }
      if (fileResponse.headers['content-type'] == 'image/gif'){
        fileExt = '.gif';
      }
      if (fileResponse.headers['content-type'] == 'image/png'){
        fileExt = '.png';
      }
      if (fileResponse.headers['content-type'] == 'video/webm'){
        fileExt = '.webm';
      }
      console.log(fileExt);
      
      await lib.discord.channels['@0.2.0'].messages.create({
        "channel_id": `${context.params.event.channel_id}`,
        "tts": false,
        "content": '',
        "file": fileData,
        "filename": fileResponse.headers.etag.split('"')[1] + fileExt,
        "components": [
          {
            "type": 1,
            "components": [
              {
                "style": 5,
                "label": `NFT Explorer `,
                "url": `https://www.nftexplorer.app/asset/` + assetID[i],
                "disabled": false,
                "type": 2
              },
              {
                "style": 5,
                "label": `Rand Gallery`,
                "url": `https://www.randgallery.com/algo-collection/?address=` + assetID[i],
                "disabled": false,
                "type": 2
              }
            ]
          }
        ],
        "embeds": [
          {
            "type": "rich",
            "title": '**' + nameList[i] + '**',
            "description": "",
            "color": 0x0a0a0a
          }
        ]
      });
    }
  }
}
else {
  
  let fileExt = '';   
  let fileResponse = await lib.http.request['@1.1.6']({
    method: 'GET',
    url: ipfsList[selection],
    });
  
  console.log(fileResponse.headers['content-type'])
  let fileData = fileResponse.body;
  if (fileResponse.headers['content-type'] == 'image/jpeg'){
    fileExt = ".jpg";
  }
  if (fileResponse.headers['content-type'] == 'image/gif'){
    fileExt = '.gif';
  }
  if (fileResponse.headers['content-type'] == 'image/png'){
    fileExt = '.png';
  }
  if (fileResponse.headers['content-type'] == 'video/webm'){
    fileExt = '.webm';
  }
  console.log(fileExt);
  
  await lib.discord.channels['@0.2.0'].messages.create({
      "channel_id": `${context.params.event.channel_id}`,
      "tts": false,
      "content": "Test",
      "file": fileData,
      "filename": fileResponse.headers.etag.split('"')[1] + fileExt,
      "components": [
        {
          "type": 1,
          "components": [
            {
              "style": 5,
              "label": `NFT Explorer `,
              "url": `https://www.nftexplorer.app/asset/` + assetID[selection],
              "disabled": false,
              "type": 2
            },
            {
              "style": 5,
              "label": `Rand Gallery`,
              "url": `https://www.randgallery.com/algo-collection/?address=` + assetID[selection],
              "disabled": false,
              "type": 2
            }
          ]
        }
      ],
      "embeds": [
        {
          "type": "rich",
          "title": '**' + nameList[selection] + '**',
          "description": "",
          "color": 0x0a0a0a
        }
      ]
  });
}