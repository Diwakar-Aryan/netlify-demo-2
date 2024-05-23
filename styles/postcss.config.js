module.exports = {
  syntax: 'postcss-scss',
  // plugins: {
  //   'postcss-unitlist': {
  //     media: true,
  //     replace: true,
  //     propList: ['*'],
  //     unitList: [
  //       {
  //         math: '$word / 16',
  //         word: 'unit',
  //         unit: 'rem',
  //       },
  //       {
  //         math: '((e,r)=>{return(a=e,a.slice(0,-1).map(((e,r)=>[e,a[r+1]]))).reduce(((e,[[a,c],[d,l]])=>e||r>=a&&r<d&&c+(r-a)/(d-a)*(l-c)),!1);var a})([[-1/0,1/16],[-2,.25],[-1,.5],[-.5,.75],[0,1],[.5,1.25],[1,1.5],[1.5,1.75],[2,2],[3,3],[4,4],[5,6],[6,8],[7,12],[8,16],[9,24]],$word)',
  //         word: 'base',
  //         unit: 'rem',
  //       },
  //       {
  //         math: '((e,r)=>{return(a=e,a.slice(0,-1).map(((e,r)=>[e,a[r+1]]))).reduce(((e,[[a,c],[d,l]])=>e||r>=a&&r<d&&c+(r-a)/(d-a)*(l-c)),!1);var a})([[-1/0,1/16],[-2,.25],[-1,.5],[-.5,.75],[0,1],[.5,1.125],[1,1.25],[1.5,1.5],[2,1.75],[3,2.5],[4,3.25],[5,4.25],[6,5.75],[7,7.5],[8,10],[9, 12]],$word)',
  //         word: 'piano',
  //         unit: 'rem',
  //       },
  //       {
  //         math: '((e,r)=>{return(a=e,a.slice(0,-1).map(((e,r)=>[e,a[r+1]]))).reduce(((e,[[a,c],[d,l]])=>e||r>=a&&r<d&&c+(r-a)/(d-a)*(l-c)),!1);var a})([[-1/0,1/16],[-2,.25],[-1,.5],[-.5,.75],[0,1],[.5,1.5],[1,1.75],[1.5,2.25],[2,2.75],[3,4.25],[4,7],[5,11.25],[6,18],[7,29],[8,47],[9,64]],$word)',
  //         word: 'forte',
  //         unit: 'rem',
  //       },
  //       // NOTE: This does not work, the plugin only accepts numbers
  //       // {
  //       //   math: '"var(--b1)"',
  //       //   word: 'test',
  //       //   unit: ' ',
  //       // },
  //     ],
  //   },
  // },
}
