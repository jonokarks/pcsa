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
  paymentIntentId?: string;
  includeCprSign?: boolean;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Credentials': 'true',
} as const;

export const handler: Handler = async (event: HandlerEvent): Promise<HandlerResponse> => {
  // Set function timeout
  const timeout = new Promise<never>((_, reject) => 
    setTimeout(() => reject(new Error('Timeout')), 9000)
  );

  try {
    const result = await Promise.race([
      handleRequest(event),
      timeout
    ]);
    return result;
  } catch (error: unknown) {
    console.error('Function error:', error);
    const isTimeout = error instanceof Error && error.message === 'Timeout';
    return {
      statusCode: isTimeout ? 504 : 500,
      headers: corsHeaders,
      body: JSON.stringify({ 
        error: isTimeout ? 'Request timeout' : 'Internal server error' 
      })
    };
  }
};

async function handleRequest(event: HandlerEvent): Promise<HandlerResponse> {

  if (event.httpMethod === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    return {
      statusCode: 204,
      headers: corsHeaders,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    console.log('Invalid method:', event.httpMethod);
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    console.log('Processing request...');

    let body: RequestBody;
    try {
      body = JSON.parse(event.body || '{}') as RequestBody;
      console.log('Parsed request body:', {
        amount: body.amount,
        hasCustomerDetails: !!body.customerDetails,
        paymentIntentId: body.paymentIntentId,
        includeCprSign: body.includeCprSign,
      });
    } catch (error) {
      console.error('Failed to parse request body:', error);
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Invalid request body' }),
      };
    }

    const { amount, customerDetails, paymentIntentId } = body;

    if (!amount || amount <= 0) {
      console.error('Invalid amount:', amount);
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Invalid amount' }),
      };
    }

    console.log('Converting amount to cents...');
    const amountInCents = Math.round(amount * 100);
    console.log('Amount in cents:', amountInCents);

    if (paymentIntentId) {
      console.log('Updating existing payment intent:', paymentIntentId);
      const metadata: Record<string, string> = {
        firstName: customerDetails?.firstName || '',
        lastName: customerDetails?.lastName || '',
        email: customerDetails?.email || '',
        phone: customerDetails?.phone || '',
        address: customerDetails?.address || '',
        suburb: customerDetails?.suburb || '',
        postcode: customerDetails?.postcode || '',
        preferredDate: customerDetails?.preferredDate || '',
        notes: customerDetails?.notes || '',
      };

      console.log('Updating payment intent with metadata...');
      const updatedIntent = await stripe.paymentIntents.update(paymentIntentId, {
        amount: amountInCents,
        metadata
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
          clientSecret: updatedIntent.client_secret,
          paymentIntentId: updatedIntent.id,
        }),
      };
    } else {
      console.log('Creating new payment intent...');
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency: "aud",
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          service: "Pool Compliance Inspection",
          includeCprSign: body.includeCprSign ? "yes" : "no",
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
          paymentIntentId: paymentIntent.id,
        }),
      };
    }
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
