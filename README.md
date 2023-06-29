# Torchlite-Frontend
*Next.js based dashboard that integrates the data visualization widgets*

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


## Folder Structure

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
│   ├── contexts           -> State context for Login and other
│   ├── hooks              -> Custom hooks
│   ├── layout
│   │   ├── MainLayout     -> Layout for main components & routers
│   ├── menu-items         -> menu items for each main menu
│   ├── pages              -> next js pages
│   ├── store              -> Redux actions, reducers
│   │   ├── slices         -> different slices of toolkit
│   ├── themes             -> Contains application style and theme
│   ├── types              -> common types for Typescript
│   ├── utils              -> utilities
├── config.js              -> Project constant value and live customization  
```

## State Management

### Context API
Context provides a way to pass data through the component tree without having to pass props down manually at every level.

We are using context for login methods JWT.

### Redux
This project uses Redux. React Redux is the official React binding for Redux. It lets your React components read data from a Redux store, and dispatch actions to the store to update data.

### State
With Redux, our application state is always kept in plain JavaScript objects and arrays which means you may not put other things into the Redux state - no class instances, built-in JS types like Map / Set Promise / Date, functions, or anything else that is not plain JS data



## How to

### Create a new widget

Map widget and Timeline widget Component is under `src/components/widget/` directory.

You can create a new visualization widget using D3 library and import it in `src/pages/dashboard/index.tsx` to show it on Dashboard page.

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
// src/pages/dashboard/index.tsx
import React from "react"

import WorldMap from "components/widgets/WorldMap"

// Import the component in the return 

  <WorldMap />

// ...
export default Page
```
