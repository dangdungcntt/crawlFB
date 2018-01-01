const fetch = require('node-fetch');
const _ = require('lodash');

const graphAll = (graphData) => {
  const next = _.get(graphData, 'paging.next', undefined);
  if (next) {
    return fetch(graphData.paging.next)
      .then(r => r.json())
      .then(res => {
        graphData.data = graphData.data.concat(res.data);
        graphData.paging.next = _.get(res, 'paging.next', undefined)
        return graphAll(graphData);
      })
  }
  return graphData;
}

module.exports = {
  graphAll
}
