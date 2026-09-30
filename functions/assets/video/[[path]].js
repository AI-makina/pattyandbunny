// Cloudflare Pages answers Range requests for static files with 200 and the
// whole file, but iPhone Safari only plays video from servers that return the
// requested byte range (206). Serve everything under /assets/video/ with ranges.
export async function onRequestGet({ request, env }) {
    var asset = await env.ASSETS.fetch(request.url);
    var range = /^bytes=(\d*)-(\d*)$/.exec(request.headers.get('Range') || '');
    if (!range || asset.status !== 200) return asset;

    var body = await asset.arrayBuffer();
    var size = body.byteLength;
    var start = range[1] === '' ? size - Number(range[2]) : Number(range[1]);
    var end = range[1] === '' || range[2] === '' ? size - 1 : Math.min(Number(range[2]), size - 1);
    if (!(start >= 0 && start <= end)) {
        return new Response(null, { status: 416, headers: { 'Content-Range': 'bytes */' + size } });
    }

    var headers = new Headers(asset.headers);
    headers.set('Accept-Ranges', 'bytes');
    headers.set('Content-Range', 'bytes ' + start + '-' + end + '/' + size);
    headers.set('Content-Length', String(end - start + 1));
    return new Response(body.slice(start, end + 1), { status: 206, headers: headers });
}
