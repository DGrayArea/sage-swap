export interface TabProps {
  active: string;
  setActive: (selected: string) => void;
}

export interface Coin {
  logoURI?: string;
  symbol?: string;
  contract?: string;
  address?: string;
  name?: string;
  balance?: string | number;
  decimals?: number | string;
}

export interface SwapInput {
  headline: string;
  amount: string | number;
  setAmount: (amt: string | number, wei: string | number) => void;
  usdValue?: string | number;
  coin?: Coin;
  index: number | string;
  balance?: string | number;
  loading?: boolean;
}

export interface ModalStore {
  modalState: boolean;
  modalIndex: number | string;
  toogleModal: (state: boolean) => void;
  toogleIndex: (index: number | string) => void;
}

export interface LiquidityStore {
  noLiquidity: boolean;
  setNoLiquidity: (state: boolean) => void;
}

export interface CoinStore {
  coinIn: Coin;
  coinOut: Coin | Object | any;
  handleIn: (coin: Coin) => void;
  handleOut: (coin: Coin) => void;
}

export interface AmountStore {
  amountIn: Amount;
  amountOut: Amount;
  handleIn: (amt: string | number, wei: string | number) => void;
  handleOut: (amt: string | number, wei: string | number) => void;
}
export interface Quote {
  toAmount: string;
  fromToken?: Token;
  toToken?: Token;
  protocols?: Protocol[];
  gas?: number;
}

export interface Protocol {
  name: string;
  part: number;
  fromTokenAddress: string;
  toTokenAddress: string;
}

export interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI: string;
  domainVersion: string;
  eip2612: boolean;
  isFoT: boolean;
  tags: Array<string>;
}

export interface SlippageStore {
  slippageState: boolean;
  slippage: number | string;
  toogleState: (state: boolean) => void;
  setSlippage: (index: number | string) => void;
}
export interface Amount {
  amount: string | number;
  amountWei: string | number;
}
