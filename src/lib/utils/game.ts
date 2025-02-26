import { LOCAL_STORAGE_KEY } from '$lib/constants/game';
import { balance, historyMap } from '$lib/stores/game';
import { get } from 'svelte/store';

export function setBalanceFromLocalStorage() {
  const rawValue = window.localStorage.getItem(LOCAL_STORAGE_KEY.BALANCE);
  const rawValueMap = window.localStorage.getItem('plinko_map');
  if (rawValueMap) {
    const map = JSON.parse(rawValueMap);
    historyMap.set(new Map(map));
  }
  const parsedValue = parseFloat(rawValue ?? '');
  if (!isNaN(parsedValue)) {
    balance.set(parsedValue);
  }
}

export function writeBalanceToLocalStorage() {
  const balanceVal = get(balance);
  const historyMapVal = get(historyMap);
  window.localStorage.setItem('plinko_map', JSON.stringify(Array.from(historyMapVal.entries())));
  if (!isNaN(balanceVal)) {
    const balanceValStr = balanceVal.toFixed(2);
    window.localStorage.setItem(LOCAL_STORAGE_KEY.BALANCE, balanceValStr);
  }
}
