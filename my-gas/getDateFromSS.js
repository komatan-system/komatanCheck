//　スプシから検索条件を受け取る関数

function getDate() {

  const startDate = INPUT_SHEET.getRange("C2").getValue();
  const endDate = INPUT_SHEET.getRange("D2").getValue();


  // 🔸 未入力チェック（Date でない場合は未入力とみなす）
  if (!(startDate instanceof Date) || !(endDate instanceof Date)) {
    SpreadsheetApp.getUi().alert("開始日または終了日が未入力か、日付形式ではありません");
    return;
  }

  // 🔸 日付の順序チェック
  if (startDate > endDate) {
    SpreadsheetApp.getUi().alert("開始日が終了日より後になっています");
    return;
  }

  // 🔸 範囲チェック（190日以内）
  const diffInDays = (endDate - startDate) / (1000 * 60 * 60 * 24);
  if (diffInDays > 190) {
    SpreadsheetApp.getUi().alert("範囲が広すぎます（6か月以内にしてください）");
    return;
  }

  const startDateFormatted = formatDate(startDate); // 例："2025-06-07"
  const endDateFormatted = formatDate(endDate);

  Logger.log(`開始時間：${startDateFormatted}、終了時間：${endDateFormatted}`);

  return {startDateFormatted, endDateFormatted};

}

//スプシから得られる日付を"yyyy-MM-dd"になおす関数

function formatDate(date) {
  return Utilities.formatDate(date, Session.getScriptTimeZone(), "yyyy-MM-dd");
}

//科目の取得

function getSubject(){

  const subjectFromSS = INPUT_SHEET.getRange("E2").getValue();

  if (!subjectFromSS) {
    Logger.log("❌ 科目が入力されていません");
  } else {
    Logger.log(subjectFromSS);
  }
  
  return subjectFromSS;

}

//曜日の取得

function getDayWeek(){

  const dayWeekFromSS = INPUT_SHEET.getRange("E2").getValue();

  if (!dayWeekFromSS) {
    Logger.log("❌ 科目が入力されていません");
  } else {
    Logger.log(dayWeekFromSS);
  }
  
  return dayWeekFromSS;

}


//科目の取得

function getSubject(){

  const subjectFromSS = INPUT_SHEET.getRange("F2").getValue();

  if (!subjectFromSS) {
    Logger.log("❌ 科目が入力されていません");
  } else {
    Logger.log(subjectFromSS);
  }
  
  return subjectFromSS;

}
