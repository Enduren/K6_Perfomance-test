import http, { RefinedResponse, ResponseBody } from 'k6/http';
import { check, sleep } from 'k6';
import { Options } from 'k6/options';
// @ts-ignore - Importing directly from a remote URL requires bypassing TS compiler checks
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

// Environment variable with a fallback string
const BASE_URL: string = __ENV.BASE_URL || 'https://restful-booker.herokuapp.com';

// Define the options for the k6 test, including stages and thresholds
export const options: Options = {
    stages: [
            { duration: '1m', target: 100 }, // Deliberate, smooth scaling up to operational state
            { duration: '2m', target: 100 }, // Soak: Extended 4-hour execution window
            { duration: '2m', target: 0 }, // Gradual scale-down
        ],
        thresholds: {
        'http_req_duration': ['p(99)<800'], // Validate latency does not degrade over time
        },

}


export default function (): void {
 
     let params = { headers: { 'Authorization': 'Bearer YWRtaW46cGFzc3dvcmQxMjM=' } };
     let res = http.get(BASE_URL + '/booking', params);
     check(res, { 'status is 200': (r) => r.status === 200 });
     sleep(5); 
     // Controlled loop pacing to preserve structural stability
}

//k6 run scripts/k6_soak_typescript_test.ts