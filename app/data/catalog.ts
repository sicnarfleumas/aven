export type Look = {
  handle: string
  title: string
  copy: string
  gsm: string
  amount: number
  shirt: string
  ink: string
  pocket?: boolean
}

export type Edit = {
  handle: string
  pieces: string[]
}

export const looks: Look[] = [
  {
    handle: 'everyday-tee',
    title: 'Everyday Tee',
    copy: 'everyday',
    gsm: '240 GSM',
    amount: 1490,
    shirt: '#E8D2B6',
    ink: '#2A1C14',
  },
  {
    handle: 'heavyweight-tee',
    title: 'Heavyweight Tee',
    copy: 'heavyweight',
    gsm: '280 GSM',
    amount: 1790,
    shirt: '#D4B496',
    ink: '#2A1C14',
  },
  {
    handle: 'longline-tee',
    title: 'Longline Tee',
    copy: 'longline',
    gsm: '240 GSM',
    amount: 1690,
    shirt: '#E2C6A4',
    ink: '#2A1C14',
  },
  {
    handle: 'pocket-tee',
    title: 'Pocket Tee',
    copy: 'pocket',
    gsm: '220 GSM',
    amount: 1590,
    shirt: '#F0D7BC',
    ink: '#2A1C14',
    pocket: true,
  },
  {
    handle: 'night-tee',
    title: 'Night Tee',
    copy: 'night',
    gsm: '240 GSM',
    amount: 1490,
    shirt: '#3A2A22',
    ink: '#E9E0D4',
  },
]

export const edits: Edit[] = [
  { handle: 'tees', pieces: looks.map(look => look.handle) },
  { handle: 'heavyweight', pieces: ['heavyweight-tee'] },
  { handle: 'essentials', pieces: ['everyday-tee', 'pocket-tee', 'night-tee'] },
]

export const findLook = (handle: string) => looks.find(look => look.handle === handle)

export const findEdit = (handle: string) => edits.find(edit => edit.handle === handle)

export const looksFor = (edit: Edit) => edit.pieces
  .map(handle => findLook(handle))
  .filter((look): look is Look => Boolean(look))
