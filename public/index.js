const code = document.getElementById('code')
const output = document.getElementById('output')

function interpretCode() {
  fetch('/api/run', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ code: code.value })
  })
    .then(res => res.json())
    .then(data => {
      console.log(data)
      output.innerText = data.output
    })
}

output.addEventListener('keydown', e => {
  if (e.key == 'Enter') {
    interpretCode()
  }
})

document.querySelector('button').onclick = interpretCode