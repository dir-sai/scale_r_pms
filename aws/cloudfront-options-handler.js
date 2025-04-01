function handler(event) {
    var request = event.request;
    var headers = request.headers;
    
    // Handle OPTIONS preflight requests
    if (request.method === 'OPTIONS') {
        var response = {
            statusCode: 200,
            statusDescription: 'OK',
            headers: {
                'access-control-allow-methods': { value: 'GET, HEAD, OPTIONS' },
                'access-control-allow-headers': { value: '*' },
                'access-control-allow-origin': { value: request.headers.origin.value },
                'access-control-max-age': { value: '3600' },
                'access-control-expose-headers': { value: 'ETag' }
            }
        };
        return response;
    }
    
    return request;
}