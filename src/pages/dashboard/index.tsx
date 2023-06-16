import { ReactElement, useEffect, useState } from 'react';
import axios from 'axios';
import * as d3 from 'd3';
import { Box, Typography } from '@mui/material';

import Layout from 'layout';
import Page from 'components/Page';
import DashboardHeader from 'layout/MainLayout/DashboardHeader';
import { PublicationTimeLineChart } from 'components/widgets/PublicationTimeLineChart';
import { ChorloplethMap } from 'components/widgets/ChorloplethMap';
import MappingContributorData from 'components/widgets/MappingContributorData';
import { useDispatch, useSelector } from 'store';
import {
  setSelectedWorkset,
  setSelectedDashboard,
  setDashboards,
  setWorksets,
  setLoading,
  getTimeLineDataSuccess,
  getMapDataSuccess
} from 'store/reducers/dashboard';
import { getDashboards, getTimeLineData, getWorksets } from 'services';
import CustomBackdrop from 'components/Backdrop';

const DashboardDefault = () => {
  const dispatch = useDispatch();
  const { selectedDashboard, loading } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(setLoading(true));
    if (selectedDashboard) {
      getTimeLineData(selectedDashboard).then((data) => {
        // dispatch(getTimeLineDataSuccess(data));
        // dispatch(setLoading(false));
      });

      // mock implementation
      axios.get('/api/dashboard/publicationDateTimeLine').then((data) => {
        //const timeLineData = data.data.filter((item: any) => item.worksetId === selectedDashboard.workset);
        dispatch(getTimeLineDataSuccess(data.data));
        dispatch(setLoading(false));
      });
      console.log(selectedDashboard?.workset)
      fetch(`https://tools.htrc.illinois.edu/ef-api/worksets/${selectedDashboard?.workset}/metadata?fields=metadata.contributor.id`).then(
        (response) => {
          if (response.status !== 200) {
            console.log(`There was a problem: ${response.status}`);
            return;
          }
          response.json().then((viddata) => {
            let counts = getCountryCounts(viddata);
            counts
              .then(result => {
                console.log(result)
                dispatch(getMapDataSuccess(result));
              })
              .catch(error => {
                console.log("Error when get vip data: " + error)
              })
          });
        }
      );
      // axios.get('/api/dashboard/mapData').then((data) => {
      //   dispatch(getMapDataSuccess(data.data));
      //   dispatch(setLoading(false));
      // });
    }
  }, [selectedDashboard]);

  useEffect(() => {
    Promise.all([getDashboards(), getWorksets()])
      .then((values) => {
        const dashboards: any[] = values[0];
        const worksets: any[] = values[1];

        dispatch(setDashboards(dashboards));
        dispatch(setWorksets(worksets));

        const defaultDashboard = dashboards[0];
        dispatch(setSelectedDashboard(defaultDashboard));

        const selectedWorkset = worksets.filter((item) => item.id === defaultDashboard?.workset)?.[0] ?? null;
        dispatch(setSelectedWorkset(selectedWorkset));
      })
      .catch((err) => {
        console.log(err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getCountryCounts = async (workset) => {
    var counts = {};
    var viafid_set = new Set();
    for (var vol in workset['data']) {
      if ('contributor' in workset['data'][vol]['metadata']) {
        if (Array.isArray(workset['data'][vol]['metadata']['contributor'])) {
          for (var contributor in workset['data'][vol]['metadata']['contributor']) {
            viafid_set.add(workset['data'][vol]['metadata']['contributor'][contributor]['id']);
          }
        } else {
          viafid_set.add(workset['data'][vol]['metadata']['contributor']['id']);
        }
      }
    }
    var viafids = Array.from(viafid_set);
    var chunked_viafids = [];
    var chunk_size = 25;
    for (var i = 0; i < viafids.length; i += chunk_size) {
      chunked_viafids.push(viafids.slice(i, i + chunk_size));
    }
    let iso_codes_arr = [];
    var iso_count_package = await Promise.all(
      chunked_viafids.map(async function (viafid_chunk) {
        const endpointUrl = 'https://query.wikidata.org/sparql';
        var values = ``;
        for (var n = 0; n < viafid_chunk.length; n += 1) {
          try {
            values += ` <${viafid_chunk[n].replace('www.', '')}>`;
          } catch (error) {
            values += ` <${viafid_chunk[n]}>`;
          }
        }
        const sparqlQuery = `SELECT ?item ?countryiso ?viaf ?dob
WHERE {
VALUES ?item { ${values} }
?person wdtn:P214 ?item .
?person p:P19 ?pob_entry .
?pob_entry ps:P19 ?pob .
?pob_entry a wikibase:BestRank
  OPTIONAL { ?pob p:P17/ps:P17/wdt:P299 ?countryiso .}
  OPTIONAL { ?pob p:P625/ps:P625 ?coordinates .}
  OPTIONAL { ?person p:P569 ?dob_entry .
             ?dob_entry ps:P569 ?dob .
             ?dob_entry a wikibase:BestRank . }
}`;
        await new Promise((r) => setTimeout(r, 100 * getRandomInt(Math.floor(viafids.length / 50))));
        var iso_codes = await query(sparqlQuery, endpointUrl).then(function (res) {
          for (var row in res['results']['bindings']) {
            var iso_codes_per_tmp = {};
            iso_codes_per_tmp['item'] = res['results']['bindings'][row]['item']['value'];
            iso_codes_per_tmp['countryiso'] = res['results']['bindings'][row]['countryiso']['value'];
            iso_codes_per_tmp['dob'] = res['results']['bindings'][row]['dob']['value'];
            iso_codes_arr.push(iso_codes_per_tmp)
          }
          // var iso_codes_per_viaf = {};
          // for (var row in res['results']['bindings']) {
          //   var viaf = res['results']['bindings'][row]['item']['value'];
          //   var iso_code = res['results']['bindings'][row]['countryiso']['value'];
          //   if (viaf in iso_codes_per_viaf) {
          //     iso_codes_per_viaf[viaf].add(iso_code);
          //   }
          //   else {
          //     iso_codes_per_viaf[viaf] = new Set([iso_code]);
          //   }
          // }
          // return Object.values(iso_codes_per_viaf);
        });
        return iso_codes;
      })
    );

    // for (var chunk in iso_count_package) {
    //   for (var instance in iso_count_package[chunk]) {
    //     iso_count_package[chunk][instance].forEach(function (iso) {
    //       if (iso in counts) {
    //         counts[iso] += 1;
    //       } else {
    //         counts[iso] = 1;
    //       }
    //     });
    //   }
    // }
    return iso_codes_arr;
  };

  const query = (sparqlQuery, endpoint) => {
    const fullUrl = endpoint + '?query=' + encodeURIComponent(sparqlQuery);
    const headers = { Accept: 'application/sparql-results+json' };

    return fetch(fullUrl, { headers }).then((body) => body.json());
  };
  const getRandomInt = (max) => {
    return Math.floor(Math.random() * max);
  };
  return (
    <Page title="Dashboard">
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(1, 1fr)',
          gap: 2,
          gridTemplateAreas: `"title"
  " content"`
        }}
      >
        <Box sx={{ gridArea: 'title' }}>
          <Typography variant="h5">Dashboard</Typography>
        </Box>
        <Box sx={{ gridArea: 'content' }}>
          <DashboardHeader />
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 2,
              gridTemplateAreas: `"equalEarth timeLineChart"
  "pieChart ."`
            }}
          >
            <Box
              sx={{
                gridArea: 'equalEarth'
              }}
            >
              <ChorloplethMap />
            </Box>
            <Box
              sx={{
                gridArea: 'timeLineChart'
              }}
            >
              <PublicationTimeLineChart />
            </Box>
            <Box sx={{ gridArea: 'pieChart' }}></Box>
          </Box>
        </Box>
      </Box>
      <CustomBackdrop loading={loading} />
    </Page>
  );
};

DashboardDefault.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default DashboardDefault;
