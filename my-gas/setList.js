// 得られたリストを配列になおす関数：講師・生徒・科目の配列作成

function toStudentList() {

  const res = getList(STUDENTURL);
  const parsedJson = JSON.parse(res);

  const studentList = parsedJson.data.map((student) => {
    return {
      id: student.id,
      name: student.name,
    };
  });

  Logger.log(`生徒数：${studentList.length}`);

  if (!studentList.length) {
    Logger.log("⚠️ 該当する生徒がいません");
    SpreadsheetApp.getUi().alert("⚠️ 該当する生徒がいません");
    return[];
  }

  return studentList;
  
}

function toTeacherList() {

  const res = getList(TEACHERURL);
  const parsedJson = JSON.parse(res);
  
  const teacherList = parsedJson.map((teacher) => {
    return {
      id: teacher.id,
      name: teacher.name,
    };
  });

  Logger.log(`講師数：${teacherList.length}`);

  if (!teacherList.length) {
    Logger.log("⚠️ 該当する講師がいません");
    SpreadsheetApp.getUi().alert("⚠️ 該当する講師がいません");
    return[];
  }

  return teacherList;

}

function toSubjectList(){

  const res = getList(SUBJECTURL);
  const parsedJson = JSON.parse(res);

  return parsedJson.data
  
}
