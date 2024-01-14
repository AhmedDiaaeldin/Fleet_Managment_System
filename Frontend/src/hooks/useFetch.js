import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetch = (url, trigger) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(url);
        setData(response.data);
        setError(null);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, trigger]); // Dependency array includes 'trigger'

  return { data, loading, error };
};

export default useFetch;
