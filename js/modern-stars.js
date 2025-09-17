// 定义全局变量layers
const layers = [
    { count: 200, size: 1, speed: 50 },
    { count: 100, size: 2, speed: 100 },
    { count: 50, size: 3, speed: 150 }
  ];
  
  const createStarryBackground = () => {
    const starContainer = document.createDocumentFragment();
  
    layers.forEach(({ count, size, speed }) => {
      const starLayer = document.createElement('div');
      starLayer.className = 'star-layer';
      starLayer.style.animationDuration = `${speed}s`;
      starLayer.style.width = `${size}px`;
      starLayer.style.height = `${size}px`;
  
      const boxShadow = Array.from({ length: count }, () => {
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * 2000;
        return `${x}px ${y}px #FFF`;
      }).join(',');
  
      starLayer.style.boxShadow = boxShadow;
      starContainer.appendChild(starLayer);
    });
  
    document.body.appendChild(starContainer);
  };
  
  const updateStarPositions = () => {
    document.querySelectorAll('.star-layer').forEach(starLayer => {
      const layer = layers.find(layer => 
        parseFloat(starLayer.style.width) === layer.size);
  
      if (layer) {
        const boxShadow = Array.from({ length: layer.count }, () => {
          const x = Math.random() * window.innerWidth;
          const y = Math.random() * 2000;
          return `${x}px ${y}px #FFF`;
        }).join(',');
  
        starLayer.style.boxShadow = boxShadow;
      }
    });
  };
  
  // 监听页面加载事件，创建星空背景
  window.addEventListener('load', createStarryBackground);
  
  // 监听窗口大小变化事件，更新星星位置
  window.addEventListener('resize', updateStarPositions);
  