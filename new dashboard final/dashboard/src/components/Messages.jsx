import { useEffect, useState } from "react";
import api from "../api/axios.js";
import { toast } from "react-toastify";

export default function Messages() {
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        setLoading(true);
        setError("");

        // ✅ FIX: correct endpoint
        const { data } = await api.get("/message/getall");

        if (isMounted) {
          setMessages(Array.isArray(data?.messages) ? data.messages : []);
        }
      } catch (err) {
        const msg =
          err?.response?.data?.message || err?.message || "Failed to fetch messages";
        setError(msg);
        toast.error(msg);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">MESSAGE</h1>

      {loading && <p>Loading…</p>}

      {!loading && error && (
        <p className="text-red-600 font-medium">Error: {error}</p>
      )}

      {!loading && !error && messages.length === 0 && <p>No Messages!</p>}

      {!loading && !error && messages.length > 0 && (
        <ul className="space-y-4">
          {messages.map((m) => (
            <li key={m._id} className="rounded-xl p-4 shadow border bg-white">
              <div className="flex justify-between items-center">
                <div className="font-semibold">
                  {m.firstName} {m.lastName}
                </div>
                <div className="text-sm opacity-70">
                  {m.createdAt ? new Date(m.createdAt).toLocaleString() : ""}
                </div>
              </div>
              <div className="text-sm opacity-80">
                {m.email}{m.phone ? ` · ${m.phone}` : ""}
              </div>
              <p className="mt-2">{m.message}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
