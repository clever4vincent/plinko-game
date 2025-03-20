<script lang="ts">
  import logo from '$lib/assets/logo.svg';
  import Balance from '$lib/components/Balance.svelte';
  import LiveStatsWindow from '$lib/components/LiveStatsWindow/LiveStatsWindow.svelte';
  import HistoryWindow from '$lib/components/HistoryWindow/HistoryWindow.svelte';
  import Plinko from '$lib/components/Plinko';
  import SettingsWindow from '$lib/components/SettingsWindow';
  import Sidebar from '$lib/components/Sidebar';
  import { setBalanceFromLocalStorage, writeBalanceToLocalStorage } from '$lib/utils/game';
  import GitHubLogo from 'phosphor-svelte/lib/GithubLogo';
  import { page } from '$app/stores';
  import request from '$lib/utils/request';
  async function fetchData() {
    const response = await request.get('games/plinko/bet', { token: '' });
    let data = response.data;
  }
  // 监听 URL 参数
  // $: gameId = $page.params.id; // 例如 /game/123 -> gameId = "123"
  // console.log(gameId);
  $effect(() => {
    let token = $page.url.searchParams.get('token');
    // 老虎机 Demo
    // const myLucky = new SlotMachine('#my-lucky', {
    //   width: '768px',
    //   height: '300px',
    //   blocks: [
    //     { padding: '10px', background: '#869cfa' },
    //     { padding: '10px', background: '#e9e8fe' },
    //   ],
    //   slots: [{ order: [0, 1] }, { order: [0, 1] }, { order: [0, 1] }, { order: [0, 1] }],
    //   prizes: [{ fonts: [{ text: '6', top: '15%' }] }, { fonts: [{ text: '9', top: '15%' }] }],
    //   defaultStyle: {
    //     borderRadius: Infinity,
    //     background: '#bac5ee',
    //     fontSize: '64px',
    //     lineHeight: '80px',
    //     fontColor: '#fff',
    //   },
    //   defaultConfig: {
    //     rowSpacing: '25px',
    //     colSpacing: '10px',
    //   },
    // });
    // myLucky.play();
    // setTimeout(() => {
    //   // 结束游戏
    //   myLucky.stop([1, 1, 1, 1]);
    // }, 1000);
    // 大转盘简易 Demo
    // const myLucky = new LuckyWheel('#my-lucky', {
    //   width: '300px',
    //   height: '300px',
    //   blocks: [{ padding: '13px', background: '#617df2' }],
    //   prizes: [
    //     { fonts: [{ text: '0', top: '10%' }], angle: 30, background: '#e9e8fe' },
    //     { fonts: [{ text: '1', top: '10%' }], angle: 30, background: '#b8c5f2' },
    //     { fonts: [{ text: '2', top: '10%' }], angle: 50, background: '#e9e8fe' },
    //     { fonts: [{ text: '3', top: '10%' }], angle: 80, background: '#b8c5f2' },
    //     { fonts: [{ text: '4', top: '10%' }], angle: 80, background: '#e9e8fe' },
    //     { fonts: [{ text: '5', top: '10%' }], angle: 90, background: '#b8c5f2' },
    //   ],
    //   buttons: [
    //     {
    //       radius: '20%',
    //       background: '#8a9bf3',
    //       pointer: true,
    //       fonts: [{ text: 'start', top: '-10px', fontSize: '16px' }],
    //     },
    //   ],
    //   start: function () {
    //     // 开始游戏
    //     myLucky.play();
    //     // 使用定时器模拟接口
    //     setTimeout(() => {
    //       // 结束游戏
    //       myLucky.stop(0);
    //     }, 3000);
    //   },
    // });
    // setBalanceFromLocalStorage();
  });
</script>

<!-- <svelte:window onbeforeunload={writeBalanceToLocalStorage} /> -->

<div class="relative flex min-h-dvh w-full flex-col">
  <nav class="sticky top-0 z-10 w-full px-5 drop-shadow-lg">
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
        <div class="flex-1">
          <Plinko />
        </div>
      </div>
    </div>
  </div>
  <!-- <div id="my-lucky"></div> -->
  <!-- <SettingsWindow /> -->
  <LiveStatsWindow />
  <HistoryWindow />
</div>

<style lang="postcss">
  @reference "../app.css";

  :global(body) {
    /* @apply bg-gray-800; */
    /* background-image: ; */
    background-image: url('$lib/assets/bg_all.png');
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
  }
</style>
