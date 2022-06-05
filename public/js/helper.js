let mmddyyyyDate = function (date) {
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let year = date.getYear() + 1900;

  return `${month}/${day}/${year}`;
};

let forwardSlashDateFromHyphenated = function (date) {
  let tempDate = date.split("-");
  let month = Number(tempDate[1]);
  let day = Number(tempDate[2]);
  let year = Number(tempDate[0]);

  return `${month}/${day}/${year}`;
};

module.exports.mmddyyyy = mmddyyyyDate;
module.exports.fwdSlash_mmddyyyy = forwardSlashDateFromHyphenated;
