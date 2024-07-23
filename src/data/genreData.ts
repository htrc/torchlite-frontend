const genreData: any = {
  '1': {
    name: 'unknown',
    shortname: 'unknown'
  },
  '2': {
    name: 'http://id.loc.gov/vocabulary/marcgt/bib',
    shortname: 'bibliography'
  },
  '3': {
    name: 'http://id.loc.gov/vocabulary/marcgt/gov',
    shortname: 'government publication'
  },
  '4': {
    name: 'http://id.loc.gov/vocabulary/marcgt/fic',
    shortname: 'fiction'
  },
  '5': {
    name: 'http://id.loc.gov/vocabulary/marcgt/bio',
    shortname: 'biography'
  },
  '6': {
    name: 'http://id.loc.gov/vocabulary/marcgt/sta',
    shortname: 'statistics'
  },
  '7': {
    name: 'http://id.loc.gov/vocabulary/marcgt/cpb',
    shortname: 'conference publication'
  },
  '8': {
    name: 'http://id.loc.gov/vocabulary/marcgt/cat',
    shortname: 'catalog'
  },
  '9': {
    name: 'http://id.loc.gov/vocabulary/marcgt/aut',
    shortname: 'autobiography'
  },
  '10': {
    name: 'http://id.loc.gov/vocabulary/marcgt/dir',
    shortname: 'directory'
  },
  '11': {
    name: 'http://id.loc.gov/vocabulary/marcgt/dic',
    shortname: 'dictionary'
  },
  '12': {
    name: 'http://id.loc.gov/vocabulary/marcgt/leg',
    shortname: 'legislation'
  },
  '13': {
    name: 'http://id.loc.gov/vocabulary/marcgt/law',
    shortname: 'law report or digest'
  },
  '14': {
    name: 'http://id.loc.gov/vocabulary/marcgt/rev',
    shortname: 'review'
  },
  '15': {
    name: 'http://id.loc.gov/vocabulary/marcgt/ind',
    shortname: 'index'
  },
  '16': {
    name: 'http://id.loc.gov/vocabulary/marcgt/abs',
    shortname: 'abstract or summary'
  },
  '17': {
    name: 'http://id.loc.gov/vocabulary/marcgt/han',
    shortname: 'handbook'
  },
  '18': {
    name: 'http://id.loc.gov/vocabulary/marcgt/fes',
    shortname: 'festschrift'
  },
  '19': {
    name: 'http://id.loc.gov/vocabulary/marcgt/enc',
    shortname: 'encyclopedia'
  },
  '20': {
    name: 'http://id.loc.gov/vocabulary/marcgt/yea',
    shortname: 'yearbook'
  },
  '21': {
    name: 'http://id.loc.gov/vocabulary/marcgt/ter',
    shortname: 'technical report'
  },
  '22': {
    name: 'http://id.loc.gov/vocabulary/marcgt/the',
    shortname: 'thesis'
  },
  '23': {
    name: 'http://id.loc.gov/vocabulary/marcgt/lea',
    shortname: 'legal article'
  },
  '24': {
    name: 'http://id.loc.gov/vocabulary/marcgt/lec',
    shortname: 'legal case and case notes'
  },
  '25': {
    name: 'http://id.loc.gov/vocabulary/marcgt/sur',
    shortname: 'survey of literature'
  },
  '26': {
    name: 'http://id.loc.gov/vocabulary/marcmuscomp/sg',
    shortname: 'Songs'
  },
  '27': {
    name: 'http://id.loc.gov/vocabulary/marcgt/dis',
    shortname: 'discography'
  },
  '28': {
    name: 'http://id.loc.gov/vocabulary/marcmuscomp/co',
    shortname: 'Concertos'
  },
  '29': {
    name: 'http://id.loc.gov/vocabulary/marcmuscomp/sn',
    shortname: 'Sonatas'
  },
  '30': {
    name: 'http://id.loc.gov/vocabulary/marcgt/fil',
    shortname: 'filmography'
  },
  '31': {
    name: 'http://id.loc.gov/vocabulary/marcmuscomp/sy',
    shortname: 'Symphonies'
  },
  '32': {
    name: 'http://id.loc.gov/vocabulary/marcmuscomp/ms',
    shortname: 'Masses'
  },
  '33': {
    name: 'http://id.loc.gov/vocabulary/marcmuscomp/op',
    shortname: 'Operas'
  },
  '34': {
    name: 'http://id.loc.gov/vocabulary/marcmuscomp/zz',
    shortname: 'Other'
  },
  '35': {
    name: 'http://id.loc.gov/vocabulary/marcmuscomp/df',
    shortname: 'Dance forms'
  },
  '36': {
    name: 'http://id.loc.gov/vocabulary/marcmuscomp/vr',
    shortname: 'Variations'
  },
  '37': {
    name: 'http://id.loc.gov/vocabulary/marcmuscomp/fg',
    shortname: 'Fugues'
  },
  '38': {
    name: 'http://id.loc.gov/vocabulary/marcmuscomp/ct',
    shortname: 'Cantatas'
  },
  '39': {
    name: 'http://id.loc.gov/vocabulary/marcmuscomp/mo',
    shortname: 'Motets'
  },
  '40': {
    name: 'http://id.loc.gov/vocabulary/marcmuscomp/ft',
    shortname: 'Fantasias'
  },
  '41': {
    name: 'http://id.loc.gov/vocabulary/marcmuscomp/or',
    shortname: 'Oratorios'
  },
  '42': {
    name: 'http://id.loc.gov/vocabulary/marcmuscomp/su',
    shortname: 'Suites'
  },
  '43': {
    name: 'http://id.loc.gov/vocabulary/marcmuscomp/pr',
    shortname: 'Preludes'
  },
  '44': {
    name: 'http://id.loc.gov/vocabulary/marcmuscomp/ov',
    shortname: 'Overtures'
  },
  '45': {
    name: 'http://id.loc.gov/vocabulary/marcgt/tre',
    shortname: 'treaty'
  },
  '46': {
    name: 'http://id.loc.gov/vocabulary/marcmuscomp/mr',
    shortname: 'Marches'
  },
  '47': {
    name: 'http://id.loc.gov/vocabulary/marcgt/pro',
    shortname: 'programmed text'
  },
  '48': {
    name: 'http://id.loc.gov/vocabulary/marcmuscomp/dv',
    shortname: 'Divertimentos, serenades, cassations, divertissements, and notturni'
  },
  '49': {
    name: 'http://id.loc.gov/vocabulary/marcmuscomp/rd',
    shortname: 'Rondos'
  },
  '50': {
    name: 'https://id.nlm.nih.gov/mesh/D020492',
    shortname: 'Periodical (MeSH)'
  },
  '51': {
    name: 'http://id.loc.gov/authorities/genreForms/gf2014026139.',
    shortname: 'Periodical (LCGFT)'
  },
  '52': {
    name: 'http://id.loc.gov/vocabulary/marcmuscomp/rq',
    shortname: 'Requiems'
  },
  '53': {
    name: 'http://id.loc.gov/vocabulary/marcmuscomp/cn',
    shortname: 'Canons and rounds'
  },
  '54': {
    name: 'http://id.loc.gov/vocabulary/marcmuscomp/bt',
    shortname: 'Ballets'
  },
  '55': {
    name: 'http://id.loc.gov/vocabulary/marcmuscomp/wz',
    shortname: 'Waltzes'
  },
  '56': {
    name: 'http://id.loc.gov/vocabulary/marcmuscomp/fm',
    shortname: 'Folk music'
  },
  '57': {
    name: 'http://id.loc.gov/vocabulary/marcmuscomp/md',
    shortname: 'Madrigals'
  },
  '58': {
    name: 'http://id.loc.gov/vocabulary/marcgt/map',
    shortname: 'map'
  },
  '59': {
    name: 'http://id.loc.gov/vocabulary/marcmuscomp/nc',
    shortname: 'Nocturnes'
  },
  '60': {
    name: 'http://id.loc.gov/vocabulary/marcmuscomp/pt',
    shortname: 'Part-songs'
  },
  '61': {
    name: 'http://id.loc.gov/vocabulary/marcmuscomp/hy',
    shortname: 'Hymns'
  },
  '62': {
    name: 'http://id.loc.gov/vocabulary/marcmuscomp/pm',
    shortname: 'Passion music'
  },
  '63': {
    name: 'http://id.loc.gov/vocabulary/marcgt/atl',
    shortname: 'atlas'
  },
  '64': {
    name: 'http://id.loc.gov/vocabulary/marcmuscomp/mi',
    shortname: 'Minuets'
  },
  '65': {
    name: 'http://id.loc.gov/vocabulary/marcmuscomp/tc',
    shortname: 'Toccatas'
  },
  '66': {
    name: 'https://id.nlm.nih.gov/mesh/D020504',
    shortname: 'Abstracts (MeSH)'
  },
  '67': {
    name: 'http://id.loc.gov/vocabulary/marcgt/stp',
    shortname: 'standard or specification'
  },
  '68': {
    name: 'http://id.loc.gov/vocabulary/marcmuscomp/ts',
    shortname: 'Trio-sonatas'
  },
  '69': {
    name: 'http://id.loc.gov/authorities/genreForms/gf2011026723',
    shortname: 'Video recordings'
  },
  '70': {
    name: 'http://id.loc.gov/vocabulary/marcmuscomp/ch',
    shortname: 'Chorales'
  },
  '71': {
    name: 'http://id.loc.gov/vocabulary/marcmuscomp/st',
    shortname: 'Studies and exercises'
  },
  '72': {
    name: 'http://id.loc.gov/vocabulary/marcgt/com',
    shortname: 'computer program'
  },
  '73': {
    name: 'http://id.loc.gov/vocabulary/marcmuscomp/cg',
    shortname: 'Concerti grossi'
  },
  '75': {
    name: 'http://id.loc.gov/vocabulary/marcmuscomp/cp',
    shortname: 'Chansons, polyphonic'
  },
  '76': {
    name: 'http://id.loc.gov/vocabulary/marcmuscomp/an',
    shortname: 'Anthems'
  },
  '77': {
    name: 'http://id.loc.gov/vocabulary/marcmuscomp/po',
    shortname: 'Polonaises'
  },
  '78': {
    name: 'http://id.loc.gov/vocabulary/marcmuscomp/cl',
    shortname: 'Chorale preludes'
  },
  '79': {
    name: 'http://id.loc.gov/vocabulary/marcgt/vid',
    shortname: 'videorecording'
  },
  '80': {
    name: 'http://id.loc.gov/authorities/genreForms/gf2014026909',
    shortname: 'Librettos'
  },
  '81': {
    name: 'http://id.loc.gov/vocabulary/marcmuscomp/mz',
    shortname: 'Mazurkas'
  },
  '82': {
    name: 'http://id.loc.gov/vocabulary/marcmuscomp/cc',
    shortname: 'Chant, Christian'
  },
  '83': {
    name: 'http://id.loc.gov/vocabulary/marcmuscomp/ps',
    shortname: 'Passacaglias'
  },
  '84': {
    name: 'http://id.loc.gov/vocabulary/marcgt/cgn',
    shortname: 'comic or graphic novel'
  },
  '85': {
    name: 'http://id.loc.gov/vocabulary/marcmuscomp/sp',
    shortname: 'Symphonic poems'
  },
  '86': {
    name: 'http://id.loc.gov/vocabulary/marcgt/num',
    shortname: 'numeric data'
  },
  '87': {
    name: 'http://id.loc.gov/vocabulary/marcmuscomp/pp',
    shortname: 'Popular music'
  },
  '88': {
    name: 'http://id.loc.gov/authorities/genreForms/gf2014026110.',
    shortname: 'Humor'
  },
  '89': {
    name: 'http://id.loc.gov/vocabulary/marcmuscomp/cz',
    shortname: 'Canzonas'
  },
  '90': {
    name: 'http://id.worldcat.org/fast/fst01411641',
    shortname: 'Periodicals (FAST)'
  },
  '91': {
    name: 'http://id.loc.gov/vocabulary/marcmuscomp/pv',
    shortname: 'Pavans'
  }
};
export default genreData;
