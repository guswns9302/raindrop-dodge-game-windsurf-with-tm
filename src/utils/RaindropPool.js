// Object Pooling 패턴을 사용한 물방울 관리 클래스
// 메모리 효율성을 위해 물방울 객체를 재사용합니다

class RaindropPool {
  constructor(initialSize = 100) {
    this.pool = []; // 비활성 물방울 풀
    this.activeDrops = []; // 활성 물방울 배열
    this.maxPoolSize = initialSize * 2; // 최대 풀 크기
    
    // 초기 풀 생성
    this.initializePool(initialSize);
  }
  
  // 초기 물방울 풀 생성
  initializePool(size) {
    for (let i = 0; i < size; i++) {
      this.pool.push(this.createDropletObject());
    }
  }
  
  // 새로운 물방울 객체 생성
  createDropletObject() {
    return {
      id: 0,
      x: 0,
      y: 0,
      size: 15,
      speed: 2,
      color: '#4FC3F7',
      active: false,
      createdAt: 0
    };
  }
  
  // 풀에서 물방울 가져오기
  getDroplet(x, y, size, speed, color) {
    let droplet;
    
    if (this.pool.length > 0) {
      // 풀에서 재사용
      droplet = this.pool.pop();
    } else {
      // 풀이 비어있으면 새로 생성
      droplet = this.createDropletObject();
      console.log('[RaindropPool] 풀 부족으로 새 객체 생성');
    }
    
    // 물방울 속성 초기화
    droplet.id = Date.now() + Math.random();
    droplet.x = x;
    droplet.y = y;
    droplet.size = size;
    droplet.speed = speed;
    droplet.color = color;
    droplet.active = true;
    droplet.createdAt = Date.now();
    
    this.activeDrops.push(droplet);
    return droplet;
  }
  
  // 물방울을 풀로 반환
  releaseDroplet(droplet) {
    if (!droplet || !droplet.active) return;
    
    // 활성 배열에서 제거
    const index = this.activeDrops.indexOf(droplet);
    if (index > -1) {
      this.activeDrops.splice(index, 1);
    }
    
    // 객체 초기화 후 풀로 반환
    droplet.active = false;
    droplet.x = 0;
    droplet.y = 0;
    droplet.id = 0;
    
    // 풀 크기 제한 확인
    if (this.pool.length < this.maxPoolSize) {
      this.pool.push(droplet);
    }
    // 풀이 가득 차면 객체를 버림 (GC가 처리)
  }
  
  // 여러 물방울을 한 번에 반환
  releaseMultipleDroplets(droplets) {
    droplets.forEach(droplet => this.releaseDroplet(droplet));
  }
  
  // 조건에 맞는 물방울들을 필터링하고 나머지는 반환
  filterAndRelease(filterFn) {
    const remaining = [];
    const toRelease = [];
    
    this.activeDrops.forEach(droplet => {
      if (filterFn(droplet)) {
        remaining.push(droplet);
      } else {
        toRelease.push(droplet);
      }
    });
    
    // 제거할 물방울들을 풀로 반환
    toRelease.forEach(droplet => {
      droplet.active = false;
      droplet.x = 0;
      droplet.y = 0;
      droplet.id = 0;
      
      if (this.pool.length < this.maxPoolSize) {
        this.pool.push(droplet);
      }
    });
    
    // 활성 배열 업데이트
    this.activeDrops = remaining;
    
    return remaining;
  }
  
  // 모든 활성 물방울 가져오기
  getActiveDroplets() {
    return this.activeDrops;
  }
  
  // 풀 상태 정보
  getPoolStats() {
    return {
      poolSize: this.pool.length,
      activeCount: this.activeDrops.length,
      totalAllocated: this.pool.length + this.activeDrops.length,
      maxPoolSize: this.maxPoolSize
    };
  }
  
  // 풀 정리 (메모리 최적화)
  cleanup() {
    // 모든 활성 물방울을 풀로 반환
    this.activeDrops.forEach(droplet => {
      droplet.active = false;
      droplet.x = 0;
      droplet.y = 0;
      droplet.id = 0;
    });
    
    this.pool.push(...this.activeDrops);
    this.activeDrops = [];
    
    // 풀 크기가 너무 크면 일부 제거
    if (this.pool.length > this.maxPoolSize) {
      this.pool.splice(this.maxPoolSize);
    }
  }
}

export default RaindropPool;
