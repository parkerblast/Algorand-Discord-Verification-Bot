const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

const token = context.params.event.token;

let followup = await lib.discord.interactions['@0.1.0'].followups.ephemeral.create({
  token: token,
  content: '',
    tts: false,
    embeds: [
      {
        type: 'rich',
        title: `Here are some commands you can use`,
        description: '',
        color: 0x00ffff,
        fields: [
          {
            name: `/register wallet-address:`,
            value: `This will register your wallet address to the verify bot, after the opt-in check, and allow you to use the /flex command.`,
          },
          {
            name: `/flex`,
            value: `This will allow you to show off the Elephalgos in your wallet!`,
          },
          {
            name: `/help-elephalgos`,
            value: `This command will pull up the Elephalgo Verify Bot help, this window.`,
          },
        ],
      },
    ],
  });