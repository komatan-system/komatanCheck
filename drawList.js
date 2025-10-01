//　配列を実際にスプシに記入する関数：定期実行および手動での実行で更新

function drawStudentList() {

  const studentListData = toStudentList();
  Logger.log(studentListData);
  updateSheetContent(STUDENT_LIST_SHEET, studentListData);

}

function drawTeacherList() {

  const teacherListData = toTeacherList();
  updateSheetContent(TEACHER_LIST_SHEET, teacherListData);

}

//シートにリストを書き込む関数（生徒・講師リスト用）
function updateSheetContent(sheet, listData) {
  
  sheet.getRange(1, 1,500,2).clearContent();
  sheet.getRange("A1:B1").setValues([['ID', '名前']]);

  // columnStr は「除外IDリスト」の列のアルファベット
  const columnStr = "H"
  const excludeIdList = sheet
    .getRange(`${columnStr}2:${columnStr}`) // columnStrで指定した列の2行目以降を全て取得する
    .getValues()
    .filter((row) => typeof row[0] === "number") // 2行目以降を全て取得するために含まれる空の行を除外する
    .map((row) => row[0]); // .getValues() で取得できるのは values[row][column] の二重配列なので column=0 を指定して中身を取り出す

  // 情報をシートに一度に書き込むため、必要な情報だけを取り出す。
  const formattedData = listData
    .filter((data) => !excludeIdList.includes(data.id)) // 除外リストに含まれないdataだけをfilterする
    .map((data) => {
      Logger.log(JSON.stringify(data, null, 2));

      return [
        data.id,
        data.name,
      ]
    });  

  // dataリストを一括でシートに描画
  sheet
    .getRange(2, 1, formattedData.length, formattedData[0].length) // .getRange(row, column, numRows, numColumns)
    .setValues(formattedData);

}

function drawSubjectList(){

  const subjectListData = toSubjectList();
  Logger.log(subjectListData);

  const headers = ["科目名"];

  // 一度リストの内容を消して最初から書き直す
  SUBJECT_LIST_SHEET.clearContents();

  // ヘッダーを設定
  SUBJECT_LIST_SHEET
    .getRange(1, 1, 1, headers.length) // .getRange(row, column, numRows, numColumns)
    .setValues([headers]);

  // シートに書き込む際は[row][column]の二次元配列にする必要があるので.mapを用いて二次元配列に変換
  const formattedData = subjectListData.map((subject) => [subject]);

  // 科目リストを一括でシートに描画
  SUBJECT_LIST_SHEET
    .getRange(2, 1, formattedData.length, formattedData[0].length) // .getRange(row, column, numRows, numColumns)
    .setValues(formattedData);
}