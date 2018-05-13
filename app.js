const dotenv = require('dotenv')
const Telegraf = require('telegraf')
const { Extra, Markup } = require('telegraf');
const db = require('./models')
dotenv.load()

const bot = new Telegraf(process.env.BOT_TOKEN)


bot.command('/start', async (ctx) => {
  const chat = ctx.update.message.from
  const exist = await db.tb_user.findOne({where: {chat_id: chat.id}})
  if (exist) {
    ctx.replyWithMarkdown(`
  *Selamat Datang Kembali di LokerBOT*.
/loker - info lowongan pekerjaan
/status - history application
/update - update profile
/panggilan - daftar panggilan interview
/help - Menu bantuan
  `)
  } else {
    ctx.replyWithMarkdown(`
  *Selamat Datang di LokerBOT*.
Anda belum terdaftar di sistem kami, silahkan /register terlebih dahulu. Atau
gunakan /help untuk mendapatkan informasi lainnya
  `)
  }

})

bot.command('/update', async(ctx) => {

  const chat = ctx.update.message.from
  await db.tb_user.update({ registration_phase: 'name'}, {where: {chat_id: chat.id}})
  ctx.reply('Nama Anda?')
})


async function loker(ctx, chat) {
  const loker = await db.tb_lowongan.get(chat.id)

  if (loker.length > 0) {

    ctx.reply('Info lowongan', Extra.HTML().markup((m) =>  {
      const options = []

      let i = 0
      for (let p of loker) {
        options[i] = []
        options[i].push(m.callbackButton(p.posisi, 'lokerdetail'+p.recid))
        i++
      }


      return m.inlineKeyboard(options)
    }
    ));
  }
}

bot.command('/loker', async (ctx) => {
  const chat = ctx.update.message.from
  loker(ctx, chat)
})


bot.command('/register', async (ctx) => {
  //const name = ctx.message.text.replace('\/register ', '')
  //registrant.push(name)
  //const chat_id = ctx.update.message.from.id
  //await db.updateRegistrationPhase(chat_id, 'name')
  const chat = ctx.update.message.from
  //create
  await db.tb_user.register({
    chat: chat,
  })

  ctx.reply('Nama Anda?')
})

bot.command('/list', (ctx) => {

  console.log(ctx.update.message.from.id)
  //let text = 'List pendaftar\n'
  //for (let d of registrant) {
    //text += '- ' + d + '\n'
  //}

  //ctx.reply(text)
})

bot.command('keyb', (ctx) => {
    return ctx.reply('<b>Coke</b> or <i>Pepsi?</i>', Extra.HTML().markup((m) =>
        m.inlineKeyboard([
            m.callbackButton('Cokei', 'Coke'),
            m.callbackButton('Pepsi', 'Pepsi')
        ])));
});

bot.action('Coke', (ctx) => {
	ctx.reply('Now: <b>7up</b> or <b>Fanta</b>?', Extra.HTML().markup(m => m.inlineKeyboard([
			m.callbackButton('7up', '7up'),
			m.callbackButton('Fanta', 'fanta'),
		  ])))
})

