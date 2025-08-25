// DOM Elements
const startPage = document.getElementById('start-page');
const browserContent = document.getElementById('browser-content');
const aiPanel = document.getElementById('ai-panel');

// Tab elements
const tabsContainer = document.getElementById('tabs-container');
const newTabBtn = document.getElementById('new-tab-btn');
const webviewContainer = document.getElementById('webview-container');

// Navigation elements
const backBtn = document.getElementById('back-btn');
const forwardBtn = document.getElementById('forward-btn');
const refreshBtn = document.getElementById('refresh-btn');
const urlInput = document.getElementById('url-input');
const goBtn = document.getElementById('go-btn');

// Search elements
const mainSearch = document.getElementById('main-search');
const searchBtn = document.getElementById('search-btn');
const aiSearchBtn = document.getElementById('ai-search-btn');
const voiceBtn = document.getElementById('voice-btn');
const researchBtn = document.getElementById('research-btn');
const submitBtn = document.getElementById('submit-btn');

// File upload elements
const fileUploadBtn = document.getElementById('file-upload-btn');
const fileInput = document.getElementById('file-input');
const filePreviewArea = document.getElementById('file-preview-area');
const uploadedFiles = document.getElementById('uploaded-files');
const searchBox = document.getElementById('search-box');

// AI elements
const aiBtn = document.getElementById('ai-btn');
const closeAiBtn = document.getElementById('close-ai-btn');
const aiInput = document.getElementById('ai-input');
const aiSendBtn = document.getElementById('ai-send-btn');
const aiMessages = document.getElementById('ai-messages');

// Other elements
const customizeBtn = document.getElementById('customize-btn');
const menuBtn = document.getElementById('menu-btn');
const profileBtn = document.getElementById('profile-btn');

// Tab stack elements
const tabStackBtn = document.getElementById('tab-stack-btn');
const tabStackOverlay = document.getElementById('tab-stack-overlay');
const tabStackClose = document.getElementById('tab-stack-close');
const tabStackGrid = document.getElementById('tab-stack-grid');
const newTabFromStack = document.getElementById('new-tab-from-stack');

// State management
let currentUrl = '';
let isAiPanelOpen = false;
let isVoiceRecording = false;

// File upload state
let uploadedFilesList = [];
let dragCounter = 0;

// Tab stack state
let isTabStackOpen = false;

// Tab management
let tabCounter = 1;
let activeTabId = 1;
let tabs = new Map();

// Initialize first tab
tabs.set(1, {
  id: 1,
  title: 'New Tab',
  url: '',
  favicon: null,
  isLoading: false
});

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    setupKeyboardShortcuts();
    console.log('Think AI Browser initialized');
});

// Event Listeners Setup
function setupEventListeners() {
    // Tab events
    newTabBtn.addEventListener('click', createNewTab);
    setupTabEventListeners();

    // Navigation events
    backBtn.addEventListener('click', handleBack);
    forwardBtn.addEventListener('click', handleForward);
    refreshBtn.addEventListener('click', handleRefresh);
    goBtn.addEventListener('click', handleGo);
    urlInput.addEventListener('keypress', handleUrlKeypress);

    // Search events
    searchBtn.addEventListener('click', handleSearch);
    aiSearchBtn.addEventListener('click', handleAiSearch);
    voiceBtn.addEventListener('click', handleVoiceSearch);
    researchBtn.addEventListener('click', handleResearch);
    submitBtn.addEventListener('click', handleSubmit);
    mainSearch.addEventListener('keypress', handleMainSearchKeypress);

    // File upload events
    fileUploadBtn.addEventListener('click', handleFileUploadClick);
    fileInput.addEventListener('change', handleFileSelect);
    
    // Drag and drop events
    searchBox.addEventListener('dragover', handleDragOver);
    searchBox.addEventListener('dragenter', handleDragEnter);
    searchBox.addEventListener('dragleave', handleDragLeave);
    searchBox.addEventListener('drop', handleDrop);

    // AI panel events
    aiBtn.addEventListener('click', toggleAiPanel);
    closeAiBtn.addEventListener('click', closeAiPanel);
    aiSendBtn.addEventListener('click', sendAiMessage);
    aiInput.addEventListener('keypress', handleAiInputKeypress);

    // Tab stack events
    tabStackBtn.addEventListener('click', toggleTabStack);
    tabStackClose.addEventListener('click', hideTabStack);
    tabStackOverlay.addEventListener('click', handleStackOverlayClick);
    newTabFromStack.addEventListener('click', createNewTabFromStack);

    // Other events
    customizeBtn.addEventListener('click', handleCustomize);
    menuBtn.addEventListener('click', handleMenu);
    profileBtn.addEventListener('click', handleProfile);
}

