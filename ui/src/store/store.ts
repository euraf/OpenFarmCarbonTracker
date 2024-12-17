import { createEffect, createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import { CountryCode } from "~/util/countries";

export type SimpleTier1LPISSegment = {
  LPIS_ID?: number;
  years?: number;
};

export type FixedSplitRotation = {
  splitTreePercent: number;
  cropSegments: SimpleTier1LPISSegment[];
  treeSegments: SimpleTier1LPISSegment[];
};

export type Rotation = FixedSplitRotation;

export type Field = {
  uuid: string;
  name: string;
  area?: number;
  geometry?: string;
  rotations?: Rotation[];
  repeatLastRotation: boolean;
};

export type BuildingOrEquipment = {
  name: string;
  year: number;
  emission: number;
};

export type FeedRecord = {
  label: string;
  kgsFeed: number;
  year: number;
  emissionPerKg: number;
};

export type PigProductionConfig = {
  farrowing: {
    completed: number;
    emissionFactor: number;
  };
  nursery: {
    completed: number;
    emissionFactor: number;
  };
  finishers: {
    completed: number;
    emissionFactor: number;
  };
  sows: {
    count: number;
    emissionFactor: number;
  };
  boars: {
    count: number;
    emissionFactor: number;
  };
};

export type CattleProductionConfig = {
  dairyCows: {
    count: number;
    emissionFactor: number;
  };
  bulls: {
    count: number;
    emissionFactor: number;
  };
  meatCattle: {
    completed: number;
    emissionFactor: number;
  };
};

export type ChickenProductionConfig = {
  broilers: {
    completed: number;
    emissionFactor: number;
  };
  eggLayingHens: {
    count: number;
    emissionFactor: number;
  };
};

export type Livestock = {
  pigs: {
    feed: FeedRecord[];
    production: {
      configurations: {
        year: number;
        config: PigProductionConfig;
      }[];
    };
  };
  cattle: {
    feed: FeedRecord[];
    production: {
      configurations: {
        year: number;
        config: CattleProductionConfig;
      }[];
    };
  };
  chicken: {
    feed: FeedRecord[];
    production: {
      configurations: {
        year: number;
        config: ChickenProductionConfig;
      }[];
    };
  };
};

const DEFAULT_PIG_EMISSION_FACTORS = {
  farrowing: 0.8,
  nursery: 1.2,
  finishers: 2.5,
  sows: 4.2,
  boars: 3.8
};

const DEFAULT_CATTLE_EMISSION_FACTORS = {
  dairyCows: 3500,
  bulls: 2800,
  meatCattle: 2200
};

const DEFAULT_CHICKEN_EMISSION_FACTORS = {
  broilers: 2.5,
  eggLayingHens: 4.2
};

export const DEFAULT_PIG_PRODUCTION_CONFIG: PigProductionConfig = {
  farrowing: {
    completed: 0,
    emissionFactor: DEFAULT_PIG_EMISSION_FACTORS.farrowing
  },
  nursery: {
    completed: 0,
    emissionFactor: DEFAULT_PIG_EMISSION_FACTORS.nursery
  },
  finishers: {
    completed: 0,
    emissionFactor: DEFAULT_PIG_EMISSION_FACTORS.finishers
  },
  sows: {
    count: 0,
    emissionFactor: DEFAULT_PIG_EMISSION_FACTORS.sows
  },
  boars: {
    count: 0,
    emissionFactor: DEFAULT_PIG_EMISSION_FACTORS.boars
  }
};

export const DEFAULT_CATTLE_PRODUCTION_CONFIG: CattleProductionConfig = {
  dairyCows: { count: 0, emissionFactor: DEFAULT_CATTLE_EMISSION_FACTORS.dairyCows },
  bulls: { count: 0, emissionFactor: DEFAULT_CATTLE_EMISSION_FACTORS.bulls },
  meatCattle: { completed: 0, emissionFactor: DEFAULT_CATTLE_EMISSION_FACTORS.meatCattle }
};

export const DEFAULT_CHICKEN_PRODUCTION_CONFIG: ChickenProductionConfig = {
  broilers: { completed: 0, emissionFactor: DEFAULT_CHICKEN_EMISSION_FACTORS.broilers },
  eggLayingHens: { count: 0, emissionFactor: DEFAULT_CHICKEN_EMISSION_FACTORS.eggLayingHens }
};

const DEFAULT_CATTLE_STORE = {
  feed: [],
  production: {
    configurations: [{
      year: new Date().getFullYear(),
      config: DEFAULT_CATTLE_PRODUCTION_CONFIG
    }]
  }
};

const DEFAULT_CHICKEN_STORE = {
  feed: [],
  production: {
    configurations: [{
      year: new Date().getFullYear(),
      config: DEFAULT_CHICKEN_PRODUCTION_CONFIG
    }]
  }
};

const DEFAULT_PIG_STORE = {
  feed: [],
  production: {
    configurations: [{
      year: new Date().getFullYear(),
      config: DEFAULT_PIG_PRODUCTION_CONFIG
    }]
  }
};

const lsStore = JSON.parse(
  localStorage.getItem("store") ?? JSON.stringify(initStore()),
);

function validateStore(store: any) {
  if (!store.livestock) {
    store.livestock = { 
      pigs: DEFAULT_PIG_STORE, 
      cattle: DEFAULT_CATTLE_STORE, 
      chicken: DEFAULT_CHICKEN_STORE 
    };
  } else {
    // Ensure pigs object exists
    store.livestock.pigs = store.livestock.pigs || {};
    
    // Ensure production structure exists
    store.livestock.pigs.production = store.livestock.pigs.production || {};
    
    // Migrate old pig production format to new year-based format
    if (store.livestock?.pigs?.production && !store.livestock.pigs.production.configurations) {
      const currentYear = store.startYear || new Date().getFullYear();
      const oldConfig = store.livestock.pigs.production;
      store.livestock.pigs.production = {
        configurations: [{
          year: currentYear,
          config: {
            farrowing: oldConfig.farrowing,
            nursery: oldConfig.nursery,
            finishers: oldConfig.finishers,
            sows: oldConfig.sows,
            boars: oldConfig.boars
          }
        }]
      };
    }

    // Ensure feed array exists
    store.livestock.pigs.feed = Array.isArray(store.livestock.pigs.feed) ? store.livestock.pigs.feed : [];
    
    store.livestock.cattle = store.livestock.cattle || {};
    store.livestock.chicken = store.livestock.chicken || {};
  }

  // Validate cattle more thoroughly
  if (!store.livestock.cattle) store.livestock.cattle = DEFAULT_CATTLE_STORE;
  if (!store.livestock.cattle.feed) store.livestock.cattle.feed = [];
  if (!store.livestock.cattle.production) store.livestock.cattle.production = DEFAULT_CATTLE_STORE.production;
  
  // Migrate old cattle production format to new year-based format
  if (store.livestock?.cattle?.production && !store.livestock.cattle.production.configurations) {
    const currentYear = store.startYear || new Date().getFullYear();
    const oldConfig = store.livestock.cattle.production;
    store.livestock.cattle.production = {
      configurations: [{
        year: currentYear,
        config: {
          dairyCows: oldConfig.dairyCows,
          bulls: oldConfig.bulls,
          meatCattle: oldConfig.meatCattle
        }
      }]
    };
  }

  // Validate cattle production categories
  const cattleProd = store.livestock.cattle.production;
  for (const category of ['dairyCows', 'bulls']) {
    cattleProd[category] = {
      count: Number(cattleProd[category]?.count || 0),
      emissionFactor: Number(cattleProd[category]?.emissionFactor || DEFAULT_CATTLE_EMISSION_FACTORS[category as 'dairyCows' | 'bulls'])
    };
  }
  
  cattleProd.meatCattle = {
    completed: Number(cattleProd.meatCattle?.completed || 0),
    emissionFactor: Number(cattleProd.meatCattle?.emissionFactor || DEFAULT_CATTLE_EMISSION_FACTORS.meatCattle)
  };

  // Validate chicken more thoroughly
  if (!store.livestock.chicken) store.livestock.chicken = DEFAULT_CHICKEN_STORE;
  if (!store.livestock.chicken.feed) store.livestock.chicken.feed = [];
  if (!store.livestock.chicken.production) store.livestock.chicken.production = DEFAULT_CHICKEN_STORE.production;

  // Migrate old chicken production format to new year-based format
  if (store.livestock?.chicken?.production && !store.livestock.chicken.production.configurations) {
    const currentYear = store.startYear || new Date().getFullYear();
    const oldConfig = store.livestock.chicken.production;
    store.livestock.chicken.production = {
      configurations: [{
        year: currentYear,
        config: {
          broilers: oldConfig.broilers,
          eggLayingHens: oldConfig.eggLayingHens
        }
      }]
    };
  }

  // Validate chicken production categories
  const chickenProd = store.livestock.chicken.production;
  chickenProd.broilers = {
    completed: Number(chickenProd.broilers?.completed || 0),
    emissionFactor: Number(chickenProd.broilers?.emissionFactor || DEFAULT_CHICKEN_EMISSION_FACTORS.broilers)
  };
  
  chickenProd.eggLayingHens = {
    count: Number(chickenProd.eggLayingHens?.count || 0),
    emissionFactor: Number(chickenProd.eggLayingHens?.emissionFactor || DEFAULT_CHICKEN_EMISSION_FACTORS.eggLayingHens)
  };

  return store;
}

export const [store, setStore] = createStore<
  {
    fields: Field[];
    startYear: number;
    country: CountryCode;
    energyAndFuel: {
      diesel?: number;
      coal?: number;
      biogas?: number;
      electricity?: number;
    };
    livestock: Livestock;
    buildings: BuildingOrEquipment[];
    equipment: BuildingOrEquipment[];
  }
>(validateStore(lsStore));

createEffect(() => {
  localStorage.setItem("store", JSON.stringify(store));
});

export function initStore() {
  return { 
    fields: [], 
    startYear: new Date().getFullYear(),
    country: undefined, 
    energyAndFuel: {}, 
    livestock: { 
      pigs: DEFAULT_PIG_STORE, 
      cattle: {}, 
      chicken: {} 
    },
    buildings: [], 
    equipment: [] 
  };
}
