import { useEffect, useState } from 'react';

const gql = String.raw;

const deets = `
  name
  _id
  image {
    asset {
      url
      metadata {
        lqip # low quality image placeholder
      }
    }
  }
`;

export function useLatestData() {
  // hot slices
  const [hotSlices, setHotSlices] = useState();

  // slicemasters
  const [slicemasters, setSlicemasters] = useState();

  // use a side effect to fetch the data from the graphql endpoint
  useEffect(function () {
    // when the componet loads fetch the data
    fetch(process.env.GATSBY_GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        query: gql`
          query {
            StoreSettings(id: "downtown") {
              name
              slicemaster {
                 ${deets}
              }
              hotSlices {
                 ${deets}
              }
            }
          }
        `,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        // TODO: check for errors
        // set the data to state
        // console.log(res);
        setHotSlices(res.data.StoreSettings.hotSlices);
        setSlicemasters(res.data.StoreSettings.slicemaster);
      })
      .catch((err) => {
        console.log('SHOOOOT!');
        console.log(err);
      });
  }, []);
  return {
    hotSlices,
    slicemasters,
  };
}
