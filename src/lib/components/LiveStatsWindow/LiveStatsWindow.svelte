<script lang="ts">
  import { totalProfitHistory, winRecords } from '$lib/stores/game';
  import { isLiveStatsOpen } from '$lib/stores/layout';
  import { flyAndScale } from '$lib/utils/transitions';
  import { Tooltip } from 'bits-ui';
  import ArrowClockwise from 'phosphor-svelte/lib/ArrowClockwise';
  import ChartLine from 'phosphor-svelte/lib/ChartLine';
  import DraggableWindow from '../ui/DraggableWindow.svelte';
  import Profit from './Profit.svelte';
  import ProfitHistoryChart from './ProfitHistoryChart.svelte';
  import chartIcon from '$lib/assets/chart-icon.png';
  import resetIcon from '$lib/assets/reset.png';
  function resetLiveStats() {
    $winRecords = [];
    $totalProfitHistory = [0];
  }
</script>

{#if $isLiveStatsOpen}
  <div>
    <DraggableWindow
      onClose={() => ($isLiveStatsOpen = false)}
      class="fixed right-0 bottom-0 left-0 mx-auto w-[100%]  max-w-[50rem] overflow-hidden  rounded-t-3xl"
    >
      {#snippet title()}
        <!-- <ChartLine weight="bold" class=" text-xl text-slate-300" /> -->
        <img src={chartIcon} alt="chart" class="size-6" />
        <p class="text-sm font-medium text-white">Live Stats</p>
      {/snippet}

      {#snippet titleBarActions()}
        <Tooltip.Provider delayDuration={0} disableCloseOnTriggerClick>
          <Tooltip.Root>
            <Tooltip.Trigger
              onclick={resetLiveStats}
              class="bg-[#f0af6e] px-2 py-3 text-slate-300 transition hover:bg-[#f0af5e] active:bg-[#f0af5e]"
            >
              <!-- <ArrowClockwise weight="bold" /> -->
              <img src={resetIcon} alt="reset" class="size-6" />
            </Tooltip.Trigger>
            <Tooltip.Content
              forceMount
              sideOffset={4}
              class="z-50 max-w-lg rounded-md bg-white p-3 text-sm font-medium text-gray-950 drop-shadow-xl"
            >
              {#snippet child({ wrapperProps, props, open })}
                {#if open}
                  <div {...wrapperProps}>
                    <div {...props} transition:flyAndScale>
                      <Tooltip.Arrow class="text-white" />

                      <p>Reset Live Stats</p>
                    </div>
                  </div>
                {/if}
              {/snippet}
            </Tooltip.Content>
          </Tooltip.Root>
        </Tooltip.Provider>
      {/snippet}

      <div class="flex flex-col gap-4">
        <Profit />
        <ProfitHistoryChart />
      </div>
    </DraggableWindow>
  </div>
{/if}
