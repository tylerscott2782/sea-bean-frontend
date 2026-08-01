const MAX_TRIES = 10

export default async function fetchRetry(...params) {
    let response = null;
    let tries = 0;
    while ((response === null || response.status === 502) && tries <= MAX_TRIES) {
        response = await fetch(...params)
        tries += 1
    }
    return response
}