// Keyboard shortcuts
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + L - Focus address bar
        if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
            e.preventDefault();
            urlInput.focus();
            urlInput.select();
        }
        
        // Ctrl/Cmd + T - New tab
        if ((e.ctrlKey || e.metaKey) && e.key === 't') {
            e.preventDefault();
            createNewTab();
        }
        
        // Ctrl/Cmd + W - Close tab
        if ((e.ctrlKey || e.metaKey) && e.key === 'w') {
            e.preventDefault();
            closeTab(activeTabId);
        }
        
        // Ctrl/Cmd + Shift + T - Reopen closed tab (placeholder)
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
            e.preventDefault();
            // TODO: Implement reopen closed tab
        }
        
        // Ctrl/Cmd + R - Refresh
        if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
            e.preventDefault();
            handleRefresh();
        }
        
        // F5 - Refresh
        if (e.key === 'F5') {
            e.preventDefault();
            handleRefresh();
        }
        
        // Escape - Close AI panel or tab stack
        if (e.key === 'Escape') {
            if (isTabStackOpen) {
                hideTabStack();
            } else if (isAiPanelOpen) {
                closeAiPanel();
            }
        }
    });
}

// Navigation Functions
async function handleBack() {
    try {
        // TODO: Implement browser back functionality
        console.log('Back button clicked');
    } catch (error) {
        console.error('Error going back:', error);
    }
}

async function handleForward() {
    try {
        // TODO: Implement browser forward functionality
        console.log('Forward button clicked');
    } catch (error) {
        console.error('Error going forward:', error);
    }
}

async function handleRefresh() {
  try {
    console.log('Refresh button clicked');
    
    // Add Chrome-like loading animation
    refreshBtn.classList.add('loading');
    
    const currentTab = tabs.get(activeTabId);
    
    if (browserContent.style.display === 'block' && currentTab && currentTab.url) {
      // If we're viewing a page, refresh the webview
      const webview = getCurrentWebview();
      if (webview && webview.src && webview.src !== 'about:blank') {
        
        // Show loading state in tab title
        updateTabTitle(activeTabId, 'Reloading...');
        
        // Reload the webview
        webview.reload();
        
        // Listen for page load completion
        const handleLoadStop = () => {
          refreshBtn.classList.remove('loading');
          webview.removeEventListener('dom-ready', handleLoadStop);
          
          // Update tab title back to domain
          try {
            const domain = new URL(currentTab.url).hostname;
            updateTabTitle(activeTabId, domain);
          } catch (e) {
            updateTabTitle(activeTabId, 'Page');
          }
          
          console.log('Page refreshed successfully');
        };
        
        webview.addEventListener('dom-ready', handleLoadStop);
        
        // Fallback to remove loading state after timeout
        setTimeout(() => {
          refreshBtn.classList.remove('loading');
          if (webview.removeEventListener) {
            webview.removeEventListener('dom-ready', handleLoadStop);
          }
        }, 10000); // 10 second timeout
        
      } else {
        // No valid page to refresh
        refreshBtn.classList.remove('loading');
        console.log('Nothing to refresh');
      }
    } else {
      // We're on start page - refresh the interface
      resetStartPageForNewTab();
      refreshBtn.classList.remove('loading');
      console.log('Start page refreshed');
    }
    
  } catch (error) {
    console.error('Error refreshing:', error);
    refreshBtn.classList.remove('loading');
    
    // Reset tab title on error
    const currentTab = tabs.get(activeTabId);
    if (currentTab && currentTab.url) {
      try {
        const domain = new URL(currentTab.url).hostname;
        updateTabTitle(activeTabId, domain);
      } catch (e) {
        updateTabTitle(activeTabId, 'Error');
      }
    }
  }
}

async function handleGo() {
    const url = urlInput.value.trim();
    if (url) {
        await navigateToUrl(url);
    }
}

function handleUrlKeypress(e) {
    if (e.key === 'Enter') {
        handleGo();
    }
}

// Search Functions
async function handleSearch() {
    const query = mainSearch.value.trim();
    if (query) {
        await performSearch(query);
    }
}