bot.on('callback_query', async (ctx) => {
  const chat = ctx.callbackQuery.message.chat
  const answer = ctx.callbackQuery.data
  const phase = await db.tb_user.getRegistrationPhase(chat.id)

  if (answer.indexOf('apply') != -1) {
    const apply = answer.replace('apply', '')
    const user = await db.tb_user.findOne({where: {chat_id: chat.id}, raw: true})

    //apply
    await db.tb_apply.create({
      user: user.recid,
      lowongan: apply,
      status: 0,
      proses: 0,
      kehadiran:0
    })

    return
  }

  if (answer.indexOf('call-') != -1) {
     const idyn = answer.replace('call-', '')

    const s = idyn.split('-')
    console.log(s)

    const id = s[0]
    const yn = s[1] == 'yes' ? 1 : 2

    await db.tb_apply.update({kehadiran: yn}, {where:{ recid:id}})

    ctx.reply('Terimakasih atas konfirmasi anda')

    return
  }

  if (answer.indexOf('lokerdetail') != -1) {
     const id = answer.replace('lokerdetail', '')
    

      console.log(answer)
      const info = await db.tb_lowongan.findOne({where: {recid: id}})
      const company = await db.tb_company.findOne({where: {recid: info.company}})
      const detail = await db.tb_lowongan.detail(info.recid)

      console.log('detail', detail)
      //ctx.replyWithMarkdown(`*${company.nama}*
//- ${info.keterangan}
      //`, 
            //)

  
      return ctx.reply(`
  <strong>${company.nama}</strong>
- ${info.keterangan}

<strong>Pendidikan</strong>
- ${detail.pendidikan.join('\n- ')}

<strong>Jurusan</strong>
- ${detail.jurusan.join('\n- ')}
`, Extra.HTML().markup((m) =>
        m.inlineKeyboard([
          m.callbackButton('Apply', 'apply' + info.recid),
          m.callbackButton('Lainnya', '/loker'),
        ])))
  }

  if (answer == '/loker') {
    loker(ctx, chat)
  }

  switch (phase) {
    case 'pendidikan':

      const pendidikan = await db.tb_pendidikan.findOne({where: {recid: answer}})
      const jurusan = await db.tb_jurusan.findAll({where: {kategori: pendidikan.kategori}})

      //const jurusan = await db.tb_jurusan.get()

      let nextPhase = 'nilai'
      if (jurusan.length > 0) {
        
        ctx.reply('Jurusan ?', Extra.HTML().markup((m) =>  {
          const options = []

          let i = 0
          for (let p of jurusan) {
            options[i] = []
            options[i].push(m.callbackButton(p.jurusan, p.recid))
            i++
          }


          return m.inlineKeyboard(options)
        }
        ));

        nextPhase = 'jurusan'


      } else {
        ctx.reply('Institusi Terakhir Anda?')
      }

      await db.tb_user.update({pendidikan: answer, registration_phase: nextPhase}, {where: {chat_id: chat.id}})


      break;

    case 'jurusan': 
      await db.tb_user.update({jurusan: answer, registration_phase: 'institusi'}, {where: {chat_id: chat.id}})
      ctx.reply('Institusi Terakhir Anda?')
      break

    
    default:
      
  }
  //// Explicit usage
  //ctx.telegram.answerCbQuery(ctx.callbackQuery.id)

  //// Using shortcut
  //ctx.answerCbQuery()
})

bot.on('message', async (ctx) => {
  const chat = ctx.update.message.from
  const phase = await db.tb_user.getRegistrationPhase(chat.id)
  //console.log('phase', phase)
  //console.log('name', ctx.message)
  //console.log(phase)
  switch (phase) {
    case 'name':
      await db.tb_user.update({nama: ctx.message.text, registration_phase: 'hp'}, {where: {chat_id: chat.id}})
      console.log('menggila')
      ctx.reply('Nomer Handphone?')
      break;
    case 'hp':
      await db.tb_user.update({hp: ctx.message.text, registration_phase: 'email'}, {where: {chat_id: chat.id}})
      ctx.reply('Email Anda?')
      break;
    //case 'pin':
      //await db.tb_user.update({pin: ctx.message.text, registration_phase: 'email'}, {where: {chat_id: chat.id}})
      //ctx.reply('Email?')
      //break;
    case 'email':
      await db.tb_user.update({email: ctx.message.text, registration_phase: 'pendidikan'}, {where: {chat_id: chat.id}})
      const pendidikan = await db.tb_pendidikan.get()


      ctx.reply('Pendidikan Terakhir Anda?', Extra.HTML().markup((m) =>  {
        const options = []

        let i = 0
        for (let p of pendidikan) {
          options[i] = []
          options[i].push(m.callbackButton(p.pendidikan, p.recid))
          i++
        }

        console.log(options)

        return m.inlineKeyboard(options)
      }
      ));


      break
    case 'institusi': 
      await db.tb_user.update({nilai: ctx.message.text, registration_phase: 'nilai'}, {where: {chat_id: chat.id}})
      ctx.reply('IPK atau Nilai UN Anda?')
      break

    case 'nilai': 
      await db.tb_user.update({nilai: ctx.message.text, registration_phase: 'skill'}, {where: {chat_id: chat.id}})
      ctx.reply('Kemampuan atau Skill yang anda miliki?')
      break 

    case 'skill':
      console.log('skill')
      await db.tb_user.update({skill: ctx.message.text, registration_phase: 'about'}, {where: {chat_id: chat.id}})
      ctx.reply('Ceritakan sedikit tentang anda')
      break
    case 'about':
      await db.tb_user.update({about: ctx.message.text, registration_phase: null}, {where: {chat_id: chat.id}})
      ctx.replyWithMarkdown(`
      *Terima kasih telah mendaftar di LokerBot*
/loker - info lowongan pekerjaan
/status - history application
/panggilan - daftar panggilan interview
/help - Menu bantuan
      `)
      break
    default:
  }
  
})
//console.log(bot)

