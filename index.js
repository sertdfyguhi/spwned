const fs = require('fs')
const { exec } = require('child_process')
const express = require('express')
const app = express()
const PORT = 5000
const ANSI_CODE_REGEX = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g

app.use(express.static('public'))
app.use(express.json())

app.get('/api/spwn_versions', (req, res) => {
  res.status(200).send(fs.readdirSync('spwn'))
})

app.post('/api/run', (req, res) => {
  const code = req.body.code
  const fn = Math.random().toString(36).slice(2)
  const versions = fs.readdirSync('spwn')
  const ver = req.body.version || versions[versions.length-1]

  if (!fs.existsSync(`spwn/${ver}`)) {
    return res.status(404).send({ message: 'spwn version not found' })
  }

  fs.writeFileSync(`files/${fn}.spwn`, code)

  exec(
    `cd spwn/${ver} && ./${ver} build ../../files/${fn}.spwn --no-gd -l`,
    { timeout: 10000 },
    function(err, stdout, stderr) {
      if (err.killed) {
        res.status(200).send({ output: 'timeout exceeded' })
      } else {
        res.status(200).send({ output: (stdout+stderr).replace(ANSI_CODE_REGEX, '') })
      }
      fs.unlink(`files/${fn}.spwn`, function(err) {
        if (err) { console.error(err) }
      })
    }
  )
})

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
