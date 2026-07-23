import http from 'k6/http';
import { browser } from 'k6/browser';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

export const errorRate = new Rate('errors');

export const options = {
  scenarios: {
    api_load: {
      executor: 'ramping-vus',
      stages: [
        { duration: '10s', target: 10 },
        { duration: '10s', target: 10 },
        { duration: '5s', target: 0 },
      ],
      gracefulRampDown: '5s',
      tags: { test_type: 'api' }
    },
    browser_load: {
      executor: 'constant-vus',
      vus: 3,
      duration: '10s',
      tags: { test_type: 'browser' },
      exec: 'browserTest',
      options: {
        browser: {
          type: 'chromium',
        },
      },
    }
  },
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
    errors: ['rate<0.05']
  }
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
export async function browserTest() {
  const page = await browser.newPage();

  try {
    await http.get('https://test.k6.io/');
   console.log('Opening https://test.k6.io/')
  }
  finally {
    await page.close();
  }
}