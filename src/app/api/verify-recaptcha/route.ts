import { NextResponse } from 'next/server';
import { SECURITY_APIS } from '@/config/security-apis';

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    const verificationResponse = await fetch(
      'https://www.google.com/recaptcha/api/siteverify',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `secret=${SECURITY_APIS.recaptcha.secretKey}&response=${token}`,
      }
    );

    const verificationResult = await verificationResponse.json();

    return NextResponse.json(verificationResult);
  } catch (error) {
    return NextResponse.json(
      { error: 'reCAPTCHA verification failed' },
      { status: 500 }
    );
  }
}