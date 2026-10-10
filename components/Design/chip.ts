/** Filter chip (blog categories, decor colours): a 44 px pill, graphite when active. */
export const chipClass = (active: boolean): string =>
  `os-press inline-flex min-h-[44px] flex-none items-center gap-1.5 rounded-full border px-4 text-[0.84rem] font-medium no-underline ${
    active ? 'border-brand-dark bg-brand-dark text-brand-light' : 'border-brand-line text-brand-dark hover:border-brand-dark'
  }`;
