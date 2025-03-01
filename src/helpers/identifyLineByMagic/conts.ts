type WellKnownLine = {
  id: string;
  name: string;
  operator?: string;
  stations: number[];
};

export const WELL_KNOWN_LINES: WellKnownLine[] = [
  {
    id: '4-tdhs-1',
    name: 'S 1',
    operator: 's-bahn-hannover-transdev',
    stations: [8000152, 8000252, 8002634],
  },
  {
    id: '4-tdhs-2',
    name: 'S 2',
    operator: 's-bahn-hannover-transdev',
    stations: [8000279, 8002634],
  },
  {
    id: '4-tdhs-3',
    name: 'S 3',
    operator: 's-bahn-hannover-transdev',
    stations: [8000152, 8000169],
  },
  {
    id: '4-tdhs-4',
    name: 'S 4',
    operator: 's-bahn-hannover-transdev',
    stations: [8000871, 8000169, 8000152],
  },
  {
    id: '4-tdhs-5',
    name: 'S 5',
    operator: 's-bahn-hannover-transdev',
    stations: [8000152, 8002589, 8000297, 8000148],
  },
  {
    id: '4-tdhs-6',
    name: 'S 6',
    operator: 's-bahn-hannover-transdev',
    stations: [8000152, 8000064],
  },
  {
    id: '4-tdhs-7',
    name: 'S 7',
    operator: 's-bahn-hannover-transdev',
    stations: [8000152, 8000064],
  },
  {
    id: '8-webuet-1',
    name: 'STB 1',
    operator: 'ustra-hannoversche-verkehrsbetriebe-ag',
    stations: [614078, 616282, 638683, 638700, 638766, 638767],
  },
  {
    id: '8-webuet-2',
    name: 'STB 2',
    operator: 'ustra-hannoversche-verkehrsbetriebe-ag',
    stations: [638354, 638335, 617053, 638538],
  },
  {
    id: '8-webuet-3',
    name: 'STB 3',
    operator: 'ustra-hannoversche-verkehrsbetriebe-ag',
    stations: [617153, 636293, 638601],
  },
  {
    id: '8-webuet-4',
    name: 'STB 4',
    operator: 'ustra-hannoversche-verkehrsbetriebe-ag',
    stations: [614062, 638543, 638330],
  },
  {
    id: '8-webuet-5',
    name: 'STB 5',
    operator: 'ustra-hannoversche-verkehrsbetriebe-ag',
    stations: [635114, 638572, 638573, 635180],
  },
  {
    id: '8-webuet-6',
    name: 'STB 6',
    operator: 'ustra-hannoversche-verkehrsbetriebe-ag',
    stations: [638530, 638952, 617220, 617262],
  },
  {
    id: '8-webuet-7',
    name: 'STB 7',
    operator: 'ustra-hannoversche-verkehrsbetriebe-ag',
    stations: [372501, 627416, 638601],
  },
  {
    id: '8-webuet-8',
    name: 'STB 8',
    operator: 'ustra-hannoversche-verkehrsbetriebe-ag',
    stations: [614122, 638428, 638427, 636229],
  },
  {
    id: '8-webuet-9',
    name: 'STB 9',
    operator: 'ustra-hannoversche-verkehrsbetriebe-ag',
    stations: [638429, 638321, 614146, 638430],
  },
  {
    id: '8-webuet-10',
    name: 'STB 10',
    operator: 'ustra-hannoversche-verkehrsbetriebe-ag',
    stations: [628410, 638198, 616297],
  },
  {
    id: '8-webuet-11',
    name: 'STB 11',
    operator: 'ustra-hannoversche-verkehrsbetriebe-ag',
    stations: [638420, 638972],
  },
  {
    id: '8-webuet-13',
    name: 'STB 13',
    operator: 'ustra-hannoversche-verkehrsbetriebe-ag',
    stations: [105323, 614136, 638403],
  },
  {
    id: 'wfb-re60',
    name: 'WFB RE60',
    operator: 'westfalenbahn',
    stations: [8000049, 8000294, 8000316],
  },
  {
    id: 'wfb-re70',
    name: 'WFB RE70',
    operator: 'westfalenbahn',
    stations: [8000049, 8000252, 8000036, 8000152],
  },
];
