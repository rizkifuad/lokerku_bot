const Nightmare = require('nightmare')
const nightmare = Nightmare({ show: true })
const cheerio = require('cheerio')
const fs = require('fs')

nightmare
  .goto('https://www.linkedin.com/')
  .type('input#login-email', 'rizkifuad@gmail.com')
  .type('input#login-password', 'penggodulan')
  .click('#login-submit')
  .wait(1000)
  .goto('https://www.linkedin.com/in/alham-wahyuanda-b689124a/')
  .wait(10000)
  //.wait('h1#name.fn')
  .evaluate(() => {
    //console.log(document.querySelector('h1#name.fn'))
    return document.body.innerHTML
  })
  .end()
  .then(function(body) {

    const saved = fs.writeFileSync('a.html', body, 'utf8');
    //console.log(body)
    const $ = cheerio.load(body)

    const name = $('.pv-top-card-section__name').text()

    const exp = $('[href=#experience-section] .pv-entity__summary-info h3').html()
    console.log(name.trim())
    console.log(exp)

  })
