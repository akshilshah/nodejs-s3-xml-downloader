const axios = require('axios')
const parser = require('xml2json')
const fs = require('fs')
const download = require('download')
const chalk = require('chalk')

const BASE_DIR = 'data'
if (!fs.existsSync(BASE_DIR)) {
  fs.mkdirSync(BASE_DIR)
}

const URL = '' // REPLACE WITH THE DOWNLOAD URL

const start = async () => {
  const xml = await fetchXml()
  const json = await convertToJson(xml)
  const items = JSON.parse(json)
  for (const item of items.ListBucketResult.Contents) {
    let shallDownload = true
    if (item.Key.slice(-1) === '/') {
      await checkDir(`${BASE_DIR}/${item.Key}`)
      shallDownload = false
    }
    const dirPath = item.Key.split('/')
      .slice(0, -1)
      .join('/')
    downloadDir = dirPath ? `${BASE_DIR}/${dirPath}` : BASE_DIR
    shallDownload && (await downloadFile(`${URL}${item.Key}`, downloadDir))
  }
  console.log('[+] Download Complete')
}

async function fetchXml () {
  const fetch = await axios.get(URL)
  return fetch.data
}

async function convertToJson (data) {
  return parser.toJson(data)
}

async function downloadFile (url, dir) {
  try {
    console.log(chalk.green('[+] Downloading File for ', url))
    await download(url, dir)
  } catch (error) {
    console.log(chalk.red('[-] Failed for', url))
    fs.appendFileSync('error.txt', url + '\r\n')
  }
}

async function checkDir (dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir)
}

start()