async function handleAiSearch() {
    const query = mainSearch.value.trim();
    if (query) {
        await performAiSearch(query);
    }
}

async function handleVoiceSearch() {
    if (!isVoiceRecording) {
        startVoiceRecording();
    } else {
        stopVoiceRecording();
    }
}

async function handleResearch() {
    const query = mainSearch.value.trim();
    if (query) {
        await performResearch(query);
    }
}

async function handleSubmit() {
    const query = mainSearch.value.trim();
    if (query) {
        // Default to AI search for submit
        await performAiSearch(query);
    }
}

function handleMainSearchKeypress(e) {
    if (e.key === 'Enter') {
        handleSubmit();
    }
}

// Core Navigation Function
async function navigateToUrl(url) {
    try {
        showLoading();
        
        // Validate and format URL
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            // Check if it's a search query or a URL
            if (url.includes('.') && !url.includes(' ')) {
                url = 'https://' + url;
            } else {
                // Treat as search query
                await performSearch(url);
                return;
            }
        }
        
        // Use Electron API to navigate
        const result = await window.electronAPI.navigateTo(url);
        
        if (result.success) {
            currentUrl = result.url;
            urlInput.value = currentUrl;
            showBrowserContent();
            updateWebview(currentUrl);
        } else {
            showError('Failed to navigate: ' + result.error);
        }
    } catch (error) {
        console.error('Navigation error:', error);
        showError('Navigation failed');
    } finally {
        hideLoading();
    }
}

// Search Functions Implementation
async function performSearch(query) {
    try {
        showLoading();
        
        const result = await window.electronAPI.searchQuery(query);
        
        if (result.success) {
            currentUrl = result.url;
            urlInput.value = query;
            showBrowserContent();
            updateWebview(currentUrl);
        } else {
            showError('Search failed: ' + result.error);
        }
    } catch (error) {
        console.error('Search error:', error);
        showError('Search failed');
    } finally {
        hideLoading();
    }
}

async function performAiSearch(query) {
    try {
        showLoading();
        
        // First, show AI panel with loading
        showAiPanel();
        addAiMessage('user', query);
        addAiMessage('ai', 'Thinking...', true);
        
        const result = await window.electronAPI.aiQuery(query);
        
        // Remove loading message
        removeLastAiMessage();
        
        if (result.success) {
            addAiMessage('ai', result.response);
        } else {
            addAiMessage('ai', 'Sorry, I encountered an error: ' + result.error);
        }
    } catch (error) {
        console.error('AI search error:', error);
        removeLastAiMessage();
        addAiMessage('ai', 'Sorry, I encountered an error processing your request.');
    } finally {
        hideLoading();
    }
}

async function performResearch(query) {
    try {
        showLoading();
        
        // Enhanced search with multiple sources
        console.log('Performing research for:', query);
        
        // For now, use regular search but could be enhanced with multiple sources
        await performSearch(query);
        
        // Show AI panel with research context
        showAiPanel();
        addAiMessage('ai', `I found some research results for "${query}". Would you like me to summarize the key findings?`);
        
    } catch (error) {
        console.error('Research error:', error);
        showError('Research failed');
    } finally {
        hideLoading();
    }
}

// Voice Recognition Functions
function startVoiceRecording() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        
        recognition.onstart = () => {
            isVoiceRecording = true;
            voiceBtn.style.background = 'rgba(239, 68, 68, 0.3)';
            voiceBtn.style.color = '#ef4444';
        };
        
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            mainSearch.value = transcript;
            mainSearch.focus();
        };
        
        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            stopVoiceRecording();
        };
        
        recognition.onend = () => {
            stopVoiceRecording();
        };
        
        recognition.start();
    } else {
        showError('Voice recognition not supported in this browser');
    }
}

function stopVoiceRecording() {
    isVoiceRecording = false;
    voiceBtn.style.background = '';
    voiceBtn.style.color = '';
}

// AI Panel Functions
function toggleAiPanel() {
    if (isAiPanelOpen) {
        closeAiPanel();
    } else {
        showAiPanel();
    }
}

function showAiPanel() {
    aiPanel.style.display = 'flex';
    aiPanel.classList.add('fade-in');
    document.querySelector('.main-content').classList.add('ai-panel-open');
    isAiPanelOpen = true;
    aiInput.focus();
}

function closeAiPanel() {
    aiPanel.classList.add('fade-out');
    document.querySelector('.main-content').classList.remove('ai-panel-open');
    setTimeout(() => {
        aiPanel.style.display = 'none';
        aiPanel.classList.remove('fade-in', 'fade-out');
    }, 300);
    isAiPanelOpen = false;
}

