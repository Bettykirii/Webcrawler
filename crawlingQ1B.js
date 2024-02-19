const fs = require('fs');
const cheerio = require('cheerio');

// Function to extract data about each case from the saved result pages - the pages saved 
function extractCaseData(html) {
   const $ = cheerio.load(html);

   // Array to store case objects
   const cases = [];

   // Iterate over each case listing
   $('.post').each((index, element) => {
      const caseData = {};
      
      const ths = $(element).find(".t_full");

      // Extract all the data for each element
      caseData.title = $(ths).find('h2').text().trim();
      caseData.case_number = $(ths).find('.case-number').text().trim();
      const pTags = $(element).find("p");
      
      //console.log("This Ptags.....",pTags.text())
      caseData.date_delivered = $(element).find('.date-delivered').text().trim();
      // Format date delivered
      const dateParts = caseData.date_delivered.split('/');
      const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
      caseData.date_delivered_formatted = formattedDate;

      caseData.URI = $(element).find('.show-more').attr('href');

      

      const caseDetailHeaders = ["judge","court","parties","advocates", "citation"];

   $(pTags).each((index, pTag) =>{
     // console.log("This Ptags.....", pTag.text())
      const span = $(pTag).find('span:nth-child(1)').text();
      // console.log("span: ", span);
      const jsonVal = $(pTag).text().replace(span, "").replace("\n", "");
      // console.log(jsonVal);
      caseData[caseDetailHeaders[index]] = jsonVal.replace("\t \n", " ");


      
      
   });
      
      // Use regex to extract plaintiff and defendant from parties string
      const partiesRegex = /(.+?)\s+(?:v.\|vs.\|versus)\s+(.+)/i;
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
