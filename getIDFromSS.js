//スプシから検索する講師・生徒名を取得 -> リストから一致する名前を探してIDを返す関数

function getStudentIDFromSS() {

  // 入力された生徒名を取得
  const studentName = ACTIVE_SHEET.getRange("A2").getValue().toString().trim();

  if (!studentName) {
    Logger.log("❌ 生徒名が入力されていません");
    return;
  }

  const studentData = STUDENT_LIST_SHEET.getDataRange().getValues(); // 2次元配列で全体を取得
  let studentId = null; // 見つけたIDを保存する変数

  // 各行をループして、生徒名が一致する行を探す
  for (let i = 1; i < studentData.length; i++) { 
    const studentNameInList = studentData[i][1].toString().trim(); // 生徒名を取得

    if (studentNameInList === studentName) {
      studentId = studentData[i][0]; //生徒IDを取得
      break; 
    }

  }

  if (studentId !== null) {
    Logger.log("✅ 生徒IDを保存しました: " + studentId);
  } else {
    Logger.log("⚠️ 一致する生徒名が見つかりませんでした");
  }

  return studentId;

}

function getTeachcerIDFromSS(){

  // 入力された講師名を取得
  const teacherName = ACTIVE_SHEET.getRange("B2").getValue().toString().trim();

  if (!teacherName) {
    Logger.log("❌ 講師名が入力されていません");
    return;
  }

  const data = TEACHER_LIST_SHEET.getDataRange().getValues(); // 2次元配列で全体を取得
  let teacherId = null; // 見つけたIDを保存する変数

  // 各行をループして、講師名が一致する行を探す
  for (let i = 1; i < data.length; i++) { // i=1は2行目から（1行目は見出し）
    const nameInList = data[i][1].toString().trim(); // B列（列番号1）から名を講師名取得

    if (nameInList === teacherName) {
      teacherId = data[i][0]; // 講師IDを取得
      break; 
    }

  }

  if (teacherId !== null) {
    Logger.log("✅ 講師IDを保存しました: " + teacherId);
  } else {
    Logger.log("⚠️ 一致する講師名が見つかりませんでした");
  }

  return teacherId;

}
