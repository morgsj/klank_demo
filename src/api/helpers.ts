import { Timestamp } from "firebase/firestore";

/**
 * Converts firebase datetime into YYYY-MM-DD
 * @param {*} secs
 * @returns
 */
function toDateTime(secs: number) {
  let t = new Date(1970, 0, 1);
  t.setSeconds(secs);
  let year = t.getFullYear();
  let month = t.getMonth();
  let day = t.getDate();
  return year + "-" + less10(month) + "-" + less10(day);
}

function less10(time: number) {
  return time < 10 ? "0" + time : time;
}

function dateStringToTimestamp(str: string) {
  const date = new Date(str);
  const seconds = date.getTime() / 1000;
  return new Timestamp(seconds, 0);
}

export { toDateTime, dateStringToTimestamp };
