const http = require('http');

const data = JSON.stringify({
    fullName: "Debug User",
    age: 30,
    status: "new",
    unanswered_messages_hours: 0,
    incidents_last_7d: 0,
    routine_breaks_last_7d: 0,
    lives_alone: false,
    mobility_limitations: false,
    cognitive_difficulty_flag: false,
    incidents_severity_max_7d: null
});

const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/cases',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
        console.log(`BODY: ${chunk}`);
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

req.write(data);
req.end();
