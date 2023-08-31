const { Telegraf } = require('telegraf');
const ytdl = require('ytdl-core');

const bot = new Telegraf('5970477189:AAE0ZwH5nglD453439P_Qpv1uyrLZ84Ucig');

bot.command('start', async (ctx) => {
    const chatId = ctx.message.chat.id;
  
    // Check if the bot is already in a voice chat
    if (ctx.chat && ctx.chat.type === 'voice') {
      await ctx.reply('I am already in a voice chat!');
      return;
    }
  
    // Check if the user is in a voice chat
    if (!ctx.message || !ctx.message.voice_chat || !ctx.message.voice_chat.id) {
      await ctx.reply('Please join a voice chat and then use the /start command.');
      return;
    }
  
    const voiceChatId = ctx.message.voice_chat.id;
    const title = ctx.message.voice_chat.title;
  
    // Join the voice chat
    await ctx.reply(`Joining voice chat ${title}...`);
    await ctx.telegram.joinChat(voiceChatId);
    await ctx.reply('Joined the voice chat!');
  });

  bot.on('audio', async (ctx) => {
    const chatId = ctx.message.chat.id;
    const audio = ctx.message.audio;
  
    // Check if the bot is in a voice chat
    if (!ctx.chat || ctx.chat.type !== 'voice') {
      await ctx.reply('I am not currently in a voice chat!');
      return;
    }
  
    // Download the audio file
    const audioInfo = await ctx.telegram.getFile(audio.file_id);
    const audioUrl = `https://api.telegram.org/file/bot${bot.token}/${audioInfo.file_path}`;
  
    // Play the audio in the voice chat
    const stream = ytdl(audioUrl, { filter: 'audioonly' });
    ctx.telegram.sendChatAction(chatId, 'upload_audio');
    ctx.telegram.sendVoice(chatId, { source: stream });
  });
  

  
  bot.command('stop', async (ctx) => {
    const chatId = ctx.message.chat.id;
  
    // Check if the bot is in a voice chat
    if (!ctx.chat || ctx.chat.type !== 'voice') {
      await ctx.reply('I am not currently in a voice chat!');
      return;
    }
  
    // Leave the voice chat
    await ctx.reply('Leaving the voice chat...');
    await ctx.telegram.leaveChat(chatId);
    await ctx.reply('Left the voice chat!');
  });

  
  bot.launch();