function sendAiMessage() {
    const message = aiInput.value.trim();
    if (message) {
        addAiMessage('user', message);
        aiInput.value = '';
        
        // Process AI message
        processAiMessage(message);
    }
}

function handleAiInputKeypress(e) {
    if (e.key === 'Enter') {
        sendAiMessage();
    }
}

async function processAiMessage(message) {
    try {
        addAiMessage('ai', 'Thinking...', true);
        
        const result = await window.electronAPI.aiQuery(message);
        
        removeLastAiMessage();
        
        if (result.success) {
            addAiMessage('ai', result.response);
        } else {
            addAiMessage('ai', 'Sorry, I encountered an error: ' + result.error);
        }
    } catch (error) {
        console.error('AI message error:', error);
        removeLastAiMessage();
        addAiMessage('ai', 'Sorry, I encountered an error processing your message.');
    }
}

function addAiMessage(type, content, isLoading = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `ai-message ${type}`;
    
    if (isLoading) {
        messageDiv.classList.add('loading');
        messageDiv.id = 'loading-message';
    }
    
    const paragraph = document.createElement('p');
    paragraph.textContent = content;
    messageDiv.appendChild(paragraph);
    
    aiMessages.appendChild(messageDiv);
    aiMessages.scrollTop = aiMessages.scrollHeight;
}

function removeLastAiMessage() {
    const loadingMessage = document.getElementById('loading-message');
    if (loadingMessage) {
        loadingMessage.remove();
    }
}

// UI State Management
function showBrowserContent() {
    startPage.style.display = 'none';
    browserContent.style.display = 'block';
}

function showStartPage() {
    startPage.style.display = 'flex';
    browserContent.style.display = 'none';
}

function resetStartPageForNewTab() {
    // Clear the main search input
    mainSearch.value = '';
    
    // Reset any visual states
    mainSearch.blur();
    
    // Add a subtle animation to make it feel fresh
    startPage.style.opacity = '0';
    startPage.style.transform = 'translateY(10px)';
    
    // Animate back to normal
    setTimeout(() => {
        startPage.style.opacity = '';
        startPage.style.transform = '';
    }, 50);
    
    // Focus on search after animation
    setTimeout(() => {
        mainSearch.focus();
    }, 200);
}

function updateWebview(url) {
    const webview = document.getElementById('webview');
    if (webview) {
        webview.src = url;
    }
}

function showLoading() {
    // Add loading state to relevant buttons
    const buttons = [searchBtn, aiSearchBtn, submitBtn];
    buttons.forEach(btn => btn.classList.add('loading'));
}

function hideLoading() {
    // Remove loading state from buttons
    const buttons = [searchBtn, aiSearchBtn, submitBtn];
    buttons.forEach(btn => btn.classList.remove('loading'));
}

function showError(message) {
    // Simple error display - could be enhanced with a proper toast system
    console.error(message);
    // TODO: Implement proper error toast notification
}

// Other Functions
function handleCustomize() {
    console.log('Customize clicked');
    // TODO: Implement customization panel
    showAiPanel();
    addAiMessage('ai', 'Customization options are coming soon! What would you like to customize about your browser experience?');
}

function handleMenu() {
    console.log('Menu clicked');
    // TODO: Implement menu dropdown
}

function handleProfile() {
    console.log('Profile clicked');
    // Show AI panel with profile/account information
    showAiPanel();
    addAiMessage('ai', 'Welcome to your profile! Here you can manage your account settings, view your activity history, and customize your AI browser experience. What would you like to do?');
}

// Utility Functions
function validateUrl(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

function formatUrl(url) {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        return 'https://' + url;
    }
    return url;
}

// Tab Management Functions
function setupTabEventListeners() {
    // Add click listeners to existing tabs
    document.querySelectorAll('.tab').forEach(tab => {
        const tabId = parseInt(tab.dataset.tabId);
        tab.addEventListener('click', (e) => {
            if (!e.target.closest('.tab-close')) {
                switchToTab(tabId);
            }
        });
        
        const closeBtn = tab.querySelector('.tab-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                closeTab(tabId);
            });
        }
    });
}

