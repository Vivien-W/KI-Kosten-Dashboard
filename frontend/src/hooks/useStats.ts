import { useEffect, useState } from "react";
import {
  fetchCostOverTime,
  fetchCostPerModel,
  fetchTokensPerModel,
  fetchSuccessVsError,
} from "../services/stats";

export function useStats() {
  const [loading, setLoading] = useState(true);

  const [costOverTime, setCostOverTime] = useState([]);
  const [costPerModel, setCostPerModel] = useState([]);
  const [tokensPerModel, setTokensPerModel] = useState([]);
  const [successRate, setSuccessRate] = useState([]);

  useEffect(() => {
    async function load() {
      setLoading(true);

      try {
        const [a, b, c, d] = await Promise.all([
          fetchCostOverTime(),
          fetchCostPerModel(),
          fetchTokensPerModel(),
          fetchSuccessVsError(),
        ]);

        setCostOverTime(a);
        setCostPerModel(b);
        setTokensPerModel(c);

        // d hat Struktur [{name:"Erfolgreich",value:..}, ...]
        setSuccessRate(d);
      } catch (err) {
        console.error("Fehler beim Laden der Statistik:", err);
      }

      setLoading(false);
    }

    load();
  }, []);

  return { loading, costOverTime, costPerModel, tokensPerModel, successRate };
}
