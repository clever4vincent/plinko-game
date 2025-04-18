<script lang="ts">
  import { Select } from '$lib/components/ui';
  import { autoBetIntervalMs, rowCountOptions } from '$lib/constants/game';
  import CircleNotch from 'phosphor-svelte/lib/CircleNotch';
  import {
    balance,
    betAmount,
    betAmountOfExistingBalls,
    gameNo,
    plinkoEngine,
    luckyWheelRunning,
    luckyWheelEngine,
    slotMachineEngine,
    token,
    riskLevel,
    rowCount,
  } from '$lib/stores/game';
  import { isGameSettingsOpen, isLiveStatsOpen } from '$lib/stores/layout';
  import betGif from '$lib/assets/bet.gif';
  import { BetMode, RiskLevel } from '$lib/types';
  import { flyAndScale } from '$lib/utils/transitions';
  import { Popover, Tooltip } from 'bits-ui';
  import ChartLine from 'phosphor-svelte/lib/ChartLine';
  import GearSix from 'phosphor-svelte/lib/GearSix';
  import Infinity from 'phosphor-svelte/lib/Infinity';
  import Question from 'phosphor-svelte/lib/Question';
  import type { FormEventHandler } from 'svelte/elements';
  import { twMerge } from 'tailwind-merge';
  import request from '$lib/utils/request';

  import { toast } from '@zerodevx/svelte-toast';

  let betMode: BetMode = $state(BetMode.MANUAL);

  /**
   * When `betMode` is `AUTO`, the number of bets to be placed. Zero means infinite bets.
   */
  let autoBetInput = $state(0);
  let isBetLoading = $state(false);

  /**
   * Number of auto bets remaining when `betMode` is `AUTO`.
   *
   * - `number`: Finite count of how many bets left. It decrements from `autoBetInput` to 0.
   * - `null`: For infinite bets (i.e. `autoBetInput` is 0).
   */
  let autoBetsLeft: number | null = $state(null);

  let autoBetInterval: ReturnType<typeof setInterval> | null = $state(null);

  let isBetAmountNegative = $derived($betAmount <= 0);
  let isBetExceedBalance = $derived($betAmount > $balance);
  let isAutoBetInputNegative = $derived(autoBetInput < 0);

  let isDropBallDisabled = $derived(getBallDisabledConditions());

  let hasOutstandingBalls = $derived(Object.keys($betAmountOfExistingBalls).length > 0);

  function getBallDisabledConditions() {
    if ($gameNo === 1) {
      return (
        $plinkoEngine === null ||
        isBetAmountNegative ||
        isBetExceedBalance ||
        isAutoBetInputNegative ||
        (!autoBetInterval && isBetLoading)
      );
    } else if ($gameNo === 2) {
      return (
        (!autoBetInterval && $luckyWheelRunning) ||
        isBetAmountNegative ||
        isBetExceedBalance ||
        isAutoBetInputNegative ||
        (!autoBetInterval && isBetLoading)
      );
    }
  }

  const handleBetAmountInput: FormEventHandler<HTMLInputElement> = (e) => {
    const input = e.currentTarget;
    const value = input.value;

    // 如果输入包含小数点，限制小数位数
    if (value.includes('.')) {
      const parts = value.split('.');
      if (parts[1].length > 2) {
        input.value = parts[0] + '.' + parts[1].slice(0, 2);
      }
    }

    // 更新 betAmount
    const parsedValue = parseFloat(input.value);
    if (!isNaN(parsedValue)) {
      $betAmount = parsedValue;
    }
  };

  const handleBetAmountFocusOut: FormEventHandler<HTMLInputElement> = (e) => {
    const parsedValue = parseFloat(e.currentTarget.value.trim());
    if (isNaN(parsedValue)) {
      $betAmount = -1; // If input field is empty, this forces re-render so its value resets to 0
      $betAmount = 0;
    } else {
      $betAmount = parsedValue;
    }
  };
  async function fetchData() {
    isBetLoading = true;
    try {
      const response = await request.post('game/bet', {
        gameId: $gameNo,
        betAmount: $betAmount,
        token: $token,
        gameLevel: 0,
      });
      let data = response.data;
      // toast.push(data.target_e);

      $plinkoEngine?.dropBallWithX(parseFloat(data.result));
      // if ($gameNo == 2) {
      //   $luckyWheelEngine?.play();
      //   $luckyWheelRunning = true;
      //   balance.update((balance) => balance - $betAmount);
      //   setTimeout(() => {
      //     // 结束游戏
      //     $luckyWheelEngine!.stop(4);
      //   }, 0);
      // }
      // if ($gameNo == 3) {
      //   $slotMachineEngine!.play();
      //   setTimeout(() => {
      //     // 结束游戏
      //     $slotMachineEngine!.stop([1, 1, 1]);
      //   }, 0);
      // }
      // console.log(data.data.result);
    } finally {
      isBetLoading = false;
    }
  }
  function resetAutoBetInterval() {
    if (autoBetInterval !== null) {
      clearInterval(autoBetInterval);
      autoBetInterval = null;
    }
  }
  function getPlayText() {
    if ($gameNo == 1) {
      return 'Drop Ball';
    }
    if ($gameNo == 2 || $gameNo == 3) {
      return 'Play';
    }
  }
  async function startDropBall() {
    fetchData();
  }
  function autoBetDropBall() {
    if (isBetLoading && $gameNo == 1) {
      return;
    }
    if ($luckyWheelRunning && $gameNo == 2) {
      return;
    }
    if (isBetExceedBalance) {
      resetAutoBetInterval();
      return;
    }

    // Infinite mode
    if (autoBetsLeft === null) {
      startDropBall();
      return;
    }

    // Finite mode
    if (autoBetsLeft > 0) {
      startDropBall();
      autoBetsLeft -= 1;
    }
    if (autoBetsLeft === 0 && autoBetInterval !== null) {
      resetAutoBetInterval();
      return;
    }
  }

  const handleAutoBetInputFocusOut: FormEventHandler<HTMLInputElement> = (e) => {
    const parsedValue = parseInt(e.currentTarget.value.trim());
    if (isNaN(parsedValue)) {
      autoBetInput = -1; // If input field is empty, this forces re-render so its value resets to 0
      autoBetInput = 0;
    } else {
      autoBetInput = parsedValue;
    }
  };

  function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  async function handleBetClick() {
    if (betMode === BetMode.MANUAL) {
      startDropBall();
    } else if (autoBetInterval === null) {
      autoBetsLeft = autoBetInput === 0 ? null : autoBetInput;
      autoBetInterval = setInterval(autoBetDropBall, autoBetIntervalMs);
    } else if (autoBetInterval !== null) {
      resetAutoBetInterval();
    }
  }
  let betModes = $state([
    { value: BetMode.MANUAL, label: 'Manual' },
    { value: BetMode.AUTO, label: 'Auto' },
  ]);
  $effect(() => {
    if ($gameNo == 2 || $gameNo == 3) {
      betModes = [{ value: BetMode.MANUAL, label: 'Manual' }];
    }
  });

  const riskLevels = [
    { value: RiskLevel.LOW, label: 'Low' },
    { value: RiskLevel.MEDIUM, label: 'Medium' },
    { value: RiskLevel.HIGH, label: 'High' },
  ];
  const rowCounts = rowCountOptions.map((value) => ({ value, label: value.toString() }));
