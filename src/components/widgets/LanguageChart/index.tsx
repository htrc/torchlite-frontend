// @ts-nocheck
import * as d3 from 'd3';
import { useEffect, useState, useMemo, useRef } from 'react';
import { Box, Menu, MenuItem, Stack, Typography, useTheme } from '@mui/material';
import useResizeObserver from 'hooks/useResizeObserver';
import { useDispatch, useSelector } from 'store';
import NextLink from 'next/link';
import MainCard from 'components/MainCard';
import { setLanguageRangedData } from 'store/reducers/dashboard';
import IconButton from 'components/@extended/IconButton';
import { languageCSVHeaders } from 'data/react-table';
import { DownloadOutlined } from '@ant-design/icons';
import { CSVLink } from 'react-csv';
import { saveAs } from 'file-saver';
import { getLanguageDataSuccess } from 'store/reducers/dashboard';
import { getLanguageCounts } from 'services';

const MARGIN = { top: 20, right: 20, bottom: 20, left: 25 };

const LANGUAGE_MAPPINGS = {
  "eng": "English",
  "ger": "German",
  "fre": "French",
  "spa": "Spanish",
  "rus": "Russian",
  "chi": "Chinese",
  "jpn": "Japanese",
  "ita": "Italian",
  "por": "Portuguese",
  "lat": "Latin",
  "ara": "Arabic",
  "und": "Undetermined",
  "dut": "Dutch",
  "pol": "Polish",
  "unknown": "unknown",
  "swe": "Swedish",
  "heb": "Hebrew",
  "dan": "Danish",
  "kor": "Korean",
  "cze": "Czech",
  "hin": "Hindi",
  "ind": "Indonesian",
  "hun": "Hungarian",
  "unk": "unk",
  "mul": "Multiple languages",
  "nor": "Norwegian",
  "tur": "Turkish",
  "scr": "Croatian",
  "zxx": "No linguistic content",
  "urd": "Urdu",
  "tha": "Thai",
  "gre": "Greek, Modern (1453-)",
  "per": "Persian",
  "grc": "Greek, Ancient (to 1453)",
  "san": "Sanskrit",
  "tam": "Tamil",
  "ukr": "Ukrainian",
  "bul": "Bulgarian",
  "scc": "Serbian",
  "rum": "Romanian",
  "ben": "Bengali",
  "vie": "Vietnamese",
  "fin": "Finnish",
  "arm": "Armenian",
  "cat": "Catalan",
  "slo": "Slovak",
  "slv": "Slovenian",
  "yid": "Yiddish",
  "mar": "Marathi",
  "may": "Malay",
  "pan": "Panjabi",
  "afr": "Afrikaans",
  "tel": "Telugu",
  "ota": "Turkish, Ottoman",
  "tib": "Tibetan",
  "ice": "Icelandic",
  "mal": "Malayalam",
  "est": "Estonian",
  "bel": "Belarusian",
  "lit": "Lithuanian",
  "mac": "Macedonian",
  "lav": "Latvian",
  "nep": "Nepali",
  "uzb": "Uzbek",
  "wel": "Welsh",
  "kan": "Kannada",
  "geo": "Georgian",
  "guj": "Gujarati",
  "snh": "Sinhalese",
  "srp": "Serbian",
  "hrv": "Croatian (Discontinued Code)",
  "bur": "Burmese",
  "pli": "Pali",
  "kaz": "Kazakh",
  "tgl": "Tagalog",
  "aze": "Azerbaijani",
  "mon": "Mongolian",
  "jav": "Javanese",
  "ser": "ser",
  "iri": "Irish (Discontinued Code)",
  "hau": "Hausa",
  "fro": "French, Old (ca. 842-1300)",
  "swa": "Swahili",
  "map": "Austronesian (Other)",
  "gmh": "German, Middle High (ca. 1050-1500)",
  "syr": "Syriac, Modern",
  "raj": "Rajasthani",
  "ori": "Oriya",
  "alb": "Albanian",
  "cro": "cro",
  "jap": "jap",
  "sla": "Slavic (Other)",
  "enm": "English, Middle (1100-1500)",
  "arc": "Aramaic",
  "pra": "Prakrit languages",
  "sin": "Sinhalese",
  "chu": "Church Slavic",
  "ang": "English, Old (ca. 450-1100)",
  "gle": "Irish",
  "nic": "Niger-Kordofanian (Other)",
  "kir": "Kyrgyz",
  "frm": "French, Middle (ca. 1300-1600)",
  "tut": "Altaic (Other)",
  "roa": "Romance (Other)",
  "tag": "Tagalog (Discontinued Code)",
  "inc": "Indic (Other)",
  "tat": "Tatar",
  "myn": "Mayan languages",
  "tuk": "Turkmen",
  "sun": "Sundanese",
  "baq": "Basque",
  "sai": "South American Indian (Other)",
  "mai": "Maithili",
  "egy": "Egyptian",
  "akk": "Akkadian",
  "sit": "Sino-Tibetan (Other)",
  "que": "Quechua",
  "pro": "Provençal (to 1500)",
  "cop": "Coptic",
  "int": "Interlingua (International Auxiliary Language Association) (Discontinued Code)",
  "yor": "Yoruba",
  "paa": "Papuan (Other)",
  "bra": "Braj",
  "new": "Newari",
  "pus": "Pushto",
  "amh": "Amharic",
  "bos": "Bosnian",
  "rom": "Romani",
  "gem": "Germanic (Other)",
  "fiu": "Finno-Ugrian (Other)",
  "mol": "Moldavian (Discontinued Code)",
  "fle": "fle",
  "roh": "Raeto-Romance",
  "fri": "Frisian (Discontinued Code)",
  "lao": "Lao",
  "snd": "Sindhi",
  "wen": "Sorbian (Other)",
  "nah": "Nahuatl",
  "bak": "Bashkir",
  "pal": "Pahlavi",
  "asm": "Assamese",
  "glg": "Galician",
  "cai": "Central American Indian (Other)",
  "gag": "Galician (Discontinued Code)",
  "uig": "Uighur",
  "tgk": "Tajik",
  "gae": "Scottish Gaelix (Discontinued Code)",
  "khm": "Khmer",
  "esp": "Esperanto (Discontinued Code)",
  "epo": "Esperanto",
  "gez": "Ethiopic",
  "bho": "Bhojpuri",
  "gla": "Scottish Gaelic",
  "kas": "Kashmiri",
  "som": "Somali",
  "nai": "North American Indian (Other)",
  "fry": "Frisian",
  "crp": "Creoles and Pidgins (Other)",
  "zul": "Zulu",
  "taj": "Tajik (Discontinued Code)",
  "mao": "Maori",
  "eth": "Ethiopic (Discontinued Code)",
  "tah": "Tahitian",
  "mis": "Miscellaneous languages",
  "lan": "Occitan (post 1500) (Discontinued Code)",
  "haw": "Hawaiian",
  "sna": "Shona",
  "cpf": "Creoles and Pidgins, French-based (Other)",
  "cau": "Caucasian (Other)",
  "jrb": "Judeo-Arabic",
  "kur": "Kurdish",
  "sot": "Sotho",
  "awa": "Awadhi",
  "bre": "Breton",
  "oci": "Occitan (post-1500)",
  "ban": "Balinese",
  "ibo": "Igbo",
  "lad": "Ladino",
  "mlg": "Malagasy",
  "goh": "German, Old High (ca. 750-1050)",
  "rur": "rur",
  "tsn": "Tswana",
  "sux": "Sumerian",
  "enf": "enf",
  "ber": "Berber (Other)",
  "doi": "Dogri",
  "gua": "Guarani (Discontinued Code)",
  "bnt": "Bantu (Other)",
  "esk": "Eskimo languages (Discontinued Code)",
  "kin": "Kinyarwanda",
  "mni": "Manipuri",
  "xho": "Xhosa",
  "ssa": "Nilo-Saharan (Other)",
  "aym": "Aymara",
  "ful": "Fula",
  "dum": "Dutch, Middle (ca. 1050-1350)",
  "tar": "Tatar (Discontinued Code)",
  "end": "end"
}

