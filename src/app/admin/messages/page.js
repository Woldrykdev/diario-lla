"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function MensajesPage() {
  const router = useRouter();
  const [mensajes, setMensajes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserAndLoad = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error) {
        setMensajes(data);
      }

      setLoading(false);
    };

    checkUserAndLoad();
  }, [router]);

  if (loading) return <p style={{ padding: 40 }}>Cargando...</p>;

  return (
    <>
      <div className="container">
        <h1 className="title">Mensajes recibidos</h1>

        {mensajes.length === 0 && (
          <p className="empty">No hay mensajes todavía.</p>
        )}

        <div className="grid">
          {mensajes.map((msg) => (
            <div key={msg.id} className="card">
              <div className="cardHeader">
                <h3>{msg.nombre}</h3>
                <span>{msg.email}</span>
              </div>

              <p className="message">{msg.mensaje}</p>

              <div className="date">
                {new Date(msg.created_at).toLocaleString("es-AR")}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .container {
          max-width: 1100px;
          margin: 60px auto;
          padding: 0 20px;
        }

        .title {
          font-size: 28px;
          font-weight: 800;
          margin-bottom: 30px;
        }

        .empty {
          color: #777;
        }

        .grid {
          display: grid;
          gap: 20px;
        }

        .card {
          background: white;
          padding: 25px;
          border-radius: 14px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.08);
          border: 1px solid #eee;
        }

        .cardHeader {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }

        .cardHeader h3 {
          margin: 0;
          font-size: 18px;
        }

        .cardHeader span {
          font-size: 14px;
          color: #666;
        }

        .message {
          font-size: 15px;
          line-height: 1.6;
          margin-bottom: 15px;
        }

        .date {
          font-size: 12px;
          color: #888;
          text-align: right;
        }

        @media (max-width: 768px) {
          .cardHeader {
            flex-direction: column;
            align-items: flex-start;
            gap: 5px;
          }
        }
      `}</style>
    </>
  );
}