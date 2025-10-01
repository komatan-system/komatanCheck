// Comiruにアクセスするための関数：リストの取得に使用

function getList(url) {

  const scriptProperties = PropertiesService.getScriptProperties();
  const token = scriptProperties.getProperty('COMIRU_TOKEN');
  const options = {
    'method': 'get',
    'contentType': 'application/json',
    'headers': {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json',
    },
    'muteHttpExceptions': true
  };

  try {
    const response = UrlFetchApp.fetch(url, options);
    const responseCode = response.getResponseCode();
    const responseBody = response.getContentText();

    return responseBody;
  } catch (e) {
    Logger.log('❌ Error: ' + e.message);
  }

}







