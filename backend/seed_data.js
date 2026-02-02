const http = require('http');

const cases = [
    {
        fullName: 'Juan Pérez (Alto Riesgo)',
        age: 70,
        unanswered_messages_hours: 48,
        incidents_last_7d: 3,
        routine_breaks_last_7d: 2,
        lives_alone: true,
        notes: 'Caso de prueba alto riesgo'
    },
    {
        fullName: 'Maria Garcia (Riesgo Medio)',
        age: 65,
        unanswered_messages_hours: 12,
        incidents_last_7d: 1,
        mobility_limitations: true,
        notes: 'Caso de prueba riesgo medio'
    },
    {
        fullName: 'Carlos Lopez (Bajo Riesgo)',
        age: 50,
        unanswered_messages_hours: 0,
        incidents_last_7d: 0,
        notes: 'Caso de prueba bajo riesgo'
    }
];

const postData = (data) => {
    const postData = JSON.stringify(data);
    const options = {
        hostname: 'localhost',
        port: 3001,
        path: '/api/cases',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    };

    const req = http.request(options, (res) => {
        console.log(`STATUS: ${res.statusCode}`);
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`);
        });
        res.on('end', () => {
            console.log('No more data in response.');
        });
    });

    req.on('error', (e) => {
        console.error(`problem with request: ${e.message}`);
    });

    req.write(postData);
    req.end();
};

cases.forEach((c, index) => {
    setTimeout(() => {
        console.log(`Posting case ${index + 1}...`);
        postData(c);
    }, index * 500);
});
