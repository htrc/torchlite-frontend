import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import qs from 'qs';
import { Box, FormControl, FormGroup, Stack, useTheme, Typography } from '@mui/material';
import CustomButton from 'components/Button';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

//mock data
import { filterKeys, filterKeysMap } from 'data/datafilters';
import genreData from 'data/genreData';
import { IFilterKey } from 'types/dashboard';
import { colourStyles } from 'styles/react-select';
import useDashboardState from 'hooks/useDashboardState';

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
  const { dashboardState, onChangeDashboardState } = useDashboardState();
  const worksetMetadata = dashboardState?.worksetInfo?.volumes || [];
  const [filterGroup, setFilterGroup] = useState<any>({});
  const [selectedGroup, setSelectedGroup] = useState<any>(convertFromUrl(dashboardState?.filters));

  useEffect(() => {
    setSelectedGroup(convertFromUrl(dashboardState?.filters));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dashboardState?.filters]);

  const updateFiltersRoute = (newFilters: Record<string, any>) => {
    const queryString = qs.stringify(newFilters, { arrayFormat: 'comma', encode: false });
    // Pushing the new filters to the URL
    router.push({
      pathname: router.pathname,
      query: { ...router.query, filters: queryString }
    });
  };

  const handleApplyFilter = (filters: any) => {
    const transformed = Object.keys(filters).reduce((acc: any, key: any) => {
      acc[key] = filters[key].map((item: any) => item.value);
      return acc;
    }, {});

    updateFiltersRoute(transformed);
    onChangeDashboardState({
      filters: transformed
    });
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
    const titles = [...new Set(timeLineData.flatMap((obj: any) => obj.title))]
      .filter((title) => title !== undefined)
      .sort()
      .map((title) => ({ value: title, label: title, key: 'title' }));
    const pubDates = [...new Set(timeLineData.flatMap((obj: any) => obj.pubDate))]
      .filter((pubDate) => pubDate !== undefined)
      .sort()
      .map((pubDate) => ({ value: pubDate, label: pubDate?.toString(), key: 'pubDate' }));
    //const genres = [...new Set(timeLineData.map(obj => obj.metadata.genre))].filter(genre => genre !== undefined).map(genre => ({ value: genre, label: genre, key: 'genre' }));
    const genres = [...new Set(timeLineData.flatMap((obj: any) => obj.genre))]
      .filter((genre) => genre !== undefined)
      .sort()
      .map((genre) => ({ value: genre, label: genre, key: 'genre' }));
    const typesOfResources = [...new Set(timeLineData.flatMap((obj: any) => obj.typeOfResource))]
      .filter((type) => type !== undefined)
      .sort()
      .map((type) => ({ value: type, label: type, key: 'typeOfResource' }));
    const categories = [...new Set(timeLineData.flatMap((obj: any) => obj.category))]
      .filter((category) => category !== undefined)
      .sort()
      .map((category) => ({ value: category, label: category, key: 'category' }));
    const contributors = [...new Set(timeLineData.flatMap((obj: any) => obj.contributor))]
      .filter((contributor) => contributor !== undefined)
      .sort()
      .map((name) => ({ value: name, label: name, key: 'contributor' }));
    const publishers = [...new Set(timeLineData.flatMap((obj: any) => obj.publisher))]
      .filter((publisher) => publisher !== undefined)
      .sort()
      .map((name) => ({ value: name, label: name, key: 'publisher' }));
    const accessRights = [...new Set(timeLineData.flatMap((obj: any) => obj.accessRights))]
      .filter((accessRights) => accessRights !== undefined)
      .sort()
      .map((accessRights) => ({ value: accessRights, label: accessRights, key: 'accessRights' }));
    const pubPlaces = [...new Set(timeLineData.flatMap((obj: any) => obj.pubPlace))]
      .filter((pubPlace) => pubPlace !== undefined)
      .sort()
      .map((name) => ({ value: name, label: name, key: 'pubPlace' }));
    const languages = [...new Set(timeLineData.flatMap((obj: any) => obj.language))]
      .filter((language) => language !== undefined)
      .sort()
      .map((language) => ({ value: language, label: language, key: 'language' }));

    const sourceInstitutions = [...new Set(timeLineData.flatMap((obj: any) => obj.sourceInstitution))]
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
      titles,
      pubDates,
      genres,
      typesOfResources,
      categories,
      contributors,
      publishers,
      accessRights,
      pubPlaces,
      languages,
      sourceInstitutions
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
              if (Array.isArray(item[filterKeysMap[key]])) {
                return item[filterKeysMap[key]].includes(i.value);
              } else if (typeof item[filterKeysMap[key]] === 'object' && item[filterKeysMap[key]] !== null) {
                return i.value == item[filterKeysMap[key]].name;
              } else {
                return i.value == item[filterKeysMap[key]];
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
                if (Array.isArray(item[filterKeysMap[key]])) {
                  return item[filterKeysMap[key]].includes(i.value);
                } else if (typeof item[filterKeysMap[key]] === 'object' && item[filterKeysMap[key]] !== null) {
                  return i.value == item[filterKeysMap[key]].name;
                } else {
                  return i.value == item[filterKeysMap[key]];
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
      <Stack direction="row" justifyContent="space-between" mt={3}>
        <Box sx={{ '& .MuiButtonBase-root::after': { boxShadow: 'none' } }}>
          <CustomButton
            variant="contained"
            sx={{
              width: theme.spacing(17.5),
              height: theme.spacing(5),
              padding: theme.spacing(0.25),
              borderRadius: '15px',
              backgroundColor: theme.palette.primary[700]/*'#1e98d7'*/,
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
        <Box sx={{ '& .MuiButtonBase-root::after': { boxShadow: 'none' } }}>
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
