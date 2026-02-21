"use client";

import { useState } from "react";

export default function ContactForm() {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    mensaje: "",
  });

  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setStatus("success");
      setForm({ nombre: "", email: "", mensaje: "" });
    } else {
      setStatus("error");
    }
  };

  return (
    <>
      <section className="contactSection">
        <div className="contactCard">

          <h2 className="contactTitle">Enviarnos un mensaje</h2>

          <p className="contactText">
            Contacto para afiliaciones, propuestas o consultas.
          </p>

          <form className="contactForm" onSubmit={handleSubmit}>
            <input
              type="text"
              name="nombre"
              placeholder="Nombre y Apellido"
              value={form.nombre}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Correo electrónico"
              value={form.email}
              onChange={handleChange}
              required
            />

            <textarea
              name="mensaje"
              placeholder="Escribí tu mensaje aquí..."
              rows="5"
              value={form.mensaje}
              onChange={handleChange}
              required
            ></textarea>

            <button type="submit">
              {status === "loading" ? "Enviando..." : "Enviar mensaje"}
            </button>

            {status === "success" && (
              <p className="success">
                Mensaje enviado correctamente.
              </p>
            )}

            {status === "error" && (
              <p className="error">
                Ocurrió un error. Intentá nuevamente.
              </p>
            )}
          </form>
        </div>
      </section>

      <style jsx>{`
        .contactSection {
          margin: 120px 0 100px 0;
          display: flex;
          justify-content: center;
          padding: 0 20px;
        }

        .contactCard {
          width: 100%;
          max-width: 750px;
          background: #ffffff;
          padding: 50px 40px;
          border-radius: 18px;
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.08);
          border: 1px solid #eee;
        }

        .contactTitle {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 18px;
          color: #111;
        }

        .contactText {
          font-size: 15px;
          color: #555;
          margin-bottom: 30px;
          line-height: 1.7;
        }

        .contactForm {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .contactForm input,
        .contactForm textarea {
          padding: 14px 16px;
          border-radius: 10px;
          border: 1px solid #ddd;
          font-size: 14px;
          background: #fafafa;
          transition: all 0.2s ease;
        }

        .contactForm input:focus,
        .contactForm textarea:focus {
          outline: none;
          border-color: #b30000;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(179, 0, 0, 0.1);
        }

        .contactForm button {
          padding: 14px;
          border: none;
          border-radius: 10px;
          background: #38195c;
          color: white;
          font-weight: 600;
          font-size: 15px;
          cursor: pointer;
          transition: 0.2s ease;
        }

        .contactForm button:hover {
          transform: translateY(-2px);
        }

        .success {
          margin-top: 10px;
          color: green;
          font-weight: 500;
        }

        .error {
          margin-top: 10px;
          color: red;
          font-weight: 500;
        }

        /* RESPONSIVE */

        @media (max-width: 768px) {
          .contactCard {
            padding: 35px 25px;
          }

          .contactTitle {
            font-size: 22px;
          }

          .contactText {
            font-size: 14px;
          }

          .contactForm button {
            font-size: 14px;
          }
        }
      `}</style>
    </>
  );
}