function createNewTab() {
    tabCounter++;
    const newTabId = tabCounter;
    
    // Add visual feedback to + button
    newTabBtn.style.transform = 'scale(0.9)';
    setTimeout(() => {
        newTabBtn.style.transform = '';
    }, 150);
    
    // Create tab data
    tabs.set(newTabId, {
        id: newTabId,
        title: 'New Tab',
        url: '',
        favicon: null,
        isLoading: false
    });
    
    // Create tab element with initial hidden state
    const tabElement = document.createElement('div');
    tabElement.className = 'tab tab-opening';
    tabElement.id = `tab-${newTabId}`;
    tabElement.dataset.tabId = newTabId;
    tabElement.style.opacity = '0';
    tabElement.style.transform = 'scaleX(0) translateX(-20px)';
    tabElement.style.maxWidth = '0';
    tabElement.style.minWidth = '0';
    tabElement.style.marginRight = '0';
    
    tabElement.innerHTML = `
        <div class="tab-content">
            <div class="tab-favicon">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
                    <path d="M21 3v5h-5"/>
                    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
                    <path d="M3 21v-5h5"/>
                </svg>
            </div>
            <div class="tab-title">New Tab</div>
            <button class="tab-close" title="Close tab">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
            </button>
        </div>
    `;
    
    // Add event listeners
    tabElement.addEventListener('click', (e) => {
        if (!e.target.closest('.tab-close')) {
            switchToTab(newTabId);
        }
    });
    
    const closeBtn = tabElement.querySelector('.tab-close');
    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeTab(newTabId);
    });
    
    // Add to DOM
    tabsContainer.appendChild(tabElement);
    
    // Trigger slide-in animation
    requestAnimationFrame(() => {
        tabElement.style.opacity = '';
        tabElement.style.transform = '';
        tabElement.style.maxWidth = '';
        tabElement.style.minWidth = '';
        tabElement.style.marginRight = '';
        
        // Remove animation class after animation completes
        setTimeout(() => {
            tabElement.classList.remove('tab-opening');
        }, 300);
    });
    
    // Create webview
    const webview = document.createElement('webview');
    webview.id = `webview-${newTabId}`;
    webview.dataset.tabId = newTabId;
    webview.src = 'about:blank';
    webview.style.cssText = 'width: 100%; height: 100%; border: none; display: none;';
    webviewContainer.appendChild(webview);
    
    // Switch to new tab with delay to allow slide-in animation
    setTimeout(() => {
        switchToTab(newTabId);
        // Reset and show fresh start page for new tab
        resetStartPageForNewTab();
        showStartPage();
    }, 100);
    
    console.log(`Created new tab ${newTabId}`);
}

function switchToTab(tabId) {
    if (!tabs.has(tabId)) return;
    
    // Update active tab
    const previousActiveTab = activeTabId;
    activeTabId = tabId;
    
    // Update tab UI with animation
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active', 'tab-activating');
    });
    
    const newActiveTab = document.getElementById(`tab-${tabId}`);
    if (newActiveTab) {
        newActiveTab.classList.add('active', 'tab-activating');
        
        // Remove activation animation class after animation completes
        setTimeout(() => {
            newActiveTab.classList.remove('tab-activating');
        }, 200);
    }
    
    // Update webview visibility with smooth transition
    document.querySelectorAll('webview').forEach(webview => {
        webview.style.display = 'none';
    });
    
    const activeWebview = document.getElementById(`webview-${tabId}`);
    if (activeWebview) {
        activeWebview.style.display = 'block';
    }
    
    // Update address bar
    const tabData = tabs.get(tabId);
    urlInput.value = tabData.url || '';
    
    // Update page state
    if (tabData.url) {
        showBrowserContent();
    } else {
        // Reset start page content for fresh appearance
        mainSearch.value = '';
        showStartPage();
    }
    
    console.log(`Switched to tab ${tabId}`);
}

function closeTab(tabId) {
    if (tabs.size <= 1) {
        // Don't close the last tab, just reset it
        resetTab(tabId);
        return;
    }
    
    const tabElement = document.getElementById(`tab-${tabId}`);
    if (tabElement) {
        // Add closing animation
        tabElement.classList.add('tab-closing');
        
        // Wait for animation to complete before removing
        setTimeout(() => {
            // Remove from data
            tabs.delete(tabId);
            
            // Remove tab element
            if (tabElement && tabElement.parentNode) {
                tabElement.remove();
            }
            
            // Remove webview
            const webview = document.getElementById(`webview-${tabId}`);
            if (webview) {
                webview.remove();
            }
            
            // If closing active tab, switch to another tab
            if (activeTabId === tabId) {
                const remainingTabs = Array.from(tabs.keys());
                if (remainingTabs.length > 0) {
                    switchToTab(remainingTabs[remainingTabs.length - 1]); // Switch to last tab
                }
            }
            
            console.log(`Closed tab ${tabId}`);
        }, 200); // Match animation duration
    }
}

