import Api from "./Api";

export default {
  pushRestart(macAddress) {
    return Api({ daemonRequest: true }).post(`/kiosks/push-restart/${macAddress}`);
  },
  restartApp(macAddress) {
    return Api({ daemonRequest: true }).post(`/kiosks/restart-app/${macAddress}`);
  },
  updateApp(macAddress, version) {
    return Api({ daemonRequest: true }).post(`/kiosks/update-app/${macAddress}`, { key: version });
  },
  remoteShowScreen(macAddress) {
    return Api({ daemonRequest: true }).post(`/kiosks/remote-show-screen/${macAddress}`);
  },
  kioskLogging(macAddress) {
    return Api({ daemonRequest: true }).post(`/kiosks/kiosk-logging/${macAddress}`);
  },
  forceResyncWithLogs(macAddress) {
    return Api({ daemonRequest: true }).post(`/kiosks/force-resync-with-logs/${macAddress}`);
  },
  pullDatabase(macAddress) {
    return Api({ daemonRequest: true }).post(`/kiosks/pull-database/${macAddress}`);
  },
  openDoor(macAddress) {
    return Api({ daemonRequest: true }).post(`/kiosks/open-door/${macAddress}`);
  },
  refreshFaceLibrary(macAddress) {
    return Api({ daemonRequest: true }).post(`/kiosks/refresh-face-library/${macAddress}`);
  },
  fetchAppVersions() {
    return Api({ daemonRequest: true }).get(`/kiosks/app-versions`);
  },
  fetchRequestLogs() {
    return Api({ daemonRequest: true }).get(`/kiosks/requests`);
  },
  fetchKioskRequestLogs(macAddress) {
    return Api({ daemonRequest: true }).get(`/kiosks/requests/${macAddress}`);
  },
  getKioskInfo(macAddress) {
    return Api({ daemonRequest: true }).get(`/kiosks/${macAddress}`);
  }
};
