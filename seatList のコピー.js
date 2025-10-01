//　APIから取得した情報をオブジェクト化し、カウントを行い、再び配列になおす関数

function getSeat2() {

  const resApi = callSeatApi2();
  if (!resApi) return;  

  const subjectFromSS = getSubject2();
  Logger.log(subjectFromSS);

  const parsedJson = JSON.parse(resApi);
  Logger.log(parsedJson);

  // 🔸 未入力チェック（Date でない場合は未入力とみなす）
  if (parsedJson.total >= 500) {
    SpreadsheetApp.getUi().alert("データが多すぎます。検索範囲を小さくしてください");
    return;
  }

  // ✅　授業情報取得
  const calssInformation = [];

  //カウント用オブジェクト
  const subjectSummary = {};
  const timeSummary = {};

  //カウント＆オブジェクト化

  for (const entry of parsedJson.data) {

    const date = entry.date;
    
    for (const seat of entry.seats) {

      const start_time = seat.start_time;
      const end_time = seat.end_time;
      const teacher_name = seat.teacher.name;
      const time = returnPeriodTime(start_time, end_time);

      const diff = diffMinutes(start_time, end_time) + "分";

      for (const student of seat.seat_students) {

        const student_name = student.student_name;
        const subject = student.subject ?? seat.subject ?? '未設定';
        const absent = student.absent;

        if(subjectFromSS === ""){

          bump(subjectSummary, subject, absent);
          bump(timeSummary, diff, absent);
          
          calssInformation.push({
            date: date,
            time: time, 
            start_time: start_time,
            end_time: end_time,
            class_time : diff, 
            teacher: teacher_name,
            student: student_name,
            subject: subject,
            absent: absent
          });
        
        } else {

          if(subject !== subjectFromSS) continue;

          bump(subjectSummary, subject, absent);
          bump(timeSummary, diff, absent);
          
          calssInformation.push({
            date: date,
            time: time, 
            start_time: start_time,
            end_time: end_time,
            class_time : diff, 
            teacher: teacher_name,
            student: student_name,
            subject: subject,
            absent: absent
          });

        };

      };

    };
  };

    // 左側：科目別
  const subjectRows = createRows(
    subjectSummary,
    ['📚科目', '✅出席数', '❌欠席数'],
    { keySort: (a,b)=>a.localeCompare(b,'ja') }
  );

  // 右側：時間別（分の数値で昇順、表示時だけ「分」を付ける）
  const timeRows = createRows(
    timeSummary,
   ['⏱授業時間', '✅出席数', '❌欠席数'],
    { keySort: (a,b)=>Number(a)-Number(b)}
  );


  // 🔸 科目チェック
  if (calssInformation.length === 0) {
    SpreadsheetApp.getUi().alert("指定の科目の授業はありません。科目を修正してください。");
    return;
  }

  Logger.log("検索数："+ JSON.stringify(calssInformation.length));
  Logger.log(JSON.stringify(subjectRows));  
  Logger.log(JSON.stringify(timeRows));
  
  return {calssInformation, subjectRows, timeRows};

}

//　分換算になおす関数
function toMinutes(t) {
  const [h, m = 0] = String(t).split(':').map(Number);
  return (h * 60) + m;
}

/** 開始/終了の差（分；日またぎ対応） */
function diffMinutes(start, end) {
  let d = toMinutes(end) - toMinutes(start);
  if (d < 0) d += 24 * 60;
  return d;
}

/** カウント用：summary[key] の 出席/欠席 を1つ増やす */
function bump(summary, key, absent) {
  const k = String(key);
  if (!summary[k]) {
  summary[k] = { '出席': 0, '欠席': 0 };
  }
  const rec = summary[k];
  if (absent) rec['欠席']++; else rec['出席']++;
}

/**
 * 合計のカウントと2次配列になおす関数
 * 汎用フラッシュ：summary({key:{出席,欠席}}) を表に
 * - header: ['見出し','出席','欠席']
 * - options.keySort: キー配列のソート関数
 * - options.keyDisplay: キー表示整形（例: k => `${k}`）
 */
function createRows(summary, header, options = {}) {

  const keySort = options.keySort || ((a,b)=>a.localeCompare(b,'ja'));
  const keyDisplay = options.keyDisplay || (k=>k);

  const keys = Object.keys(summary).sort(keySort);

  const rows = [header];
  let totalAttend = 0, totalAbsent = 0;

  for (const k of keys) {
    const attend = Number(summary[k]?.出席 ?? 0) || 0;
    const absent = Number(summary[k]?.欠席 ?? 0) || 0;
    rows.push([keyDisplay(k), attend, absent]);
    totalAttend += attend;
    totalAbsent += absent;
  }
  rows.push(['- 合計 -', totalAttend, totalAbsent]);

  return rows
}

