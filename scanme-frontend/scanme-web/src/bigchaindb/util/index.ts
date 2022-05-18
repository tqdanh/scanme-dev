export function generateId() {
  return Math.floor((1 + Math.random()) * 0X10000).toString(16).substring(1);
}
export function formatDate(dateStr) {
  const date = new Date(dateStr);
  const minutes = date.getMinutes();
  const day = date.getDate();
  const month = date.getMonth();
  return `${month > 9 ? month + 1 : '0' + (month + 1)}/${day > 9 ? day : '0' + day}/${date.getFullYear()} ${date.getHours()}:${minutes > 9 ? minutes : '0' + minutes}`;
}

