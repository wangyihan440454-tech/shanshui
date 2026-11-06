const forecastUrl = 'https://api.open-meteo.com/v1/forecast?latitude=34.5223&longitude=110.0831&current=temperature_2m,shortwave_radiation,cloud_cover&timezone=UTC';

export async function onRequestGet() {
    try {
        const response = await fetch(forecastUrl, { signal: AbortSignal.timeout(12000) });
        if (!response.ok) throw new Error('Weather provider unavailable');

        const forecast = await response.json();
        const temperature = forecast.current?.temperature_2m;
        const timestamp = Date.parse(forecast.current?.time + 'Z');
        if (!Number.isFinite(temperature) || !Number.isFinite(forecast.elevation) || !Number.isFinite(timestamp)) {
            throw new Error('Incomplete weather data');
        }

        return Response.json({
            temperature_c: temperature,
            elevation_m: forecast.elevation,
            observed_at: new Date(timestamp).toISOString(),
            shortwave_radiation_wm2: Number.isFinite(forecast.current?.shortwave_radiation) ? forecast.current.shortwave_radiation : null,
            cloud_cover_percent: Number.isFinite(forecast.current?.cloud_cover) ? forecast.current.cloud_cover : null,
        }, { headers: { 'Cache-Control': 'public, max-age=300' } });
    } catch {
        return Response.json({ error: 'Weather data unavailable' }, { status: 503 });
    }
}
