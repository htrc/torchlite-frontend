import { ReactElement, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography } from '@mui/material';

import Layout from 'layout';
import Page from 'components/Page';
import DashboardHeader from 'layout/MainLayout/DashboardHeader';
import { PublicationTimeLineChart } from 'components/widgets/PublicationTimeLineChart';
import { ChorloplethMap } from 'components/widgets/ChorloplethMap';
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
      fetch(`https://tools.htrc.illinois.edu/ef-api/worksets/${selectedDashboard?.workset}/metadata?fields=metadata.contributor.id`).then(
        (response) => {
          if (response.status !== 200) {
            console.log(`There was a problem: ${response.status}`);
            return;
          }
          response.json().then((viddata) => {
            let counts = getCountryCounts(viddata);
            counts
              .then((result) => {
                dispatch(getMapDataSuccess(result));
              })
              .catch((error) => {
                console.log('Error when get vip data: ' + error);
              });
          });
        }
      );
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
  // @ts-ignore
  const getCountryCounts = async (workset) => {
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
    // @ts-ignore
    let iso_codes_arr = [];
    await Promise.all(
      chunked_viafids.map(async function (viafid_chunk) {
        const endpointUrl = 'https://query.wikidata.org/sparql';
        var values = ``;
        for (var n = 0; n < viafid_chunk.length; n += 1) {
          try {
            // @ts-ignore
            values += ` <${viafid_chunk[n].replace('www.', '')}>`;
          } catch (error) {
            values += ` <${viafid_chunk[n]}>`;
          }
        }
        const sparqlQuery = `SELECT ?item ?countryiso ?cityCoords ?cityLabel ?dob
                              WHERE {
                              VALUES ?item { ${values} }
                              ?person wdtn:P214 ?item .
                              ?person p:P19 ?pob_entry .
                              ?pob_entry ps:P19 ?pob .
                              ?pob_entry a wikibase:BestRank .
                                OPTIONAL { ?pob p:P17/ps:P17/wdt:P299 ?countryiso .}
                                OPTIONAL { ?pob wdt:P625 ?cityCoords ;
                                                rdfs:label ?cityLabel . 
                                            FILTER(lang(?cityLabel) = 'en') .}
                                OPTIONAL { ?person p:P569 ?dob_entry . 
                                          ?dob_entry ps:P569 ?dob .
                                          ?dob_entry a wikibase:BestRank . }
                            }`;
        await new Promise((r) => setTimeout(r, 100 * getRandomInt(Math.floor(viafids.length / 50))));
        var iso_codes = await query(sparqlQuery, endpointUrl).then(function (res) {
          for (var row in res['results']['bindings']) {
            var iso_codes_per_tmp = {};
            // @ts-ignore
            iso_codes_per_tmp['item'] = res['results']['bindings'][row]['item']['value'];
            // @ts-ignore
            iso_codes_per_tmp['countryiso'] = res['results']['bindings'][row]['countryiso']['value'];
            // @ts-ignore
            iso_codes_per_tmp['dob'] = res['results']['bindings'][row]['dob']['value'];
            iso_codes_per_tmp['city'] = res['results']['bindings'][row]['cityLabel']['value'];
            iso_codes_per_tmp['cityCoords'] = res['results']['bindings'][row]['cityCoords']['value'];
            iso_codes_arr.push(iso_codes_per_tmp);
          }
        });
        return iso_codes;
      })
    );

    // @ts-ignore
    return iso_codes_arr;
  };

  // @ts-ignore
  const query = (sparqlQuery, endpoint) => {
    const fullUrl = endpoint + '?query=' + encodeURIComponent(sparqlQuery);
    const headers = { Accept: 'application/sparql-results+json' };

    return fetch(fullUrl, { headers }).then((body) => body.json());
  };
  // @ts-ignore
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
              gridTemplateColumns: '1fr 1fr',
              gridTemplateRows: '1fr 1fr',
              gap: 2,
              gridTemplateAreas: `
                "map timeline"
                "pie ."
              `
            }}
          >
            <Box
              sx={{
                gridArea: 'map'
              }}
            >
              <ChorloplethMap />
            </Box>
            <Box
              sx={{
                gridArea: 'timeline'
              }}
            >
              <PublicationTimeLineChart />
            </Box>
            <Box sx={{ gridArea: 'pie' }}></Box>
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
