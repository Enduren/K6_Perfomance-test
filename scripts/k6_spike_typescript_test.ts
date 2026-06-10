import http, { RefinedResponse, ResponseBody } from 'k6/http';
import { check, sleep } from 'k6';
import { Options } from 'k6/options';
// @ts-ignore - Importing directly from a remote URL requires bypassing TS compiler checks
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

// Environment variable with a fallback string
const BASE_URL: string = __ENV.BASE_URL || 'https://test.k6.io';

// Define the options for the k6 test, including stages and thresholds
export const options: Options = {
    stages: [
        { duration: '10s', target: 10 }, 
        { duration: '20s', target: 500 }, 
        { duration: '1m', target: 500 }, 
        { duration: '20s', target: 10 }, 
        { duration: '30s', target: 0 },
    ],
    thresholds: {
        'http_req_duration': ['p(95)<1500'], 
        'http_req_failed': ['rate<0.05'], 
    },
};

export default function (): void {
 
    const response = http.get(BASE_URL);
    
    check(response, {
        'status is 200 or 429': (r) => r.status === 200 || r.status === 429,
    });
    
    sleep(1);
}

// Function to generate an HTML report from the test results
export function handleSummary(data: any): { [key: string]: string } {
    return {
        "spikeTestTypescriptReport.html": htmlReport(data)
    };
}

// k6 run scripts/k6_spike_typescript_test.ts