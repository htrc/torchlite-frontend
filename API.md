# Torchlite NextJS Backend API

## Introduction
This document describes the models and API specification for the Torchlite NextJS backend, which supports the needs 
of the NextJS front-end interface. The Torchlite application is composed of the following components:
- the NextJS-based front-end interface (what the user sees in their browser)
- the NextJS backend API (the server-side piece of the NextJS application)
- the Torchlite API (implements the Torchlite business logic for dashboards, filters, and data management)
- the Extracted Features API (used for accessing Extracted Features data for volumes and worksets)
- the Registry API (used for retrieving public and user-private worksets managed through Analytics Gateway)

From the point of view of the Torchlite NextJS-based front-end interface, only the API exposed by the NextJS backend 
is relevant; there should be no direct communication between the front-end and any of the other components outlined 
above.

The following sections will focus on the relationship between the front-end and NextJS backend, providing details 
about how they should function together.

## Front-end data requirements
The front-end NextJS interface needs the following dynamically-generated data:
- the current user information (auth'ed or anonymous), to populate the user card (top-right corner)
- for the workset selector, the list of available worksets (containing name, number of volumes, and description)
- the current dashboard state, containing the following:
    - the selected workset
    - metadata for all the volumes in the selected workset (to populate the filter options)
    - filter selections (all have list of options with OR semantics within each category, and AND semantics across 
      categories)
        - publication title
        - publication date
        - genre
        - resource type
        - category
        - contributor
        - publisher
        - access rights
        - place of publication
        - language
        - source institution
    - list of active widgets (widgets visible on the dashboard)
- data for each widget based on the dashboard state (to populate data points on the widget)
- the list of available widgets - to allow user to select new widgets to add to dashboard
  - this is "static" for now

In addition to the above data that's needed for populating the UI, the front-end also needs a few endpoints for
downloading data, for features like "Download filtered workset", etc.

## Models
The following model definitions are used by the API

### Session
This is actually provided by the [next-auth](https://next-auth.js.org/) session management middleware; the session 
will contain the following pieces of information (which can be accessed via the 
[useSession()](https://next-auth.js.org/getting-started/client#usesession) hook):

```javascript
session = {
  'user': {
    'name': 'John Smith',
    'email': 'john.smith@redacted.org'
  },
  'expires': '2023-10-23T19:43:21.822Z',   // session expiration
  'sessionId': '4aaba010-8fb2-455f-bc8b-ef1bc507e338'
}
```

### IdpProvider
```typescript
type IdpProvider = {
  institutionName: string;
  tag: string;
  entityId: string;
  domains: string[];
}
```

### WorksetSummary
```typescript
type WorksetSummary = {
  id: string;             // the workset identifier
  name: string;           // the workset name
  description?: string;   // the (optional) workset description
  author: string;         // the workset author
  isPublic: boolean;      // whether the workset is public or not
  numVolumes: number;     // the number of volumes in the workset
}
```

### WorksetInfo
```typescript
type WorksetInfo = WorksetSummary & {
  volumes: VolumeMetadata[];  // list of volume metadata for each volume in the workset
}
```

### VolumeMetadata
```typescript
type VolumeMetadata = {
  htid: string;                           // the HathiTrust volume identifier
  title: string;                          // the volume title
  pubDate: number | null;                 // the publication date
  genre: string | string[];               // one or more genre categories
  typeOfResource: string;                 // the type of resource
  category: string | string[] | null;     // one or more categories
  contributor: string | string[] | null;  // one or more contributors
  publisher: string | string[] | null;    // one or more publishers
  accessRights: string;                   // the volume access rights
  pubPlace: string | string[] | null;     // the place of publication
  language: string | string[] | null;     // one or more languages
  sourceInstitution: string;              // the source institution code
}
```

### FilterSettings
```typescript
type FilterSettings = {
  titles: string[];
  pubDates: number[];
  genres: string[];
  typesOfResources: string[];
  categories: string[];
  contributors: string[];
  publishers: string[];
  accessRights: string[];
  pubPlaces: string[];
  languages: string[];
  sourceInstitutions: string[];
}
```

### Widget
```typescript
type Widget = {
  type: string;   // the widget type (PubDateTimeline, ContributorMap, ...)
}
```

### DashboardState
```typescript
type DashboardState = {
  id: string;                     // the unique dashboard identifier
  owner?: string;                 // the dashboard owner (or undefined if anonymous)
  worksetId: string;              // the selected workset id
  worksetInfo: WorksetInfo;       // details about the selected workset
  filters: FilterSettings;        // the filter selections for the dashboard
  widgets: Widget[];              // the widgets selected for the dashboard
}
```

### DashboardStatePatch
```typescript
type DashboardStatePatch = {
  worksetId?: string;
  filters?: FilterSettings;
  widgets?: Widget[];
}
```

## NextJS Backend API
The NextJS backend API is designed to act as the sole point of contact for the front-end interface for obtaining the 
data needed to populate the UI. It implements a fairly thin layer around the Torchlite API which performs the "heavy 
lifting" of the actual work. The primary responsibility of the NextJS backend is to manage authentication and user 
sessions. All other work is delegated to the Torchlite API service.

### Get Available Worksets
```text
GET /api/worksets
```
|                    |                                                                                       |
|--------------------|---------------------------------------------------------------------------------------|
| **Description**    | Retrieves the public or public + private worksets, depending on authentication status |
| **Returns**        | [WorksetSummary[]](#worksetsummary)                                                   |


### Get Available Dashboards
```text
GET /api/dashboards
```
|                  |                                                                                                                                     |
|------------------|-------------------------------------------------------------------------------------------------------------------------------------|
| **Description**  | Retrieves the available dashboards                                                                                                  |
| **Query params** | `ref` - (optional) the reference dashboard id to "clone" if the user doesn't already have a dashboard                               |
| **Returns**      | [DashboardState[]](#dashboardstate)                                                                                                 |

### Get Dashboard State
```text
GET /api/dashboards/<id>
```
|                 |                                             |
|-----------------|---------------------------------------------|
| **Description** | Retrieves the state of a specific dashboard |
| **Path params** | `id` - the dashboard id to retrieve         |
| **Returns**     | [DashboardState](#dashboardstate)           |

### Update Dashboard State
```text
PATCH /api/dashboards/<id>
```
|                  |                                             |
|------------------|---------------------------------------------|
| **Description**  | Updates the dashboard state                 |
| **Path params**  | `id` - the dashboard id                     |
| **Request body** | [DashboardStatePatch](#dashboardstatepatch) |
| **Returns**      | 204 - No content                            |

### Get Widget Data
```text
GET /api/dashboards/<id>/widgets/<type>/data
```
|                  |                                                                               |
|------------------|-------------------------------------------------------------------------------|
| **Description**  | Retrieves data for a particular widget type for the given dashboard           |
| **Path params**  | `id` - the dashboard id<br>`type` - the widget type                           |
| **Query params** | `format` - (optional) the download format (`json` or `csv`) (default: `json`) |
| **Returns**      | The widget data in the specified format                                       |

## Front-end Behavior 

### Main page actions
The following actions could be taken by the front-end to obtain all the information needed for rendering the dashboard:

- check if an authenticated user session exists (via NextJS' `useSession()` hook)
- if it exists, extract the user information from the session and populate the user profile card (and enable the 
  Logout action), otherwise use a predefined anonymous user card and enable the Login action
- call the [Get Available Worksets](#get-available-worksets) endpoint and use the retrieved  [WorksetSummary[]](#worksetsummary) to 
  populate the workset selector component
- if anonymous user, look in the browser session storage for a `dashboard_id` entry, and if present retrieve its 
  value and call [Get Dashboard State](#get-dashboard-state), passing the value as the `id` path parameter; 
  otherwise, if a `dashboard_id` entry is not present, call [Get Available Dashboards](#get-available-dashboards) 
  and pick the first entry from the returned array as [DashboardState](#dashboardstate)
- for an authenticated user, also look in the browser session storage for a `dashboard_id` entry, and if present 
  pass its value as a `ref=<value>` query parameter in the [Get Available Dashboards](#get-available-dashboards) 
  call and pick the first entry in the returned array as [DashboardState](#dashboardstate)
- use the retrieved [DashboardState](#dashboardstate) to populate the selected workset, the filter options and 
  selected filters, and create/add the widget components;  
  _Note_: for an anonymous user, when the `DashboardState` response is received, the front-end should save the 
  dashboard id in the browser session storage as `dashboard_id`; for an authenticated user, the `dashboard_id` 
  browser session storage entry should be deleted (if present) once the `DashboardState` is retrieved;
- each widget component can display all the static parts, and then present a "busy wait" (spinning wheel) while 
  waiting for its data to be retrieved; each widget component can retrieve its own data by calling 
  [Get Widget Data](#get-widget-data) with, passing the dashboard `id` (from the previously retrieved 
  [DashboardState](#dashboardstate)) and `type` as path parameters in the request

At this point the dashboard should be fully rendered.

### Apply filters action
After a dashboard has been fully rendered, the user can interact with it in various ways.  One of the ways is by 
adjusting the dashboard-level filters used for subsetting the selected workset. Since the retrieved dashboard state 
contains an instance of [WorksetInfo](#worksetinfo) as `worksetInfo`, all the filter options should already 
be available in the filter selectors. The front-end needs to implement the logic of dynamically updating the 
possible choices for each filter given the other filter selections (this seems to be already implemented). 

Once the user is satisfied with his/her filter selections, the "Apply Filters" actions would trigger a call to 
[Update Dashboard State](#update-dashboard-state) containing the new `filters`, followed by a notification to the 
widgets to re-request their data (this can also be coordinated at the dashboard level via some sort of `for` loop 
that loops over all the active widgets, makes the backend call to get the data, and updates each widget with the 
retrieved data).

The "Clear Filters" action would follow an identical process except, of course, that the 
[FilterSettings](#filtersettings) submitted in the [Update Dashboard State](#update-dashboard-state) request would 
contain whatever "default" (maybe all clear?) HTRC desires.

### Switch workset action
The user could also decide to select a different workset from list presented in the workset selector. This action 
follows a similar approach to applying filters, requiring a call to the 
[Update Dashboard State](#update-dashboard-state) endpoint, passing in the new `worksetId` (and optionally 
new [FilterSettings](#filtersettings) filters). Just like before, the widgets' data would need to be updated to 
reflect the newly selected workset - this could be done via the [Get Widget Data](#get-widget-data) endpoint.

### Login action
When the login action is invoked, the following steps should be taken:
- check if a cookie named `idp_pref` exists, and if so extract `tag` and `entityID` values from the cookie
- fetch `https://analytics.hathitrust.org/idplist` (which returns a [IdpProvider[]](#idpprovider)) and create a modal 
  window/pop-up allowing the user to pick an institution from the downloaded list, pre-selecting the one corresponding 
  to the `tag` and `entityID` retrieved from the cookie (if the cookie exists); for an example of what the modal 
  window could look like, see https://analytics.hathitrust.org/ (click the `Sign In` button)
- after the user picks the institution, create/update the `idp_pref` cookie (set `maxAge: 60 * 60 * 24 * 365`) with the (`tag`, `entityID`) 
  user selection, then invoke the `signIn` flow via `next-auth` as follows:
  - if `tag == "hathi"` call  
    ```typescript
    signIn(
        'keycloak', 
        { callbackUrl: '/' },        // change as appropriate
        { 
            kc_idp_hint: 'htidp', 
            entityID: entityID,
        }
    );
    ```
  - if `tag == "cilogon"` call
    ```typescript
    signIn(
        'keycloak', 
        { callbackUrl: '/' },         // change as appropriate
        { 
            kc_idp_hint: 'cilogon', 
            idphint: entityID,
        }
    );
    ```

### Logout action
When the logout action is invoked, just call the `signOut()` action from `next-auth`.

### Download widget data action
If a user wishes to download the data driving a particular widget's viz, the front-end can use the 
[Get Widget Data](#get-widget-data) endpoint, specifying the user-selected `format`.

### Download the full workset EF dataset
TBD

### Download the filtered workset EF dataset
TBD

### Download the full workset metadata dataset
TBD

### Download the filtered workset metadata dataset
TBD

