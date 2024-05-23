import { toHex } from "viem";

export const __CHAIN_IDS__ = {
  bera_testnet: 80085,
  sepolia: 11155111,
  bsc_testnet: 97
};

export const __CHAIN_INFO__ = {
  [__CHAIN_IDS__.bera_testnet]: {
    name: "bera testnet",
    image: "/images/berachain.svg",
    chainIDHex: toHex(__CHAIN_IDS__.bera_testnet),
    isTestnet: true,
    explorer: "https://artio.beratrail.io"
  },
  [__CHAIN_IDS__.sepolia]: {
    name: "Ethereum Sepolia",
    image: "/images/ethereum.svg",
    chainIDHex: toHex(__CHAIN_IDS__.sepolia),
    isTestnet: true,
    explorer: "https://sepolia.etherscan.io"
  },
  [__CHAIN_IDS__.bsc_testnet]: {
    name: "BSC Testnet",
    image: "/images/smartchain.svg",
    chainIDHex: toHex(__CHAIN_IDS__.bsc_testnet),
    isTestnet: true,
    explorer: "https://testnet.bscscan.com"
  }
};

export const __PROVIDERS__ = {
  metaMask: {
    image: "/images/metamask.svg",
    name: "Metamask"
  },
  walletConnect: {
    image: "/images/walletconnect.svg",
    name: "WalletConnect"
  },
  coinbaseWalletSDK: {
    image: "/images/coinbase.svg",
    name: "Coinbase Wallet"
  },
  safe: {
    image: "/images/safe.svg",
    name: "Safe Wallet"
  },
  trust: {
    image: "/images/trust.svg",
    name: "Trust Wallet"
  }
};

export const __RPCS__ = {
  [__CHAIN_IDS__.bera_testnet]: [
    { serviceName: "Ankr", url: "https://rpc.ankr.com/berachain_testnet" },
    { serviceName: "Berachain", url: "https://artio.rpc.berachain.com" }
  ],
  [__CHAIN_IDS__.sepolia]: [
    { serviceName: "Tenderly", url: "https://sepolia.gateway.tenderly.co" },
    { serviceName: "Blockpi", url: "https://ethereum-sepolia.blockpi.network/v1/rpc/public" },
    { serviceName: "1RPC", url: "https://1rpc.io/sepolia" },
    { serviceName: "Public Node", url: "https://ethereum-sepolia-rpc.publicnode.com" },
    { serviceName: "Blast API", url: "https://eth-sepolia.public.blastapi.io" }
  ],
  [__CHAIN_IDS__.bsc_testnet]: [{ serviceName: "Ankr", url: "https://rpc.ankr.com/bsc_testnet_chapel" }]
};

export const __STRINGS__ = {
  app_title: "moniswap",
  __networks__: {
    mainnet: "mainnet",
    testnet: "testnet"
  },
  __link_titles__: {
    swap: "swap",
    overview: "overview",
    pools: "pools",
    vote: "vote",
    lock: "lock",
    incentivize: "incentivize",
    launchpad: "launchpad",
    early_access: "early access",
    nfts: "NFTs"
  },
  __headers__: {
    call_to_swap: "Swap between your favorite Berachain assets on Moniswap.",
    call_to_liquidity:
      "Liquidity providers (LPs) make low-slippage swaps possible. Deposit and stake liquidity to earn MONI points."
  },
  __actions__: {
    connect_wallet: "connect wallet",
    provide_feedback: "provide feedback",
    slippage: "slippage",
    connect_wallet_ex: "Connect wallet in one click to start using Moniswap.",
    create_liquidity: "create liquidity"
  },
  __misc__: {
    v: "Moniswap v1.0.0",
    vo: "View-only permissions: We can't do anything without your approval.",
    new: "New to Web3?",
    learn: "Learn about wallets.",
    liquidity: "liquidity pools",
    token_list: "token list"
  },
  __lng__: {
    francais: "fr",
    english: "en",
    español: "es"
  }
};

