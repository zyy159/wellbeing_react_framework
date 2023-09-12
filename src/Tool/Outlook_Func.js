export const Access_Token=()=>{
    const access_token = "EwB4A8l6BAAUAOyDv0l6PcCVu89kmzvqZmkWABkAATf2lksJBUT9g7/RWZXxWvpRKFv4PYaIm6ZNOn9zIPlBULMBiKZJINGJI8UeNH51Nv1EfEbR0S5dHvQf73dDbDHJBkTKy9rBSAvrNHH0LzyM9lnm1j6QizJ7oOXGXOrZjuxY3qCmq9i9D51fN/gWs1NAnphRA+uXv9pM2O/RylQ2VQuI170XAr2K26TgIzcedekJAqN8gmdRzLZz3nPAyRyWeI87iBNGUf3mrM9tN6aVP3ZQQLF3qUDzAd+CiIriS8176wwjs7y1SELEQjGeR46sWSvQqPIQjT2rVgsur0A9c0ipNHfqThf9iT7R5k1WbewaX+J7ELlapAnmKS7vWhQDZgAACHurXwVCsE2nSAKFXfLmXyatU3ZaS36lFewmxSa257I48+KE4CNcAf9IKe+lgQA4QHe5TmI1X9ggN9DKctK8SW8ZgPHnIbb9IhvQXP29kdtHAu0Vk6Wl9oWD635Wj6iAY6vfGB5z/xUgiejE8zFYZ0kaQjGO6XVjRHHbf3kvhDrbwBD/4GwNKRiwaRaBY41HHKYgXn4MFXZynk6m2NQrMF+utOPS39zyne4XLZewCtfcUDeebzr1GIBceOrplffh3oSS6s3G+OqRbqZI3GMSqsAOpCH5+znD1rRlA1zsdsrhA6IfJjTqIDU1O0pz+U0icot6dA6lbQw6a8hG2OCZMD74JjbejM6hSi+wjxOuhcxKUvZfUr05sMAsgjNt6TPef4/eICQCFfLKwwNS3Ze6Z5OBJiUSXgzsIStUFxK+tHByv87pBRj7GoRpKnopUnVHQ4TAeByRjAqr+9Pa2pdtlvI8ouSCVrQr2+xWFWn2iV22w9x7M8eTNU8sttigXrlUOEqJhMUNGzWYKsuJmvgU0dDwdVUE5ysC6qRxIvefPqBI4afaf2bplME21OO/7e/pdrzMad1IdWTGqWIvrp4h1roAQynaY0w8xo/awRAqP/hFEjJbbc+HgVkXKaHLKCLQEVut0kNITuARFx80dmIGkEDoGazQ9Z25EcRGHD6HjFE6tLtjBB2LtK0uzlPZ6teUhIMbU1RnCpDhYmiy18MhNsQeLI4ikz45rBcgTCPi7NPpydQVocQHrsJu22Pen6tkCreNCjlVhMFrMj5JhjUxbX8u6ZoC"
    return access_token
}

export const getAuthenticatedClient=(accessToken) =>{
    // Initialize Graph client
    const graph = require('@microsoft/microsoft-graph-client');
    const client = graph.Client.init({
        // Use the provided access token to authenticate
        // requests
        authProvider: (done) => {
            done(null, accessToken);
        }
    });
    return client;
}

export const Schedule=(accessToken, subject, attendee_mail, start_datetime, end_datetime, sport_link) =>{
    try {
        const client = getAuthenticatedClient(accessToken);
        const event = {
            subject: subject,
            start: {dateTime: start_datetime, timeZone: 'Hong Kong'},
            end: {dateTime: end_datetime, timeZone: 'Hong Kong'},
            location: {displayName: sport_link},
            attendees: [{emailAddress: {address: attendee_mail}, type: 'required'}],
            allowNewTimeProposals: true
        };
        let result = client.api('/me/events').header('Prefer',`outlook.timezone="Hong Kong"`).post(event);
        // let response = new ResponseInfo(200, result, '');
        return result;
    }catch (error) {
        // let response = new ResponseInfo(400,'',error);
        return "Error";
    }
}