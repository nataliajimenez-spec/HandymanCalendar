// Cliente para la Guesty Open API — se usa solo para halar (leer) reservas
// (check-in/check-out) de las unidades short-term y saber cuáles están
// ocupadas. No escribimos nada en Guesty.
//
// Requiere las variables de entorno GUESTY_CLIENT_ID / GUESTY_CLIENT_SECRET
// (credenciales de una app "API Client" creada en el panel de Guesty, con
// scope "open-api"). Ver README para instrucciones de configuración.

const TOKEN_URL = "https://open-api.guesty.com/oauth2/token";
const API_BASE = "https://open-api.guesty.com/v1";

export function isGuestyConfigured() {
  return Boolean(process.env.GUESTY_CLIENT_ID && process.env.GUESTY_CLIENT_SECRET);
}

let cachedToken: { value: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 30_000) {
    return cachedToken.value;
  }

  const clientId = process.env.GUESTY_CLIENT_ID;
  const clientSecret = process.env.GUESTY_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("Guesty no está configurado (faltan GUESTY_CLIENT_ID/GUESTY_CLIENT_SECRET).");
  }

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      scope: "open-api",
      client_id: clientId,
      client_secret: clientSecret,
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`No se pudo autenticar con Guesty (${res.status}).`);
  }

  const data = (await res.json()) as { access_token: string; expires_in: number };
  cachedToken = { value: data.access_token, expiresAt: Date.now() + data.expires_in * 1000 };
  return cachedToken.value;
}

export type GuestyReservationDTO = {
  guestyId: string;
  listingId: string;
  status: string;
  guestName: string | null;
  checkIn: string; // ISO
  checkOut: string; // ISO
};

/**
 * Trae las reservas de los listings dados cuya estadía se solapa con
 * [from, to]. Se filtran del lado del cliente porque el subset de campos
 * que soporta filtrar la Open API de Guesty varía por plan/versión.
 */
export async function fetchGuestyReservations(params: {
  listingIds: string[];
  from: Date;
  to: Date;
}): Promise<GuestyReservationDTO[]> {
  const { listingIds, from, to } = params;
  if (listingIds.length === 0) return [];

  const token = await getAccessToken();
  const results: GuestyReservationDTO[] = [];
  const activeStatuses = new Set(["confirmed", "checked_in", "checked_out", "inquiry_confirmed"]);

  // La Open API pagina de a 100 y no siempre soporta un filtro "in" grande
  // de forma confiable, así que consultamos por lotes chicos de listings.
  const BATCH_SIZE = 20;
  for (let i = 0; i < listingIds.length; i += BATCH_SIZE) {
    const batch = listingIds.slice(i, i + BATCH_SIZE);
    let skip = 0;
    const limit = 100;

    while (true) {
      const filters = JSON.stringify([
        { field: "listingId", operator: "$in", value: batch },
        { field: "checkOutDateLocalized", operator: "$gte", value: from.toISOString().slice(0, 10) },
        { field: "checkInDateLocalized", operator: "$lte", value: to.toISOString().slice(0, 10) },
      ]);

      const url = `${API_BASE}/reservations?filters=${encodeURIComponent(filters)}&limit=${limit}&skip=${skip}&fields=_id listingId status guest checkInDateLocalized checkOutDateLocalized`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error(`Guesty devolvió un error al pedir reservas (${res.status}).`);
      }

      const body = (await res.json()) as {
        results?: Array<{
          _id: string;
          listingId: string;
          status: string;
          guest?: { fullName?: string };
          checkInDateLocalized: string;
          checkOutDateLocalized: string;
        }>;
      };

      const page = body.results ?? [];
      for (const r of page) {
        if (!activeStatuses.has(r.status)) continue;
        results.push({
          guestyId: r._id,
          listingId: r.listingId,
          status: r.status,
          guestName: r.guest?.fullName ?? null,
          checkIn: new Date(`${r.checkInDateLocalized}T00:00:00Z`).toISOString(),
          checkOut: new Date(`${r.checkOutDateLocalized}T00:00:00Z`).toISOString(),
        });
      }

      if (page.length < limit) break;
      skip += limit;
    }
  }

  return results;
}
