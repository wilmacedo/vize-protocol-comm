const WebSocket = require('ws')
const fs = require('fs')
const port = process.env.PORT || 4000
const filePath = 'src/db.json'
const wss = new WebSocket.Server({ port: port })

requestData = action => {
  fs.readFile(filePath, 'utf-8', (err, content) => {
    action(content)
  })
}

sendBroadcast = message => {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message)
    }
  })
}

wss.on('connection', ws => {
  console.log('Cliente conectado.')

  ws.on('close', () => {
    console.log('Cliente desconectado.')
  })

  ws.on('message', message => sendBroadcast(message));

  // ws.on('message', message => {
  //   if (message.startsWith('request')) {
  //     if (message.startsWith('data', 8)) {
  //       message = message.replace('request data ', '')

  //       requestData(content => {
  //         let data = JSON.parse(content)
  //         data = data[message]

  //         if (typeof data != String) {
  //           data = String(data)
  //           ws.send(data)
  //         }
  //       })
  //     }

  //     if (message.startsWith('change', 8)) {
  //       message = message.replace('request change ', '')

  //       if (message.includes('=')) {
  //         let formated = message.split('=')
  //         var variable = formated[1]
  //         message = formated[0]
  //       }

  //       requestData(content => {
  //         let data = JSON.parse(content)

  //         if (data[message] !== 'undefined') {
  //           if (typeof data[message] === 'boolean') {
  //             data[message] = !data[message]
  //           } else if (!isNaN(variable)) {
  //             data[message] = parseInt(variable)
  //           }

  //           fs.writeFile(filePath, data, err => {
  //             sendBroadcast(data)
  //           })
  //         }
  //       })
  //     }
  //   }
  // })
})