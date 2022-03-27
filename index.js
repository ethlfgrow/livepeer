const express = require('express')
const cors = require('cors')
var exec = require('child_process').exec
var execSync = require('child_process').execSync
const multer = require('multer')
const uuid = require('uuid').v4

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

var foo = `tesla.mp4  "A Musical Masterpiece" '{"animation_url":null,"image":"ipfs://bafkreiheds3nc3zrvkh4rxocmwohhs3obaqer6ptonxxbjcmpqwyom2kba","properties":{"artist":"DJ Spooky"},"attributes":[{"trait_type":"style","value":"postmodernist"}]}'`

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads')
  },
  filename: (req, file, cb) => {
    const { originalname } = file
    cb(null, originalname)
  },
})

const upload = multer({ storage })
app.use(express.static('public'))

app.post('/upload', upload.single('file'), async (req, res) => {
  const title = req.body.title
  const newMeta = {
    animation_url: null,
    image: 'ipfs://bafkreiheds3nc3zrvkh4rxocmwohhs3obaqer6ptonxxbjcmpqwyom2kba',
    properties: {
      artist: 'DJ Spooky',
      description: req.body.description,
      title: req.body.title,
    },
    attributes: [
      {
        trait_type: 'style',
        value: 'postmodernist',
      },
    ],
  }

  const newMetaString = JSON.stringify(newMeta)

  const path = await req.file.path
  console.log(path)

  var foom = `${path} "${title}" '${newMetaString}'`
  console.log('foom here')
  console.log(foom)

  const data = await new Promise((resolve, reject) => {
    exec('./livepeer-nft.sh ' + foom, function (error, stdout, stderr) {
      if (error !== null) {
        console.log(error)
        reject(error)
      } else {
        //console.log('stdout: ' + stdout)
        //console.log('stderr: ' + stderr)
        resolve(stdout)
        //return res.json({ status: stdout })
      }
    })
  })
  console.log('data')
  console.log(data)
  res.json(JSON.parse(data))
})

app.listen(3001)
