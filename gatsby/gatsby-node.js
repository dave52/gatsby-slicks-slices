import path from 'path';
import fetch from 'isomorphic-fetch';

async function turnPizzasIntoPages({ graphql, actions }) {
  // 1. get a template for this page
  const pizzaTemplate = path.resolve('./src/templates/Pizza.js');
  // 2. query all pizzas
  const { data } = await graphql(`
    query {
      pizzas: allSanityPizza {
        nodes {
          name
          slug {
            current
          }
        }
      }
    }
  `);
  // console.log(data);
  // 3. loop over each pizza and create a page for that pizza
  data.pizzas.nodes.forEach((pizza) => {
    // console.log('creating a page for the ', pizza.name);
    actions.createPage({
      // what is url for the new page?
      path: `pizza/${pizza.slug.current}`,
      component: pizzaTemplate,
      context: {
        slug: pizza.slug.current,
      },
    });
  });
}

async function turnToppingsIntoPages({ graphql, actions }) {
  // console.log(`Turning the toppings into pages`);
  // 1. get the template, going to reuse another component so dont need custom
  // same component for displaying pizzas just need to mod query a bit
  const toppingTemplate = path.resolve('./src/pages/pizzas.js');
  // 2. query all the toppings
  const { data } = await graphql(`
    query {
      toppings: allSanityTopping {
        nodes {
          name
          id
        }
      }
    }
  `);
  // 3. createPage for that topping
  data.toppings.nodes.forEach((topping) => {
    console.log(`creating page for `, topping.name);
    actions.createPage({
      path: `topping/${topping.name}`,
      component: toppingTemplate,
      context: {
        topping: topping.name,
        // TODO: regex for topping
        toppingRegex: `/${topping.name}/i`,
      },
    });
  });
  // 4. pass topping data to pizza.js
}

async function fetchBeersAndTurnIntoNodes({
  actions,
  createNodeId,
  createContentDigest,
}) {
  // console.log('Turn beers into nodes');
  // 1. fetch list of beers
  const res = await fetch('https://api.sampleapis.com/beers/ale');
  // 2. loop over each one
  const beers = await res.json();
  // console.log(beers);
  // 3. create a node for that beer
  for (const beer of beers) {
    if (!beer.name) return;
    const nodeMeta = {
      id: createNodeId(`beer-${beer.name}`),
      parent: null,
      children: [],
      internal: {
        type: 'Beer',
        mediaType: 'application/json',
        contentDigest: createContentDigest(beer),
      },
    };
    actions.createNode({
      ...beer,
      ...nodeMeta,
    });
  }
}

async function turnSlicemastersIntoPages({graphql, actions}) {
  // 1. query all slicemasters
  const { data } = await graphql(`
    query {
      slicemasters: allSanityPerson {
        totalCount
        nodes {
          name
          id
          slug {
            current
          }
        }
      }
    }
  `);
  // TODO: 2. turn each slicemaster into their own page
  data.slicemasters.nodes.forEach(slicemaster => {
    actions.createPage({
      component: path.resolve('./src/templates/Slicemaster.js'),
      path: `/slicemasters/${slicemaster.slug.current}`,
      context: {
        name: slicemaster.person,
        slug: slicemaster.slug.current
      }
    })
  })
  // 3. figure out how many pages there are based on how many slicemasters there are, an dhow many per page
  const pageSize = parseInt(process.env.GATSBY_PAGE_SIZE);
  const pageCount = Math.ceil(data.slicemasters.totalCount / pageSize);
  console.log(`There are ${data.slicemasters.totalCount} and we have ${pageCount} pages with ${pageSize} per page`);
  // 4. loop from 1 to n and create the pages for them
  // Array.from({ length: pageCount }).forEach(_, i) => console.log(i);
  Array.from({ length: pageCount }).forEach((_, i) => {
    console.log(`Creating page ${i}`);
    actions.createPage({
      path: `/slicemasters/${i + 1}`,
      component: path.resolve('./src/pages/slicemasters.js'),
      // this data is passed to the template when we create it
      context: {
        skip: i * pageSize,
        currentPage: i + 1,
        pageSize,
      },

    });
  });
}

export async function sourceNodes(params) {
  // fetch a list of beers and source them into our gatsby API
  await Promise.all([fetchBeersAndTurnIntoNodes(params)]);
}

export async function createPages(params) {
  // create pages dynamically
  // wait for all promises to be resolved before finishing this function
  await Promise.all([
    turnPizzasIntoPages(params),
    turnToppingsIntoPages(params),
    turnSlicemastersIntoPages(params),
  ]);
  // 1. pizzas
  // await turnPizzasIntoPages(params);
  // 2. toppings
  // 3. slicemasters
}
