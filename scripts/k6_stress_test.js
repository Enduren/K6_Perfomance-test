import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 100 },  // 1. Regular load
    { duration: '5m', target: 100 },
    { duration: '2m', target: 500 },  // 2. Stress: Ramp up to 5x normal load
    { duration: '5m', target: 500 },  //    Hold extreme load to observe failure points
    { duration: '2m', target: 1000 }, // 3. Breaking point: Push to absolute limits
    { duration: '5m', target: 1000 },
    { duration: '5m', target: 0 },    // 4. Recovery: Ramp down to see if services self-heal
  ],
  thresholds: {
    // Note: Thresholds are often relaxed during stress tests, 
    // but we track them to find exact failure timestamps.
    http_req_failed: ['rate<0.05'], // Expecting some failures, but alerting if > 5%
  },
};

export default function () {
  const payload = JSON.stringify({ item_id: 42, quantity: 1 });
  const params = {
    headers: { 'Content-Type': 'application/json' },
  };

  const res = http.post('https://api.example.com/v1/cart', payload, params);

  check(res, {
    'status is 201': (r) => r.status === 201,
  });

  sleep(1);
}