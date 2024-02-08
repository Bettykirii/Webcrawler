const cheerio = require("cheerio");
const pretty = require("pretty");


var fs = require('fs');



var $ = cheerio.load(fs.readFileSync('Crawling.html'));
// console.log(parsedHtmlPage.html());

var caseObjects = []

// const listItems = $("html body body-section .container .row .span9 #myTabContent.tab-content.minecontent #google-search.tab-pane.fade.active.in .post ");
 $(".post").each((index, element) => {
    // console.log($($(element).find("td")[0]).text());

    var caseObject = {};
    const ths = $(element).find(".t_full");
    // console.log("Ths",ths.html().trim())
    const h2 = $(ths).find("h2").text();
    caseObject["title"] = h2;
    // console.log("H2", h2.text());
    
    const caseNumber = $(ths).find(".case-number").text();
    const caseNumberSpan = $(ths).find(".case-number > span:nth-child(1)").text();
    caseObject["case_number"] = caseNumber.replace(caseNumberSpan, "");
    
    const dateDelivered = $(ths).find(".date-delivered").text();
    const dateDeliveredSpan = $(ths).find(".date-delivered > span:nth-child(1)").text();
    caseObject["date_delivered"] = dateDelivered.replace(dateDeliveredSpan, "");

    const pTags = $(element).find("p");
    const caseDetailHeaders = ["judge","court","parties","plaintiff","defendant","advocates", "citation","date_delivered_formatted"];
    //  console.log ("This is P",pTags.text());
    $(pTags).each((index, pTag) =>{
        const span = $(pTag).find('span:nth-child(1)').text();
        console.log("span: ", span);
        const jsonVal = $(pTag).text().replace(span, "").replace("\n", "");
        console.log(jsonVal);

        caseObject[caseDetailHeaders[index]] = jsonVal.replace("\t \n", " ");
   });

   caseObjects.push(caseObject);
   console.log("Cases\n");
   console.log("Case: ", caseObjects);
});