export const LanguageChart = ({ detailPage = false }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const { languageData: modifiedDataHistogram, languageRangedData: storedLanguageRangedData, appliedFilters } = useSelector((state) => state.dashboard);
  const chartWrapper = useRef();
  const dimensions = useResizeObserver(chartWrapper);
  let width = dimensions?.width || 500;
  let height = width / 2;
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;
  interface LangCount {
    lang: string, 
    count: number
  }
  const [langCounts, setLangCounts] = useState<LangCount[]>([]);

  const [anchorEl, setAnchorEl] = useState<Element | ((element: Element) => Element) | null | undefined>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement> | undefined) => {
    setAnchorEl(event?.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (storedLanguageRangedData.length == 0) {
      fetch(`https://tools.htrc.illinois.edu/ef-api/worksets/6409650730000004085ce312/metadata?fields=metadata.language`)
        .then(response => {
          if (response.status !== 200) {
            console.log(`There was a problem: ${response.status}`)
            return
          }
          response.json().then(
          languagedata => {
            setLangCounts(getLanguageCounts(languagedata.data));
          })
        })
    }
  }, [storedLanguageRangedData]);

  useEffect(() => {
    // Check if the data has actually changed
    if (JSON.stringify(storedLanguageRangedData) !== JSON.stringify(langCounts)) {
      dispatch(setLanguageRangedData(langCounts));
    }
  }, [langCounts, storedLanguageRangedData, dispatch]);

