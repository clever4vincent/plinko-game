<script lang="ts">
  import { winRecords } from '$lib/stores/game';
  import { formatCurrency } from '$lib/utils/numbers';
  import { twMerge } from 'tailwind-merge';

  let profit = $derived($winRecords.reduce((acc, { profit }) => acc + profit, 0));
  let wins = $derived($winRecords.filter(({ profit }) => profit >= 0).length);
  let losses = $derived($winRecords.filter(({ profit }) => profit < 0).length);

  let winsFormatted = $derived(wins.toLocaleString('en-US'));
  let lossesFormatted = $derived(losses.toLocaleString('en-US'));
</script>

<div class="flex rounded-md bg-[#ef9d49] p-4 text-sm">
  <div class="flex-1">
    <p class="font-medium text-[#822800]">Profit</p>
    <p
      class={twMerge(
        'font-semibold tabular-nums',
        profit >= 0 ? 'text-[#008A46]' : 'text-[#CB0000]',
      )}
    >
      {formatCurrency(profit)}
    </p>
  </div>
  <div class="mx-4 w-0.5 bg-[#A54E17]" aria-hidden="true"></div>
  <div class="flex-1 space-y-2">
    <div>
      <p class="font-medium text-[#822800]">Wins</p>
      <p class="font-semibold text-[#008A46] tabular-nums">{winsFormatted}</p>
    </div>
    <div>
      <p class="font-medium text-[#822800]">Losses</p>
      <p class="font-semibold text-[#CB0000] tabular-nums">{lossesFormatted}</p>
    </div>
  </div>
</div>
