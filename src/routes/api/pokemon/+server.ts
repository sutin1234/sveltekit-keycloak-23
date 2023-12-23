import { fail, json } from "@sveltejs/kit";

export async function GET(event) {
    const resp = await fetch('https://pokeapi.co/api/v2/ability/?limit=20&offset=20')
    if (!resp.ok) {
        fail(500, { message: 'connot fetch data' })
    }
    const data = await resp?.json()
    event.setHeaders({
        'sveltekitResponse': 'true',
        'Cache-Control': 'max-age=60'
    })
    return json({ data: data })
}
