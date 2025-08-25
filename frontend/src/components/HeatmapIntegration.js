import React, { useState, useEffect, useRef } from 'react';
import screenshotService from '../services/screenshotService';
import heatmapService from '../services/heatmapService';
import api from '../services/api';
import h337 from 'heatmapjs';

const HeatmapIntegration = () => {
  const [screenshots, setScreenshots] = useState([]);
  const [selectedScreenshot, setSelectedScreenshot] = useState(null);
  const [heatmapData, setHeatmapData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [visitorData, setVisitorData] = useState([]);
  const [dataCount, setDataCount] = useState({ database: 0, localStorage: 0 });
  const [animationProgress, setAnimationProgress] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const heatmapContainerRef = useRef(null);
  const heatmapInstanceRef = useRef(null);
  const animationTimeoutsRef = useRef([]);

  useEffect(() => {
    loadAllScreenshots();
    loadVisitorData();
    loadDataCount();

    // Migrate localStorage data to MongoDB on component mount
    const migrateData = async () => {
      try {
        await heatmapService.migrateLocalStorageData();
        // Refresh data count after migration
        loadDataCount();
      } catch (error) {
        console.warn('Migration failed:', error);
      }
    };
    migrateData();
  }, []);

  useEffect(() => {
    if (selectedScreenshot) {
      loadHeatmapForScreenshot();
    }
  }, [selectedScreenshot]);

  const loadAllScreenshots = () => {
    try {
      const allScreenshots = screenshotService.getAllScreenshots();
      setScreenshots(allScreenshots);

      if (allScreenshots.length > 0) {
        setSelectedScreenshot(allScreenshots[0]);
      }
    } catch (err) {
      console.error('Error loading screenshots:', err);
      setError('Failed to load screenshots');
    }
  };

  const loadVisitorData = async () => {
    try {
      console.log('👥 Loading visitor data from database...');

      // Try to get visitor data from our new heatmap API
      try {
        const visitorResponse = await api.get('/api/heatmap/visitors');

        if (visitorResponse.data.success && visitorResponse.data.data) {
          const visitors = visitorResponse.data.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
          setVisitorData(visitors);
          console.log('✅ Loaded visitor data from database:', visitors.length, 'visits');
          return;
        }
      } catch (apiError) {
        console.warn('Failed to load from heatmap API, trying localStorage:', apiError);
      }

      // Fallback to localStorage if API fails
      const visitors = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('visitor_')) {
          const visitorInfo = JSON.parse(localStorage.getItem(key));
          if (visitorInfo) {
            visitors.push(visitorInfo);
          }
        }
      }

      visitors.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setVisitorData(visitors);
      console.log('📊 Loaded visitor data from localStorage fallback:', visitors.length, 'visits');
    } catch (err) {
      console.error('Error loading visitor data:', err);
    }
  };

  const loadDataCount = async () => {
    try {
      // Get database count
      const dbCount = await heatmapService.getDatabaseDataCount();

      // Get localStorage count
      const localCount = heatmapService.getLocalDataCount();

      setDataCount({
        database: dbCount.count,
        localStorage: localCount
      });

      console.log(`📊 Data counts - Database: ${dbCount.count}, LocalStorage: ${localCount}`);
    } catch (error) {
      console.warn('Failed to load data counts:', error);
      setDataCount({ database: 0, localStorage: 0 });
    }
  };

  const loadHeatmapForScreenshot = async () => {
    if (!selectedScreenshot) return;

    setLoading(true);
    setError(null);

    try {
      console.log('🔍 Loading heatmap data for page:', selectedScreenshot.url);

      // Load heatmap data for the selected page
      const data = await heatmapService.loadHeatmapData(selectedScreenshot.url, {
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
        end: new Date().toISOString().split('T')[0] // today
      });

      console.log('📊 Raw heatmap data received:', data);

      if (data && data.data && data.data.length > 0) {
        console.log('✅ Heatmap data found:', data.data.length, 'points');
        setHeatmapData(data);
        // Display heatmap immediately like HTML demo
        showInstantHeatmap(data);
        setError(null);
      } else {
        console.log('❌ No heatmap data found for page:', selectedScreenshot.url);
        setHeatmapData(null);
        clearHeatmapOverlay();
        const message = data?.message || `No interactions found for ${selectedScreenshot.url}. Visit this page and interact with it first.`;
        setError(message);
      }
    } catch (err) {
      console.error('❌ Error loading heatmap data:', err);
      setError('Failed to load heatmap data for this page: ' + err.message);
    } finally {
      setLoading(false);
    }
  };


  const clearHeatmapOverlay = () => {
    // Clear any running animations
    animationTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    animationTimeoutsRef.current = [];
    setIsAnimating(false);
    setAnimationProgress(0);

    // Clear all visual highlights
    clearAllHighlights();

    // Reset vertical scrolling to hidden (default state)
    const screenshotViewport = document.getElementById('screenshot-viewport');
    if (screenshotViewport) {
      screenshotViewport.style.overflowY = 'hidden';
      screenshotViewport.scrollTop = 0;
    }

    if (heatmapInstanceRef.current) {
      heatmapInstanceRef.current.setData({ data: [], max: 0 });
    }
    // Also clear green dots
    if (heatmapContainerRef.current) {
      heatmapContainerRef.current.innerHTML = '';
    }
  };

  const stopAnimation = () => {
    animationTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    animationTimeoutsRef.current = [];
    setIsAnimating(false);
    clearAllHighlights();
    console.log('🛑 Animation stopped by user');
  };


  const createInteractionHighlight = (point, eventType, index) => {
    if (!heatmapContainerRef.current) return;

    // Create highlight element
    const highlight = document.createElement('div');
    highlight.className = `interaction-highlight-${index}`;
    highlight.style.cssText = `
      position: absolute;
      left: ${point.x - 25}px;
      top: ${point.y - 25}px;
      width: 50px;
      height: 50px;
      border: 3px solid ${eventType === 'click' ? '#ff4444' : '#44ff44'};
      border-radius: 50%;
      background: ${eventType === 'click' ? 'rgba(255, 68, 68, 0.2)' : 'rgba(68, 255, 68, 0.2)'};
      pointer-events: none;
      z-index: 1000;
      animation: highlightPulse 2s ease-out forwards;
      box-shadow: 0 0 20px ${eventType === 'click' ? '#ff4444' : '#44ff44'};
    `;

    // Add pulse animation styles to the document if not already added
    if (!document.getElementById('highlight-styles')) {
      const style = document.createElement('style');
      style.id = 'highlight-styles';
      style.textContent = `
        @keyframes highlightPulse {
          0% {
            transform: scale(0.5);
            opacity: 1;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.8;
          }
          100% {
            transform: scale(1);
            opacity: 0.6;
          }
        }
        @keyframes backgroundPulse {
          0% {
            transform: scale(0.3);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.4;
          }
          100% {
            transform: scale(1);
            opacity: 0.2;
          }
        }
        .interaction-tooltip {
          position: absolute;
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          white-space: nowrap;
          pointer-events: none;
          z-index: 1001;
        }
      `;
      document.head.appendChild(style);
    }

    // Add tooltip with interaction info
    const tooltip = document.createElement('div');
    tooltip.className = 'interaction-tooltip';
    tooltip.style.cssText = `
      position: absolute;
      left: ${point.x + 30}px;
      top: ${point.y - 15}px;
      background: rgba(0, 0, 0, 0.9);
      color: white;
      padding: 6px 10px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: bold;
      white-space: nowrap;
      pointer-events: none;
      z-index: 1001;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    `;
    tooltip.textContent = `${eventType === 'click' ? '🖱️ Click' : '👆 Movement'} #${index + 1}`;

    // Add a larger background highlight for better visibility
    const backgroundHighlight = document.createElement('div');
    backgroundHighlight.className = `interaction-bg-highlight-${index}`;
    backgroundHighlight.style.cssText = `
      position: absolute;
      left: ${point.x - 60}px;
      top: ${point.y - 60}px;
      width: 120px;
      height: 120px;
      background: ${eventType === 'click' ? 'rgba(255, 68, 68, 0.1)' : 'rgba(68, 255, 68, 0.1)'};
      border: 2px dashed ${eventType === 'click' ? '#ff4444' : '#44ff44'};
      border-radius: 50%;
      pointer-events: none;
      z-index: 999;
      animation: backgroundPulse 2s ease-out forwards;
    `;

    heatmapContainerRef.current.appendChild(backgroundHighlight);
    heatmapContainerRef.current.appendChild(highlight);
    heatmapContainerRef.current.appendChild(tooltip);

    // Auto-remove highlight after 4 seconds
    setTimeout(() => {
      if (backgroundHighlight.parentNode) backgroundHighlight.remove();
      if (highlight.parentNode) highlight.remove();
      if (tooltip.parentNode) tooltip.remove();
    }, 4000);
  };

  const scrollToInteraction = (point) => {
    if (!heatmapContainerRef.current) return;

    // Find the screenshot viewport container
    const screenshotViewport = document.getElementById('screenshot-viewport');
    if (!screenshotViewport) return;

    // Get viewport dimensions
    const viewportHeight = screenshotViewport.clientHeight;

    // Calculate target scroll position to center the interaction vertically
    const targetScrollY = point.y - (viewportHeight / 2);

    // Ensure scroll values are within bounds
    const maxScrollY = screenshotViewport.scrollHeight - viewportHeight;
    const finalScrollY = Math.max(0, Math.min(targetScrollY, maxScrollY));

    // Smooth scroll the screenshot viewport vertically to center the interaction
    screenshotViewport.scrollTo({
      top: finalScrollY,
      behavior: 'smooth'
    });

    console.log(`📍 Auto-scrolling screenshot viewport to interaction at (${point.x}, ${point.y}) - scroll to Y: ${finalScrollY}`);
  };

  const clearAllHighlights = () => {
    if (!heatmapContainerRef.current) return;

    // Remove all animated highlight elements (instant heatmap uses only heatmapjs overlay)
    const highlights = heatmapContainerRef.current.querySelectorAll('[class*="interaction-highlight"]');
    const backgroundHighlights = heatmapContainerRef.current.querySelectorAll('[class*="interaction-bg-highlight"]');
    const tooltips = heatmapContainerRef.current.querySelectorAll('.interaction-tooltip');

    highlights.forEach(highlight => highlight.remove());
    backgroundHighlights.forEach(bg => bg.remove());
    tooltips.forEach(tooltip => tooltip.remove());

    console.log('🧹 Cleared all interaction highlights');
  };

  const playInteractionSound = (eventType) => {
    try {
      // Create a simple audio context for sound notifications
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      // Different frequencies for different interaction types
      oscillator.frequency.value = eventType === 'click' ? 800 : 400; // Higher pitch for clicks
      oscillator.type = 'sine';

      // Quick beep sound
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (error) {
      console.warn('Could not play interaction sound:', error);
    }
  };

  const showInstantHeatmap = (data) => {
    if (!heatmapContainerRef.current || !selectedScreenshot || !data.data) {
      return;
    }

    console.log('🎯 Creating instant heatmap with', data.data.length, 'interaction points');

    // Disable vertical scrolling for instant heatmap
    const screenshotViewport = document.getElementById('screenshot-viewport');
    if (screenshotViewport) {
      screenshotViewport.style.overflowY = 'hidden';
      screenshotViewport.scrollTop = 0; // Reset to top
    }

    // Get image dimensions for scaling
    const img = document.getElementById('screenshot-image');
    if (!img) {
      console.log('❌ Screenshot image not found for heatmap overlay');
      return;
    }

    // Calculate scaling based on actual image display size vs original screenshot size
    const originalHeight = selectedScreenshot.fullPageHeight || selectedScreenshot.viewportHeight;
    const scaleX = img.offsetWidth / selectedScreenshot.viewportWidth;
    const scaleY = img.offsetHeight / originalHeight;

    console.log('📏 Scale factors:', { scaleX, scaleY, imageWidth: img.offsetWidth, imageHeight: img.offsetHeight, originalHeight });

    // Clear and setup container with !important positioning
    heatmapContainerRef.current.innerHTML = '';
    heatmapContainerRef.current.style.cssText = `
      width: ${img.offsetWidth}px !important;
      height: ${img.offsetHeight}px !important;
      position: absolute !important;
      top: 0px !important;
      left: 0px !important;
      pointer-events: none !important;
      z-index: 10 !important;
    `;

    try {
      // Destroy previous instance if exists
      if (heatmapInstanceRef.current) {
        heatmapInstanceRef.current = null;
      }

      // Create new heatmap instance
      heatmapInstanceRef.current = h337.create({
        container: heatmapContainerRef.current,
        radius: 30,
        maxOpacity: 0.8,
        minOpacity: 0.1,
        blur: 0.75,
        gradient: {
          '0.4': 'blue',
          '0.6': 'cyan',
          '0.7': 'lime',
          '0.8': 'yellow',
          '1.0': 'red'
        }
      });

      console.log('✅ Heatmap instance created');

      // Transform all data points at once
      const transformedData = {
        max: 5,
        data: data.data.map(point => ({
          x: Math.round(point.x * scaleX),
          y: Math.round(point.y * scaleY),
          value: point.value
        }))
      };

      console.log('🔥 Setting instant heatmap data:', transformedData);

      // Display all interactions immediately as original heatmap overlay
      heatmapInstanceRef.current.setData(transformedData);

      // Force immediate render and absolute positioning like animated version
      setTimeout(() => {
        const canvas = heatmapContainerRef.current.querySelector('canvas');
        if (canvas) {
          console.log('✅ Heatmap canvas found and visible');
          canvas.style.display = 'block';
          canvas.style.opacity = '1';
          canvas.style.position = 'absolute';
          canvas.style.top = '0px';
          canvas.style.left = '0px';

          // Also ensure container stays absolute
          heatmapContainerRef.current.style.position = 'absolute';
          heatmapContainerRef.current.style.top = '0px';
          heatmapContainerRef.current.style.left = '0px';
        } else {
          console.log('❌ No heatmap canvas created');
        }
      }, 10);

      console.log(`✅ Instant heatmap created with ${transformedData.data.length} points using heatmapjs overlay`);

    } catch (error) {
      console.error('❌ Failed to create instant heatmap:', error);
    }
  };

  const showAnimatedHeatmap = (data) => {
    if (!heatmapContainerRef.current || !selectedScreenshot || !data.data) {
      return;
    }

    console.log('🎯 Creating animated heatmap with', data.data.length, 'interaction points');

    // Enable vertical scrolling for animated heatmap
    const screenshotViewport = document.getElementById('screenshot-viewport');
    if (screenshotViewport) {
      screenshotViewport.style.overflowY = 'auto';
    }

    // Get image dimensions for scaling
    const img = document.getElementById('screenshot-image');
    if (!img) {
      console.log('❌ Screenshot image not found for heatmap overlay');
      return;
    }

    // Calculate scaling based on actual image display size vs original screenshot size
    const originalHeight = selectedScreenshot.fullPageHeight || selectedScreenshot.viewportHeight;
    const scaleX = img.offsetWidth / selectedScreenshot.viewportWidth; // Scale based on displayed width
    const scaleY = img.offsetHeight / originalHeight; // Scale based on displayed height

    console.log('📏 Scale factors:', { scaleX, scaleY, imageWidth: img.offsetWidth, imageHeight: img.offsetHeight, originalHeight });

    // Clear and setup container with !important positioning
    heatmapContainerRef.current.innerHTML = '';
    heatmapContainerRef.current.style.cssText = `
      width: ${img.offsetWidth}px !important;
      height: ${img.offsetHeight}px !important;
      position: absolute !important;
      top: 0px !important;
      left: 0px !important;
      pointer-events: none !important;
      z-index: 10 !important;
    `;

    // Create heatmap instance - same config as HTML demo
    try {
      // Destroy previous instance if exists
      if (heatmapInstanceRef.current) {
        heatmapInstanceRef.current = null;
      }

      // Create new instance with simple config like HTML demo
      heatmapInstanceRef.current = h337.create({
        container: heatmapContainerRef.current,
        radius: 30, // Same as HTML demo
        maxOpacity: 0.8,
        minOpacity: 0.1,
        blur: 0.75,
        gradient: {
          '0.4': 'blue',
          '0.6': 'cyan',
          '0.7': 'lime',
          '0.8': 'yellow',
          '1.0': 'red'
        }
      });

      console.log('✅ Heatmap instance created');

      // Sort interactions by timestamp for sequential playback
      const sortedInteractions = data.data
        .filter(point => point.timestamp) // Only points with timestamps
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

      if (sortedInteractions.length === 0) {
        console.log('⚠️ No interactions with timestamps found, falling back to instant display');
        // Fallback to instant display for backward compatibility
        const transformedData = {
          max: 5,
          data: data.data.map(point => ({
            x: Math.round(point.x * scaleX),
            y: Math.round(point.y * scaleY),
            value: point.value
          }))
        };
        heatmapInstanceRef.current.setData(transformedData);
        return;
      }

      console.log('🎬 Starting sequential animation with', sortedInteractions.length, 'interactions');

      // Calculate timing for animation
      const firstInteraction = new Date(sortedInteractions[0].timestamp);
      const lastInteraction = new Date(sortedInteractions[sortedInteractions.length - 1].timestamp);
      const totalOriginalDuration = lastInteraction - firstInteraction;

      // Speed up the animation if it's too long (max 30 seconds for playback)
      const maxAnimationDuration = 30000; // 30 seconds max
      const baseSpeedMultiplier = totalOriginalDuration > maxAnimationDuration ?
        maxAnimationDuration / totalOriginalDuration : 1;
      const speedMultiplier = baseSpeedMultiplier * animationSpeed;

      console.log('⏱️ Animation timing:', {
        originalDuration: Math.round(totalOriginalDuration / 1000) + 's',
        playbackDuration: Math.round(totalOriginalDuration * speedMultiplier / 1000) + 's',
        speedMultiplier: speedMultiplier.toFixed(2) + 'x'
      });

      // Clear any existing animation timeouts
      animationTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
      animationTimeoutsRef.current = [];

      // Start with empty heatmap
      heatmapInstanceRef.current.setData({ max: 5, data: [] });
      setIsAnimating(true);
      setAnimationProgress(0);

      // Animate interactions sequentially
      const animatedPoints = [];

      sortedInteractions.forEach((point, index) => {
        const interactionTime = new Date(point.timestamp);
        const relativeTime = (interactionTime - firstInteraction) / speedMultiplier;

        const timeoutId = setTimeout(() => {
          // Add this interaction to the accumulated points
          const scaledPoint = {
            x: Math.round(point.x * scaleX),
            y: Math.round(point.y * scaleY),
            value: point.value
          };
          animatedPoints.push(scaledPoint);

          // Update heatmap with all points up to this moment
          heatmapInstanceRef.current.setData({
            max: 5,
            data: [...animatedPoints]
          });

          // Add visual highlight for this interaction
          createInteractionHighlight(scaledPoint, point.event_type, index);

          // Auto-scroll to bring the interaction into view
          scrollToInteraction(scaledPoint);

          // Play sound notification if enabled
          if (soundEnabled) {
            playInteractionSound(point.event_type);
          }

          // Update progress
          const progress = ((index + 1) / sortedInteractions.length) * 100;
          setAnimationProgress(progress);

          console.log(`🎯 Animation step ${index + 1}/${sortedInteractions.length}: Added ${point.event_type} at (${point.x}, ${point.y})`);

          // Check if animation is complete
          if (index === sortedInteractions.length - 1) {
            setIsAnimating(false);
            console.log('✅ Heatmap animation completed');
            // Clear all highlights after a delay
            setTimeout(() => clearAllHighlights(), 2000);
          }
        }, relativeTime);

        animationTimeoutsRef.current.push(timeoutId);
      });

      // Force immediate render and absolute positioning
      setTimeout(() => {
        const canvas = heatmapContainerRef.current.querySelector('canvas');
        if (canvas) {
          console.log('✅ Heatmap canvas found and visible');
          canvas.style.display = 'block';
          canvas.style.opacity = '1';
          canvas.style.position = 'absolute';
          canvas.style.top = '0px';
          canvas.style.left = '0px';

          // Also ensure container stays absolute
          heatmapContainerRef.current.style.position = 'absolute';
          heatmapContainerRef.current.style.top = '0px';
          heatmapContainerRef.current.style.left = '0px';
        } else {
          console.log('❌ No heatmap canvas created');
        }
      }, 10);

    } catch (error) {
      console.error('❌ Failed to create animated heatmap:', error);
    }
  };

  const captureNewScreenshot = async () => {
    setLoading(true);
    setError(null);

    try {
      const url = window.prompt('Enter the URL path to capture (e.g., /, /dashboard, /about):') || '/';

      if (url) {
        // Navigate to capture the current page if it matches, or open in new tab
        if (window.location.pathname === url) {
          // Capture current page
          const screenshot = await screenshotService.captureViewportOnLoad(url);
          if (screenshot) {
            loadAllScreenshots();
          } else {
            setError('Failed to capture screenshot of current page');
          }
        } else {
          // Open the target page in a new tab to capture it
          const baseUrl = window.location.origin;
          const fullUrl = baseUrl + url;

          const newTab = window.open(fullUrl, '_blank');

          // Wait for page to load, then capture
          setTimeout(async () => {
            try {
              // The new page should auto-capture on load
              newTab.close();
              // Wait a bit more for the capture to complete
              setTimeout(() => {
                loadAllScreenshots();
              }, 1000);
            } catch (err) {
              console.error('Error with new tab:', err);
              setError('Failed to capture screenshot from new tab');
            }
          }, 3000);
        }
      }
    } catch (err) {
      console.error('Error capturing screenshot:', err);
      setError('Failed to capture new screenshot');
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  };

  const clearAllData = async () => {
    const confirmMessage = `Are you sure you want to completely reset ALL heatmap data?

This will:
• Delete ALL heatmap records from MongoDB database
• Clear ALL localStorage heatmap data  
• Clear ALL screenshots
• Reset ALL guest user tracking data
• Clear ALL visitor information

This action cannot be undone!`;

    if (window.confirm(confirmMessage)) {
      setLoading(true);
      setError(null);

      try {
        console.log('🔄 Starting complete data reset...');

        // Get current data counts
        const dbCount = await heatmapService.getDatabaseDataCount();
        const localCount = heatmapService.getLocalDataCount();

        console.log(`📊 Current data - Database: ${dbCount.count} records, LocalStorage: ${localCount} entries`);

        // Clear all heatmap data (database + localStorage + guest data)
        const resetResult = await heatmapService.resetAllHeatmapData();

        // Clear screenshots
        screenshotService.clearAllScreenshots();

        // Reset component state
        setScreenshots([]);
        setSelectedScreenshot(null);
        setHeatmapData(null);
        setVisitorData([]);
        clearHeatmapOverlay();

        // Refresh data counts to show 0
        await loadDataCount();

        // Show success message
        alert(`✅ Complete reset successful!\n\n${resetResult.message}\n\nAll heatmap data has been reset to 0.`);

        console.log('✅ Complete data reset finished:', resetResult);

      } catch (error) {
        console.error('❌ Data reset failed:', error);
        setError(`Failed to reset data: ${error.message}`);
        alert(`❌ Reset failed: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }
  };


  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const formatDeviceInfo = (device) => {
    if (!device) return 'Unknown Device';
    return `${device.browser} on ${device.os} (${device.device})`;
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }} className='heatmapWrap'>
      <h2 className='heatmapHeading' style={{marginBottom: "16px"}}>Heatmap Integration</h2>
      {/* Controls */}
      <div style={{
        backgroundColor: '#f8f9fa',
        border: '1px solid #dee2e6',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '20px'
      }}>
        <h4 style={{fontWeight: 500}}>Controls Heatmap From Here:</h4>

        {/* Data Count Display */}
        {/* <div style={{
          backgroundColor: '#fff',
          border: '1px solid #dee2e6',
          borderRadius: '6px',
          padding: '12px',
          marginTop: '10px',
          marginBottom: '15px',
          fontSize: '14px'
        }}>
          <strong>📊 Current Data:</strong>
          <div style={{ marginTop: '5px', color: '#6c757d' }}>
            🗄️ Database: <strong>{dataCount.database}</strong> heatmap records
            <br />
            💾 LocalStorage: <strong>{dataCount.localStorage}</strong> entries
            <br />
            👥 Visitors: <strong>{visitorData.length}</strong> tracked visits
          </div>
          <button
            onClick={loadDataCount}
            style={{
              padding: '4px 8px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer',
              fontSize: '12px',
              marginTop: '8px'
            }}
          >
            🔄 Refresh Count
          </button>
        </div> */}

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center', marginTop: '10px' }}>

          <button
            onClick={loadHeatmapForScreenshot}
            disabled={loading || !selectedScreenshot}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            🔄 Refresh Heatmap
          </button>

          <button
            onClick={clearAllData}
            style={{
              padding: '10px 20px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            🗑️ Clear All Data
          </button>

          <button
            onClick={async () => {
              if (window.confirm('Reset guest tracking data? This will clear existing guest visit counts and start fresh.')) {
                heatmapService.resetCorruptedGuestData();
                await loadVisitorData(); // Refresh visitor data
                await loadDataCount(); // Refresh data count
                alert('Guest data reset complete! Visit count will increment on page reloads or after 5+ minute gaps between interactions.');
              }
            }}
            style={{
              padding: '10px 20px',
              backgroundColor: '#ffc107',
              color: 'black',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            🔄 Reset Guest Data
          </button>

          {/* <button
            onClick={loadVisitorData}
            style={{
              padding: '10px 20px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            🔄 Refresh Visitors
          </button> */}

          <button
            onClick={async () => {
              if (selectedScreenshot) {
                console.log('🔥 Loading heatmap data for instant display from database for', selectedScreenshot.url);
                setLoading(true);

                try {
                  // Load heatmap data from database instead of localStorage
                  const heatmapData = await heatmapService.loadHeatmapData(selectedScreenshot.url);

                  if (heatmapData && heatmapData.data && heatmapData.data.length > 0) {
                    showInstantHeatmap(heatmapData);
                    setError(null);
                    console.log(`✅ Displaying ${heatmapData.data.length} interaction points instantly from database`);
                  } else {
                    // Check localStorage as fallback
                    const localData = heatmapService.getLocalHeatmapData(selectedScreenshot.url);
                    if (localData && localData.length > 0) {
                      console.log('📦 Found localStorage data, using as fallback...');
                      const data = { data: localData };
                      showInstantHeatmap(data);
                      setError(null);
                      console.log(`✅ Displaying ${localData.length} interaction points instantly from localStorage`);
                    } else {
                      const message = heatmapData?.message || `No interaction data found for ${selectedScreenshot.url}. Visit this page and interact with it first.`;
                      setError(message);
                      clearHeatmapOverlay();
                    }
                  }
                } catch (error) {
                  console.error('Error loading heatmap data:', error);
                  setError('Failed to load heatmap data: ' + error.message);
                } finally {
                  setLoading(false);
                }
              }
            }}
            disabled={!selectedScreenshot || isAnimating}
            style={{
              padding: '10px 20px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            🔥 Show Heatmap
          </button>

          <button
            onClick={async () => {
              if (selectedScreenshot) {
                console.log('🎬 Loading heatmap data for animated display from database for', selectedScreenshot.url);
                setLoading(true);

                try {
                  // Load heatmap data from database instead of localStorage
                  const heatmapData = await heatmapService.loadHeatmapData(selectedScreenshot.url);

                  if (heatmapData && heatmapData.data && heatmapData.data.length > 0) {
                    showAnimatedHeatmap(heatmapData);
                    setError(null);
                    console.log(`✅ Displaying ${heatmapData.data.length} interaction points with animation from database`);
                  } else {
                    // Check localStorage as fallback
                    const localData = heatmapService.getLocalHeatmapData(selectedScreenshot.url);
                    if (localData && localData.length > 0) {
                      console.log('📦 Found localStorage data, using as fallback...');
                      const data = { data: localData };
                      showAnimatedHeatmap(data);
                      setError(null);
                      console.log(`✅ Displaying ${localData.length} interaction points with animation from localStorage`);
                    } else {
                      const message = heatmapData?.message || `No interaction data found for ${selectedScreenshot.url}. Visit this page and interact with it first.`;
                      setError(message);
                      clearHeatmapOverlay();
                    }
                  }
                } catch (error) {
                  console.error('Error loading heatmap data:', error);
                  setError('Failed to load heatmap data: ' + error.message);
                } finally {
                  setLoading(false);
                }
              }
            }}
            disabled={!selectedScreenshot || isAnimating}
            style={{
              padding: '10px 20px',
              backgroundColor: '#17a2b8',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            🎬 Show Animated Heatmap
          </button>

          {isAnimating && (
            <button
              onClick={stopAnimation}
              style={{
                padding: '10px 20px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              🛑 Stop Animation
            </button>
          )}

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            marginTop: '10px',
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500' }}>Animation Speed:</label>
              <input
                type="range"
                min="0.5"
                max="5"
                step="0.5"
                value={animationSpeed}
                onChange={(e) => setAnimationSpeed(parseFloat(e.target.value))}
                disabled={isAnimating}
                style={{ width: '100px' }}
              />
              <span style={{ fontSize: '14px', color: '#6c757d' }}>{animationSpeed}x</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <input
                type="checkbox"
                id="soundEnabled"
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
                disabled={isAnimating}
              />
              <label htmlFor="soundEnabled" style={{ fontSize: '14px', cursor: 'pointer' }}>
                🔊 Sound Effects
              </label>
            </div>
          </div>

          {isAnimating && (
            <div style={{
              marginTop: '10px',
              padding: '10px',
              backgroundColor: '#e3f2fd',
              border: '1px solid #2196f3',
              borderRadius: '4px'
            }}>
              <div style={{ fontSize: '14px', marginBottom: '5px' }}>
                🎬 Animation Progress: {Math.round(animationProgress)}%
              </div>
              <div style={{
                width: '100%',
                height: '8px',
                backgroundColor: '#e0e0e0',
                borderRadius: '4px',
                overflow: 'hidden',
                marginBottom: '10px'
              }}>
                <div style={{
                  height: '100%',
                  width: `${animationProgress}%`,
                  backgroundColor: '#2196f3',
                  transition: 'width 0.3s ease'
                }} />
              </div>

              <div style={{
                display: 'flex',
                gap: '15px',
                fontSize: '12px',
                color: '#666'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    border: '2px solid #ff4444',
                    backgroundColor: 'rgba(255, 68, 68, 0.2)'
                  }} />
                  <span>🖱️ Clicks</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    border: '2px solid #44ff44',
                    backgroundColor: 'rgba(68, 255, 68, 0.2)'
                  }} />
                  <span>👆 Mouse Movement</span>
                </div>
              </div>
            </div>
          )}

          {!isAnimating && heatmapData && heatmapData.data && heatmapData.data.length > 0 && (
            <div style={{
              marginTop: '10px',
              padding: '8px',
              backgroundColor: '#f8f9fa',
              border: '1px solid #dee2e6',
              borderRadius: '4px',
              fontSize: '12px',
              color: '#666'
            }}>
              💡 <strong>Tip:</strong> Use "Show Heatmap" to see all interactions instantly, or "Show Animated Heatmap" to watch them appear with original timing. Screenshot auto-scrolls vertically during animation.
            </div>
          )}

        </div>

        {screenshots.length === 0 && (
          <div style={{
            marginTop: '15px',
            padding: '15px',
            backgroundColor: '#fff3cd',
            border: '1px solid #ffeaa7',
            borderRadius: '4px',
            color: '#856404'
          }}>
            No screenshots available
          </div>
        )}
      </div>

      {/* {error && (
        <div style={{
          padding: '10px',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          border: '1px solid #f5c6cb',
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          {error}
        </div>
      )} */}

      {/* Page Heatmap Analysis */}
      <div style={{
        backgroundColor: '#e8f5e8',
        border: '1px solid #4caf50',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '20px'
      }}>
        <h3>🔥Page Heatmap Analysis</h3>
        <p style={{marginBottom: '10px', marginTop: '10px'}}>View visitor interactions overlaid on screenshots</p>

        {screenshots.length > 0 ? (
          <div>
            <div style={{ marginBottom: '15px' }} className='pageSelectWrap'>
              <label style={{ marginRight: '10px', fontWeight: '500' }}>Select Page:</label>
              <select
                value={selectedScreenshot?.url || ''}
                onChange={(e) => {
                  const screenshot = screenshots.find(s => s.url === e.target.value);
                  setSelectedScreenshot(screenshot);
                }}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                  minWidth: '200px'
                }}
              >
                <option value="">Choose a page...</option>
                {screenshots.map((screenshot, index) => (
                  <option key={index} value={screenshot.url}>
                    {screenshot.url} ({formatDate(screenshot.timestamp)})
                  </option>
                ))}
              </select>
            </div>

            {selectedScreenshot && (
              <div id="screenshot-viewport" style={{
                  border: '2px solid #4caf50',
                  borderRadius: '8px',
                  overflowX: 'hidden',
                  overflowY: 'auto',
                  position: 'relative',
                  backgroundColor: '#fff',
                  maxWidth: '100%',
                  height: 'auto',
                  display: 'block'
                }}>
                {/* Page Screenshot */}
                <img
                  id="screenshot-image"
                  src={selectedScreenshot.dataUrl}
                  alt={`Screenshot of ${selectedScreenshot.url}`}
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block'
                  }}
                  onLoad={() => {
                    // Only load heatmap data, don't track page visits
                    // This is just displaying a screenshot, not an actual page visit
                    console.log('📸 Screenshot image loaded, displaying heatmap overlay');
                  }}
                />

                {/* Heatmap Overlay Container */}
                <div
                  ref={heatmapContainerRef}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none',
                    zIndex: 10
                  }}
                />

                {/* Loading Indicator */}
                {loading && (
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    padding: '20px',
                    borderRadius: '8px',
                    textAlign: 'center',
                    zIndex: 20
                  }}>
                    <div>Loading heatmap data...</div>
                  </div>
                )}

                {/* Interaction Stats */}
                {heatmapData && heatmapData.data && heatmapData.data.length > 0 && (
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    backgroundColor: 'rgba(76, 175, 80, 0.9)',
                    padding: '10px',
                    borderRadius: '4px',
                    fontSize: '14px',
                    color: 'white',
                    zIndex: 20
                  }}>
                    {heatmapData.data.length} interactions found
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div style={{
            padding: '30px',
            textAlign: 'center',
            backgroundColor: '#fff3cd',
            borderRadius: '4px',
            border: '1px solid #ffeaa7',
            color: '#856404'
          }}>
            <div style={{ fontSize: '18px', marginBottom: '10px' }}>📸 No page screenshots yet</div>
            <div>Visit some pages on your website to automatically capture screenshots for heatmap analysis.</div>
          </div>
        )}
      </div>

      {/* Visitor Analytics Section */}
      <div style={{
        backgroundColor: '#f8f9fa',
        border: '1px solid #dee2e6',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '20px'
      }}>
        <h3>👥 Recent Visitors</h3>
        {visitorData.length > 0 ? (
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {visitorData.slice(0, 10).map((visitor, index) => (
              <div key={index} style={{
                backgroundColor: 'white',
                border: '1px solid #dee2e6',
                borderRadius: '4px',
                padding: '12px',
                marginBottom: '8px',
                fontSize: '14px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div><strong>👤 User:</strong> {visitor.user?.userEmail || visitor.user?.userId || 'Guest'}</div>
                    <div><strong>📄 Page:</strong> {visitor.page}</div>
                    <div><strong>🕒 Time:</strong> {formatDate(visitor.timestamp)}</div>
                    <div><strong>💻 Device:</strong> {formatDeviceInfo(visitor.device)}</div>
                    {visitor.referrer && (
                      <div><strong>🔗 Referrer:</strong> {visitor.referrer}</div>
                    )}
                  </div>
                  <div style={{
                    backgroundColor: visitor.user?.isAuthenticated ? '#28a745' : '#6c757d',
                    color: 'white',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}>
                    {visitor.user?.isAuthenticated ? 'Logged In' : 'Guest'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            padding: '20px',
            textAlign: 'center',
            color: '#6c757d',
            backgroundColor: 'white',
            borderRadius: '4px',
            border: '1px solid #dee2e6'
          }}>
            No visitor data available yet. Visit some pages to see visitor information.
          </div>
        )}

        <div style={{ marginTop: '15px', fontSize: '14px', color: '#6c757d' }}>
          Total visits: {visitorData.length} | Showing recent 10 visits
        </div>
      </div>




    </div>
  );
};

export default HeatmapIntegration;