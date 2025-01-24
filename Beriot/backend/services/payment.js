// Checkout.js
import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

function Checkout({ cart, total }) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement)
    });

    if (!error) {
      // Send payment to backend
      const { id } = paymentMethod;
      try {
        const response = await fetch('/api/checkout', {
          method: 'POST',
          body: JSON.stringify({
            amount: total,
            id: id
          })
        });
        // Handle successful payment
      } catch (error) {
        // Handle payment error
      }
    }
    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button disabled={processing}>
        Pay ${total}
      </button>
    </form>
  );
}