function resetTab(tabId) {
    // Reset tab data
    tabs.set(tabId, {
        id: tabId,
        title: 'New Tab',
        url: '',
        favicon: null,
        isLoading: false
    });
    
    // Reset webview
    const webview = document.getElementById(`webview-${tabId}`);
    if (webview) {
        webview.src = 'about:blank';
    }
    
    // Update tab title
    updateTabTitle(tabId, 'New Tab');
    
    // Show start page
    showStartPage();
    urlInput.value = '';
    
    console.log(`Reset tab ${tabId}`);
}

function updateTabTitle(tabId, title) {
    const tabElement = document.getElementById(`tab-${tabId}`);
    if (tabElement) {
        const titleElement = tabElement.querySelector('.tab-title');
        if (titleElement) {
            titleElement.textContent = title || 'New Tab';
        }
    }
    
    // Update tab data
    if (tabs.has(tabId)) {
        tabs.get(tabId).title = title || 'New Tab';
    }
}

function updateTabUrl(tabId, url) {
    if (tabs.has(tabId)) {
        tabs.get(tabId).url = url;
        
        // If this is the active tab, update address bar
        if (tabId === activeTabId) {
            urlInput.value = url;
        }
    }
}

function getCurrentWebview() {
    return document.getElementById(`webview-${activeTabId}`);
}

// Update existing functions to work with tabs
function updateWebview(url) {
    const webview = getCurrentWebview();
    if (webview) {
        webview.src = url;
        updateTabUrl(activeTabId, url);
        
        // Extract domain for tab title
        try {
            const domain = new URL(url).hostname;
            updateTabTitle(activeTabId, domain);
        } catch (e) {
            updateTabTitle(activeTabId, 'Loading...');
        }
    }
}

// File Upload Functions
function handleFileUploadClick() {
    fileInput.click();
}

function handleFileSelect(event) {
    const files = Array.from(event.target.files);
    processFiles(files);
}

function handleDragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
}

function handleDragEnter(event) {
    event.preventDefault();
    dragCounter++;
    searchBox.classList.add('drag-over');
    showDragOverlay();
}

function handleDragLeave(event) {
    event.preventDefault();
    dragCounter--;
    if (dragCounter === 0) {
        searchBox.classList.remove('drag-over');
        hideDragOverlay();
    }
}

function handleDrop(event) {
    event.preventDefault();
    dragCounter = 0;
    searchBox.classList.remove('drag-over');
    hideDragOverlay();
    
    const files = Array.from(event.dataTransfer.files);
    processFiles(files);
}

function showDragOverlay() {
    let overlay = searchBox.querySelector('.drag-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'drag-overlay';
        overlay.innerHTML = '📁 Drop files here to upload';
        searchBox.appendChild(overlay);
    }
    overlay.classList.add('active');
}

function hideDragOverlay() {
    const overlay = searchBox.querySelector('.drag-overlay');
    if (overlay) {
        overlay.classList.remove('active');
        setTimeout(() => {
            if (overlay.parentNode) {
                overlay.remove();
            }
        }, 200);
    }
}

function processFiles(files) {
    const validFiles = files.filter(file => {
        // Check file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            showError(`File "${file.name}" is too large (max 10MB)`);
            return false;
        }
        
        // Check if already uploaded
        if (uploadedFilesList.some(f => f.name === file.name && f.size === file.size)) {
            showError(`File "${file.name}" is already uploaded`);
            return false;
        }
        
        return true;
    });
    
    validFiles.forEach(file => {
        const fileData = {
            file: file,
            name: file.name,
            size: file.size,
            type: file.type,
            id: Date.now() + Math.random()
        };
        
        uploadedFilesList.push(fileData);
        
        // Create preview for images
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                fileData.preview = e.target.result;
                updateFilePreview();
            };
            reader.readAsDataURL(file);
        } else {
            updateFilePreview();
        }
    });
    
    // Clear file input
    fileInput.value = '';
}

