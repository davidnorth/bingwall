import fetch from "node-fetch"
import cheerio from 'cheerio'

import { exec } from 'child_process'

import os from 'os'
import path from 'path'

const BASE_URL = "https://bingwallpaper.anerg.com"

// Get the user's home directory
const homeDirectory = os.homedir();
// Construct the path to the Downloads folder
const downloadsPath = path.join(homeDirectory, 'Downloads');

const dayRange = 5 * 365 // 5 years

// a random number between 0 and dayRange
const randomDay = Math.floor(Math.random() * dayRange);

// get the date object randomDay in the past
const date = new Date();
date.setDate(date.getDate() - randomDay);
// subtract one month
date.setMonth(date.getMonth() - 1);

// format as YYYYMM
const year = date.getFullYear();
const month = date.getMonth() + 1;
const monthString = month < 10 ? `0${month}` : month;
const dateString = `${year}${monthString}`;


const archiveUrl = BASE_URL + "/archive/us/" + dateString

console.log('Fetching archive from: ', archiveUrl)

const res = await fetch(archiveUrl);
const body = await res.text();
let $ = cheerio.load(body);
const images = $('.img-fluid.rounded');
const randomIndex = Math.floor(Math.random() * images.length);
const randomImage = images.eq(randomIndex);
const imageParent = randomImage.parent();
const imagePageUrl = BASE_URL + imageParent.attr('href');
console.log('Image page:', imagePageUrl)

const imagePageRes = await fetch(imagePageUrl);
const imagePageBody = await imagePageRes.text();
$ = cheerio.load(imagePageBody);
const downloadLink = $('a').filter((i, el) => $(el).text().includes('Download 4K')).eq(0)
const imageURL = downloadLink.attr('href')
const curlCommand = `curl -o ${downloadsPath}/wallpaper.jpg ${imageURL}`
exec(curlCommand, (err, stdout, stderr) => {
  if (err) {
    console.log('Error downloading image', err)
    return
  }
  console.log('Image downloaded successfully')
})



