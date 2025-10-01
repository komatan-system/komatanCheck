//　条件を入れてAPIから情報を取得する関数

function callSeatApi() {

  const studentId = getStudentIDFromSS();
  const teacherId = getTeachcerIDFromSS();

  const range = getDate();
  if (!range) return; // getDate内でalert済み。ここで終了。

  const {
    startDateFormatted: start_date, 
    endDateFormatted: end_date
  } = range;

  Logger.log(studentId)
  Logger.log(teacherId)

  const baseUrl = `https://api.comiru.com/${SCHOOL_ID}/seats`; // APIのエンドポイント
  const payload = {
    "student_id": studentId,
    "teacher_id": teacherId,
    "type": 0,
    "start_date": start_date,
    "end_date": end_date,
    "page": 0,
  };


  const query = Object.entries(payload)
    .filter(([_, v]) => v != null)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&');


  const url = `${baseUrl}?${query}`;

  const scriptProperties = PropertiesService.getScriptProperties();
  const token = scriptProperties.getProperty('COMIRU_TOKEN');
  const options = {
    'method': 'get',
    'contentType': 'application/json',
    'headers': {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    },
    'muteHttpExceptions': true // エラー時にもレスポンスを取得
  };


  try {
    const response = UrlFetchApp.fetch(url, options);
    const responseCode = response.getResponseCode();
    const responseBody = response.getContentText();
     
    return responseBody;
  } catch (e) {
    Logger.log('Error: ' + e.message);

  }

}