function updateFilePreview() {
    if (uploadedFilesList.length === 0) {
        filePreviewArea.style.display = 'none';
        searchBox.classList.remove('has-files');
        return;
    }
    
    filePreviewArea.style.display = 'block';
    searchBox.classList.add('has-files');
    
    uploadedFiles.innerHTML = '';
    
    uploadedFilesList.forEach(fileData => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.dataset.fileId = fileData.id;
        
        // File icon or preview
        let iconOrPreview;
        if (fileData.preview) {
            iconOrPreview = `<img src="${fileData.preview}" class="file-image-preview" alt="${fileData.name}">`;
        } else {
            const icon = getFileIcon(fileData.type);
            iconOrPreview = `<div class="file-icon">${icon}</div>`;
        }
        
        fileItem.innerHTML = `
            ${iconOrPreview}
            <div class="file-name" title="${fileData.name}">${fileData.name}</div>
            <div class="file-size">${formatFileSize(fileData.size)}</div>
            <button class="file-remove" onclick="removeFile('${fileData.id}')" title="Remove file">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
            </button>
        `;
        
        uploadedFiles.appendChild(fileItem);
    });
}

function removeFile(fileId) {
    uploadedFilesList = uploadedFilesList.filter(f => f.id !== fileId);
    updateFilePreview();
}

function getFileIcon(mimeType) {
    if (mimeType.startsWith('image/')) {
        return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21,15 16,10 5,21"/>
        </svg>`;
    } else if (mimeType.startsWith('video/')) {
        return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="23 7 16 12 23 17 23 7"/>
            <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
        </svg>`;
    } else if (mimeType.startsWith('audio/')) {
        return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
        </svg>`;
    } else if (mimeType.includes('pdf')) {
        return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
            <polyline points="14,2 14,8 20,8"/>
        </svg>`;
    } else {
        return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
            <polyline points="14,2 14,8 20,8"/>
        </svg>`;
    }
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function clearUploadedFiles() {
    uploadedFilesList = [];
    updateFilePreview();
}

// Update search functions to include file data
async function performAiSearchWithFiles(query) {
    try {
        showLoading();
        
        // Show AI panel with loading
        showAiPanel();
        addAiMessage('user', query);
        
        let fileContext = '';
        if (uploadedFilesList.length > 0) {
            fileContext = `\n\nAttached files: ${uploadedFilesList.map(f => f.name).join(', ')}`;
            addAiMessage('ai', `I can see you've attached ${uploadedFilesList.length} file(s). Analyzing...`, true);
        } else {
            addAiMessage('ai', 'Thinking...', true);
        }
        
        const result = await window.electronAPI.aiQuery(query + fileContext);
        
        // Remove loading message
        removeLastAiMessage();
        
        if (result.success) {
            addAiMessage('ai', result.response);
        } else {
            addAiMessage('ai', 'Sorry, I encountered an error: ' + result.error);
        }
        
        // Clear uploaded files after processing
        clearUploadedFiles();
        
    } catch (error) {
        console.error('AI search with files error:', error);
        removeLastAiMessage();
        addAiMessage('ai', 'Sorry, I encountered an error processing your request with files.');
        clearUploadedFiles();
    } finally {
        hideLoading();
    }
}

// Update existing search functions
const originalPerformAiSearch = performAiSearch;
performAiSearch = async function(query) {
    if (uploadedFilesList.length > 0) {
        await performAiSearchWithFiles(query);
    } else {
        await originalPerformAiSearch(query);
    }
};

// Tab Stack Functions
function toggleTabStack() {
    if (isTabStackOpen) {
        hideTabStack();
    } else {
        showTabStack();
    }
}

function showTabStack() {
    isTabStackOpen = true;
    tabStackBtn.classList.add('active');
    tabStackOverlay.style.display = 'block';
    
    // Generate tab previews
    generateTabPreviews();
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    console.log('Tab stack opened');
}

function hideTabStack() {
    isTabStackOpen = false;
    tabStackBtn.classList.remove('active');
    tabStackOverlay.style.display = 'none';
    
    // Restore body scroll
    document.body.style.overflow = '';
    
    console.log('Tab stack closed');
}

function handleStackOverlayClick(e) {
    // Close if clicking on the overlay background (not on content)
    if (e.target === tabStackOverlay) {
        hideTabStack();
    }
}

function createNewTabFromStack() {
    hideTabStack();
    createNewTab();
}

function generateTabPreviews() {
    tabStackGrid.innerHTML = '';
    
    tabs.forEach((tabData, tabId) => {
        const preview = createTabPreview(tabData);
        tabStackGrid.appendChild(preview);
    });
}

