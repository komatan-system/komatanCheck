/**function schoolChange() {
  
  const school_id = INPUT_SHEET.getRange("A2").getValue();

  //教室IDが間違っているときにエラーを表示
  if (!School_Ids.includes(school_id)) {
    Logger.log("❌ 無効な教室IDです。関数は実行されません。");
    SpreadsheetApp.getUi().alert("⚠️ 該当する教室はありません");
    return;
  }

  PropertiesService.getScriptProperties().setProperty("schoolId", school_id.toString());

  drawStudentList();
  drawTeacherList();

}

function confirmAndRun() {
  const ui = SpreadsheetApp.getUi();

  const response = ui.alert(
    '確認',                          // タイトル
    'この処理を実行してよろしいですか？', // メッセージ
    ui.ButtonSet.YES_NO              // 「はい」「いいえ」ボタンを表示
  );

  if (response === ui.Button.YES) {
    schoolChange();
  }

}
*/