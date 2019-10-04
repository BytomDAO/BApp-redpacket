import i18n from "i18next";

export function timeDifference(t1,t2){
  const diffMs = Math.abs(t2 - t1)

  let diffDays = Math.floor(diffMs / 86400000); // days
  let diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
  let diffMins = Math.floor(((diffMs % 86400000) % 3600000) / 60000); // minutes
  let diffSec = Math.round(diffMs%60)

  let day='', hour='', minute='', seconds=''

  if(diffDays>0){
    day = i18n.t('time.day',{day: diffDays})
  }

  if(diffHrs >0){
    hour = i18n.t('time.hour',{hour: diffHrs})
  }

  if(diffMins >0){
    minute = i18n.t('time.minute',{minute: diffMins})
  }

  if(diffSec >0){
    seconds =  i18n.t('time.second',{second: diffSec})
  }

  return day+hour+minute+seconds
}