function createTabPreview(tabData) {
    const preview = document.createElement('div');
    preview.className = `tab-preview ${tabData.id === activeTabId ? 'active' : ''}`;
    preview.dataset.tabId = tabData.id;
    
    // Generate thumbnail
    const thumbnail = generateTabThumbnail(tabData);
    
    preview.innerHTML = `
        <div class="tab-preview-thumbnail">
            ${thumbnail}
        </div>
        <div class="tab-preview-info">
            <div class="tab-preview-favicon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
                    <path d="M21 3v5h-5"/>
                    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
                    <path d="M3 21v-5h5"/>
                </svg>
            </div>
            <div class="tab-preview-title">${tabData.title}</div>
        </div>
        <button class="tab-preview-close" onclick="closeTabFromStack(${tabData.id})" title="Close tab">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
        </button>
    `;
    
    // Add click handler to switch to tab
    preview.addEventListener('click', (e) => {
        if (!e.target.closest('.tab-preview-close')) {
            switchToTabFromStack(tabData.id);
        }
    });
    
    return preview;
}

function generateTabThumbnail(tabData) {
    if (tabData.url && tabData.url !== '') {
        // For web pages, we'll show a placeholder with the domain
        try {
            const domain = new URL(tabData.url).hostname;
            return `
                <div style="
                    width: 100%; 
                    height: 100%; 
                    display: flex; 
                    flex-direction: column; 
                    align-items: center; 
                    justify-content: center;
                    background: linear-gradient(135deg, #2a2a2a 0%, #3a3a3a 100%);
                    color: rgba(255, 255, 255, 0.8);
                    font-size: 12px;
                    text-align: center;
                    padding: 20px;
                ">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 8px; opacity: 0.7;">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M2 12h20"/>
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                    </svg>
                    <div style="font-weight: 500;">${domain}</div>
                </div>
            `;
        } catch (e) {
            return `<div>Web Page</div>`;
        }
    } else {
        // For new tab/think page
        return `
            <div style="
                width: 100%; 
                height: 100%; 
                display: flex; 
                flex-direction: column; 
                align-items: center; 
                justify-content: center;
                background: linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 100%);
                color: rgba(255, 255, 255, 0.8);
                font-size: 14px;
            ">
                <div style="font-size: 24px; font-weight: 300; margin-bottom: 8px; background: linear-gradient(135deg, #ffffff 0%, #cccccc 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
                    think
                </div>
                <div style="font-size: 10px; opacity: 0.6;">New Tab</div>
            </div>
        `;
    }
}

function switchToTabFromStack(tabId) {
    hideTabStack();
    switchToTab(tabId);
}

function closeTabFromStack(tabId) {
    closeTab(tabId);
    
    // Refresh the tab stack view
    if (isTabStackOpen) {
        generateTabPreviews();
    }
    
    // If no tabs left, close the stack view
    if (tabs.size === 0) {
        hideTabStack();
    }
}

// Update existing tab functions to refresh stack view
const originalUpdateTabTitle = updateTabTitle;
updateTabTitle = function(tabId, title) {
    originalUpdateTabTitle(tabId, title);
    
    // Update stack view if open
    if (isTabStackOpen) {
        const preview = document.querySelector(`[data-tab-id="${tabId}"]`);
        if (preview) {
            const titleElement = preview.querySelector('.tab-preview-title');
            if (titleElement) {
                titleElement.textContent = title || 'New Tab';
            }
        }
    }
};

const originalUpdateTabUrl = updateTabUrl;
updateTabUrl = function(tabId, url) {
    originalUpdateTabUrl(tabId, url);
    
    // Update stack view if open
    if (isTabStackOpen) {
        const preview = document.querySelector(`[data-tab-id="${tabId}"]`);
        if (preview) {
            const thumbnail = preview.querySelector('.tab-preview-thumbnail');
            if (thumbnail) {
                const tabData = tabs.get(tabId);
                if (tabData) {
                    thumbnail.innerHTML = generateTabThumbnail(tabData);
                }
            }
        }
    }
};

// Make functions globally accessible
window.closeTabFromStack = closeTabFromStack;
window.removeFile = removeFile;

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        navigateToUrl,
        performSearch,
        performAiSearch,
        validateUrl,
        formatUrl,
        createNewTab,
        switchToTab,
        closeTab,
        processFiles,
        removeFile,
        clearUploadedFiles
    };
}
