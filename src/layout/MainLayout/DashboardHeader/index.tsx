import { useState } from 'react';
import { Box, Stack, FormControl, Select, MenuItem, SelectChangeEvent, useTheme } from '@mui/material';
import CustomButton from 'components/Button';

//import chart data for check htid
// import publicationDateTimeLineChart from 'data/publicationDateTimeLine'
// import {worksets} from 'data/workset'
//
// import {
//   Genres,
//   ResourceType,
//   Category,
//   Availability,
//   Contributor,
//   Publisher,
//   PlaceOfPublication,
//   PublicationTitle
// } from 'data/datafilters'

const DashboardHeader = () => {
  const theme = useTheme();
  const widgetList1 = ['Mapping Contrubutor Data', 'Publication Date Timeline', 'Workset Languages'];
  const widgetList2 = [
    'Jupyter Notebooks',
    'Extracted Features API Demo',
    'Customize a Dashboard Widget',
    'Combining Extracted Feature and Outside Data'
  ];
  const [widget1, setWidget1] = useState<string>(widgetList1[0]);
  const [widget2, setWidget2] = useState<string>(widgetList2[0]);

  const handleChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    if (name === 'widget_1') setWidget1(value);
    else if (name === 'widget_2') setWidget2(value);
  };

  //to create filter tmp data
  // @ts-ignore
  // const createDataset = () => {
  //   let cnt = 10
  //   let publicationDateTimeLineChart_new = []
  //   for (let i = 0; i <= cnt; i++) {
  //     let htid = Math.floor(Math.random() * (999 - 100 + 1) + 100)
  //     let isExist = true
  //     while (isExist) {
  //       if (publicationDateTimeLineChart.filter(e => e.htid === htid).length > 0) {
  //         /* vendors contains the element we're looking for */
  //         isExist = true
  //       } else {
  //         isExist = false
  //       }
  //     }
  //     let pubDate = Math.floor(Math.random() * (2020 - 1930 + 1) + 1930)
  //     let worksetId_index = Math.floor(Math.random() * 6)
  //     let worksetId = worksets[worksetId_index]['id']
  //     let Category_index = Math.floor(Math.random() * 3)
  //     let Category_value = Category[Category_index]['value']
  //     let ResourceType_index = Math.floor(Math.random() * 6)
  //     let ResourceType_value = ResourceType[ResourceType_index]['value']
  //     let Availability_index = Math.floor(Math.random() * 3)
  //     let Availability_value = Availability[Availability_index]['value']
  //     let Contributor_index = Math.floor(Math.random() * 3)
  //     let Contributor_value = Contributor[Contributor_index]['value']
  //     let Publisher_index = Math.floor(Math.random() * 3)
  //     let Publisher_value = Publisher[Publisher_index]['value']
  //     let PlaceOfPublication_index = Math.floor(Math.random() * 3)
  //     let PlaceOfPublication_value = PlaceOfPublication[PlaceOfPublication_index]['value']
  //     let PublicationTitle_index = Math.floor(Math.random() * 3)
  //     let PublicationTitle_value = PublicationTitle[PublicationTitle_index]['value']
  //     let Genre_index = Math.floor(Math.random() * 6)
  //     let Genre_value = Genres[Genre_index]['value']
  //     let data = {
  //       htid: htid,
  //       pubDate: pubDate,
  //       worksetId: worksetId,
  //       Category: Category_value,
  //       ResourceType: ResourceType_value,
  //       Availability: Availability_value,
  //       Contributor: Contributor_value,
  //       Publisher: Publisher_value,
  //       PlaceOfPublication: PlaceOfPublication_value,
  //       PublicationTitle: PublicationTitle_value,
  //       Genre: Genre_value
  //     }
  //     publicationDateTimeLineChart_new.push(data)
  //   }
  //   console.log(publicationDateTimeLineChart_new)
  // }

  return (
    <Stack
      sx={{
        padding: theme.spacing(2),
        '& .MuiButton-root::after': { boxShadow: 'none' }
      }}
      direction="row"
      alignItems="center"
      justifyContent="space-between"
    >
      <CustomButton
        variant="outlined"
        color="secondary"
        sx={{
          width: '7.5rem',
          height: '32px',
          color: theme.palette.mode === 'dark' ? 'inherit' : '#333',
          padding: '2px',
          borderRadius: '15px',
          border: '1px solid',
          borderColor: theme.palette.divider,
          boxSizing: 'border-box',
          fontSize: '13px',
          textAlign: 'center',
          lineHeight: 'normal'
        }}
      >
        Download Data
      </CustomButton>
      <Box>
        <FormControl sx={{ m: 1, mr: '25px' }}>
          <Select
            value={widget1}
            name={'widget_1'}
            sx={{
              width: '11.875rem',
              height: '1.5625rem',
              padding: theme.spacing(0.25),
              borderRadius: '0.815rem',
              boxSizing: 'border-box',
              fontSize: '0.8125rem'
            }}
            color="secondary"
            onChange={handleChange}
          >
            <MenuItem value="Add Widgets">Add Widgets</MenuItem>
            {widgetList1.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ m: 1, mr: '1.3125rem' }}>
          <Select
            value={widget2}
            name={'widget_2'}
            sx={{
              width: '18.75rem',
              height: '25px',
              padding: '2px 2px 2px 2px',
              borderRadius: '13px',
              boxSizing: 'border-box',
              fontSize: '13px'
            }}
            color="secondary"
            onChange={handleChange}
          >
            {widgetList2.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <CustomButton
          variant="contained"
          color="secondary"
          sx={{
            width: '145px',
            height: '39px',
            padding: '2px',
            borderRadius: '14px',
            backgroundColor: '#1e98d7',
            boxSizing: 'border-box',
            color: '#ffffff',
            textAlign: 'center',
            lineHeight: 'normal'
          }}
          // onClick={createDataset}
        >
          Sign in
        </CustomButton>
      </Box>
    </Stack>
  );
};

export default DashboardHeader;
