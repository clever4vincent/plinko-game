import { toast } from '@zerodevx/svelte-toast';
export { toast };
export const success = (m: string) =>
  toast.push(m, {
    theme: {
      '--toastBackground': 'green',
      '--toastColor': 'white',
      '--toastBarBackground': 'olive',
    },
  });

export const warning = (m: string) =>
  toast.push(m, {
    theme: {
      '--toastBackground': '#f0af6e',
      '--toastColor': 'white',
      '--toastBarBackground': '#822800',
    },
  });

export const failure = (m: string) =>
  toast.push(m, {
    theme: {
      '--toastBackground': '#FF3434',
      '--toastColor': 'white',
      '--toastBarBackground': '#822800',
    },
  });
