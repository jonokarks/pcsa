import { NextResponse } from "next/server";
import Stripe from "stripe";

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

const stripe = new Stripe('sk_test_51QiDnFIpu7s8bD02mnhCE87eAp4T7aQmla2DHUe6LXziDg5gmMMy5HlYf2w6RGp6BmDJhQyTXDzAWqj3w6pgiD9300pDJAysuB', {
  apiVersion: "2023-10-16",
  typescript: true,
  httpClient: Stripe.createFetchHttpClient(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, customerDetails, paymentIntentId } = body;

    // Convert amount to cents
    const amountInCents = Math.round(amount * 100);

    if (paymentIntentId) {
      // Update existing payment intent
      const updatedIntent = await stripe.paymentIntents.update(paymentIntentId, {
        amount: amountInCents,
        metadata: {
          firstName: customerDetails?.firstName,
          lastName: customerDetails?.lastName,
          email: customerDetails?.email,
          phone: customerDetails?.phone,
          address: customerDetails?.address,
          suburb: customerDetails?.suburb,
          postcode: customerDetails?.postcode,
          preferredDate: customerDetails?.preferredDate,
          notes: customerDetails?.notes,
        },
      });

      return NextResponse.json({
        clientSecret: updatedIntent.client_secret,
        paymentIntentId: updatedIntent.id,
      }, {
        headers: {
          'Cache-Control': 'no-store, must-revalidate',
          'Pragma': 'no-cache',
        },
      });
    } else {
      // Create new payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency: "aud",
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          service: "Pool Compliance Inspection",
          timestamp: new Date().toISOString(),
        },
      });

      return NextResponse.json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      }, {
        headers: {
          'Cache-Control': 'no-store, must-revalidate',
          'Pragma': 'no-cache',
        },
      });
    }
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return NextResponse.json(
      { error: "Error creating payment intent" },
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-store, must-revalidate',
          'Pragma': 'no-cache',
        },
      }
    );
  }
}
