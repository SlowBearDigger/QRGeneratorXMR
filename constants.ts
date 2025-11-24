import { CryptoType } from './types';

export const MY_XMR_ADDRESS = '42w9YaCW8UwZ2BmQztNmUd6JgYVcjW7LXEMTcQqHdmtFCsSo5RGY2eQg2iZ3WyBSSs63gnhczLkJ46yfr4ojCXWT3H1ZBbR';
export const DONATION_XMR_ADDRESS = '42w9YaCW8UwZ2BmQztNmUd6JgYVcjW7LXEMTcQqHdmtFCsSo5RGY2eQg2iZ3WyBSSs63gnhczLkJ46yfr4ojCXWT3H1ZBbR';
export const MONERO_ORANGE = '#F7B731';
export const TWITTER_HANDLE = 'SlowBearDigger';
export const TWITTER_SHARE_URL = 'https://twitter.com/intent/tweet';

export const cryptoOptions: { 
  id: CryptoType; 
  label: string; 
  placeholder: string; 
  uri: string; 
  regex: RegExp | null; 
  supportsMessage: boolean; 
  messageParam: string; 
  labelParam?: string; 
}[] = [
  { 
    id: 'custom', 
    label: 'Custom / URL', 
    placeholder: 'https://myshop.com or plain text', 
    uri: '', 
    regex: null, 
    supportsMessage: false, 
    messageParam: '' 
  },
  { id: 'monero', label: 'Monero (XMR)', placeholder: 'Enter Monero address', uri: 'monero', regex: /^[48][1-9A-HJ-NP-Za-km-z]{94}$/, supportsMessage: true, messageParam: 'tx_description', labelParam: 'recipient_name' },
  { id: 'bitcoin', label: 'Bitcoin (BTC)', placeholder: 'Enter Bitcoin address', uri: 'bitcoin', regex: /^(bc1p|bc1q|[13])[a-zA-HJ-NP-Z0-9]{25,90}$/, supportsMessage: true, messageParam: 'message', labelParam: 'label' },
  { id: 'ethereum', label: 'Ethereum (ETH)', placeholder: 'Enter Ethereum address', uri: 'ethereum', regex: /^0x[a-fA-F0-9]{40}$/, supportsMessage: false, messageParam: '' },
  { id: 'solana', label: 'Solana (SOL)', placeholder: 'Enter Solana address', uri: 'solana', regex: /^[1-9A-HJ-NP-Za-km-z]{32,44}$/, supportsMessage: false, messageParam: 'label' },
  { id: 'zcash', label: 'Zcash (ZEC)', placeholder: 'Enter Zcash address', uri: 'zcash', regex: /^t[13][a-zA-Z0-9]{33}$|^z[a-zA-Z0-9]{94}$|^zs[a-zA-Z0-9]{76}$/, supportsMessage: true, messageParam: 'memo' },
  { id: 'firo', label: 'Firo (FIRO)', placeholder: 'Enter Firo address', uri: 'firo', regex: /^a[1-9A-HJ-NP-Za-km-z]{33}$|^sm1[0-9a-z]{100,}$/, supportsMessage: true, messageParam: 'message' }
];