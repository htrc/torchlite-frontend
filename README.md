# Torchlite-Frontend
*Next.js based dashboard that integrates the data visualization widgets*

## Development Notes

- **Mantis MUI Template**: This project utilizes the Mantis MUI template (v2.0.0). You can find more information about the template in its [Documentation](https://codedthemes.gitbook.io/mantis/v/v2.0.0-1/).

- **API Documentation**: Explore the API documentation in the [api.md](./API.md) file for details on available endpoints and functionality.


## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

## Pre-requisites

*Pre Requisites needed to run and build the project*

**Package Manager** - npm or yarn


## Quick Start

### Installation


Clone the repo:

```
git clone https://github.com/htrc/torchlite-frontend.git
```

Navigate into the cloned directory **(i.e. torchlite-frontend)**:

```
cd torchlite-frontend
```

Install the dependencies:

```
npm install
# or
yarn
```

### Start

Start the development server:

```
npm run dev
# or
yarn dev
```


Open http://localhost:8081 with your browser to see the result.


## Project Overview

### Folder Structure

```
torchlite-frontend
..
├── package.json           -> Package json file.
├── public
├── README.md
├── src
│   ├── components         -> components used in pages
│   │   ├── widgets
│   │   ├── card
│   │   ├── ...
│   ├── contexts           -> State context for Dashboard and Config
│   ├── hooks              -> Custom hooks
│   ├── layout
│   │   ├── MainLayout     -> Layout for main components & routers
│   ├── menu-items         -> menu items for each main menu
│   ├── pages              -> next js pages
│   ├── store              -> Redux actions, reducers (from template)
│   ├── themes             -> Contains application style and theme
│   ├── types              -> common types for Typescript
│   ├── utils              -> utilities
├── config.js              -> Project constant value and live customization  
```

### State Management

#### Context API
Context provides a way to pass data through the component tree without having to pass props down manually at every level.

We are using context for DashboardState and Config.

#### Redux
This project uses Redux. React Redux is the official React binding for Redux. It lets your React components read data from a Redux store, and dispatch actions to the store to update data.

We are using redux for storing menu state.


### How to

#### Create a new widget

Map widget and Timeline widget Component are under `src/components/widget/` directory.

You can create a new widget component under `src/components/widget/` and import it in `src/components/widget/index.tsx` and render depending on widgetType.

Here is an example to create WorldMap component that will render a map based on [world-110m map from the topojson-worldatlas](https://github.com/topojson/world-atlas#world/110m.json).

```javascript
// src/components/widgets/WorldMap/index.tsx
import React, { useState, useEffect } from "react"
import { geoEqualEarth, geoPath } from "d3-geo"
import { feature } from "topojson-client"

const projection = geoEqualEarth()

const WorldMap = () => {
  const [geographies, setGeographies] = useState([])

  useEffect(() => {
    fetch("/world-110m.json")
      .then(response => {
        if (response.status !== 200) {
          console.log(`There was a problem: ${response.status}`)
          return
        }
        response.json().then(worlddata => {
          setGeographies(feature(worlddata, worlddata.objects.countries).features)
        })
      })
  }, [])

  return (
    <svg width={ 800 } height={ 450 } viewBox="0 0 800 450">
      <g className="countries">
        {
          geographies.map((d,i) => (
            <path
              key={ `path-${ i }` }
              d={ geoPath().projection(projection)(d) }
              className="country"
              fill={ `rgba(38,50,56,${ 1 / geographies.length * i})` }
              stroke="#FFFFFF"
              strokeWidth={ 0.5 }
            />
          ))
        }
      </g>
    </svg>
  )
}

export default WorldMap
```

```javascript
// src/components/widgets/index.tsx

// ...
import WorldMap from "./WorldMap"

// Import the component in the return 

  return (
    <MainCard
      content={false}
      sx={{
        padding: theme.spacing(4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative'
      }}
    >
      <WidgetTitle widgetType={widgetType} isDetailsPage={isDetailsPage} />
      {loading ? (
        <CircularProgress sx={{ my: 3 }} color="primary" />
      ) : (
        <>
          {/* Other widgets */}
          {widgetType === WidgetType.WorldMap && (
            <WorldMap />
          )}
        </>
      )}
    </MainCard>
  )

// ...
export default Page
```

```javascript
// src/pages/dashboard/index.tsx
import React from "react"


// Import the component in the return, if widget.type === 'WordMap', it will render the WorldMap widget

  <Widget dashboardState={dashboardState} widgetType={widget.type} />

// ...
export default Page
```

#### Modify a widget

You can modify the component under `src/components/widgets/` folder.

#### Manage user sessions

This project uses [next-auth](https://next-auth.js.org/) library to handle user sessions. You can use `useSession()` hook to get authenticated state and current session.

#### Change styles, colors, fonts, etc

Default configurations are defined in `src/config.ts` and you can change styles and colors by updating themes in `src/themes/palette.ts` and `src/themes/theme`.

Here is the template [documentation](https://codedthemes.gitbook.io/mantis/v/v2.0.0-1/theme-config) how to customize it.
