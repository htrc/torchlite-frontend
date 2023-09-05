import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import qs from 'qs';
import { Box, FormControl, FormGroup, Stack, useTheme, Typography } from '@mui/material';
import CustomButton from 'components/Button';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

//mock data
import { filterKeys } from 'data/datafilters';
import genreData from 'data/genreData';
import { IFilterKey } from 'types/dashboard';
import { useDispatch, useSelector } from 'store';
import { getMapDataSuccess, getTimeLineDataSuccess, setLoading, setAppliedFilters } from 'store/reducers/dashboard';
import { colourStyles } from 'styles/react-select';
import { getCountryCounts } from 'services';
import { convertToTimelineChartData } from 'utils/helpers';

const animatedComponents = makeAnimated();
const convertFromUrl = (originalData: any) => {
  const transformedData: any = {};
  for (const key in originalData) {
    if (originalData.hasOwnProperty(key)) {
      const valueArray = Array.isArray(originalData[key]) ? originalData[key] : [originalData[key]];
      transformedData[key] = valueArray.map((item: any) => ({
        value: item,
        label: item,
        key
      }));
    }
  }
  return transformedData;
};

const DataFilterWidget = () => {
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useDispatch();
  const { worksetMetadata, appliedFilters } = useSelector((state) => state.dashboard);
  const [filterGroup, setFilterGroup] = useState<any>({});
  const [selectedGroup, setSelectedGroup] = useState<any>(convertFromUrl(appliedFilters));

  useEffect(() => {
    setSelectedGroup(convertFromUrl(appliedFilters));
    applyFilter(convertFromUrl(appliedFilters));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appliedFilters]);

  const updateFiltersRoute = (newFilters: Record<string, any>) => {
    const queryString = qs.stringify(newFilters, { arrayFormat: 'comma', encode: false });
    // Pushing the new filters to the URL
    router.push({
      pathname: router.pathname,
      query: { ...router.query, filters: queryString }
    });
  };

  const applyFilter = (filters: any) => {
    dispatch(setLoading(true));
    const filtered = worksetMetadata.filter((item: any) => {
      for (let key in filters) {
        if (filters[key].length) {
          if (
            !filters[key].some((i: any) => {
              if (Array.isArray(item.metadata[i.key])) {
                return item.metadata[i.key].includes(i.value);
              } else if (typeof item.metadata[i.key] === 'object' && item.metadata[i.key] !== null) {
                return i.value == item.metadata[i.key].name;
              } else {
                return i.value == item.metadata[i.key];
              }
            })
          ) {
            return false;
          }
        }
      }
      return true;
    });

    getCountryCounts(filtered).then((res) => {
      dispatch(getMapDataSuccess(res));
    });
    dispatch(getTimeLineDataSuccess(convertToTimelineChartData(filtered)));
    dispatch(setLoading(false));
  };

  const handleApplyFilter = (filters: any) => {
    applyFilter(filters);
    const transformed = Object.keys(filters).reduce((acc: any, key: any) => {
      acc[key] = filters[key].map((item: any) => item.value);
      return acc;
    }, {});

    updateFiltersRoute(transformed);
    dispatch(setAppliedFilters(transformed));
  };

  const getNameMatchingShortname = (name: any) => {
    for (const key in genreData) {
      if (genreData.hasOwnProperty(key)) {
        const genre = genreData[key];
        if (genre.name === name) {
          return genre.shortname;
        }
      }
    }
    return null; // If no matching object is found
  };

  const getFilterByData = (timeLineData: any) => {
    const pubTitles = [...new Set(timeLineData.map((obj: any) => obj.metadata.title))]
      .filter((title) => title !== undefined)
      .sort()
      .map((title) => ({ value: title, label: title, key: 'title' }));
    const pubDates = [...new Set(timeLineData.map((obj: any) => obj.metadata.pubDate))]
      .filter((pubDate) => pubDate !== undefined)
      .sort()
      .map((pubDate) => ({ value: pubDate?.toString(), label: pubDate?.toString(), key: 'pubDate' }));
    //const genres = [...new Set(timeLineData.map(obj => obj.metadata.genre))].filter(genre => genre !== undefined).map(genre => ({ value: genre, label: genre, key: 'genre' }));
    const genres = [...new Set(timeLineData.flatMap((obj: any) => obj.metadata.genre))]
      .filter((genre) => genre !== undefined)
      .sort()
      .map((genre) => ({ value: genre, label: genre, key: 'genre' }));
    const resTypes = [...new Set(timeLineData.flatMap((obj: any) => obj.metadata.type))]
      .filter((type) => type !== undefined)
      .sort()
      .map((type) => ({ value: type, label: type, key: 'type' }));
    const categories = [...new Set(timeLineData.map((obj: any) => obj.metadata.category))]
      .filter((category) => category !== undefined)
      .sort()
      .map((category) => ({ value: category, label: category, key: 'category' }));
    const contributors = [...new Set(timeLineData.map((obj: any) => obj.metadata.contributor?.name))]
      .filter((contributor) => contributor !== undefined)
      .sort()
      .map((name) => ({ value: name, label: name, key: 'contributor' }));
    const publishers = [...new Set(timeLineData.map((obj: any) => obj.metadata.publisher?.name))]
      .filter((publisher) => publisher !== undefined)
      .sort()
      .map((name) => ({ value: name, label: name, key: 'publisher' }));
    const accessRights = [...new Set(timeLineData.map((obj: any) => obj.metadata.accessRights))]
      .filter((accessRights) => accessRights !== undefined)
      .sort()
      .map((accessRights) => ({ value: accessRights, label: accessRights, key: 'accessRights' }));
    const pubPlaces = [...new Set(timeLineData.map((obj: any) => obj.metadata.pubPlace?.name))]
      .filter((pubPlace) => pubPlace !== undefined)
      .sort()
      .map((name) => ({ value: name, label: name, key: 'pubPlace' }));
    const languages = [...new Set(timeLineData.map((obj: any) => obj.metadata.language))]
      .filter((language) => language !== undefined)
      .sort()
      .map((language) => ({ value: language, label: language, key: 'language' }));
    const sourceInstitutions = [...new Set(timeLineData.map((obj: any) => obj.metadata.sourceInstitution?.name))]
      .filter((sourceInstitution) => sourceInstitution !== undefined)
      .sort()
      .map((name) => ({ value: name, label: name, key: 'sourceInstitution' }));
    if (genres.length) {
      for (let i = 0; i < genres.length; i++) {
        let value = genres[i].value;
        let label = getNameMatchingShortname(value);
        if (label == null) {
          label = genres[i].label;
        }
        genres[i].label = label;
      }
    }
    const filterGroupData = {
      title: pubTitles,
      pubDate: pubDates,
      genre: genres,
      type: resTypes,
      category: categories,
      contributor: contributors,
      publisher: publishers,
      accessRights: accessRights,
      pubPlace: pubPlaces,
      language: languages,
      sourceInstitution: sourceInstitutions
    };
    setFilterGroup(filterGroupData);
  };

  const handleSelectChange = (selected: any, value: any) => {
    setSelectedGroup((prevState: any) => {
      return {
        ...prevState,
        [value]: selected
      };
    });
  };

  const handleBlur = () => {
    const filtered = worksetMetadata.filter((item: any) => {
      for (let key in selectedGroup) {
        //if(key != value) {
        if (selectedGroup[key].length) {
          if (
            !selectedGroup[key].some((i: any) => {
              if (Array.isArray(item.metadata[i.key])) {
                return item.metadata[i.key].includes(i.value);
              } else if (typeof item.metadata[i.key] === 'object' && item.metadata[i.key] !== null) {
                return i.value == item.metadata[i.key].name;
              } else {
                return i.value == item.metadata[i.key];
              }
            })
          ) {
            return false;
          }
        }

        //}
      }
      return true;
    });
    getFilterByData(filtered);
  };

  const handleFocus = (value: any) => {
    const filtered = worksetMetadata.filter((item: any) => {
      for (let key in selectedGroup) {
        if (key != value) {
          if (selectedGroup[key].length) {
            if (
              !selectedGroup[key].some((i: any) => {
                if (Array.isArray(item.metadata[i.key])) {
                  return item.metadata[i.key].includes(i.value);
                } else if (typeof item.metadata[i.key] === 'object' && item.metadata[i.key] !== null) {
                  return i.value == item.metadata[i.key].name;
                } else {
                  return i.value == item.metadata[i.key];
                }
              })
            ) {
              return false;
            }
          }
        }
      }
      return true;
    });
    getFilterByData(filtered);
  };

  return (
    <Stack direction="column" sx={{ minHeight: '500px', padding: '16px' }} justifyContent="space-between">
      <FormControl component="fieldset">
        <FormGroup aria-label="position">
          {filterKeys.map((item: IFilterKey) => (
            <Box key={item.label} sx={{ marginBottom: '10px', maxWidth: '293px !important' }}>
              <Typography variant="h6">{item.label}</Typography>
              <Select
                onBlur={handleBlur}
                onFocus={() => handleFocus(item.value)}
                closeMenuOnSelect={false}
                components={animatedComponents}
                key={item.value}
                defaultValue={selectedGroup[item.value] || []}
                onChange={(selected) => handleSelectChange(selected, item.value)}
                isMulti
                options={filterGroup[item.value]}
                className="basic-multi-select"
                classNamePrefix="select"
                value={selectedGroup[item.value] || []}
                {...(theme.palette.mode === 'dark' ? { styles: colourStyles } : {})}
              />
            </Box>
          ))}
        </FormGroup>
      </FormControl>
      <Stack direction="row" justifyContent="space-between">
        <Box mb={4} sx={{ '& .MuiButtonBase-root::after': { boxShadow: 'none' } }}>
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
            onClick={() => handleApplyFilter(selectedGroup)}
          >
            Apply filters
          </CustomButton>
        </Box>
        <Box mb={4} sx={{ '& .MuiButtonBase-root::after': { boxShadow: 'none' } }}>
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
            onClick={() => handleApplyFilter({})}
          >
            Clear filters
          </CustomButton>
        </Box>
      </Stack>
    </Stack>
  );
};

export default DataFilterWidget;
