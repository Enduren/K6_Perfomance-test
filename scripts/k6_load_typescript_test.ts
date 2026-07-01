import http from 'k6/http';
import { check, sleep } from 'k6';
import { Options } from 'k6/options';

// Add environment variable to the test
const BASE_URL: string = __ENV.BASE_URL || 'https://test.k6.io';

export const options: Options = {
  stages: [
    { duration: '5m', target: 100 },  // Ramp-up: Smoothly scale from 0 to 100 users
    { duration: '10m', target: 100 }, // Sustain: Hold 100 users to look for degradation
    { duration: '5m', target: 0 },    // Ramp-down: Safely offload the traffic
  ],
  thresholds: {
    http_req_duration: ['p(95)<300'], // 95% of requests must complete under 300ms
    http_req_failed: ['rate<0.01'],   // Error rate must be less than 1%
  },
};

export default function (): void {
  // Simulating a typical user journey endpoint
  // Fixed: passing BASE_URL directly as a string instead of an object
  const res = http.get(BASE_URL);
  
  check(res, {
    'status is 200': (r) => r.status === 200,
    'transaction time OK': (r) => r.timings.duration < 500,
  });

  sleep(1); // Pacing: 1-second pause between user actions
}