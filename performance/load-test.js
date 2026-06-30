import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const errorRate = new Rate('errors');

export const options = {
  stages: [
    { duration: '10s', target: 10 },  // ramp up to 50 VUs
    { duration: '10s', target: 10 },   // hold at 50 VUs
    { duration: '5s', target: 0 },   // ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests under 500ms
    http_req_failed: ['rate<0.01'],   // less than 1% failures
    errors: ['rate<0.05'],            // custom error rate under 5%
  },
};

export default function () {
  const res = http.get('https://test.k6.io/');

  const ok = check(res, {
    'status is 200': (r) => r.status === 200,
    'body is not empty': (r) => r.body && r.body.length > 0,
  });

  errorRate.add(!ok);
  sleep(1);
}