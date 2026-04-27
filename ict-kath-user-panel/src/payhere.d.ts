declare global {
    interface Window {
      payhere: {
        startPayment: (payment: Record<string, any>) => void;
        onCompleted: (callback: (orderId: string) => void) => void;
        onDismissed: () => void;
        onError: (callback: (error: any) => void) => void;
      };
    }
  }
  
  export {};
  