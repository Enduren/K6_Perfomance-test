import http from 'k6/http';
import { sleep } from 'k6';
import {htmlReport} from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";


// This function is called at the beginning of the test, and it sets up the test configuration.
export const options = {
    vus: 10, // Number of virtual users
    duration: '30s', // Duration of the test
};

// This function is called for each virtual user, and it performs the actual test actions.

export default function () {
    http.get('https://test.k6.io');
    sleep(1);
}

// This function is called at the end of the test, and it generates an HTML report from the test data.
export function handleSummary(data) {
    return {
        "file.html": htmlReport(data)
    };
}