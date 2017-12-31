require('dotenv').config();

const download = require('image-downloader');
const fetch = require('node-fetch');
const fs = require('fs')

const getData = (graphData) => {
  if (graphData.paging.next) {
    console.log("FETCHING " + graphData.paging.next);
    return fetch(graphData.paging.next)
      .then(r => r.json())
      .then(res => {
        graphData.data = graphData.data.concat(res.data);
        graphData.paging.next = res.paging.next
        return getData(graphData);
      })
  }
  return graphData;
}

const getAllImageInComment = async ({ postID, access_token }) => {
  if (!fs.existsSync(postID)) {
    fs.mkdirSync(postID);
  }
  fetch("https://graph.facebook.com/v2.11/" + postID + "/comments?fields=attachment&limit=1000&access_token=" + access_token)
    .then(r => r.json())
    .then(res => {
      if (res.error) {
        throw Error(res.error.message);
      }
      return getData(res)
    })
    .then(all => {
      Promise.all(all.data.reduce((res, comment) => {
        if (comment.attachment)
          res.push(download.image({
            url: comment.attachment.media.image.src,
            dest: __dirname + "/" + postID + "/" + comment.id + ".jpg"
          }))
        return res;
      }, []));
    })
    .catch(err => console.log(err))
}

const access_token = process.env.ACCESS_TOKEN;
const pageID = '484451281604769';
const postID = pageID + '_' + '1663010177082201'; // pageID_postID

getAllImageInComment({ postID: postID, access_token: access_token});
