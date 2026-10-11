export async function publicFetch(url: string, options: any = {}) {
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...cleanHeaders,
      ...(options.headers || {}),
    },
    ...options,
  });

  const raw = await res.text();

  let data: any = {};

  if (raw.trim().length > 0) {
    try {
      data = JSON.parse(raw);
    } catch {
      throw new Error(`INVALID_JSON_RESPONSE: ${raw}`);
    }
  }

  if (!res.ok) {
    throw {
      message: data?.message || 'REQUEST_FAILED',
      code: data?.code || null,
    };
  }

  return data;
}
