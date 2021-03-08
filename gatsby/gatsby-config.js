import dotenv from 'dotenv';

dotenv.config({ path: '.env' });
// to test it
// console.log(process.env.SANITY_TOKEN);

export default {
  siteMetadata: {
    title: `Slickes Slices`,
    siteUrl: 'https://gatsby.pizza',
    description: 'THe best pizza place in Hamilton!',
    twitter: '@slicksSlices',
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-styled-components',
    {
      // this is the name of the plugin you are adding
      resolve: 'gatsby-source-sanity',
      options: {
        projectId: 'ilyfyk4n',
        dataset: 'production',
        watchMode: true,
        token: process.env.SANITY_TOKEN,
      },
    },
  ],
};
