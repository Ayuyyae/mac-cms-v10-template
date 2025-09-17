/**
 * Modern Video Player Enhancement
 * Adds Picture-in-Picture, Fullscreen, Keyboard Shortcuts, and other modern features
 */

class ModernPlayerEnhancement {
    constructor() {
        this.playerElement = null;
        this.isFullscreen = false;
        this.isPiP = false;
        this.shortcuts = {
            ' ': 'togglePlayPause',
            'f': 'toggleFullscreen',
            'p': 'togglePiP',
            'm': 'toggleMute',
            'Escape': 'exitFullscreen'
        };
        
        this.init();
    }
    
    init() {
        this.findPlayerElement();
        this.setupKeyboardShortcuts();
        this.setupPlayerControls();
        this.setupErrorHandling();
        this.addLoadingState();
    }
    
    findPlayerElement() {
        // Look for various player types
        this.playerElement = document.querySelector('video') || 
                           document.querySelector('iframe') ||
                           document.querySelector('.player-embed');
    }
    
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Don't trigger shortcuts if user is typing
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }
            
            const action = this.shortcuts[e.key];
            if (action && this[action]) {
                e.preventDefault();
                this[action]();
            }
        });
    }
    
    setupPlayerControls() {
        this.createControlBar();
        this.setupFullscreenAPI();
        this.setupPiPAPI();
    }
    
    createControlBar() {
        const existingControls = document.querySelector('.modern-player-controls');
        if (existingControls) return;
        
        const controlBar = document.createElement('div');
        controlBar.className = 'modern-player-controls';
        controlBar.innerHTML = `
            <div class="control-group left">
                <button class="control-btn" id="playPauseBtn" aria-label="播放/暂停" title="空格键">
                    <svg class="icon-play" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z"/>
                    </svg>
                    <svg class="icon-pause" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style="display: none;">
                        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                    </svg>
                </button>
                <button class="control-btn" id="muteBtn" aria-label="静音" title="M键">
                    <svg class="icon-volume" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
                    </svg>
                    <svg class="icon-muted" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style="display: none;">
                        <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                    </svg>
                </button>
            </div>
            
            <div class="control-group center">
                <div class="time-display">
                    <span id="currentTime">0:00</span>
                    <span class="time-separator">/</span>
                    <span id="duration">0:00</span>
                </div>
            </div>
            
            <div class="control-group right">
                <button class="control-btn" id="pipBtn" aria-label="画中画" title="P键">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 7h-8v6h8V7zm2-4H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14z"/>
                    </svg>
                </button>
                <button class="control-btn" id="fullscreenBtn" aria-label="全屏" title="F键">
                    <svg class="icon-fullscreen" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
                    </svg>
                    <svg class="icon-exit-fullscreen" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style="display: none;">
                        <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>
                    </svg>
                </button>
            </div>
        `;
        
        // Add to player container
        const playerContainer = document.querySelector('.player-container');
        if (playerContainer) {
            playerContainer.appendChild(controlBar);
            this.setupControlEvents(controlBar);
        }
    }
    
    setupControlEvents(controlBar) {
        // Play/Pause
        const playPauseBtn = controlBar.querySelector('#playPauseBtn');
        playPauseBtn?.addEventListener('click', () => this.togglePlayPause());
        
        // Mute
        const muteBtn = controlBar.querySelector('#muteBtn');
        muteBtn?.addEventListener('click', () => this.toggleMute());
        
        // Picture-in-Picture
        const pipBtn = controlBar.querySelector('#pipBtn');
        pipBtn?.addEventListener('click', () => this.togglePiP());
        
        // Fullscreen
        const fullscreenBtn = controlBar.querySelector('#fullscreenBtn');
        fullscreenBtn?.addEventListener('click', () => this.toggleFullscreen());
    }
    
    togglePlayPause() {
        if (!this.playerElement) return;
        
        try {
            if (this.playerElement.tagName === 'VIDEO') {
                if (this.playerElement.paused) {
                    this.playerElement.play();
                } else {
                    this.playerElement.pause();
                }
                this.updatePlayPauseButton(!this.playerElement.paused);
            } else {
                // For iframe players, send message
                this.sendPlayerMessage('togglePlayPause');
            }
        } catch (e) {
            console.warn('Play/pause failed:', e);
        }
    }
    
    toggleMute() {
        if (!this.playerElement) return;
        
        try {
            if (this.playerElement.tagName === 'VIDEO') {
                this.playerElement.muted = !this.playerElement.muted;
                this.updateMuteButton(this.playerElement.muted);
            } else {
                this.sendPlayerMessage('toggleMute');
            }
        } catch (e) {
            console.warn('Mute toggle failed:', e);
        }
    }
    
    async togglePiP() {
        if (!this.playerElement || this.playerElement.tagName !== 'VIDEO') {
            this.showNotification('画中画功能仅支持HTML5视频');
            return;
        }
        
        try {
            if (document.pictureInPictureElement) {
                await document.exitPictureInPicture();
                this.isPiP = false;
            } else if (document.pictureInPictureEnabled) {
                await this.playerElement.requestPictureInPicture();
                this.isPiP = true;
            }
        } catch (e) {
            console.warn('Picture-in-Picture failed:', e);
            this.showNotification('画中画功能不可用');
        }
    }
    
    toggleFullscreen() {
        if (this.isFullscreen) {
            this.exitFullscreen();
        } else {
            this.enterFullscreen();
        }
    }
    
    async enterFullscreen() {
        const container = document.querySelector('.player-container');
        if (!container) return;
        
        try {
            if (container.requestFullscreen) {
                await container.requestFullscreen();
            } else if (container.webkitRequestFullscreen) {
                await container.webkitRequestFullscreen();
            } else if (container.msRequestFullscreen) {
                await container.msRequestFullscreen();
            }
            this.isFullscreen = true;
            this.updateFullscreenButton(true);
        } catch (e) {
            console.warn('Fullscreen failed:', e);
        }
    }
    
    async exitFullscreen() {
        try {
            if (document.exitFullscreen) {
                await document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                await document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                await document.msExitFullscreen();
            }
            this.isFullscreen = false;
            this.updateFullscreenButton(false);
        } catch (e) {
            console.warn('Exit fullscreen failed:', e);
        }
    }
    
    setupFullscreenAPI() {
        document.addEventListener('fullscreenchange', () => {
            this.isFullscreen = !!document.fullscreenElement;
            this.updateFullscreenButton(this.isFullscreen);
        });
        
        document.addEventListener('webkitfullscreenchange', () => {
            this.isFullscreen = !!document.webkitFullscreenElement;
            this.updateFullscreenButton(this.isFullscreen);
        });
    }
    
    setupPiPAPI() {
        if (this.playerElement && this.playerElement.tagName === 'VIDEO') {
            this.playerElement.addEventListener('enterpictureinpicture', () => {
                this.isPiP = true;
            });
            
            this.playerElement.addEventListener('leavepictureinpicture', () => {
                this.isPiP = false;
            });
        }
    }
    
    updatePlayPauseButton(isPlaying) {
        const playIcon = document.querySelector('.icon-play');
        const pauseIcon = document.querySelector('.icon-pause');
        
        if (playIcon && pauseIcon) {
            playIcon.style.display = isPlaying ? 'none' : 'block';
            pauseIcon.style.display = isPlaying ? 'block' : 'none';
        }
    }
    
    updateMuteButton(isMuted) {
        const volumeIcon = document.querySelector('.icon-volume');
        const mutedIcon = document.querySelector('.icon-muted');
        
        if (volumeIcon && mutedIcon) {
            volumeIcon.style.display = isMuted ? 'none' : 'block';
            mutedIcon.style.display = isMuted ? 'block' : 'none';
        }
    }
    
    updateFullscreenButton(isFullscreen) {
        const fullscreenIcon = document.querySelector('.icon-fullscreen');
        const exitFullscreenIcon = document.querySelector('.icon-exit-fullscreen');
        
        if (fullscreenIcon && exitFullscreenIcon) {
            fullscreenIcon.style.display = isFullscreen ? 'none' : 'block';
            exitFullscreenIcon.style.display = isFullscreen ? 'block' : 'none';
        }
    }
    
    sendPlayerMessage(action) {
        // For iframe communication
        if (this.playerElement && this.playerElement.tagName === 'IFRAME') {
            this.playerElement.contentWindow?.postMessage({ action }, '*');
        }
        
        // For parent window communication
        if (window.parent) {
            window.parent.postMessage({ action }, '*');
        }
    }
    
    showNotification(message) {
        // Create temporary notification
        const notification = document.createElement('div');
        notification.className = 'player-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            z-index: 10000;
            font-size: 14px;
        `;
        
        document.body.appendChild(notification);
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }
    
    setupErrorHandling() {
        if (this.playerElement && this.playerElement.tagName === 'VIDEO') {
            this.playerElement.addEventListener('error', (e) => {
                console.error('Video error:', e);
                this.showNotification('视频加载失败，请重试');
            });
            
            this.playerElement.addEventListener('loadstart', () => {
                this.addLoadingState();
            });
            
            this.playerElement.addEventListener('canplay', () => {
                this.removeLoadingState();
            });
        }
    }
    
    addLoadingState() {
        const container = document.querySelector('.player-embed');
        if (container && !container.querySelector('.loading-spinner')) {
            const loader = document.createElement('div');
            loader.className = 'loading-spinner';
            loader.innerHTML = `
                <div class="spinner"></div>
                <p>加载中...</p>
            `;
            loader.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                color: white;
                text-align: center;
                z-index: 100;
            `;
            
            const spinnerStyle = document.createElement('style');
            spinnerStyle.textContent = `
                .spinner {
                    width: 40px;
                    height: 40px;
                    border: 4px solid rgba(255, 255, 255, 0.3);
                    border-top: 4px solid white;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 10px;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            
            if (!document.querySelector('#spinner-styles')) {
                spinnerStyle.id = 'spinner-styles';
                document.head.appendChild(spinnerStyle);
            }
            
            container.appendChild(loader);
        }
    }
    
    removeLoadingState() {
        const loader = document.querySelector('.loading-spinner');
        if (loader) {
            loader.remove();
        }
    }
}

// Auto-initialize if not in iframe context
if (window.self === window.top) {
    document.addEventListener('DOMContentLoaded', () => {
        window.modernPlayerEnhancement = new ModernPlayerEnhancement();
    });
}