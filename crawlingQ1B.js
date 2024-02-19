const fs = require('fs');
const cheerio = require('cheerio');

// Function to extract data about each case from the saved result pages - the pages saved 
function extractCaseData(html) {
    const $ = cheerio.load(html);

    // Array to store case objects
    const cases = [];

    // Iterate over each case listing
    $('.case-listing').each((index, element) => {
        const caseData = {};

        // Extract all the data for each element
        caseData.title = $(element).find('.title').text().trim();
        caseData.case_number = $(element).find('.case-number').text().trim();
        caseData.judge = $(element).find('.judge').text().trim();
        caseData.court = $(element).find('.court').text().trim();
        caseData.parties = $(element).find('.parties').text().trim();
        caseData.advocates = $(element).find('.advocates').text().trim();
        caseData.citation = $(element).find('.citation').text().trim();
        caseData.date_delivered = $(element).find('.date-delivered').text().trim();
        caseData.URI = $(element).find('.read-more').attr('href');

        // Format date delivered
        const dateParts = caseData.date_delivered.split('/');
        const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
        caseData.date_delivered_formatted = formattedDate;

        // Use regex to extract plaintiff and defendant from parties string
        const partiesRegex = /(.+?)\s+(?:v\.|vs\.|versus)\s+(.+)/i;
        const partiesMatch = caseData.parties.match(partiesRegex);
        if (partiesMatch) {
            caseData.plaintiff = partiesMatch[1].trim();
            caseData.defendant = partiesMatch[2].trim();
        } else {
            caseData.plaintiff = null;
            caseData.defendant = null;
        }

        // Push case object to array
        cases.push(caseData);
    });

    return cases;
}

// Function to read and parse HTML files and extract case data
function extractCasesFromFiles() {
    const caseDataArray = [];

    try {
        // Loop through saved HTML files
        for (let page = 1; page <= 5; page++) {
            const html = fs.readFileSync(`crawling${page}.html`, 'utf8');
            const cases = extractCaseData(html);
            caseDataArray.push(...cases);
            console.log(`Cases extracted from page ${page}: ${cases.length}`);
        }

        // Write case data to JSON file
        fs.writeFileSync('cases.json', JSON.stringify(caseDataArray, null, 2));
        console.log('Case data saved to cases.json successfully.',caseDataArray);
    } catch (error) {
        console.error('Error occurred:', error);
    }
}

// Call the function to extract case data from saved files
extractCasesFromFiles();
