import defaultAxios from 'axios';
import idpList from 'data/idplist.json';
import { DashboardStatePatch } from 'types/torchlite';

export async function updateDashboardState(dashboardId: string, body: DashboardStatePatch) {
  return defaultAxios.patch(`/api/dashboards/${dashboardId}`, body).then((response) => response.data);
}

export async function getAvailableDashboards(dashboardId?: string | null) {
  return defaultAxios.get(`/api/dashboards${dashboardId ? `?ref=${dashboardId}` : ''}`).then((response) => response.data);
}

export async function getDashboardState(dashboardId: string) {
  return defaultAxios.get(`/api/dashboards/${dashboardId}`).then((response) => response.data);
}

export async function getAvailableWorksets() {
  return defaultAxios.get(`/api/worksets`).then((response) => response.data);
}

export async function getWidgetData(dashboardId: any, widgetType: any) {
  return defaultAxios.get(`/api/dashboards/${dashboardId}/widgets/${widgetType}/data`).then((response) => response.data);
}

export async function getWorksetMetadata(worksetId: any) {
  return defaultAxios.get(`/api/worksets/${worksetId}/metadata`);
}

export async function getIdplist() {
  return defaultAxios
    .get('https://analytics.hathitrust.org/idplist')
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error('Error fetching remote data:', error);

      // If there's an error, load the local JSON file as a fallback
      return idpList;
    });
}

export async function getMapWidgetData(selectedWorksetId: any) {
  return new Promise((resolve, reject) => {
    fetch(`https://tools.htrc.illinois.edu/ef-api/worksets/${selectedWorksetId}/metadata?fields=metadata.contributor.id`).then(
      (response) => {
        if (response.status !== 200) {
          console.log(`There was a problem: ${response.status}`);
          reject(response);
        }
        response.json().then((viddata) => {
          let counts = getCountryCounts(viddata['data']);
          counts
            .then((result) => {
              resolve(result);
            })
            .catch((error) => {
              console.log('Error when get vip data: ' + error);
              reject(error);
            });
        });
      }
    );
  });
}

export const getCountryCounts = async (volumns: any) => {
  const viafid_set = new Set();
  for (const vol in volumns) {
    const metadata = volumns[vol];
    if (metadata.contributor) {
      if (Array.isArray(metadata.contributor)) {
        for (const contributor of metadata.contributor) {
          viafid_set.add(contributor.id);
        }
      } else {
        viafid_set.add(metadata.contributor.id);
      }
    }
  }
  const viafids = Array.from(viafid_set);
  const chunked_viafids = [];
  const chunk_size = 25;
  for (let i = 0; i < viafids.length; i += chunk_size) {
    chunked_viafids.push(viafids.slice(i, i + chunk_size));
  }

  let iso_codes_arr: any[] = [];
  await Promise.all(
    chunked_viafids.map(async (viafid_chunk) => {
      const endpointUrl = 'https://query.wikidata.org/sparql';
      let values = viafid_chunk
        .map((item: any) => {
          try {
            return ` <${item.replace('www.', '')}>`;
          } catch (error) {
            return ` <${item}>`;
          }
        })
        .join(' ');

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

      await new Promise((r) => setTimeout(r, 100 * getRandomInt(Math.floor(viafids.length / 50))));

      const iso_codes = await query(sparqlQuery, endpointUrl).then((res) => {
        for (const row of res.results.bindings) {
          const { item, countryiso, dob, cityLabel: city, cityCoords } = row;
          const iso_codes_per_tmp = {
            item: item?.value ?? '',
            countryiso: countryiso?.value ?? '',
            dob: dob?.value ?? '',
            city: city?.value ?? '',
            cityCoords: cityCoords?.value ?? ''
          };
          iso_codes_arr.push(iso_codes_per_tmp);
        }
      });
      return iso_codes;
    })
  );

  return iso_codes_arr;
};

const query = (sparqlQuery: any, endpoint: any) => {
  const fullUrl = endpoint + '?query=' + encodeURIComponent(sparqlQuery);
  const headers = { Accept: 'application/sparql-results+json' };

  return fetch(fullUrl, { headers }).then((body) => body.json());
};

const getRandomInt = (max: any) => {
  return Math.floor(Math.random() * max);
};
