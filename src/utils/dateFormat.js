export default function (date) {
  // 2021-12-29T00:38:47.335Z
  // 012345678901234567890
  date = new Date(date);
  // date.setHours(date.getHours() + 8);
  return date.toLocaleString();
}
