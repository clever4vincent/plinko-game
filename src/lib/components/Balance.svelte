<script lang="ts">
  import { balance } from '$lib/stores/game';
  import { flyAndScale } from '$lib/utils/transitions';
  import { isLiveStatsOpen, isHistoryOpen } from '$lib/stores/layout';
  import { Popover, Tooltip } from 'bits-ui';
  import { twMerge } from 'tailwind-merge';
  import ChartLine from 'phosphor-svelte/lib/ChartLine';
  import chartIcon from '$lib/assets/chart.png';
  import historyIcon from '$lib/assets/history.png';
  let balanceFormatted = $derived(
    $balance.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),
  );

  const addMoneyAmounts = [100, 500, 1000];
</script>

<div class="flex overflow-hidden">
  <div
    class="flex rounded-4xl bg-[#7e420b] px-5 py-2 text-[16px] font-semibold text-[#ffd040] tabular-nums sm:text-base"
  >
    <span class="mr-1 text-[#a25b19] select-none">$</span>
    <span class="min-w-16 text-right font-bold">
      {balanceFormatted}
    </span>
  </div>
  <Tooltip.Provider delayDuration={0} disableCloseOnTriggerClick>
    <Tooltip.Root>
      <Tooltip.Trigger
        onclick={() => {
          $isLiveStatsOpen = !$isLiveStatsOpen;
          if ($isLiveStatsOpen) {
            $isHistoryOpen = false;
          }
        }}
        class={twMerge(
          'absolute top-1 right-0 rounded-full p-2 text-slate-300 transition hover:bg-slate-600 active:bg-slate-500',
          $isLiveStatsOpen && 'text-slate-100',
        )}
      >
        <img src={chartIcon} class="size-8" alt="chart" />
        <!-- <ChartLine class="size-6" weight="bold" /> -->
      </Tooltip.Trigger>
      <!-- <Tooltip.Content
        forceMount
        sideOffset={4}
        class="z-30 max-w-lg rounded-md bg-white p-3 text-sm font-medium text-gray-950 drop-shadow-xl"
      >
        {#snippet child({ wrapperProps, props, open })}
          {#if open}
            <div {...wrapperProps}>
              <div {...props} transition:flyAndScale>
                <Tooltip.Arrow class="text-white" />
                <p>{$isLiveStatsOpen ? 'Close' : 'Open'} Live Stats</p>
              </div>
            </div>
          {/if}
        {/snippet}
      </Tooltip.Content> -->
    </Tooltip.Root>
  </Tooltip.Provider>
  <Tooltip.Provider delayDuration={0} disableCloseOnTriggerClick>
    <Tooltip.Root>
      <Tooltip.Trigger
        onclick={() => {
          $isHistoryOpen = !$isHistoryOpen;
          if ($isHistoryOpen) {
            $isLiveStatsOpen = false;
          }
        }}
        class={twMerge(
          'absolute top-1 right-11 rounded-full p-2 text-slate-300 transition hover:bg-slate-600 active:bg-slate-500',
          $isHistoryOpen && 'text-slate-100',
        )}
      >
        <img src={historyIcon} class="size-8" alt="chart" />
        <!-- <ChartLine class="size-6" weight="bold" /> -->
      </Tooltip.Trigger>
      <!-- <Tooltip.Content
        forceMount
        sideOffset={4}
        class="z-30 max-w-lg rounded-md bg-white p-3 text-sm font-medium text-gray-950 drop-shadow-xl"
      >
        {#snippet child({ wrapperProps, props, open })}
          {#if open}
            <div {...wrapperProps}>
              <div {...props} transition:flyAndScale>
                <Tooltip.Arrow class="text-white" />
                <p>{$isLiveStatsOpen ? 'Close' : 'Open'} Live Stats</p>
              </div>
            </div>
          {/if}
        {/snippet}
      </Tooltip.Content> -->
    </Tooltip.Root>
  </Tooltip.Provider>
  <!-- <Popover.Root >
   <Popover.Trigger
      class="bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500 active:bg-blue-700 sm:text-base"
    >
      Add
    </Popover.Trigger> 
    <Popover.Content
      forceMount
      sideOffset={8}
      class="z-30 max-w-lg space-y-2 rounded-md bg-slate-600 p-3"
    >
      {#snippet child({ wrapperProps, props, open })}
        {#if open}
          <div {...wrapperProps}>
            <div {...props} transition:flyAndScale>
              <p class="text-sm font-medium text-gray-200">Add money</p>
              <div class="flex gap-2">
                {#each addMoneyAmounts as amount}
                  <button
                    onclick={() => ($balance += amount)}
                    class="touch-manipulation rounded-md bg-green-500 px-3 py-2 text-sm font-semibold text-gray-900 transition-colors hover:bg-green-400 active:bg-green-600 disabled:bg-neutral-600 disabled:text-neutral-400"
                  >
                    +${amount}
                  </button>
                {/each}
              </div>
            </div>
          </div>
        {/if}
      {/snippet}
    </Popover.Content>
  </Popover.Root> -->
</div>
