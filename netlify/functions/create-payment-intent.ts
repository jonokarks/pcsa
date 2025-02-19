import type { Handler, HandlerEvent, HandlerResponse } from '@netlify/functions';
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY must be defined');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
  typescript: true,
});

interface CustomerDetails {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  suburb?: string;
  postcode?: string;
  preferredDate?: string;
  notes?: string;
}

interface RequestBody {
  amount: number;
  customerDetails?: CustomerDetails;
  includeCprSign?: boolean;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Credentials': 'true',
} as const;

export const handler: Handler = async (event: HandlerEvent): Promise<HandlerResponse> => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: corsHeaders,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const body = JSON.parse(event.body || '{}') as RequestBody;
    const { amount, customerDetails } = body;

    if (!amount || amount <= 0) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Invalid amount' }),
      };
    }

    // Fixed prices
    const BASE_PRICE = 21000; // $210 in cents
    const CPR_SIGN_PRICE = 3000; // $30 in cents

    // Calculate total
    const baseAmount = BASE_PRICE;
    const cprSignAmount = body.includeCprSign ? CPR_SIGN_PRICE : 0;
    const totalAmount = baseAmount + cprSignAmount;

    console.log('Payment calculation:', {
      baseAmount: baseAmount / 100,
      cprSignAmount: cprSignAmount / 100,
      totalAmount: totalAmount / 100,
      includeCprSign: body.includeCprSign
    });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency: "aud",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        service: "Pool Compliance Inspection",
        firstName: customerDetails?.firstName || '',
        lastName: customerDetails?.lastName || '',
        email: customerDetails?.email || '',
        phone: customerDetails?.phone || '',
        address: customerDetails?.address || '',
        suburb: customerDetails?.suburb || '',
        postcode: customerDetails?.postcode || '',
        preferredDate: customerDetails?.preferredDate || '',
        notes: customerDetails?.notes || '',
        includeCprSign: body.includeCprSign ? "yes" : "no",
        baseAmount: String(baseAmount / 100),
        cprSignAmount: String(cprSignAmount / 100),
        totalAmount: String(totalAmount / 100),
        timestamp: new Date().toISOString(),
      },
    });

    return {
      statusCode: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, must-revalidate',
        'Pragma': 'no-cache',
      } as const,
      body: JSON.stringify({
        clientSecret: paymentIntent.client_secret,
      }),
    };
  } catch (error) {
    console.error("Error in payment intent function:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    return {
      statusCode: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      } as const,
      body: JSON.stringify({ error: errorMessage }),
    };
  }
};
