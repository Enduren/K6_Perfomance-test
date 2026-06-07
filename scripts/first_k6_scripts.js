// Import the http module from the k6 library, which is used to make HTTP requests in the test.+
import http from 'k6/http';

// Import the sleep function from the k6 library, which is used to pause the execution of the test for a specified amount of time.
import { sleep,check } from 'k6';

// Import the htmlReport function from the k6-reporter library, which is used to generate an HTML report from the test data.
import {htmlReport} from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

//add enivronment variable to the test
const BASE_URL = __ENV.BASE_URL || 'https://test.k6.io'; // Use the environment variable or default to 'https://test.k6.io'

// This function is called at the beginning of the test, and it sets up the test configuration.
export const options = {
    vus: 10, // Number of virtual users
    duration: '10s', // Duration of the test

    thresholds: {
        http_req_duration: ['p(95)<500'], // 95% of requests should complete within 500ms
    },
};

// This function is called for each virtual user, and it performs the actual test actions.

export default function () {
    // Make an HTTP GET request to the specified URL and store the response in a variable called response.
    const response= http.get(BASE_URL);
    
    // Check if the response status is 200, which indicates that the request was successful. If the check fails, it will be recorded in the test results.
    check(response, {        
        'is status 200': (r) => r.status === 200,
    });
    sleep(1);
}

// This function is called at the end of the test, and it generates an HTML report from the test data.
// export function handleSummary(data) {
//     return {
//         "file.html": htmlReport(data)
//     };
// }

// k6 run scripts/first_k6_scripts.js   