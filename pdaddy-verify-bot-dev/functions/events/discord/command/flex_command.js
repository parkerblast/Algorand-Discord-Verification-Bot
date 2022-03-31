const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

let memberID = context.params.event.member.user.id;
let serverID = context.params.event.guild_id;
const token = context.params.event.token;
const role = context.params.event.member.roles;
let options = [];
console.log(role);

let editFollowup = await lib.discord.interactions['@1.0.0'].responses.ephemeral.create({
  token: token,
  content: `We are attempting to flex! Select menu will appear soon!`,
  response_type: 'CHANNEL_MESSAGE_WITH_SOURCE',
});

let collectionName = await lib.utils.kv.get({
  key: 'CollectionName: ' + serverID,
});
let roleNeeded = await lib.utils.kv.get({
  key: 'OwnerRole: ' + serverID,
});
let creatorWallet = await lib.utils.kv.get({
  key: 'CreatorWallet0: ' + serverID,
});

let result = await lib.airtable.query['@1.0.0'].select({
  table: '926947845767049246', // required
  where: [
    {
      memberID__is: memberID,
    },
  ],
  limit: {
    count: 1,
    offset: 0,
  },
});
let storedValue = result.rows[0].fields.walletString;
console.log(storedValue);

if (role.includes(roleNeeded) && storedValue != undefined) {
  let result = await lib.http.request['@1.1.6'].get({
    url: 'https://algoindexer.algoexplorerapi.io/v2/accounts/' + storedValue + '/assets'// required
  });

  let assetID = [];
  let nameList = [];
  let ipfsList = [];
  let creatorAssets = [];
  let creatorNames = [];
  let creatorIpfs = [];
  
  let assetResult = await lib.http.request['@1.1.6'].get({
    url: 'https://algoindexer.algoexplorerapi.io/v2/accounts/' + creatorWallet + '/created-assets?limit=1000'// required
  });
  for (let i =0; i < assetResult.data.assets.length; i++){
    creatorAssets.push(assetResult.data.assets[i].index)
    creatorNames.push(assetResult.data.assets[i].params.name)
    creatorIpfs.push(assetResult.data.assets[i].params.url.split('ipfs://')[1])
  }
  for (let i = 0; i < result.data.assets.length; i++) {
    if ( creatorAssets.includes(result.data.assets[i]['asset-id']) && result.data.assets[i].amount > 0 ){
      if (assetID.length < 24) {
        assetID.push(result.data.assets[i]['asset-id']);
        let index = creatorAssets.indexOf(result.data.assets[i]['asset-id']);
        nameList.push(creatorNames[index]);
        ipfsList.push('https://ipfsgateway.randgallery.com/ipfs/' + creatorIpfs[index].split('#')[0]);
      } else {
        break;
      }
    }
  }
  console.log(assetID);
  console.log(nameList);

  if (assetID.length == 0) {
    await lib.discord.interactions['@1.0.0'].responses.update({
      token: token,
      content: `No assets found in registered wallet!`,
    });
  } else {

    await lib.airtable.query['@1.0.0'].update({
      table: '926947845767049246', // required
      where: [
        {
          memberID__is: memberID,
        },
      ],
      limit: {
        count: 1,
        offset: 0,
      },
      fields: {
        ipfsList: ipfsList.toString(),
        nameList: nameList.toString(),
        assetID: assetID.toString(),
      },
      typecast: false,
    });

    for (let i = 0; i < assetID.length; i++) {
      options.push({
        label: nameList[i].toString(),
        value: i,
        default: false,
      });
    }
    options.push({
      label: 'All Assets, MAX 8',
      value: 'all',
      default: false,
    });
    console.log(options);

    await lib.discord.interactions['@1.0.0'].responses.update({
      token: token,
      content: 'Which ' + collectionName + ' would you like to flex?',
      tts: false,
      components: [
        {
          type: 1,
          components: [
            {
              custom_id: `flexselectmenu`,
              placeholder: `No Selection`,
              options: options,
              min_values: 1,
              max_values: 1,
              type: 3,
            },
          ],
        },
      ],
    });
  }
} else {
  await lib.discord.interactions['@1.0.0'].responses.update({
    token: token,
    content: `You do not have the proper role to use this command! Try registering with /register!`,
  });
}