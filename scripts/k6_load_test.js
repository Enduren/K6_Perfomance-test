import http from 'k6/http';
import { check, sleep } from 'k6';

//add enivronment variable to the test
const BASE_URL = __ENV.BASE_URL || 'https://test.k6.io';

export const options = {
  stages: [
    { duration: '5m', target: 100 }, // Ramp-up: Smoothly scale from 0 to 100 users
    { duration: '10m', target: 100 }, // Sustain: Hold 100 users to look for degradation
    { duration: '5m', target: 0 },   // Ramp-down: Safely offload the traffic
  ],
  thresholds: {
    http_req_duration: ['p(95)<300'], // 95% of requests must complete under 300ms
    http_req_failed: ['rate<0.01'],    // Error rate must be less than 1%
  },
};

export default function () {
  // Simulating a typical user journey endpoint
  const res = http.get({BASE_URL});
  
  check(res, {
    'status is 200': (r) => r.status === 200,
    'transaction time OK': (r) => r.timings.duration < 500,
  });

  sleep(1); // Pacing: 1-second pause between user actions
}