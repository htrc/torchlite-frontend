import React, { useEffect, useState, useCallback } from 'react';
import WordCloud from 'react-d3-cloud';
import styles from './wordCloud.module.css';


export interface WordData {
  text: string;
  value: number;
}

interface IWordCloudChartProps {
  data: WordData[];
}

export function WordCloudChart(props: IWordCloudChartProps) {
//  console.log("WordCloudChart mounting");
//  console.log("Received data in WordCloudChart:", props.data);
  const [data, setData] = useState(undefined as unknown as WordData[]);
  //console.log("cloudtop10",data);
  const [max, setMax] = useState(600);
  useEffect(() => {
    const values = props.data.map((r) => {
      return r.value;
    });
//    console.log('props.data', props.data);
    setMax(Math.max(...values));
    setData(props.data);
  }, [props.data]);

  // @ts-ignore
  const fontSize = useCallback((word) => {
    return (600 * word.value) / max;
  }, [max])
  // @ts-ignore
  const rotate = useCallback((word) => {
    return word.value % 360;// word.value % 90;
  }, [])
  
  if (data === undefined) {
    return <div>Word Cloud..</div>;
  }
//1000 1800
  return (
    <div className={styles.wordCloudSvg}>
      {typeof window !== 'undefined' && (
        <WordCloud  
          width={1800}
          height={3000}
          data={data}
          fontSize={fontSize}
          rotate={rotate}
          padding={6} 
    //      spiral="rectangular"
          random={Math.random}      
        />
      )}
    </div>
  );
}