<script lang="ts">
  import { onMount } from 'svelte';
  import { derived, writable } from 'svelte/store';
  import { totalProfitHistory, winRecords } from '$lib/stores/game';
  import { isHistoryOpen } from '$lib/stores/layout';
  import { flyAndScale } from '$lib/utils/transitions';
  import { Tooltip } from 'bits-ui';
  import ArrowClockwise from 'phosphor-svelte/lib/ArrowClockwise';
  import ChartLine from 'phosphor-svelte/lib/ChartLine';
  import DraggableWindow from '../ui/DraggableWindow.svelte';
  import type { HistoryRecord } from '$lib/types/game';

  import chartIcon from '$lib/assets/icon_history.png';
  import resetIcon from '$lib/assets/reset.png';

  let page = 1;
  const pageSize = 10;
  let loading = false;
  let hasMore = true;
  let historyList: HTMLElement;
  const historyListData = writable<HistoryRecord[]>([]);

  const loadMoreRecords = async () => {
    if (loading || !hasMore) return;

    loading = true;
    try {
      // 这里模拟加载数据，实际使用时替换为真实的数据加载逻辑
      await new Promise((res) => setTimeout(res, 500));

      // 模拟数据
      const newRecords: HistoryRecord[] = Array.from({ length: pageSize }, (_, i) => ({
        gameId: `record-${(page - 1) * pageSize + i}`,
        balance: 300000,
        time: new Date().toLocaleString(),
        profit: Math.random() * 100 - 50,
      }));

      // 更新数据
      $historyListData = [...$historyListData, ...newRecords];

      // 更新分页状态
      page++;
      hasMore = newRecords.length === pageSize;
    } finally {
      loading = false;
    }
  };

  const refreshHistory = async () => {
    page = 1;
    hasMore = true;
    $historyListData = [];
    await loadMoreRecords();
  };

  const handleScroll = async (e: Event) => {
    const target = e.currentTarget as HTMLElement;
    const scrollBottom = target.scrollHeight - target.scrollTop - target.clientHeight;

    if (scrollBottom < 50 && !loading) {
      console.log('Loading more records...');
      await loadMoreRecords();
    }
  };

  onMount(() => {
    loadMoreRecords();
  });
</script>

{#if $isHistoryOpen}
  <div>
    <DraggableWindow
      onClose={() => ($isHistoryOpen = false)}
      class="fixed right-0 bottom-0 left-0 mx-auto min-h-[10rem] w-[100%] overflow-hidden rounded-t-3xl"
    >
      <div
        bind:this={historyList}
        class="custom-scrollbar relative h-[30rem] overflow-y-auto rounded-t-[32px] bg-[#f0af6e] px-4 py-2 font-bold"
        on:scroll|passive={handleScroll}
      >
        {#each $historyListData as record}
          <div class="flex flex-col gap-1 border-b border-[#E5A163] py-2 text-[13px]">
            <div class="flex items-center justify-between">
              <span class=" text-[#822800]">Balance: {record.balance}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class=" text-[#822800]">Profit</span>
              <span class=" {record.profit >= 0 ? 'text-[#14c0b1]' : 'text-[#FF3434]'}">
                {record.profit >= 0 ? '+' : ''}{record.profit.toFixed(2)}
              </span>
            </div>
            <div class="flex items-center justify-between">
              <span class=" text-[#822800]">Time</span>
              <span class=" text-[#822800]">{record.time}</span>
            </div>
          </div>
        {/each}

        {#if loading}
          <div class="sticky right-0 bottom-0 left-0 flex justify-center py-4">
            <div
              class="h-6 w-6 animate-spin rounded-full border-2 border-[#822800] border-t-transparent"
            ></div>
          </div>
        {/if}

        {#if !hasMore && $historyListData.length > 0}
          <div class="py-4 text-center text-sm text-white">No more records</div>
        {/if}
      </div>
      {#snippet titleBarActions()}
        <Tooltip.Provider delayDuration={0} disableCloseOnTriggerClick>
          <Tooltip.Root>
            <Tooltip.Trigger
              onclick={refreshHistory}
              class="bg-[#f0af6e] px-2 py-3 text-slate-300 transition hover:bg-[#f0af5e] active:bg-[#f0af5e]  "
            >
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
                      <p>Refresh History</p>
                    </div>
                  </div>
                {/if}
              {/snippet}
            </Tooltip.Content>
          </Tooltip.Root>
        </Tooltip.Provider>
      {/snippet}
      {#snippet title()}
        <img src={chartIcon} alt="chart" class="size-6" />
        <p class="text-sm font-medium text-white">History</p>
      {/snippet}
    </DraggableWindow>
  </div>
{/if}

<style>
  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #822800 rgba(240, 175, 110, 0.1);
  }

  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }

  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(240, 175, 110, 0.1);
    border-radius: 3px;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: #822800;
    border-radius: 3px;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: #822800;
  }
</style>
