const genreData = {
  '1': {
    dbcode: '1',
    name: 'unknown',
    shortname: 'unknown'
  },
  '2': {
    dbcode: '2',
    name: 'http://id.loc.gov/vocabulary/marcgt/bib',
    shortname: 'bibliography'
  },
  '3': {
    dbcode: '3',
    name: 'http://id.loc.gov/vocabulary/marcgt/gov',
    shortname: 'government publication'
  },
  '4': {
    dbcode: '4',
    name: 'http://id.loc.gov/vocabulary/marcgt/fic',
    shortname: 'fiction'
  },
  '5': {
    dbcode: '5',
    name: 'http://id.loc.gov/vocabulary/marcgt/bio',
    shortname: 'biography'
  },
  '6': {
    dbcode: '6',
    name: 'http://id.loc.gov/vocabulary/marcgt/sta',
    shortname: 'statistics'
  },
  '7': {
    dbcode: '7',
    name: 'http://id.loc.gov/vocabulary/marcgt/cpb',
    shortname: 'conference publication'
  },
  '8': {
    dbcode: '8',
    name: 'http://id.loc.gov/vocabulary/marcgt/cat',
    shortname: 'catalog'
  },
  '9': {
    dbcode: '9',
    name: 'http://id.loc.gov/vocabulary/marcgt/aut',
    shortname: 'autobiography'
  },
  '10': {
    dbcode: '10',
    name: 'http://id.loc.gov/vocabulary/marcgt/dir',
    shortname: 'directory'
  },
  '11': {
    dbcode: '11',
    name: 'http://id.loc.gov/vocabulary/marcgt/dic',
    shortname: 'dictionary'
  },
  '12': {
    dbcode: '12',
    name: 'http://id.loc.gov/vocabulary/marcgt/leg',
    shortname: 'legislation'
  },
  '13': {
    dbcode: '13',
    name: 'http://id.loc.gov/vocabulary/marcgt/law',
    shortname: 'law report or digest'
  },
  '14': {
    dbcode: '14',
    name: 'http://id.loc.gov/vocabulary/marcgt/rev',
    shortname: 'review'
  },
  '15': {
    dbcode: '15',
    name: 'http://id.loc.gov/vocabulary/marcgt/ind',
    shortname: 'index'
  },
  '16': {
    dbcode: '16',
    name: 'http://id.loc.gov/vocabulary/marcgt/abs',
    shortname: 'abstract or summary'
  },
  '17': {
    dbcode: '17',
    name: 'http://id.loc.gov/vocabulary/marcgt/han',
    shortname: 'handbook'
  },
  '18': {
    dbcode: '18',
    name: 'http://id.loc.gov/vocabulary/marcgt/fes',
    shortname: 'festschrift'
  },
  '19': {
    dbcode: '19',
    name: 'http://id.loc.gov/vocabulary/marcgt/enc',
    shortname: 'encyclopedia'
  },
  '20': {
    dbcode: '20',
    name: 'http://id.loc.gov/vocabulary/marcgt/yea',
    shortname: 'yearbook'
  },
  '21': {
    dbcode: '21',
    name: 'http://id.loc.gov/vocabulary/marcgt/ter',
    shortname: 'technical report'
  },
  '22': {
    dbcode: '22',
    name: 'http://id.loc.gov/vocabulary/marcgt/the',
    shortname: 'thesis'
  },
  '23': {
    dbcode: '23',
    name: 'http://id.loc.gov/vocabulary/marcgt/lea',
    shortname: 'legal article'
  },
  '24': {
    dbcode: '24',
    name: 'http://id.loc.gov/vocabulary/marcgt/lec',
    shortname: 'legal case and case notes'
  },
  '25': {
    dbcode: '25',
    name: 'http://id.loc.gov/vocabulary/marcgt/sur',
    shortname: 'survey of literature'
  },
  '26': {
    dbcode: '26',
    name: 'http://id.loc.gov/vocabulary/marcmuscomp/sg',
    shortname: 'Songs'
  },
  '27': {
    dbcode: '27',
    name: 'http://id.loc.gov/vocabulary/marcgt/dis',
    shortname: 'discography'
  },
  '28': {
    dbcode: '28',
    name: 'http://id.loc.gov/vocabulary/marcmuscomp/co',
    shortname: 'Concertos'
  },
  '29': {
    dbcode: '29',
    name: 'http://id.loc.gov/vocabulary/marcmuscomp/sn',
    shortname: 'Sonatas'
  },
  '30': {
    dbcode: '30',
    name: 'http://id.loc.gov/vocabulary/marcgt/fil',
    shortname: 'filmography'
  },
  '31': {
    dbcode: '31',
    name: 'http://id.loc.gov/vocabulary/marcmuscomp/sy',
    shortname: 'Symphonies'
  },
  '32': {
    dbcode: '32',
    name: 'http://id.loc.gov/vocabulary/marcmuscomp/ms',
    shortname: 'Masses'
  },
  '33': {
    dbcode: '33',
    name: 'http://id.loc.gov/vocabulary/marcmuscomp/op',
    shortname: 'Operas'
  },
  '34': {
    dbcode: '34',
    name: 'http://id.loc.gov/vocabulary/marcmuscomp/zz',
    shortname: 'Other'
  },
  '35': {
    dbcode: '35',
    name: 'http://id.loc.gov/vocabulary/marcmuscomp/df',
    shortname: 'Dance forms'
  },
  '36': {
    dbcode: '36',
    name: 'http://id.loc.gov/vocabulary/marcmuscomp/vr',
    shortname: 'Variations'
  },
  '37': {
    dbcode: '37',
    name: 'http://id.loc.gov/vocabulary/marcmuscomp/fg',
    shortname: 'Fugues'
  },
  '38': {
    dbcode: '38',
    name: 'http://id.loc.gov/vocabulary/marcmuscomp/ct',
    shortname: 'Cantatas'
  },
  '39': {
    dbcode: '39',
    name: 'http://id.loc.gov/vocabulary/marcmuscomp/mo',
    shortname: 'Motets'
  },
  '40': {
    dbcode: '40',
    name: 'http://id.loc.gov/vocabulary/marcmuscomp/ft',
    shortname: 'Fantasias'
  },
  '41': {
    dbcode: '41',
    name: 'http://id.loc.gov/vocabulary/marcmuscomp/or',
    shortname: 'Oratorios'
  },
  '42': {
    dbcode: '42',
    name: 'http://id.loc.gov/vocabulary/marcmuscomp/su',
    shortname: 'Suites'
  },
  '43': {
    dbcode: '43',
    name: 'http://id.loc.gov/vocabulary/marcmuscomp/pr',
    shortname: 'Preludes'
  },
  '44': {
    dbcode: '44',
    name: 'http://id.loc.gov/vocabulary/marcmuscomp/ov',
    shortname: 'Overtures'
  },
  '45': {
    dbcode: '45',
    name: 'http://id.loc.gov/vocabulary/marcgt/tre',
    shortname: 'treaty'
  },
  '46': {
    dbcode: '46',
    name: 'http://id.loc.gov/vocabulary/marcmuscomp/mr',
    shortname: 'Marches'
  },
  '47': {
    dbcode: '47',
    name: 'http://id.loc.gov/vocabulary/marcgt/pro',
    shortname: 'programmed text'
  },
  '48': {
    dbcode: '48',
    name: 'http://id.loc.gov/vocabulary/marcmuscomp/dv',
    shortname: 'Divertimentos, serenades, cassations, divertissements, and notturni'
  },
  '49': {
    dbcode: '49',
    name: 'http://id.loc.gov/vocabulary/marcmuscomp/rd',
    shortname: 'Rondos'
  },
  '50': {
    dbcode: '50',
    name: 'https://id.nlm.nih.gov/mesh/D020492',
    shortname: 'Periodical (MeSH)'
  },
  '51': {
    dbcode: '51',
    name: 'http://id.loc.gov/authorities/genreForms/gf2014026139.',
    shortname: 'Periodical (LCGFT)'
  },
  '52': {
    dbcode: '52',
    name: 'http://id.loc.gov/vocabulary/marcmuscomp/rq',
    shortname: 'Requiems'
  },
  '53': {
    dbcode: '53',
    name: 'http://id.loc.gov/vocabulary/marcmuscomp/cn',
    shortname: 'Canons and rounds'
  },
  '54': {
    dbcode: '54',
    name: 'http://id.loc.gov/vocabulary/marcmuscomp/bt',
    shortname: 'Ballets'
  },
  '55': {
    dbcode: '55',
    name: 'http://id.loc.gov/vocabulary/marcmuscomp/wz',
    shortname: 'Waltzes'
  },
  '56': {
    dbcode: '56',
    name: 'http://id.loc.gov/vocabulary/marcmuscomp/fm',
    shortname: 'Folk music'
  },
  '57': {
    dbcode: '57',
    name: 'http://id.loc.gov/vocabulary/marcmuscomp/md',
    shortname: 'Madrigals'
  },
  '58': {
    dbcode: '58',
    name: 'http://id.loc.gov/vocabulary/marcgt/map',
    shortname: 'map'
  },
  '59': {
    dbcode: '59',
    name: 'http://id.loc.gov/vocabulary/marcmuscomp/nc',
    shortname: 'Nocturnes'
  },
  '60': {
    dbcode: '60',
    name: 'http://id.loc.gov/vocabulary/marcmuscomp/pt',
    shortname: 'Part-songs'
  },
  '61': {
    dbcode: '61',
    name: 'http://id.loc.gov/vocabulary/marcmuscomp/hy',
    shortname: 'Hymns'
  },
  '62': {
    dbcode: '62',
    name: 'http://id.loc.gov/vocabulary/marcmuscomp/pm',
    shortname: 'Passion music'
  },
  '63': {
    dbcode: '63',
    name: 'http://id.loc.gov/vocabulary/marcgt/atl',
    shortname: 'atlas'
  },
  '64': {
    dbcode: '64',
    name: 'http://id.loc.gov/vocabulary/marcmuscomp/mi',
    shortname: 'Minuets'
  },
  '65': {
    dbcode: '65',
    name: 'http://id.loc.gov/vocabulary/marcmuscomp/tc',
    shortname: 'Toccatas'
  },
  '66': {
    dbcode: '66',
    name: 'https://id.nlm.nih.gov/mesh/D020504',
    shortname: 'Abstracts (MeSH)'
  },
  '67': {
    dbcode: '67',
    name: 'http://id.loc.gov/vocabulary/marcgt/stp',
    shortname: 'standard or specification'
  },
  '68': {
    dbcode: '68',
    name: 'http://id.loc.gov/vocabulary/marcmuscomp/ts',
    shortname: 'Trio-sonatas'
  },
  '69': {
    dbcode: '69',
    name: 'http://id.loc.gov/authorities/genreForms/gf2011026723',
    shortname: 'Video recordings'
  },
  '70': {
    dbcode: '70',
    name: 'http://id.loc.gov/vocabulary/marcmuscomp/ch',
    shortname: 'Chorales'
  },
  '71': {
    dbcode: '71',
    name: 'http://id.loc.gov/vocabulary/marcmuscomp/st',
    shortname: 'Studies and exercises'
  },
  '72': {
    dbcode: '72',
    name: 'http://id.loc.gov/vocabulary/marcgt/com',
    shortname: 'computer program'
  },
  '73': {
    dbcode: '73',
    name: 'http://id.loc.gov/vocabulary/marcmuscomp/cg',
    shortname: 'Concerti grossi'
  },
  '75': {
    dbcode: '75',
    name: 'http://id.loc.gov/vocabulary/marcmuscomp/cp',
    shortname: 'Chansons, polyphonic'
  },
  '76': {
    dbcode: '76',
    name: 'http://id.loc.gov/vocabulary/marcmuscomp/an',
    shortname: 'Anthems'
  },
  '77': {
    dbcode: '77',
    name: 'http://id.loc.gov/vocabulary/marcmuscomp/po',
    shortname: 'Polonaises'
  },
  '78': {
    dbcode: '78',
    name: 'http://id.loc.gov/vocabulary/marcmuscomp/cl',
    shortname: 'Chorale preludes'
  },
  '79': {
    dbcode: '79',
    name: 'http://id.loc.gov/vocabulary/marcgt/vid',
    shortname: 'videorecording'
  },
  '80': {
    dbcode: '80',
    name: 'http://id.loc.gov/authorities/genreForms/gf2014026909',
    shortname: 'Librettos'
  },
  '81': {
    dbcode: '81',
    name: 'http://id.loc.gov/vocabulary/marcmuscomp/mz',
    shortname: 'Mazurkas'
  },
  '82': {
    dbcode: '82',
    name: 'http://id.loc.gov/vocabulary/marcmuscomp/cc',
    shortname: 'Chant, Christian'
  },
  '83': {
    dbcode: '83',
    name: 'http://id.loc.gov/vocabulary/marcmuscomp/ps',
    shortname: 'Passacaglias'
  },
  '84': {
    dbcode: '84',
    name: 'http://id.loc.gov/vocabulary/marcgt/cgn',
    shortname: 'comic or graphic novel'
  },
  '85': {
    dbcode: '85',
    name: 'http://id.loc.gov/vocabulary/marcmuscomp/sp',
    shortname: 'Symphonic poems'
  },
  '86': {
    dbcode: '86',
    name: 'http://id.loc.gov/vocabulary/marcgt/num',
    shortname: 'numeric data'
  },
  '87': {
    dbcode: '87',
    name: 'http://id.loc.gov/vocabulary/marcmuscomp/pp',
    shortname: 'Popular music'
  },
  '88': {
    dbcode: '88',
    name: 'http://id.loc.gov/authorities/genreForms/gf2014026110.',
    shortname: 'Humor'
  },
  '89': {
    dbcode: '89',
    name: 'http://id.loc.gov/vocabulary/marcmuscomp/cz',
    shortname: 'Canzonas'
  },
  '90': {
    dbcode: '90',
    name: 'http://id.worldcat.org/fast/fst01411641',
    shortname: 'Periodicals (FAST)'
  },
  '91': {
    dbcode: '91',
    name: 'http://id.loc.gov/vocabulary/marcmuscomp/pv',
    shortname: 'Pavans'
  }
};
export default genreData;
