const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Navigation
  navigateTo: (url) => ipcRenderer.invoke('navigate-to', url),
  
  // Search functionality
  searchQuery: (query) => ipcRenderer.invoke('search-query', query),
  
  // AI functionality
  aiQuery: (query) => ipcRenderer.invoke('ai-query', query),
  
  // Browser controls
  goBack: () => ipcRenderer.invoke('go-back'),
  goForward: () => ipcRenderer.invoke('go-forward'),
  refresh: () => ipcRenderer.invoke('refresh-page'),
  
  // Utility functions
  openExternal: (url) => ipcRenderer.invoke('open-external', url),
  
  // Event listeners
  onNavigationUpdate: (callback) => ipcRenderer.on('navigation-update', callback),
  removeNavigationListener: () => ipcRenderer.removeAllListeners('navigation-update')
});

// DOM loaded handler
window.addEventListener('DOMContentLoaded', () => {
  console.log('Think AI Browser loaded');
});