/*  useEffect(() => {
    arcsFunction({ inputRef }, langCounts, LANGUAGE_MAPPINGS, d3, width, height)
  }, [arcsFunction, langCounts])*/

/*  const colors = d3.scaleOrdinal(d3.schemeCategory10);
  const radius = Math.min(width, height) / 2,
  outerRadius = radius - 10;
  const counts = langCounts.map((d) => d.count);
  console.log(langCounts)
  console.log(counts)

  const pieGenerator = d3.pie();
  const arcs = pieGenerator(counts);
  console.log(arcs);
  console.log(arcs.length)

  const constructedArcs = arcs.map((arc, i) => {
    const constructedArc = d3.arc()({
      innerRadius: 0,
      outerRadius: outerRadius,
      startAngle: arc['startAngle'],
      endAngle: arc['endAngle']
    })

    return (
      <path
        key={i}
        d={constructedArc!}
        fill={colors(String(arc['index']))}
        transform={`translate(${width/2},${height/2})`}
      />
    )
  })*/

  const arcsFunction = new Function(['{ inputRef }','langCs','langMap','d3','width','height'],`
      const container = d3.select(inputRef.current);
  //    const colors = d3.scaleOrdinal(d3.schemeCategory10);
      const colors = d3.scaleOrdinal([
        "#50b47b",
        "#b55b37",
        "#902a6c",
        "#5b3687",
        "#7fa03f",
        "#dc6295",
        "#bf4553",
        "#c777cb",
        "#c99638",
        "#6d71d8"
      ]);
      const radius = Math.min(width, height) / 2,
      outerRadius = radius - 10;
      const labelRadius = outerRadius * 0.8;
  
      var sortedLangCs = langCs.toSorted((a,b) => b.count - a.count);
      if (sortedLangCs.length >= 10) {
        sortedLangCs.push({lang: 'Other', count: sortedLangCs.slice(9).reduce((accumulator, currentValue) => accumulator + currentValue.count, 0)});
        var trunkatedLangCs = sortedLangCs.slice(0,9);
        trunkatedLangCs.push(sortedLangCs[sortedLangCs.length-1]);
        sortedLangCs = trunkatedLangCs;
        sortedLangCs.sort((a,b) => b.count - a.count)
      }
  
      const svgColor = container
        .select('svg')
        .attr('viewBox', [0, 0, width, height])
        .attr('style', 'width: 100%; height: auto; height: intrinsic;')
        .select('g')
  
      function formatCounts(instance) {
        return { value: instance.count, name: instance.lang };
      }
  
      const counts = sortedLangCs.map(formatCounts);
  
      const pieGenerator = d3.pie()
        .sort((a,b) => d3.descending(a.value, b.value))
        .value(d => d.value);
      const arcs = pieGenerator(counts);
      const generatedArcs = svgColor.selectAll("path")
        .data(arcs)
  
  /*    const arcLabel = d3.arc()({
        innerRadius: 0,
        outerRadius: labelRadius
      })*/
      
      console.log(arcs)
      generatedArcs.enter()
        .append('path')
        .attr('d',function(d) {
          return d3.arc()({
            innerRadius: 0,
            outerRadius: outerRadius,
            startAngle: d['startAngle'],
            endAngle: d['endAngle']
          })
        })
        .attr('fill',function(d) {
          return colors(String(d['index']))
        })
        .attr('transform', \`translate(\${width/2},\${height/2})\`)
        .append('title')
          .text(d => \`\${d.data.name in langMap ? langMap[d.data.name] : d.data.name}: \${d.data.value}\`)`)
