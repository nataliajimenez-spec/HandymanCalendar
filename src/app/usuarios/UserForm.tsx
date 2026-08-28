"use client";

import { useRef, useState, useTransition } from "react";
import { createUser } from "./actions";

export function UserForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    setSuccess(false);
    startTransition(async () => {
      const result = await createUser(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        formRef.current?.reset();
      }
    });
  }

  return (
    <form
      ref={formRef}
      action={handleSubmit}
      className="card p-4 space-y-3 max-w-md"
    >
      <h2 className="font-medium">Crear usuario</h2>

      {error && (
        <div className="alert-error">
          {error}
        </div>
      )}
      {success && (
        <div className="alert-success">
          Usuario creado.
        </div>
      )}

      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor="name">
          Nombre
        </label>
        <input id="name" name="name" required className="input-field" />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="input-field"
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor="password">
          Contraseña temporal
        </label>
        <input
          id="password"
          name="password"
          type="text"
          required
          minLength={8}
          placeholder="Mínimo 8 caracteres"
          className="input-field"
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor="role">
          Rol
        </label>
        <select id="role" name="role" className="input-field">
          <option value="HANDYMAN">Handyman</option>
          <option value="OFICINA">Oficina</option>
          <option value="ADMIN">Administrador</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full btn-primary"
      >
        {isPending ? "Creando..." : "Crear usuario"}
      </button>
    </form>
  );
}
