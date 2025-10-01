// スプシに授業情報を実際に記入する関数

function drawStudentCalendar2() {

  // すでに記載されている情報を削除
  const lastRow = INPUT2_SHEET.getLastRow();
  const numRows = lastRow - 4;

  if (numRows > 0) {
    INPUT2_SHEET.getRange(5, 1, numRows, 15).clearContent();
  } else {
    Logger.log("🟡 消すべき行がありません（3行目以下が空）");
  }

 /**指定の科目の授業がない -> classInformationがundefined
  * undefinedだけ弾く
  */
  
  const checkData = getSeat2();

  if(checkData === undefined) return;

  const {
    calssInformation: classData,
    subjectRows: subjectRows,
    timeRows : timeRows
  } = checkData;

  Logger.log('科目：' + JSON.stringify(subjectRows));
  Logger.log('時間：' + JSON.stringify(timeRows));

  const values = classData.map(row => [
    row.date,
    row.time,
    row.start_time,
    row.end_time,
    row.class_time,
    row.teacher,
    row.student,
    row.subject,
    row.absent ? "欠席" : "出席"
  ]);

  const fontColors = classData.map(row => [
    "", "", "", "", "", "","","", row.absent ? "#f44336" : "#4caf50"
  ]);

  //表への書き出し：授業情報

  INPUT2_SHEET.getRange(5, 1, values.length, 9).setValues(values);
  INPUT2_SHEET.getRange(5, 1, values.length, 9).setFontColors(fontColors);

  //表への書き出し：カウント (6行目のvaluesの項目数から1列空けた2列目に書き出し)

  let drawRow = 6; //　<-　書き出しのスタート行
  INPUT2_SHEET.getRange(drawRow++, values[0].length + 2, subjectRows.length, subjectRows[0].length).setValues(subjectRows);
  INPUT2_SHEET.getRange(drawRow + subjectRows.length, values[0].length + 2 ,timeRows.length, timeRows[0].length).setValues(timeRows);

}
