import defaultAxios from 'axios';
import axios from 'utils/axios';

export function confirmWorkset(dashboard_id: string, selected_workset_id: string) {
  return axios.put(`/dashboards/${dashboard_id}/workset/${selected_workset_id}`);
}

export function getDashboards() {
  return axios.get(`/dashboards`);
}

export function getWorksets() {
  return axios.get(`/worksets`);
}

export function getTimeLineData() {
  return defaultAxios.get('/api/dashboard/publicationDateTimeLine');
}

export function getWorksetMetadata(worksetId: any) {
  return defaultAxios.get(`/api/dashboard/get-workset-metadata/${worksetId}`);
}

export function setFeaturedState(data: any) {
  return defaultAxios.post('/api/dashboard/set-featured-state', { data });
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
    const { metadata } = volumns[vol];
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
