// @ts-nocheck
import * as d3 from 'd3';
import { useEffect, useState, useMemo, useRef } from 'react';
import { Box, Menu, MenuItem, Stack, Typography, useTheme, Grid } from '@mui/material';
import CustomSlider from 'components/CustomSlider';
import useResizeObserver from 'hooks/useResizeObserver';
import { useDispatch, useSelector } from 'store';
import NextLink from 'next/link';
import MainCard from 'components/MainCard';
import React from 'react'; 
import Select from 'react-select';
import IconButton from 'components/@extended/IconButton';
import { DownloadOutlined } from '@ant-design/icons'; 
import { CSVLink } from 'react-csv'; 
import DataTable from 'components/DataTable';
import { volumeColumns, volumeCSVHeaders } from 'data/react-table';
import LineGraph from './lineGraph';
import useDashboardState from 'hooks/useDashboardState';
import { CSVHeaders } from 'data/constants';


const MARGIN = { top: 20, right: 20, bottom: 20, left: 20 };
const BUCKET_PADDING = 1;

export const Summary = ({ data, widgetType, isDetailsPage = false }) => { 
  console.log("SUMMARY");
  console.log(data);
  const theme = useTheme();
  const dispatch = useDispatch();
  const axesRef = useRef(null);
  const chartWrapper = useRef();
  const dimensions = useResizeObserver(chartWrapper);
  const { onChangeWidgetState } = useDashboardState();

  const [storedVolumeData, setStoredVolumeData] = useState([]);

  const [anchorEl, setAnchorEl] = useState<Element | ((element: Element) => Element) | null | undefined>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement> | undefined) => {
    setAnchorEl(event?.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const chartDataHistogram = useMemo(() => {
    console.log("BUILDING HISTOGRAM")
    if (data.lengthGraph) {
      var output_array = [];
      for (const [key, value] of Object.entries(data.lengthGraph)) {
        output_array.push({ 'title': key, 'length': value, 'density': data.densityGraph[key] })
      }
      console.log(output_array);
      return output_array;
    }
    else {
      return [];
    }
  }, [data]);

  useEffect(() => {
    console.log("DATA")
    console.log(chartDataHistogram)
    onChangeWidgetState({
      widgetType: widgetType,
      data: chartDataHistogram
    });
  }, [chartDataHistogram, widgetType]);

  const [matchingWords, setMatchingWords] = useState([]);
  const [perVolDict, setPerVolDict] = useState({});
  const worksetId = '6424aa97330000a001a5dc9b';

  /*useEffect(() => {
    // Fetch data from the API when the component mounts
    fetchDataFromAPI();
  }, []);*/

  /*const lineData = {
    'Bilder vom Erzählen : Gedichte': 7274,
    'Highlights of ...': 7422,
    'The Law times reports': 1381366,
    'The cruise of the Marchesa to Kamschatka & New Guinea.': 231986,
  };*/

  
  const [totalWords, setTotalWords] = useState([]);
  const [uniqueWords, setUniqueWords] = useState([]);

  const [longestDoc, setLongestDoc] = useState([]);
  const [shortestDoc, setShortestDoc] = useState([]);
  const [highestDensityDoc, setHighestDensityDoc] = useState([]);
  const [lowestDensityDoc, setLowestDensityDoc] = useState([]);
  const [mostReadableDoc, setMostReadableDoc] = useState([]);
  const [leastReadableDoc, setLeastReadableDoc] = useState([]);

  const [documentLengths, setdocumentLengths] = useState([]);
  const [vocabDensity, setvocabDensity] = useState([]);

  const [lengthGraph, setLengthGraph] = useState([]);
  const [densityGraph, setDensityGraph] = useState([]);

  const [documentData, setdocumentData] = useState([]);
  const [densityData, setdensityData] = useState([]);
    
    
  /*const fetchDataFromAPI = async () => {
    try {
      
      const response = await fetch(`https://tools.htrc.illinois.edu/ef-api/worksets/${worksetId}/volumes?pos=false&fields=features.pages.tokenCount,features.pages.body.tokensCount,htid,metadata.title`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();

      const updateDict = (tokenDict, resultsDict) => {  
        if (tokenDict) {
          for (const [token, count] of Object.entries(tokenDict)) {
            const lowercaseToken = token.toLowerCase();
            resultsDict[lowercaseToken] = (resultsDict[lowercaseToken] || 0) + count;
          }
        }
       };

      const updatedset = (token_dict, unique_word_forms, volumeid) => {
        if (token_dict) {q
          
          for (const [token, count] of Object.entries(token_dict)) {
            const lowercaseToken = token.toLowerCase();
            
            if (unique_word_forms[volumeid]) {
              unique_word_forms[volumeid].add(lowercaseToken);
            } else {
              // If the volume identifier doesn't exist, create a new set with the token
              unique_word_forms[volumeid] = new Set([lowercaseToken]);
            }
          }
        }
      };

      const calculate_readability = (num_words) => {
      const avg_words_per_sentence = 15  
      const avg_syllables_per_word = 1.2  

      let num_sentences = num_words / avg_words_per_sentence
      let num_syllables = num_words * avg_syllables_per_word

      readability_score = 0.39 * (num_words / num_sentences) + 11.8 * (num_syllables / num_words) - 15.59
      return readability_score
      };
    
      let total = 0;
      let totalunique = 0;
      const loacalPerVolDict = {};
      const per_vol_set = {}
      const frequentWords = {};

      let document_lengths = {}
      let document_words = {}
      let vocab_density = {}
      let readability_score = {}
      let read_score = 0

      for (const volume of data.data) {
        let individualVol = 0;
        let individualUni = 0;
          
        loacalPerVolDict[volume.htid] = {}
        per_vol_set[volume.htid] = {}
           
        for (const page of volume.features.pages) {
          const body = page.body;
          if (body.tokensCount !== null) {
              updateDict(body.tokensCount,loacalPerVolDict[volume.htid]);
              updatedset(body.tokensCount, per_vol_set[volume.htid], volume.htid)
          }
          
          total += page.tokenCount;
          individualVol += page.tokenCount;
        }
        
        
        const volumeId = volume.htid; 
        
        individualUni = per_vol_set[volumeId] ? per_vol_set[volumeId][volumeId].size : 0;
        
        totalunique += individualUni


        /* if (!document_lengths[volume.metadata.title] || typeof document_lengths[volume.metadata.title] !== 'object') {
          document_lengths[volume.metadata.title] = {};
        } */
        /*document_lengths[volume.metadata.title] = individualVol
        console.log("document_lengths", document_lengths);

        document_words[volume.metadata.title] = individualVol
        console.log("document_words", document_words);
 
        vocab_density[volume.metadata.title] = (individualVol / individualUni) / 100 
        console.log("vocab_density", vocab_density);
    
        read_score = calculate_readability(individualVol)
        //readability_score[volume.metadata.title] = read_score;

        console.log("readability_score", readability_score);

        console.log('Volume name:', volume.metadata.title)
        console.log('Total words:', individualVol) 
        console.log('Total Unique:', individualUni)
      } 
 
      setLengthGraph(document_lengths);
      setDensityGraph(vocab_density);

      setdocumentLengths(document_lengths);
      
      setTotalWords(total);
      setUniqueWords(totalunique); 
      // Find the longest document 
      let sortedDocuments = Object.keys(document_lengths).sort((a, b) => document_lengths[b] - document_lengths[a]);
      let limitedDocuments = sortedDocuments.slice(0, 5);
      const longestDocumentsString = limitedDocuments.map(doc => `${doc} (${document_lengths[doc]})`).join(';  ');
      setLongestDoc(longestDocumentsString);

      // Find the shortest document
      sortedDocuments = Object.keys(document_lengths).sort((a, b) => document_lengths[a] - document_lengths[b]);
      limitedDocuments = sortedDocuments.slice(0, 5);
      const shortestDocumentsString = limitedDocuments.map(doc => `${doc} (${document_lengths[doc]})`).join(';  ');
      setShortestDoc(shortestDocumentsString);

      // Find the document with the highest vocabulary density
      sortedDocuments = Object.keys(vocab_density).sort((a, b) => vocab_density[b] - vocab_density[a]);
      limitedDocuments = sortedDocuments.slice(0, 5);
      const highestDense = limitedDocuments.map(doc => `${doc} (${vocab_density[doc]})`).join(';  ');
      setHighestDensityDoc(highestDense);

      // Find the document with the lowest vocabulary density
      sortedDocuments = Object.keys(vocab_density).sort((a, b) => vocab_density[a] - vocab_density[b]);
      limitedDocuments = sortedDocuments.slice(0, 5);
      const lowestDense = limitedDocuments.map(doc => `${doc} (${vocab_density[doc]})`).join(';  ');
      setLowestDensityDoc(lowestDense);

      /* // Find the document with the highest readability score
      const highestReadabilityDocument = Object.keys(readability_score).reduce((a, b) => readability_score[a] > readabilityScore[b] ? a : b);
      const highestReadability = readability_score[highestReadabilityDocument];

      // Find the document with the lowest readability score
      const lowestReadabilityDocument = Object.keys(readability_score).reduce((a, b) => readability_score[a] < readabilityScore[b] ? a : b);
      const lowestReadability = readability_score[lowestReadabilityDocument];
 */
      
      
      /*setPerVolDict(loacalPerVolDict);

      const documents = Object.entries(document_lengths);
      const vocabs = Object.entries(vocab_density);

      setdocumentData(documents);
      // Check the type
      console.log("pooj",typeof documentData);
      setvocabDensity(vocabs);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };*/  

  const downloadData = (format: string) => {
    const container = document.getElementById('input-container');
    let yOffset = 0;
    const rightMargin = 10;

    const svg = chartWrapper.current.querySelector('div#input-container');
    const svgData = new XMLSerializer().serializeToString(svg);
    if (format === 'svg') {
      const blobSVG = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      saveAs(blobSVG, 'chart.svg');
    } else if (format === 'png') {
      const canvas = document.createElement('canvas');

      const ctx = canvas.getContext('2d');
      const DOMURL = window.URL || window.webkitURL || window;
      const img = new Image();

      img.onload = function () {
        console.log("HERE")
//        canvas.width = img.width;
//        canvas.height = img.height;
//        ctx.drawImage(img, 0, 0);
//        const png = canvas.toDataURL('image/png');
//        saveAs(png, 'chart.png');
      };
      img.addEventListener("error", (event) => {
        console.log(event)
      });

      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = DOMURL.createObjectURL(svgBlob);
      img.src = url;
    }
    handleClose();
  };

  return (
    <>
      {isDetailsPage && (
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
              data={chartDataHistogram}
              filename={`Summary_Data${new Date().toISOString().split('T')[0]}.csv`}
              headers={CSVHeaders[widgetType]}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <MenuItem onClick={() => downloadData('csv')}>CSV data</MenuItem>
            </CSVLink>
          </Menu>
        </Stack>
      )}
      <Box sx={{ width: '100%', marginTop: '50px' }} ref={chartWrapper}>
        <div id="input-container">
          <p>This corpus has { data?.worksetSize } documents with <b>{ data?.totalWords }</b> total words and <b>{ data?.uniqueWords }</b> unique word forms. </p>

          <div>
          <div style={{ display: 'flex' }}>
            <div style={{ width: '70%' }}>
              <h4>Document Length</h4>  
            </div>
            <div style={{ width: '30%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div className="App">
                  <LineGraph data={data?.lengthGraph} />
                </div>
            </div>
          </div>
            <div style={{ display: 'flex', width: '100%' }}>
                <p>
                  Longest: <span style={{ color: 'blue', fontSize: '14px' }}>{data?.longestDoc}; </span><br />
                  Shortest: <span style={{ color: 'blue', fontSize: '14px' }}>{data?.shortestDoc}; </span>
                </p>          
            </div>
              


            <div style={{ display: 'flex'}}>
              <div style={{ width: '70%' }}>
              <h4>Vocabulary Density</h4>
              </div>
              <div style={{ width: '30%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div className="App">
                  <LineGraph data={data?.densityGraph} />
                </div>
              </div>
            </div>
            <div style={{ display: 'flex' }}>
              
                <p>
                  Highest: <span style={{ color: 'blue', fontSize: '14px' }}>{data?.highestDensityDoc}; </span><br />
                  Lowest: <span style={{ color: 'blue', fontSize: '14px' }}>{data?.lowestDensityDoc}; </span>
                </p>
              
              
              
            </div>

            {/* <h4>Readability Index</h4>
            <p>
              Highest: {mostReadableDoc}; <br></br>
              {leastReadableDoc}; 
            </p> */}
          </div>
        </div>
      </Box>
    </>
  );
};
