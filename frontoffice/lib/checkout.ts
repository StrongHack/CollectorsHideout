import { loadStripe } from "@stripe/stripe-js";
import { CheckoutProps } from "../types";

export async function checkout(props: CheckoutProps) {
  let stripePromise: any = null;

  const getStripe = () => {
    if (!stripePromise) {
      stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_API__KEY!);
    }
    return stripePromise;
  }

  const stripe = await getStripe();

  await stripe.redirectToCheckout({
    mode: 'payment',
    lineItems: props.lineItems,
    successUrl: `${window.location.origin}?session_id={CHECKOUT_SESSION_ID}`,
    cancelUrl: window.location.origin
  });
}