export const __TRANSLATION__ = {
  en: {
    translation: {
      [__STRINGS__.app_title]: __STRINGS__.app_title,
      ...__STRINGS__.__link_titles__,
      ...__STRINGS__.__actions__,
      ...__STRINGS__.__misc__,
      ...__STRINGS__.__headers__
    }
  },
  fr: {
    translation: {
      [__STRINGS__.app_title]: __STRINGS__.app_title,
      [__STRINGS__.__link_titles__.swap]: "échanger",
      [__STRINGS__.__link_titles__.early_access]: "accès anticipé",
      [__STRINGS__.__link_titles__.overview]: "vue générale de",
      [__STRINGS__.__link_titles__.incentivize]: "inciter",
      [__STRINGS__.__link_titles__.lock]: "coffres",
      [__STRINGS__.__link_titles__.pools]: "liquidité",
      [__STRINGS__.__link_titles__.vote]: "vote",
      [__STRINGS__.__actions__.connect_wallet]: "connecter le portefeuille",
      [__STRINGS__.__actions__.provide_feedback]: "donner votre avis",
      [__STRINGS__.__link_titles__.launchpad]: "rampe de lancement",
      [__STRINGS__.__headers__.call_to_swap]: "Échangez entre vos actifs Berachain préférés sur Moniswap.",
      [__STRINGS__.__actions__.connect_wallet_ex]:
        "Connectez le portefeuille en un clic pour commencer à utiliser Moniswap.",
      [__STRINGS__.__misc__.vo]:
        "Autorisations d'affichage uniquement : nous ne pouvons rien faire sans votre approbation.",
      [__STRINGS__.__misc__.new]: "Nouveau sur Web3 ?",
      [__STRINGS__.__misc__.learn]: "Apprenez-en davantage sur les portefeuilles.",
      [__STRINGS__.__misc__.liquidity]: "pools de liquidités",
      [__STRINGS__.__headers__.call_to_liquidity]:
        "Les fournisseurs de liquidité (LP) permettent des swaps à faible glissement. Déposez et misez des liquidités pour gagner des points MONI.",
      [__STRINGS__.__misc__.token_list]: "liste de jetons",
      [__STRINGS__.__actions__.create_liquidity]: "créer de la liquidité"
    }
  },
  es: {
    translation: {
      [__STRINGS__.__link_titles__.swap]: "intercambio",
      [__STRINGS__.__link_titles__.early_access]: "acceso temprano",
      [__STRINGS__.__link_titles__.overview]: "descripción general",
      [__STRINGS__.__link_titles__.incentivize]: "incentivar",
      [__STRINGS__.__link_titles__.lock]: "caja de seguridad",
      [__STRINGS__.__link_titles__.pools]: "liquidez",
      [__STRINGS__.__link_titles__.vote]: "votar",
      [__STRINGS__.__actions__.connect_wallet]: "conectar billetera",
      [__STRINGS__.__actions__.provide_feedback]: "dar opinion",
      [__STRINGS__.__link_titles__.launchpad]: "plataforma de lanzamiento",
      [__STRINGS__.__headers__.call_to_swap]: "Intercambie entre sus activos Berachain favoritos en Moniswap.",
      [__STRINGS__.__actions__.connect_wallet_ex]: "Conecte la billetera con un clic para comenzar a usar Moniswap.",
      [__STRINGS__.__misc__.vo]: "Permisos de solo visualización: no podemos hacer nada sin su aprobación.",
      [__STRINGS__.__misc__.new]: "¿Nuevo en Web3?",
      [__STRINGS__.__misc__.learn]: "Aprenda sobre billeteras.",
      [__STRINGS__.__misc__.liquidity]: "fondos de liquidez",
      [__STRINGS__.__headers__.call_to_liquidity]:
        "Los proveedores de liquidez (LP) hacen posibles swaps de bajo deslizamiento. Deposite y apueste liquidez para ganar puntos MONI.",
      [__STRINGS__.__misc__.token_list]: "lista de tokens",
      [__STRINGS__.__actions__.create_liquidity]: "crear liquidez"
    }
  }
};

export const __LANGUAGES__ = {
  [__STRINGS__.__lng__.francais]: "français",
  [__STRINGS__.__lng__.english]: "english",
  [__STRINGS__.__lng__.español]: "español"
};

export const __AGGREGATOR_ROUTERS__ = {
  [__CHAIN_IDS__.bsc_testnet]: "0xA2Af4FAe0d22608E3d34698F03ba4c4f75201a73"
};