/*  const arcs = ({ inputRef }, langCs : LangCount[], langMap) => {
    const container = d3.select(inputRef.current);
//    const colors = d3.scaleOrdinal(d3.schemeCategory10);
    const colors = d3.scaleOrdinal([
/*      "#b5508f",
      "#6ca44f",
      "#583789",
      "#bda73b",
      "#6c81d9",
      "#b17535",
      "#c071c9",
      "#45c097",
      "#bb486a",
      "#bb4c41"*/
/*      "#50b47b",
      "#b55b37",
      "#902a6c",
      "#5b3687",
      "#7fa03f",
      "#dc6295",
      "#bf4553",
      "#c777cb",
      "#c99638",
      "#6d71d8"
    ]);
    const radius = Math.min(width, height) / 2,
    outerRadius = radius - 10;
    const labelRadius = outerRadius * 0.8;

    var sortedLangCs = langCs.toSorted((a,b) => b.count - a.count);
    if (sortedLangCs.length > 10) {
      sortedLangCs.push({lang: 'Other', count: sortedLangCs.slice(9).reduce((accumulator, currentValue) => accumulator + currentValue.count, 0)});
      var trunkatedLangCs = sortedLangCs.slice(0,9);
      trunkatedLangCs.push(sortedLangCs[sortedLangCs.length-1]);
      sortedLangCs = trunkatedLangCs;
      sortedLangCs.sort((a,b) => b.count - a.count)
    }

    const svgColor = container
      .select('svg')
      .attr('viewBox', [0, 0, width, height])
      .attr('style', 'width: 100%; height: auto; height: intrinsic;')
      .select('g')

    function formatCounts(instance) {
      return { value: instance.count, name: instance.lang };
    }

    const counts = sortedLangCs.map(formatCounts);

    const pieGenerator = d3.pie()
      .sort((a,b) => d3.descending(a.value, b.value))
      .value(d => d.value);
    const arcs = pieGenerator(counts);
    const generatedArcs = svgColor.selectAll("path")
      .data(arcs)

/*    const arcLabel = d3.arc()({
      innerRadius: 0,
      outerRadius: labelRadius
    })*/
    
