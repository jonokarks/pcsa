import { NextResponse } from "next/server";
import Stripe from "stripe";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

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
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

export async function POST(req: Request) {
  console.log('Received request to create payment intent');
  
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('STRIPE_SECRET_KEY is not set');
      return NextResponse.json(
        { error: "Stripe configuration error" },
        { status: 500 }
      );
    }

    const body = await req.json() as RequestBody;
    console.log('Request body:', JSON.stringify(body, null, 2));

    const { amount, customerDetails, paymentIntentId } = body;

    // Convert amount to cents
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

      const updatedIntent = await stripe.paymentIntents.update(paymentIntentId, {
        amount: amountInCents,
        metadata
      });

      console.log('Payment intent updated successfully');
      return NextResponse.json({
        clientSecret: updatedIntent.client_secret,
        paymentIntentId: updatedIntent.id,
      }, {
        headers: {
          ...corsHeaders(),
          'Cache-Control': 'no-store, must-revalidate',
          'Pragma': 'no-cache',
        },
      });
    } else {
      console.log('Creating new payment intent');
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

      console.log('Payment intent created successfully');
      return NextResponse.json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      }, {
        headers: {
          ...corsHeaders(),
          'Cache-Control': 'no-store, must-revalidate',
          'Pragma': 'no-cache',
        },
      });
    }
  } catch (error) {
    console.error("Error in payment intent API:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error("Error details:", errorMessage);
    return NextResponse.json(
      { error: "Error creating payment intent" },
      { 
        status: 500,
        headers: {
          ...corsHeaders(),
          'Cache-Control': 'no-store, must-revalidate',
          'Pragma': 'no-cache',
        },
      }
    );
  }
}
