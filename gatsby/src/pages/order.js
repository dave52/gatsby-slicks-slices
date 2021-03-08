import React from 'react';
import SEO from '../components/SEO';

export default function OrderPage() {
  return (
    <>
      <SEO title="Order a Pizza!" />
      <form>
        <fieldset>
          <lengend>Your info</lengend>
          <label htmlFor="name">Name</label>
          <input type="text" name="name" value={name} onChange={(e) => setName(e.target.value)} />
          <label htmlFor="email">Email</label>
          <input type="email" name="email" />
        </fieldset>
        <fieldset>
          <lengend>Menu</lengend>
        </fieldset>
        <fieldset> 
          <lengend>Order</lengend>
        </fieldset>
      </form>
    </>
  );
}