/*    console.log(arcs)
    generatedArcs.enter()
      .append('path')
      .attr('d',function(d) {
        return d3.arc()({
          innerRadius: 0,
          outerRadius: outerRadius,
          startAngle: d['startAngle'],
          endAngle: d['endAngle']
        })
      })
      .attr('fill',function(d) {
        return colors(String(d['index']))
      })
      .attr('transform', `translate(${width/2},${height/2})`)
      .append('title')
        .text(d => `${d.data.name in langMap ? langMap[d.data.name] : d.data.name}: ${d.data.value}`)
  }*/

  const iframeCode = `
    <div id="graph-container">
      <svg width='100%' height='100%'>
        <g>
          
        </g>
      </svg>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/d3@7"></script>
    <script type="module">
      const DATA_LABELS = {
        "eng": "English",
        "ger": "German",
        "fre": "French",
        "spa": "Spanish",
        "rus": "Russian",
        "chi": "Chinese",
        "jpn": "Japanese",
        "ita": "Italian",
        "por": "Portuguese",
        "lat": "Latin",
        "ara": "Arabic",
        "und": "Undetermined",
        "dut": "Dutch",
        "pol": "Polish",
        "unknown": "unknown",
        "swe": "Swedish",
        "heb": "Hebrew",
        "dan": "Danish",
        "kor": "Korean",
        "cze": "Czech",
        "hin": "Hindi",
        "ind": "Indonesian",
        "hun": "Hungarian",
        "unk": "unk",
        "mul": "Multiple languages",
        "nor": "Norwegian",
        "tur": "Turkish",
        "scr": "Croatian",
        "zxx": "No linguistic content",
        "urd": "Urdu",
        "tha": "Thai",
        "gre": "Greek, Modern (1453-)",
        "per": "Persian",
        "grc": "Greek, Ancient (to 1453)",
        "san": "Sanskrit",
        "tam": "Tamil",
        "ukr": "Ukrainian",
        "bul": "Bulgarian",
        "scc": "Serbian",
        "rum": "Romanian",
        "ben": "Bengali",
        "vie": "Vietnamese",
        "fin": "Finnish",
        "arm": "Armenian",
        "cat": "Catalan",
        "slo": "Slovak",
        "slv": "Slovenian",
        "yid": "Yiddish",
        "mar": "Marathi",
        "may": "Malay",
        "pan": "Panjabi",
        "afr": "Afrikaans",
        "tel": "Telugu",
        "ota": "Turkish, Ottoman",
        "tib": "Tibetan",
        "ice": "Icelandic",
        "mal": "Malayalam",
        "est": "Estonian",
        "bel": "Belarusian",
        "lit": "Lithuanian",
        "mac": "Macedonian",
        "lav": "Latvian",
        "nep": "Nepali",
        "uzb": "Uzbek",
        "wel": "Welsh",
        "kan": "Kannada",
        "geo": "Georgian",
        "guj": "Gujarati",
        "snh": "Sinhalese",
        "srp": "Serbian",
        "hrv": "Croatian (Discontinued Code)",
        "bur": "Burmese",
        "pli": "Pali",
        "kaz": "Kazakh",
        "tgl": "Tagalog",
        "aze": "Azerbaijani",
        "mon": "Mongolian",
        "jav": "Javanese",
        "ser": "ser",
        "iri": "Irish (Discontinued Code)",
        "hau": "Hausa",
        "fro": "French, Old (ca. 842-1300)",
        "swa": "Swahili",
        "map": "Austronesian (Other)",
        "gmh": "German, Middle High (ca. 1050-1500)",
        "syr": "Syriac, Modern",
        "raj": "Rajasthani",
        "ori": "Oriya",
        "alb": "Albanian",
        "cro": "cro",
        "jap": "jap",
        "sla": "Slavic (Other)",
        "enm": "English, Middle (1100-1500)",
        "arc": "Aramaic",
        "pra": "Prakrit languages",
        "sin": "Sinhalese",
        "chu": "Church Slavic",
        "ang": "English, Old (ca. 450-1100)",
        "gle": "Irish",
        "nic": "Niger-Kordofanian (Other)",
        "kir": "Kyrgyz",
        "frm": "French, Middle (ca. 1300-1600)",
        "tut": "Altaic (Other)",
        "roa": "Romance (Other)",
        "tag": "Tagalog (Discontinued Code)",
        "inc": "Indic (Other)",
        "tat": "Tatar",
        "myn": "Mayan languages",
        "tuk": "Turkmen",
        "sun": "Sundanese",
        "baq": "Basque",
        "sai": "South American Indian (Other)",
        "mai": "Maithili",
        "egy": "Egyptian",
        "akk": "Akkadian",
        "sit": "Sino-Tibetan (Other)",
        "que": "Quechua",
        "pro": "Provençal (to 1500)",
        "cop": "Coptic",
        "int": "Interlingua (International Auxiliary Language Association) (Discontinued Code)",
        "yor": "Yoruba",
        "paa": "Papuan (Other)",
        "bra": "Braj",
        "new": "Newari",
        "pus": "Pushto",
        "amh": "Amharic",
        "bos": "Bosnian",
        "rom": "Romani",
        "gem": "Germanic (Other)",
        "fiu": "Finno-Ugrian (Other)",
        "mol": "Moldavian (Discontinued Code)",
        "fle": "fle",
        "roh": "Raeto-Romance",
        "fri": "Frisian (Discontinued Code)",
        "lao": "Lao",
        "snd": "Sindhi",
        "wen": "Sorbian (Other)",
        "nah": "Nahuatl",
        "bak": "Bashkir",
        "pal": "Pahlavi",
        "asm": "Assamese",
        "glg": "Galician",
        "cai": "Central American Indian (Other)",
        "gag": "Galician (Discontinued Code)",
        "uig": "Uighur",
        "tgk": "Tajik",
        "gae": "Scottish Gaelix (Discontinued Code)",
        "khm": "Khmer",
        "esp": "Esperanto (Discontinued Code)",
        "epo": "Esperanto",
        "gez": "Ethiopic",
        "bho": "Bhojpuri",
        "gla": "Scottish Gaelic",
        "kas": "Kashmiri",
        "som": "Somali",
        "nai": "North American Indian (Other)",
        "fry": "Frisian",
        "crp": "Creoles and Pidgins (Other)",
        "zul": "Zulu",
        "taj": "Tajik (Discontinued Code)",
        "mao": "Maori",
        "eth": "Ethiopic (Discontinued Code)",
        "tah": "Tahitian",
        "mis": "Miscellaneous languages",
        "lan": "Occitan (post 1500) (Discontinued Code)",
        "haw": "Hawaiian",
        "sna": "Shona",
        "cpf": "Creoles and Pidgins, French-based (Other)",
        "cau": "Caucasian (Other)",
        "jrb": "Judeo-Arabic",
        "kur": "Kurdish",
        "sot": "Sotho",
        "awa": "Awadhi",
        "bre": "Breton",
        "oci": "Occitan (post-1500)",
        "ban": "Balinese",
        "ibo": "Igbo",
        "lad": "Ladino",
        "mlg": "Malagasy",
        "goh": "German, Old High (ca. 750-1050)",
        "rur": "rur",
        "tsn": "Tswana",
        "sux": "Sumerian",
        "enf": "enf",
        "ber": "Berber (Other)",
        "doi": "Dogri",
        "gua": "Guarani (Discontinued Code)",
        "bnt": "Bantu (Other)",
        "esk": "Eskimo languages (Discontinued Code)",
        "kin": "Kinyarwanda",
        "mni": "Manipuri",
        "xho": "Xhosa",
        "ssa": "Nilo-Saharan (Other)",
        "aym": "Aymara",
        "ful": "Fula",
        "dum": "Dutch, Middle (ca. 1050-1350)",
        "tar": "Tatar (Discontinued Code)",
        "end": "end"
      };

      const WIDGET_DATA = ${JSON.stringify(langCounts)};

      buildWidget(WIDGET_DATA,DATA_LABELS);

      function buildWidget(widgetData,dataLabels) {
        const container = d3.select('#graph-container');
  //    const colors = d3.scaleOrdinal(d3.schemeCategory10);
      const colors = d3.scaleOrdinal([
        "#50b47b",
        "#b55b37",
        "#902a6c",
        "#5b3687",
        "#7fa03f",
        "#dc6295",
        "#bf4553",
        "#c777cb",
        "#c99638",
        "#6d71d8"
      ]);
      const radius = Math.min(innerWidth, innerHeight) / 2,
      outerRadius = radius - 10;
      const labelRadius = outerRadius * 0.8;

      var sortedLangCs = widgetData.toSorted((a,b) => b.count - a.count);
      console.log(sortedLangCs);
      if (sortedLangCs.length >= 10) {
        sortedLangCs.push({lang: 'Other', count: sortedLangCs.slice(9).reduce((accumulator, currentValue) => accumulator + currentValue.count, 0)});
        var trunkatedLangCs = sortedLangCs.slice(0,9);
        trunkatedLangCs.push(sortedLangCs[sortedLangCs.length-1]);
        sortedLangCs = trunkatedLangCs;
        sortedLangCs.sort((a,b) => b.count - a.count)
      }

      const svgColor = container
        .select('svg')
        .attr('viewBox', [0, 0, innerWidth, innerHeight])
        .attr('style', 'width: 100%; height: auto; height: intrinsic;')
        .select('g')

      function formatCounts(instance) {
        return { value: instance.count, name: instance.lang };
      }

      const counts = sortedLangCs.map(formatCounts);

      const pieGenerator = d3.pie()
        .sort((a,b) => d3.descending(a.value, b.value))
        .value(d => d.value);
      const arcs = pieGenerator(counts);
      const generatedArcs = svgColor.selectAll("path")
        .data(arcs)

  /*    const arcLabel = d3.arc()({
        innerRadius: 0,
        outerRadius: labelRadius
      })*/
      
      console.log(arcs)
      generatedArcs.enter()
        .append('path')
        .attr('d',function(d) {
          return d3.arc()({
            innerRadius: 0,
            outerRadius: outerRadius,
            startAngle: d['startAngle'],
            endAngle: d['endAngle']
          })
        })
        .attr('fill',function(d) {
          return colors(String(d['index']))
        })
        .attr('transform', \`translate(\${innerWidth/2},\${innerHeight/2})\`)
        .append('title')
          .text(d => \`\${d.data.name in dataLabels ? dataLabels[d.data.name] : d.data.name}: \${d.data.value}\`)
      }
    </script>`

  const downloadData = (format: string) => {
    const svg = chartWrapper.current.querySelector('svg');
    const svgData = new XMLSerializer().serializeToString(svg);
    if (format === 'svg') {
      const blobSVG = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      saveAs(blobSVG, 'chart.svg');
    } else if (format === 'png') {
      const canvas = document.createElement('canvas');
      canvas.width = svg.width.baseVal.value;
      canvas.height = svg.height.baseVal.value;

      const ctx = canvas.getContext('2d');
      const DOMURL = window.URL || window.webkitURL || window;
      const img = new Image();

      img.onload = function () {
        ctx.drawImage(img, 0, 0);
        const png = canvas.toDataURL('image/png');
        saveAs(png, 'chart.png');
      };

      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = DOMURL.createObjectURL(svgBlob);
      img.src = url;
    }
    handleClose();
  };

  return (
    <MainCard
      content={false}
      sx={{
        padding: theme.spacing(4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative'
      }}
    >
      {detailPage ? (
        <Typography variant="h3" sx={{ color: '#1e98d7' }}>
          Workset Languages
        </Typography>
      ) : (
        <NextLink href="/widget-details/language">
          <Typography variant="h3" sx={{ color: '#1e98d7', cursor: 'pointer' }}>
            Workset Languages
          </Typography>
        </NextLink>
      )}

      {detailPage && (
        <Stack direction="row" justifyContent="flex-end" sx={{ position: 'absolute', right: '2rem' }}>
          <IconButton
            sx={{
              border: `1px solid ${theme.palette.grey[400]}`,
              '&:hover': { backgroundColor: 'transparent' }
            }}
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
          >
            <DownloadOutlined style={{ color: theme.palette.grey[900] }} />
          </IconButton>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button'
            }}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right'
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
          >
            <MenuItem onClick={() => downloadData('png')}>PNG image</MenuItem>
            <MenuItem onClick={() => downloadData('svg')}>SVG image</MenuItem>
            <CSVLink
              data={langCounts}
              filename={`Language_Data${new Date().toISOString().split('T')[0]}.csv`}
              headers={languageCSVHeaders}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <MenuItem onClick={() => downloadData('csv')}>CSV data</MenuItem>
            </CSVLink>
          </Menu>
        </Stack>
      )}
      <Box sx={{ width: '100%', marginTop: '50px' }} ref={chartWrapper}>
        <iframe srcDoc={iframeCode} width={width} height={height} style={{ border: '0px'}} sandbox='allow-scripts' scrolling="no"></iframe>
{/*        <div id="graph-container" ref={inputRef}>
          <svg width={width} height={height}>
            <g width={boundsWidth} height={boundsHeight}>
              
            </g>
          </svg>
          </div>*/}
      </Box>
    </MainCard>
  );
};