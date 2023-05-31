import {useEffect, useState} from 'react';
import axios from 'axios';
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Stack,
  InputLabel,
  MenuItem,
  SelectChangeEvent,
  useTheme, Typography
} from '@mui/material';
import CustomButton from 'components/Button';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import makeAnimated from 'react-select/animated';

//mock data
import {
  Genres,
  Availability,
  Category,
  Contributor,
  PlaceOfPublication,
  PublicationTitle,
  Publisher,
  ResourceType,
  FilterKeys
} from 'data/datafilters';
import {IFilterKey} from 'types/dashboard';
import {useDispatch, useSelector} from 'store';
import {getTimeLineDataSuccess, setLoading} from 'store/reducers/dashboard';
const animatedComponents = makeAnimated();
const DataFilterWidget = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const {selectedDashboard, selectedWorkset} = useSelector((state) => state.dashboard)
  const [filter, setFilter] = useState<IFilterKey[]>([]);
  const [filterGroup, setFilterGroup] = useState({});
  const [selectedGroup, setSelectedGroup] = useState({});

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    setFilter((prev) => prev.map((type) => (type.label === event.target.value ? {...type, checked} : type)));
  };

  useEffect(() => {
    handleClearFilter()
  }, [selectedWorkset]);
  useEffect(() => {
    (() => axios.get('/api/dashboard/filterKeys').then((data) => setFilter(data.data)))();
  }, []);
  const handleKeyChange = (event: SelectChangeEvent<string>) => {
    setFilter((prev) => prev.map((type) => (type.label === event.target.name ? {
      ...type,
      value: event.target.value
    } : type)));
  };


  const handleApplyFilter = () => {
    dispatch(setLoading(true));
    axios.get('/api/dashboard/publicationDateTimeLine').then((data) => {
      //const timeLineData = data.data.filter((item: any) => item.worksetId === selectedDashboard?.workset);
      const timeLineData = data.data;
      const filtered = timeLineData.filter((item: any) => {
        for (let key in selectedGroup) {
          if(selectedGroup[key].length){
            if (!selectedGroup[key].some((i) => {
              if(Array.isArray(item.metadata[i.key])){
                return item.metadata[i.key].includes(i.value)
              }
              else if(typeof item.metadata[i.key] === "object" && item.metadata[i.key] !== null){
                return i.value == item.metadata[i.key].name
              }
              else {
                return i.value == item.metadata[i.key]
              }
            })) {
              return false;
            }
          }
        }
        return true;
      });
      dispatch(getTimeLineDataSuccess(filtered));
      dispatch(setLoading(false));
    });
  };

  const handleClearFilter = () => {
    setFilter(FilterKeys);
    axios.get('/api/dashboard/publicationDateTimeLine').then((data) => {
      //const timeLineData = data.data.filter((item: any) => item.worksetId === selectedDashboard?.workset);
      const timeLineData = data.data;
      getFilterByData(timeLineData);
      dispatch(getTimeLineDataSuccess(data.data));
      setSelectedGroup({})
    });
  };

  const getFilterByData = (timeLineData) => {
    const pubTitles = [...new Set(timeLineData.map(obj => obj.metadata.title))].filter(title => title !== undefined).map(title => ({ value: title, label: title, key: 'title' }));
    const pubDates = [...new Set(timeLineData.map(obj => obj.metadata.pubDate))].filter(pubDate => pubDate !== undefined).map(pubDate => ({ value: pubDate, label: pubDate, key: 'pubDate' }));
    const genres = [...new Set(timeLineData.map(obj => obj.metadata.genre))].filter(genre => genre !== undefined).map(genre => ({ value: genre, label: genre, key: 'genre' }));
    const resTypes = [...new Set(timeLineData.flatMap(obj => obj.metadata.type))]
      .filter(type => type !== undefined)
      .map(type => ({ value: type, label: type, key: 'type' }));
    const categories = [...new Set(timeLineData.map(obj => obj.metadata.category))].filter(category => category !== undefined).map(category => ({ value: category, label: category, key: 'category' }));
    const contributors = [...new Set(timeLineData.map(obj => obj.metadata.contributor?.name))].filter(contributor => contributor !== undefined).map(name => ({ value: name, label: name, key: 'contributor' }));
    const publishers = [...new Set(timeLineData.map(obj => obj.metadata.publisher?.name))].filter(publisher => publisher !== undefined).map(name => ({ value: name, label: name, key: 'publisher' }));
    const accessRights = [...new Set(timeLineData.map(obj => obj.metadata.accessRights))].filter(accessRights => accessRights !== undefined).map(accessRights => ({ value: accessRights, label: accessRights, key: 'accessRights' }));;
    const pubPlaces = [...new Set(timeLineData.map(obj => obj.metadata.pubPlace?.name))].filter(pubPlace => pubPlace !== undefined).map(name => ({ value: name, label: name, key: 'pubPlace' }));
    const languages = [...new Set(timeLineData.map(obj => obj.metadata.language))].filter(language => language !== undefined).map(language => ({ value: language, label: language, key: 'language' }));
    const sourceInstitutions = [...new Set(timeLineData.map(obj => obj.metadata.sourceInstitution?.name))].filter(sourceInstitution => sourceInstitution !== undefined).map(name => ({ value: name, label: name, key: 'sourceInstitution' }));
    const filterGroupData = {
      'pubTitles': pubTitles,
      'pubDates': pubDates,
      'genres': genres,
      'resTypes': resTypes,
      'categories' : categories,
      'contributors' : contributors,
      'publishers' : publishers,
      'accessRights': accessRights,
      'pubPlaces': pubPlaces,
      'languages': languages,
      'sourceInstitutions' : sourceInstitutions
    };
    setFilterGroup(filterGroupData);
  }

  const handleSelectChange = (selected, value) => {
    console.log("handleSelectChange")
    let filter = false;
    setSelectedGroup((prevState) => {
      const keys = Object.keys(prevState);
      const lastKey = keys.pop();
      if(lastKey != undefined && lastKey != value) filter = true;
      let selectedG = {
        ...prevState,
        [value]: selected
      };
      console.log(selectedG);
      // if(filter){
      //   axios.get('/api/dashboard/publicationDateTimeLine').then((data) => {
      //     //const timeLineData = data.data.filter((item: any) => item.worksetId === selectedDashboard?.workset);
      //     const timeLineData = data.data;
      //     const filtered = timeLineData.filter((item: any) => {
      //       for (let key in selectedG) {
      //         //if(key != value) {
      //         if(selectedG[key].length){
      //           if (!selectedG[key].some((i) => {
      //             if(Array.isArray(item.metadata[i.key])){
      //               return item.metadata[i.key].includes(i.value)
      //             }
      //             else if(typeof item.metadata[i.key] === "object" && item.metadata[i.key] !== null){
      //               return i.value == item.metadata[i.key].name
      //             }
      //             else {
      //               return i.value == item.metadata[i.key]
      //             }
      //           })) {
      //             return false;
      //           }
      //         }
      //
      //         //}
      //       }
      //       return true;
      //     });
      //     getFilterByData(filtered);
      //   });
      // }

      // else{
      //   axios.get('/api/dashboard/publicationDateTimeLine').then((data) => {
      //     //const timeLineData = data.data.filter((item: any) => item.worksetId === selectedDashboard?.workset);
      //     const timeLineData = data.data;
      //     const filtered = timeLineData.filter((item: any) => {
      //       for (let key in selectedG) {
      //         //if(key != value) {
      //         if (!selectedG[key].some((i) => {
      //           if(Array.isArray(item.metadata[i.key])){
      //             return item.metadata[i.key].includes(i.value)
      //           }
      //           else if(typeof item.metadata[i.key] === "object" && item.metadata[i.key] !== null){
      //             return i.value == item.metadata[i.key].name
      //           }
      //           else {
      //             return i.value == item.metadata[i.key]
      //           }
      //         })) {
      //           return false;
      //         }
      //         //}
      //       }
      //       return true;
      //     });
      //     getFilterByData(filtered);
      //   });
      // }
      return selectedG});


  };

  const handleBlur = () => {
    console.log("handleBlur")
    axios.get('/api/dashboard/publicationDateTimeLine').then((data) => {
      //const timeLineData = data.data.filter((item: any) => item.worksetId === selectedDashboard?.workset);
      const timeLineData = data.data;
      const filtered = timeLineData.filter((item: any) => {
        for (let key in selectedGroup) {
          //if(key != value) {
          if(selectedGroup[key].length){
            if (!selectedGroup[key].some((i) => {
              if(Array.isArray(item.metadata[i.key])){
                return item.metadata[i.key].includes(i.value)
              }
              else if(typeof item.metadata[i.key] === "object" && item.metadata[i.key] !== null){
                return i.value == item.metadata[i.key].name
              }
              else {
                return i.value == item.metadata[i.key]
              }
            })) {
              return false;
            }
          }

          //}
        }
        return true;
      });
      getFilterByData(filtered);
    });
  };

  const handleFocus = (value) => {
    console.log('handleFocus: ' + value);
    axios.get('/api/dashboard/publicationDateTimeLine').then((data) => {
      //const timeLineData = data.data.filter((item: any) => item.worksetId === selectedDashboard?.workset);
      const timeLineData = data.data;
      const filtered = timeLineData.filter((item: any) => {
        for (let key in selectedGroup) {
          if(key != value) {
          if(selectedGroup[key].length){
            if (!selectedGroup[key].some((i) => {
              if(Array.isArray(item.metadata[i.key])){
                return item.metadata[i.key].includes(i.value)
              }
              else if(typeof item.metadata[i.key] === "object" && item.metadata[i.key] !== null){
                return i.value == item.metadata[i.key].name
              }
              else {
                return i.value == item.metadata[i.key]
              }
            })) {
              return false;
            }
          }

          }
        }
        return true;
      });
      getFilterByData(filtered);
    });
    // Additional actions to perform when the component is focused
  };

  return (
    <Stack direction="column" sx={{minHeight: '500px', padding: '16px'}} justifyContent="space-between">
      <FormControl component="fieldset">
        <FormGroup aria-label="position">
          {filter.map((item: IFilterKey) => (
            <Box key={item.label} sx={{marginBottom: '10px', maxWidth: '293px !important'}}>
              <Typography variant="h6">
                {item.label}
              </Typography>
              <Select
                onBlur={handleBlur}
                onFocus={() => handleFocus(item.value)}
                closeMenuOnSelect={false}
                components={animatedComponents}
                key={item.value}
                onChange={(selected) => handleSelectChange(selected, item.value)}
                isMulti
                options={filterGroup[item.value]}
                className="basic-multi-select"
                classNamePrefix="select"
                value={selectedGroup[item.value] || []}
              />
            </Box>
          ))}
        </FormGroup>
      </FormControl>
      <Stack direction="row" justifyContent="space-between">
        <Box mb={4} sx={{'& .MuiButtonBase-root::after': {boxShadow: 'none'}}}>
          <CustomButton
            variant="contained"
            sx={{
              width: theme.spacing(17.5),
              height: theme.spacing(5),
              padding: theme.spacing(0.25),
              borderRadius: '15px',
              backgroundColor: '#1e98d7',
              fontFamily: "'ArialMT', 'Arial', 'sans-serif'",
              fontSize: theme.spacing(1.625),
              color: theme.palette.common.white,
              textAlign: 'center',
              textTransform: 'none'
            }}
            onClick={handleApplyFilter}
          >
            Apply filters
          </CustomButton>
        </Box>
        <Box mb={4} sx={{'& .MuiButtonBase-root::after': {boxShadow: 'none'}}}>
          <CustomButton
            variant="outlined"
            sx={{
              width: theme.spacing(17.5),
              height: theme.spacing(5),
              padding: theme.spacing(0.25),
              borderRadius: '15px',
              fontFamily: "'ArialMT', 'Arial', 'sans-serif'",
              fontSize: theme.spacing(1.625),
              textAlign: 'center',
              textTransform: 'none'
            }}
            onClick={handleClearFilter}
          >
            Clear filters
          </CustomButton>
        </Box>
      </Stack>
    </Stack>
  );
};

export default DataFilterWidget;
