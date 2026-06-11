import http from 'k6/http';
import { check, sleep } from 'k6';
    export const options = {
        stages: [
            { duration: '1m', target: 100 }, // Deliberate, smooth scaling up to operational state
            { duration: '2m', target: 100 }, // Soak: Extended 4-hour execution window
            { duration: '2m', target: 0 }, // Gradual scale-down
        ],
        thresholds: {
        'http_req_duration': ['p(99)<800'], // Validate latency does not degrade over time
        },
    };
    export default function () {
        // Simulating authenticated tracking and analytics data pull
        let params = { headers: { 'Authorization': 'Bearer YWRtaW46cGFzc3dvcmQxMjM=' } };
        let res = http.get('https://restful-booker.herokuapp.com/booking', params);
        check(res, { 'status is 200': (r) => r.status === 200 });
        sleep(5); // Controlled loop pacing to preserve structural stability
    }

    //k6 run scripts/k6_soak_test.js