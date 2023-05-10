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
  Select,
  MenuItem,
  SelectChangeEvent,
  useTheme
} from '@mui/material';
import CustomButton from 'components/Button';

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

const DataFilterWidget = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const {selectedDashboard, selectedWorkset} = useSelector((state) => state.dashboard)
  const [filter, setFilter] = useState<IFilterKey[]>([]);
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
    let params: any = {};
    filter.forEach((item) => {
      if (item.checked && !!item.value) {
        params[item.label] = item.value;
      }
    });

    axios.get('/api/dashboard/publicationDateTimeLine').then((data) => {
      const timeLineData = data.data.filter((item: any) => item.worksetId === selectedDashboard?.workset);
      const filtered = timeLineData.filter((item: any) => {
        for (let key in params) {
          if (item[key] !== params[key]) {
            return false;
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
      const timeLineData = data.data.filter((item: any) => item.worksetId === selectedDashboard?.workset);
      dispatch(getTimeLineDataSuccess(timeLineData));
    });
  };

  return (
    <Stack direction="column" sx={{minHeight: '500px', padding: '16px'}} justifyContent="space-between">
      <FormControl component="fieldset">
        <FormGroup aria-label="position">
          {filter.map((item: IFilterKey) => (
            <Box key={item.label}>
              <FormControlLabel
                value={item.label}
                control={<Checkbox checked={item.checked} color="secondary" onChange={handleChange}/>}
                label={item.label}
                labelPlacement="end"
                sx={{mr: 1}}
              />
              {item.checked && (
                <Stack spacing={1}>
                  <FormControl sx={{m: 1, minWidth: 120}} fullWidth>
                    <InputLabel id="demo-simple-select-label">{item.label}</InputLabel>
                    <Select value={item.value} name={item.label} color="secondary" variant="outlined"
                            onChange={handleKeyChange}>
                      <MenuItem value="" selected>
                        <em>Select option</em>
                      </MenuItem>
                      {item.label === 'Genre' &&
                        Genres.map((genre, index) => (
                          <MenuItem key={`genre ${index}`} value={genre.value}>
                            {genre.label}
                          </MenuItem>
                        ))}
                      {item.label === 'ResourceType' &&
                        ResourceType.map((type, index) => (
                          <MenuItem key={`ResourceType ${index}`} value={type.value}>
                            {type.label}
                          </MenuItem>
                        ))}
                      {item.label === 'Category' &&
                        Category.map((item, index) => (
                          <MenuItem key={`Category ${index}`} value={item.value}>
                            {item.label}
                          </MenuItem>
                        ))}
                      {item.label === 'Availability' &&
                        Availability.map((item, index) => (
                          <MenuItem key={`genre ${index}`} value={item.value}>
                            {item.label}
                          </MenuItem>
                        ))}
                      {item.label === 'Contributor' &&
                        Contributor.map((name, index) => (
                          <MenuItem key={`Contributor ${index}`} value={name.value}>
                            {name.label}
                          </MenuItem>
                        ))}
                      {item.label === 'Publisher' &&
                        Publisher.map((item, index) => (
                          <MenuItem key={`Publisher ${index}`} value={item.value}>
                            {item.label}
                          </MenuItem>
                        ))}
                      {item.label === 'PlaceOfPublication' &&
                        PlaceOfPublication.map((item, index) => (
                          <MenuItem key={`PlaceOfPublication ${index}`} value={item.value}>
                            {item.label}
                          </MenuItem>
                        ))}
                      {item.label === 'PublicationTitle' &&
                        PublicationTitle.map((title, index) => (
                          <MenuItem key={`PublicationTitle ${index}`} value={title.value}>
                            {title.label}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Stack>
              )}
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
