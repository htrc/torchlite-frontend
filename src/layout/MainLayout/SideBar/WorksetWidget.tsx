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
import {
  getMapDataSuccess,
  hasError,
  setLoading,
  setSelectedDashboard,
  setTooltipId
} from 'store/reducers/dashboard';
import { setSelectedWorkset } from 'store/reducers/dashboard';
import CustomTableRow from 'components/CustomTableRow';
import { confirmWorkset } from 'services';
import CustomBackdrop from 'components/Backdrop';
import axios from "axios";

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
    var chunk_size = 50;
    for (var i = 0; i < viafids.length; i += chunk_size) {
      chunked_viafids.push(viafids.slice(i, i + chunk_size));
    }
    console.log(chunked_viafids)
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
        let ran = getRandomInt(Math.floor(viafids.length / 50));
        await new Promise((r) => setTimeout(r, 100 * viafids.length * 0.2));
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
    ).then(result => {
      console.log(result)
    }).catch(error => {
      console.log(error)
    });

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
  const handleSelectWorkSet = (prop: IWorkset) => {
    setSelected(prop);
    if (selectedDashboard) {
      dispatch(setLoading(true));
      confirmWorkset(selectedDashboard?.id, prop.id)
        .then((response) => {
          console.log(response[0])
          dispatch(setSelectedDashboard(response[0]));
        })
        .catch((error) => dispatch(hasError(error)))
        .finally(() => {
          dispatch(setLoading(false));
        });
      console.log(prop.id)
      fetch(`https://tools.htrc.illinois.edu/ef-api/worksets/${prop.id}/metadata?fields=metadata.contributor.id`).then(
        (response) => {
          if (response.status !== 200) {
            console.log(`There was a problem: ${response.status}`);
            return;
          }
          response.json().then((viddata) => {
            console.log(viddata)
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
      //   //const timeLineData = data.data.filter((item: any) => item.worksetId === selectedDashboard?.workset);
      //   const mapData = data.data;
      //   dispatch(getMapDataSuccess(mapData));
      // });
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
