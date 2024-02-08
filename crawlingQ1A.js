  const axios = require('axios');
  const FormData = require('form-data');
  var fs = require('fs');

  let data = new FormData();
  data.append('court[]', '190000');
  data.append('date_from', '01 Jan 2022');
  data.append('date_to', '31 Dec 2022');
  data.append('submit', 'Search');
  
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'http://kenyalaw.org/caselaw/cases/advanced_search/page/40',
    headers: { 
      'Cookie': 'cisession=a%3A4%3A%7Bs%3A10%3A%22session_id%22%3Bs%3A32%3A%223bcc74436702aea8fa91405e9f4c25cb%22%3Bs%3A10%3A%22ip_address%22%3Bs%3A15%3A%22192.168.100.101%22%3Bs%3A10%3A%22user_agent%22%3Bs%3A21%3A%22PostmanRuntime%2F7.36.1%22%3Bs%3A13%3A%22last_activity%22%3Bi%3A1707241108%3B%7D42837053da57cfc270440ae5466edbcd', 
      ...data.getHeaders()
    },
    data : data
  };
  
  axios.request(config)
  .then((response) => {
    console.log('Response data::', response.data)
    // console.log(JSON.stringify(response.data));
    fs.appendFile('Crawling.html', response.data, function(err){
      if(err) throw err;
      console.log('Saved');
    })

  })
  .catch((error) => {
    console.log(error);
  });