const fs = require('fs')
const { exec } = require('child_process')
const express = require('express')
const app = express()
const ANSI_CODE_REGEX = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g

app.use(express.static('public'))
app.use(express.json())

app.post('/api/run', (req, res) => {
  const code = req.body.code
  const fn = Math.random().toString(36).slice(2)

  fs.writeFileSync(`spwn/${fn}.spwn`, code)
if (req.body.flags){
	  exec(`spwn build spwn/${fn}.spwn -l ` + req.body.flags, function(err, stdout, stderr) {
    res.send({ output: (stdout+stderr).replace(ANSI_CODE_REGEX, '') })
    fs.unlink(`spwn/${fn}.spwn`, function(err) {
      if (err) {
        console.error(err)
      }
    })
  })
}
else {
	  exec(`spwn build spwn/${fn}.spwn -l`, function(err, stdout, stderr) {
    res.send({ output: (stdout+stderr).replace(ANSI_CODE_REGEX, '') })
    fs.unlink(`spwn/${fn}.spwn`, function(err) {
      if (err) {
        console.error(err)
      }
    })
  })
}
})

app.listen(5000)
