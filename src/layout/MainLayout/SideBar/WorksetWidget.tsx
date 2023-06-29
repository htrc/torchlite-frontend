import { useState, useEffect } from 'react';
import {
  FormControl,
  Stack,
  Select,
  MenuItem,
  SelectChangeEvent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useTheme,
  Box
} from '@mui/material';
import { IWorkset } from 'types/dashboard';
import { useDispatch, useSelector } from 'store';
import { getMapDataSuccess, hasError, setLoading, setSelectedDashboard, setTooltipId, setLoadingMap } from 'store/reducers/dashboard';
import { setSelectedWorkset } from 'store/reducers/dashboard';
import CustomTableRow from 'components/CustomTableRow';
import { confirmWorkset } from 'services';
import CustomBackdrop from 'components/Backdrop';

const WorksetWidget = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const { worksets, selectedWorkset, selectedDashboard, loading } = useSelector((state) => state.dashboard);
  const [type, setType] = useState<string>('all');
  const [selected, setSelected] = useState<IWorkset | null>(null);
  const [worksetData, setWorksetData] = useState<IWorkset[]>(worksets);

  const handleChange = (event: SelectChangeEvent<string>) => {
    const { value } = event.target;
    setType(value);
  };
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
    var chunk_size = 50;
    for (var i = 0; i < viafids.length; i += chunk_size) {
      chunked_viafids.push(viafids.slice(i, i + chunk_size));
    }
    let iso_codes_arr: any[] = [];
    await Promise.all(
      chunked_viafids.map(async function (viafid_chunk: any) {
        const endpointUrl = 'https://query.wikidata.org/sparql';
        var values = ``;
        for (var n = 0; n < viafid_chunk.length; n += 1) {
          try {
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
        //let ran = getRandomInt(Math.floor(viafids.length / 50));
        await new Promise((r) => setTimeout(r, 10 * viafids.length * 0.2));
        var iso_codes = await query(sparqlQuery, endpointUrl).then(function (res) {
          for (var row in res['results']['bindings']) {
            var iso_codes_per_tmp: any = {};
            iso_codes_per_tmp['item'] = res['results']['bindings'][row]['item']['value'];
            iso_codes_per_tmp['countryiso'] = res['results']['bindings'][row]['countryiso']['value'];
            iso_codes_per_tmp['dob'] = res['results']['bindings'][row]['dob']['value'];
            iso_codes_per_tmp['city'] = res['results']['bindings'][row]['cityLabel']['value'];
            iso_codes_per_tmp['cityCoords'] = res['results']['bindings'][row]['cityCoords']['value'];
            iso_codes_arr.push(iso_codes_per_tmp);
          }
        });
        console.log(iso_codes);
        return iso_codes;
      })
    )
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.log(error);
      });
    // @ts-ignore
    return iso_codes_arr;
  };
  // @ts-ignore
  const query = (sparqlQuery, endpoint) => {
    const fullUrl = endpoint + '?query=' + encodeURIComponent(sparqlQuery);
    const headers = { Accept: 'application/sparql-results+json' };

    return fetch(fullUrl, { headers }).then((body) => body.json());
  };
  // const getRandomInt = (max) => {
  //   return Math.floor(Math.random() * max);
  // };
  const handleSelectWorkSet = (prop: IWorkset) => {
    setSelected(prop);
    if (selectedDashboard) {
      dispatch(setLoading(true));
      confirmWorkset(selectedDashboard?.id, prop.id)
        .then((response) => {
          dispatch(setSelectedDashboard(response[0]));
        })
        .catch((error) => dispatch(hasError(error)))
        .finally(() => {
          dispatch(setLoading(false));
        });
      dispatch(setLoadingMap(true));
      fetch(`https://tools.htrc.illinois.edu/ef-api/worksets/${prop.id}/metadata?fields=metadata.contributor.id`).then((response) => {
        if (response.status !== 200) {
          console.log(`There was a problem: ${response.status}`);
          return;
        }
        response.json().then((viddata) => {
          let counts = getCountryCounts(viddata);
          counts
            .then((result) => {
              dispatch(getMapDataSuccess(result));
              dispatch(setLoadingMap(false));
            })
            .catch((error) => {
              console.log('Error when get vip data: ' + error);
            });
        });
      });
      dispatch(setSelectedWorkset(prop));
    }
  };

  useEffect(() => {
    if (type === 'all' || type === 'A') {
      setWorksetData(worksets);
    } else {
      setWorksetData([]);
    }
  }, [type, worksets]);

  useEffect(() => {
    if (selectedWorkset) {
      setSelected(selectedWorkset);
    }

    setWorksetData(worksets);
    dispatch(setTooltipId(''));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [worksets, dispatch]);

  return (
    <>
      <Stack sx={{ margin: theme.spacing(1) }} spacing={2}>
        <FormControl sx={{ minWidth: 120 }}>
          <Select value={type} color="secondary" onChange={handleChange}>
            <MenuItem value={'all'}>All Worksets</MenuItem>
            <MenuItem value={'A'}>Recommended Worksets</MenuItem>
            <MenuItem value={'B'}>My Worksets</MenuItem>
          </Select>
        </FormControl>
        <TableContainer component={Paper} sx={{ maxWidth: '100%' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="right"># of Volumes</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {worksetData.map((item, index) => (
                <CustomTableRow
                  key={`${item.name}_${index}`}
                  item={item}
                  selected={item.id === selected?.id}
                  handleSelectWorkSet={handleSelectWorkSet}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ '& .MuiButtonBase-root::after': { boxShadow: 'none' } }}>
          <Typography variant="h5" color="primary" sx={{ padding: theme.spacing(1.5) }}>
            Selected Workset Name:
            <Typography>{selectedWorkset?.name}</Typography>
          </Typography>
        </Box>
      </Stack>
      <CustomBackdrop loading={loading} />
    </>
  );
};

export default WorksetWidget;
