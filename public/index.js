const code = document.getElementById('code')
const output = document.getElementById('output')
const dropdown = document.getElementById('drop-down')

function interpretCode() {
  fetch('/api/run', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      code: code.value,
      version: dropdown.value
    })
  })
    .then(res => res.json())
    .then(data => {
      output.innerText = data.output
    })
}

fetch('/api/spwn_versions')
  .then(res => res.json())
  .then(data => {
    for (const ver of data) {
      const option = document.createElement('option')
      option.innerText = ver
      dropdown.appendChild(option)
    }
  })

document.querySelector('button').onclick = interpretCode
