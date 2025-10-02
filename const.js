//教室ID
const SCHOOL_ID = 30235; //<-これを書き換えれば他の校舎の情報に更新可

//リンク
const STUDENTURL = `https://api.comiru.com/${SCHOOL_ID}/students`;
const TEACHERURL = `https://api.comiru.com/${SCHOOL_ID}/teachers`;
const SUBJECTURL = `https://api.comiru.com/${SCHOOL_ID}/subjects`;


//シート名
const SS = SpreadsheetApp.getActiveSpreadsheet();
const ACTIVE_SHEET = SS.getActiveSheet();
const INPUT_SHEET = SS.getSheetByName("コマ数検索");
const INPUT2_SHEET = SS.getSheetByName("コマ数検索２");
const STUDENT_LIST_SHEET = SS.getSheetByName("生徒リスト");
const TEACHER_LIST_SHEET = SS.getSheetByName("講師リスト");
const SUBJECT_LIST_SHEET = SS.getSheetByName("科目リスト");