</script>

<div class="flex flex-col gap-5 p-3 lg:max-w-80">
  <div class="flex gap-1 rounded-full bg-[#7e420b] p-1">
    {#each betModes as { value, label }}
      <button
        disabled={autoBetInterval !== null}
        onclick={() => (betMode = value)}
        class={twMerge(
          'h-[44px] flex-1 rounded-full py-2 text-sm text-[16px] text-white  transition  hover:not-disabled:bg-[#f6cd27]  active:not-disabled:bg-[#f6cd27] disabled:cursor-not-allowed disabled:opacity-50',
          betMode === value && 'textshadow bg-[#f6cd27] font-bold text-[#983b01]',
        )}
      >
        {label}
      </button>
    {/each}
  </div>

  <div class="relative">
    <label for="betAmount" class="text-sm font-medium text-white">Bet Amount</label>
    <div class="flex">
      <div class="relative flex-1">
        <input
          id="betAmount"
          value={$betAmount}
          oninput={handleBetAmountInput}
          onfocusout={handleBetAmountFocusOut}
          disabled={autoBetInterval !== null}
          type="number"
          min="0"
          inputmode="decimal"
          step="10"
          class={twMerge(
            'h-[50px] w-full rounded-l-md bg-[#783900] py-2 pr-2 pl-7 text-sm text-white transition-colors hover:cursor-pointer hover:not-disabled:border-slate-500 focus:border-slate-500 focus:outline-hidden  disabled:cursor-not-allowed disabled:opacity-50',
            (isBetAmountNegative || isBetExceedBalance) &&
              'border-red-500 hover:not-disabled:border-red-400 focus:border-red-400',
          )}
        />
        <div class="absolute top-3.5 left-3 text-[#AF6B17] select-none" aria-hidden="true">$</div>
      </div>
      <button
        disabled={autoBetInterval !== null}
        onclick={() => {
          $betAmount = parseFloat(($betAmount / 2).toFixed(2));
        }}
        class="textshadow touch-manipulation bg-[#f8d134] px-4 font-bold text-[#983b01] diagonal-fractions transition-colors hover:not-disabled:bg-[#f8f534] active:not-disabled:bg-[#e1e288] disabled:cursor-not-allowed disabled:opacity-50"
      >
        1/2
      </button>
      <button
        disabled={autoBetInterval !== null}
        onclick={() => {
          $betAmount = parseFloat(($betAmount * 2).toFixed(2));
        }}
        class=" textshadow relative touch-manipulation rounded-r-md bg-[#f8d134] px-4 text-sm font-bold text-[#983b01] transition-colors after:absolute after:left-0 after:inline-block after:h-1/2 after:w-[2px] after:bg-[#A04C09] after:content-[''] hover:not-disabled:bg-[#f8f534] active:not-disabled:bg-[#e1e288] disabled:cursor-not-allowed disabled:opacity-50"
      >
        2×
      </button>
    </div>
    {#if isBetAmountNegative}
      <p class="absolute text-xs leading-5 text-red-600">
        This must be greater than or equal to 0.
      </p>
    {:else if isBetExceedBalance}
      <p class="absolute text-xs leading-5 text-red-600">Can't bet more than your balance!</p>
    {/if}
  </div>

  <!-- <div >
    <label for="riskLevel" class="text-sm font-medium text-slate-300">Risk</label>
    <Select
      id="riskLevel"
      bind:value={$riskLevel}
      items={riskLevels}
      disabled={hasOutstandingBalls || autoBetInterval !== null}
    />
  </div> -->

  <!-- <div>
    <label for="rowCount" class="text-sm font-medium text-slate-300">Rows</label>
    <Select
      id="rowCount"
      bind:value={$rowCount}
      items={rowCounts}
      disabled={hasOutstandingBalls || autoBetInterval !== null}
    />
  </div> -->

  {#if betMode === BetMode.AUTO}
    <div>
      <div class="flex items-center gap-1">
        <label for="autoBetInput" class="text-sm font-medium text-white">Number of Bets</label>
        <Popover.Root>
          <Popover.Trigger class="p-1">
            <Question class="text-white" weight="bold" />
          </Popover.Trigger>
          <Popover.Content
            class="z-30 max-w-lg rounded-md bg-white p-3 text-sm font-medium text-gray-950 drop-shadow-xl"
          >
            <p>Enter '0' for unlimited bets.</p>
            <Popover.Arrow />
          </Popover.Content>
        </Popover.Root>
      </div>
      <div class="relative">
        <input
          id="autoBetInput"
          value={autoBetInterval === null ? autoBetInput : autoBetsLeft ?? 0}
          disabled={autoBetInterval !== null}
          onfocusout={handleAutoBetInputFocusOut}
          type="number"
          min="0"
          inputmode="decimal"
          class={twMerge(
            'h-[50px] w-full rounded-md  bg-[#783900]  py-2 pr-8 pl-3 text-sm text-white transition-colors hover:cursor-pointer hover:not-disabled:border-slate-500 focus:border-slate-500 focus:outline-hidden disabled:cursor-not-allowed disabled:opacity-50',
            isAutoBetInputNegative && 'border-red-500 hover:border-red-400 focus:border-red-400',
          )}
        />
        {#if autoBetInput === 0}
          <Infinity class="absolute top-4 right-3 size-4 text-[#AF6B17] " weight="bold" />
        {/if}
      </div>
      {#if isAutoBetInputNegative}
        <p class="text-xs leading-5 text-red-400">This must be greater than or equal to 0.</p>
      {/if}
    </div>
  {/if}

  <button
    onclick={handleBetClick}
    disabled={isDropBallDisabled}
    class={twMerge(
      'btn-bet mx-auto flex max-w-[25rem] min-w-[18rem] touch-manipulation items-center justify-center rounded-4xl py-3 font-semibold text-white transition-colors',
      isDropBallDisabled ? 'cursor-not-allowed bg-gray-400 opacity-50' : '',
      autoBetInterval !== null && '  ',
    )}
  >
    {#if betMode === BetMode.MANUAL}
      {getPlayText()}
      {#if isBetLoading == true}
        <!-- <CircleNotch class="text-white-500 ml-1 inline-block size-5 animate-spin" weight="bold" /> -->
        <img src={betGif} alt="loading" class="size-6" />
      {/if}
    {:else if autoBetInterval === null}
      Start Autobet
      {#if isBetLoading == true}
        <!-- <CircleNotch class="text-white-500 ml-1 inline-block size-5 animate-spin" weight="bold" /> -->
        <img src={betGif} alt="loading" class="size-6" />
      {/if}
    {:else}
      Stop Autobet
      {#if isBetLoading == true}
        <!-- <CircleNotch class="text-white-500 ml-1 inline-block size-5 animate-spin" weight="bold" /> -->
        <img src={betGif} alt="loading" class="size-6" />
      {/if}
    {/if}
  </button>
  {#if false}
    <div class="mt-auto pt-5">
      <div class="border-tpt-3 flex items-center gap-4">
        <Tooltip.Provider delayDuration={0} disableCloseOnTriggerClick>
          <!-- Settings Button -->
          <!-- <Tooltip.Root>
          <Tooltip.Trigger
            onclick={() => ($isGameSettingsOpen = !$isGameSettingsOpen)}
            class={twMerge(
              'rounded-full p-2 text-slate-300 transition hover:bg-slate-600 active:bg-slate-500',
              $isGameSettingsOpen && 'text-slate-100',
            )}
          >
            <GearSix class="size-6" weight="fill" />
          </Tooltip.Trigger>
          <Tooltip.Content
            forceMount
            sideOffset={4}
            class="z-30 max-w-lg rounded-md bg-white p-3 text-sm font-medium text-gray-950 drop-shadow-xl"
          >
            {#snippet child({ wrapperProps, props, open })}
              {#if open}
                <div {...wrapperProps}>
                  <div {...props} transition:flyAndScale>
                    <Tooltip.Arrow class="text-white" />
                    <p>{$isGameSettingsOpen ? 'Close' : 'Open'} Game Settings</p>
                  </div>
                </div>
              {/if}
            {/snippet}
          </Tooltip.Content>
        </Tooltip.Root> -->

          <!-- Live Stats Button -->
          <Tooltip.Root>
            <Tooltip.Trigger
              onclick={() => ($isLiveStatsOpen = !$isLiveStatsOpen)}
              class={twMerge(
                'rounded-full p-2 text-slate-300 transition hover:bg-slate-600 active:bg-slate-500',
                $isLiveStatsOpen && 'text-slate-100',
              )}
            >
              <ChartLine class="size-6" weight="bold" />
            </Tooltip.Trigger>
            <Tooltip.Content
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
            </Tooltip.Content>
          </Tooltip.Root>
        </Tooltip.Provider>
      </div>
    </div>
  {/if}
</div>

<style>
  .textshadow {
    /* font-size: 18px; */
    /* box-shadow: 0px 1px 0px 0px rgba(255, 255, 255, 0.5); */

    /* text-shadow: 1px 1px 0 #552200; */
  }
  .btn-bet {
    height: 54px;
    padding-bottom: 16px;
    background-image: url('$lib/assets/btn_bet.png');
    background-repeat: no-repeat;
    background-size: 100% 54px;
    /* &:disabled {
      background-image: none;
    } */
  }
</style>
