require('dotenv').config();

const download = require('image-downloader');
const fetch = require('node-fetch');
const fs = require('fs')
const _ = require('lodash');

const FB = require('./libs/FB');

const getCommentsDataInPost = async ({ ownerID, objID }) => {
  const arrIMG = [];
  let total = 0;
  objID = ownerID + '_' + objID;
  if (fs.existsSync('downloaded/' + objID)) {
    console.log(objID + ' existed');
    return;
  }

  const getAllImageInComment = ({ objID, access_token, limit }) => {
    return fetch(`https://graph.facebook.com/v2.11/${objID}/comments?fields=attachment,comment_count&limit=${limit || 500}&access_token=${access_token}`)
      .then(r => r.json())
      .then(res => {
        if (res.error) {
          throw Error(res.error.message);
        }
        return FB.graphAll(res);
      })
      .then(async all => {
        const arrComment = all.data.reduce((res, comment) => {
          const url = _.get(comment, 'attachment.media.image.src', undefined);
          const type = _.get(comment, 'attachment.type', 'photo');
          if (url) {
            arrIMG.push({ url, id: comment.id, type });
            console.log("TOTAL " + ++total)
          }
          if (comment.comment_count > 0) {
            res.push({ objID: comment.id, access_token, limit: comment.comment_count });
          }
          return res;
        }, []);

        while (arrComment.length > 0) {
          console.log("PAGING REQUEST REPLY 300");
          await Promise.all(arrComment.splice(0, 300).map(cmt => getAllImageInComment(cmt)));
        }
      })
      .catch(err => console.log(err))
  }

  console.log("GETTING DATA " + objID);
  return getAllImageInComment({ objID, access_token })
    .then(async () => {
      const dir = 'downloaded/' + objID;
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
      let downloaded = 0;
      let error = 0;
      while (arrIMG.length > 0) {
        console.log("PAGING DOWNLOAD 300");
        await Promise.all(arrIMG.splice(0, 300).map((image, index) => download.image({
          url: image.url,
          dest: `${__dirname}/${dir}/${image.type}_${image.id}.png`
        }).then(() => console.log(`DOWNLOADED ${++downloaded}/${total}`))
          .catch(err => console.log(`ERROR with ${image.id}, url: "${image.url}", total errors: ${++error}`))
        ));
      }
    })
}

const access_token = process.env.ACCESS_TOKEN;
const arrInput = [
  // {
  //   ownerID: '100006487845973',
  //   objs: [
  //     '2292872717605634',
  //     '2063545387205036'
  //   ]
  // },
  {
    ownerID: '1510688172511365', //Thanh xuân: Tuổi trẻ nồng nhiệt - Thời gian phai mờ
    posts: [
      '1993269210919923',
      '1993172510929593',
      '1992899580956886',
      '1992596314320546',
      '1992587767654734',
      '1992548164325361',
      '1992495274330650',
      '1992366931010151',
      '1991423141104530',
      '1991267734453404',
      '1990532281193616',
      '1990385354541642',
      '1989960444584133',
      '1989997204580457',
      '1989916144588563',
      '1989644721282372',
      '1989257384654439',
      '1989202094659968',
      '1989019501344894'
    ]
  },
  {
    ownerID: '966852643392497', //Anh+
    posts: [
      '1631959910215097'
    ]
  },
  {
    ownerID: '400202166812077', //Doc bao thay ban
    posts: [
      '980373452128276'
    ]
  }
];

const run = async ({ input, access_token }) => {
  for (let page of input) {
    let { ownerID, posts } = page;
    for (let post of posts) {
      await getCommentsDataInPost({ ownerID, objID: post });
    }
  }
};

run({ input: arrInput, access_token });

