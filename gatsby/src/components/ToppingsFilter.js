import { useStaticQuery, graphql, Link } from 'gatsby';
import React from 'react';
import styled from 'styled-components';

const ToppingsStyles = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 4rem;
  // <Link> but renders to an <a>
  a {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-gap: 0 1rem;
    align-items: center;
    padding: 5px;
    background: var(--grey);
    border-radius: 2px;
    .count {
      background: white;
      padding: 12px 5px;
    }
    &[aria-current='page'] {
      background: var(--yellow);
    }
  }
`;

function countPizzasInToppings(pizzas) {
  // return the pizzas with counts
  // .flat takes what would've been an array of arrays, and turns it into 1 array
  const counts = pizzas
    .map((pizza) => pizza.toppings)
    .flat()
    .reduce((accumulator, topping) => {
      // check if this is an existing topping
      const existingTopping = accumulator[topping.id];
      // if it is increment by 1
      if (existingTopping) {
        existingTopping.count += 1;
      } else {
        // otherwise create a new entry in our accumulator and set it to one
        accumulator[topping.id] = {
          id: topping.id,
          name: topping.name,
          count: 1,
        };
      }
      return accumulator;
    }, {});

  // sort them based on their count
  const sortedToppings = Object.values(counts).sort(
    (a, b) => b.count - a.count
  );
  return sortedToppings;
}

export default function ToppingsFilter({ activeTopping }) {
  // get a list of all the toppings
  // get a list of all the pizzas with their toppings
  // useStaticQuery & graphql`` comes from gatsby
  const { toppings, pizzas } = useStaticQuery(graphql`
    query {
      # note not actually using the toppings at all
      toppings: allSanityTopping {
        nodes {
          name
          id
          vegetarian
        }
      }
      pizzas: allSanityPizza {
        nodes {
          toppings {
            name
            id
          }
        }
      }
    }
  `);
  console.clear();
  // console.log'ing 2 things but want to know names, simply wrap them in {}s and youll see them in the objected nested by name
  // console.log({ toppings, pizzas });

  // count how many pizzas are in each topping
  const toppingsWithCounts = countPizzasInToppings(pizzas.nodes);
  console.log(toppingsWithCounts);
  // loop over the list of toppings and display the topping and the count of pizzas in that topping
  // link it up...
  return (
    <ToppingsStyles>
      <Link to="/pizzas">
        <span className="name">All</span>
        <span className="count">{pizzas.nodes.length}</span>
      </Link>
      {toppingsWithCounts.map((topping) => (
        <Link to={`/topping/${topping.name}`} key={topping.id}>
          <span className="name">{topping.name}</span>
          <span className="count">{topping.count}</span>
        </Link>
      ))}
    </ToppingsStyles>
  );
}