//時限を判定する関数
function returnPeriodTime(start_time,end_time) {

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const day = today.getDay();

  const start = start_time.split(":").map(Number);
  const end = end_time.split(":").map(Number);

  const startDate = new Date(year,month,day,start[0],start[1]);
  const endDate = new Date(year,month,day,end[0],end[1]);

  const duration = endDate-startDate;

  if(duration/(1000*60) == 45){
    const periodObject = {
    "09:00": "1限前",
    "09:45": "1限後",
    "10:45": "2限前",
    "11:30": "2限後",
    "13:15": "3限前",
    "14:00": "3限後",
    "15:00": "4限前",
    "15:45": "4限後",
    "16:45": "5限前",
    "17:30": "5限後",
    "18:30": "6限前",
    "19:15": "6限後",
    "20:15": "7限"
    }
    const period = periodObject[start_time];
    if(period != null){
      return period;
    } else{
      return "特別";
    }
  }
  else{
    const periodObject = {
      "09:00": "1限",
      "10:45": "2限",
      "13:15": "3限",
      "15:00": "4限",
      "16:45": "5限",
      "18:30": "6限",
      "20:15": "7限"
    };

    const period = periodObject[start_time];
    if(period != null){
      return period;
    } else{
      return "特別";
    }
  }

}

/** カウントのために使っていたもの：科目リストから作成していたため変更 
 * 
✅ 欠席数・出席数のカウント変数
  let absentCount = 0;
  let attendCount = 0;

  // ✅ 科目ごとのカウント用オブジェクト（初期化）←あったら書いてカウント
  let subjectAbsentCounts = {};
  SUBJECT_LIST.forEach(sub => subjectAbsentCounts[sub] = 0);

    // ✅ 科目ごとのカウント用オブジェクト（初期化）
  let subjectAttendCounts = {};
  SUBJECT_LIST.forEach(sub => subjectAttendCounts[sub] = 0);

          // 出席・欠席カウント
        if (absent === true) {
          absentCount++;
        } else {
          attendCount++;
        }

        // 科目のカウント（指定されたリストにある科目だけ）
        if (SUBJECT_LIST.includes(subject) && absent === true) {
          subjectAbsentCounts[subject]++;
        }

        if (SUBJECT_LIST.includes(subject) && absent === false){
          subjectAttendCounts[subject]++;
        }
  */

/** 
          if (!(student.subject in subjectSummary)){
          subjectSummary[student.subject] = {"出席":0, "欠席":0}
        }
  
        if (student.absent){
          subjectSummary[student.subject]["欠席"]++;
          sub_totalAbsent ++;
        } else {
          subjectSummary[student.subject]["出席"]++;
          sub_totalAttend ++;
        }

        if (!(diff in timeSummary)){
          timeSummary[diff] = {"出席":0, "欠席":0}
        }

        if (student.absent){
          timeSummary[diff]["欠席"]++;
          time_totalAbsent ++;
        } else {
          timeSummary[diff]["出席"]++;
          time_totalAttend ++;
        } 
*/

/**
  const subjects = Object.keys(subjectSummary).sort();

  // 先にヘッダーを入れている前提（必要なら）
  const subjectRows = [['📚科目', '✅出席数', '❌欠席数']];

  for (const sub of subjects) {
    const rec = subjectSummary[sub] || {};
    const attend = Number(rec?.出席 ?? 0) || 0; // ← 数値へ正規化
    const absent = Number(rec?.欠席 ?? 0) || 0; // ← 数値へ正規化

    subjectRows.push([sub, attend, absent]);
  }

  subjectRows.push(['- 合計 - ', sub_totalAttend, sub_totalAbsent]);

  const class_times = Object.keys(timeSummary).sort();

  const timeRows = [['⏱授業時間', '✅出席数', '❌欠席数']];

  for (const time of class_times) {
    const rec = timeSummary[time] || {};
    const attend = Number(rec?.出席 ?? 0) || 0; // ← 数値へ正規化
    const absent = Number(rec?.欠席 ?? 0) || 0; // ← 数値へ正規化

    timeRows.push([time, attend, absent]);
  }

  timeRows.push(['- 合計 - ', time_totalAttend, time_totalAbsent]);  


  Logger.log(JSON.stringify(subjectRows));
  Logger.log(JSON.stringify(timeRows));
 */