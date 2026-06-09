import http from 'k6/http';
import { check, sleep } from 'k6';
// Import the htmlReport function from the k6-reporter library, which is used to generate an HTML report from the test data.
import {htmlReport} from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

//add enivronment variable to the test
const BASE_URL = __ENV.BASE_URL || 'https://test.k6.io';

export const options = {
    stages: [
        { duration: '10s', target: 10 }, // Low baseline operational check
        { duration: '20s', target: 500 }, // Extreme Surge: Instant escalation to 500 VUs
        { duration: '1m', target: 500 }, // Maintain load to watch resource contention
        { duration: '20s', target: 10 }, // Fast cool-down signature
        { duration: '30s', target: 0 },
    ],
    thresholds: {
        'http_req_duration': ['p(95)<1500'], // Wider latency margin allowed during spike
        'http_req_failed': ['rate<0.05'], // Strict rejection ceiling of 5% error max
    },
};
export default function () {
    let response = http.get(BASE_URL);
    check(response, {
        // 429 Too Many Requests is a passing condition if testing edge rate-limit safety
        'status is 200 or 429': (r) => r.status === 200 || r.status === 429,
    });
    sleep(1);
}

// This function is called at the end of the test, and it generates an HTML report from the test data.
export function handleSummary(data) {
    return {
        "spikeTestReport.html": htmlReport(data)
    };
}

// k6 run scripts/k6_spike_test.js