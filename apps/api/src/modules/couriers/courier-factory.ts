export class CourierFactory {
  getAdapter(adapterKey: string) {
    return {
      createShipment: async (data: any, creds: any) => ({
        trackingNumber: 'TRACK-' + Date.now(),
      }),
      getTracking: async (trackingNumber: string, creds: any) => ({
        status: 'IN_TRANSIT',
        events: [],
      }),
      cancelShipment: async (id: string, creds: any) => ({
        cancelled: true,
      }),
      generateLabel: async (id: string, creds: any) => ({
        url: null,
      }),
    };
  }
}