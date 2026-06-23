export type PayPalEnv = "sandbox" | "live";

export type PayPalOrderRequest = {
  intent: "CAPTURE";
  purchase_units: Array<{
    reference_id: string;
    description: string;
    amount: {
      currency_code: "USD";
      value: string;
      breakdown?: {
        item_total: {
          currency_code: "USD";
          value: string;
        };
        discount?: {
          currency_code: "USD";
          value: string;
        };
      };
    };
    items?: Array<{
      name: string;
      sku: string;
      quantity: string;
      unit_amount: {
        currency_code: "USD";
        value: string;
      };
    }>;
  }>;
};

export type PayPalOrderResponse = {
  id: string;
  status: string;
};

function baseUrl(env: string | undefined): string {
  if (env === "live") return "https://api-m.paypal.com";
  return "https://api-m.sandbox.paypal.com";
}

export async function getPayPalAccessToken(): Promise<string> {
  const clientId = Deno.env.get("PAYPAL_CLIENT_ID");
  const clientSecret = Deno.env.get("PAYPAL_CLIENT_SECRET");

  if (!clientId || !clientSecret) {
    throw new Error("PAYPAL_CONFIG_MISSING");
  }

  const credentials = btoa(`${clientId}:${clientSecret}`);
  const response = await fetch(`${baseUrl(Deno.env.get("PAYPAL_ENV"))}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    throw new Error("PAYPAL_TOKEN_ERROR");
  }

  const data = await response.json();
  if (!data?.access_token) {
    throw new Error("PAYPAL_TOKEN_ERROR");
  }

  return data.access_token;
}

export async function createPayPalOrder(
  accessToken: string,
  order: PayPalOrderRequest,
): Promise<PayPalOrderResponse> {
  const response = await fetch(`${baseUrl(Deno.env.get("PAYPAL_ENV"))}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(order),
  });

  if (!response.ok) {
    throw new Error("PAYPAL_CREATE_ORDER_ERROR");
  }

  const data = await response.json();
  if (!data?.id) {
    throw new Error("PAYPAL_CREATE_ORDER_ERROR");
  }

  return {
    id: data.id,
    status: data.status || "CREATED",
  };
}
