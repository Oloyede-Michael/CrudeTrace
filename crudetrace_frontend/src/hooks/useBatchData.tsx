import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useContract } from './useContract';

export interface BatchData {
  volumeLoaded: string;
  volumeDelivered: string;
  timestampLoaded: number;
  timestampDelivered: number;
  batchValue: string;
  status: number;
}

export const useBatchData = (batchId: number) => {
  const [batch, setBatch] = useState<BatchData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { crudeTrace } = useContract();

  const fetchBatch = async () => {
    if (!crudeTrace || batchId === null || batchId === undefined) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const data = await crudeTrace.batches(batchId);
      
      setBatch({
        volumeLoaded: data.volumeLoaded.toString(),
        volumeDelivered: data.volumeDelivered.toString(),
        timestampLoaded: Number(data.timestampLoaded),
        timestampDelivered: Number(data.timestampDelivered),
        batchValue: ethers.formatUnits(data.batchValue, 18),
        status: Number(data.status)
      });
    } catch (err) {
      console.error(`Error fetching batch ${batchId}:`, err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [batchId, crudeTrace]);

  return { batch, loading, refetch: fetchBatch };
};
