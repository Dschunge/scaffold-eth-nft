import { useState, useEffect }  from 'react';

/* How to use it in a Component
let connection = useNetworkStatus();
<div>
          <div>downlink: {connection.downlink}</div>
          <div>effectiveType: {connection.effectiveType}</div>
          <div>rtt: {connection.rtt}</div>
          <div>type: {connection.type}</div>
          <div>saveData: {connection.saveData ? "yes" : "no"}</div>
        </div>

*/
function getConnection() {
  // @ts-ignore
  return navigator.connection || navigator.mozConnection || navigator.webkitConnection;
}

function useNetworkStatus() {
  let [connection, updateNetworkConnection] = useState(getConnection());

  useEffect(() => {
    function updateConnectionStatus() {
      updateNetworkConnection(getConnection());
    }

    connection.addEventListener("change", updateConnectionStatus);
    return () => {
      connection.removeEventListener("change", updateConnectionStatus);
    };
  }, [connection]);

  return connection;
}

export default useNetworkStatus;