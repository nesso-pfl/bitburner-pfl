const https = require("https")
const fs = require("fs")

// https://github.com/bitburner-official/vscode-template/pull/8
const url = 'https://raw.githubusercontent.com/bitburner-official/bitburner-src/dev/src/ScriptEditor/NetscriptDefinitions.d.ts'
const path = './NetscriptDefinitions.d.ts'

https.get(url, (res) => {
    const file = fs.createWriteStream(path)

    res.pipe(file)

    file.on('finish', () => {
        file.close
        console.log('Netscript Type Definitions Updated')
    })

}).on("error", (err) => {
    console.log("Error: ", err.message)
})