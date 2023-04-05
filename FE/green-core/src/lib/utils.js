import Toastify from 'toastify-js';
import message from '@/assets/message.json';
import toastifyCSS from '@/assets/toastify.json';

export function checkInputFormToast() {
  Toastify({
    text: message.CheckInputForm,
    duration: 1500,
    position: 'center',
    stopOnFocus: true,
    style: toastifyCSS.fail,
  }).showToast();
}

export function setTotalCount(params) {
  // let share = parseInt(payload / state.ytonny.yTonnySize);
  // let left = payload % state.ytonny.yTonnySize;
  // if (left == 0) state.ytonny.yTonnyListTotalCount = share;
  // else state.ytonny.yTonnyListTotalCount = share + 1;
}

export function setPaginate(page, size) {
  page += size;
  return [page, size];
}

export function setAlertMessage(mentionNickname, type) {
  if (type === 'ALERT_LIKE') return `${mentionNickname}님이 회원님의 피드에 좋아요를 누르셨습니다`;
  if (type === 'ALERT_FOLLOW') return `${mentionNickname}님이 회원님을 팔로우 하셨습니다`;
  if (type === 'ALERT_COMMENT') return `${mentionNickname}님이 회원님의 피드에 댓글을 남기셨습니다`;
  else return `${mentionNickname}님이 회원님을 언급하셨습니다`;
}

export function getTodayDate() {
  let today = new Date();

  let year = today.getFullYear(); // 년도
  let month = today.getMonth() + 1; // 월
  let date = today.getDate(); // 날짜
  let day = today.getDay(); // 요일

  if (1 <= month < 10) month = '0' + month;
  if (1 <= date < 10) date = '0' + date;

  return year + '-' + month + '-' + date;
}

// 닉네임 encoding
export const encodeNickname = (nickname) => {
  if (typeof nickname === 'string') {
    return encodeURIComponent(nickname);
  } else {
    return nickname.map((nick) => encodeURIComponent(nick)).join(',');
  }
};