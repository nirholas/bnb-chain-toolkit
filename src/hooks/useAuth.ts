/**
 * ✨ built by nich
 * 🌐 GitHub: github.com/nirholas
 * 💫 Privy authentication hook
 */

import { useMemo, useCallback } from 'react';
import { isPrivyConfigured } from '@/providers/PrivyProvider';

export interface UserProfile {
  id: string;
  email?: string;
  wallet?: string;
  name?: string | null;
  avatar?: string;
  createdAt: Date;
  linkedAccounts: {
    type: string;
    address?: string;
    email?: string;
    username?: string | null;
  }[];
}

// Default empty auth state when Privy is not configured
const emptyAuthState = {
  ready: true,
  isAuthenticated: false,
  user: null,
  profile: null,
  wallets: [],
  primaryWallet: null,
  login: () => {},
  logout: () => {},
  linkEmail: () => {},
  linkWallet: () => {},
  linkGoogle: () => {},
  linkGithub: () => {},
  linkTwitter: () => {},
  unlinkEmail: () => {},
  unlinkWallet: () => {},
};

/**
 * Authentication hook that wraps Privy.
 * Returns a no-op state when Privy is not configured.
 * 
 * Note: isPrivyConfigured is a build-time constant so both branches
 * always call the same number of hooks across renders.
 */
export function useAuth() {
  // If Privy is not configured, we still need to call hooks unconditionally
  // but we can return early after them.
  
  // Always call all hooks — order must be stable across renders
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const privyModule = isPrivyConfigured
    ? require('@privy-io/react-auth')
    : null;

  const privyState = privyModule?.usePrivy?.() ?? {
    ready: true,
    authenticated: false,
    user: null,
    login: () => {},
    logout: () => {},
    linkEmail: () => {},
    linkWallet: () => {},
    linkGoogle: () => {},
    linkGithub: () => {},
    linkTwitter: () => {},
    unlinkEmail: () => {},
    unlinkWallet: () => {},
  };

  const walletsState = privyModule?.useWallets?.() ?? { wallets: [] };

  const { 
    ready, 
    authenticated, 
    user, 
    login, 
    logout,
    linkEmail,
    linkWallet,
    linkGoogle,
    linkGithub,
    linkTwitter,
    unlinkEmail,
    unlinkWallet,
  } = privyState;
  
  const { wallets } = walletsState;

  const primaryWallet = useMemo(() => {
    if (!wallets || wallets.length === 0) return null;
    return wallets.find((w: any) => w.walletClientType === 'privy') || wallets[0];
  }, [wallets]);

  const profile: UserProfile | null = useMemo(() => {
    if (!user) return null;

    const linkedAccounts = [];
    
    if (user.email) {
      linkedAccounts.push({
        type: 'email',
        email: user.email.address,
      });
    }
    
    for (const wallet of user.linkedAccounts.filter((a: any) => a.type === 'wallet')) {
      linkedAccounts.push({
        type: 'wallet',
        address: (wallet as any).address,
      });
    }
    
    if (user.google) {
      linkedAccounts.push({
        type: 'google',
        email: user.google.email,
        username: user.google.name,
      });
    }
    
    if (user.github) {
      linkedAccounts.push({
        type: 'github',
        username: user.github.username,
      });
    }
    
    if (user.twitter) {
      linkedAccounts.push({
        type: 'twitter',
        username: user.twitter.username,
      });
    }

    return {
      id: user.id,
      email: user.email?.address,
      wallet: user.wallet?.address,
      name: user.google?.name || user.twitter?.name || user.github?.username,
      avatar: (user.google as any)?.picture || user.twitter?.profilePictureUrl,
      createdAt: new Date(user.createdAt),
      linkedAccounts,
    };
  }, [user]);

  // If Privy is not configured, return the empty state
  if (!isPrivyConfigured) {
    return emptyAuthState;
  }

  return {
    ready,
    isAuthenticated: authenticated,
    user,
    profile,
    wallets,
    primaryWallet,
    login,
    logout,
    linkEmail,
    linkWallet,
    linkGoogle,
    linkGithub,
    linkTwitter,
    unlinkEmail,
    unlinkWallet,
  };
}

export default useAuth;
