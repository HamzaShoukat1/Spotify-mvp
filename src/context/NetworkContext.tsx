import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import NetInfo, { NetInfoState } from "@react-native-community/netinfo";

interface NetworkContextValue {
  isConnected: boolean | null;
  isInternetReachable: boolean | null;
  isOffline: boolean;
  refreshNetwork: () => Promise<void>;
}

const NetworkContext = createContext<NetworkContextValue>({
  isConnected: true,
  isInternetReachable: true,
  isOffline: false,
  refreshNetwork: async () => { },
});

export const NetworkProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [netState, setNetState] = useState<{
    isConnected: boolean | null;
    isInternetReachable: boolean | null;
  }>({
    isConnected: true,
    isInternetReachable: true,
  });

  useEffect(() => {
    NetInfo.fetch().then((state: NetInfoState) => {
      setNetState({
        isConnected: state.isConnected,
        isInternetReachable: state.isInternetReachable,
      });
    });

    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      setNetState({
        isConnected: state.isConnected,
        isInternetReachable: state.isInternetReachable,
      });
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const refreshNetwork = async () => {
    const state = await NetInfo.refresh();
    setNetState({
      isConnected: state.isConnected,
      isInternetReachable: state.isInternetReachable,
    });
  };

  const isOffline = useMemo(() => {
    if (netState.isConnected === false) return true;
    if (netState.isInternetReachable === false) return true;
    return false;
  }, [netState.isConnected, netState.isInternetReachable]);

  const value = useMemo(
    () => ({
      isConnected: netState.isConnected,
      isInternetReachable: netState.isInternetReachable,
      isOffline,
      refreshNetwork,
    }),
    [netState.isConnected, netState.isInternetReachable, isOffline]
  );

  return (
    <NetworkContext.Provider value={value}>{children}</NetworkContext.Provider>
  );
};

export const useNetwork = () => useContext(NetworkContext);
