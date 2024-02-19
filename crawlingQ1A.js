const axios = require('axios');
const fs = require('fs');
const { data } = require('jquery');

// Function to format date as YYYY-MM-DD -ISO format
function formatDate(date) {
    return date.toISOString().split('T')[0];
}

// Function to perform search and save result pages
async function searchAndSaveResults() {
    const deliveryDateRange = {
        from: '2022-01-01',
        to: '2022-01-31'
    };

    const baseUrl = 'http://kenyalaw.org/caselaw/cases/advanced_search/';

    try {
        // Loop through first 5 pages
        for (let page = 1; page <= 5; page++) {
            const searchUrl = `${baseUrl}?page=${page}&from=${deliveryDateRange.from}&to=${deliveryDateRange.to}`;
            const response = await axios.get(searchUrl);
            const html = response.data;

            // Save HTML to file
            fs.writeFileSync(`crawling${page}.html`, html);
            console.log(`Page ${page} saved successfully.`, html);
        }
    } catch (error) {
        console.error('Error occurred:', error);
    }
}

// save the results
searchAndSaveResults();