//bot.telegram.sendMessage(60315270, 'menggila')

bot.startPolling()


/**
 *
 *Wes ngene ae clik, aku jaluk tulung
 Gaweo chatbot jenenge "lokerbot". 
 Pas awal join, keono ucapan selamat datang blablabla kyok bot musik wingi. 
 Terus bot bertanya sudah terdaftar atau belum. 
 Jika belum maka register,  yg disimpan id telegram/no hp nya, pin sebagai password 6 digit, 
 nama, alamat, email, pendidikan trakhir (opsi mulai SMA - S3), Jurusan (Opsi jurusan), skill, informasi tambahan
 8?
 */

const express = require('express')
var app = express()

// respond with "hello world" when a GET request is made to the homepage
app.get('/broadcast', async (req, res) => {
  const recid = req.query.recid
  //const recid = 2

  const detail = await db.tb_lowongan.detail(recid)
  const users = await db.tb_user.findAll({raw: true})

  console.log(detail)

  for (let u of users) {
    console.log('broadcast', u)

    if (detail.mpendidikan.indexOf(u.pendidikan+'') != -1 && detail.mjurusan.indexOf(u.jurusan+'') != -1) {
      
    
    bot.telegram.sendMessage(u.chat_id, `
  <strong>Info Lowongan Baru</strong>


  <strong>${detail.company.nama}</strong>
- ${detail.lowongan.keterangan}

<strong>Pendidikan</strong>
- ${detail.pendidikan.join('\n- ')}

<strong>Jurusan</strong>
- ${detail.jurusan.join('\n- ')}
    `, {parse_mode: 'html'})

  } else {
    continue
  }
  }

  res.send('broadcast success')
})

app.get('/call', async (req, res) => {

  console.log('call')
  const recid = req.query.recid
  //let recid = '1,4'
  recid = recid.split(',')

  const appli = await db.tb_apply.findAll({where: {recid}, raw: true})


  //const users = await db.tb_user.findAll({raw: true})


  for (let p of appli) {
    const user  = await db.tb_user.findOne({where:{recid: p.user}, raw: true})
    const detail = await db.tb_lowongan.detail(p.lowongan)

    var keyboard = {
      "inline_keyboard": [
        [
          {"text": "Yes", "callback_data": "call-"+p.recid+"-yes"},
          {"text": "No", "callback_data": "call-"+p.recid+"-no"}
        ]
      ]
    };
    
    bot.telegram.sendMessage(user.chat_id, `
  <strong>Panggilan Interview</strong>

  <strong>${detail.company.nama}</strong>
- ${detail.lowongan.keterangan}

Mohon Konfirmasi kehadiran dibawah ini?

    `, {parse_mode: 'html', reply_markup: JSON.stringify(keyboard)})
  }


  res.send('broadcast success')
})


app.listen(5555)
