<script lang="ts">
  import logo from '$lib/assets/logo.svg';
  import Balance from '$lib/components/Balance.svelte';
  import { luckyWheelEngine } from '$lib/stores/game';
  import LiveStatsWindow from '$lib/components/LiveStatsWindow/LiveStatsWindow.svelte';
  import Plinko from '$lib/components/Plinko';
  import SettingsWindow from '$lib/components/SettingsWindow';
  import Sidebar from '$lib/components/Sidebar';
  import { setBalanceFromLocalStorage, writeBalanceToLocalStorage } from '$lib/utils/game';
  import GitHubLogo from 'phosphor-svelte/lib/GithubLogo';
  import { page } from '$app/stores';
  import { LuckyWheel, SlotMachine } from 'lucky-canvas-z';
  import CircleNotch from 'phosphor-svelte/lib/CircleNotch';
  import {
    gameNo,
    totalProfitHistory,
    winRecords,
    luckyWheelRunning,
    slotMachineEngine,
  } from '$lib/stores/game';
  $gameNo = 3;
  // 监听 URL 参数
  // $: gameId = $page.params.id; // 例如 /game/123 -> gameId = "123"
  // console.log(gameId);
  $effect(() => {
    let token = $page.url.searchParams.get('token');
    // 老虎机 Demo
    $slotMachineEngine = new SlotMachine('#my-lucky', {
      width: '320px',
      height: '200px',
      blocks: [
        { padding: '10px', background: '#314158' },
        { padding: '10px', background: '#1e2939' },
      ],
      slots: [{ order: [0, 1] }, { order: [0, 1] }, { order: [0, 1] }],
      prizes: [{ fonts: [{ text: '6', top: '15%' }] }, { fonts: [{ text: '9', top: '15%' }] }],
      defaultStyle: {
        borderRadius: Infinity,
        background: '#314158',
        fontSize: '24px',
        lineHeight: '36px',
        fontColor: '#fff',
      },
      defaultConfig: {
        rowSpacing: '20px',
        colSpacing: '10px',
        delayStep: 100,
      },
    });
    // myLucky.play();
    // setTimeout(() => {
    //   // 结束游戏
    //   myLucky.stop([1, 1, 1]);
    // }, 1000);

    setBalanceFromLocalStorage();
  });
</script>

<svelte:window onbeforeunload={writeBalanceToLocalStorage} />

<div class="relative flex min-h-dvh w-full flex-col">
  <nav class="sticky top-0 z-10 w-full bg-gray-700 px-5 drop-shadow-lg">
    <div class="mx-auto flex h-14 max-w-7xl items-center justify-between">
      <!-- <img src={logo} alt="logo" class="h-6 sm:h-7" /> -->
      <div class="mx-auto">
        <Balance />
      </div>
    </div>
  </nav>

  <div class="flex-1 px-5">
    <div class="mx-auto mt-5 max-w-xl min-w-[300px] drop-shadow-xl md:mt-10 lg:max-w-7xl">
      <div class="flex flex-col-reverse overflow-hidden rounded-lg lg:w-full lg:flex-row">
        <Sidebar />

        <!-- {#if $luckyWheelEngine === null}
          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <CircleNotch class="size-20 animate-spin text-slate-600" weight="bold" />
          </div>
        {/if}
        <div class="m-auto mb-4 flex-1">
          <div id="my-lucky"></div>
        </div> -->

        <!-- 修改后的核心区域 -->
        <div class=" m-auto mb-4 flex-1 lg:flex lg:items-center lg:justify-center">
          <div id="my-lucky" class="relative" style="width: 335px; height: 200px;">
            {#if $luckyWheelEngine === null}
              <div class="absolute inset-0 flex items-center justify-center">
                <CircleNotch class="size-20 animate-spin text-slate-400" weight="bold" />
              </div>
            {/if}
          </div>
        </div>
        <!-- <div class="mx-auto flex h-full flex-col px-4 pb-4" style:min-height={`${300}px`}>
          <div class="relative w-full" style:aspect-ratio={`${300} / ${300}`}>
            {#if $luckyWheelEngine == null}
              <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <CircleNotch class="size-20 animate-spin text-slate-600" weight="bold" />
              </div>
            {/if}
            <div id="my-lucky"></div>
          </div>
        </div> -->
      </div>
    </div>
  </div>

  <!-- <SettingsWindow /> -->
  <LiveStatsWindow />
</div>

<style lang="postcss">
  @reference "../../app.css";

  :global(body) {
    @apply bg-gray-800;
  }
</style>
